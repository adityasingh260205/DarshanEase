import axios from 'axios';

const TRANSPORT_API_URL = 'http://localhost:5000/api/transport-bookings/';
const DARSHAN_API_URL = 'http://localhost:5000/api/bookings/'; // Added Darshan API endpoint

// --- 🚌 TRANSPORT BOOKINGS ---
const bookTransport = async (bookingData, token) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.post(TRANSPORT_API_URL, bookingData, config);
    return response.data;
};

const getMyTransportBookings = async (token) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.get(TRANSPORT_API_URL + 'mybookings', config);
    return response.data;
};

// --- 🙏 DARSHAN BOOKINGS ---
// Added this so TempleDetails.jsx can successfully book Darshan slots!
const createBooking = async (bookingData, token) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.post(DARSHAN_API_URL, bookingData, config);
    return response.data;
};

// Added this so your Dashboard can load your Darshan tickets!
const getMyBookings = async (token) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.get(DARSHAN_API_URL, config); // Adjust if your backend route is different
    return response.data;
};

export default { bookTransport, getMyTransportBookings, createBooking, getMyBookings };