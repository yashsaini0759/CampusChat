/**
 * chatController.js
 * ─────────────────────────────────────────────────────────────
 * Handles in-session events:
 *   • message relay        (server never reads ciphertext)
 *   • typing indicators
 *   • end chat
 *   • disconnect
 *
 * The server acts as a BLIND RELAY for all message payloads.
 */

'use strict';

const sessionService = require('../services/sessionService');
const matchingService = require('../services/matchingService');
const { validateMessagePayload } = require('../utils/validation');
const logger = require('../utils/logger');

// ─────────────────────────────────────────────────────────────
// Message relay
// ─────────────────────────────────────────────────────────────

/**
 * Relay an encrypted message payload from sender to peer.
 * The server validates only the ENVELOPE — never the ciphertext.
 *
 * @param {import('socket.io').Socket} socket
 * @param {import('socket.io').Server} io
 * @param {object} payload  — { ciphertext, iv, sessionId }
 */
function handleSendMessage(socket, io, payload) {
    const { valid, reason } = validateMessagePayload(payload);

    if (!valid) {
        socket.emit('message_error', { message: reason });
        logger.warn(`Invalid message payload from ${socket.id}: ${reason}`);
        return;
    }

    const session = sessionService.getSession(payload.sessionId);

    if (!session) {
        socket.emit('message_error', { message: 'Session not found or already ended' });
        return;
    }

    // Ensure the sender belongs to this session
    if (
        session.userA.socketId !== socket.id &&
        session.userB.socketId !== socket.id
    ) {
        socket.emit('message_error', { message: 'Unauthorised: not a member of this session' });
        logger.warn(`Unauthorised send attempt by ${socket.id} for session ${payload.sessionId}`);
        return;
    }

    const peerSocketId = sessionService.getPeerSocketId(socket.id);
    if (!peerSocketId) {
        socket.emit('message_error', { message: 'Peer disconnected' });
        return;
    }

    // Forward ONLY the encrypted envelope — no plaintext ever touches the server
    io.to(peerSocketId).emit('receive_message', {
        ciphertext: payload.ciphertext,   // opaque blob
        iv: payload.iv,           // initialisation vector for AES-GCM
        sessionId: payload.sessionId,
        timestamp: Date.now(),           // server timestamp for ordering
    });

    // Refresh session inactivity timer
    sessionService.touchSession(payload.sessionId, _buildTimeoutHandler(io));
}

// ─────────────────────────────────────────────────────────────
// Typing indicator
// ─────────────────────────────────────────────────────────────

/**
 * Relay a typing indicator to the peer.
 * @param {import('socket.io').Socket} socket
 * @param {import('socket.io').Server} io
 * @param {{ sessionId: string, isTyping: boolean }} data
 */
function handleTyping(socket, io, data) {
    if (!data || typeof data.sessionId !== 'string') return;

    const peerSocketId = sessionService.getPeerSocketId(socket.id);
    if (!peerSocketId) return;

    io.to(peerSocketId).emit('peer_typing', {
        isTyping: Boolean(data.isTyping),
        sessionId: data.sessionId,
    });
}

// ─────────────────────────────────────────────────────────────
// End chat
// ─────────────────────────────────────────────────────────────

/**
 * Handle a user pressing "End".
 * Notifies the peer, destroys the session.
 *
 * @param {import('socket.io').Socket} socket
 * @param {import('socket.io').Server} io
 * @param {{ sessionId: string }} data
 */
function handleEndChat(socket, io, data) {
    const sessionId = data?.sessionId;
    if (!sessionId) {
        // Try to find session by socket
        const session = sessionService.getSessionBySocket(socket.id);
        if (session) _teardown(io, session.sessionId, 'user_ended');
        return;
    }

    const session = sessionService.getSession(sessionId);
    if (!session) return;

    // Validate caller is part of the session
    if (
        session.userA.socketId !== socket.id &&
        session.userB.socketId !== socket.id
    ) {
        return;
    }

    _teardown(io, sessionId, 'user_ended', socket.id);
}

// ─────────────────────────────────────────────────────────────
// Disconnect
// ─────────────────────────────────────────────────────────────

/**
 * Called when any socket disconnects.
 * Cleans up queue membership and active sessions.
 *
 * @param {import('socket.io').Socket} socket
 * @param {import('socket.io').Server} io
 */
function handleDisconnect(socket, io) {
    logger.info(`Socket disconnected: ${socket.id}`);

    // Remove from matchmaking queue if waiting
    matchingService.dequeue(socket.id);

    // If in an active session, notify peer and destroy
    const session = sessionService.getSessionBySocket(socket.id);
    if (session) {
        const peerSocketId = sessionService.getPeerSocketId(socket.id);
        if (peerSocketId) {
            io.to(peerSocketId).emit('chat_ended', {
                sessionId: session.sessionId,
                reason: 'peer_disconnected',
            });
        }
        sessionService.endSession(session.sessionId);
    }
}

// ─────────────────────────────────────────────────────────────
// Internal
// ─────────────────────────────────────────────────────────────

function _teardown(io, sessionId, reason, initiatorSocketId = null) {
    const session = sessionService.getSession(sessionId);
    if (!session) return;

    // Distinguish reason based on who initiated
    const payloadForA = { sessionId, reason: (initiatorSocketId === session.userA.socketId) ? 'you_disconnected' : reason };
    const payloadForB = { sessionId, reason: (initiatorSocketId === session.userB.socketId) ? 'you_disconnected' : reason };

    io.to(session.userA.socketId).emit('chat_ended', payloadForA);
    io.to(session.userB.socketId).emit('chat_ended', payloadForB);

    sessionService.endSession(sessionId);
    logger.info(`Session ${sessionId} ended — reason: ${reason}`);
}

function _buildTimeoutHandler(io) {
    return (sessionId) => {
        _teardown(io, sessionId, 'inactivity_timeout');
    };
}

module.exports = {
    handleSendMessage,
    handleTyping,
    handleEndChat,
    handleDisconnect,
};
