import { motion } from 'framer-motion';

export default function NameInput({ value, onChange }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{
                fontSize: 11, fontWeight: 800, color: '#ec4899',
                textTransform: 'uppercase', letterSpacing: '0.08em',
                fontFamily: 'Nunito, sans-serif',
            }}>
                👤 Your Name
            </label>
            <motion.input
                whileFocus={{ scale: 1.02 }}
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Enter your name..."
                style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: 16,
                    border: '2px solid #fbcfe8',
                    background: '#fff0f6',
                    color: '#374151',
                    fontFamily: 'Nunito, sans-serif',
                    fontWeight: 700,
                    fontSize: 15,
                    outline: 'none',
                }}
                onFocus={e => {
                    e.target.style.borderColor = '#f472b6';
                    e.target.style.boxShadow = '0 0 0 3px rgba(251,182,206,0.4)';
                }}
                onBlur={e => {
                    e.target.style.borderColor = '#fbcfe8';
                    e.target.style.boxShadow = 'none';
                }}
            />
        </div>
    );
}
