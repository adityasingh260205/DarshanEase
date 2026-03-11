import axios from 'axios';

const API_URL = 'http://localhost:5000/api/slots/';

const getTempleSlots = async (templeId) => {
    // THE FIX: Added 'temple/' to perfectly match your backend route!
    const response = await axios.get(`${API_URL}temple/${templeId}`);
    return response.data;
};

// Add a new darshan slot (Admin only)
const addSlot = async (slotData, token) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.post(API_URL, slotData, config);
    return response.data;
};

export default { getTempleSlots, addSlot };