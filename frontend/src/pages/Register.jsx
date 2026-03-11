import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext';
import authService from '../services/authService';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });

    const { login } = useContext(AuthContext); 
    const navigate = useNavigate();

    const onChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        
        // Basic validation: Check if password is at least 6 characters (matches our backend rule)
        if (formData.password.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }

        try {
            // 1. Call the backend register API
            const userData = await authService.register(formData);
            
            // 2. Log the user in immediately after successful registration
            login(userData);
            
            toast.success('Registration successful!');
            
            // FIXED: Redirect directly to the Home page (temples list)
            navigate('/'); 
        } catch (error) {
            const message = error.response?.data?.message || 'Registration failed';
            toast.error(message);
        }
    };

    return (
        <div className="row justify-content-center mt-5">
            <div className="col-md-6">
                <div className="card shadow">
                    <div className="card-body">
                        <h2 className="text-center mb-4">Create an Account</h2>
                        <form onSubmit={onSubmit}>
                            <div className="form-group mb-3">
                                <label>Full Name</label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    name="name"
                                    value={formData.name} 
                                    onChange={onChange} 
                                    required 
                                />
                            </div>
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
                            <button type="submit" className="btn btn-success w-100">
                                Register
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;