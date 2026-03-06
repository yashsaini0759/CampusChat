/**
 * encryptionService.js
 * ─────────────────────────────────────────────────────────────
 * Public-key exchange helper for end-to-end encryption.
 *
 * ┌─────────────────────────────────────────────────────────┐
 * │  ARCHITECTURE                                           │
 * │                                                         │
 * │  1. Each browser generates an ECDH key pair             │
 * │     (P-256 / WebCrypto API).                            │
 * │  2. Client sends their PUBLIC key on join_queue.        │
 * │  3. On match, the server sends EACH user the OTHER'S    │
 * │     public key.  (key exchange event)                   │
 * │  4. Both sides derive a shared AES-GCM key via ECDH.   │
 * │  5. All subsequent messages are AES-GCM encrypted.      │
 * │  6. The server forwards ciphertext blobs — NEVER the    │
 * │     plaintext.                                          │
 * │                                                         │
 * │  The server:                                            │
 * │    • stores public keys only for the session lifetime   │
 * │    • CANNOT derive the shared key (no private keys)     │
 * │    • CANNOT decrypt any message                         │
 * └─────────────────────────────────────────────────────────┘
 */

'use strict';

const logger = require('../utils/logger');

/**
 * Build the key-exchange payload that is sent to each peer
 * at the start of a session.
 *
 * @param {object} session   — from sessionService.createSession()
 * @param {string} recipientSocketId
 * @returns {{ peerPublicKey: string, sessionId: string }}
 */
function buildKeyExchangePayload(session, recipientSocketId) {
    const isUserA = session.userA.socketId === recipientSocketId;
    const peerPublicKey = isUserA
        ? session.userB.publicKey
        : session.userA.publicKey;

    return {
        sessionId: session.sessionId,
        peerPublicKey,               // Send the PEER's public key — not your own
        algorithm: 'ECDH-AES-GCM-256', // Hint to the client about the expected algo
    };
}

/**
 * Validate that a public key field looks like a valid exported
 * WebCrypto JWK JSON string.
 *
 * This is a lightweight structural check — the server does not
 * actually import or use the key.
 *
 * @param {string} publicKey
 * @returns {boolean}
 */
function looksLikeJWK(publicKey) {
    if (typeof publicKey !== 'string') return false;
    try {
        const parsed = JSON.parse(publicKey);
        // A WebCrypto ECDH JWK must have at minimum: kty, crv, x, y
        return (
            parsed &&
            parsed.kty === 'EC' &&
            typeof parsed.x === 'string' &&
            typeof parsed.y === 'string'
        );
    } catch {
        return false;
    }
}

/**
 * Log a key-exchange event at the info level.
 * Does NOT log the key material.
 * @param {string} sessionId
 */
function logKeyExchange(sessionId) {
    logger.info(`Key exchange completed for session: ${sessionId}`);
}

module.exports = {
    buildKeyExchangePayload,
    looksLikeJWK,
    logKeyExchange,
};
