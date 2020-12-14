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

/**
 * Log the JSON to AWS Cloudwatch
 *
 * @param {string} title 
 * @param {Object} json 
 */
function logJson (title, json) {
    console.log(`${title}:\n`, JSON.stringify(json));
}

/**
 * Log API Gateway event for debugging
 *
 * @param {Object} event
 */
function logAPIGatewayEvent(event) {
    logJson('API Gateway Event', event);
}

/**
 * Log the Contact Flow event for debugging
 *
 * @param {Object} event
 */
function logContactFlowEvent(event) {
    logJson('Contact Flow Event', event);
}

/**
 * Log the Amazon Lex event for deubbing
 *
 * @param {Object} event
 */
function logLexEvent(event) {
    logJson('Lex Event', event);
}

/**
 * Log value returned from Lambda function for debugging
 *
 * @param {Object} returnValue
 */
function logReturnValue(returnValue) {
    logJson('Lambda Return Value', returnValue);
    return returnValue;
}

/**
 * Log the S3 event for debugging
 *
 * @param {Object} event 
 */
function logS3Event (event) {
    logJson('S3 Event', event);
}

/**
 * Log the Sugar API response for debugging
 *
 * @param {string} response 
 */
function logSugarApiResponse (response) {
    logJson('Sugar API Response', response);
}

module.exports = {
    logAPIGatewayEvent,
    logContactFlowEvent,
    logJson,
    logLexEvent,
    logReturnValue,
    logS3Event,
    logSugarApiResponse
};
