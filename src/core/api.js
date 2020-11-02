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

const axios = require('axios');

const { HttpStatus } = require('../constants/http-status.js');

const methodToRequest = {
    'read': 'GET',
    'update': 'PUT',
    'create': 'POST',
    'delete': 'DELETE'
};

module.exports = () => {
    const serverUrl = (process.env.sugarUrl || 'localhost') + '/rest/v11_10';
    const username = process.env.sugarUsername || '';
    const password = process.env.sugarPass || '';

    return {
        serverUrl: serverUrl,

        buildUrl: function(path) {
            return `${serverUrl}/${path}`;
        },

        call: async function(method, url, data, params) {
            try {
                let response = await axios.post(this.buildUrl('oauth2/token'), {
                    grant_type: 'password',
                    client_id: 'sugar',
                    client_secret: '',
                    username: username,
                    password: password,
                    platform: ''
                });
                if (!(response && response.data && response.data.access_token)) {
                    return {
                        status: HttpStatus.authFailure
                    };
                }
                let request = {
                    method: methodToRequest[method],
                    url: url,
                    headers: { Authorization: `Bearer ${response.data.access_token}` }
                };
                if (data) {
                    request.data = data;
                }
                if (params) {
                    request.params = params;
                }
                response = await axios(request);
                if (response.data) {
                    return {
                        status: HttpStatus.ok,
                        data: response.data
                    };
                } else {
                    return {
                        status: HttpStatus.notFound
                    };
                }
            } catch (error) {
                return {
                    status: HttpStatus.error,
                    error: error
                };
            }
        }
    };
};
