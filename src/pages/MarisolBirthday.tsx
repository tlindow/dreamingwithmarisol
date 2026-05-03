import { useState } from 'react';
import './MarisolBirthday.css';

const ITINERARY = [
    {
        time: 'Morning',
        title: "Brunch at Madi’s",
        detail: '',
    },
    {
        time: 'Afternoon',
        title: 'Bookstore browse',
        detail: 'then Garden Coffee in Old Town',
    },
    {
        time: 'Evening',
        title: 'Dinner at Azuki',
        detail: '',
    },
];

const SVG_WIDTH = 1080;
const SVG_HEIGHT = 1350;
const PNG_SCALE = 2;

const downloadPng = async () => {
    const res = await fetch('/marisol-birthday.svg');
    const svgText = await res.text();
    const svgBlob = new Blob([svgText], { type: 'image/svg+xml;charset=utf-8' });
    const svgUrl = URL.createObjectURL(svgBlob);

    try {
        const img = new Image();
        img.decoding = 'async';
        await new Promise<void>((resolve, reject) => {
            img.onload = () => resolve();
            img.onerror = () => reject(new Error('Failed to load SVG'));
            img.src = svgUrl;
        });

        const canvas = document.createElement('canvas');
        canvas.width = SVG_WIDTH * PNG_SCALE;
        canvas.height = SVG_HEIGHT * PNG_SCALE;
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Canvas context unavailable');
        ctx.scale(PNG_SCALE, PNG_SCALE);
        ctx.drawImage(img, 0, 0, SVG_WIDTH, SVG_HEIGHT);

        const pngBlob: Blob = await new Promise((resolve, reject) => {
            canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('toBlob failed'))), 'image/png');
        });

        const pngUrl = URL.createObjectURL(pngBlob);
        const a = document.createElement('a');
        a.href = pngUrl;
        a.download = 'marisol-birthday.png';
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(pngUrl);
    } finally {
        URL.revokeObjectURL(svgUrl);
    }
};

const MarisolBirthday = () => {
    const [busy, setBusy] = useState(false);

    const handleDownload = async () => {
        if (busy) return;
        setBusy(true);
        try {
            await downloadPng();
        } finally {
            setBusy(false);
        }
    };

    return (
        <div className="page-wrapper animate-fade-in">
            <section className="section bg-primary-light">
                <div className="container" style={{ maxWidth: '760px', margin: '0 auto' }}>
                    <div className="birthday-card">
                        <p className="birthday-date">MAY 5, 2026</p>
                        <h1 className="birthday-title">Marisol&rsquo;s Birthday</h1>

                        <ol className="birthday-list">
                            {ITINERARY.map((item, i) => (
                                <li key={item.time} className="birthday-item">
                                    <span className="birthday-num">{i + 1}</span>
                                    <div>
                                        <p className="birthday-time">{item.time}</p>
                                        <p className="birthday-event">{item.title}</p>
                                        {item.detail && <p className="birthday-detail">{item.detail}</p>}
                                    </div>
                                </li>
                            ))}
                        </ol>

                        <div className="birthday-bee" aria-hidden="true">
                            <svg viewBox="0 0 100 130" width="80" height="104">
                                <ellipse cx="35" cy="55" rx="26" ry="16" fill="#f4f3ef" stroke="#4a5d23" strokeWidth="2.5" opacity="0.85" transform="rotate(-28 35 55)"/>
                                <ellipse cx="65" cy="55" rx="26" ry="16" fill="#f4f3ef" stroke="#4a5d23" strokeWidth="2.5" opacity="0.85" transform="rotate(28 65 55)"/>
                                <path d="M 43 45 Q 36 33 32 25" stroke="#2d2a26" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
                                <circle cx="32" cy="25" r="3.5" fill="#2d2a26"/>
                                <path d="M 57 45 Q 64 33 68 25" stroke="#2d2a26" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
                                <circle cx="68" cy="25" r="3.5" fill="#2d2a26"/>
                                <circle cx="50" cy="50" r="13" fill="#2d2a26"/>
                                <ellipse cx="50" cy="85" rx="28" ry="36" fill="#f2aa4c" stroke="#2d2a26" strokeWidth="3"/>
                                <clipPath id="bee-body-clip-page">
                                    <ellipse cx="50" cy="85" rx="28" ry="36"/>
                                </clipPath>
                                <g clipPath="url(#bee-body-clip-page)">
                                    <rect x="20" y="63" width="60" height="9" fill="#2d2a26"/>
                                    <rect x="20" y="83" width="60" height="9" fill="#2d2a26"/>
                                    <rect x="20" y="103" width="60" height="9" fill="#2d2a26"/>
                                </g>
                                <polygon points="50,127 43,119 57,119" fill="#2d2a26"/>
                            </svg>
                        </div>

                        <button
                            type="button"
                            className="birthday-download"
                            onClick={handleDownload}
                            disabled={busy}
                        >
                            {busy ? 'Preparing…' : 'Download image'}
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default MarisolBirthday;
