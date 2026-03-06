/**
 * rateLimiter.js
 * ─────────────────────────────────────────────────────────────
 * Per-socket in-memory rate limiter using a sliding token-bucket.
 *
 * Each socket connection gets its own bucket.
 * Tokens refill at the configured rate.
 * If a socket exhausts its tokens it receives a RATE_LIMITED
 * error and — after repeated violations — is disconnected.
 */

'use strict';

const { RATE_LIMIT_EVENTS_PER_SECOND, RATE_LIMIT_BURST } = require('../config/securityConfig');
const logger = require('./logger');

/** socketId → { tokens, lastRefill, violations } */
const buckets = new Map();

/** Maximum tokens a bucket can hold */
const MAX_TOKENS = RATE_LIMIT_EVENTS_PER_SECOND + RATE_LIMIT_BURST;

/** Violations before forced disconnect */
const MAX_VIOLATIONS = 20;

/**
 * Refill a bucket pro-rata since last call.
 * @param {object} bucket
 */
function refill(bucket) {
    const now = Date.now();
    const elapsed = (now - bucket.lastRefill) / 1000; // seconds
    bucket.tokens = Math.min(MAX_TOKENS, bucket.tokens + elapsed * RATE_LIMIT_EVENTS_PER_SECOND);
    bucket.lastRefill = now;
}

/**
 * Initialise a bucket for a new socket connection.
 * @param {string} socketId
 */
function createBucket(socketId) {
    buckets.set(socketId, {
        tokens: MAX_TOKENS,
        lastRefill: Date.now(),
        violations: 0,
    });
}

/**
 * Destroy the bucket when the socket disconnects.
 * @param {string} socketId
 */
function destroyBucket(socketId) {
    buckets.delete(socketId);
}

/**
 * Consume one token for the given socket.
 * Returns true if the event is allowed, false if rate-limited.
 *
 * Also returns a `shouldDisconnect` flag when violations are excessive.
 *
 * @param {string} socketId
 * @returns {{ allowed: boolean, shouldDisconnect: boolean }}
 */
function consume(socketId) {
    let bucket = buckets.get(socketId);
    if (!bucket) {
        // Bucket not found — create one on the fly (shouldn't happen normally)
        createBucket(socketId);
        bucket = buckets.get(socketId);
    }

    refill(bucket);

    if (bucket.tokens >= 1) {
        bucket.tokens -= 1;
        // Reset violations on successful request
        bucket.violations = Math.max(0, bucket.violations - 1);
        return { allowed: true, shouldDisconnect: false };
    }

    // Rate limited
    bucket.violations += 1;
    logger.warn(`Rate limit hit — socket ${socketId} (violations: ${bucket.violations})`);

    const shouldDisconnect = bucket.violations >= MAX_VIOLATIONS;
    return { allowed: false, shouldDisconnect };
}

/**
 * Middleware factory for Socket.IO.
 * Wraps a socket event handler with rate-limit enforcement.
 *
 * Usage:
 *   socket.on('some_event', withRateLimit(socket, (data) => { ... }));
 *
 * @param {import('socket.io').Socket} socket
 * @param {Function} handler
 * @returns {Function}
 */
function withRateLimit(socket, handler) {
    return function rateLimitedHandler(...args) {
        const { allowed, shouldDisconnect } = consume(socket.id);

        if (!allowed) {
            socket.emit('error', { code: 'RATE_LIMITED', message: 'Slow down!' });
            if (shouldDisconnect) {
                logger.warn(`Disconnecting socket ${socket.id} — too many violations`);
                socket.disconnect(true);
            }
            return;
        }

        try {
            handler(...args);
        } catch (err) {
            logger.error(`Unhandled error in handler for ${socket.id}:`, err.message);
        }
    };
}

module.exports = { createBucket, destroyBucket, consume, withRateLimit };
