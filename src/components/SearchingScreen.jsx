/**
 * SearchingScreen.jsx
 * ─────────────────────────────────────────────────────────────────
 * Full-screen animated "finding a match" screen.
 * Shown while the server is searching for a compatible chat partner.
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const EMOJIS = ['🔍', '💬', '✨', '👀', '🎯', '💫', '🌟', '💌'];

const TIPS = [
    'Looking for someone from your college universe…',
    'Finding the perfect chat partner…',
    'Matching preferences across campuses…',
    'Almost there, hold tight!',
    'Good things take a moment…',
];

export default function SearchingScreen({ onCancel }) {
    const [emojiIdx, setEmojiIdx] = useState(0);
    const [tipIdx, setTipIdx] = useState(0);
    const [dots, setDots] = useState('');

    // rotating emoji
    useEffect(() => {
        const t = setInterval(() => {
            setEmojiIdx((i) => (i + 1) % EMOJIS.length);
        }, 800);
        return () => clearInterval(t);
    }, []);

    // rotating tip
    useEffect(() => {
        const t = setInterval(() => {
            setTipIdx((i) => (i + 1) % TIPS.length);
        }, 3000);
        return () => clearInterval(t);
    }, []);

    // animated dots
    useEffect(() => {
        const t = setInterval(() => {
            setDots((d) => (d.length >= 3 ? '' : d + '.'));
        }, 450);
        return () => clearInterval(t);
    }, []);

    return (
        <div style={{
            position: 'fixed', inset: 0,
            background: '#f5e8d5',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            fontFamily: 'Patrick Hand, cursive',
            overflow: 'hidden',
        }}>
            {/* Paper-texture overlay */}
            <div style={{
                position: 'absolute', inset: 0, pointerEvents: 'none',
                backgroundImage:
                    'radial-gradient(circle at 20% 20%, rgba(255,240,200,0.3) 0%, transparent 60%),' +
                    'radial-gradient(circle at 80% 80%, rgba(255,200,180,0.2) 0%, transparent 50%)',
            }} />

            {/* Pink corner blob */}
            <div style={{
                position: 'absolute', bottom: -40, left: -40,
                width: 180, height: 140,
                background: '#f4a0b0', borderRadius: '60% 40% 70% 30%',
                opacity: 0.6, transform: 'rotate(-10deg)', pointerEvents: 'none',
            }} />
            <div style={{
                position: 'absolute', top: -30, right: -30,
                width: 140, height: 110,
                background: '#b8d8f0', borderRadius: '40% 60% 30% 70%',
                opacity: 0.5, transform: 'rotate(15deg)', pointerEvents: 'none',
            }} />

            {/* Main card */}
            <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.92 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: 'spring', stiffness: 280, damping: 22 }}
                style={{
                    position: 'relative', zIndex: 10,
                    background: '#fff',
                    border: '2.5px solid #333',
                    borderRadius: 20,
                    padding: '40px 36px 32px',
                    width: 'min(88vw, 340px)',
                    textAlign: 'center',
                    boxShadow: '6px 8px 0 rgba(0,0,0,0.13)',
                }}
            >
                {/* Tape strip on top */}
                <div style={{
                    position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)',
                    width: 72, height: 18,
                    background: '#f5c842', opacity: 0.85,
                    borderRadius: 4, boxShadow: '0 1px 4px rgba(0,0,0,0.12)',
                }} />

                {/* Rotating emoji */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={emojiIdx}
                        initial={{ opacity: 0, scale: 0.5, rotate: -20 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        exit={{ opacity: 0, scale: 0.5, rotate: 20 }}
                        transition={{ duration: 0.3 }}
                        style={{ fontSize: 64, marginBottom: 16, display: 'block' }}
                    >
                        {EMOJIS[emojiIdx]}
                    </motion.div>
                </AnimatePresence>

                {/* Title */}
                <div style={{
                    fontFamily: 'Caveat, cursive',
                    fontWeight: 800, fontSize: 28, color: '#1a1a1a',
                    marginBottom: 10,
                }}>
                    Finding a match{dots}
                </div>

                {/* Rotating tip */}
                <AnimatePresence mode="wait">
                    <motion.p
                        key={tipIdx}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.4 }}
                        style={{
                            fontSize: 15, color: '#555',
                            minHeight: 44, margin: '0 0 24px',
                            lineHeight: 1.5,
                        }}
                    >
                        {TIPS[tipIdx]}
                    </motion.p>
                </AnimatePresence>

                {/* Pulsing wave animation */}
                <div style={{
                    display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 28,
                }}>
                    {[0, 1, 2, 3, 4].map((i) => (
                        <motion.div
                            key={i}
                            animate={{ scaleY: [1, 2.2, 1] }}
                            transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15, ease: 'easeInOut' }}
                            style={{
                                width: 6, height: 22,
                                borderRadius: 3,
                                background: i % 2 === 0 ? '#f0a8b8' : '#a8c8f0',
                            }}
                        />
                    ))}
                </div>

                {/* Cancel button */}
                <motion.button
                    type="button"
                    onClick={onCancel}
                    whileHover={{ y: -2, boxShadow: '2px 4px 0 #a01020' }}
                    whileTap={{ scale: 0.94 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 16 }}
                    style={{
                        padding: '10px 28px',
                        borderRadius: 50,
                        border: '2.5px solid #c83030',
                        background: '#e03838',
                        color: '#fff',
                        fontFamily: 'Caveat, cursive',
                        fontWeight: 800, fontSize: 20,
                        cursor: 'pointer',
                        boxShadow: '2px 3px 0 #a01020',
                    }}
                >
                    Cancel Search
                </motion.button>
            </motion.div>

            {/* Floating sparkles */}
            {['✦', '✧', '✦', '✧', '✦'].map((s, i) => (
                <motion.div
                    key={i}
                    animate={{
                        rotate: [0, 360],
                        opacity: [0.3, 0.9, 0.3],
                        y: [0, -12, 0],
                    }}
                    transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: 'easeInOut', delay: i * 0.6 }}
                    style={{
                        position: 'absolute',
                        top: `${[15, 72, 30, 60, 82][i]}%`,
                        left: `${[8, 88, 92, 5, 50][i]}%`,
                        fontSize: [14, 18, 12, 16, 10][i],
                        color: ['#f5c842', '#a0c8f0', '#f0a8c8', '#9be0c0', '#c0a8e8'][i],
                        pointerEvents: 'none',
                    }}
                >
                    {s}
                </motion.div>
            ))}
        </div>
    );
}
