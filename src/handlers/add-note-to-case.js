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
 * A Lambda function that creates a case.
 */
const app = require('../core/app.js');
/**
 * Util classes to write logs to Cloudwatch
 */
const loggerUtils = require('../utils/logger-utils');
const strUtils = require('../utils/string-utils');
/**
 * Defined Constants
 */
const { HttpStatus } = require('../constants/http-status');
const ErrorMessages = require('../constants/messages/error');
const SuccessMessages = require('../constants/messages/success');
/**
 * Sugar Instance URL
 */
const baseUrl = process.env.sugarUrl;

/**
 * Lambda function to add a note to a given case based on case number and note text sent via Contact Flow's Invoke Lambda
 * Function block.
 * @param {Object} event
 */
const addNoteToCaseHandler = async (event) => {
    loggerUtils.logContactFlowEvent(event);

    let statusCode = HttpStatus.error;
    let caseId = '';
    let noteName = '';
    let body = '';

    // input from the contact flow provided by the user
    const caseNumber = event.Details.Parameters.caseNumber || '';
    const contactId = event.Details.Parameters.contactId || '';

    if (!caseNumber || !contactId) {
        let filler = caseNumber ? '' : 'caseNumber ';
        filler += contactId ? '' : 'contactId';
        body = strUtils.generateMessage(ErrorMessages.TPL_MISSING_REQUIRED_PARAMETERS, filler);
        return loggerUtils.logReturnValue({
            statusCode: HttpStatus.preconditionFailed,
            caseId: caseId,
            body: body
        });
    }

    const noteDescription = event.Details.Parameters.noteDescription;
    const contactName = event.Details.Parameters.contactName;

    // Use the given case number to get the relavant case id
    const filterUrl = encodeURI(`${baseUrl}/rest/v11_10/Contact/${contactId}/Cases?filter[0][case_number]=${caseNumber}&fields=id`);
    const idResponse = await app.api.call('read', filterUrl, null, null);

    if (idResponse.data.records.length > 1) {
        body = strUtils.generateMessage(ErrorMessages.TPL_MULTIPLE_RECORDS_MATCHED, 'Case');
        return loggerUtils.logReturnValue({
            statusCode: statusCode,
            caseId: caseId,
            body: body
        });
    }
    const caseBean = idResponse.data.records[0];

    // if contact name is empty then default it to 'customer'
    if (contactName === '' || contactName === undefined) {
        noteName = 'Note from customer';
    } else {
        noteName = `Note from ${contactName}`;
    }

    // if case id is successfully obtained
    if (caseBean && caseBean.id !== '') {
        // payload to be sent with the request for note creation
        const notePayload = {
            'parent_type': 'Cases',
            'parent_id': caseBean.id,
            'description': noteDescription,
            'name': noteName
        };

        // add note to the case
        const filterUrl = encodeURI(`${baseUrl}/rest/v11_10/Cases/${caseBean.id}/link/notes`);
        const noteResponse = await app.api.call('create', filterUrl, null, notePayload);
        const updateCaseBean = noteResponse.data.record;

        // if the case was successfully updated
        if (updateCaseBean && updateCaseBean.id !== '') {
            statusCode = HttpStatus.ok;
            caseId = updateCaseBean.id;
            body = SuccessMessages.LAMBDA_FUNCTION_SUCCESS;
        } else {
            body = ErrorMessages.ERROR_NOTE_CREATE_FAILED;
        }
    } else {
        body = strUtils.generateMessage(ErrorMessages.TPL_NO_RECORDS_MATCHED, 'Case');
    }

    return loggerUtils.logReturnValue({
        statusCode: statusCode,
        caseId: caseId,
        body: body
    });
};

exports.handler = addNoteToCaseHandler;
