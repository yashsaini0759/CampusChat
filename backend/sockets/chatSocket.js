/**
 * chatSocket.js
 * ─────────────────────────────────────────────────────────────
 * Registers in-session Socket.IO event listeners.
 *
 * Events handled:
 *   send_message  — encrypted payload relay
 *   typing        — typing indicator
 *   end_chat      — user presses "End" button
 */

'use strict';

const chatController = require('../controllers/chatController');
const { withRateLimit } = require('../utils/rateLimiter');

/**
 * @param {import('socket.io').Socket} socket
 * @param {import('socket.io').Server} io
 */
function registerChatEvents(socket, io) {
    socket.on(
        'send_message',
        withRateLimit(socket, (payload) => chatController.handleSendMessage(socket, io, payload))
    );

    socket.on(
        'typing',
        withRateLimit(socket, (data) => chatController.handleTyping(socket, io, data))
    );

    socket.on(
        'end_chat',
        withRateLimit(socket, (data) => chatController.handleEndChat(socket, io, data))
    );

    socket.on(
        'end_chat_request',
        withRateLimit(socket, (data) => chatController.handleEndChat(socket, io, data))
    );
}

module.exports = { registerChatEvents };
