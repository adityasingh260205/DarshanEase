import axios from 'axios';

// Point this to your Express backend
const API_URL = 'http://localhost:5000/api/auth/';

// Login user API call
const login = async (userData) => {
    const response = await axios.post(API_URL + 'login', userData);
    return response.data;
};

// Register user API call
const register = async (userData) => {
    const response = await axios.post(API_URL + 'register', userData);
    return response.data;
};

export default { login, register };