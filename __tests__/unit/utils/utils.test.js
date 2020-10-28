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
