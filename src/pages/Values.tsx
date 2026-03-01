import { useSanityQuery } from '../hooks/useSanityQuery';
import { VALUES_PAGE_QUERY } from '../lib/queries';
import { DEFAULT_VALUES_PAGE } from '../content/defaults';
import type { ValuesPageData } from '../lib/types';
import './Values.css';

const Values = () => {
    const { data } = useSanityQuery<ValuesPageData>(VALUES_PAGE_QUERY);

    const pageTitle = data?.pageTitle ?? DEFAULT_VALUES_PAGE.pageTitle;
    const pageSubtitle = data?.pageSubtitle ?? DEFAULT_VALUES_PAGE.pageSubtitle;
    const values = data?.values ?? DEFAULT_VALUES_PAGE.values;

    return (
        <div className="page-wrapper animate-fade-in">
            <section className="section bg-primary-light">
                <div className="container">
                    <div className="values-header text-center">
                        <h1 className="page-title">{pageTitle}</h1>
                        <p className="page-subtitle">{pageSubtitle}</p>
                    </div>

                    <div className="values-grid">
                        {values.map((value, index) => (
                            <div className="value-card" key={value.title}>
                                <div className="value-icon">{String(index + 1).padStart(2, '0')}</div>
                                <h3>{value.title}</h3>
                                <p>{value.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Values;
