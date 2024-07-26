import React, { useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { UserContext, UserProvider } from './UserContext';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import Dashboard from './Dashboard';
import WarehouseManager from './WarehouseManager';
import CreateDeliveryForm from './CreateDeliveryForm';
import AddInventoryForm from './AddInventoryForm';
import UpdateInventoryForm from './UpdateInventoryItem';
import DeliveryManager from './DeliveryManager';

const App = () => {
    return (
        <UserProvider>
            <Router>
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                    <Route path="/" element={<Navigate to="/login" />} />
                    <Route path="/create-delivery" element={<CreateDeliveryForm />} />
                <Route path="/add-inventory" element={<AddInventoryForm />} />
                <Route path="/update-inventory/:id" element={<UpdateInventoryForm />} />
                <Route path="/warehouse-manager" element={<WarehouseManager />} />
                <Route path="/delivery-manager" element={<DeliveryManager />} />
                </Routes>
            </Router>
        </UserProvider>
    );
};

const PrivateRoute = ({ children }) => {
    const { user } = useContext(UserContext);
    return user ? children : <Navigate to="/login" />;
};

export default App;
