/**
 * sessionService.js
 * ─────────────────────────────────────────────────────────────
 * Ephemeral in-memory session store.
 *
 * ZERO PERSISTENCE — all data exists only in this Map.
 * When the process exits, all sessions are gone.
 * When a session is ended, it is explicitly destroyed.
 *
 * Session schema
 * ─────────────────────────────────────────────────────────────
 * {
 *   sessionId   : string          — UUID v4
 *   userA       : {
 *     socketId  : string,
 *     gender    : string,
 *     college   : string,
 *     name      : string,
 *     publicKey : string          — base64 JWK / raw bytes
 *   }
 *   userB       : { ...same }
 *   startedAt   : number          — Date.now()
 *   lastActivity: number          — updated on each message relay
 *   timeoutId   : Timeout|null    — auto-end timer handle
 * }
 */

'use strict';

const { v4: uuidv4 } = require('uuid');
const logger = require('../utils/logger');
const { SESSION_TIMEOUT_MS } = require('../config/securityConfig');

/** Main session store: sessionId → session */
const sessions = new Map();

/** Reverse lookup: socketId → sessionId */
const socketToSession = new Map();

// ─────────────────────────────────────────────────────────────
// Internal helpers
// ─────────────────────────────────────────────────────────────

/**
 * Clear and remove a session from both maps.
 * @param {string} sessionId
 */
function _destroy(sessionId) {
    const session = sessions.get(sessionId);
    if (!session) return;

    // Clear inactivity timer
    if (session.timeoutId) clearTimeout(session.timeoutId);

    // Remove reverse lookups
    socketToSession.delete(session.userA.socketId);
    socketToSession.delete(session.userB.socketId);

    // Remove session — this clears all message keys and pub-keys from memory
    sessions.delete(sessionId);

    logger.info(`Session destroyed: ${sessionId}`);
}

/**
 * Arm (or re-arm) the inactivity timeout for a session.
 * @param {string} sessionId
 * @param {Function} onTimeout  called when the timer fires
 */
function _armTimeout(sessionId, onTimeout) {
    const session = sessions.get(sessionId);
    if (!session) return;

    if (session.timeoutId) clearTimeout(session.timeoutId);

    session.timeoutId = setTimeout(() => {
        logger.warn(`Session timed out (inactivity): ${sessionId}`);
        onTimeout(sessionId);
    }, SESSION_TIMEOUT_MS);
}

// ─────────────────────────────────────────────────────────────
// Public API
// ─────────────────────────────────────────────────────────────

/**
 * Create a new ephemeral chat session for two matched users.
 *
 * @param {object} userA  — { socketId, gender, college, name, publicKey }
 * @param {object} userB  — { socketId, gender, college, name, publicKey }
 * @param {Function} onTimeout  — called with (sessionId) when idle too long
 * @returns {object} the session object
 */
function createSession(userA, userB, onTimeout) {
    const sessionId = uuidv4();
    const now = Date.now();

    const session = {
        sessionId,
        userA: { ...userA },
        userB: { ...userB },
        startedAt: now,
        lastActivity: now,
        timeoutId: null,
    };

    sessions.set(sessionId, session);
    socketToSession.set(userA.socketId, sessionId);
    socketToSession.set(userB.socketId, sessionId);

    _armTimeout(sessionId, onTimeout);

    logger.info(`Session created: ${sessionId} (${userA.socketId} ↔ ${userB.socketId})`);
    return session;
}

/**
 * Look up a session by its ID.
 * @param {string} sessionId
 * @returns {object|null}
 */
function getSession(sessionId) {
    return sessions.get(sessionId) ?? null;
}

/**
 * Look up the session a given socket belongs to.
 * @param {string} socketId
 * @returns {object|null}
 */
function getSessionBySocket(socketId) {
    const sessionId = socketToSession.get(socketId);
    if (!sessionId) return null;
    return sessions.get(sessionId) ?? null;
}

/**
 * Given a socket ID, return the peer's socket ID within the same session.
 * @param {string} socketId
 * @returns {string|null}
 */
function getPeerSocketId(socketId) {
    const session = getSessionBySocket(socketId);
    if (!session) return null;
    return session.userA.socketId === socketId
        ? session.userB.socketId
        : session.userA.socketId;
}

/**
 * Touch lastActivity and re-arm the inactivity timer.
 * Call this whenever a message is relayed.
 * @param {string} sessionId
 * @param {Function} onTimeout
 */
function touchSession(sessionId, onTimeout) {
    const session = sessions.get(sessionId);
    if (!session) return;
    session.lastActivity = Date.now();
    _armTimeout(sessionId, onTimeout);
}

/**
 * End and destroy a session, freeing all memory.
 * @param {string} sessionId
 */
function endSession(sessionId) {
    _destroy(sessionId);
}

/**
 * End the session associated with a given socket (on disconnect).
 * @param {string} socketId
 * @returns {string|null} the destroyed sessionId, or null if none
 */
function endSessionBySocket(socketId) {
    const sessionId = socketToSession.get(socketId);
    if (!sessionId) return null;
    _destroy(sessionId);
    return sessionId;
}

/** Return the number of active sessions (for health checks). */
function sessionCount() {
    return sessions.size;
}

module.exports = {
    createSession,
    getSession,
    getSessionBySocket,
    getPeerSocketId,
    touchSession,
    endSession,
    endSessionBySocket,
    sessionCount,
};
