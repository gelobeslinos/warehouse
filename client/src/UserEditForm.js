import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserEditForm = ({ userId, onClose }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/users/${userId}`);
                setUser(response.data);
            } catch (err) {
                console.error('Failed to fetch user', err);
            }
        };

        fetchUser();
    }, [userId]);

    const handleChange = (e) => {
        setUser({
            ...user,
            [e.target.name]: e.target.value,
        });
    };

    const handleSaveClick = async () => {
        try {
            await axios.put(`http://localhost:8000/api/users/${userId}`, user);
            onClose(); // Notify parent component to refresh the list
        } catch (err) {
            console.error('Failed to update user', err);
        }
    };

    if (!user) return <p>Loading...</p>;

    return (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Edit User</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        <div className="mb-3">
                            <label className="form-label">Name</label>
                            <input
                                type="text"
                                className="form-control"
                                name="name"
                                value={user.name}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Email</label>
                            <input
                                type="email"
                                className="form-control"
                                name="email"
                                value={user.email}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">User Type</label>
                            <select
                                className="form-select"
                                name="user_type"
                                value={user.user_type}
                                onChange={handleChange}
                            >
                                <option value="warehouse_manager">Warehouse Manager</option>
                                <option value="supplier">Supplier</option>
                                <option value="delivery_driver">Delivery Driver</option>
                                {/* Add other user types as needed */}
                            </select>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>Close</button>
                        <button type="button" className="btn btn-primary" onClick={handleSaveClick}>Save Changes</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserEditForm;
