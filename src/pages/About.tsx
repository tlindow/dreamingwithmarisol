import { urlFor } from '../sanityClient';
import { useSanityQuery } from '../hooks/useSanityQuery';
import { ABOUT_PAGE_QUERY } from '../lib/queries';
import { DEFAULT_ABOUT_PAGE } from '../content/defaults';
import type { AboutPageData, SiteSettings } from '../lib/types';
import './About.css';

interface AboutQueryResult {
    settings: Pick<SiteSettings, 'portraitImage'> | null;
    page: AboutPageData | null;
}

const About = () => {
    const { data } = useSanityQuery<AboutQueryResult>(ABOUT_PAGE_QUERY);

    const page = data?.page;
    const portraitImage = data?.settings?.portraitImage;
    const portraitImageUrl = portraitImage ? urlFor(portraitImage).url() : null;

    const pageTitle = page?.pageTitle ?? DEFAULT_ABOUT_PAGE.pageTitle;
    const bio = page?.bio ?? DEFAULT_ABOUT_PAGE.bio;
    const experienceSectionTitle = page?.experienceSectionTitle ?? DEFAULT_ABOUT_PAGE.experienceSectionTitle;
    const experienceItems = page?.experienceItems ?? DEFAULT_ABOUT_PAGE.experienceItems;

    return (
        <div className="page-wrapper animate-fade-in">
            <section className="section bg-primary-light">
                <div className="container about-container">
                    <div className="about-content">
                        <h1 className="page-title">{pageTitle}</h1>

                        <div className="prose">
                            <p>{bio}</p>

                            <h2>{experienceSectionTitle}</h2>
                            <div className="training-list">
                                {experienceItems.map((item) => (
                                    <div className="training-item" key={item.title}>
                                        <h3>{item.title}</h3>
                                        <p>{item.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="about-image-wrapper">
                        {portraitImageUrl ? (
                            <img src={portraitImageUrl} alt="Marisól" className="about-image" />
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
