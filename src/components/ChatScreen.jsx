import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* ───────── tiny helpers ───────── */

/** Torn-paper SVG strip — top wavy edge only */
function TornStripTop({ color = '#fff' }) {
    return (
        <svg viewBox="0 0 400 14" preserveAspectRatio="none"
            style={{ width: '100%', height: 14, display: 'block', marginBottom: -1 }}>
            <path
                d="M0,14 L0,8 Q15,1 30,8 Q45,14 60,6 Q75,0 92,8 Q108,14 124,5
           Q140,0 158,8 Q174,14 190,5 Q206,0 222,8 Q238,14 255,5
           Q270,0 287,8 Q302,14 320,5 Q336,0 352,8 Q368,14 385,6 Q394,2 400,8
           L400,14 Z"
                fill={color}
            />
        </svg>
    );
}

/** Torn-paper SVG strip — bottom wavy edge only */
function TornStripBottom({ color = '#fff' }) {
    return (
        <svg viewBox="0 0 400 14" preserveAspectRatio="none"
            style={{ width: '100%', height: 14, display: 'block', marginTop: -1 }}>
            <path
                d="M0,0 L0,6 Q16,14 32,6 Q48,0 64,8 Q80,14 96,6 Q112,0 128,8
           Q144,14 162,6 Q178,0 196,8 Q212,14 228,6 Q244,0 260,8
           Q276,14 294,6 Q310,0 328,8 Q344,14 360,6 Q376,0 392,8
           L400,8 L400,0 Z"
                fill={color}
            />
        </svg>
    );
}

/** Tape strip decoration */
function Tape({ color = '#f5c842', rotate = 0, style = {} }) {
    return (
        <div style={{
            width: 58, height: 16,
            background: color, opacity: 0.82,
            borderRadius: 3,
            transform: `rotate(${rotate}deg)`,
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            pointerEvents: 'none',
            ...style,
        }} />
    );
}

/** Torn-paper info note */
function TornNote({ children, bg = '#ffffff', fontWeight = 400, tape = false, tapeColor = '#f5c842' }) {
    return (
        <div style={{ position: 'relative', margin: '0 16px' }}>
            {tape && (
                <div style={{ display: 'flex', justifyContent: 'center', position: 'relative', zIndex: 2, marginBottom: -8 }}>
                    <Tape color={tapeColor} />
                </div>
            )}
            <TornStripTop color={bg} />
            <div style={{
                background: bg,
                padding: '8px 18px',
                textAlign: 'center',
                fontFamily: 'Patrick Hand, sans-serif',
                fontWeight,
                fontSize: 15,
                color: '#1a1a1a',
                lineHeight: 1.5,
            }}>
                {children}
            </div>
            <TornStripBottom color={bg} />
        </div>
    );
}

function ChatBubble({ msg }) {
    if (msg.sender === 'system') {
        return (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                style={{ textAlign: 'center', margin: '6px 0', alignSelf: 'center' }}>
                <span style={{
                    background: 'rgba(0,0,0,0.06)', padding: '6px 16px',
                    borderRadius: 20, fontSize: 13.5, color: '#555',
                    fontFamily: 'Patrick Hand, sans-serif', fontWeight: 600,
                    boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.04)'
                }}>
                    {msg.text}
                </span>
            </motion.div>
        );
    }

    const isMe = msg.sender === 'me';
    return (
        <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
            style={{
                display: 'flex',
                justifyContent: isMe ? 'flex-end' : 'flex-start',
                padding: '2px 14px',
            }}
        >
            <div style={{
                maxWidth: '72%',
                padding: '10px 16px',
                borderRadius: isMe ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                background: isMe ? '#f2b8c6' : '#c0d4ec',
                fontFamily: 'Patrick Hand, sans-serif',
                fontSize: 15.5,
                color: '#1a1a1a',
                boxShadow: isMe
                    ? '2px 3px 0 rgba(210,100,130,0.25)'
                    : '2px 3px 0 rgba(80,120,180,0.2)',
                lineHeight: 1.45,
                position: 'relative',
            }}>
                {msg.text}
                <span style={{
                    display: 'block',
                    fontSize: 10,
                    color: 'rgba(0,0,0,0.35)',
                    textAlign: isMe ? 'right' : 'left',
                    marginTop: 2,
                    fontFamily: 'Patrick Hand, sans-serif',
                }}>
                    {msg.time}
                </span>
            </div>
        </motion.div>
    );
}

