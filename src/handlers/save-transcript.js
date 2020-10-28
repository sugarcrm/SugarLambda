/*
 * Your installation or use of this SugarCRM file is subject to the applicable
 * terms available at
 * http://support.sugarcrm.com/Resources/Master_Subscription_Agreements/.
 * If you do not agree to all of the applicable terms or do not have the
 * authority to bind the entity as an authorized representative, then do not
 * install or use this SugarCRM file.
 *
 * Copyright (C) SugarCRM Inc. All rights reserved.
 */
const app = require('../core/app.js');
const s3Utils = require('../utils/aws/s3-utils');
const utils = require('../utils/utils');

/**
 * http status codes used in this function
 */
const { HttpStatus } = require('../utils/http-status.js');

/**
 * Function to update a call with transcript once the transcript is
 * uploaded to S3.
 *
 * @param {Object} event S3 Event that invokes this function
 */
const handler = async (event) => {
    // Log S3 Event to cloudwatch for debugging.
    console.log('Reading options from event:\n', JSON.stringify(event));

    // Fetch and process transcript from s3
    const transcript = await s3Utils.getJsonFromS3Event(event);
    console.log('Fetched transcript: \n', transcript);
    const processedTranscript = utils.processTranscript(transcript);

    // Fetch related call record from Sugar
    const connectContactId = transcript.CustomerMetadata.ContactId;
    let url = encodeURI(`Calls?filter[0][aws_contact_id]=${connectContactId}`);
    url = app.api.buildUrl(url);
    const response = await app.api.call('read', url);
    console.log('Initial Sugar API response', response);

    // If our response doesn't match exactly one call, the conditions for this function haven't
    // been met so return 412
    if (!response.data || !Array.isArray(response.data.records) || response.data.records.length !== 1) {
        return {
            status: HttpStatus.preconditionFailed,
            body: 'Unable to match trancsript to exactly one call record'
        };
    }

    // Update call record with readable transcript, return the result
    let callBean = app.data.createBean('Calls', response.data.records[0]);
    callBean.set('agent_transcript', processedTranscript);
    callBean.set('customer_transcript', processedTranscript);

    return await callBean.save();
};

exports.handler = handler;
