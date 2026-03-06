/**
 * useSocket.js
 * ─────────────────────────────────────────────────────────────────
 * React hook that manages the socket.io-client connection and
 * all E2E-encrypted messaging.
 *
 * Usage in App.jsx:
 *   const socket = useSocket({ onMatched, onMessage, onChatEnded, onPeerTyping });
 *   socket.connect()
 *   socket.joinQueue({ gender, lookingFor, college, name })
 *   socket.sendMessage(text)
 *   socket.sendTyping(true/false)
 *   socket.endChat()
 *   socket.disconnect()
 */

import { useRef, useCallback } from 'react';
import { io } from 'socket.io-client';
import {
    generateKeyPair,
    deriveSharedKey,
    encrypt,
    decrypt,
} from '../services/cryptoService';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

function nowTime() {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

/**
 * @param {object} callbacks
 * @param {(data: { sessionId, peerCollege }) => void} callbacks.onMatched
 * @param {(msg:  { text, time, id }) => void}         callbacks.onMessage
 * @param {(data: { reason }) => void}                 callbacks.onChatEnded
 * @param {(data: { isTyping }) => void}               callbacks.onPeerTyping
 * @param {(err:  { message }) => void}                callbacks.onError
 */
export function useSocket({ onMatched, onMessage, onChatEnded, onPeerTyping, onError }) {
    const socketRef = useRef(null);
    const keysRef = useRef(null);   // { publicKeyJwk, privateKey }
    const sharedKeyRef = useRef(null);   // CryptoKey (AES-GCM)
    const sessionIdRef = useRef(null);

    // ── Connect ─────────────────────────────────────────────────────
    const connect = useCallback(() => {
        if (socketRef.current?.connected) return;

        const s = io(BACKEND_URL, {
            transports: ['websocket', 'polling'],
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
        });

        s.on('connect', () => console.info('[Socket] Connected:', s.id));
        s.on('connect_error', (err) => {
            console.error('[Socket] Connection error:', err.message);
            onError?.({ message: 'Cannot reach server. Is the backend running?' });
        });

        // ── match_status ─────────────────────────────────────────────
        s.on('match_status', async (data) => {
            if (data.status === 'matched') {
                try {
                    const sharedKey = await deriveSharedKey(
                        keysRef.current.privateKey,
                        data.keyExchange.peerPublicKey
                    );
                    sharedKeyRef.current = sharedKey;
                    sessionIdRef.current = data.sessionId;
                    onMatched({ sessionId: data.sessionId, peerCollege: data.peerCollege, peerName: data.peerName });
                } catch (err) {
                    console.error('[Crypto] Key derivation failed:', err);
                    onError?.({ message: 'Encryption setup failed. Please try again.' });
                }
            }
        });

        // ── receive_message ───────────────────────────────────────────
        s.on('receive_message', async (payload) => {
            if (!sharedKeyRef.current) return;
            try {
                const text = await decrypt(sharedKeyRef.current, payload.ciphertext, payload.iv);
                onMessage({
                    id: payload.timestamp ?? Date.now(),
                    text,
                    time: nowTime(),
                });
            } catch (err) {
                console.error('[Crypto] Decryption failed:', err);
            }
        });

        // ── chat_ended ────────────────────────────────────────────────
        s.on('chat_ended', (data) => {
            sessionIdRef.current = null;
            sharedKeyRef.current = null;
            keysRef.current = null;
            onChatEnded?.(data);
        });

        // ── peer_typing ───────────────────────────────────────────────
        s.on('peer_typing', (data) => {
            onPeerTyping?.(data);
        });

        // ── errors ────────────────────────────────────────────────────
        s.on('queue_error', (d) => onError?.(d));
        s.on('message_error', (d) => console.warn('[Socket] message_error:', d.message));
        s.on('error', (d) => console.error('[Socket] error:', d));

        socketRef.current = s;
    }, [onMatched, onMessage, onChatEnded, onPeerTyping, onError]);

    // ── Join matchmaking queue ───────────────────────────────────────
    const joinQueue = useCallback(async ({ gender, lookingFor, college, name }) => {
        try {
            const keys = await generateKeyPair();
            keysRef.current = keys;

            socketRef.current?.emit('join_queue', {
                gender,
                lookingFor,
                college,
                name,
                publicKey: JSON.stringify(keys.publicKeyJwk),
            });
        } catch (err) {
            console.error('[Crypto] Key generation failed:', err);
            onError?.({ message: 'Could not generate encryption keys.' });
        }
    }, [onError]);

    // ── Find Next Match ──────────────────────────────────────────────
    const findNextMatch = useCallback(async () => {
        try {
            const keys = await generateKeyPair();
            keysRef.current = keys;

            socketRef.current?.emit('find_next_match', {
                publicKey: JSON.stringify(keys.publicKeyJwk),
            });
        } catch (err) {
            console.error('[Crypto] Key generation failed:', err);
            onError?.({ message: 'Could not generate encryption keys.' });
        }
    }, [onError]);

    // ── Leave queue ──────────────────────────────────────────────────
    const leaveQueue = useCallback(() => {
        socketRef.current?.emit('leave_queue');
    }, []);

    // ── Send encrypted message ───────────────────────────────────────
    const sendMessage = useCallback(async (text) => {
        if (!sharedKeyRef.current || !sessionIdRef.current) return false;
        try {
            const { ciphertext, iv } = await encrypt(sharedKeyRef.current, text);
            socketRef.current?.emit('send_message', {
                ciphertext,
                iv,
                sessionId: sessionIdRef.current,
            });
            return true;
        } catch (err) {
            console.error('[Crypto] Encrypt failed:', err);
            return false;
        }
    }, []);

    // ── Typing indicator ─────────────────────────────────────────────
    const sendTyping = useCallback((isTyping) => {
        if (!sessionIdRef.current) return;
        socketRef.current?.emit('typing', {
            sessionId: sessionIdRef.current,
            isTyping,
        });
    }, []);

    // ── End chat ─────────────────────────────────────────────────────
    const endChat = useCallback(() => {
        if (!sessionIdRef.current) return;
        socketRef.current?.emit('end_chat_request', { sessionId: sessionIdRef.current });
        sessionIdRef.current = null;
        sharedKeyRef.current = null;
        keysRef.current = null;
    }, []);

    // ── Disconnect ───────────────────────────────────────────────────
    const disconnect = useCallback(() => {
        sessionIdRef.current = null;
        sharedKeyRef.current = null;
        keysRef.current = null;
        if (socketRef.current) {
            socketRef.current.disconnect();
            socketRef.current = null;
        }
    }, []);

    return { connect, joinQueue, findNextMatch, leaveQueue, sendMessage, sendTyping, endChat, disconnect };
}
