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

// Import all functions from case-status.js
const app = require('../../../src/core/app');
const lambda = require('../../../src/handlers/case-status');

const SuccessMessages = require('../../../src/constants/messages/success');

describe('Test for case-status', function() {
    test.each([
        [1, 'cid', { data: { records: [{ id: 1, status: 'good' }] } }, true],
        [1, 'cid', { data: { records: [] } }, false]
    ])(
        'Verify correct response whether or not case is returned by API',
        async (number, cid, apiResponse, matched) => {
            let evt = {
                Details: {
                    Parameters: {
                        caseNumber: number,
                        contactId: cid
                    }
                }
            };
            const mockApi = jest.fn();
            mockApi.mockReturnValue(apiResponse);
            app.api.call = mockApi;
            let result = await lambda.handler(evt);
            let expected = matched
                ? {
                    statusCode: 200,
                    caseId: 1,
                    caseStatus: 'good',
                    body: SuccessMessages.LAMBDA_FUNCTION_SUCCESS
                }
                : {
                    statusCode: 404,
                    body: 'Unable to match exactly one Case record'
                };
            expect(result).toEqual(expected);
        });
});
