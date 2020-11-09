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
const AWSMock = require('aws-sdk-mock');
const AWS = require('aws-sdk');
AWSMock.setSDKInstance(AWS);

const chatUtils = require('../../../../src/utils/aws/chat-utils.js');

describe('Test startChatContact', function() {
    afterEach(() => {
        AWSMock.restore('Connect');
    });
    it('should call connect.startChatContact with appropriate args', async () => {
        const startChatContactMock = jest.fn();
        startChatContactMock.mockResolvedValue('resolved value');
        AWSMock.mock('Connect', 'startChatContact', startChatContactMock);
        let body = {
            ContactFlowId: 'test contact flow ID',
            InstanceId: 'test instance ID',
            Attributes: { 'test attribute': 'test value' },
            ParticipantDetails: { 'DisplayName': 'test display name' }
        };
        let expected = {
            'InstanceId': 'test instance ID',
            'ContactFlowId': 'test contact flow ID',
            'Attributes': { 'test attribute': 'test value' },
            'ParticipantDetails': {
                'DisplayName': 'test display name'
            }
        };
        chatUtils.startChatContact(body);
        expect(startChatContactMock.mock.calls[0][0]).toEqual(expected);
    });
});

describe('Test buildResponseFailed', () => {
    it('should build http response sending error in the body', () => {
        let err = 'this is a test error';
        let expected = {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Credentials': true,
                'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'
            },
            // eslint-disable-next-line quotes
            body: "{\"data\":{\"Error\":\"this is a test error\"}}"
        };
        let actual = chatUtils.buildResponseFailed(err);
        expect(actual).toEqual(expected);
    });
});

describe('Test buildSuccesfulResponse', () => {
    it('should build http response with appropriate body content', () => {
        let responseText = 'this is a test response';
        let expected = {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Credentials': true,
                'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'
            },
            // eslint-disable-next-line quotes
            body: "{\"data\":{\"startChatResult\":\"this is a test response\"}}"
        };
        const actual = chatUtils.buildSuccessfulResponse(responseText);
        expect(actual).toEqual(expected);
    });
});
