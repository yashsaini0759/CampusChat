import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ALL_COLLEGES = [
    'All Colleges',
    'IIT Bombay', 'IIT Delhi', 'IIT Madras', 'IIT Kanpur', 'IIT Kharagpur',
    'IIT Roorkee', 'IIT Guwahati', 'IIT Hyderabad', 'IIT BHU', 'IIT Dhanbad',
    'NIT Trichy', 'NIT Warangal', 'NIT Surathkal', 'NIT Calicut', 'NIT Rourkela',
    'BITS Pilani', 'BITS Goa', 'BITS Hyderabad',
    'Delhi University', 'Mumbai University', 'Anna University', 'Pune University',
    'Jadavpur University', 'VIT Vellore', 'SRM University', 'Manipal University',
    'Amity University', 'Christ University', 'Symbiosis Pune',
    'IIIT Hyderabad', 'IIIT Delhi', 'IIIT Bangalore',
    'Presidency College', 'St. Stephens College', 'Miranda House',
    'Fergusson College', 'Loyola College', 'Hindu College', 'Lady Shri Ram College',
    'BMS College Bangalore', 'PESIT Bangalore', 'RV College Bangalore',
    'Thapar University', 'Chitkara University', 'LPU', 'GLA University',
    'COEP Pune', 'VJTI Mumbai', 'ICT Mumbai',
];

const MAX_SELECT = 5;

