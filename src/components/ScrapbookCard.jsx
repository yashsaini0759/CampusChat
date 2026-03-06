import { useState } from 'react';
import { motion } from 'framer-motion';
import { TornTop, TornBottom, TapeStrip } from './ScrapbookParts';
import { NameInput, CollegeInput } from './ScrapbookInputs';
import GenderButtons from './GenderButtons';
import ChatOptionButtons from './ChatOptionButtons';

/** Doodle decoration elements for around the title */
function TitleDoodles() {
    return (
        <>
            {/* Flower top-left */}
            <span style={{
                position: 'absolute', top: 22, left: 14,
                fontSize: 26, transform: 'rotate(-15deg)',
                userSelect: 'none', pointerEvents: 'none',
                filter: 'drop-shadow(1px 1px 0 rgba(0,0,0,0.15))',
            }}>✿</span>
            {/* Heart left */}
            <span style={{
                position: 'absolute', top: 72, left: 18,
                fontSize: 18, transform: 'rotate(5deg)',
                userSelect: 'none', pointerEvents: 'none', color: '#e88',
            }}>♡</span>
            {/* 4-point star top-right */}
            <span style={{
                position: 'absolute', top: 18, right: 18,
                fontSize: 20, transform: 'rotate(10deg)',
                userSelect: 'none', pointerEvents: 'none', color: '#333',
            }}>✦</span>
            {/* sparkle stars right */}
            <span style={{
                position: 'absolute', top: 58, right: 14,
                fontSize: 24, transform: 'rotate(-8deg)',
                userSelect: 'none', pointerEvents: 'none', color: '#333',
            }}>✧</span>
        </>
    );
}

/** The main white torn-paper content card */
export default function ScrapbookCard({ onStart }) {
    const [name, setName] = useState('');
    const [college, setCollege] = useState('All Colleges');
    const [gender, setGender] = useState('He');
    const [chatType, setChatType] = useState('text');

    const handleStart = () => {
        if (!name.trim()) {
            alert('Please enter your name! 😊');
            return;
        }
        onStart({ name, college, gender, chatType });
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.15, ease: [0.34, 1.2, 0.64, 1] }}
            whileHover={{ y: -2 }}
            style={{ position: 'relative', width: '100%' }}
        >
            {/* Yellow tape on top seam */}
            <TapeStrip top={-10} left="50%" rotate={-2} width={54} height={18}
                color="#f5c842"
                style={{ transform: 'translateX(-50%) rotate(-2deg)' }}
            />

            {/* Torn top edge */}
            <TornTop color="#ffffff" />

            {/* Main white content */}
            <div
                style={{
                    background: '#ffffff',
                    padding: 'clamp(10px, 3vw, 16px) clamp(18px, 5vw, 28px) clamp(14px, 4vw, 20px)',
                    position: 'relative',
                }}
            >
                {/* Title section with doodles */}
                <div style={{ position: 'relative', marginBottom: 'clamp(12px, 3vw, 22px)', paddingTop: 4 }}>
                    <TitleDoodles />
                    <h1
                        style={{
                            fontFamily: 'Caveat, sans-serif',
                            fontWeight: 800,
                            fontSize: 'clamp(26px, 6vw, 38px)',
                            color: '#1a1a1a',
                            lineHeight: 1.2,
                            textAlign: 'center',
                            padding: '0 48px',
                            margin: 0,
                        }}
                    >
                        Meet New People<br />From Colleges
                    </h1>
                </div>

                {/* Divider underline */}
                <div style={{ height: 1.5, background: '#eee', margin: '0 0 16px' }} />

                {/* Input fields */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
                    <NameInput value={name} onChange={setName} />
                    <CollegeInput value={college} onChange={setCollege} />
                </div>

                {/* Gender buttons */}
                <GenderButtons selected={gender} onChange={setGender} />

                {/* Spacing */}
                <div style={{ height: 18 }} />

                {/* Chat options */}
                <ChatOptionButtons selected={chatType} onChange={setChatType} />

                {/* Spacing */}
                <div style={{ height: 18 }} />

                {/* Start Chatting button */}
                <motion.button
                    type="button"
                    onClick={handleStart}
                    whileHover={{ y: -4, boxShadow: '4px 8px 0 #c49a00' }}
                    whileTap={{ scale: 0.96, y: 0 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 16 }}
                    style={{
                        width: '100%',
                        padding: '15px 20px',
                        borderRadius: 50,
                        border: '3px solid #d4a800',
                        background: '#f5c842',
                        fontFamily: 'Caveat, sans-serif',
                        fontWeight: 800,
                        fontSize: 26,
                        cursor: 'pointer',
                        boxShadow: '3px 6px 0 #c49a00',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 10,
                        color: '#1a1a1a',
                        letterSpacing: '0.02em',
                    }}
                >
                    Start Chatting&nbsp;💙
                </motion.button>
            </div>

            {/* Torn bottom edge */}
            <TornBottom color="#ffffff" />
        </motion.div>
    );
}
