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
let { startChatContact, buildResponseFailed, buildSuccessfulResponse } = require('../utils/aws/chat-utils');

exports.handler = (event, context, callback) => {
    console.log('Received event: ' + JSON.stringify(event));
    let body = JSON.parse(event['body']);

    startChatContact(body).then((startChatResult) => {
        callback(null, buildSuccessfulResponse(startChatResult));
    }).catch((err) => {
        console.log('caught error ' + err);
        callback(null, buildResponseFailed(err));
    });
};
