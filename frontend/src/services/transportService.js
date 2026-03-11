import axios from 'axios';

const API_URL = 'http://localhost:5000/api/transport/';

const getTransports = async (searchParams) => {
    const response = await axios.get(API_URL, { params: searchParams });
    return response.data;
};

// NEW: Add new transport (Admin only)
const addTransport = async (transportData, token) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.post(API_URL, transportData, config);
    return response.data;
};

// NEW: Delete transport (Admin only)
const deleteTransport = async (id, token) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.delete(API_URL + id, config);
    return response.data;
};

export default { getTransports, addTransport, deleteTransport };