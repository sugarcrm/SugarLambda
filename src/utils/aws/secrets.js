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

// Use this code snippet in your app.
// If you need more information about configurations or implementing the sample code, visit the AWS docs:
// https://aws.amazon.com/developers/getting-started/nodejs/

// Load the AWS SDK
let AWS = require('aws-sdk');
let region = process.env.region;
let secretArn = process.env.secretManagerArn;
let secret;

// Create a Secrets Manager client
let client = new AWS.SecretsManager({
    region: region
});

/**
 * Wrap the code provided by AWS Secrets Manager in a Promise so we can
 * await the resolution of `client.getSecretValue` in `app.api.call`.
 */
const secretPromise = new Promise((resolve, reject) => {
    client.getSecretValue({ SecretId: secretArn }, function(err, data) {
        if (err) {
            reject(err);
        } else {
            // Decrypts secret using the associated KMS CMK.
            // Depending on whether the secret is a string or binary, one of these fields will be populated.
            if ('SecretString' in data) {
                secret = data.SecretString;
            } else {
                let buff = Buffer.from(data.SecretBinary, 'base64');
                secret = buff.toString('ascii');
            }
            resolve(secret);
        }
    });
});

module.exports = {
    Secrets: secretPromise
};
