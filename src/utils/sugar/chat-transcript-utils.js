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
 * Combine raw transcript with the return from batchSentiment API and getSentiment APIs into one
 * annotated transcript with overall scores for each participant and individual message scores.
 *
 * @param {Object} transcript raw Connect Chat Transcript
 * @param {*} sentimentScores Sentiment scores for each chat participane keyed by participant name
 */
function createAnnotatedTrancsript(transcript, batchSentiment, stringSentiment) {
    for (const [participant, sentiment] of Object.entries(stringSentiment)) {
        transcript[`${participant}_SENTIMENT`] = sentiment;
    }

    let participantIndices = {};
    Object.keys(batchSentiment).forEach(key => {
        participantIndices[key] = 0;
    });

    let messages = transcript.Transcript;

    messages = messages.map(message => {
        if (message.ContentType !== 'text/plain') {
            return message;
        }
        let role = message.ParticipantRole;
        let index = participantIndices[role]++;
        let messageSentiment = batchSentiment[role].ResultList[index];
        message['Sentiment'] = messageSentiment;
        return message;
    });
    transcript.Transcript = messages;

    return transcript;
}

module.exports = {
    createAnnotatedTrancsript
};
