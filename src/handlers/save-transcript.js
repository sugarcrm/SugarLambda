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

/**
 * Utils
 */
const s3Utils = require('../utils/aws/s3-utils');
const utils = require('../utils/utils');
const loggerUtils = require('../utils/logger-utils');
const callRecordingUtils = require('../utils/sugar/call-record-utils');

/**
 * Defined constants
 */
const { HttpStatus } = require('../constants/http-status.js');
const ErrorMessages = require('../constants/messages/error');
const CallsConstants = require('../constants/sugar-modules/calls');

/**
 * Function to update a call with transcript once the transcript is
 * uploaded to S3.
 *
 * @param {Object} event S3 Event that invokes this function
 */
const handler = async (event) => {
    // Log S3 Event to cloudwatch for debugging.
    loggerUtils.logS3Event(event);

    // Fetch and process transcript from s3
    const transcript = await s3Utils.getJsonFromS3Event(event);
    console.log('Fetched Transcript: \n', transcript.Transcript);
    console.log('Fetched Sentiment: \n', transcript.ConversationCharacteristics.Sentiment);
    const processedTranscript = utils.processTranscript(transcript);

    // Fetch related call record from Sugar
    const connectContactId = transcript.CustomerMetadata.ContactId;
    let callRecord = await callRecordingUtils.getCallRecord(connectContactId);

    // If our response doesn't match exactly one call, the conditions for this function haven't
    // been met so return 412
    if (!callRecord) {
        return {
            status: HttpStatus.preconditionFailed,
            body: ErrorMessages.ERROR_MULTIPLE_CALL_RECORDS_IN_RESPONSE
        };
    }

    // Update call record with readable transcript, return the result
    let callBean = app.data.createBean('Calls', callRecord);
    callBean.set(CallsConstants.CALLS_TRANSCRIPT, processedTranscript);

    // update sentiment fields
    callBean.set(CallsConstants.CALLS_AWS_LENS_DATA, JSON.stringify(transcript));
    callBean.set(CallsConstants.CALLS_SENTIMENT_SCORE_AGENT, utils.getOverallScore(transcript, 'AGENT'));
    callBean.set(CallsConstants.CALLS_SENTIMENT_SCORE_CUSTOMER, utils.getOverallScore(transcript, 'CUSTOMER'));
    callBean.set(CallsConstants.CALLS_SENTIMENT_SCORE_AGENT_Q1, utils.getQuarterlyScore(transcript, 'AGENT', 0));
    callBean.set(CallsConstants.CALLS_SENTIMENT_SCORE_AGENT_Q2, utils.getQuarterlyScore(transcript, 'AGENT', 1));
    callBean.set(CallsConstants.CALLS_SENTIMENT_SCORE_AGENT_Q3, utils.getQuarterlyScore(transcript, 'AGENT', 2));
    callBean.set(CallsConstants.CALLS_SENTIMENT_SCORE_AGENT_Q4, utils.getQuarterlyScore(transcript, 'AGENT', 3));
    callBean.set(CallsConstants.CALLS_SENTIMENT_SCORE_CUSTOMER_Q1, utils.getQuarterlyScore(transcript, 'CUSTOMER', 0));
    callBean.set(CallsConstants.CALLS_SENTIMENT_SCORE_CUSTOMER_Q2, utils.getQuarterlyScore(transcript, 'CUSTOMER', 1));
    callBean.set(CallsConstants.CALLS_SENTIMENT_SCORE_CUSTOMER_Q3, utils.getQuarterlyScore(transcript, 'CUSTOMER', 2));
    callBean.set(CallsConstants.CALLS_SENTIMENT_SCORE_CUSTOMER_Q4, utils.getQuarterlyScore(transcript, 'CUSTOMER', 3));

    return await callBean.save();
};

exports.handler = handler;
