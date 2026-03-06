import { motion } from 'framer-motion';

/** The top paper header — ChatCampus logo + online count */
export default function ScrapbookHeader({ onlineCount = 247 }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            style={{
                background: '#ffffff',
                borderRadius: 18,
                padding: '12px 18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                boxShadow: '3px 4px 0px rgba(0,0,0,0.12)',
                border: '1.5px solid rgba(0,0,0,0.06)',
                position: 'relative',
                marginBottom: 0,
                zIndex: 5,
            }}
        >
            {/* Logo + Name */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                {/* Logo circle */}
                <div
                    style={{
                        width: 44,
                        height: 44,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #ffe082, #fff9c4)',
                        border: '2.5px solid #333',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 22,
                        flexShrink: 0,
                        boxShadow: '1px 2px 0 rgba(0,0,0,0.15)',
                    }}
                >
                    🎓
                </div>
                <span
                    style={{
                        fontFamily: 'Caveat, cursive',
                        fontWeight: 800,
                        fontSize: 26,
                        color: '#1a1a1a',
                        letterSpacing: '-0.3px',
                    }}
                >
                    ChatCampus
                </span>
            </div>

            {/* Online count */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <span
                    style={{
                        fontFamily: 'Patrick Hand, cursive',
                        fontSize: 15,
                        fontWeight: 600,
                        color: '#333',
                    }}
                >
                    {onlineCount} online
                </span>
                <motion.span
                    animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    style={{
                        width: 11,
                        height: 11,
                        background: '#4ade80',
                        borderRadius: '50%',
                        display: 'inline-block',
                        boxShadow: '0 0 6px #4ade80',
                    }}
                />
            </div>
        </motion.div>
    );
}
