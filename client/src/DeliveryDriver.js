import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DeliveryDriver = () => {
    const [deliveries, setDeliveries] = useState([]);
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        // Assuming user data is stored in local storage after login
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser) {
            setUserId(storedUser.id);
        }
    }, []);

    useEffect(() => {
        if (userId) {
            fetchDeliveries(userId);
        }
    }, [userId]);

    const fetchDeliveries = async (userId) => {
        try {
            const response = await axios.get('http://localhost:8000/api/getDriverDeliveries', {
                params: { user_id: userId }
            });
            setDeliveries(response.data);
        } catch (err) {
            console.error('Failed to fetch deliveries', err);
        }
    };

    const handleUpdateDeliveryStatus = async (id, status) => {
        try {
            await axios.put(`http://localhost:8000/api/ordersDriver/${id}`, { status });
            fetchDeliveries(userId); // Refresh deliveries after update
        } catch (err) {
            console.error('Failed to update delivery status', err);
        }
    };

    return (
        <div className="container mt-5">
            <header className="mb-4 d-flex justify-content-between align-items-center">
                <h3>Delivery Driver Dashboard</h3>
            </header>
            <div>
                <h4>Delivery Schedule</h4>
                {deliveries.length > 0 ? (
                    deliveries.map(delivery => (
                        <div key={delivery.id} className="card mb-3 p-3">
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-12 col-md-8">
                                        <p><strong>Delivery ID:</strong> {delivery.id}</p>
                                        <p><strong>Item Name:</strong> {delivery.product_name}</p>
                                        <p><strong>Quantity:</strong> {delivery.out_value}</p>
                                        <p><strong>Status:</strong> {delivery.status}</p>
                                    </div>
                                    <div className="col-12 col-md-4 d-flex justify-content-center justify-content-md-end align-items-start">
                                        {delivery.status !== 'delivered' && (
                                            <div className="d-flex flex-column flex-sm-row">
                                                <button
                                                    className="btn btn-warning mb-2 mb-sm-0 me-sm-2"
                                                    onClick={() => handleUpdateDeliveryStatus(delivery.id, 'pending')}>
                                                    Set as Pending
                                                </button>
                                                <button
                                                    className="btn btn-primary mb-2 mb-sm-0 me-sm-2"
                                                    onClick={() => handleUpdateDeliveryStatus(delivery.id, 'en_route')}>
                                                    Set as En Route
                                                </button>
                                                <button
                                                    className="btn btn-success mb-2 mb-sm-0"
                                                    onClick={() => handleUpdateDeliveryStatus(delivery.id, 'delivered')}>
                                                    Set as Delivered
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No deliveries found.</p>
                )}
            </div>
        </div>
    );
};

export default DeliveryDriver;
