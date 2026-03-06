/**
 * app.js
 * ─────────────────────────────────────────────────────────────
 * Express application factory.
 *
 * Configures:
 *   • Security middleware (helmet, cors, body limits)
 *   • Health-check + metrics endpoint
 *   • 404 and global error handlers
 *
 * Does NOT listen on a port — that is server.js's responsibility.
 */

'use strict';

const express = require('express');
const { buildSecurityMiddleware } = require('./middleware/securityMiddleware');
const { notFoundHandler, globalErrorHandler } = require('./middleware/errorHandler');
const sessionService = require('./services/sessionService');
const matchingService = require('./services/matchingService');
const logger = require('./utils/logger');

function createApp() {
    const app = express();

    // ── Security middleware ──────────────────────────────────
    buildSecurityMiddleware().forEach((mw) => app.use(mw));

    // ── Routes ───────────────────────────────────────────────

    /** Health check — used by load balancers and uptime monitors */
    app.get('/health', (_req, res) => {
        res.json({
            status: 'ok',
            uptime: Math.floor(process.uptime()),
            timestamp: new Date().toISOString(),
        });
    });

    /**
     * Lightweight metrics endpoint.
     * Safe to expose internally — returns only counts, no PII.
     */
    app.get('/metrics', (_req, res) => {
        res.json({
            activeSessions: sessionService.sessionCount(),
            queueLength: matchingService.queueLength(),
            memoryMB: (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2),
        });
    });

    // ── Error handlers (must be last) ────────────────────────
    app.use(notFoundHandler);
    app.use(globalErrorHandler);

    logger.info('Express app created');
    return app;
}

module.exports = { createApp };
