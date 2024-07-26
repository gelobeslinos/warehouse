import React, { useContext, useState } from 'react';
import { UserContext } from './UserContext';
import WarehouseManager from './WarehouseManager';
import DeliveryManager from './DeliveryManager';
import Supplier from './Supplier';
import DeliveryDriver from './DeliveryDriver';
import SystemAdministrator from './SystemAdministrator';

const Dashboard = () => {
    const { user, logout } = useContext(UserContext);
    const [showWarehouseManager, setShowWarehouseManager] = useState(false); // Default to DeliveryManager

    if (!user) {
        return (
            <div className="container mt-5">
                <div className="card text-center shadow">
                    <div className="card-body">
                        <h5 className="card-title">You need to log in to view this page.</h5>
                    </div>
                </div>
            </div>
        );
    }

    const handleToggle = () => {
        setShowWarehouseManager(prev => !prev);
    };

    return (
        <div className="container mt-5">
            <div className="card text-center shadow mb-4">
                <div className="card-body">
                    <h5 className="card-title">Welcome, {user.name}!</h5>
                    <h6 className="card-subtitle mb-2 text-muted">Your role is: {user.user_type}</h6>
                    <button className="btn btn-info text-white" onClick={logout}>Logout</button>
                </div>
            </div>
            
            <div className="mb-4 text-center">
                {user.user_type === 'warehouse_manager' && (
                    <>
                        <button className="btn btn-secondary me-2" onClick={handleToggle}>
                            {showWarehouseManager ? 'Show Delivery Manager' : 'Show Warehouse Manager'}
                        </button>
                    </>
                )}
            </div>

            <div className="row">
                <div className="col-md-12">
                    {user.user_type === 'warehouse_manager' && showWarehouseManager && <WarehouseManager />}
                    {user.user_type === 'warehouse_manager' && !showWarehouseManager && <DeliveryManager />}
                    {user.user_type === 'supplier' && <Supplier />}
                    {user.user_type === 'delivery_driver' && <DeliveryDriver />}
                    {user.user_type === 'system_administrator' && <SystemAdministrator />}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
