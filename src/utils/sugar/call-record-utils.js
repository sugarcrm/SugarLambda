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
const loggerUtils = require('../logger-utils');

/**
 * Defined Constants
 */
const CallsConstants = require('../../constants/sugar-modules/calls');
const UrlConstants = require('../../constants/url');

 /**
  * Return a single call record, false otherwise
  *
  * @param {string} contactId the AWS Connect contact ID
  */
async function getCallRecord (contactId) {
  let url = encodeURI(`Calls?filter[0][${CallsConstants.CALLS_AWS_CONTACT_ID}]=${contactId}`);
  url = app.api.buildUrl(url);
  const response = await app.api.call('read', url);
  loggerUtils.logSugarApiResponse(response);

  // return false if the response is invalid or more than one record was returned
  if (!response.data || !Array.isArray(response.data.records) || response.data.records.length !== 1) {
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
function buildCallRecordingUrl (contactId) {
  let connectInstance = process.env.awsConnectInstance;

  // return empty if AWS Connect instance name or contact ID is not defined
  if (!connectInstance || !contactId) {
    return '';
  }

  let encodedConnectInstance = encodeURIComponent(connectInstance);
  let encodedContactId = encodeURIComponent(contactId);

  let url = UrlConstants.HTTPS_PREFIX + encodedConnectInstance + UrlConstants.AWS_CONNECT_URL_PARTIAL +
    UrlConstants.AWS_CONNECT_CALL_RECORDING_URL_PARTIAL + encodedContactId;

  return url;
}

module.exports = { 
  getCallRecord,
  buildCallRecordingUrl
};
