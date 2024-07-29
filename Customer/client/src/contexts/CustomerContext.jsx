import React, { createContext, useState, useEffect } from 'react';
import http from '../http';

const CustomerContext = createContext();

export const CustomerProvider = ({ children }) => {
    const [customer, setCustomer] = useState(null);

    const fetchCustomerData = async () => {
        try {
            const res = await http.get('/customer/auth'); // Adjust the endpoint to fetch customer data
            setCustomer(res.data.customer);
        } catch (error) {
            console.error('Failed to fetch customer data', error);
        }
    };

    useEffect(() => {
        if (localStorage.getItem("accessToken")) {
            fetchCustomerData();
        }
    }, []);

    return (
        <CustomerContext.Provider value={{ customer, setCustomer, fetchCustomerData }}>
            {children}
        </CustomerContext.Provider>
    );
};

export default CustomerContext;
