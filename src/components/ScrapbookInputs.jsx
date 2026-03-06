import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { COLLEGES } from '../data/colleges';

/** Underline-style name input matching the scrapbook reference */
export function NameInput({ value, onChange }) {
    return (
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, padding: '4px 0' }}>
            <label style={{
                fontFamily: 'Caveat, sans-serif', fontWeight: 800,
                fontSize: 20, color: '#1a1a1a', minWidth: 78, flexShrink: 0,
            }}>
                Name
            </label>
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Enter your name"
                style={{
                    flex: 1,
                    border: 'none',
                    borderBottom: '2px solid #bbb',
                    background: 'transparent',
                    padding: '4px 2px',
                    fontSize: 16,
                    fontFamily: 'Patrick Hand, sans-serif',
                    color: '#333',
                    outline: 'none',
                }}
                onFocus={e => e.target.style.borderBottomColor = '#f5c842'}
                onBlur={e => e.target.style.borderBottomColor = '#bbb'}
            />
        </div>
    );
}

/** College autocomplete input matching the scrapbook reference */
export function CollegeInput({ value, onChange }) {
    const [query, setQuery] = useState(value === 'All Colleges' ? '' : value);
    const [showDrop, setShowDrop] = useState(false);
    const [highlighted, setHighlighted] = useState(-1);
    const ref = useRef(null);

    const suggestions = query.length >= 1
        ? COLLEGES.filter(c => c !== 'All Colleges' && c.toLowerCase().includes(query.toLowerCase())).slice(0, 8)
        : [];

    const selectCollege = (college) => {
        setQuery(college);
        onChange(college);
        setShowDrop(false);
        setHighlighted(-1);
    };

    const handleKey = (e) => {
        if (!showDrop || suggestions.length === 0) return;
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setHighlighted(h => Math.min(h + 1, suggestions.length - 1));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setHighlighted(h => Math.max(h - 1, 0));
        } else if (e.key === 'Enter' && highlighted >= 0) {
            e.preventDefault();
            selectCollege(suggestions[highlighted]);
        } else if (e.key === 'Escape') {
            setShowDrop(false);
        }
    };

    useEffect(() => {
        const handler = (e) => {
            if (ref.current && !ref.current.contains(e.target)) setShowDrop(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    return (
        <div
            ref={ref}
            style={{ display: 'flex', alignItems: 'baseline', gap: 12, padding: '4px 0', position: 'relative' }}
        >
            <label style={{
                fontFamily: 'Caveat, sans-serif', fontWeight: 800,
                fontSize: 20, color: '#1a1a1a', minWidth: 78, flexShrink: 0,
            }}>
                Colleges
            </label>
            <div style={{ flex: 1, position: 'relative' }}>
                <input
                    type="text"
                    value={query}
                    placeholder="All Colleges"
                    onChange={(e) => {
                        setQuery(e.target.value);
                        onChange(e.target.value || 'All Colleges');
                        setShowDrop(true);
                        setHighlighted(-1);
                    }}
                    onFocus={() => { if (query.length >= 1) setShowDrop(true); }}
                    onKeyDown={handleKey}
                    style={{
                        width: '100%',
                        border: 'none',
                        borderBottom: '2px solid #bbb',
                        background: 'transparent',
                        padding: '4px 2px',
                        fontSize: 16,
                        fontFamily: 'Patrick Hand, sans-serif',
                        color: '#333',
                        outline: 'none',
                    }}
                    onBlurCapture={e => e.target.style.borderBottomColor = '#bbb'}
                    onFocusCapture={e => e.target.style.borderBottomColor = '#f5c842'}
                />

                {/* Dropdown suggestions */}
                <AnimatePresence>
                    {showDrop && suggestions.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: -4, scale: 0.97 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -4, scale: 0.97 }}
                            transition={{ duration: 0.15 }}
                            className="college-suggestions"
                            style={{
                                position: 'absolute',
                                top: '100%',
                                left: 0,
                                right: 0,
                                marginTop: 6,
                                background: '#fff',
                                borderRadius: 14,
                                boxShadow: '3px 4px 0 rgba(0,0,0,0.13)',
                                border: '2px solid #e0e0e0',
                                zIndex: 999,
                                overflow: 'hidden',
                                maxHeight: 220,
                                overflowY: 'auto',
                            }}
                        >
                            {suggestions.map((college, idx) => (
                                <button
                                    key={college}
                                    type="button"
                                    onMouseDown={() => selectCollege(college)}
                                    onMouseEnter={() => setHighlighted(idx)}
                                    style={{
                                        width: '100%',
                                        textAlign: 'left',
                                        padding: '9px 14px',
                                        background: highlighted === idx ? '#fff9e6' : 'transparent',
                                        border: 'none',
                                        borderBottom: idx < suggestions.length - 1 ? '1px solid #f0f0f0' : 'none',
                                        fontFamily: 'Patrick Hand, sans-serif',
                                        fontSize: 15,
                                        color: '#222',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 8,
                                    }}
                                >
                                    <span style={{ color: '#f5c842', fontSize: 12 }}>🏫</span>
                                    {/* Highlight matching text */}
                                    {(() => {
                                        const lower = college.toLowerCase();
                                        const qLower = query.toLowerCase();
                                        const start = lower.indexOf(qLower);
                                        if (start === -1) return college;
                                        return (
                                            <>
                                                {college.slice(0, start)}
                                                <strong style={{ color: '#e67e00', fontFamily: 'Caveat, sans-serif', fontSize: 16 }}>
                                                    {college.slice(start, start + query.length)}
                                                </strong>
                                                {college.slice(start + query.length)}
                                            </>
                                        );
                                    })()}
                                </button>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
