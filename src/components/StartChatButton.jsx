import { motion } from 'framer-motion';

export default function StartChatButton({ onClick }) {
    return (
        <motion.button
            type="button"
            onClick={onClick}
            whileHover={{ scale: 1.06, y: -3 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 400, damping: 15 }}
            style={{
                width: '100%',
                padding: '15px 24px',
                borderRadius: 18,
                border: 'none',
                background: 'linear-gradient(135deg, #f472b6 0%, #fb923c 55%, #fbbf24 100%)',
                color: '#fff',
                fontFamily: 'Fredoka One, Nunito, sans-serif',
                fontWeight: 700,
                fontSize: 18,
                letterSpacing: '0.04em',
                cursor: 'pointer',
                boxShadow: '0 6px 24px rgba(244,114,182,0.45)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            Start Chatting 💬
        </motion.button>
    );
}
