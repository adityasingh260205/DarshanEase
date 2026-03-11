import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext';
import templeService from '../services/templeService';
import donationService from '../services/donationService';

const Donation = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [temples, setTemples] = useState([]);
    const [formData, setFormData] = useState({
        templeId: '',
        amount: ''
    });

    // Fetch temples when the page loads so we can populate the dropdown
    useEffect(() => {
        const fetchTemples = async () => {
            try {
                const data = await templeService.getTemples();
                setTemples(data);
            } catch (error) {
                toast.error('Failed to load temples for donation');
            }
        };
        fetchTemples();
    }, []);

    const onChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const onSubmit = async (e) => {
        e.preventDefault();

        if (!user) {
            toast.warning('Please log in to make a donation');
            navigate('/login');
            return;
        }

        if (formData.amount <= 0) {
            toast.error('Please enter a valid donation amount');
            return;
        }

        try {
            // Ensure amount is sent as a number
            const payload = {
                templeId: formData.templeId,
                amount: Number(formData.amount)
            };

            await donationService.createDonation(payload, user.token);
            toast.success('Thank you for your generous donation! 🙏');
            
            // Reset the form
            setFormData({ templeId: '', amount: '' });
            navigate('/dashboard'); // Optionally redirect them to their dashboard
        } catch (error) {
            const message = error.response?.data?.message || 'Donation failed. Please try again.';
            toast.error(message);
        }
    };

    return (
        <div className="row justify-content-center mt-5">
            <div className="col-md-6">
                <div className="card shadow-lg border-0">
                    <div className="card-header bg-success text-white text-center py-3">
                        <h3 className="mb-0">Support a Temple</h3>
                    </div>
                    <div className="card-body p-4">
                        <p className="text-center text-muted mb-4">
                            Your contributions help maintain these sacred spaces and support the community.
                        </p>
                        <form onSubmit={onSubmit}>
                            <div className="form-group mb-3">
                                <label className="fw-bold mb-1">Select Temple</label>
                                <select 
                                    className="form-select" 
                                    name="templeId" 
                                    value={formData.templeId} 
                                    onChange={onChange} 
                                    required
                                >
                                    <option value="">-- Choose a Temple --</option>
                                    {temples.map((temple) => (
                                        <option key={temple._id} value={temple._id}>
                                            {temple.name} ({temple.location})
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group mb-4">
                                <label className="fw-bold mb-1">Donation Amount (₹)</label>
                                <div className="input-group">
                                    <span className="input-group-text bg-light">₹</span>
                                    <input 
                                        type="number" 
                                        className="form-control" 
                                        name="amount"
                                        placeholder="e.g. 501"
                                        value={formData.amount} 
                                        onChange={onChange} 
                                        min="1"
                                        required 
                                    />
                                </div>
                            </div>
                            <button type="submit" className="btn btn-success w-100 py-2 fw-bold text-uppercase">
                                Donate Now
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Donation;