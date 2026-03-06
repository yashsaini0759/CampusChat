/**
 * validation.js
 * ─────────────────────────────────────────────────────────────
 * Input sanitisation and validation helpers.
 * All user-supplied data must pass through these before use.
 */

'use strict';

const { MAX_STRING_LENGTH, MAX_MESSAGE_BYTES } = require('../config/securityConfig');

/** Allowed gender/lookingFor values */
const VALID_GENDERS = new Set(['He', 'She', 'Others']);

/**
 * Trim + cap a string field.
 * @param {unknown} val
 * @param {number} [max=MAX_STRING_LENGTH]
 * @returns {string|null}  null when invalid
 */
function sanitiseString(val, max = MAX_STRING_LENGTH) {
    if (typeof val !== 'string') return null;
    const trimmed = val.trim();
    if (trimmed.length === 0 || trimmed.length > max) return null;
    return trimmed;
}

/**
 * Validate a gender token.
 * @param {unknown} gender
 * @returns {boolean}
 */
function isValidGender(gender) {
    return typeof gender === 'string' && VALID_GENDERS.has(gender);
}

/**
 * Validate an encrypted message payload object.
 * The server never reads the ciphertext — just ensures the
 * envelope is well-formed and not oversized.
 * @param {unknown} payload
 * @returns {{ valid: boolean, reason?: string }}
 */
function validateMessagePayload(payload) {
    if (!payload || typeof payload !== 'object') {
        return { valid: false, reason: 'Payload must be an object' };
    }

    const { ciphertext, iv, sessionId } = payload;

    if (typeof ciphertext !== 'string' || ciphertext.length === 0) {
        return { valid: false, reason: 'Missing ciphertext' };
    }
    if (typeof iv !== 'string' || iv.length === 0) {
        return { valid: false, reason: 'Missing iv' };
    }
    if (typeof sessionId !== 'string' || sessionId.length === 0) {
        return { valid: false, reason: 'Missing sessionId' };
    }

    // Size guard — measure approximate byte length
    const payloadSize = Buffer.byteLength(JSON.stringify(payload), 'utf8');
    if (payloadSize > MAX_MESSAGE_BYTES) {
        return { valid: false, reason: `Payload exceeds ${MAX_MESSAGE_BYTES} bytes` };
    }

    return { valid: true };
}

/**
 * Validate a public key payload sent during key exchange.
 * @param {unknown} val
 * @returns {boolean}
 */
function isValidPublicKey(val) {
    // Public keys arrive as base64-encoded JWK strings or raw bytes
    if (typeof val !== 'string') return false;
    if (val.length < 10 || val.length > 2048) return false;
    return true;
}

/**
 * Validate a join-queue payload.
 * @param {unknown} data
 * @returns {{ valid: boolean, reason?: string, cleaned?: object }}
 */
function validateQueuePayload(data) {
    if (!data || typeof data !== 'object') {
        return { valid: false, reason: 'Payload must be an object' };
    }

    const gender = sanitiseString(data.gender);
    const lookingFor = sanitiseString(data.lookingFor);
    const college = sanitiseString(data.college) ?? 'Unknown';
    const name = sanitiseString(data.name) ?? 'Anonymous';
    const publicKey = data.publicKey;

    if (!isValidGender(gender)) {
        return { valid: false, reason: `Invalid gender: must be one of ${[...VALID_GENDERS].join(', ')}` };
    }
    if (!isValidGender(lookingFor)) {
        return { valid: false, reason: `Invalid lookingFor: must be one of ${[...VALID_GENDERS].join(', ')}` };
    }
    if (!isValidPublicKey(publicKey)) {
        return { valid: false, reason: 'Invalid or missing public key' };
    }

    return {
        valid: true,
        cleaned: { gender, lookingFor, college, name, publicKey },
    };
}

module.exports = {
    sanitiseString,
    isValidGender,
    isValidPublicKey,
    validateMessagePayload,
    validateQueuePayload,
    VALID_GENDERS,
};
