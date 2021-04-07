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
const AWS = require('aws-sdk');

/**
 * Call comprehend batchDetectSentiment API to get an array of sentiments per utterance grouped by conversation participant
 *
 * @param {Object} groupedTranscript
 * @returns {Object} Sentiments grouped by participant, with a sentiment score for each utterance in the transcript
 */
async function getBatchTranscriptByParticipant(groupedTranscript) {
    const comprehend = new AWS.Comprehend();
    let groupedSentiment = {};
    for (const [key, value] of Object.entries(groupedTranscript)) {
        let params = {
            LanguageCode: 'en',
            TextList: value
        };
        groupedSentiment[key] = await comprehend.batchDetectSentiment(params, function(err, data) {
            if (err) {
                console.log(err);
            } else {
                return data;
            }
        }).promise();
    }
    return groupedSentiment;
}

/**
 * Call comprehend detectSentiment API to get a single sentiment for each conversation participant
 *
 * @param {Object} groupedTranscript
 * @returns {Object} Sentiments grouped by participant, with a single sentiment score per participant
 */
async function getStringTranscriptByParticipant(groupedTranscript) {
    const comprehend = new AWS.Comprehend();
    let groupedSentiment = {};
    for (const [key, value] of Object.entries(groupedTranscript)) {
        let params = {
            LanguageCode: 'en',
            Text: value
        };
        groupedSentiment[key] = await comprehend.detectSentiment(params, (err, data) => {
            if (err) {
                console.log(err);
            } else {
                return data;
            }
        }).promise();
    }
    return groupedSentiment;
}

module.exports = { getBatchTranscriptByParticipant, getStringTranscriptByParticipant };
