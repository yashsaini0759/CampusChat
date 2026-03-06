/**
 * securityConfig.js
 * ─────────────────────────────────────────────────────────────
 * Centralised security constants.
 * All tunable limits live here — easy to adjust without
 * hunting through the code-base.
 */

'use strict';

module.exports = {
    // ── Rate Limiting ─────────────────────────────────────────
    /** Maximum Socket.IO events allowed per connection per second */
    RATE_LIMIT_EVENTS_PER_SECOND: Number(process.env.RATE_LIMIT_EVENTS_PER_SECOND) || 10,

    /** Burst tolerance — events allowed above the limit before kick */
    RATE_LIMIT_BURST: 5,

    /** Window (ms) used for rate-limit calculation */
    RATE_LIMIT_WINDOW_MS: 1000,

    // ── Message ───────────────────────────────────────────────
    /** Maximum size of any single message payload in bytes */
    MAX_MESSAGE_BYTES: Number(process.env.MAX_MESSAGE_BYTES) || 4096,

    /** Maximum length of user-supplied strings (name, college) */
    MAX_STRING_LENGTH: 128,

    // ── Session ───────────────────────────────────────────────
    /** Auto-end chat after this many ms of inactivity */
    SESSION_TIMEOUT_MS: Number(process.env.SESSION_TIMEOUT_MS) || 5 * 60 * 1000, // 5 min

    /** Max time a user may sit in the matchmaking queue (ms) */
    QUEUE_TIMEOUT_MS: 10 * 60 * 1000, // 10 min

    // ── Connection ────────────────────────────────────────────
    /** Max simultaneous socket connections (0 = unlimited) */
    MAX_CONNECTIONS: 0,
};
