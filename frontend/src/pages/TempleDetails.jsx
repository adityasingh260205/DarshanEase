import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext';
import templeService from '../services/templeService';
import slotService from '../services/slotService';
import bookingService from '../services/transportBookingService'; // Points to your combined service

const TempleDetails = () => {
    const { id } = useParams(); 
    const navigate = useNavigate();
    const { user } = useContext(AuthContext); 
    
    const [temple, setTemple] = useState(null);
    const [slots, setSlots] = useState([]);
    const [loading, setLoading] = useState(true);

    // --- NEW MODAL & FORM STATES ---
    const [showModal, setShowModal] = useState(false);
    const [selectedSlotId, setSelectedSlotId] = useState(null);
    const [ticketCount, setTicketCount] = useState(1);
    const [passengers, setPassengers] = useState([{ name: '', age: '', sex: '' }]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const templeData = await templeService.getTempleById(id);
                setTemple(templeData);
                
                try {
                    const slotData = await slotService.getTempleSlots(id);
                    const actualSlotsArray = Array.isArray(slotData) ? slotData : (slotData.data || slotData.slots || []);
                    setSlots(actualSlotsArray);
                } catch (slotError) {
                    setSlots([]);
                }
                setLoading(false);
            } catch (error) {
                toast.error('Failed to load temple details');
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    // --- MODAL HANDLERS ---
    const openBookingModal = (slotId) => {
        if (!user) {
            toast.warning('Please log in to book a Darshan slot');
            navigate('/login');
            return;
        }
        setSelectedSlotId(slotId);
        setTicketCount(1);
        setPassengers([{ name: '', age: '', sex: '' }]); // Reset form to 1 person
        setShowModal(true); // Open the popup
    };

    // Dynamically add/remove passenger forms based on ticket count
    const handleTicketCountChange = (e) => {
        const count = parseInt(e.target.value) || 1;
        setTicketCount(count);
        
        const updatedPassengers = [...passengers];
        if (count > updatedPassengers.length) {
            for (let i = updatedPassengers.length; i < count; i++) {
                updatedPassengers.push({ name: '', age: '', sex: '' });
            }
        } else {
            updatedPassengers.length = count; 
        }
        setPassengers(updatedPassengers);
    };

    const handlePassengerChange = (index, field, value) => {
        const updatedPassengers = [...passengers];
        updatedPassengers[index][field] = value;
        setPassengers(updatedPassengers);
    };

    // --- SUBMIT FINAL BOOKING ---
    const submitBooking = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                slotId: selectedSlotId,
                numberOfTickets: ticketCount,
                passengers: passengers 
            };

            await bookingService.createBooking(payload, user.token);
            
            toast.success('Darshan booked successfully!');
            setShowModal(false); // Close the popup
            navigate('/dashboard'); // Go to dashboard
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to book slot';
            toast.error(message);
        }
    };

    if (loading) return <h3 className="text-center mt-5">Loading...</h3>;
    if (!temple) return <h3 className="text-center mt-5">Temple not found</h3>;

    return (
        <div className="mt-4 pb-5">
            <div className="row">
                <div className="col-md-6 mb-4">
                    <img 
                        src={temple.images && temple.images.length > 0 ? temple.images[0] : 'https://via.placeholder.com/600x400?text=Temple'} 
                        className="img-fluid rounded shadow" 
                        alt={temple.name} 
                    />
                </div>
                <div className="col-md-6">
                    <h2>{temple.name}</h2>
                    <h5 className="text-muted mb-4">📍 {temple.location}</h5>
                    <p>{temple.description}</p>
                    
                    <h4 className="mt-5 mb-3">Available Darshan Slots</h4>
                    {slots.length === 0 ? (
                        <div className="alert alert-warning">No upcoming slots available at the moment.</div>
                    ) : (
                        <ul className="list-group shadow-sm">
                            {slots.map(slot => (
                                <li key={slot._id} className="list-group-item d-flex justify-content-between align-items-center py-3">
                                    <div>
                                        <strong>{new Date(slot.date).toLocaleDateString()}</strong> at {slot.time}
                                        <br/>
                                        <span className="badge bg-info text-dark mt-1">{slot.availableTickets} tickets left</span>
                                    </div>
                                    <button 
                                        className="btn btn-success"
                                        onClick={() => openBookingModal(slot._id)}
                                        disabled={slot.availableTickets === 0}
                                    >
                                        {slot.availableTickets === 0 ? 'Sold Out' : 'Book Now'}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>

            {/* --- BOOKING POPUP MODAL --- */}
            {showModal && (
                <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1050, position: 'fixed', top: 0, left: 0, width: '100%', height: '100%' }}>
                    <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                        <div className="modal-content">
                            <div className="modal-header bg-success text-white">
                                <h5 className="modal-title">Enter Devotee Details</h5>
                                <button type="button" className="btn-close btn-close-white" onClick={() => setShowModal(false)}></button>
                            </div>
                            
                            <form onSubmit={submitBooking}>
                                <div className="modal-body">
                                    <div className="mb-4">
                                        <label className="form-label fw-bold">Number of Tickets (Max 10)</label>
                                        <input 
                                            type="number" 
                                            className="form-control" 
                                            min="1" 
                                            max="10" 
                                            value={ticketCount} 
                                            onChange={handleTicketCountChange}
                                            required 
                                        />
                                    </div>

                                    <hr />
                                    
                                    {passengers.map((passenger, index) => (
                                        <div key={index} className="mb-4 p-3 border rounded bg-light shadow-sm">
                                            <h6 className="fw-bold text-success mb-3">Devotee {index + 1}</h6>
                                            <div className="mb-2">
                                                <input 
                                                    type="text" 
                                                    className="form-control" 
                                                    placeholder="Full Name" 
                                                    value={passenger.name} 
                                                    onChange={(e) => handlePassengerChange(index, 'name', e.target.value)} 
                                                    required 
                                                />
                                            </div>
                                            <div className="row">
                                                <div className="col-6">
                                                    <input 
                                                        type="number" 
                                                        className="form-control" 
                                                        placeholder="Age" 
                                                        min="1" 
                                                        max="120"
                                                        value={passenger.age} 
                                                        onChange={(e) => handlePassengerChange(index, 'age', e.target.value)} 
                                                        required 
                                                    />
                                                </div>
                                                <div className="col-6">
                                                    <select 
                                                        className="form-select" 
                                                        value={passenger.sex} 
                                                        onChange={(e) => handlePassengerChange(index, 'sex', e.target.value)} 
                                                        required
                                                    >
                                                        <option value="" disabled>Gender</option>
                                                        <option value="Male">Male</option>
                                                        <option value="Female">Female</option>
                                                        <option value="Other">Other</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="modal-footer bg-light">
                                    <button type="button" className="btn btn-outline-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                                    <button type="submit" className="btn btn-success fw-bold">Confirm Booking</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TempleDetails;