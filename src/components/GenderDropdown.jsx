import { motion } from 'framer-motion';

const OPTIONS = ['Male', 'Female', 'Prefer not to say'];

export default function GenderDropdown({ value, onChange }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{
                fontSize: 11, fontWeight: 800, color: '#8b5cf6',
                textTransform: 'uppercase', letterSpacing: '0.08em',
                fontFamily: 'Nunito, sans-serif',
            }}>
                🌈 Gender
            </label>
            <div style={{ position: 'relative' }}>
                <select
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    style={{
                        width: '100%',
                        padding: '12px 40px 12px 16px',
                        borderRadius: 16,
                        border: '2px solid #ddd6fe',
                        background: '#f5f3ff',
                        color: '#374151',
                        fontFamily: 'Nunito, sans-serif',
                        fontWeight: 700,
                        fontSize: 15,
                        outline: 'none',
                        appearance: 'none',
                        WebkitAppearance: 'none',
                        cursor: 'pointer',
                    }}
                    onFocus={e => {
                        e.target.style.borderColor = '#a78bfa';
                        e.target.style.boxShadow = '0 0 0 3px rgba(196,181,253,0.4)';
                    }}
                    onBlur={e => {
                        e.target.style.borderColor = '#ddd6fe';
                        e.target.style.boxShadow = 'none';
                    }}
                >
                    {OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                    ))}
                </select>
                <span style={{
                    position: 'absolute', right: 14, top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#a78bfa', pointerEvents: 'none', fontSize: 12,
                }}>▾</span>
            </div>
        </div>
    );
}