export default function CollegeDropdown({ selected, onChange }) {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState('');
    const ref = useRef(null);

    const filtered = ALL_COLLEGES.filter((c) =>
        c.toLowerCase().includes(search.toLowerCase())
    );

    const toggle = (college) => {
        if (college === 'All Colleges') {
            onChange(['All Colleges']);
            setOpen(false);
            return;
        }
        const withoutAll = selected.filter((c) => c !== 'All Colleges');
        if (withoutAll.includes(college)) {
            const next = withoutAll.filter((c) => c !== college);
            onChange(next.length === 0 ? ['All Colleges'] : next);
        } else if (withoutAll.length < MAX_SELECT) {
            onChange([...withoutAll, college]);
        }
    };

    useEffect(() => {
        const handler = (e) => {
            if (ref.current && !ref.current.contains(e.target)) {
                setOpen(false);
                setSearch('');
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const displayLabel = selected.includes('All Colleges')
        ? '🏫 All Colleges'
        : selected.length === 0
            ? 'Select colleges...'
            : selected.slice(0, 2).join(', ') + (selected.length > 2 ? ` +${selected.length - 2}` : '');

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, position: 'relative' }} ref={ref}>
            <label style={{
                fontSize: 11, fontWeight: 800, color: '#f97316',
                textTransform: 'uppercase', letterSpacing: '0.08em',
                fontFamily: 'Nunito, sans-serif',
            }}>
                🏫 College (up to 5)
            </label>

            {/* Trigger button */}
            <motion.button
                type="button"
                whileTap={{ scale: 0.98 }}
                onClick={() => setOpen((o) => !o)}
                style={{
                    width: '100%',
                    padding: '12px 40px 12px 16px',
                    borderRadius: 16,
                    border: '2px solid #fed7aa',
                    background: '#fff7ed',
                    color: '#374151',
                    fontFamily: 'Nunito, sans-serif',
                    fontWeight: 700,
                    fontSize: 15,
                    textAlign: 'left',
                    outline: 'none',
                    cursor: 'pointer',
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 8,
                    transition: 'border-color 0.2s, box-shadow 0.2s',
                }}
                onFocus={e => e.currentTarget.style.borderColor = '#fb923c'}
                onBlur={e => e.currentTarget.style.borderColor = '#fed7aa'}
            >
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {displayLabel}
                </span>
                <motion.span
                    animate={{ rotate: open ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    style={{ color: '#fb923c', flexShrink: 0, fontSize: 12 }}
                >▾</motion.span>
            </motion.button>

            {/* Selected tags */}
            {!selected.includes('All Colleges') && selected.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {selected.map((c) => (
                        <motion.span
                            key={c}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            style={{
                                background: '#fff7ed',
                                color: '#ea580c',
                                fontSize: 11,
                                fontWeight: 800,
                                padding: '3px 8px',
                                borderRadius: 999,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 4,
                                border: '1.5px solid #fed7aa',
                                fontFamily: 'Nunito, sans-serif',
                            }}
                        >
                            {c}
                            <button
                                type="button"
                                onClick={() => toggle(c)}
                                style={{
                                    background: 'none', border: 'none',
                                    color: '#fb923c', cursor: 'pointer',
                                    fontSize: 11, padding: 0, lineHeight: 1,
                                    fontFamily: 'Nunito, sans-serif',
                                }}
                            >✕</button>
                        </motion.span>
                    ))}
                </div>
            )}

            {/* Dropdown panel */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.97 }}
                        transition={{ duration: 0.18 }}
                        style={{
                            position: 'absolute',
                            left: 0, right: 0,
                            top: '100%',
                            marginTop: 6,
                            background: '#fff',
                            borderRadius: 18,
                            boxShadow: '0 8px 32px rgba(251,146,60,0.18), 0 2px 8px rgba(0,0,0,0.08)',
                            border: '1.5px solid #fed7aa',
                            zIndex: 100,
                            overflow: 'hidden',
                        }}
                    >
                        {/* Search */}
                        <div style={{ padding: '8px 8px 6px', borderBottom: '1.5px solid #fff7ed' }}>
                            <input
                                autoFocus
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="🔍 Search college..."
                                style={{
                                    width: '100%',
                                    padding: '8px 12px',
                                    borderRadius: 12,
                                    border: '1.5px solid #fed7aa',
                                    background: '#fff7ed',
                                    fontFamily: 'Nunito, sans-serif',
                                    fontWeight: 600,
                                    fontSize: 13,
                                    color: '#374151',
                                    outline: 'none',
                                }}
                            />
                        </div>

                        {/* List */}
                        <div className="college-list" style={{ maxHeight: 190, overflowY: 'auto' }}>
                            {filtered.map((college) => {
                                const isSelected = selected.includes(college);
                                const disabled =
                                    !isSelected &&
                                    !selected.includes('All Colleges') &&
                                    selected.length >= MAX_SELECT &&
                                    college !== 'All Colleges';

                                return (
                                    <button
                                        key={college}
                                        type="button"
                                        onClick={() => !disabled && toggle(college)}
                                        disabled={disabled}
                                        style={{
                                            width: '100%',
                                            padding: '10px 14px',
                                            textAlign: 'left',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 10,
                                            fontFamily: 'Nunito, sans-serif',
                                            fontWeight: 700,
                                            fontSize: 13,
                                            color: isSelected ? '#ea580c' : '#4b5563',
                                            background: isSelected ? '#fff7ed' : 'transparent',
                                            border: 'none',
                                            cursor: disabled ? 'not-allowed' : 'pointer',
                                            opacity: disabled ? 0.4 : 1,
                                            transition: 'background 0.15s',
                                        }}
                                        onMouseEnter={e => !disabled && !isSelected && (e.currentTarget.style.background = '#fff7ed')}
                                        onMouseLeave={e => !isSelected && (e.currentTarget.style.background = 'transparent')}
                                    >
                                        {/* Checkbox */}
                                        <span style={{
                                            width: 18, height: 18, borderRadius: 6,
                                            border: isSelected ? '2px solid #fb923c' : '2px solid #d1d5db',
                                            background: isSelected ? '#fb923c' : 'transparent',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            flexShrink: 0, fontSize: 10, color: '#fff',
                                        }}>
                                            {isSelected && '✓'}
                                        </span>
                                        {college}
                                    </button>
                                );
                            })}
                            {filtered.length === 0 && (
                                <p style={{
                                    textAlign: 'center', color: '#9ca3af',
                                    fontFamily: 'Nunito, sans-serif', fontSize: 13,
                                    padding: '16px 0',
                                }}>No results found</p>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
