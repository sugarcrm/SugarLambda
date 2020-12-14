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
 * Defined constants
 */
const { HttpStatus } = require('../constants/http-status');
const ErrorMessages = require('../constants/messages/error');
const SuccessMessages = require('../constants/messages/success');
/**
 * Sugar Instance URL
 */
const baseUrl = process.env.sugarUrl;
/**
 * Util class to log JSON to Cloudwatch
 */
const loggerUtils = require('../utils/logger-utils');
const stringUtils = require('../utils/string-utils.js');

/**
 * Lambda function to get case status based on case number sent via Contact Flow's Invoke Lambda
 * Function block.
 * @param {Object} event
 */
const handler = async (event) => {
    loggerUtils.logContactFlowEvent(event);
    const queryParams = {
        fields: 'status'
    };
    const caseNumber = event.Details.Parameters.caseNumber || '';
    const contactId = event.Details.Parameters.contactId || '';
    if (!caseNumber || !contactId) {
        return loggerUtils.logReturnValue({
            statusCode: HttpStatus.preconditionFailed
        });
    }
    const filterUrl = encodeURI(`${baseUrl}/rest/v11_10/Contact/${contactId}/Cases?filter[0][case_number]=${caseNumber}&fields=id,status`);
    const response = await app.api.call('read', filterUrl, null, queryParams);

    const caseBean = response.data.records[0];

    if (caseBean) {
        return loggerUtils.logReturnValue({
            statusCode: HttpStatus.ok,
            caseId: caseBean.id,
            caseStatus: caseBean.status,
            body: SuccessMessages.LAMBDA_FUNCTION_SUCCESS
        });
    } else {
        return loggerUtils.logReturnValue({
            statusCode: HttpStatus.notFound,
            body: stringUtils.generateMessage(ErrorMessages.TPL_CANNOT_MATCH_RECORD, 'Case')
        });
    }
};

exports.handler = handler;
