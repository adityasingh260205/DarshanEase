import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
// NEW: Import the icons we want to use
import { FaPlaneDeparture, FaHandHoldingHeart, FaUserShield, FaTachometerAlt, FaSignOutAlt, FaSignInAlt, FaUserPlus, FaUserCircle } from 'react-icons/fa';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const onLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark mb-4">
            <div className="container">
                <Link className="navbar-brand" to="/">DarshanEase</Link>
                
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto align-items-center">
                        
                        <li className="nav-item">
                            <Link className="nav-link d-flex align-items-center" to="/transport">
                                <FaPlaneDeparture className="me-2" /> Book Travel
                            </Link>
                        </li>

                        <li className="nav-item">
                            <Link className="nav-link text-success fw-bold ms-2 d-flex align-items-center" to="/donate">
                                <FaHandHoldingHeart className="me-2" /> Donate
                            </Link>
                        </li>

                        {user ? (
                            <>
                                {user.role === 'ADMIN' && (
                                    <li className="nav-item">
                                        <Link className="nav-link text-warning fw-bold ms-2 d-flex align-items-center" to="/admin">
                                            <FaUserShield className="me-2" /> Admin Panel
                                        </Link>
                                    </li>
                                )}

                                <li className="nav-item">
                                    <span className="nav-link text-white me-3 ms-3 d-flex align-items-center">
                                        <FaUserCircle className="me-2 fs-5" /> {user.name}
                                    </span>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link d-flex align-items-center" to="/dashboard">
                                        <FaTachometerAlt className="me-2" /> Dashboard
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <button className="btn btn-outline-light btn-sm mt-1 ms-3 d-flex align-items-center" onClick={onLogout}>
                                        <FaSignOutAlt className="me-2" /> Logout
                                    </button>
                                </li>
                            </>
                        ) : (
                            <>
                                <li className="nav-item ms-3">
                                    <Link className="nav-link d-flex align-items-center" to="/login">
                                        <FaSignInAlt className="me-2" /> Login
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link d-flex align-items-center" to="/register">
                                        <FaUserPlus className="me-2" /> Register
                                    </Link>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;