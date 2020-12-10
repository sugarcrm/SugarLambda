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
 * Sugar App abstraction
 */
const app = require('../core/app.js');
/**
 * HTTP status codes used in this function
 */
const { HttpStatus } = require('../constants/http-status');
/**
 * Sugar Instance URL
 */
const baseUrl = process.env.sugarUrl;

/**
 * Lambda function to get case status based on case number sent via Contact Flow's Invoke Lambda
 * Function block.
 * @param {Object} event
 */
const handler = async (event) => {
    const queryParams = {
        fields: 'status'
    };
    const caseNumber = event.Details.Parameters.caseNumber || '';
    const contactId = event.Details.Parameters.contactId || '';
    if (!caseNumber || !contactId) {
        return {
            statusCode: HttpStatus.preconditionFailed
        };
    }
    const filterUrl = encodeURI(`${baseUrl}/rest/v11_10/Contact/${contactId}/Cases?filter[0][case_number]=${caseNumber}&fields=id,status`);
    const response = await app.api.call('read', filterUrl, null, queryParams);

    const caseBean = response.data.records[0];

    if (caseBean) {
        return {
            statusCode: HttpStatus.ok,
            caseId: caseBean.id,
            caseStatus: caseBean.status
        };
    } else {
        return {
            statusCode: HttpStatus.notFound
        };
    }
};

exports.handler = handler;
