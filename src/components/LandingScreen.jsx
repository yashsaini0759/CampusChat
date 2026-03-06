import { motion } from 'framer-motion';
import ScrapbookHeader from './ScrapbookHeader';
import ScrapbookCard from './ScrapbookCard';

/** Decorative sticker elements scattered around the page */
function PageStickers() {
    return (
        <>
            {/* Bottom-left flower sticker */}
            <div style={{
                position: 'absolute', bottom: '12%', left: '4%',
                fontSize: 36, transform: 'rotate(-10deg)',
                userSelect: 'none', pointerEvents: 'none',
                filter: 'drop-shadow(2px 2px 2px rgba(0,0,0,0.2))',
            }}>🌸</div>
            {/* Right side arrow sticker */}
            <div style={{
                position: 'absolute', top: '44%', right: '5%',
                fontSize: 28, transform: 'rotate(20deg)',
                userSelect: 'none', pointerEvents: 'none',
                filter: 'drop-shadow(1px 2px 1px rgba(0,0,0,0.2))',
            }}>⭐</div>
            {/* Right-bottom star sticker */}
            <div style={{
                position: 'absolute', bottom: '8%', right: '6%',
                fontSize: 32, transform: 'rotate(-5deg)',
                userSelect: 'none', pointerEvents: 'none',
            }}>🌺</div>
            {/* Left center pinwheel */}
            <div style={{
                position: 'absolute', top: '35%', left: '3%',
                fontSize: 30, transform: 'rotate(15deg)',
                userSelect: 'none', pointerEvents: 'none',
                filter: 'drop-shadow(1px 2px 1px rgba(0,0,0,0.15))',
            }}>🎡</div>
            {/* Right heart sticker */}
            <div style={{
                position: 'absolute', top: '58%', right: '5%',
                fontSize: 24, transform: 'rotate(-12deg)',
                userSelect: 'none', pointerEvents: 'none', color: '#f0a0b0',
            }}>♥</div>
        </>
    );
}

/** Colored paper scrap pieces behind the main card */
function BackgroundPaperScraps() {
    return (
        <>
            {/* Purple scrap - top right */}
            <div style={{
                position: 'absolute',
                top: 30, right: -8,
                width: 80, height: 100,
                background: '#d4b8e8',
                borderRadius: 10,
                transform: 'rotate(4deg)',
                zIndex: 1,
                boxShadow: '2px 3px 6px rgba(0,0,0,0.12)',
            }} />
            {/* Green scrap - bottom */}
            <div style={{
                position: 'absolute',
                bottom: -12, left: -6,
                width: '85%', height: 50,
                background: '#b8e8d4',
                borderRadius: 10,
                transform: 'rotate(-2deg)',
                zIndex: 1,
                boxShadow: '2px 3px 6px rgba(0,0,0,0.1)',
            }} />
            {/* Orange scrap - left side */}
            <div style={{
                position: 'absolute',
                top: '22%', left: -14,
                width: 40, height: 100,
                background: '#f5c08a',
                borderRadius: 8,
                transform: 'rotate(-5deg)',
                zIndex: 1,
                boxShadow: '2px 2px 4px rgba(0,0,0,0.1)',
            }} />
            {/* Yellow scrap - right side */}
            <div style={{
                position: 'absolute',
                top: '30%', right: -10,
                width: 36, height: 90,
                background: '#f5e28a',
                borderRadius: 8,
                transform: 'rotate(6deg)',
                zIndex: 1,
                boxShadow: '2px 2px 4px rgba(0,0,0,0.1)',
            }} />
        </>
    );
}

/** Pink blob decorations in corners (like the reference) */
function BlobDecorations() {
    return (
        <>
            {/* Top right pink blob */}
            <div style={{
                position: 'fixed', top: -40, right: -30,
                width: 140, height: 120,
                background: '#f4a0b0',
                borderRadius: '50% 60% 40% 70%',
                zIndex: 0,
                transform: 'rotate(20deg)',
                opacity: 0.85,
            }} />
            {/* Bottom left pink blob */}
            <div style={{
                position: 'fixed', bottom: -50, left: -40,
                width: 160, height: 130,
                background: '#f4a0b0',
                borderRadius: '60% 40% 70% 30%',
                zIndex: 0,
                transform: 'rotate(-15deg)',
                opacity: 0.85,
            }} />
        </>
    );
}

export default function LandingScreen({ onStartChat }) {
    const handleStart = (data) => {
        if (onStartChat) onStartChat(data);
    };


    return (
        <div
            style={{
                minHeight: '100vh',
                minHeight: '100dvh',
                background: '#f5dfc4',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                padding: 'clamp(16px, 4vw, 32px) 16px clamp(20px, 4vw, 32px)',
                overflowX: 'hidden',
                overflowY: 'auto',
            }}
        >
            {/* Pink corner blobs */}
            <BlobDecorations />

            {/* Scattered page stickers (desktop only) */}
            <div style={{ position: 'fixed', inset: 0, zIndex: 2, pointerEvents: 'none' }}
                className="page-stickers-wrap">
                <PageStickers />
            </div>
            <style>{`@media(max-width:600px){.page-stickers-wrap{display:none}}`}</style>

            {/* Main content column — centered with auto top/bottom margin for short screens */}
            <div
                style={{
                    position: 'relative',
                    zIndex: 10,
                    width: '100%',
                    maxWidth: 420,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 14,
                    margin: 'auto 0',
                    paddingBottom: 8,
                }}
            >
                {/* Header */}
                <ScrapbookHeader onlineCount={247} />

                {/* Tape on top of main card area */}
                <div style={{ position: 'relative' }}>
                    {/* Coloured paper scraps behind */}
                    <BackgroundPaperScraps />

                    {/* The main card */}
                    <div style={{ position: 'relative', zIndex: 3 }}>
                        <ScrapbookCard onStart={handleStart} />
                    </div>
                </div>
            </div>
        </div>
    );
}
