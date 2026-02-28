import { ExternalLink, ShoppingBag } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { SanityImageSource } from '@sanity/image-url';
import { client, urlFor } from '../sanityClient';
import { Button } from '../components/Button';
import './Store.css';

interface Product {
    _id: string;
    title: string;
    description: string;
    price: number;
    storeUrl: string;
    image: SanityImageSource;
}

const Store = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await client.fetch(`
                    *[_type == "product"] | order(_createdAt desc) {
                        _id,
                        title,
                        description,
                        price,
                        storeUrl,
                        image
                    }
                `);
                setProducts(data || []);
            } catch (error) {
                console.error("Error fetching products from Sanity:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProducts();
    }, []);

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
                    ) : products.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {products.map((product) => (
                                <div key={product._id} className="bg-white rounded-lg shadow-sm border border-[var(--color-primary-light)] overflow-hidden flex flex-col hover:shadow-md transition-shadow">
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
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="text-xl font-semibold text-[var(--color-text)]">{product.title}</h3>
                                            {product.price && <span className="text-lg font-medium">£{product.price}</span>}
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
                            ))}
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
