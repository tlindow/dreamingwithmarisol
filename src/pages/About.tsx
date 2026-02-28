import { useEffect, useState } from 'react';
import { client, urlFor } from '../sanityClient';
import './About.css';

interface PortraitImage {
    alt?: string;
    asset: { _ref: string };
}

const About = () => {
    const [portraitImageUrl, setPortraitImageUrl] = useState<string | null>(null);
    const [portraitImageAlt, setPortraitImageAlt] = useState('Marisól');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const settings = await client.fetch<{ portraitImage?: PortraitImage } | null>(
                    `*[_type == "siteSettings"][0]{ portraitImage }`,
                );
                if (settings?.portraitImage) {
                    setPortraitImageUrl(
                        urlFor(settings.portraitImage)
                            .width(800)
                            .quality(80)
                            .auto('format')
                            .url(),
                    );
                    if (settings.portraitImage.alt) {
                        setPortraitImageAlt(settings.portraitImage.alt);
                    }
                }
            } catch (error) {
                console.error('Error fetching site settings from Sanity:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSettings();
    }, []);
    return (
        <div className="page-wrapper animate-fade-in">
            <section className="section bg-primary-light">
                <div className="container about-container">
                    <div className="about-content">
                        <h1 className="page-title">About Marisól</h1>

                        <div className="prose">
                            <p>
                                Marisól is a spiritual healer dedicated to guiding individuals through their healing journeys. With deep roots in Mesoamerican traditions, she blends ancestral wisdom with modern energetic practices to offer a holistic approach to wellness.
                            </p>

                            <h2>Experience & Education</h2>
                            <div className="training-list">
                                <div className="training-item">
                                    <h3>Curanderismo</h3>
                                    <p>Extensive training and initiation into traditional Mesoamerican healing practices, focusing on spiritual cleansing (Limpias) and energetic balance.</p>
                                </div>
                                <div className="training-item">
                                    <h3>Psychic Training</h3>
                                    <p>Developed intuitive abilities to assist clients in uncovering deep-seated blockages and navigating life's challenges with clarity.</p>
                                </div>
                                <div className="training-item">
                                    <h3>Reiki</h3>
                                    <p>Certified Reiki practitioner, utilizing universal life energy to promote physical, emotional, and spiritual healing.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="about-image-wrapper">
                        {isLoading ? (
                            <div className="image-placeholder loading-shimmer" />
                        ) : portraitImageUrl ? (
                            <img src={portraitImageUrl} alt={portraitImageAlt} className="about-image" />
                        ) : (
                            <div className="image-placeholder">
                                <span className="placeholder-text">Upload Portrait Image in Sanity</span>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default About;
