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
const strUtils = require('../utils/string-utils');

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
    loggerUtils.logJson('Fetched transcript', transcript);
    const processedTranscript = utils.processTranscript(transcript);

    // Fetch related call record from Sugar
    const connectContactId = transcript.CustomerMetadata.ContactId;
    let callRecord = await callRecordingUtils.getCallRecord(connectContactId);

    // If our response doesn't match exactly one call, the conditions for this function haven't
    // been met so return 412
    if (!callRecord) {
        return loggerUtils.logReturnValue({
            status: HttpStatus.preconditionFailed,
            body: strUtils.generateMessage(ErrorMessages.TPL_CANNOT_MATCH_RECORD, 'Call')
        });
    }

    // Update call record with readable transcript, return the result
    let callBean = app.data.createBean('Calls', callRecord);
    callBean.set(CallsConstants.CALLS_TRANSCRIPT, processedTranscript);

    return loggerUtils.logReturnValue(await callBean.save());
};

exports.handler = handler;
