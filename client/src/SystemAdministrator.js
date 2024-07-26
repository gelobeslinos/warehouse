import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UserEditForm from './UserEditForm';

const SystemAdministrator = () => {
    const [users, setUsers] = useState([]);
    const [editingUserId, setEditingUserId] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/users');
            setUsers(response.data.filter(user => user.user_type !== 'system_administrator')); // Filter out system administrators
        } catch (err) {
            console.error('Failed to fetch users', err);
        }
    };

    const handleDeleteUser = async (id) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await axios.delete(`http://localhost:8000/api/users/${id}`);
                fetchUsers();
            } catch (err) {
                console.error('Failed to delete user', err);
            }
        }
    };

    const handleEditClick = (userId) => {
        setEditingUserId(userId);
    };

    const handleCloseEditForm = () => {
        setEditingUserId(null);
        fetchUsers(); // Refresh users after editing
    };

    return (
        <div>
            <h3>User Management</h3>
            <div>
                {users.length > 0 ? (
                    users.map(user => (
                        <div key={user.id} className="mb-3 p-3 border rounded">
                            <p><strong>Name:</strong> {user.name}</p>
                            <p><strong>Email:</strong> {user.email}</p>
                            <p><strong>Type:</strong> {user.user_type}</p>
                            <button onClick={() => handleEditClick(user.id)} className="btn btn-primary">Edit</button>
                            <button onClick={() => handleDeleteUser(user.id)} className="btn btn-danger ms-2">Delete</button>
                        </div>
                    ))
                ) : (
                    <p>No users found.</p>
                )}
            </div>
            {editingUserId && (
                <UserEditForm userId={editingUserId} onClose={handleCloseEditForm} />
            )}
        </div>
    );
};

export default SystemAdministrator;
