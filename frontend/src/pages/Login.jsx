import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext';
import authService from '../services/authService';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const { login } = useContext(AuthContext); // Bring in the context function
    const navigate = useNavigate();

    const onChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            // 1. Call the backend API
            const userData = await authService.login(formData);
            
            // 2. Save token/user to context and local storage
            login(userData);
            
            toast.success('Logged in successfully!');
            
            // FIXED: Redirect to home page (temples list) instead of dashboard
            navigate('/'); 
        } catch (error) {
            // Extract the error message from the backend response
            const message = error.response?.data?.message || 'Login failed';
            toast.error(message);
        }
    };

    return (
        <div className="row justify-content-center mt-5">
            <div className="col-md-6">
                <div className="card shadow">
                    <div className="card-body">
                        <h2 className="text-center mb-4">Login to DarshanEase</h2>
                        <form onSubmit={onSubmit}>
                            <div className="form-group mb-3">
                                <label>Email address</label>
                                <input 
                                    type="email" 
                                    className="form-control" 
                                    name="email"
                                    value={formData.email} 
                                    onChange={onChange} 
                                    required 
                                />
                            </div>
                            <div className="form-group mb-4">
                                <label>Password</label>
                                <input 
                                    type="password" 
                                    className="form-control" 
                                    name="password"
                                    value={formData.password} 
                                    onChange={onChange} 
                                    required 
                                />
                            </div>
                            <button type="submit" className="btn btn-primary w-100">
                                Login
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;