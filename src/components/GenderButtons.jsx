import { motion } from 'framer-motion';

const GENDERS = [
    { label: 'He', bg: '#a8c8f0', border: '#4a90d9', active: '#4a90d9' },
    { label: 'She', bg: '#f0a8b8', border: '#d94a72', active: '#d94a72' },
    { label: 'Others', bg: '#a8e8c8', border: '#2ecc71', active: '#2ecc71' },
];

export default function GenderButtons({ selected, onChange }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 4 }}>
            <label style={{
                fontFamily: 'Caveat, sans-serif',
                fontWeight: 800,
                fontSize: 18,
                color: '#1a1a1a',
            }}>
                Looking For
            </label>
            <div style={{ display: 'flex', gap: 12 }}>
                {GENDERS.map(({ label, bg, border, active }) => {
                    const isSelected = selected === label;
                    return (
                        <motion.button
                            key={label}
                            type="button"
                            onClick={() => onChange(label)}
                            whileHover={{ y: -3, boxShadow: `3px 6px 0 ${border}` }}
                            whileTap={{ scale: 0.93, y: 0 }}
                            transition={{ type: 'spring', stiffness: 400, damping: 18 }}
                            style={{
                                flex: 1,
                                padding: '9px 0',
                                borderRadius: 50,
                                border: `2.5px solid ${border}`,
                                background: isSelected ? active : bg,
                                color: isSelected ? '#fff' : '#1a1a1a',
                                fontFamily: 'Caveat, sans-serif',
                                fontWeight: 800,
                                fontSize: 20,
                                cursor: 'pointer',
                                boxShadow: isSelected
                                    ? `3px 4px 0 ${border}`
                                    : '2px 3px 0 rgba(0,0,0,0.12)',
                                letterSpacing: '0.02em',
                                transition: 'background 0.2s, color 0.2s, box-shadow 0.15s',
                            }}
                        >
                            {label}
                        </motion.button>
                    );
                })}
            </div>
        </div>
    );

}
