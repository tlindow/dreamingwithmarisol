import { useMemo } from 'react';
import { ExternalLink, ShoppingBag, Package, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { urlFor } from '../sanityClient';
import { useSanityQuery } from '../hooks/useSanityQuery';
import { STORE_WITH_KITS_QUERY } from '../lib/queries';
import { formatPrice } from '../lib/utils';
import { Button } from '../components/Button';
import type { Product, KitBundle } from '../lib/types';
import './Store.css';

interface StoreData {
    products: Product[];
    kits: KitBundle[];
}

function kitTotalPrice(products: Product[]): number {
    return products.reduce((sum, p) => sum + (p.price ?? 0), 0);
}

const KitBundleCard = ({ kit }: { kit: KitBundle }) => {
    const total = kitTotalPrice(kit.products);
    const bundlePrice = kit.kitBundleSavings ? total - kit.kitBundleSavings : total;
    const itemCount = kit.products.length;

    return (
        <div className="kit-bundle-card">
            <div className="kit-bundle-header">
                <div className="kit-bundle-badge">
                    <Package size={16} />
                    <span>Kit · {itemCount} {itemCount === 1 ? 'item' : 'items'}</span>
                </div>
                <h3 className="kit-bundle-title">{kit.title}</h3>
                <div className="kit-bundle-pricing">
                    {kit.kitBundleSavings ? (
                        <>
                            <span className="kit-bundle-price">{formatPrice(bundlePrice)}</span>
                            <span className="kit-bundle-original-price">{formatPrice(total)}</span>
                            <span className="kit-bundle-savings-tag">
                                <Sparkles size={14} />
                                Save {formatPrice(kit.kitBundleSavings)}
                            </span>
                        </>
                    ) : (
                        <span className="kit-bundle-price">{formatPrice(total)}</span>
                    )}
                </div>
            </div>

            <div className="kit-bundle-items">
                {kit.products.map(product => (
                    <div key={product._id} className="kit-bundle-item">
                        <div className="kit-bundle-item-image">
                            {product.image ? (
                                <img
                                    src={urlFor(product.image).width(120).height(120).url()}
                                    alt={product.title}
                                />
                            ) : (
                                <ShoppingBag size={24} className="text-[var(--color-primary-dark)] opacity-20" />
                            )}
                        </div>
                        <div className="kit-bundle-item-info">
                            <span className="kit-bundle-item-name">{product.title}</span>
                            {product.price && <span className="kit-bundle-item-price">{formatPrice(product.price)}</span>}
                        </div>
                    </div>
                ))}
            </div>

            <div className="kit-bundle-actions">
                {kit.kitBundleUrl ? (
                    <a href={kit.kitBundleUrl} target="_blank" rel="noopener noreferrer" className="kit-bundle-cta-link">
                        <Button variant="primary" className="w-full flex items-center justify-center gap-2">
                            Buy Complete Kit {kit.kitBundleSavings && <span className="kit-cta-savings">& Save {formatPrice(kit.kitBundleSavings)}</span>}
                            <ExternalLink size={18} />
                        </Button>
                    </a>
                ) : (
                    <Link to={`/learning/${kit._id}`} className="kit-bundle-cta-link">
                        <Button variant="primary" className="w-full flex items-center justify-center gap-2">
                            View Kit & Lesson
                            <Package size={18} />
                        </Button>
                    </Link>
                )}
            </div>
        </div>
    );
};

const ProductCard = ({ product, kitName }: { product: Product; kitName?: string }) => (
    <div className="store-product-card bg-white rounded-lg shadow-sm border border-[var(--color-primary-light)] overflow-hidden flex flex-col hover:shadow-md transition-shadow">
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
            {kitName && (
                <div className="product-kit-badge">
                    <Package size={12} />
                    <span>{kitName} Kit</span>
                </div>
            )}
        </div>
        <div className="p-6 flex flex-col flex-grow">
            <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-semibold text-[var(--color-text)]">{product.title}</h3>
                {product.price && <span className="text-lg font-medium">{formatPrice(product.price)}</span>}
            </div>
            {product.description && (
                <p className="text-[var(--color-text-light)] mb-6 flex-grow">{product.description}</p>
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

const Store = () => {
    const { data, isLoading } = useSanityQuery<StoreData>(STORE_WITH_KITS_QUERY);

    const { kits, standaloneProducts, productKitMap } = useMemo(() => {
        if (!data) return { kits: [], standaloneProducts: [], productKitMap: new Map<string, string>() };

        const allKits = data.kits ?? [];
        const allProducts = data.products ?? [];
        const kitProductIds = new Set<string>();
        const pkMap = new Map<string, string>();

        allKits.forEach(kit => {
            kit.products?.forEach(p => {
                kitProductIds.add(p._id);
                pkMap.set(p._id, kit.title);
            });
        });

        const standalone = allProducts.filter(p => !kitProductIds.has(p._id));
        return { kits: allKits, standaloneProducts: standalone, productKitMap: pkMap };
    }, [data]);

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
                    ) : (kits.length > 0 || standaloneProducts.length > 0) ? (
                        <>
                            {kits.length > 0 && (
                                <div className="kit-bundles-section">
                                    <div className="kit-bundles-header">
                                        <Package size={24} className="text-[var(--color-secondary)]" />
                                        <h2 className="text-2xl font-serif text-[var(--color-text)]">Material Kits</h2>
                                        <p className="text-[var(--color-text-light)]">Everything you need for your lessons, bundled together</p>
                                    </div>
                                    <div className="kit-bundles-grid">
                                        {kits.map(kit => (
                                            <KitBundleCard key={kit._id} kit={kit} />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {standaloneProducts.length > 0 && (
                                <div className={kits.length > 0 ? 'mt-16' : ''}>
                                    {kits.length > 0 && (
                                        <h2 className="text-2xl font-serif text-[var(--color-text)] mb-8">Individual Items</h2>
                                    )}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                        {standaloneProducts.map(product => (
                                            <ProductCard key={product._id} product={product} kitName={productKitMap.get(product._id)} />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </>
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
