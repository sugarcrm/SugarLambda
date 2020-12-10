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
 * Util class to log JSOn to Cloudwatch
 */
const loggerUtils = require('../utils/logger-utils');
/**
 * HTTP status codes used in this function
 */
const { HttpStatus } = require('../constants/http-status');
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
    // input from the contact flow provided by the user
    const caseNumber = event.Details.Parameters.caseNumber || '';
    const contactId = event.Details.Parameters.contactId || '';
    if (!caseNumber || !contactId) {
        return {
            statusCode: HttpStatus.preconditionFailed
        };
    }
    const noteDescription = event.Details.Parameters.noteDescription;
    const contactName = event.Details.Parameters.contactName;

    // Use the given case number to get the relavant case id
    const filterUrl = encodeURI(`${baseUrl}/rest/v11_10/Contact/${contactId}/Cases?filter[0][case_number]=${caseNumber}&fields=id`);
    const idResponse = await app.api.call('read', filterUrl, null, null);
    const caseBean = idResponse.data.records[0];

    loggerUtils.logSugarApiResponse(idResponse);

    let statusCode = HttpStatus.error;
    let caseId = '';
    let noteName = ''

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

        loggerUtils.logSugarApiResponse(noteResponse);

        const updateCaseBean = noteResponse.data.record;
        
        // if the case was successfully updated
        if (updateCaseBean && updateCaseBean.id !== '') {
            statusCode = HttpStatus.ok;
            caseId = updateCaseBean.id;
        }
    }

    return {
        statusCode: statusCode,
        caseId: caseId
    };
};

exports.handler = addNoteToCaseHandler;
