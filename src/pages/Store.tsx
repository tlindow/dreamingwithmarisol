import { ExternalLink, PackagePlus, ShoppingBag } from 'lucide-react';
import { urlFor } from '../sanityClient';
import { useSanityQuery } from '../hooks/useSanityQuery';
import { STORE_QUERY } from '../lib/queries';
import { formatPrice } from '../lib/utils';
import { Button } from '../components/Button';
import type { Product } from '../lib/types';
import './Store.css';

const normalizeKitName = (kitName?: string) => kitName?.trim().toLowerCase() ?? '';

const Store = () => {
    const { data: products, isLoading } = useSanityQuery<Product[]>(STORE_QUERY);

    const items = products ?? [];

    const kitCounts = items.reduce<Record<string, number>>((counts, product) => {
        const key = normalizeKitName(product.kitName);

        if (!key) {
            return counts;
        }

        return {
            ...counts,
            [key]: (counts[key] ?? 0) + 1,
        };
    }, {});

    return (
        <div className="page-wrapper animate-fade-in">
            <section className="section bg-primary-light">
                <div className="container text-center">
                    <h1 className="page-title">Apothecary & Supplies</h1>
                    <p className="page-subtitle">Curated materials for your spiritual practice</p>
                </div>
            </section>

            <section className="section">
                <div className="container">
                    {isLoading ? (
                        <div className="text-center py-12">
                            <p className="text-[var(--color-text-light)]">Loading shop artifacts...</p>
                        </div>
                    ) : items.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {items.map((product) => {
                                const normalizedKitName = normalizeKitName(product.kitName);
                                const relatedItemsCount = normalizedKitName ? kitCounts[normalizedKitName] ?? 0 : 0;
                                const shouldShowBundlePrompt = relatedItemsCount > 1;

                                return (
                                    <div
                                        key={product._id}
                                        className="bg-white rounded-lg shadow-sm border border-[var(--color-primary-light)] overflow-hidden flex flex-col hover:shadow-md transition-shadow"
                                    >
                                        <div className="aspect-square bg-[var(--color-primary-light)] relative overflow-hidden flex items-center justify-center">
                                            {product.image ? (
                                                <img
                                                    src={urlFor(product.image).width(400).height(400).url()}
                                                    alt={product.title}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <ShoppingBag size={48} className="text-[var(--color-primary-dark)] opacity-20" />
                                            )}
                                        </div>
                                        <div className="p-6 flex flex-col flex-grow">
                                            <div className="flex justify-between items-start mb-2 gap-4">
                                                <h3 className="text-xl font-semibold text-[var(--color-text)]">{product.title}</h3>
                                                {product.price && <span className="text-lg font-medium whitespace-nowrap">{formatPrice(product.price)}</span>}
                                            </div>
                                            {product.description && (
                                                <p className="text-[var(--color-text-light)] mb-6 flex-grow">{product.description}</p>
                                            )}
                                            {shouldShowBundlePrompt && (
                                                <div className="store-bundle-prompt mb-6" aria-label={`Bundle suggestion for ${product.kitName}`}>
                                                    <PackagePlus size={18} aria-hidden="true" />
                                                    <p>
                                                        Build your <strong>{product.kitName}</strong> kit: {relatedItemsCount} matching items are available.
                                                    </p>
                                                </div>
                                            )}
                                            <div className="mt-auto">
                                                <a href={product.storeUrl} target="_blank" rel="noopener noreferrer" className="block">
                                                    <Button variant="primary" className="w-full flex items-center justify-center gap-2">
                                                        Purchase Now <ExternalLink size={18} />
                                                    </Button>
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-[var(--color-text-light)]">The apothecary is currently empty. Check back soon for new artifacts.</p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default Store;
