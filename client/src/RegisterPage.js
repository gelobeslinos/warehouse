import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

const RegisterPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [userType, setUserType] = useState('warehouse_manager');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [redirecting, setRedirecting] = useState(false); // State to manage redirection
    const navigate = useNavigate(); // Use the navigate hook for routing

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8000/api/register', {
                name,
                email,
                password,
                confirm_password: confirmPassword,
                user_type: userType,
            });
            setSuccess('User registered successfully');
            setError(null);
            setRedirecting(true); // Set redirecting state to true
            setTimeout(() => navigate('/login'), 3000); // Redirect after 3 seconds
        } catch (err) {
            setError('Failed to register user');
            setSuccess(null);
        }
    };

    const handleCancel = () => {
        navigate('/login'); // Redirect to the login page
    };

    return (
        <div className="container d-flex justify-content-center align-items-center min-vh-100">
            <div className="col-md-6 col-lg-4">
                <div className="card p-4 shadow">
                    <h2 className="text-center mb-4">Register</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label">Name:</label>
                            <input
                                type="text"
                                className="form-control"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Email:</label>
                            <input
                                type="email"
                                className="form-control"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Password:</label>
                            <input
                                type="password"
                                className="form-control"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Confirm Password:</label>
                            <input
                                type="password"
                                className="form-control"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">User Type:</label>
                            <select
                                className="form-select"
                                value={userType}
                                onChange={(e) => setUserType(e.target.value)}
                            >
                                <option value="warehouse_manager">Warehouse Manager</option>
                                <option value="supplier">Supplier</option>
                                <option value="delivery_driver">Delivery Driver</option>
                            </select>
                        </div>
                        <button type="submit" className="btn btn-primary w-100 mb-2">Register</button>
                        <button type="button" className="btn btn-secondary w-100" onClick={handleCancel}>Cancel</button>
                        {error && <div className="alert alert-danger mt-3">{error}</div>}
                        {success && !redirecting && <div className="alert alert-success mt-3">{success}</div>}
                        {redirecting && <div className="alert alert-info mt-3">Redirecting to login page...</div>}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
