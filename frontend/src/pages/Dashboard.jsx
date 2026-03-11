import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext';
// We only need the combined service now
import transportBookingService from '../services/transportBookingService';
import { FaTicketAlt, FaCalendarCheck, FaClock, FaMapMarkerAlt, FaPlane, FaTrain, FaBus, FaUserFriends } from 'react-icons/fa';

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    
    const [bookings, setBookings] = useState([]);
    const [transportBookings, setTransportBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        const fetchAllBookings = async () => {
            try {
                // FIXED: Changed bookingService to transportBookingService
                const darshanData = await transportBookingService.getMyBookings(user.token);
                // Safety check to ensure we always have an array
                setBookings(Array.isArray(darshanData) ? darshanData : []);

                const travelData = await transportBookingService.getMyTransportBookings(user.token);
                setTransportBookings(Array.isArray(travelData) ? travelData : []);

                setLoading(false);
            } catch (error) {
                console.error("Fetch error:", error);
                toast.error('Failed to fetch your dashboard data');
                setLoading(false);
            }
        };

        fetchAllBookings();
    }, [user, navigate]);

    const getTransportIcon = (type) => {
        if (type === 'FLIGHT') return <FaPlane className="me-2" />;
        if (type === 'TRAIN') return <FaTrain className="me-2" />;
        return <FaBus className="me-2" />;
    };

    if (loading) return <h3 className="text-center mt-5">Loading your dashboard...</h3>;

    return (
        <div className="mt-4 pb-5">
            <h2 className="mb-4 border-bottom pb-3 fw-bold">Welcome back, {user.name}</h2>
            
            {/* --- DARSHAN TICKETS SECTION --- */}
            <h4 className="mb-3 mt-4 text-success d-flex align-items-center">
                <FaTicketAlt className="me-2" /> Your Darshan Tickets
            </h4>
            {bookings.length === 0 ? (
                <div className="alert alert-light border shadow-sm">You have no upcoming darshan bookings.</div>
            ) : (
                <div className="row">
                    {bookings.map((booking) => (
                        <div className="col-md-6 mb-4" key={booking._id}>
                            <div className="card h-100 border-success shadow-sm">
                                <div className="card-header bg-success text-white d-flex justify-content-between align-items-center">
                                    <span className="fw-bold">ID: {booking._id.substring(0, 8).toUpperCase()}</span>
                                    <span className="badge bg-light text-success">{booking.status}</span>
                                </div>
                                <div className="card-body">
                                    <h5 className="card-title text-success fw-bold mb-3">
                                        {booking.slotId?.templeId?.name || 'Temple Name Unavailable'}
                                    </h5>
                                    <p className="card-text mb-2 text-muted d-flex align-items-center">
                                        <FaCalendarCheck className="me-2" /> <strong>Date:</strong> &nbsp;
                                        {booking.slotId?.date ? new Date(booking.slotId.date).toLocaleDateString() : 'N/A'}
                                    </p>
                                    <p className="card-text mb-2 text-muted d-flex align-items-center">
                                        <FaClock className="me-2" /> <strong>Time:</strong> &nbsp;{booking.slotId?.time || 'N/A'}
                                    </p>
                                    <p className="card-text mb-3 text-muted d-flex align-items-center">
                                        <FaUserFriends className="me-2" /> <strong>Devotees:</strong> &nbsp;{booking.numberOfTickets}
                                    </p>

                                    {/* NEW: Displaying the Devotee details from your modal! */}
                                    {booking.passengers && booking.passengers.length > 0 && (
                                        <div className="mt-3 p-3 bg-light rounded border">
                                            <h6 className="fw-bold text-secondary mb-2">Devotee Details:</h6>
                                            <ul className="list-unstyled mb-0" style={{ fontSize: '0.9rem' }}>
                                                {booking.passengers.map((p, i) => (
                                                    <li key={i} className="mb-1 text-dark">
                                                        • <strong>{p.name}</strong> ({p.age} yrs, {p.sex})
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* --- TRAVEL TICKETS SECTION --- */}
            <h4 className="mb-3 mt-5 text-primary d-flex align-items-center">
                <FaPlane className="me-2" /> Your Travel Tickets
            </h4>
            {transportBookings.length === 0 ? (
                <div className="alert alert-light border shadow-sm">You have no upcoming travel bookings.</div>
            ) : (
                <div className="row">
                    {transportBookings.map((ticket) => (
                        <div className="col-md-6 mb-4" key={ticket._id}>
                            <div className="card h-100 border-primary shadow-sm">
                                <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                                    <span className="fw-bold">ID: {ticket._id.substring(0, 8).toUpperCase()}</span>
                                    <span className="badge bg-light text-primary">{ticket.status}</span>
                                </div>
                                <div className="card-body">
                                    <h5 className="card-title text-primary fw-bold mb-1 d-flex align-items-center">
                                        {getTransportIcon(ticket.transportId?.type)}
                                        {ticket.transportId?.type} - {ticket.transportId?.operatorName}
                                    </h5>
                                    <p className="card-text mb-3 text-muted d-flex align-items-center">
                                        <FaMapMarkerAlt className="me-2 text-danger" /> {ticket.transportId?.origin} ➔ {ticket.transportId?.destination}
                                    </p>
                                    <hr />
                                    <p className="card-text mb-2 text-muted d-flex align-items-center">
                                        <FaCalendarCheck className="me-2" /> <strong>Departure:</strong> &nbsp;{new Date(ticket.transportId?.departureTime).toLocaleString()}
                                    </p>
                                    <p className="card-text mb-2 text-muted d-flex align-items-center">
                                        <FaTicketAlt className="me-2" /> <strong>Seats Booked:</strong> &nbsp;{ticket.seatsBooked}
                                    </p>
                                    <p className="card-text mb-0 mt-3 fw-bold text-success fs-5">
                                        Total Paid: ₹{ticket.totalPrice}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Dashboard;