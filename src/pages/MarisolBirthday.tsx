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

const MarisolBirthday = () => {
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

                        <a
                            href="/marisol-birthday.svg"
                            download="marisol-birthday.svg"
                            className="birthday-download"
                        >
                            Download image
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default MarisolBirthday;
