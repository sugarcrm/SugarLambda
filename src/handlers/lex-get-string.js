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
exports.handler = async (event) => {
    const userText = (event.inputTranscript ?? '').toString();
    const sessionAttributes = { ...(event.sessionState?.sessionAttributes || {}) };
    sessionAttributes.string = userText;

    const incomingIntent = event.sessionState?.intent || { name: 'FallbackIntent' };
    const intent = {
        ...incomingIntent,
        state: 'Fulfilled',
    };

    const content = `You entered: ${userText}`.slice(0, 1000);
    // Responce format Lex V2
    return {
        sessionState: {
            sessionAttributes,
            dialogAction: { type: 'Close' },
            intent,
        },
        messages: [
            { contentType: 'PlainText', content }
        ]
    };
};
