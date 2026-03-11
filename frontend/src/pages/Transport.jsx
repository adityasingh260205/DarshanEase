import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext';
import transportService from '../services/transportService';
import transportBookingService from '../services/transportBookingService';

const Transport = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [transports, setTransports] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Search filter state
    const [filters, setFilters] = useState({
        type: '',
        origin: '',
        destination: ''
    });

    // Fetch transports whenever filters change
    useEffect(() => {
        const fetchTransports = async () => {
            try {
                // Only pass filters that actually have a value
                const activeFilters = {};
                if (filters.type) activeFilters.type = filters.type;
                if (filters.origin) activeFilters.origin = filters.origin;
                if (filters.destination) activeFilters.destination = filters.destination;

                const data = await transportService.getTransports(activeFilters);
                setTransports(data);
                setLoading(false);
            } catch (error) {
                toast.error('Failed to load transport schedules');
                setLoading(false);
            }
        };

        fetchTransports();
    }, [filters]);

    // Handle typing in the search fields
    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    // Handle booking button click
    const handleBookTicket = async (transportId, availableSeats, pricePerSeat) => {
        if (!user) {
            toast.warning('Please log in to book travel tickets');
            navigate('/login');
            return;
        }

        // Use a simple browser prompt to ask how many seats
        const seatsToBook = window.prompt(`Price is ₹${pricePerSeat} per seat. How many seats would you like to book? (Max: ${availableSeats})`, "1");
        
        // Validate input
        if (!seatsToBook || isNaN(seatsToBook) || seatsToBook <= 0) return;
        if (seatsToBook > availableSeats) {
            toast.error(`Only ${availableSeats} seats available!`);
            return;
        }

        try {
            await transportBookingService.bookTransport({ 
                transportId, 
                seatsBooked: Number(seatsToBook) 
            }, user.token);
            
            toast.success(`Successfully booked ${seatsToBook} seat(s)!`);
            navigate('/dashboard');
        } catch (error) {
            const message = error.response?.data?.message || 'Booking failed';
            toast.error(message);
        }
    };

    return (
        <div className="mt-4">
            <h1 className="text-center mb-4">Book Your Journey</h1>

            {/* Search and Filter Section */}
            <div className="card shadow-sm mb-5">
                <div className="card-body row g-3">
                    <div className="col-md-4">
                        <select className="form-select" name="type" value={filters.type} onChange={handleFilterChange}>
                            <option value="">All Transport Types</option>
                            <option value="FLIGHT">Flight</option>
                            <option value="TRAIN">Train</option>
                            <option value="BUS">Bus</option>
                        </select>
                    </div>
                    <div className="col-md-4">
                        <input type="text" className="form-control" name="origin" placeholder="Leaving from (e.g., Delhi)" value={filters.origin} onChange={handleFilterChange} />
                    </div>
                    <div className="col-md-4">
                        <input type="text" className="form-control" name="destination" placeholder="Going to (e.g., Varanasi)" value={filters.destination} onChange={handleFilterChange} />
                    </div>
                </div>
            </div>

            {/* Transport List */}
            {loading ? (
                <h4 className="text-center">Loading schedules...</h4>
            ) : transports.length === 0 ? (
                <div className="alert alert-warning text-center">No transport schedules found matching your criteria.</div>
            ) : (
                <div className="row">
                    {transports.map((item) => (
                        <div className="col-md-6 mb-4" key={item._id}>
                            <div className="card shadow-sm h-100">
                                <div className="card-header bg-primary text-white d-flex justify-content-between">
                                    <span className="fw-bold">{item.type} - {item.operatorName}</span>
                                    <span>₹{item.pricePerSeat} / seat</span>
                                </div>
                                <div className="card-body">
                                    <h5 className="card-title">{item.origin} ➔ {item.destination}</h5>
                                    <p className="card-text mb-1">
                                        <strong>Departure:</strong> {new Date(item.departureTime).toLocaleString()}
                                    </p>
                                    <p className="card-text mb-3">
                                        <strong>Arrival:</strong> {new Date(item.arrivalTime).toLocaleString()}
                                    </p>
                                    
                                    <div className="d-flex justify-content-between align-items-center">
                                        <span className={`badge ${item.availableSeats > 0 ? 'bg-success' : 'bg-danger'}`}>
                                            {item.availableSeats} Seats Left
                                        </span>
                                        <button 
                                            className="btn btn-primary btn-sm"
                                            onClick={() => handleBookTicket(item._id, item.availableSeats, item.pricePerSeat)}
                                            disabled={item.availableSeats === 0}
                                        >
                                            {item.availableSeats === 0 ? 'Sold Out' : 'Book Ticket'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Transport;