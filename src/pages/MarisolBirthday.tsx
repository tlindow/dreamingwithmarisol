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

                        <p className="birthday-footer">happy birthday, Marisol</p>

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
