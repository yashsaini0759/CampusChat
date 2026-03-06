/**
 * matchController.js
 * ─────────────────────────────────────────────────────────────
 * Orchestrates the matchmaking flow:
 *   join queue → find match → create session → notify peers
 *
 * Called from matchSocket.js event handlers.
 */

'use strict';

const matchingService = require('../services/matchingService');
const sessionService = require('../services/sessionService');
const encryptionService = require('../services/encryptionService');
const { validateQueuePayload } = require('../utils/validation');
const logger = require('../utils/logger');

/**
 * Handle a user requesting to join the matchmaking queue.
 *
 * Flow:
 *   1. Validate payload
 *   2. Emit "searching" to client
 *   3. Enqueue user
 *   4. Attempt immediate match
 *   5. If match found → create session, exchange keys, notify both
 *
 * @param {import('socket.io').Socket} socket
 * @param {import('socket.io').Server} io
 * @param {object} data  — raw join_queue payload from client
 */
function handleJoinQueue(socket, io, data) {
    // Ensure the user is not left in an active session (zombie session prevention)
    const existingSession = sessionService.getSessionBySocket(socket.id);
    if (existingSession) {
        const peerSocketId = sessionService.getPeerSocketId(socket.id);
        if (peerSocketId) {
            io.to(peerSocketId).emit('chat_ended', {
                sessionId: existingSession.sessionId,
                reason: 'peer_disconnected'
            });
        }
        sessionService.endSessionBySocket(socket.id);
    }

    // Merge incoming data with cached preferences
    const prefs = socket.data.matchPreferences || {};
    const mergedData = {
        gender: data.gender || prefs.gender,
        lookingFor: data.lookingFor || prefs.lookingFor,
        college: data.college || prefs.college,
        name: data.name || prefs.name,
        publicKey: data.publicKey // always requires a fresh key
    };

    const { valid, reason, cleaned } = validateQueuePayload(mergedData);

    if (!valid) {
        socket.emit('queue_error', { message: reason || 'Missing match criteria' });
        logger.warn(`Invalid join_queue from ${socket.id}: ${reason}`);
        return;
    }

    // Cache preferences for future "Look for Next"
    socket.data.matchPreferences = cleaned;

    const user = { socketId: socket.id, ...cleaned };

    // Tell the client we are actively searching
    socket.emit('match_status', { status: 'searching' });

    // Add to queue
    matchingService.enqueue(user);

    // Try to find a match immediately
    const match = matchingService.findMatch(user);

    if (match) {
        _createSessionAndNotify(io, match.userA, match.userB);
    }
    // Otherwise user remains in queue; they will be matched when
    // the next compatible user calls join_queue.
}

/**
 * Handle a user leaving the queue before being matched.
 * @param {import('socket.io').Socket} socket
 */
function handleLeaveQueue(socket) {
    const removed = matchingService.dequeue(socket.id);
    if (removed) {
        socket.emit('match_status', { status: 'cancelled' });
        logger.info(`${socket.id} left the queue`);
    }
}

/**
 * When a user disconnects while in the queue, clean up silently.
 * @param {string} socketId
 */
function handleQueueDisconnect(socketId) {
    matchingService.dequeue(socketId);
}

// ─────────────────────────────────────────────────────────────
// Internal
// ─────────────────────────────────────────────────────────────

/**
 * Create a session and notify both matched users.
 * @param {import('socket.io').Server} io
 * @param {object} userA
 * @param {object} userB
 */
function _createSessionAndNotify(io, userA, userB) {
    const session = sessionService.createSession(userA, userB, _onSessionTimeout(io));

    // Build key-exchange payloads
    const payloadForA = encryptionService.buildKeyExchangePayload(session, userA.socketId);
    const payloadForB = encryptionService.buildKeyExchangePayload(session, userB.socketId);

    // Notify userA
    io.to(userA.socketId).emit('match_status', {
        status: 'matched',
        sessionId: session.sessionId,
        peerCollege: userB.college,
        peerName: userB.name,
        keyExchange: payloadForA,
    });

    // Notify userB
    io.to(userB.socketId).emit('match_status', {
        status: 'matched',
        sessionId: session.sessionId,
        peerCollege: userA.college,
        peerName: userA.name,
        keyExchange: payloadForB,
    });

    encryptionService.logKeyExchange(session.sessionId);
}

/**
 * Return an onTimeout callback for a session.
 * @param {import('socket.io').Server} io
 */
function _onSessionTimeout(io) {
    return (sessionId) => {
        const session = sessionService.getSession(sessionId);
        if (!session) return;

        const endPayload = { sessionId, reason: 'inactivity_timeout' };
        io.to(session.userA.socketId).emit('chat_ended', endPayload);
        io.to(session.userB.socketId).emit('chat_ended', endPayload);

        sessionService.endSession(sessionId);
        logger.info(`Session ${sessionId} ended due to inactivity`);
    };
}

module.exports = {
    handleJoinQueue,
    handleLeaveQueue,
    handleQueueDisconnect,
};
