import axios from 'axios';

const API_URL = 'http://localhost:5000/api/donations/';

// Create a new donation
const createDonation = async (donationData, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
    const response = await axios.post(API_URL, donationData, config);
    return response.data;
};

export default { createDonation };