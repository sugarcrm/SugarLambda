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
 * Process raw transcript to group messages by Participant
 *
 * @param {Object} transcript JSON representing a chat transcript
 * @returns {Object} mapping of conversation participant to an array of utterances
 */
function batchTrancsriptByParticipant(transcript) {
    let groupedMessages = {};
    transcript.Transcript.forEach((statement) => {
        if (!('Content' in statement)) {
            return;
        };
        let role = statement.ParticipantRole;
        if (!(role in groupedMessages)) {
            groupedMessages[role] = [];
        }
        groupedMessages[role].push(statement.Content);
    });
    return groupedMessages;
}

/**
 * Process raw transcript to group messages by participant, and combine messages into a single
 * string.
 *
 * @param {Object} transcript JSON representing a chat transcript
 * @returns {Object} mapping of conversation participant to string with combined utterances
 */
function stringTranscriptByParticipant(transcript) {
    let groupedMessages = {};
    transcript.Transcript.forEach((statement) => {
        if (!('Content' in statement)) {
            return;
        };
        let role = statement.ParticipantRole;
        if (!(role in groupedMessages)) {
            groupedMessages[role] = '';
        }
        groupedMessages[role] = `${groupedMessages[role]} ${statement.Content}`.trim();
    });
    return groupedMessages;
}

module.exports = { processTranscript, batchTrancsriptByParticipant, stringTranscriptByParticipant };
