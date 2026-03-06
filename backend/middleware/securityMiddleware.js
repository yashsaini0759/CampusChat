/**
 * securityMiddleware.js
 * ─────────────────────────────────────────────────────────────
 * Express security middleware stack applied to every HTTP request.
 *
 * Includes:
 *   • helmet   — sensible security headers
 *   • CORS     — restrict origins to allowed list
 *   • body limits — prevent oversized payloads
 *   • no-sniff / no-cache headers on API responses
 */

'use strict';

const helmet = require('helmet');
const cors = require('cors');
const { allowedOrigins } = require('../config/socketConfig');

/**
 * Build and return the array of Express middleware to apply globally.
 * @returns {import('express').RequestHandler[]}
 */
function buildSecurityMiddleware() {
    return [
        // ── Helmet ────────────────────────────────────────────
        helmet({
            contentSecurityPolicy: {
                directives: {
                    defaultSrc: ["'self'"],
                    connectSrc: ["'self'", ...allowedOrigins],
                },
            },
            crossOriginEmbedderPolicy: false, // relax for Socket.IO
        }),

        // ── CORS ──────────────────────────────────────────────
        cors({
            origin(origin, cb) {
                // Allow requests with no origin (e.g. curl, mobile apps)
                if (!origin) return cb(null, true);
                if (allowedOrigins.includes(origin)) return cb(null, true);
                cb(new Error(`CORS: origin '${origin}' not allowed`));
            },
            methods: ['GET', 'POST'],
            credentials: true,
        }),

        // ── Body size limit ────────────────────────────────────
        require('express').json({ limit: '10kb' }),
        require('express').urlencoded({ extended: false, limit: '10kb' }),

        // ── Disable x-powered-by (belt-and-suspenders after helmet) ──
        (_req, res, next) => {
            res.removeHeader('X-Powered-By');
            next();
        },
    ];
}

module.exports = { buildSecurityMiddleware };
