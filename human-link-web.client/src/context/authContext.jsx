/* eslint-disable react/prop-types */
import { createContext, useState, useEffect } from 'react';
import { loginService, logoutService } from '../services/authServices.jsx';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user')) || JSON.parse(sessionStorage.getItem('user'));
        if (storedUser) {
            setUser(storedUser);
        }
    }, []);

    const login = async (usuario1, clave, recordar) => {
        const userData = await loginService( usuario1, clave, recordar );

        setUser(userData);

        if (recordar) {
            localStorage.setItem('user', JSON.stringify(userData));
        } else {
            sessionStorage.setItem('user', JSON.stringify(userData));
        }

        return userData;
    };

    const logout = async () => {
        await logoutService();
        setUser(null);
        localStorage.clear()
        sessionStorage.clear()
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};