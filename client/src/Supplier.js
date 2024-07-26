import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Supplier = () => {
    const [deliveries, setDeliveries] = useState([]);
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user && user.id) {
            setUserId(user.id);
            fetchDeliveries(user.id);
        }
    }, []);

    const fetchDeliveries = async (userId) => {
        try {
            const response = await axios.get('http://localhost:8000/api/getSupplierOrders', {
                params: { user_id: userId }
            });
            setDeliveries(response.data);
        } catch (err) {
            console.error('Failed to fetch deliveries', err);
        }
    };

    const handleUpdateOrderStatus = async (id, status) => {
        try {
            await axios.put(`http://localhost:8000/api/orders/${id}`, { status });
            fetchDeliveries(userId); // Refresh deliveries after update
        } catch (err) {
            console.error('Failed to update order status', err);
        }
    };

    return (
        <div className="container mt-5">
            <header className="mb-4 d-flex justify-content-between align-items-center">
                <h3>Supplier Dashboard</h3>
                
            </header>
            <div>
                <h4>Orders</h4>
                {deliveries.length > 0 ? (
                    deliveries.map(delivery => (
                        <div key={delivery.id} className="card mb-3 p-3">
                            <div className="card-body">
                                <p><strong>Product:</strong> {delivery.product_name}</p>
                                <p><strong>Status:</strong> {delivery.status}</p>
                                <p><strong>Quantity:</strong> {delivery.in_value}</p>
                                <div className="button-container">
                                    {delivery.status !== 'delivered' && (
                                        <button
                                            className="btn btn-warning me-2"
                                            onClick={() => handleUpdateOrderStatus(delivery.id, 'pending')}>
                                            Set as Pending
                                        </button>
                                    )}
                                    {delivery.status !== 'delivered' && (
                                        <button
                                            className="btn btn-primary me-2"
                                            onClick={() => handleUpdateOrderStatus(delivery.id, 'en-route')}>
                                            Set as En Route
                                        </button>
                                    )}
                                    {delivery.status !== 'delivered' && (
                                        <button
                                            className="btn btn-success"
                                            onClick={() => handleUpdateOrderStatus(delivery.id, 'delivered')}>
                                            Set as Delivered
                                        </button>
                                    )}
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

export default Supplier;
