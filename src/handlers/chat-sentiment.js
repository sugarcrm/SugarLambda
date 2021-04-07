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

/**
 * Utils
*/
const chatUtils = require('../utils/sugar/chat-transcript-utils');
const comprehendUtils = require('../utils/aws/comprehend-utils');
const loggerUtils = require('../utils/logger-utils');
const s3Utils = require('../utils/aws/s3-utils');
const utils = require('../utils/utils');

/**
 * Function to update a call with transcript once the transcript is
 * uploaded to S3.
 *
 * @param {Object} event S3 Event that invokes this function
 */
const handler = async (event) => {
    // Log S3 Event to cloudwatch for debugging.
    loggerUtils.logS3Event(event);

    // Fetch and process transcript from s3
    let transcript = await s3Utils.getJsonFromS3Event(event);
    console.log('Fetched Chat transcript: \n', transcript);

    let batchTranscript = utils.batchTrancsriptByParticipant(transcript);
    console.log('Batch Transcript: \n' + JSON.stringify(batchTranscript, null, 2));
    let batchSentiment = await comprehendUtils.getBatchTranscriptByParticipant(batchTranscript);
    console.log('Batch Sentiment: \n' + JSON.stringify(batchSentiment, null, 2));

    let stringTranscript = utils.stringTranscriptByParticipant(transcript);
    console.log('String Transcript: \n' + JSON.stringify(stringTranscript, null, 2));
    let stringSentiment = await comprehendUtils.getStringTranscriptByParticipant(stringTranscript);
    console.log('String Sentiment: \n' + JSON.stringify(stringSentiment, null, 2));

    let annotatedTranscript = chatUtils.createAnnotatedTrancsript(transcript, batchSentiment, stringSentiment);
    console.log('Annotated Transcript: \n' + JSON.stringify(transcript, null, 2));

    return annotatedTranscript;
};

exports.handler = handler;
