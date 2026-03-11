import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext';
import templeService from '../services/templeService';
import transportService from '../services/transportService';
import slotService from '../services/slotService';

const AdminDashboard = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [temples, setTemples] = useState([]);
    
    // Form States
    const [templeData, setTempleData] = useState({ name: '', location: '', description: '', images: '' });
    const [slotData, setSlotData] = useState({ templeId: '', date: '', time: '', totalTickets: '' });
    const [transportData, setTransportData] = useState({ 
        type: 'BUS', operatorName: '', origin: '', destination: '', departureTime: '', arrivalTime: '', pricePerSeat: '', totalSeats: '' 
    });

    useEffect(() => {
        if (!user || user.role !== 'ADMIN') {
            toast.error('Access Denied: Admins Only');
            navigate('/');
            return;
        }
        fetchTemples();
    }, [user, navigate]);

    const fetchTemples = async () => {
        try {
            const data = await templeService.getTemples();
            setTemples(data);
        } catch (error) {
            toast.error('Failed to load temples');
        }
    };

    // --- TEMPLE HANDLERS ---
    const handleTempleChange = (e) => setTempleData({ ...templeData, [e.target.name]: e.target.value });
    
    const handleCreateTemple = async (e) => {
        e.preventDefault();
        try {
            const payload = { ...templeData, images: templeData.images ? templeData.images.split(',').map(img => img.trim()) : [] };
            await templeService.createTemple(payload, user.token);
            toast.success('Temple created successfully');
            setTempleData({ name: '', location: '', description: '', images: '' });
            fetchTemples();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to create temple');
        }
    };

    const handleDeleteTemple = async (id) => {
        if (!window.confirm('Are you sure you want to delete this temple?')) return;
        try {
            await templeService.deleteTemple(id, user.token);
            toast.success('Temple deleted');
            fetchTemples();
        } catch (error) {
            toast.error('Failed to delete temple');
        }
    };

    // --- SLOT HANDLERS ---
    const handleSlotChange = (e) => setSlotData({ ...slotData, [e.target.name]: e.target.value });

    const handleCreateSlot = async (e) => {
        e.preventDefault();
        try {
            // FIXED: Map frontend form data to the exact field names the backend schema expects
            const payload = { 
                templeId: slotData.templeId,
                date: slotData.date,
                time: slotData.time,
                capacity: Number(slotData.totalTickets),
                availableTickets: Number(slotData.totalTickets) 
            };
            
            await slotService.addSlot(payload, user.token);
            toast.success('Darshan slot created successfully!');
            setSlotData({ templeId: '', date: '', time: '', totalTickets: '' });
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to create slot');
        }
    };

    // --- TRANSPORT HANDLERS ---
    const handleTransportChange = (e) => setTransportData({ ...transportData, [e.target.name]: e.target.value });

    const handleCreateTransport = async (e) => {
        e.preventDefault();
        try {
            const payload = { 
                ...transportData, 
                pricePerSeat: Number(transportData.pricePerSeat), 
                totalSeats: Number(transportData.totalSeats) 
            };
            await transportService.addTransport(payload, user.token);
            toast.success('Travel route created successfully!');
            setTransportData({ type: 'BUS', operatorName: '', origin: '', destination: '', departureTime: '', arrivalTime: '', pricePerSeat: '', totalSeats: '' });
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to create transport');
        }
    };

    return (
        <div className="mt-4 pb-5">
            <h1 className="mb-4 text-danger border-bottom pb-2">🛠️ Admin Control Panel</h1>
            
            <div className="row">
                {/* --- ADD TEMPLE FORM --- */}
                <div className="col-md-6 mb-4">
                    <div className="card shadow-sm border-danger h-100">
                        <div className="card-header bg-danger text-white"><h5>Add New Temple</h5></div>
                        <div className="card-body">
                            <form onSubmit={handleCreateTemple}>
                                <input type="text" name="name" className="form-control mb-2" placeholder="Temple Name" value={templeData.name} onChange={handleTempleChange} required />
                                <input type="text" name="location" className="form-control mb-2" placeholder="Location" value={templeData.location} onChange={handleTempleChange} required />
                                <textarea name="description" className="form-control mb-2" placeholder="Description" value={templeData.description} onChange={handleTempleChange} required></textarea>
                                <input type="text" name="images" className="form-control mb-3" placeholder="Image URLs (comma separated)" value={templeData.images} onChange={handleTempleChange} />
                                <button type="submit" className="btn btn-danger w-100">Create Temple</button>
                            </form>
                        </div>
                    </div>
                </div>

                {/* --- MANAGE TEMPLES LIST --- */}
                <div className="col-md-6 mb-4">
                    <div className="card shadow-sm h-100">
                        <div className="card-header bg-dark text-white"><h5>Existing Temples</h5></div>
                        <ul className="list-group list-group-flush" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                            {temples.map(temple => (
                                <li className="list-group-item d-flex justify-content-between align-items-center" key={temple._id}>
                                    <div><strong>{temple.name}</strong><br/><small className="text-muted">{temple.location}</small></div>
                                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteTemple(temple._id)}>Delete</button>
                                </li>
                            ))}
                            {temples.length === 0 && <li className="list-group-item">No temples found.</li>}
                        </ul>
                    </div>
                </div>
            </div>

            <div className="row mt-2">
                {/* --- ADD DARSHAN SLOT FORM --- */}
                <div className="col-md-6 mb-4">
                    <div className="card shadow-sm border-success h-100">
                        <div className="card-header bg-success text-white"><h5>Generate Darshan Slots</h5></div>
                        <div className="card-body">
                            <form onSubmit={handleCreateSlot}>
                                {/* Dynamic dropdown for Temple selection */}
                                <select name="templeId" className="form-select mb-2" value={slotData.templeId} onChange={handleSlotChange} required>
                                    <option value="">-- Select Temple --</option>
                                    {temples.map(t => <option key={t._id} value={t._id}>{t.name}</option>)}
                                </select>
                                <div className="row mb-2">
                                    <div className="col"><input type="date" name="date" className="form-control" value={slotData.date} onChange={handleSlotChange} required /></div>
                                    <div className="col"><input type="time" name="time" className="form-control" value={slotData.time} onChange={handleSlotChange} required /></div>
                                </div>
                                <input type="number" name="totalTickets" className="form-control mb-3" placeholder="Total Tickets Available" value={slotData.totalTickets} onChange={handleSlotChange} required />
                                <button type="submit" className="btn btn-success w-100">Create Time Slot</button>
                            </form>
                        </div>
                    </div>
                </div>

                {/* --- ADD TRANSPORT FORM --- */}
                <div className="col-md-6 mb-4">
                    <div className="card shadow-sm border-primary h-100">
                        <div className="card-header bg-primary text-white"><h5>Add Travel Route</h5></div>
                        <div className="card-body">
                            <form onSubmit={handleCreateTransport}>
                                <div className="row mb-2">
                                    <div className="col-4">
                                        <select name="type" className="form-select" value={transportData.type} onChange={handleTransportChange}>
                                            <option value="BUS">Bus</option>
                                            <option value="TRAIN">Train</option>
                                            <option value="FLIGHT">Flight</option>
                                        </select>
                                    </div>
                                    <div className="col-8">
                                        <input type="text" name="operatorName" className="form-control" placeholder="Operator (e.g., Vande Bharat)" value={transportData.operatorName} onChange={handleTransportChange} required />
                                    </div>
                                </div>
                                <div className="row mb-2">
                                    <div className="col"><input type="text" name="origin" className="form-control" placeholder="Origin" value={transportData.origin} onChange={handleTransportChange} required /></div>
                                    <div className="col"><input type="text" name="destination" className="form-control" placeholder="Destination" value={transportData.destination} onChange={handleTransportChange} required /></div>
                                </div>
                                <div className="row mb-2">
                                    <div className="col"><small className="text-muted">Departure Date & Time</small><input type="datetime-local" name="departureTime" className="form-control" value={transportData.departureTime} onChange={handleTransportChange} required /></div>
                                    <div className="col"><small className="text-muted">Arrival Date & Time</small><input type="datetime-local" name="arrivalTime" className="form-control" value={transportData.arrivalTime} onChange={handleTransportChange} required /></div>
                                </div>
                                <div className="row mb-3">
                                    <div className="col"><input type="number" name="pricePerSeat" className="form-control" placeholder="Price (₹)" value={transportData.pricePerSeat} onChange={handleTransportChange} required /></div>
                                    <div className="col"><input type="number" name="totalSeats" className="form-control" placeholder="Total Seats" value={transportData.totalSeats} onChange={handleTransportChange} required /></div>
                                </div>
                                <button type="submit" className="btn btn-primary w-100">Create Travel Route</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;