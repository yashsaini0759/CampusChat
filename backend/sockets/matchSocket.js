/**
 * matchSocket.js
 * ─────────────────────────────────────────────────────────────
 * Registers matchmaking-related Socket.IO event listeners
 * on a connected socket.
 *
 * Events handled:
 *   join_queue   — user wants to start searching for a chat
 *   leave_queue  — user cancels search
 */

'use strict';

const matchController = require('../controllers/matchController');
const { withRateLimit } = require('../utils/rateLimiter');

/**
 * @param {import('socket.io').Socket} socket
 * @param {import('socket.io').Server} io
 */
function registerMatchEvents(socket, io) {
    socket.on(
        'join_queue',
        withRateLimit(socket, (data) => matchController.handleJoinQueue(socket, io, data))
    );

    socket.on(
        'find_next_match',
        withRateLimit(socket, (data) => matchController.handleJoinQueue(socket, io, data))
    );

    socket.on(
        'leave_queue',
        withRateLimit(socket, () => matchController.handleLeaveQueue(socket))
    );
}

module.exports = { registerMatchEvents };
