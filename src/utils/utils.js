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
  * Process JSON transcript and return a human-readable version
  *
  * @param {String} transcript
  */
function processTranscript(transcript) {
    let processedTranscript = '';
    transcript.Transcript.forEach((statement) => {
        processedTranscript += `[${statement.ParticipantId} ${statement.Sentiment}]\n`;
        processedTranscript += `${statement.Content}\n\n`;
    });
    return processedTranscript.trim();
}

/**
 * Get Overall sentiment score for given type
 *
 * @param transcript
 * @param type AGENT or CUSTOMER
 * @returns {number|string}
 */
function getOverallScore(transcript, type) {
    return Number(transcript.ConversationCharacteristics.Sentiment.OverallSentiment[type]);
}

/**
 * Get quarter sentiment score for given type and quarter
 * @param transcript
 * @param type AGENT or CUSTOMER
 * @param quarter
 * @returns {number|string}
 */
function getQuarterlyScore(transcript, type, quarter) {
    return Number(transcript.ConversationCharacteristics.Sentiment.SentimentByPeriod.QUARTER[type][quarter].Score);
}

module.exports = { processTranscript,  getOverallScore, getQuarterlyScore};
