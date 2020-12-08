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

const callRecordUtils = require('../../../../src/utils/sugar/call-record-utils');

describe('Tests buildCallRecordingUrl', function() {
    afterEach(() => {
        process.env.awsConnectInstance = '';
        process.env.awsConnectDomain = '';
        process.env.callRecordingPartialUrl = '/connect/get-recording?format=mp3&callLegId=';
    });

    test.each([
        [
            '123', '', '', ''
        ],
        [
            '123',
            'test-instance',
            '',
            ''
        ],
        [
            '123',
            'test-instance',
            'awsapps.com',
            'https://test-instance.awsapps.com/connect/get-recording?format=mp3&callLegId=123'
        ]
    ])('should build the call recording URL', (contactId, connectInstance, connectDomain, expected) => {
        process.env.awsConnectInstance = connectInstance;
        process.env.awsConnectDomain = connectDomain;

        expect(callRecordUtils.buildCallRecordingUrl(contactId)).toEqual(expected);
    });
});
