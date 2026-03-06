/**
 * Torn paper SVG edges and paper texture helpers for scrapbook aesthetic
 */

/** Top torn edge - renders as a white jagged/wavy top border */
export function TornTop({ color = '#ffffff' }) {
    return (
        <svg
            viewBox="0 0 500 28"
            preserveAspectRatio="none"
            style={{ width: '100%', height: 28, display: 'block', marginBottom: -1 }}
        >
            <path
                d="M0,28 L0,18 Q8,8 18,16 Q28,24 38,12 Q48,4 58,14 Q68,22 80,10
           Q90,2 102,13 Q114,22 122,9 Q132,0 144,12 Q154,22 164,10
           Q174,2 186,14 Q196,24 208,11 Q218,2 230,14 Q240,24 252,10
           Q262,0 274,13 Q286,22 296,9 Q308,0 320,14 Q330,24 340,11
           Q352,2 364,14 Q376,24 386,10 Q396,0 410,13 Q422,22 432,9
           Q444,0 456,12 Q466,22 476,10 Q488,2 500,14 L500,28 Z"
                fill={color}
            />
        </svg>
    );
}

/** Bottom torn edge */
export function TornBottom({ color = '#ffffff' }) {
    return (
        <svg
            viewBox="0 0 500 28"
            preserveAspectRatio="none"
            style={{ width: '100%', height: 28, display: 'block', marginTop: -1 }}
        >
            <path
                d="M0,0 L0,10 Q12,22 22,12 Q34,2 44,16 Q56,26 66,12 Q78,2 90,16
           Q100,26 112,12 Q124,0 136,14 Q148,26 158,12 Q170,2 182,16
           Q192,26 204,12 Q214,0 226,14 Q238,26 250,12 Q262,0 272,14
           Q284,26 296,12 Q308,2 320,16 Q330,26 342,12 Q354,0 366,14
           Q376,26 388,12 Q400,2 412,16 Q422,26 432,12 Q444,0 456,14
           Q468,26 478,12 Q490,2 500,16 L500,0 Z"
                fill={color}
            />
        </svg>
    );
}

/** Tape strip — yellow adhesive tape look */
export function TapeStrip({ rotate = 0, top, left, right, width = 56, height = 18, color = '#f5c842' }) {
    return (
        <div
            style={{
                position: 'absolute',
                top, left, right,
                width,
                height,
                background: color,
                opacity: 0.82,
                borderRadius: 3,
                transform: `rotate(${rotate}deg)`,
                zIndex: 20,
                boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
                pointerEvents: 'none',
            }}
        />
    );
}
