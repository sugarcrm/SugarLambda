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
