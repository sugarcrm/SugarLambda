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

// Import all functions from createCase.js
const lambda = require('../../../src/handlers/create-case.js');

// Mock bean.js
jest.mock('../../../src/core/bean.js', () => () => ({
    save: function() {
        return {
            id: 1,
            case_number: 1
        };
    },
    get: function() {
        return 1;
    }
}));

// This includes all tests for createCaseHandler()
describe('Test for create-case', function() {
    // This test invokes createCaseHandler() and compare the result
    it('Verifies successful response', async () => {
        // Input
        const evt = {
            Details: {
                Parameters: {
                    name: 'test'
                }
            }
        };
        // Invoke helloFromLambdaHandler()
        const result = await lambda.createCaseHandler(evt);
        // The expected result
        const expectedResult = {
            statusCode: 200,
            caseId: 1,
            caseNumber: 1
        };
        // Compare the result with the expected result
        expect(result).toEqual(expectedResult);
    });
});
