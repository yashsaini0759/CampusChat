/**
 * socketConfig.js
 * ─────────────────────────────────────────────────────────────
 * Socket.IO server-level configuration factory.
 * Returns the options object passed to new Server(httpServer, options).
 */

'use strict';

const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:5173')
    .split(',')
    .map((o) => o.trim());

/**
 * Build and return Socket.IO server options.
 * @returns {import('socket.io').ServerOptions}
 */
function getSocketConfig() {
    return {
        cors: {
            origin: allowedOrigins,
            methods: ['GET', 'POST'],
            credentials: true,
        },
        // Prefer WebSocket; fall back to long-polling on restrictive networks
        transports: ['websocket', 'polling'],

        // Ping / heartbeat — detect dead connections quickly
        pingTimeout: 20_000,   // 20 s without a pong → disconnect
        pingInterval: 10_000,  // send ping every 10 s

        // Limit incoming message size to reduce amplification attack surface
        maxHttpBufferSize: 1e5, // 100 KB

        // Don't expose server details in handshake
        allowEIO3: false,
    };
}

module.exports = { getSocketConfig, allowedOrigins };
