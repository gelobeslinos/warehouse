import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const WarehouseManager = () => {
    const [inventory, setInventory] = useState([]);
    const [lowStockAlerts, setLowStockAlerts] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchInventory();
        fetchLowStockAlerts();
    }, []);

    const fetchInventory = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/inventory');
            setInventory(response.data || []); // Ensure data is an array
        } catch (err) {
            console.error('Failed to fetch inventory', err);
        }
    };

    const fetchLowStockAlerts = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/low-stock-alert');
            console.log('API Response:', response.data); // Log the response to verify the structure
            const alerts = response.data.items || []; // Ensure items is an array
            // Sort alerts from newest to oldest
            alerts.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
            setLowStockAlerts(alerts);
        } catch (err) {
            console.error('Failed to fetch low stock alerts', err);
        }
    };
    
    const handleDeleteProduct = async (id) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
        try {
            await axios.delete(`http://localhost:8000/api/inventory/${id}`);
            fetchInventory();
            fetchLowStockAlerts();
        } catch (err) {
            console.error('Failed to delete product', err);
        }
    }
    };

    const handleNavigateToAddInventory = () => {
        navigate('/add-inventory');
    };

    const formatPrice = (price) => {
        const numberPrice = parseFloat(price);
        return isNaN(numberPrice) ? '0.00' : numberPrice.toFixed(2);
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
                        {lowStockAlerts.length > 0 && (
                            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                {lowStockAlerts.length}
                            </span>
                        )}
                    </button>
                    {showNotifications && (
                        <div className="position-relative end-0 mt-2 bg-light border rounded shadow-lg" style={{ width: '300px', maxHeight: '400px', overflowY: 'auto' }}>
                            <ul className="list-group">
                                {lowStockAlerts.length === 0 ? (
                                    <li className="list-group-item">No low stock alerts</li>
                                ) : (
                                    lowStockAlerts.map(alert => (
                                        <li key={alert.id} className="list-group-item">
                                            The product <strong>{alert.product_name}</strong> is on {alert.stock_level} stock (Low Stock)
                                        </li>
                                    ))
                                )}
                            </ul>
                        </div>
                    )}

                </div>
                <div className="button-container">
                    <button className="btn btn-primary me-2" onClick={handleNavigateToAddInventory}>Add Inventory</button>
                </div>
            </header>
            <h3 className="mb-4">Inventories</h3>
            <div className="mb-4">
                {inventory.map(item => (
                    <div key={item.id} className="card mb-3 p-3">
                        <div className="card-body d-flex justify-content-between align-items-center">
                            <div>
                                <h5 className="card-title">Product Name: {item.product_name}</h5>
                                <p className="card-text">Stock Quantity: {item.stock_level}</p>
                                <p className="card-text">Price: ${formatPrice(item.price)}</p>
                            </div>
                            <div className="button-container">
                                <button className="btn btn-warning me-3" onClick={() => navigate(`/update-inventory/${item.id}`)}>Update</button>
                                <button className="btn btn-danger" onClick={() => handleDeleteProduct(item.id)}>Delete</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default WarehouseManager;
