import { useContent } from '../content/ContentContext';
import { DEFAULT_ABOUT_PAGE } from '../content/defaults';
import './About.css';

const About = () => {
    const { content } = useContent();

    const page = content.aboutPage;
    const portraitImageUrl = content.siteSettings.portraitImageUrl ?? null;

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
                                <span className="placeholder-text">Add portrait image URL in /content</span>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default About;
