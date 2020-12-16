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

const loggerUtils = require('../utils/logger-utils');

/**
 * Close dialog with the customer, reporting fulfillmentState Fulfilled
 * @param sessionAttributes
 * @param fulfillmentState
 * @param message
 */
function close(sessionAttributes, fulfillmentState, message) {
    return {
        sessionAttributes,
        dialogAction: {
            type: 'Close',
            fulfillmentState,
            message
        }
    };
}

/**
 * Events
 * @param intentRequest
 * @param callback
 */
function dispatch(intentRequest, callback) {
    const sessionAttributes = intentRequest.sessionAttributes;

    // assign the whole user input to sessionAttributes.string
    sessionAttributes.string = intentRequest.inputTranscript;

    callback(
        close(
            sessionAttributes,
            'Fulfilled',
            {
                'contentType': 'PlainText',
                'content': 'You entered: ' + sessionAttributes.string

            }
        )
    );
}

/**
 * Main handler
 * @param event
 * @param context
 * @param callback
 */
exports.handler = (event, context, callback) => {
    // Log Lex Event to cloudwatch for debugging
    loggerUtils.logLexEvent(event);
    try {
        dispatch(event,
            (response) => {
                callback(null, response);
            });
    } catch (err) {
        callback(err);
    }
};
