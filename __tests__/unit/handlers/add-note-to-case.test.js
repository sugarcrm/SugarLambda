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
const lambda = require('../../../src/handlers/add-note-to-case');

describe('Test for add-note-to-case', function() {
    test.each([
        [1, 'test1', 'John Doe', { data: { records: [{ id: 1 }] } }, { data: { record: { id: 1 } } }, true],
        [1, 'test2', '', { data: { records: [{ id: 1 }] } }, { data: { record: { id: 1 } } }, true],
        [1, 'test3', 'John Doe', { data: { records: [{ id: 1 }] } }, { data: {} }, false],
        [1, 'test4', 'John Doe', { data: { records: [] } }, { data: { record: { id: 1 } } }, false],
        [1, 'test5', 'John Doe', { data: { records: [] } }, { data: {} }, false]
    ])(
        'Verify correct response whether or not case is returned by API and note is added',
        async (number, noteDescription, contactName, apiResponse1, apiResponse2, matched) => {
            process.env = {
                sugarUrl: 'https://cs-829.msqa.sugarcrm.com'
            };

            let evt = {
                Details: {
                    Parameters: {
                        caseNumber: number,
                        noteDescription: noteDescription,
                        contactName: contactName
                    }
                }
            };

            const mockApi = jest.fn();
            mockApi.mockReturnValueOnce(apiResponse1).mockReturnValueOnce(apiResponse2);
            app.api.call = mockApi;
            let result = await lambda.handler(evt);

            let expected = {
                statusCode: matched ? 200 : 500,
                caseId: matched ? 1 : ''
            };
            expect(result).toEqual(expected);
        });
});
