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
const strUtils = require('../../../src/utils/string-utils.js');

describe('generateMessage', function() {
    test.each([
        {
            template: 'Single ${} test',
            filler: 'dog',
            expected: 'Single dog test'
        },
        {
            template: 'Multiples ${} ${} test',
            filler: ['dog', 'cat'],
            expected: 'Multiples dog cat test'
        },
        {
            template: 'Mismatched ${} ${} ${} too few fillers',
            filler: ['dog', 'cat'],
            expected: 'Mismatched dog cat ${} too few fillers'
        },
        {
            template: 'Mismatch ${} too many fillers',
            filler: ['dog', 'cat'],
            expected: 'Mismatch dog too many fillers'
        }
    ])('should fill the template string as expected', (values) => {
        let actual = strUtils.generateMessage(values.template, values.filler);
        expect(actual).toEqual(values.expected);
    });
});
