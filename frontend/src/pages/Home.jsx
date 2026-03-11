import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import templeService from '../services/templeService';
// Import modern icons
import { FaMapMarkerAlt, FaPlaceOfWorship } from 'react-icons/fa';

const Home = () => {
    const [temples, setTemples] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTemples = async () => {
            try {
                const data = await templeService.getTemples();
                setTemples(data);
                setLoading(false);
            } catch (error) {
                toast.error('Failed to load temples');
                setLoading(false);
            }
        };
        fetchTemples();
    }, []);

    if (loading) return <h3 className="text-center mt-5 text-muted">Loading sacred destinations...</h3>;

    return (
        <div className="mt-4 pb-5">
            {/* Modern Header Section */}
            <div className="text-center mb-5">
                <h1 className="fw-bold display-5 d-flex justify-content-center align-items-center text-dark">
                    <FaPlaceOfWorship className="me-3 text-primary" /> 
                    Explore Sacred Destinations
                </h1>
                <p className="text-muted fs-5 mt-2">Book your Darshan slots and travel tickets with ease.</p>
            </div>

            {/* Temple Grid */}
            <div className="row g-4">
                {temples.map((temple) => (
                    <div className="col-md-6 col-lg-4" key={temple._id}>
                        <div className="card h-100 shadow-sm border-0">
                            {/* Force images to be the exact same height so the grid looks uniform */}
                            <img 
                                src={temple.images && temple.images.length > 0 ? temple.images[0] : 'https://via.placeholder.com/600x400?text=Temple'} 
                                className="card-img-top" 
                                alt={temple.name}
                                style={{ height: '220px', objectFit: 'cover' }}
                            />
                            <div className="card-body d-flex flex-column">
                                <h5 className="card-title fw-bold mb-1">{temple.name}</h5>
                                
                                {/* Modern Location Icon */}
                                <h6 className="card-subtitle mb-3 text-muted d-flex align-items-center mt-2">
                                    <FaMapMarkerAlt className="me-2 text-danger" />
                                    {temple.location}
                                </h6>
                                
                                {/* Truncate long descriptions so the cards stay relatively the same size */}
                                <p className="card-text flex-grow-1 text-secondary" style={{ fontSize: '0.95rem', lineHeight: '1.6' }}>
                                    {temple.description.length > 110 
                                        ? `${temple.description.substring(0, 110)}...` 
                                        : temple.description}
                                </p>
                                
                                <Link to={`/temples/${temple._id}`} className="btn btn-primary mt-3 fw-bold w-100 shadow-sm">
                                    View Details & Book
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Fallback if database is empty */}
                {temples.length === 0 && (
                    <div className="col-12 text-center mt-5">
                        <h4 className="text-muted">No temples found. Please check back later.</h4>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;