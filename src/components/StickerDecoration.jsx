import { motion } from 'framer-motion';

const stickers = [
    { emoji: '💬', top: '8%', left: '5%', size: '2.4rem', delay: 0, rotate: -15 },
    { emoji: '❤️', top: '15%', left: '88%', size: '2rem', delay: 0.3, rotate: 12 },
    { emoji: '✨', top: '72%', left: '7%', size: '2rem', delay: 0.6, rotate: 0 },
    { emoji: '😊', top: '80%', left: '85%', size: '2.2rem', delay: 0.2, rotate: 8 },
    { emoji: '🫧', top: '35%', left: '3%', size: '1.8rem', delay: 0.9, rotate: -5 },
    { emoji: '💖', top: '55%', left: '91%', size: '1.8rem', delay: 0.5, rotate: 15 },
    { emoji: '🎉', top: '5%', left: '50%', size: '1.6rem', delay: 0.4, rotate: -10 },
    { emoji: '🌸', top: '90%', left: '42%', size: '1.8rem', delay: 0.7, rotate: 6 },
    { emoji: '💌', top: '20%', left: '15%', size: '1.6rem', delay: 1.0, rotate: -8 },
    { emoji: '⭐', top: '68%', left: '78%', size: '1.6rem', delay: 0.8, rotate: 20 },
];

const floatVariants = (delay) => ({
    initial: { y: 0, opacity: 0, scale: 0 },
    animate: {
        y: [0, -12, 0],
        opacity: 1,
        scale: 1,
        transition: {
            opacity: { duration: 0.5, delay },
            scale: { duration: 0.5, delay, type: 'spring', bounce: 0.6 },
            y: { duration: 3, delay: delay + 0.5, repeat: Infinity, ease: 'easeInOut' },
        },
    },
});

export default function StickerDecoration() {
    return (
        <>
            {stickers.map((s, i) => (
                <motion.div
                    key={i}
                    className="fixed pointer-events-none select-none z-0 hidden md:block"
                    style={{
                        top: s.top,
                        left: s.left,
                        fontSize: s.size,
                        rotate: `${s.rotate}deg`,
                        filter: 'drop-shadow(2px 3px 0px rgba(0,0,0,0.15))',
                    }}
                    variants={floatVariants(s.delay)}
                    initial="initial"
                    animate="animate"
                >
                    {s.emoji}
                </motion.div>
            ))}
        </>
    );
}
