import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const UpdateInventoryItem = () => {
    const { id: inventoryId } = useParams();
    const [product_name, setProductName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [in_value, setInValue] = useState('');
    const [out_value, setOutValue] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (inventoryId) {
            fetchInventoryItem();
        }
    }, [inventoryId]);

    const fetchInventoryItem = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/api/inventory/${inventoryId}`);
            const { product_name, description, price, in_value, out_value } = response.data;
            setProductName(product_name);
            setDescription(description);
            setPrice(price);
            setInValue(in_value || '');
            setOutValue(out_value || '');
        } catch (err) {
            console.error('Failed to fetch inventory item', err);
        }
    };

    const handleInValueChange = (e) => {
        setInValue(e.target.value);
        if (e.target.value) {
            setOutValue('');
        }
    };

    const handleOutValueChange = (e) => {
        setOutValue(e.target.value);
        if (e.target.value) {
            setInValue('');
        }
    };

    const handleUpdate = async () => {
        try {
            const user_id = JSON.parse(localStorage.getItem('user')).id;

            await axios.put(`http://localhost:8000/api/inventory/${inventoryId}`, {
                product_name,
                description,
                price: parseFloat(price),
                in_value: in_value ? parseInt(in_value, 10) : 0,
                out_value: out_value ? parseInt(out_value, 10) : 0,
                user_id
            });

            alert('Inventory item updated successfully');
            navigate('/dashboard'); // Redirect to dashboard after update
        } catch (err) {
            console.error('Failed to update inventory item', err);
        }
    };

    return (
        <div className="container mt-5">
            <div className="d-flex justify-content-between mb-4">
                <button className="btn btn-secondary" onClick={() => navigate('/dashboard')}>
                    Return to Dashboard
                </button>
            </div>
            <h3 className="mb-4">Update Inventory Item</h3>
            <form onSubmit={(e) => { e.preventDefault(); handleUpdate(); }}>
                <div className="mb-3">
                    <label className="form-label">Product Name:</label>
                    <input
                        type="text"
                        className="form-control"
                        value={product_name}
                        onChange={(e) => setProductName(e.target.value)}
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
                    <label className="form-label">Price:</label>
                    <input
                        type="number"
                        step="0.01"
                        className="form-control"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Add Stock:</label>
                    <input
                        type="number"
                        className="form-control"
                        value={in_value}
                        onChange={handleInValueChange}
                        disabled={out_value !== ''}
                    />
                </div>
                <div className="mb-4">
                    <label className="form-label">Reduce Stock:</label>
                    <input
                        type="number"
                        className="form-control"
                        value={out_value}
                        onChange={handleOutValueChange}
                        disabled={in_value !== ''}
                    />
                </div>
                <button type="submit" className="btn btn-primary">Update</button>
            </form>
        </div>
    );
};

export default UpdateInventoryItem;
