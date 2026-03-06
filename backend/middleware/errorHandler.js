/**
 * errorHandler.js
 * ─────────────────────────────────────────────────────────────
 * Global Express error handler.
 * Must be registered LAST in the middleware chain.
 *
 * Catches:
 *   • sync throws in route handlers
 *   • errors forwarded via next(err)
 *   • CORS errors
 *
 * NEVER exposes stack traces in production.
 */

'use strict';

const logger = require('../utils/logger');

/**
 * 404 handler — no route matched.
 * @type {import('express').RequestHandler}
 */
function notFoundHandler(req, res) {
    res.status(404).json({ error: 'Not found' });
}

/**
 * Global error handler.
 * @type {import('express').ErrorRequestHandler}
 */
// eslint-disable-next-line no-unused-vars
function globalErrorHandler(err, req, res, next) {
    const status = err.status ?? err.statusCode ?? 500;
    const isProd = process.env.NODE_ENV === 'production';

    logger.error(`[${req.method} ${req.path}] ${err.message}`);

    res.status(status).json({
        error: isProd ? 'An error occurred' : err.message,
        ...(isProd ? {} : { stack: err.stack }),
    });
}

module.exports = { notFoundHandler, globalErrorHandler };