/** Scattered sparkle decorations in the background */
function Sparkles() {
    const items = [
        { emoji: '✦', top: '42%', right: '8%', size: 13, color: '#f5c842', rot: 10 },
        { emoji: '✧', top: '45%', right: '14%', size: 18, color: '#a0c8f0', rot: -5 },
        { emoji: '✦', top: '50%', right: '6%', size: 10, color: '#f0a8c8', rot: 20 },
        { emoji: '✧', top: '54%', right: '16%', size: 12, color: '#9be0c0', rot: -15 },
        { emoji: '✦', top: '12%', left: '6%', size: 11, color: '#f5c842', rot: 5 },
        { emoji: '✧', top: '20%', left: '12%', size: 15, color: '#c0a8e8', rot: -8 },
    ];
    return (
        <>
            {items.map((s, i) => (
                <motion.div
                    key={i}
                    animate={{ rotate: [s.rot, s.rot + 20, s.rot], opacity: [0.6, 1, 0.6] }}
                    transition={{ duration: 3 + i * 0.4, repeat: Infinity, ease: 'easeInOut' }}
                    style={{
                        position: 'absolute',
                        top: s.top, left: s.left, right: s.right,
                        fontSize: s.size,
                        color: s.color,
                        pointerEvents: 'none',
                        userSelect: 'none',
                        zIndex: 0,
                    }}
                >
                    {s.emoji}
                </motion.div>
            ))}
        </>
    );
}

/** Corner paper decorations */
function CornerPapers() {
    return (
        <>
            {/* Bottom-left pink blob */}
            <div style={{
                position: 'absolute', bottom: -30, left: -30,
                width: 110, height: 90,
                background: '#f4a0b0',
                borderRadius: '60% 40% 70% 30%',
                opacity: 0.7, transform: 'rotate(-10deg)',
                pointerEvents: 'none',
            }} />
            {/* Top-right tiny purple scrap */}
            <div style={{
                position: 'absolute', top: 50, right: -10,
                width: 40, height: 70,
                background: '#d0b8e8',
                borderRadius: 8,
                opacity: 0.6, transform: 'rotate(8deg)',
                pointerEvents: 'none',
            }} />
        </>
    );
}

