import React, { useState, useContext } from 'react';
import axios from 'axios';
import { UserContext } from './UserContext';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const { login } = useContext(UserContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8000/api/login', { email, password });
            const userData = response.data;
            login(userData); // Contextual login
            localStorage.setItem('user', JSON.stringify(userData)); // Save user data in local storage
            navigate('/dashboard');
        } catch (err) {
            setError('Invalid credentials');
        }
    };

    const handleRegister = () => {
        navigate('/register');
    };

    return (
        <div className="container d-flex justify-content-center align-items-center min-vh-100">
            <div className="col-md-6 col-lg-4">
                <div className="card p-4 shadow">
                    <h2 className="text-center mb-4">Login</h2>
                    <form onSubmit={handleSubmit}>
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
                        <button type="submit" className="btn btn-primary w-100 mb-2">Login</button>
                        {error && <div className="alert alert-danger">{error}</div>}
                    </form>
                    <button className="btn btn-secondary w-100" onClick={handleRegister}>Register</button>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
