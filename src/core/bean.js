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
const api = require('./api.js')();

module.exports = (module, data) => {
    return {
        module: module,

        attributes: data || {},

        set: function(key, value) {
            this.attributes[key] = value;
        },

        get: function(key) {
            return this.attributes[key];
        },

        save: async function() {
            let method = this.get('id') ? 'update' : 'create';
            let url = api.buildUrl(this.module);
            let response = await api.call(method, url, this.attributes);
            if (response.data) {
                _.extend(this.attributes, response.data);
            }
            return response;
        },

        fetch: async function() {
            let url = api.buildUrl(this.module + '/' + this.get('id'));
            let response = await api.call('read', url);
            if (response.data) {
                _.extend(this.attributes, response.data);
            }
            return response;
        }
    };
};
