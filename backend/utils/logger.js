/**
 * logger.js
 * ─────────────────────────────────────────────────────────────
 * Lightweight levelled console logger.
 * Levels: DEBUG < INFO < WARN < ERROR
 *
 * No third-party dependency — uses only the Node.js built-in
 * console with ISO timestamps and ANSI colour codes.
 *
 * IMPORTANT: This logger NEVER logs message contents or user
 * identifiers — only operational metadata (socket IDs, events).
 */

'use strict';

const isDev = process.env.NODE_ENV !== 'production';

const COLOURS = {
    reset: '\x1b[0m',
    dim: '\x1b[2m',
    cyan: '\x1b[36m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    red: '\x1b[31m',
};

function timestamp() {
    return new Date().toISOString();
}

function format(level, colour, ...args) {
    const ts = `${COLOURS.dim}${timestamp()}${COLOURS.reset}`;
    const lv = `${colour}[${level}]${COLOURS.reset}`;
    return [ts, lv, ...args];
}

const logger = {
    debug(...args) {
        if (isDev) console.debug(...format('DEBUG', COLOURS.cyan, ...args));
    },
    info(...args) {
        console.info(...format('INFO ', COLOURS.green, ...args));
    },
    warn(...args) {
        console.warn(...format('WARN ', COLOURS.yellow, ...args));
    },
    error(...args) {
        console.error(...format('ERROR', COLOURS.red, ...args));
    },
};

module.exports = logger;
