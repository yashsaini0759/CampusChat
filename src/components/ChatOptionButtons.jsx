import { motion } from 'framer-motion';

const CHAT_TYPES = [
    {
        id: 'text',
        label: 'TEXT CHAT',
        icon: '💬',
        bg: '#a8c8f0',
        border: '#4a90d9',
        shadow: '#2a6fb0',
    },
    {
        id: 'audio',
        label: 'AUDIO CHAT',
        icon: '🎤',
        bg: '#f0a8b8',
        border: '#d94a72',
        shadow: '#a0304a',
    },
];

export default function ChatOptionButtons({ selected, onChange }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 4 }}>
            {CHAT_TYPES.map(({ id, label, icon, bg, border, shadow }) => {
                const isSelected = selected === id;
                return (
                    <motion.button
                        key={id}
                        type="button"
                        onClick={() => onChange(id)}
                        whileHover={{ y: -3, boxShadow: `4px 7px 0 ${shadow}` }}
                        whileTap={{ scale: 0.97, y: 0 }}
                        transition={{ type: 'spring', stiffness: 380, damping: 16 }}
                        style={{
                            width: '100%',
                            padding: '13px 20px',
                            borderRadius: 50,
                            border: `3px solid ${border}`,
                            background: isSelected
                                ? `linear-gradient(90deg, ${border}, ${bg})`
                                : bg,
                            fontFamily: 'Caveat, sans-serif',
                            fontWeight: 800,
                            fontSize: 22,
                            letterSpacing: '0.05em',
                            color: isSelected ? '#fff' : '#1a1a1a',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 10,
                            boxShadow: isSelected
                                ? `4px 6px 0 ${shadow}`
                                : `3px 5px 0 rgba(0,0,0,0.15)`,
                            transition: 'background 0.2s, color 0.2s',
                        }}
                    >
                        <span style={{ fontSize: 20 }}>{icon}</span>
                        {label}
                    </motion.button>
                );
            })}
        </div>
    );
}
