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
const _ = require('underscore');

module.exports = {
    /**
     * Provides rudimentary string interpolation. Replaces '${}' placeholders
     * in template strings with provided fillers. It is the responsibility of
     * the calling function to ensure the number of fillers is appropriate
     * for the template string provided
     *
     * @param {String} template - Template string with placeholders
     * @param {String|Array} filler - String or array of strings to fill placeholders
     * @return Template string with placeholders filled with provided filler(s)
     */
    generateMessage: (template, filler) => {
        if (Array.isArray(filler)) {
            _.each(filler, function(item) {
                template = template.replace('${}', item);
            });
        } else {
            template = template.replace('${}', filler);
        }
        return template.trim();
    }
};
