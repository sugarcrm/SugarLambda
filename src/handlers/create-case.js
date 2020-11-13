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
const { HttpStatus } = require('../constants/http-status');

exports.createCaseHandler = async (event) => {
    let params = event['Details']['Parameters'] || {};
    let bean = app.data.createBean('Cases', params);
    await bean.save();
    if (bean.get('id')) {
        return {
            statusCode: HttpStatus.ok,
            caseId: bean.get('id'),
            caseNumber: bean.get('case_number')
        };
    } else {
        return {
            statusCode: HttpStatus.error
        };
    }
};
