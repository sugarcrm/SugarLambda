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
const loggerUtils = require('../utils/logger-utils');
const s3Utils = require('../utils/aws/s3-utils');
const callRecordingUtils = require('../utils/sugar/call-record-utils');

/**
 * Defined constants
 */
const ErrorMessages = require('../constants/messages/error');
const CallsConstants = require('../constants/sugar-modules/calls');
const { HttpStatus } = require('../constants/http-status.js');

/**
 * Function to update a call record's call recording URL when the 
 * audio file is ready
 *
 * @param {Object} event the S3 trigger event
 */
const handler = async (event) => {
    loggerUtils.logS3Event(event);

    let objectKey = s3Utils.getObjectKeyFromS3Event(event);
    let contactId = s3Utils.getAwsConnectContactIdFromS3Key(objectKey);
    let callRecord = await callRecordingUtils.getCallRecord(contactId);

    if (!callRecord) {
        return {
            status: HttpStatus.preconditionFailed,
            body: ErrorMessages.ERROR_MULTIPLE_CALL_RECORDS_IN_RESPONSE
        };
    }

    let callRecordingUrl = callRecordingUtils.buildCallRecordingUrl(contactId);

    let callBean = app.data.createBean('Calls', callRecord);
    callBean.set(CallsConstants.CALLS_CALL_RECORDING_URL, callRecordingUrl);

    return await callBean.save();
};

exports.handler = handler;
