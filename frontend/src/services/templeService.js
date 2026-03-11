import axios from 'axios';

const API_URL = 'http://localhost:5000/api/temples/';

const getTemples = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};

const getTempleById = async (id) => {
    const response = await axios.get(API_URL + id);
    return response.data;
};

// NEW: Create a temple (Admin only)
const createTemple = async (templeData, token) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.post(API_URL, templeData, config);
    return response.data;
};

// NEW: Delete a temple (Admin only)
const deleteTemple = async (id, token) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.delete(API_URL + id, config);
    return response.data;
};

export default { getTemples, getTempleById, createTemple, deleteTemple };