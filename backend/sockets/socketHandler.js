/**
 * socketHandler.js
 * ─────────────────────────────────────────────────────────────
 * Master socket connection handler.
 * Runs once per new socket connection.
 *
 * Responsibilities:
 *   1. Initialise a rate-limit bucket for the socket
 *   2. Register all event categories (match, chat)
 *   3. Handle the built-in 'disconnect' event
 */

'use strict';

const { createBucket, destroyBucket } = require('../utils/rateLimiter');
const { registerMatchEvents } = require('./matchSocket');
const { registerChatEvents } = require('./chatSocket');
const chatController = require('../controllers/chatController');
const matchController = require('../controllers/matchController');
const logger = require('../utils/logger');

/**
 * Attach to a Socket.IO server instance.
 * @param {import('socket.io').Server} io
 */
function initSocketHandler(io) {
    io.on('connection', (socket) => {
        logger.info(`Socket connected: ${socket.id} (origin: ${socket.handshake.headers.origin ?? 'unknown'})`);

        // Initialise rate-limit token bucket for this connection
        createBucket(socket.id);

        // Register event namespaces
        registerMatchEvents(socket, io);
        registerChatEvents(socket, io);

        // ── Disconnect ──────────────────────────────────────────
        socket.on('disconnect', (reason) => {
            logger.info(`Socket disconnecting: ${socket.id} — reason: ${reason}`);

            // Clean queue & session
            matchController.handleQueueDisconnect(socket.id);
            chatController.handleDisconnect(socket, io);

            // Free rate-limit bucket
            destroyBucket(socket.id);
        });

        // ── Error guard ─────────────────────────────────────────
        socket.on('error', (err) => {
            logger.error(`Socket error on ${socket.id}:`, err.message);
        });
    });

    logger.info('Socket handler initialised');
}

module.exports = { initSocketHandler };
