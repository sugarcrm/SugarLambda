/* eslint-disable no-prototype-builtins */
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
let AWS = require('aws-sdk');
AWS.config.update({ region: process.env.REGION });
const { HttpStatus } = require('../../constants/http-status.js');

function startChatContact(body) {
    let connect = new AWS.Connect();

    let contactFlowId = '';
    if (body.hasOwnProperty('ContactFlowId')) {
        contactFlowId = body['ContactFlowId'];
    }
    console.log('CF ID: ' + contactFlowId);

    let instanceId = '';
    if (body.hasOwnProperty('InstanceId')) {
        instanceId = body['InstanceId'];
    }
    console.log('Instance ID: ' + instanceId);

    return new Promise(function(resolve, reject) {
        let startChat = {
            'InstanceId': instanceId === '' ? process.env.instanceId : instanceId,
            'ContactFlowId': contactFlowId === '' ? process.env.contactFlowId : contactFlowId,
            'Attributes': body['Attributes'],
            'ParticipantDetails': {
                'DisplayName': body['ParticipantDetails']['DisplayName']
            }
        };

        connect.startChatContact(startChat, function(err, data) {
            console.log('called');
            if (err) {
                console.log('Error starting the chat.');
                console.log(err, err.stack);
                reject(err);
            } else {
                console.log('Start chat succeeded with the response: ' + JSON.stringify(data));
                resolve(data);
            }
        });
    });
}

function buildSuccessfulResponse(result) {
    const response = {
        statusCode: HttpStatus.ok,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
            'Access-Control-Allow-Credentials': true,
            'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'
        },
        body: JSON.stringify({
            data: { startChatResult: result }
        })
    };
    console.log('RESPONSE' + JSON.stringify(response));
    return response;
}

function buildResponseFailed(err) {
    const response = {
        statusCode: HttpStatus.error,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
            'Access-Control-Allow-Credentials': true,
            'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'
        },
        body: JSON.stringify({
            data: {
                'Error': err
            }
        })
    };
    return response;
}

module.exports = {
    startChatContact,
    buildSuccessfulResponse,
    buildResponseFailed
};
