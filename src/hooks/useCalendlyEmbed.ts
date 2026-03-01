import { useEffect, useCallback, useState, useRef } from 'react';

const BRAND_PARAMS =
    'hide_gdpr_banner=1' +
    '&background_color=f4f3ef' +
    '&text_color=2d2a26' +
    '&primary_color=4a5d23';

function brandedUrl(raw: string) {
    const sep = raw.includes('?') ? '&' : '?';
    return `${raw}${sep}${BRAND_PARAMS}`;
}

declare global {
    interface Window {
        Calendly?: {
            initPopupWidget: (options: { url: string }) => void;
            initInlineWidget: (options: {
                url: string;
                parentElement: HTMLElement;
            }) => void;
        };
    }
}

export function useCalendlyEmbed(calendlyUrl: string | null) {
    const [showCalendly, setShowCalendly] = useState(false);
    const [calendlyReady, setCalendlyReady] = useState(false);
    const embedRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const link = document.createElement('link');
        link.href = 'https://assets.calendly.com/assets/external/widget.css';
        link.rel = 'stylesheet';
        document.head.appendChild(link);

        const script = document.createElement('script');
        script.src = 'https://assets.calendly.com/assets/external/widget.js';
        script.async = true;
        script.onload = () => setCalendlyReady(true);
        document.head.appendChild(script);

        return () => {
            if (script.parentNode) script.parentNode.removeChild(script);
            if (link.parentNode) link.parentNode.removeChild(link);
        };
    }, []);

    const fullUrl = calendlyUrl ? brandedUrl(calendlyUrl) : null;

    useEffect(() => {
        if (showCalendly && calendlyReady && fullUrl && embedRef.current && window.Calendly) {
            embedRef.current.innerHTML = '';
            window.Calendly.initInlineWidget({
                url: fullUrl,
                parentElement: embedRef.current,
            });
            setTimeout(() => {
                embedRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 150);
        }
    }, [showCalendly, calendlyReady, fullUrl]);

    const handleBookClick = useCallback(() => {
        if (!fullUrl) return;
        if (showCalendly) {
            embedRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            return;
        }
        if (calendlyReady) {
            setShowCalendly(true);
        } else {
            window.open(fullUrl, '_blank');
        }
    }, [showCalendly, calendlyReady, fullUrl]);

    return {
        showCalendly,
        setShowCalendly,
        embedRef,
        fullUrl,
        handleBookClick,
    };
}
