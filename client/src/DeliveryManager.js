    import React, { useState, useEffect } from 'react';
    import axios from 'axios';
    import { useNavigate } from 'react-router-dom';

    const DeliveryManager = () => {
        const [deliveries, setDeliveries] = useState([]);
        const [orderNotifications, setOrderNotifications] = useState([]);
        const [showNotifications, setShowNotifications] = useState(false);
        const [userType, setUserType] = useState('');
        const navigate = useNavigate();

        useEffect(() => {
            const storedUserType = localStorage.getItem('user_type');
            setUserType(storedUserType || '');

            fetchDeliveries();
            fetchOrderNotifications();
        }, []);

        const fetchDeliveries = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/getDeliveriesManager');
                setDeliveries(Array.isArray(response.data) ? response.data : []);
            } catch (err) {
                console.error('Failed to fetch deliveries', err);
                setDeliveries([]); // Ensure deliveries is set to an array
            }
        };

        const fetchOrderNotifications = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/order-notifications');
                setOrderNotifications(Array.isArray(response.data.orders) ? response.data.orders : []);
            } catch (err) {
                console.error('Failed to fetch order notifications', err);
                setOrderNotifications([]); // Ensure orderNotifications is set to an array
            }
        };

        const handleUpdateDeliveryStatus = async (id, status) => {
            try {
                await axios.put(`http://localhost:8000/api/updateDeliveryStatusManager/${id}`, { status });
                await fetchDeliveries(); // Refresh deliveries after update
                await fetchOrderNotifications(); // Refresh notifications after update
            } catch (err) {
                console.error('Failed to update delivery status', err);
            }
        };
        

        
        const handleNavigateToCreateDelivery = () => {
            navigate('/create-delivery');
        };

        const toggleNotifications = () => {
            setShowNotifications(prev => !prev);
        };

        return (
            <div className="container mt-5">
                <header className="mb-4 d-flex justify-content-between align-items-center">
                    <div className="position-relative">
                        <button className="btn btn-light position-relative" onClick={toggleNotifications}>
                            <i className="bi bi-bell" style={{ fontSize: '2rem' }}></i>
                            {orderNotifications.length > 0 && (
                                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                    {orderNotifications.length}
                                </span>
                            )}
                        </button>
                        {showNotifications && (
                            <div className="position-relative end-0 mt-2 bg-light border rounded shadow-lg" style={{ width: '300px' }}>
                                <ul className="list-group">
                                    {orderNotifications.length === 0 ? (
                                        <li className="list-group-item">No new notifications</li>
                                    ) : (
                                        orderNotifications.map(notification => (
                                            <li key={notification.id} className="list-group-item">
                                                {notification.status} delivery of {notification.out_value}  <strong>{notification.product_name}</strong> (Deliverer: {notification.deliverer_name})
                                            </li>
                                        ))
                                    )}
                                </ul>
                            </div>
                        )}
                            
                    </div>
                    <div className="button-container">

                            <button className="btn btn-primary me-2" onClick={handleNavigateToCreateDelivery}>Create Delivery</button>
                        </div>
                </header>
                <h3 className="mb-4">Deliveries</h3>
                <div className="mb-4">
                    {deliveries.length > 0 ? (
                        deliveries.map(delivery => (
                            <div key={delivery.id} className="card mb-3 p-3">
                                <div className="card-body d-flex justify-content-between align-items-center">
                                    <div>
                                        <h5 className="card-title">Product Name: {delivery.product_name}</h5>
                                        <p className="card-text">Status: {delivery.status}</p>
                                        <p className="card-text">Quantity: {delivery.out_value}</p>
                                        <p className="card-text">Deliverer: {delivery.deliverer_name}</p>
                                    </div>
                                    <div className="button-container">
                                        {delivery.status !== 'delivered' && (
                                            <>
                                                <button
                                                    className="btn btn-warning me-2"
                                                    onClick={() => handleUpdateDeliveryStatus(delivery.id, 'pending')}>
                                                    Set as Pending
                                                </button>
                                                <button
                                                    className="btn btn-primary me-2"
                                                    onClick={() => handleUpdateDeliveryStatus(delivery.id, 'en-route')}>
                                                    Set as En Route
                                                </button>
                                            </>
                                        )}
                                        {delivery.status !== 'delivered' && (
                                            <button
                                                className="btn btn-success"
                                                onClick={() => handleUpdateDeliveryStatus(delivery.id, 'delivered')}>
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

    export default DeliveryManager;
