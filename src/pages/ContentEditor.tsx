import { useMemo, useState } from 'react';
import { useContent } from '../content/ContentContext';
import { exportSiteContent } from '../content/contentStore';
import type { SiteContent } from '../lib/types';
import './ContentEditor.css';

type InputProps = {
    label: string;
    value: string;
    onChange: (next: string) => void;
    placeholder?: string;
    multiline?: boolean;
    type?: 'text' | 'number' | 'email' | 'url' | 'datetime-local';
};

function Field({
    label,
    value,
    onChange,
    placeholder,
    multiline = false,
    type = 'text',
}: InputProps) {
    return (
        <label className="cms-field">
            <span className="cms-field-label">{label}</span>
            {multiline ? (
                <textarea
                    className="cms-input cms-textarea"
                    value={value}
                    placeholder={placeholder}
                    onChange={(e) => onChange(e.target.value)}
                    rows={4}
                />
            ) : (
                <input
                    className="cms-input"
                    type={type}
                    value={value}
                    placeholder={placeholder}
                    onChange={(e) => onChange(e.target.value)}
                />
            )}
        </label>
    );
}

function normalizeLines(value: string): string[] {
    return value
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean);
}

const ContentEditor = () => {
    const { content, setContent, resetContent, importContent } = useContent();
    const requiredPassword = (import.meta.env.VITE_CONTENT_EDITOR_PASSWORD ?? '').trim();

    const [passwordInput, setPasswordInput] = useState('');
    const [unlocked, setUnlocked] = useState(!requiredPassword);
    const [importDraft, setImportDraft] = useState('');
    const [feedback, setFeedback] = useState<string | null>(null);

    const productMap = useMemo(() => {
        return new Map(content.products.map((product) => [product._id, product.title]));
    }, [content.products]);

    const saveFeedback = (message: string) => {
        setFeedback(message);
        window.setTimeout(() => setFeedback(null), 2500);
    };

    const withContentUpdate = (updater: (prev: SiteContent) => SiteContent) => {
        setContent(updater);
        saveFeedback('Saved');
    };

    const exportJson = () => {
        const json = exportSiteContent(content);
        const blob = new Blob([json], { type: 'application/json' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'dreaming-with-marisol-content.json';
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(link.href);
        saveFeedback('Export downloaded');
    };

    const handleImport = () => {
        try {
            importContent(importDraft);
            setImportDraft('');
            saveFeedback('Import complete');
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Invalid JSON';
            setFeedback(`Import failed: ${message}`);
        }
    };

    if (!unlocked) {
        return (
            <div className="page-wrapper animate-fade-in">
                <section className="section bg-primary-light">
                    <div className="container cms-auth-wrap">
                        <h1 className="page-title">Content Editor</h1>
                        <p className="page-subtitle">Enter password to edit site content</p>
                        <div className="cms-auth-card">
                            <Field
                                label="Password"
                                value={passwordInput}
                                onChange={setPasswordInput}
                                type="text"
                            />
                            <button
                                className="cms-btn cms-btn-primary"
                                onClick={() => {
                                    if (passwordInput === requiredPassword) {
                                        setUnlocked(true);
                                        setFeedback(null);
                                        return;
                                    }
                                    setFeedback('Password incorrect');
                                }}
                            >
                                Unlock
                            </button>
                            {feedback && <p className="cms-feedback">{feedback}</p>}
                        </div>
                    </div>
                </section>
            </div>
        );
    }

    return (
        <div className="page-wrapper animate-fade-in">
            <section className="section bg-primary-light">
                <div className="container cms-header">
                    <h1 className="page-title">Content Editor</h1>
                    <p className="page-subtitle">Fast mobile editing for every page on your site</p>
                    <div className="cms-actions">
                        <button className="cms-btn cms-btn-primary" onClick={exportJson}>
                            Export JSON
                        </button>
                        <button className="cms-btn" onClick={resetContent}>
                            Reset to defaults
                        </button>
                    </div>
                    {feedback && <p className="cms-feedback">{feedback}</p>}
                </div>
            </section>

            <section className="section">
                <div className="container cms-layout">
                    <details className="cms-section" open>
                        <summary>Site Settings</summary>
                        <div className="cms-grid">
                            <Field label="Site title" value={content.siteSettings.title ?? ''} onChange={(value) => withContentUpdate((prev) => ({ ...prev, siteSettings: { ...prev.siteSettings, title: value } }))} />
                            <Field label="Tagline" value={content.siteSettings.tagline ?? ''} onChange={(value) => withContentUpdate((prev) => ({ ...prev, siteSettings: { ...prev.siteSettings, tagline: value } }))} />
                            <Field label="Contact email" type="email" value={content.siteSettings.contactEmail ?? ''} onChange={(value) => withContentUpdate((prev) => ({ ...prev, siteSettings: { ...prev.siteSettings, contactEmail: value } }))} />
                            <Field label="Instagram URL" type="url" value={content.siteSettings.instagramUrl ?? ''} onChange={(value) => withContentUpdate((prev) => ({ ...prev, siteSettings: { ...prev.siteSettings, instagramUrl: value } }))} />
                            <Field label="Substack URL" type="url" value={content.siteSettings.substackUrl ?? ''} onChange={(value) => withContentUpdate((prev) => ({ ...prev, siteSettings: { ...prev.siteSettings, substackUrl: value } }))} />
                            <Field label="Calendly URL" type="url" value={content.siteSettings.calendlyUrl ?? ''} onChange={(value) => withContentUpdate((prev) => ({ ...prev, siteSettings: { ...prev.siteSettings, calendlyUrl: value } }))} />
                            <Field label="Home hero image URL" type="url" value={content.siteSettings.heroImageUrl ?? ''} onChange={(value) => withContentUpdate((prev) => ({ ...prev, siteSettings: { ...prev.siteSettings, heroImageUrl: value } }))} />
                            <Field label="About portrait image URL" type="url" value={content.siteSettings.portraitImageUrl ?? ''} onChange={(value) => withContentUpdate((prev) => ({ ...prev, siteSettings: { ...prev.siteSettings, portraitImageUrl: value } }))} />
                        </div>
                    </details>

                    <details className="cms-section" open>
                        <summary>Home</summary>
                        <div className="cms-grid">
                            <Field label="Hero title" value={content.homePage.heroTitle ?? ''} onChange={(value) => withContentUpdate((prev) => ({ ...prev, homePage: { ...prev.homePage, heroTitle: value } }))} />
                            <Field label="Hero subtitle" multiline value={content.homePage.heroSubtitle ?? ''} onChange={(value) => withContentUpdate((prev) => ({ ...prev, homePage: { ...prev.homePage, heroSubtitle: value } }))} />
                            <Field label="Offerings section title" value={content.homePage.offeringsTitle ?? ''} onChange={(value) => withContentUpdate((prev) => ({ ...prev, homePage: { ...prev.homePage, offeringsTitle: value } }))} />
                            <Field label="Offerings subtitle" multiline value={content.homePage.offeringsSubtitle ?? ''} onChange={(value) => withContentUpdate((prev) => ({ ...prev, homePage: { ...prev.homePage, offeringsSubtitle: value } }))} />
                        </div>
                        <div className="cms-list">
                            {(content.homePage.offerings ?? []).map((offering, index) => (
                                <div key={`${offering.title}-${index}`} className="cms-card">
                                    <div className="cms-card-header">
                                        <h4>Offering {index + 1}</h4>
                                        <button
                                            className="cms-link-btn"
                                            onClick={() =>
                                                withContentUpdate((prev) => ({
                                                    ...prev,
                                                    homePage: {
                                                        ...prev.homePage,
                                                        offerings: (prev.homePage.offerings ?? []).filter((_, i) => i !== index),
                                                    },
                                                }))
                                            }
                                        >
                                            Remove
                                        </button>
                                    </div>
                                    <Field label="Title" value={offering.title} onChange={(value) => withContentUpdate((prev) => ({ ...prev, homePage: { ...prev.homePage, offerings: (prev.homePage.offerings ?? []).map((item, i) => i === index ? { ...item, title: value } : item) } }))} />
                                    <Field label="Description" multiline value={offering.description} onChange={(value) => withContentUpdate((prev) => ({ ...prev, homePage: { ...prev.homePage, offerings: (prev.homePage.offerings ?? []).map((item, i) => i === index ? { ...item, description: value } : item) } }))} />
                                    <Field label="Link path" value={offering.linkPath} onChange={(value) => withContentUpdate((prev) => ({ ...prev, homePage: { ...prev.homePage, offerings: (prev.homePage.offerings ?? []).map((item, i) => i === index ? { ...item, linkPath: value } : item) } }))} />
                                </div>
                            ))}
                            <button
                                className="cms-btn"
                                onClick={() =>
                                    withContentUpdate((prev) => ({
                                        ...prev,
                                        homePage: {
                                            ...prev.homePage,
                                            offerings: [
                                                ...(prev.homePage.offerings ?? []),
                                                { title: 'New offering', description: '', linkPath: '/' },
                                            ],
                                        },
                                    }))
                                }
                            >
                                Add offering
                            </button>
                        </div>
                    </details>

                    <details className="cms-section">
                        <summary>About</summary>
                        <div className="cms-grid">
                            <Field label="Page title" value={content.aboutPage.pageTitle ?? ''} onChange={(value) => withContentUpdate((prev) => ({ ...prev, aboutPage: { ...prev.aboutPage, pageTitle: value } }))} />
                            <Field label="Bio" multiline value={content.aboutPage.bio ?? ''} onChange={(value) => withContentUpdate((prev) => ({ ...prev, aboutPage: { ...prev.aboutPage, bio: value } }))} />
                            <Field label="Experience section title" value={content.aboutPage.experienceSectionTitle ?? ''} onChange={(value) => withContentUpdate((prev) => ({ ...prev, aboutPage: { ...prev.aboutPage, experienceSectionTitle: value } }))} />
                        </div>
                        <div className="cms-list">
                            {(content.aboutPage.experienceItems ?? []).map((item, index) => (
                                <div key={`${item.title}-${index}`} className="cms-card">
                                    <div className="cms-card-header">
                                        <h4>Experience {index + 1}</h4>
                                        <button className="cms-link-btn" onClick={() => withContentUpdate((prev) => ({ ...prev, aboutPage: { ...prev.aboutPage, experienceItems: (prev.aboutPage.experienceItems ?? []).filter((_, i) => i !== index) } }))}>Remove</button>
                                    </div>
                                    <Field label="Title" value={item.title} onChange={(value) => withContentUpdate((prev) => ({ ...prev, aboutPage: { ...prev.aboutPage, experienceItems: (prev.aboutPage.experienceItems ?? []).map((it, i) => i === index ? { ...it, title: value } : it) } }))} />
                                    <Field label="Description" multiline value={item.description} onChange={(value) => withContentUpdate((prev) => ({ ...prev, aboutPage: { ...prev.aboutPage, experienceItems: (prev.aboutPage.experienceItems ?? []).map((it, i) => i === index ? { ...it, description: value } : it) } }))} />
                                </div>
                            ))}
                            <button className="cms-btn" onClick={() => withContentUpdate((prev) => ({ ...prev, aboutPage: { ...prev.aboutPage, experienceItems: [...(prev.aboutPage.experienceItems ?? []), { title: 'New item', description: '' }] } }))}>Add experience item</button>
                        </div>
                    </details>

                    <details className="cms-section">
                        <summary>Healings (In-person + Online)</summary>
                        <div className="cms-subsection-title">In-person service</div>
                        <div className="cms-grid">
                            <Field label="Title" value={content.inPersonService.title ?? ''} onChange={(value) => withContentUpdate((prev) => ({ ...prev, inPersonService: { ...prev.inPersonService, title: value } }))} />
                            <Field label="Page title" value={content.inPersonService.pageTitle ?? ''} onChange={(value) => withContentUpdate((prev) => ({ ...prev, inPersonService: { ...prev.inPersonService, pageTitle: value } }))} />
                            <Field label="Page subtitle" value={content.inPersonService.pageSubtitle ?? ''} onChange={(value) => withContentUpdate((prev) => ({ ...prev, inPersonService: { ...prev.inPersonService, pageSubtitle: value } }))} />
                            <Field label="Price" type="number" value={String(content.inPersonService.price ?? '')} onChange={(value) => withContentUpdate((prev) => ({ ...prev, inPersonService: { ...prev.inPersonService, price: Number(value) || 0 } }))} />
                            <Field label="Duration" value={content.inPersonService.duration ?? ''} onChange={(value) => withContentUpdate((prev) => ({ ...prev, inPersonService: { ...prev.inPersonService, duration: value } }))} />
                            <Field label="Description" multiline value={content.inPersonService.description ?? ''} onChange={(value) => withContentUpdate((prev) => ({ ...prev, inPersonService: { ...prev.inPersonService, description: value } }))} />
                            <Field label="What to expect" multiline value={content.inPersonService.whatToExpect ?? ''} onChange={(value) => withContentUpdate((prev) => ({ ...prev, inPersonService: { ...prev.inPersonService, whatToExpect: value } }))} />
                            <Field label="Cancellation policy" multiline value={content.inPersonService.cancellationPolicy ?? ''} onChange={(value) => withContentUpdate((prev) => ({ ...prev, inPersonService: { ...prev.inPersonService, cancellationPolicy: value } }))} />
                            <Field label="Refunds policy" multiline value={content.inPersonService.refundsPolicy ?? ''} onChange={(value) => withContentUpdate((prev) => ({ ...prev, inPersonService: { ...prev.inPersonService, refundsPolicy: value } }))} />
                            <Field label="Preparation text" multiline value={content.inPersonService.preparationText ?? ''} onChange={(value) => withContentUpdate((prev) => ({ ...prev, inPersonService: { ...prev.inPersonService, preparationText: value } }))} />
                        </div>

                        <div className="cms-subsection-title">Online service</div>
                        <div className="cms-grid">
                            <Field label="Title" value={content.onlineService.title ?? ''} onChange={(value) => withContentUpdate((prev) => ({ ...prev, onlineService: { ...prev.onlineService, title: value } }))} />
                            <Field label="Page title" value={content.onlineService.pageTitle ?? ''} onChange={(value) => withContentUpdate((prev) => ({ ...prev, onlineService: { ...prev.onlineService, pageTitle: value } }))} />
                            <Field label="Page subtitle" value={content.onlineService.pageSubtitle ?? ''} onChange={(value) => withContentUpdate((prev) => ({ ...prev, onlineService: { ...prev.onlineService, pageSubtitle: value } }))} />
                            <Field label="Price" type="number" value={String(content.onlineService.price ?? '')} onChange={(value) => withContentUpdate((prev) => ({ ...prev, onlineService: { ...prev.onlineService, price: Number(value) || 0 } }))} />
                            <Field label="Duration" value={content.onlineService.duration ?? ''} onChange={(value) => withContentUpdate((prev) => ({ ...prev, onlineService: { ...prev.onlineService, duration: value } }))} />
                            <Field label="Description" multiline value={content.onlineService.description ?? ''} onChange={(value) => withContentUpdate((prev) => ({ ...prev, onlineService: { ...prev.onlineService, description: value } }))} />
                            <Field label="What to expect" multiline value={content.onlineService.whatToExpect ?? ''} onChange={(value) => withContentUpdate((prev) => ({ ...prev, onlineService: { ...prev.onlineService, whatToExpect: value } }))} />
                            <Field label="Cancellation policy" multiline value={content.onlineService.cancellationPolicy ?? ''} onChange={(value) => withContentUpdate((prev) => ({ ...prev, onlineService: { ...prev.onlineService, cancellationPolicy: value } }))} />
                            <Field label="Refunds policy" multiline value={content.onlineService.refundsPolicy ?? ''} onChange={(value) => withContentUpdate((prev) => ({ ...prev, onlineService: { ...prev.onlineService, refundsPolicy: value } }))} />
                            <Field label="Preparation text" multiline value={content.onlineService.preparationText ?? ''} onChange={(value) => withContentUpdate((prev) => ({ ...prev, onlineService: { ...prev.onlineService, preparationText: value } }))} />
                        </div>
                    </details>

                    <details className="cms-section">
                        <summary>Values + Pricing</summary>
                        <div className="cms-grid">
                            <Field label="Values page title" value={content.valuesPage.pageTitle ?? ''} onChange={(value) => withContentUpdate((prev) => ({ ...prev, valuesPage: { ...prev.valuesPage, pageTitle: value } }))} />
                            <Field label="Values subtitle" multiline value={content.valuesPage.pageSubtitle ?? ''} onChange={(value) => withContentUpdate((prev) => ({ ...prev, valuesPage: { ...prev.valuesPage, pageSubtitle: value } }))} />
                        </div>
                        <div className="cms-list">
                            {(content.valuesPage.values ?? []).map((valueItem, index) => (
                                <div key={`${valueItem.title}-${index}`} className="cms-card">
                                    <div className="cms-card-header">
                                        <h4>Value {index + 1}</h4>
                                        <button className="cms-link-btn" onClick={() => withContentUpdate((prev) => ({ ...prev, valuesPage: { ...prev.valuesPage, values: (prev.valuesPage.values ?? []).filter((_, i) => i !== index) } }))}>Remove</button>
                                    </div>
                                    <Field label="Title" value={valueItem.title} onChange={(next) => withContentUpdate((prev) => ({ ...prev, valuesPage: { ...prev.valuesPage, values: (prev.valuesPage.values ?? []).map((item, i) => i === index ? { ...item, title: next } : item) } }))} />
                                    <Field label="Description" multiline value={valueItem.description} onChange={(next) => withContentUpdate((prev) => ({ ...prev, valuesPage: { ...prev.valuesPage, values: (prev.valuesPage.values ?? []).map((item, i) => i === index ? { ...item, description: next } : item) } }))} />
                                </div>
                            ))}
                            <button className="cms-btn" onClick={() => withContentUpdate((prev) => ({ ...prev, valuesPage: { ...prev.valuesPage, values: [...(prev.valuesPage.values ?? []), { title: 'New value', description: '' }] } }))}>Add value</button>
                        </div>

                        <div className="cms-grid">
                            <Field label="Pricing page title" value={content.pricingPage.pageTitle ?? ''} onChange={(value) => withContentUpdate((prev) => ({ ...prev, pricingPage: { ...prev.pricingPage, pageTitle: value } }))} />
                            <Field label="Cancellation policy" multiline value={content.pricingPage.cancellationPolicy ?? ''} onChange={(value) => withContentUpdate((prev) => ({ ...prev, pricingPage: { ...prev.pricingPage, cancellationPolicy: value } }))} />
                            <Field label="Refunds policy" multiline value={content.pricingPage.refundsPolicy ?? ''} onChange={(value) => withContentUpdate((prev) => ({ ...prev, pricingPage: { ...prev.pricingPage, refundsPolicy: value } }))} />
                        </div>
                        <div className="cms-list">
                            {(content.pricingPage.servicesList ?? []).map((service, index) => (
                                <div key={`${service.name}-${index}`} className="cms-card">
                                    <div className="cms-card-header">
                                        <h4>Pricing row {index + 1}</h4>
                                        <button className="cms-link-btn" onClick={() => withContentUpdate((prev) => ({ ...prev, pricingPage: { ...prev.pricingPage, servicesList: (prev.pricingPage.servicesList ?? []).filter((_, i) => i !== index) } }))}>Remove</button>
                                    </div>
                                    <Field label="Service name" value={service.name} onChange={(next) => withContentUpdate((prev) => ({ ...prev, pricingPage: { ...prev.pricingPage, servicesList: (prev.pricingPage.servicesList ?? []).map((item, i) => i === index ? { ...item, name: next } : item) } }))} />
                                    <Field label="Duration" value={service.duration ?? ''} onChange={(next) => withContentUpdate((prev) => ({ ...prev, pricingPage: { ...prev.pricingPage, servicesList: (prev.pricingPage.servicesList ?? []).map((item, i) => i === index ? { ...item, duration: next } : item) } }))} />
                                    <Field label="Price" type="number" value={String(service.price)} onChange={(next) => withContentUpdate((prev) => ({ ...prev, pricingPage: { ...prev.pricingPage, servicesList: (prev.pricingPage.servicesList ?? []).map((item, i) => i === index ? { ...item, price: Number(next) || 0 } : item) } }))} />
                                </div>
                            ))}
                            <button className="cms-btn" onClick={() => withContentUpdate((prev) => ({ ...prev, pricingPage: { ...prev.pricingPage, servicesList: [...(prev.pricingPage.servicesList ?? []), { name: 'New service', duration: '60 Min', price: 0 }] } }))}>Add pricing row</button>
                        </div>
                    </details>

                    <details className="cms-section">
                        <summary>Store Products</summary>
                        <div className="cms-list">
                            {content.products.map((product, index) => (
                                <div key={product._id} className="cms-card">
                                    <div className="cms-card-header">
                                        <h4>{product.title || `Product ${index + 1}`}</h4>
                                        <button className="cms-link-btn" onClick={() => withContentUpdate((prev) => ({ ...prev, products: prev.products.filter((_, i) => i !== index) }))}>Remove</button>
                                    </div>
                                    <Field label="ID" value={product._id} onChange={(next) => withContentUpdate((prev) => ({ ...prev, products: prev.products.map((item, i) => i === index ? { ...item, _id: next } : item) }))} />
                                    <Field label="Title" value={product.title} onChange={(next) => withContentUpdate((prev) => ({ ...prev, products: prev.products.map((item, i) => i === index ? { ...item, title: next } : item) }))} />
                                    <Field label="Category (digital/physical/bundle)" value={product.category ?? ''} onChange={(next) => withContentUpdate((prev) => ({ ...prev, products: prev.products.map((item, i) => i === index ? { ...item, category: (next || undefined) as 'digital' | 'physical' | 'bundle' | undefined } : item) }))} />
                                    <Field label="Price" type="number" value={String(product.price ?? '')} onChange={(next) => withContentUpdate((prev) => ({ ...prev, products: prev.products.map((item, i) => i === index ? { ...item, price: Number(next) || 0 } : item) }))} />
                                    <Field label="Image URL" type="url" value={product.imageUrl ?? ''} onChange={(next) => withContentUpdate((prev) => ({ ...prev, products: prev.products.map((item, i) => i === index ? { ...item, imageUrl: next } : item) }))} />
                                    <Field label="Gallery URLs (one per line)" multiline value={(product.gallery ?? []).join('\n')} onChange={(next) => withContentUpdate((prev) => ({ ...prev, products: prev.products.map((item, i) => i === index ? { ...item, gallery: normalizeLines(next) } : item) }))} />
                                    <Field label="Description" multiline value={product.description} onChange={(next) => withContentUpdate((prev) => ({ ...prev, products: prev.products.map((item, i) => i === index ? { ...item, description: next } : item) }))} />
                                    <Field label="Long body text" multiline value={product.body ?? ''} onChange={(next) => withContentUpdate((prev) => ({ ...prev, products: prev.products.map((item, i) => i === index ? { ...item, body: next } : item) }))} />
                                    <Field label="Features (one per line)" multiline value={(product.features ?? []).join('\n')} onChange={(next) => withContentUpdate((prev) => ({ ...prev, products: prev.products.map((item, i) => i === index ? { ...item, features: normalizeLines(next) } : item) }))} />
                                    <Field label="Store URL" type="url" value={product.storeUrl ?? ''} onChange={(next) => withContentUpdate((prev) => ({ ...prev, products: prev.products.map((item, i) => i === index ? { ...item, storeUrl: next } : item) }))} />
                                    <Field label="Stripe payment link" type="url" value={product.stripePaymentLink ?? ''} onChange={(next) => withContentUpdate((prev) => ({ ...prev, products: prev.products.map((item, i) => i === index ? { ...item, stripePaymentLink: next } : item) }))} />
                                </div>
                            ))}
                            <button
                                className="cms-btn"
                                onClick={() =>
                                    withContentUpdate((prev) => ({
                                        ...prev,
                                        products: [
                                            ...prev.products,
                                            {
                                                _id: `product-${Date.now()}`,
                                                title: 'New product',
                                                description: '',
                                                category: 'physical',
                                                price: 0,
                                                imageUrl: '',
                                                features: [],
                                                gallery: [],
                                            },
                                        ],
                                    }))
                                }
                            >
                                Add product
                            </button>
                        </div>
                    </details>

                    <details className="cms-section">
                        <summary>Learning Modules</summary>
                        <div className="cms-list">
                            {content.learningModules.map((module, index) => (
                                <div key={module._id} className="cms-card">
                                    <div className="cms-card-header">
                                        <h4>{module.title || `Module ${index + 1}`}</h4>
                                        <button className="cms-link-btn" onClick={() => withContentUpdate((prev) => ({ ...prev, learningModules: prev.learningModules.filter((_, i) => i !== index) }))}>Remove</button>
                                    </div>
                                    <Field label="ID" value={module._id} onChange={(next) => withContentUpdate((prev) => ({ ...prev, learningModules: prev.learningModules.map((item, i) => i === index ? { ...item, _id: next } : item) }))} />
                                    <Field label="Title" value={module.title} onChange={(next) => withContentUpdate((prev) => ({ ...prev, learningModules: prev.learningModules.map((item, i) => i === index ? { ...item, title: next } : item) }))} />
                                    <Field label="Duration" value={module.duration} onChange={(next) => withContentUpdate((prev) => ({ ...prev, learningModules: prev.learningModules.map((item, i) => i === index ? { ...item, duration: next } : item) }))} />
                                    <Field label="Description" multiline value={module.description} onChange={(next) => withContentUpdate((prev) => ({ ...prev, learningModules: prev.learningModules.map((item, i) => i === index ? { ...item, description: next } : item) }))} />
                                    <Field label="Thumbnail CSS class (e.g. bg-primary)" value={module.thumbnailColor} onChange={(next) => withContentUpdate((prev) => ({ ...prev, learningModules: prev.learningModules.map((item, i) => i === index ? { ...item, thumbnailColor: next } : item) }))} />
                                    <Field label="Video URL" type="url" value={module.videoUrl ?? ''} onChange={(next) => withContentUpdate((prev) => ({ ...prev, learningModules: prev.learningModules.map((item, i) => i === index ? { ...item, videoUrl: next } : item) }))} />
                                    <Field label="Linked product IDs (comma separated)" value={(module.productIds ?? []).join(',')} onChange={(next) => withContentUpdate((prev) => ({ ...prev, learningModules: prev.learningModules.map((item, i) => i === index ? { ...item, productIds: next.split(',').map((id) => id.trim()).filter(Boolean) } : item) }))} />
                                </div>
                            ))}
                            <button
                                className="cms-btn"
                                onClick={() =>
                                    withContentUpdate((prev) => ({
                                        ...prev,
                                        learningModules: [
                                            ...prev.learningModules,
                                            {
                                                _id: `module-${Date.now()}`,
                                                title: 'New module',
                                                duration: '0 min',
                                                description: '',
                                                thumbnailColor: 'bg-primary',
                                                videoUrl: '',
                                                productIds: [],
                                            },
                                        ],
                                    }))
                                }
                            >
                                Add learning module
                            </button>
                        </div>
                    </details>

                    <details className="cms-section">
                        <summary>Events</summary>
                        <div className="cms-grid">
                            <Field label="Events page title" value={content.eventsPage.pageTitle ?? ''} onChange={(next) => withContentUpdate((prev) => ({ ...prev, eventsPage: { ...prev.eventsPage, pageTitle: next } }))} />
                            <Field label="Events subtitle" multiline value={content.eventsPage.pageSubtitle ?? ''} onChange={(next) => withContentUpdate((prev) => ({ ...prev, eventsPage: { ...prev.eventsPage, pageSubtitle: next } }))} />
                        </div>
                        <div className="cms-list">
                            {content.events.map((event, index) => (
                                <div key={event._id} className="cms-card">
                                    <div className="cms-card-header">
                                        <h4>{event.title || `Event ${index + 1}`}</h4>
                                        <button className="cms-link-btn" onClick={() => withContentUpdate((prev) => ({ ...prev, events: prev.events.filter((_, i) => i !== index) }))}>Remove</button>
                                    </div>
                                    <Field label="ID" value={event._id} onChange={(next) => withContentUpdate((prev) => ({ ...prev, events: prev.events.map((item, i) => i === index ? { ...item, _id: next } : item) }))} />
                                    <Field label="Title" value={event.title} onChange={(next) => withContentUpdate((prev) => ({ ...prev, events: prev.events.map((item, i) => i === index ? { ...item, title: next } : item) }))} />
                                    <Field label="Type (ceremony/workshop/retreat/gathering/online)" value={event.eventType} onChange={(next) => withContentUpdate((prev) => ({ ...prev, events: prev.events.map((item, i) => i === index ? { ...item, eventType: next } : item) }))} />
                                    <Field label="Start date/time" type="datetime-local" value={event.date ? event.date.slice(0, 16) : ''} onChange={(next) => withContentUpdate((prev) => ({ ...prev, events: prev.events.map((item, i) => i === index ? { ...item, date: next } : item) }))} />
                                    <Field label="End date/time" type="datetime-local" value={event.endDate ? event.endDate.slice(0, 16) : ''} onChange={(next) => withContentUpdate((prev) => ({ ...prev, events: prev.events.map((item, i) => i === index ? { ...item, endDate: next } : item) }))} />
                                    <Field label="Location" value={event.location} onChange={(next) => withContentUpdate((prev) => ({ ...prev, events: prev.events.map((item, i) => i === index ? { ...item, location: next } : item) }))} />
                                    <Field label="Price (0 = free)" type="number" value={String(event.price ?? 0)} onChange={(next) => withContentUpdate((prev) => ({ ...prev, events: prev.events.map((item, i) => i === index ? { ...item, price: Number(next) || 0 } : item) }))} />
                                    <Field label="Image URL" type="url" value={event.imageUrl ?? ''} onChange={(next) => withContentUpdate((prev) => ({ ...prev, events: prev.events.map((item, i) => i === index ? { ...item, imageUrl: next } : item) }))} />
                                    <Field label="Flyer URL" type="url" value={event.flyerUrl ?? ''} onChange={(next) => withContentUpdate((prev) => ({ ...prev, events: prev.events.map((item, i) => i === index ? { ...item, flyerUrl: next } : item) }))} />
                                    <Field label="Description" multiline value={event.description} onChange={(next) => withContentUpdate((prev) => ({ ...prev, events: prev.events.map((item, i) => i === index ? { ...item, description: next } : item) }))} />
                                    <Field label="Detailed description" multiline value={event.detailedDescription ?? ''} onChange={(next) => withContentUpdate((prev) => ({ ...prev, events: prev.events.map((item, i) => i === index ? { ...item, detailedDescription: next } : item) }))} />
                                    <Field label="Stripe payment link" type="url" value={event.stripePaymentLink ?? ''} onChange={(next) => withContentUpdate((prev) => ({ ...prev, events: prev.events.map((item, i) => i === index ? { ...item, stripePaymentLink: next } : item) }))} />
                                </div>
                            ))}
                            <button
                                className="cms-btn"
                                onClick={() =>
                                    withContentUpdate((prev) => ({
                                        ...prev,
                                        events: [
                                            ...prev.events,
                                            {
                                                _id: `event-${Date.now()}`,
                                                title: 'New event',
                                                eventType: 'gathering',
                                                date: new Date().toISOString(),
                                                location: '',
                                                description: '',
                                                price: 0,
                                                imageUrl: '',
                                            },
                                        ],
                                    }))
                                }
                            >
                                Add event
                            </button>
                        </div>
                    </details>

                    <details className="cms-section">
                        <summary>Import JSON</summary>
                        <div className="cms-grid">
                            <Field
                                label="Paste exported JSON"
                                multiline
                                value={importDraft}
                                onChange={setImportDraft}
                            />
                            <button className="cms-btn cms-btn-primary" onClick={handleImport}>
                                Import and overwrite current content
                            </button>
                        </div>
                    </details>

                    <details className="cms-section">
                        <summary>Reference: Product IDs for module linking</summary>
                        <div className="cms-list">
                            {Array.from(productMap.entries()).map(([id, title]) => (
                                <div key={id} className="cms-id-row">
                                    <code>{id}</code>
                                    <span>{title}</span>
                                </div>
                            ))}
                        </div>
                    </details>
                </div>
            </section>
        </div>
    );
};

export default ContentEditor;