/* ─────────── now() helper ─────────── */
function nowTime() {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

const DEMO_MSGS = [];


/* ═══════════════════════════════════════════
   MAIN CHAT SCREEN
════════════════════════════════════════════ */
export default function ChatScreen({
    matchCollege = 'Graphic Era University',
    matchName = 'someone',
    messages = [],
    onSendMessage,
    onSendTyping,
    onEnd,
    onNextMatch,
    peerTyping = false,
    chatEndedInfo = null,
}) {
    const [input, setInput] = useState('');
    const [endConfirm, setEndConfirm] = useState(false);
    const bottomRef = useRef(null);
    const inputRef = useRef(null);

    /* auto-scroll on new message */
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, peerTyping]);

    // typing indicator timeout
    useEffect(() => {
        if (!onSendTyping) return;
        if (input.length > 0) {
            onSendTyping(true);
            const t = setTimeout(() => onSendTyping(false), 2000);
            return () => clearTimeout(t);
        } else {
            onSendTyping(false);
        }
    }, [input, onSendTyping]);

    const handleSendMessage = () => {
        const text = input.trim();
        if (!text) return;

        // Optimistically show message
        onSendMessage(text);
        setInput('');
        inputRef.current?.focus();
    };

    const handleKey = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); }
    };

    const handleEndClick = () => {
        if (!endConfirm) {
            setEndConfirm(true);
            setTimeout(() => setEndConfirm(false), 3000);
        } else {
            onEnd();
            setEndConfirm(false);
        }
    };

    return (
        <div style={{
            position: 'fixed', inset: 0,
            height: '100dvh',
            display: 'flex', flexDirection: 'column',
            background: '#f5e8d5',
            fontFamily: 'Patrick Hand, sans-serif',
            overflow: 'hidden',
        }}>
            {/* ── Paper texture overlay ── */}
            <div style={{
                position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none',
                backgroundImage:
                    'radial-gradient(circle at 20% 20%, rgba(255,240,200,0.25) 0%, transparent 60%),' +
                    'radial-gradient(circle at 80% 80%, rgba(255,200,180,0.18) 0%, transparent 50%)',
            }} />

            {/* ── Corner decorations ── */}
            <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', zIndex: 0, pointerEvents: 'none' }}>
                <CornerPapers />
            </div>

            {/* ── Sparkles ── */}
            <div style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
                <Sparkles />
            </div>

            {/* ══ HEADER ══ — flex-shrink:0 so it never collapses */}
            <div style={{
                position: 'relative', zIndex: 10,
                flexShrink: 0,
                background: 'rgba(255,255,255,0.72)',
                backdropFilter: 'blur(8px)',
                borderBottom: '1.5px solid rgba(0,0,0,0.06)',
                padding: '8px 16px',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
            }}>
                {/* Logo + name */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                        width: 38, height: 38, borderRadius: '50%',
                        background: 'linear-gradient(135deg,#ffe082,#fff9c4)',
                        border: '2px solid #333',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 18,
                        boxShadow: '1px 2px 0 rgba(0,0,0,0.12)',
                        flexShrink: 0,
                    }}>🎓</div>
                    <span style={{
                        fontFamily: 'Caveat, sans-serif', fontWeight: 800,
                        fontSize: 22, color: '#1a1a1a',
                    }}>ChatCampus</span>
                </div>

                {/* Connection dot + menu */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <motion.div
                        animate={{ scale: [1, 1.3, 1], opacity: [1, 0.6, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        style={{
                            width: 11, height: 11, borderRadius: '50%',
                            background: '#4ade80',
                            boxShadow: '0 0 6px #4ade80',
                        }}
                    />
                    <span style={{ fontSize: 20, color: '#555', cursor: 'pointer', letterSpacing: 2 }}>≡</span>
                </div>
            </div>

            {/* ══ MATCH STATUS NOTES — flex-shrink:0 so never collapses ══ */}
            <div style={{
                position: 'relative', zIndex: 5,
                flexShrink: 0,
                paddingTop: 8, paddingBottom: 2,
                display: 'flex', flexDirection: 'column', gap: 6,
            }}>
                {/* Note 1 — with tape */}
                <TornNote bg="#f9f3e8" tape tapeColor="#f5c842">
                    Matched with someone from a college
                </TornNote>

                {/* Note 2 — bold, bigger */}
                <TornNote bg="#f9f3e8" fontWeight={700}>
                    <span style={{ fontFamily: 'Caveat, sans-serif', fontSize: 17, fontWeight: 800 }}>
                        You're now chatting with{' '}
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                            {matchName} from {matchCollege}
                            <span style={{ fontSize: 18 }}>✦</span>
                        </span>
                    </span>
                </TornNote>
            </div>

            <div style={{
                flex: 1,
                overflowY: 'auto',
                position: 'relative', zIndex: 5,
                padding: '12px 0 8px',
                display: 'flex', flexDirection: 'column',
                gap: 8,
                /* scrollbar */
                scrollbarWidth: 'thin',
                scrollbarColor: 'rgba(0,0,0,0.12) transparent',
            }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {/* Spacer pushes messages to bottom */}
                    <div style={{ flex: 1, minHeight: 0 }} />
                    <AnimatePresence initial={false}>
                        {/* ── FIX: removed .reverse() so newest messages appear at bottom ── */}
                        {messages.map(msg => (
                            <ChatBubble key={msg.id} msg={msg} />
                        ))}
                        {peerTyping && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                style={{ padding: '0 16px', color: '#888', fontSize: 13, alignSelf: 'flex-start' }}
                            >
                                typing...
                            </motion.div>
                        )}
                    </AnimatePresence>
                    <div ref={bottomRef} style={{ height: 4 }} />
                </div>
            </div>

            {/* ══ BOTTOM INPUT BAR — flex-shrink:0 always stays visible ══ */}
            <div style={{
                position: 'relative', zIndex: 10,
                flexShrink: 0,
                paddingTop: 0,
                paddingLeft: 12,
                paddingRight: 12,
                paddingBottom: 'max(10px, env(safe-area-inset-bottom))',
            }}>
                {/* torn top edge of input bar */}
                <div style={{ marginBottom: -1 }}>
                    <TornStripTop color="rgba(255,255,255,0.82)" />
                </div>
                <div style={{
                    background: 'rgba(255,255,255,0.82)',
                    padding: '10px 12px',
                    display: 'flex', alignItems: 'center', gap: 10,
                }}>
                    {!chatEndedInfo ? (
                        <>
                            {/* END button */}
                            <motion.button
                                type="button"
                                onClick={handleEndClick}
                                whileHover={{ y: -2, boxShadow: endConfirm ? '2px 4px 0 #666' : '2px 4px 0 #a01020' }}
                                whileTap={{ scale: 0.93 }}
                                transition={{ type: 'spring', stiffness: 400, damping: 16 }}
                                style={{
                                    padding: '9px 0',
                                    width: 76,
                                    borderRadius: 12,
                                    border: endConfirm ? '2.5px solid #666' : '2.5px solid #c83030',
                                    background: endConfirm ? '#888' : '#e03838',
                                    color: '#fff',
                                    fontFamily: 'Caveat, sans-serif',
                                    fontWeight: 800, fontSize: 18,
                                    cursor: 'pointer',
                                    boxShadow: endConfirm ? '2px 3px 0 #666' : '2px 3px 0 #a01020',
                                    flexShrink: 0,
                                    letterSpacing: '0.02em',
                                    textAlign: 'center',
                                }}
                            >
                                {endConfirm ? 'Sure?' : 'End'}
                            </motion.button>

                            {/* Text input */}
                            <input
                                ref={inputRef}
                                type="text"
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                onKeyDown={handleKey}
                                placeholder="Text message"
                                style={{
                                    flex: 1,
                                    padding: '9px 14px',
                                    borderRadius: 12,
                                    border: '2px solid #ddd',
                                    background: '#fffdf7',
                                    fontFamily: 'Patrick Hand, sans-serif',
                                    fontSize: 15, color: '#333',
                                    outline: 'none',
                                    boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.06)',
                                    /* notebook lines effect */
                                    backgroundImage:
                                        'repeating-linear-gradient(transparent, transparent 23px, rgba(180,200,240,0.25) 23px, rgba(180,200,240,0.25) 24px)',
                                }}
                                onFocus={e => e.target.style.borderColor = '#f5c842'}
                                onBlur={e => e.target.style.borderColor = '#ddd'}
                            />

                            {/* SEND button */}
                            <motion.button
                                type="button"
                                onClick={handleSendMessage}
                                disabled={!!chatEndedInfo}
                                whileHover={{ y: -2, scale: 1.08, boxShadow: '2px 4px 0 #c49a00' }}
                                whileTap={{ scale: 0.88 }}
                                transition={{ type: 'spring', stiffness: 450, damping: 14 }}
                                style={{
                                    width: 44, height: 44,
                                    borderRadius: 12,
                                    border: '2.5px solid #d4a800',
                                    background: '#f5c842',
                                    cursor: 'pointer',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    boxShadow: '2px 3px 0 #c49a00',
                                    flexShrink: 0,
                                    fontSize: 20,
                                }}
                            >
                                {/* Paper plane icon */}
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                    <path d="M22 2L11 13" stroke="#555" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="#555" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </motion.button>
                        </>
                    ) : (
                        <motion.button
                            type="button"
                            onClick={onNextMatch}
                            whileHover={{ y: -3, boxShadow: '3px 5px 0 #1060a0' }}
                            whileTap={{ scale: 0.96 }}
                            transition={{ type: 'spring', stiffness: 400, damping: 16 }}
                            style={{
                                width: '100%',
                                padding: '12px 20px',
                                borderRadius: 14,
                                border: '3px solid #1a73e8',
                                background: '#4285f4',
                                color: '#fff',
                                fontFamily: 'Caveat, sans-serif',
                                fontWeight: 800, fontSize: 24,
                                cursor: 'pointer',
                                boxShadow: '3px 4px 0 #1060a0',
                                flexShrink: 0,
                                letterSpacing: '0.02em',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
                            }}
                        >
                            Look for Next 🔍
                        </motion.button>
                    )}
                </div>
            </div>
        </div>
    );
}