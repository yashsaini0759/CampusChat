/**
 * matchingService.js
 * ─────────────────────────────────────────────────────────────
 * In-memory matchmaking queue with gender-based compatibility.
 *
 * ┌─────────────────────────────────────────────────────────┐
 * │  MATCHING RULES                                         │
 * │                                                         │
 * │  Two users A and B match when:                          │
 * │    A.lookingFor === B.gender  AND                       │
 * │    B.lookingFor === A.gender                            │
 * │                                                         │
 * │  Special case — "Others":                               │
 * │    A user whose gender/lookingFor is "Others" is        │
 * │    compatible with anyone who is looking for "Others"   │
 * │    or whose lookingFor matches.                         │
 * └─────────────────────────────────────────────────────────┘
 *
 * Queue entry schema
 * ─────────────────────────────────────────────────────────────
 * {
 *   socketId   : string
 *   gender     : 'He' | 'She' | 'Others'
 *   lookingFor : 'He' | 'She' | 'Others'
 *   college    : string
 *   name       : string
 *   publicKey  : string
 *   joinedAt   : number  — timestamp for queue-timeout eviction
 * }
 */

'use strict';

const logger = require('../utils/logger');
const { QUEUE_TIMEOUT_MS } = require('../config/securityConfig');

/** Main matchmaking queue — ordered by joinedAt ascending */
const queue = [];

// ─────────────────────────────────────────────────────────────
// Compatibility check
// ─────────────────────────────────────────────────────────────

/**
 * Return true if userA and userB are mutually compatible.
 *
 * Compatibility is bidirectional:
 *   A looks for B's gender  AND  B looks for A's gender.
 *
 * @param {object} a
 * @param {object} b
 * @returns {boolean}
 */
function isCompatible(a, b) {
    // A socket cannot match with itself (safety guard)
    if (a.socketId === b.socketId) return false;

    const aWantsB = a.lookingFor === b.gender;
    const bWantsA = b.lookingFor === a.gender;

    return aWantsB && bWantsA;
}

// ─────────────────────────────────────────────────────────────
// Queue operations
// ─────────────────────────────────────────────────────────────

/**
 * Add a user to the matchmaking queue.
 * If the user is already in the queue (reconnect scenario), update them.
 *
 * @param {object} user — validated queue entry
 */
function enqueue(user) {
    // Remove any existing entry for this socket (idempotent)
    dequeue(user.socketId);

    queue.push({ ...user, joinedAt: Date.now() });
    logger.info(`Enqueued: ${user.socketId} (gender=${user.gender} lookingFor=${user.lookingFor}) | queue size: ${queue.length}`);
}

/**
 * Remove a user from the queue by socket ID.
 * @param {string} socketId
 * @returns {boolean}  true if the entry was found and removed
 */
function dequeue(socketId) {
    const idx = queue.findIndex((u) => u.socketId === socketId);
    if (idx === -1) return false;
    queue.splice(idx, 1);
    logger.info(`Dequeued: ${socketId} | queue size: ${queue.length}`);
    return true;
}

/**
 * Check whether a socket is currently in the queue.
 * @param {string} socketId
 * @returns {boolean}
 */
function isWaiting(socketId) {
    return queue.some((u) => u.socketId === socketId);
}

/**
 * Attempt to find a compatible match for the given user.
 *
 * Searches the queue in FIFO order — longest-waiting users
 * get priority.
 *
 * Returns BOTH matched entries and removes them from the queue.
 *
 * @param {object} incoming — the newly enqueued user
 * @returns {{ userA: object, userB: object } | null}
 */
function findMatch(incoming) {
    // Scan queue for the first compatible peer
    const peerIdx = queue.findIndex(
        (candidate) =>
            candidate.socketId !== incoming.socketId &&
            isCompatible(incoming, candidate)
    );

    if (peerIdx === -1) return null;

    const peer = queue[peerIdx];

    // Remove both from the queue
    dequeue(incoming.socketId);
    dequeue(peer.socketId);

    logger.info(`Match found: ${incoming.socketId} ↔ ${peer.socketId}`);
    return { userA: incoming, userB: peer };
}

// ─────────────────────────────────────────────────────────────
// Queue housekeeping
// ─────────────────────────────────────────────────────────────

/**
 * Evict users who have been waiting longer than QUEUE_TIMEOUT_MS.
 * Returns an array of evicted socket IDs so callers can notify them.
 *
 * @returns {string[]}
 */
function evictStaleEntries() {
    const now = Date.now();
    const evicted = [];

    for (let i = queue.length - 1; i >= 0; i--) {
        if (now - queue[i].joinedAt > QUEUE_TIMEOUT_MS) {
            evicted.push(queue[i].socketId);
            queue.splice(i, 1);
        }
    }

    if (evicted.length > 0) {
        logger.warn(`Evicted ${evicted.length} stale queue entries`);
    }

    return evicted;
}

/** Return current queue length (for health checks / metrics). */
function queueLength() {
    return queue.length;
}

// Run housekeeping every 2 minutes
setInterval(evictStaleEntries, 2 * 60 * 1000);

module.exports = {
    enqueue,
    dequeue,
    isWaiting,
    findMatch,
    evictStaleEntries,
    queueLength,
};
