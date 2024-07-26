import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateDeliveryForm = () => {
    const [inventory, setInventory] = useState([]);
    const [deliveryDriver, setDeliveryDriver] = useState('');
    const [inventoryId, setInventoryId] = useState('');
    const [outValue, setOutValue] = useState('');
    const [orderDate, setOrderDate] = useState('');
    const [drivers, setDrivers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchInventory = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/inventory');
                setInventory(response.data);
            } catch (err) {
                console.error('Failed to fetch inventory', err);
            }
        };

        const fetchDrivers = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/users-for-dropdown');
                setDrivers(response.data.delivery_drivers);
            } catch (err) {
                console.error('Failed to fetch delivery drivers', err);
            }
        };

        fetchInventory();
        fetchDrivers();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8000/api/orders', {
                inventory_id: inventoryId,
                out_value: outValue,
                order_date: orderDate,
                user_id: deliveryDriver,
            });
            navigate('/dashboard');
        } catch (err) {
            console.error('Failed to create delivery', err);
        }
    };

    return (
        <div className="container mt-5">
            <header className="mb-4 d-flex justify-content-between align-items-center">
                <div className="d-flex gap-3">
                    <button className="btn btn-secondary" onClick={() => navigate('/dashboard')}>Return to Dashboard</button>
                </div>
            </header>
            <h3 className="mb-4">Create Delivery</h3>
            <form onSubmit={handleSubmit} className="border p-4 rounded shadow-sm bg-light">
                <div className="mb-3">
                    <label className="form-label">Inventory:</label>
                    <select
                        className="form-select"
                        value={inventoryId}
                        onChange={(e) => setInventoryId(e.target.value)}
                        required
                    >
                        <option value="">Select Inventory</option>
                        {inventory.map(item => (
                            <option key={item.id} value={item.id}>
                                {item.product_name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="mb-3">
                    <label className="form-label">Delivery Driver:</label>
                    <select
                        className="form-select"
                        value={deliveryDriver}
                        onChange={(e) => setDeliveryDriver(e.target.value)}
                        required
                    >
                        <option value="">Select Delivery Driver</option>
                        {drivers.map(driver => (
                            <option key={driver.id} value={driver.id}>
                                {driver.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="mb-3">
                    <label className="form-label">Quantity:</label>
                    <input
                        type="number"
                        className="form-control"
                        value={outValue}
                        onChange={(e) => setOutValue(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Order Date:</label>
                    <input
                        type="date"
                        className="form-control"
                        value={orderDate}
                        onChange={(e) => setOrderDate(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary">Create Delivery</button>
            </form>
        </div>
    );
};

export default CreateDeliveryForm;
