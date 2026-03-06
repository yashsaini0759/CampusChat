/**
 * cryptoService.js
 * ─────────────────────────────────────────────────────────────────
 * Browser-side ECDH + AES-GCM E2E encryption using the Web Crypto API.
 *
 * Flow (per-session):
 *   1. generateKeyPair()          — client generates ECDH P-256 key pair
 *   2. publicKeyJwk sent to server on join_queue
 *   3. Server sends peer's publicKeyJwk on match
 *   4. deriveSharedKey()          — ECDH → AES-GCM-256 shared key
 *   5. encrypt() before sending   — server only sees ciphertext
 *   6. decrypt() on receive       — only the two peers can decrypt
 *
 * The private key is NEVER exported or sent anywhere.
 */

// ── helpers ──────────────────────────────────────────────────────

const base64 = {
    encode: (buf) => btoa(String.fromCharCode(...new Uint8Array(buf))),
    decode: (str) => Uint8Array.from(atob(str), (c) => c.charCodeAt(0)),
};

// ── Key generation ───────────────────────────────────────────────

/**
 * Generate an ECDH P-256 key pair.
 * @returns {{ publicKeyJwk: object, privateKey: CryptoKey }}
 */
export async function generateKeyPair() {
    const keyPair = await window.crypto.subtle.generateKey(
        { name: 'ECDH', namedCurve: 'P-256' },
        true,                      // exportable (public key only)
        ['deriveKey']
    );

    const publicKeyJwk = await window.crypto.subtle.exportKey('jwk', keyPair.publicKey);

    return { publicKeyJwk, privateKey: keyPair.privateKey };
}

// ── Shared key derivation ─────────────────────────────────────────

/**
 * Derive a shared AES-GCM-256 key from our private key + peer's public JWK.
 * @param {CryptoKey}     privateKey       — our ECDH private key
 * @param {string|object} peerPublicKeyJwk — JSON string or object
 * @returns {CryptoKey}  AES-GCM key usable for encrypt/decrypt
 */
export async function deriveSharedKey(privateKey, peerPublicKeyJwk) {
    const jwk = typeof peerPublicKeyJwk === 'string'
        ? JSON.parse(peerPublicKeyJwk)
        : peerPublicKeyJwk;

    const peerPublicKey = await window.crypto.subtle.importKey(
        'jwk',
        jwk,
        { name: 'ECDH', namedCurve: 'P-256' },
        false,
        []   // public keys have no usages
    );

    return window.crypto.subtle.deriveKey(
        { name: 'ECDH', public: peerPublicKey },
        privateKey,
        { name: 'AES-GCM', length: 256 },
        false,
        ['encrypt', 'decrypt']
    );
}

// ── Encrypt ───────────────────────────────────────────────────────

/**
 * Encrypt a plaintext string with AES-GCM.
 * @param {CryptoKey} sharedKey
 * @param {string}    plaintext
 * @returns {{ ciphertext: string, iv: string }}  both base64-encoded
 */
export async function encrypt(sharedKey, plaintext) {
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const encoded = new TextEncoder().encode(plaintext);

    const cipherbuf = await window.crypto.subtle.encrypt(
        { name: 'AES-GCM', iv },
        sharedKey,
        encoded
    );

    return {
        ciphertext: base64.encode(cipherbuf),
        iv: base64.encode(iv.buffer),
    };
}

// ── Decrypt ───────────────────────────────────────────────────────

/**
 * Decrypt an AES-GCM ciphertext.
 * @param {CryptoKey} sharedKey
 * @param {string}    ciphertext  base64
 * @param {string}    iv          base64
 * @returns {string}  plaintext
 */
export async function decrypt(sharedKey, ciphertext, iv) {
    const plaintextBuf = await window.crypto.subtle.decrypt(
        { name: 'AES-GCM', iv: base64.decode(iv) },
        sharedKey,
        base64.decode(ciphertext)
    );

    return new TextDecoder().decode(plaintextBuf);
}
