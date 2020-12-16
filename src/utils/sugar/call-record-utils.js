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

const app = require('../../core/app');

/**
 * Utils
 */
const strUtils = require('../string-utils');

/**
 * Defined Constants
 */
const CallsConstants = require('../../constants/sugar-modules/calls');
const ErrorMessages = require('../../constants/messages/error');
const UrlConstants = require('../../constants/url');

/**
  * Return a single call record, false otherwise
  *
  * @param {string} contactId the AWS Connect contact ID
  */
async function getCallRecord(contactId) {
    let url = encodeURI(`Calls?filter[0][${CallsConstants.CALLS_AWS_CONTACT_ID}]=${contactId}`);
    url = app.api.buildUrl(url);
    const response = await app.api.call('read', url);

    // return false if the response is invalid or no records were returned
    if (!response.data || !Array.isArray(response.data.records) || response.data.records.length === 0) {
        console.warn(strUtils.generateMessage(ErrorMessages.TPL_NO_RECORDS_MATCHED, 'Call'));
        return false;
    }

    // return false if multiple call records were returned
    if (response.data.length > 1) {
        console.warn(strUtils.generateMessage(ErrorMessages.TPL_MULTIPLE_RECORDS_MATCHED, 'Call'));
        return false;
    }

    // return a single call record
    return response.data.records[0];
}

/**
 * Build the call recording URL based on an AWS Connect URL and not S3. Appropriate
 * AWS Connect user permissions are required to access the URL
 *
 * @param {string} contactId
 */
function buildCallRecordingUrl(contactId) {
    let connectInstance = process.env.awsConnectInstance;
    let connectDomain = process.env.awsConnectDomain;
    let callRecordingPartialUrl = process.env.callRecordingPartialUrl;

    // return empty if contact ID is not defined
    if (!contactId) {
        console.warn('Call Recording URL Warning: Unable to construct a URL without AWS Connect contact ID');
        return '';
    }

    // return empty if one or more of the required parameters is not defined
    if (!connectInstance || !connectDomain || !callRecordingPartialUrl) {
        console.warn('Call Recording URL Warning: Unable to construct a URL with missing required parameter(s). ' +
      'Please check the following parameters: AwsConnectInstance, AWSConnectDomain, CallRecordingPartialURL');
        return '';
    }

    let encodedConnectInstance = encodeURIComponent(connectInstance);
    let encodedContactId = encodeURIComponent(contactId);

    connectDomain = connectDomain.trim();
    callRecordingPartialUrl = callRecordingPartialUrl.trim();

    let url = UrlConstants.HTTPS_PREFIX + encodedConnectInstance + '.' + connectDomain +
    callRecordingPartialUrl + encodedContactId;

    return url;
}

module.exports = {
    getCallRecord,
    buildCallRecordingUrl
};
