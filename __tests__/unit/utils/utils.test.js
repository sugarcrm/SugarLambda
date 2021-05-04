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
const util = require('../../../src/utils/utils.js');

describe('processTranscript', function() {
    it('should convert connect-provided JSON to human-readable format', () => {
        const { transcript } = require('../../fixtures/transcript.json');
        // eslint-disable-next-line no-multi-str
        const expected = '[CUSTOMER NEUTRAL]\n\
Hello.\n\
\n\
[AGENT NEUTRAL]\n\
Hello again.\n\
\n\
[CUSTOMER NEUTRAL]\n\
Hello again.\n\
\n\
[AGENT NEUTRAL]\n\
Goodbye.\n\
\n\
[CUSTOMER NEUTRAL]\n\
Goodbye.';
        const actual = util.processTranscript(transcript);
        expect(actual).toEqual(expected);
    });
});

describe('getOverallScore', function() {
    test.each([
        [
            'AGENT', 2.5
        ],
        [
            'CUSTOMER', 3.5
        ]
    ])('should build the call recording URL', (type, expected) => {
        const { transcript } = require('../../fixtures/transcript.json');
        const actual = util.getOverallScore(transcript, type);
        expect(actual).toEqual(expected);
    });
});

describe('getQuarterlyScore', function() {
    test.each([
        [
            'AGENT', 0, 1
        ],
        [
            'AGENT', 1, 2
        ],
        [
            'AGENT', 2, 3
        ],
        [
            'AGENT', 3, 4
        ],
        [
            'CUSTOMER', 0, 2
        ],
        [
            'CUSTOMER', 1, 3
        ],
        [
            'CUSTOMER', 2, 4
        ],
        [
            'CUSTOMER', 3, 5
        ]
    ])('should build the call recording URL', (type, quarter, expected) => {
        const { transcript } = require('../../fixtures/transcript.json');
        const actual = util.getQuarterlyScore(transcript, type, quarter);
        expect(actual).toEqual(expected);
    });
});
