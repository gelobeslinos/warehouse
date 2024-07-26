import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddInventoryForm = () => {
    const [productName, setProductName] = useState('');
    const [description, setDescription] = useState('');
    const [stockLevel, setStockLevel] = useState('');
    const [price, setPrice] = useState('');
    const [suppliers, setSuppliers] = useState([]);
    const [selectedSupplier, setSelectedSupplier] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchSuppliers();
    }, []);

    const fetchSuppliers = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/users-for-dropdown');
            setSuppliers(response.data.suppliers);
        } catch (err) {
            console.error('Failed to fetch suppliers', err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8000/api/inventory', {
                product_name: productName,
                description,
                stock_level: stockLevel,
                price,
                supplier_id: selectedSupplier,
            });
            // Set view to 'warehouse_manager' before navigating
            localStorage.setItem('currentView', 'warehouse_manager');
            navigate('/dashboard');
        } catch (err) {
            console.error('Failed to add inventory', err);
        }
    };

    return (
        <div className="container mt-5">
            <header className="mb-4 d-flex justify-content-between align-items-center">
                <div className="d-flex gap-3">
                    <button className="btn btn-secondary" onClick={() => {
                        // Set view to 'warehouse_manager' before navigating
                        localStorage.setItem('currentView', 'warehouse_manager');
                        navigate('/dashboard');
                    }}>Return to Dashboard</button>
                </div>
            </header>
            <h3 className="mb-4">Add Inventory</h3>
            <form onSubmit={handleSubmit} className="border p-4 rounded shadow-sm bg-light">
                <div className="mb-3">
                    <label className="form-label">Product Name:</label>
                    <input
                        type="text"
                        className="form-control"
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Description:</label>
                    <input
                        type="text"
                        className="form-control"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Stock Level:</label>
                    <input
                        type="number"
                        className="form-control"
                        value={stockLevel}
                        onChange={(e) => setStockLevel(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Price:</label>
                    <input
                        type="number"
                        step="0.01"
                        className="form-control"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Supplier:</label>
                    <select
                        className="form-select"
                        value={selectedSupplier}
                        onChange={(e) => setSelectedSupplier(e.target.value)}
                        required
                    >
                        <option value="">Select Supplier</option>
                        {suppliers.map(supplier => (
                            <option key={supplier.id} value={supplier.id}>{supplier.name}</option>
                        ))}
                    </select>
                </div>
                <button type="submit" className="btn btn-primary">Add Inventory</button>
            </form>
        </div>
    );
};

export default AddInventoryForm;
