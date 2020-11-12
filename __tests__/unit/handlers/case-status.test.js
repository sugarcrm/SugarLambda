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

describe('Test for case-status', function() {
    test.each([
        [1, { data: { records: [{ id: 1, status: 'good' }] } }, true],
        [1, { data: { records: [] } }, false]
    ])(
        'Verify correct response whether or not case is returned by API',
        async (number, apiResponse, matched) => {
            let evt = {
                Details: {
                    Parameters: {
                        caseNumber: number
                    }
                }
            };
            const mockApi = jest.fn();
            mockApi.mockReturnValue(apiResponse);
            app.api.call = mockApi;
            let result = await lambda.handler(evt);
            let expected = {
                status: matched ? 200 : 404,
                body: matched ? { id: 1, status: 'good' } : {}
            };
            expect(result).toEqual(expected);
        });
});
