/**
 * server.js
 * ─────────────────────────────────────────────────────────────
 * Application entry point.
 *
 *   HTTP Server  (Node.js http module)
 *     └── Express app   (app.js)
 *     └── Socket.IO     (socket.io)
 *           └── socketHandler  (sockets/socketHandler.js)
 *
 * Start with:
 *   node server.js
 *   npm run dev      (uses nodemon)
 */

'use strict';

require('dotenv').config();

const http = require('http');
const { Server: SocketServer } = require('socket.io');

const { createApp } = require('./app');
const { getSocketConfig } = require('./config/socketConfig');
const { initSocketHandler } = require('./sockets/socketHandler');
const logger = require('./utils/logger');

// ── Configuration ────────────────────────────────────────────
const PORT = Number(process.env.PORT) || 3001;
const NODE_ENV = process.env.NODE_ENV || 'development';

// ── Build HTTP + Socket.IO server ────────────────────────────
const app = createApp();
const httpServer = http.createServer(app);
const io = new SocketServer(httpServer, getSocketConfig());

// ── Attach socket handler ────────────────────────────────────
initSocketHandler(io);

// ── Start listening ──────────────────────────────────────────
httpServer.listen(PORT, () => {
    logger.info(`╔═══════════════════════════════════════╗`);
    logger.info(`║  ChatCampus Backend  •  ${NODE_ENV.padEnd(12)}║`);
    logger.info(`║  Listening on port ${String(PORT).padEnd(18)}║`);
    logger.info(`║  Health:  http://localhost:${PORT}/health ║`);
    logger.info(`║  Metrics: http://localhost:${PORT}/metrics║`);
    logger.info(`╚═══════════════════════════════════════╝`);
});

// ── Graceful shutdown ────────────────────────────────────────
function shutdown(signal) {
    logger.warn(`Received ${signal} — shutting down gracefully`);

    // Stop accepting new connections
    httpServer.close(() => {
        logger.info('HTTP server closed');
        process.exit(0);
    });

    // Force exit after 10 s if pending handles don't close
    setTimeout(() => {
        logger.error('Forced shutdown after timeout');
        process.exit(1);
    }, 10_000).unref();
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

process.on('uncaughtException', (err) => {
    logger.error('Uncaught exception:', err.message);
    process.exit(1);
});

process.on('unhandledRejection', (reason) => {
    logger.error('Unhandled rejection:', reason);
});

module.exports = { httpServer, io }; // exported for testing
