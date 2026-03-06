import { useState } from 'react';
import { motion } from 'framer-motion';
import NameInput from './NameInput';
import GenderDropdown from './GenderDropdown';
import CollegeDropdown from './CollegeDropdown';
import StartChatButton from './StartChatButton';

export default function UserCard({ onStartChat }) {
    const [name, setName] = useState('');
    const [gender, setGender] = useState('Male');
    const [colleges, setColleges] = useState(['All Colleges']);

    const handleStart = () => {
        if (!name.trim()) {
            alert('Please enter your name to start! 😊');
            return;
        }
        onStartChat({ name, gender, colleges });
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.93 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
            style={{
                position: 'relative',
                width: '100%',
                maxWidth: 440,
                margin: '0 auto',
                borderRadius: 28,
                padding: '28px 28px 22px',
                display: 'flex',
                flexDirection: 'column',
                gap: 18,
                background: 'rgba(255,255,255,0.88)',
                backdropFilter: 'blur(24px)',
                WebkitBackdropFilter: 'blur(24px)',
                boxShadow: '0 24px 64px rgba(244,114,182,0.18), 0 4px 20px rgba(0,0,0,0.08)',
                border: '2px solid rgba(255,255,255,0.95)',
                zIndex: 10,
            }}
        >
            {/* Decorative blobs */}
            <div style={{
                position: 'absolute', top: -16, right: -16,
                width: 80, height: 80, borderRadius: '50%',
                background: 'linear-gradient(135deg,#fde68a,#fca5a5)',
                opacity: 0.6, filter: 'blur(14px)', pointerEvents: 'none',
            }} />
            <div style={{
                position: 'absolute', bottom: -14, left: -14,
                width: 64, height: 64, borderRadius: '50%',
                background: 'linear-gradient(135deg,#a5b4fc,#fbcfe8)',
                opacity: 0.5, filter: 'blur(12px)', pointerEvents: 'none',
            }} />

            <NameInput value={name} onChange={setName} />
            <GenderDropdown value={gender} onChange={setGender} />
            <CollegeDropdown selected={colleges} onChange={setColleges} />
            <StartChatButton onClick={handleStart} />

            <p style={{
                textAlign: 'center',
                fontSize: 12,
                color: '#9ca3af',
                fontFamily: 'Nunito, sans-serif',
                fontWeight: 600,
                marginTop: -4,
            }}>
                ✨ Anonymous &amp; Fun — No signup needed!
            </p>
        </motion.div>
    );
}
