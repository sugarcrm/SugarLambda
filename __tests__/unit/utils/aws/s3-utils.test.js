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

const s3Utils = require('../../../../src/utils/aws/s3-utils.js');

describe('Tests getJsonFromS3Event', function() {
    afterEach(() => {
        AWSMock.restore('S3');
    });
    it('should call the s3 library with appropriate arguments from the event', async () => {
        const expName = 'test name';
        const expKey = 'test key';
        const event = {
            Records: [{
                s3: {
                    bucket: { name: expName },
                    object: { key: expKey }
                }
            }]
        };
        const expectedReturn = { 'fake': 'jsonString' };
        const expectedParams = {
            Bucket: expName,
            Key: expKey
        };

        const getObjectMock = jest.fn();
        getObjectMock.mockResolvedValue({ Body: JSON.stringify(expectedReturn) });
        AWSMock.mock('S3', 'getObject', getObjectMock);

        const actual = await s3Utils.getJsonFromS3Event(event);
        expect(actual).toEqual(expectedReturn);
        expect(getObjectMock.mock.calls[0][0]).toEqual(expectedParams);
    });
});

describe('Tests getObjectKeyFromS3Event', function() {
    it('should get the object key from S3 trigger event', async () => {
        let testKey = 'test_key';
        let event = {
            'Records': [
                {
                    's3': {
                        'object': {
                            'key': testKey
                        }
                    }
                }
            ]
        };

        expect(s3Utils.getObjectKeyFromS3Event(event)).toEqual(testKey);
    });
});

describe('Tests getAwsConnectContactIdFromS3Key', function() {
    test.each([
        [
            '', false
        ],
        [
            '123-abc_20201102T15%3A11_UTC.wav', '123-abc'
        ]
    ])('should get AWS Connect contact ID from S3 object key', (key, expected) => {
        expect(s3Utils.getAwsConnectContactIdFromS3Key(key)).toEqual(expected);
    });
});
