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

module.exports = {
    processTranscript
};
