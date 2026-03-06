import { motion } from 'framer-motion';

// Colorful grid blocks — like the heart sticker grid reference
const COLORS = [
    '#fca5a5', '#fdba74', '#fde68a', '#bbf7d0', '#a5f3fc', '#c4b5fd',
    '#fbcfe8', '#fde68a', '#86efac', '#93c5fd', '#fda4af', '#fcd34d',
    '#6ee7b7', '#a5b4fc', '#fecaca', '#fed7aa', '#fef08a', '#bbf7d0',
    '#bfdbfe', '#f0abfc', '#fde68a', '#99f6e4', '#c7d2fe', '#fda4af',
    '#fca5a5', '#fdba74', '#d9f99d', '#7dd3fc', '#e9d5ff', '#fecdd3',
];

const STICKERS = [
    { emoji: '💬', top: '8%', left: '5%', size: 40, delay: 0, rot: -15 },
    { emoji: '❤️', top: '14%', left: '88%', size: 36, delay: 0.3, rot: 12 },
    { emoji: '✨', top: '72%', left: '6%', size: 34, delay: 0.6, rot: 0 },
    { emoji: '😊', top: '80%', left: '86%', size: 38, delay: 0.2, rot: 8 },
    { emoji: '🫧', top: '35%', left: '2%', size: 30, delay: 0.9, rot: -5 },
    { emoji: '💖', top: '54%', left: '91%', size: 32, delay: 0.5, rot: 15 },
    { emoji: '🎉', top: '4%', left: '48%', size: 28, delay: 0.4, rot: -10 },
    { emoji: '🌸', top: '90%', left: '40%', size: 30, delay: 0.7, rot: 6 },
    { emoji: '💌', top: '22%', left: '14%', size: 28, delay: 1.0, rot: -8 },
    { emoji: '⭐', top: '66%', left: '80%', size: 28, delay: 0.8, rot: 20 },
];

export default function PlayfulBackground() {
    return (
        <>
            {/* Pastel grid */}
            <div
                style={{
                    position: 'fixed', inset: 0, zIndex: 0,
                    display: 'grid',
                    gridTemplateColumns: 'repeat(6, 1fr)',
                    gridTemplateRows: 'repeat(5, 1fr)',
                }}
            >
                {COLORS.map((color, i) => (
                    <div key={i} style={{ backgroundColor: color }} />
                ))}
            </div>

            {/* Frosted layer for readability */}
            <div style={{
                position: 'fixed', inset: 0, zIndex: 1,
                background: 'rgba(255,255,255,0.3)',
                backdropFilter: 'blur(2px)',
            }} />

            {/* Floating stickers — desktop only */}
            {STICKERS.map((s, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{
                        opacity: 1,
                        scale: 1,
                        y: [0, -14, 0],
                    }}
                    transition={{
                        opacity: { duration: 0.4, delay: s.delay },
                        scale: { duration: 0.4, delay: s.delay, type: 'spring', bounce: 0.5 },
                        y: { duration: 3, delay: s.delay + 0.5, repeat: Infinity, ease: 'easeInOut' },
                    }}
                    style={{
                        position: 'fixed',
                        top: s.top,
                        left: s.left,
                        fontSize: s.size,
                        rotate: `${s.rot}deg`,
                        zIndex: 2,
                        pointerEvents: 'none',
                        display: 'none', // mobile hidden
                        filter: 'drop-shadow(2px 3px 2px rgba(0,0,0,0.15))',
                    }}
                    className="md-sticker"
                >
                    {s.emoji}
                </motion.div>
            ))}

            {/* Show stickers on md+ */}
            <style>{`@media(min-width:768px){.md-sticker{display:block!important}}`}</style>
        </>
    );
}
