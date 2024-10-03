import { createContext, useState, useEffect } from 'react';
import { login as loginService } from '../services/authServices.jsx';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState({ username: "", isAdmin: false });

    const login = async (username, password) => {
        const userData = await loginService(username, password);
        console.log(userData)
        setUser(userData)
        console.log(user)
    };

    useEffect(() => {
        console.log(user);
    }, [user]);

    const logout = () => {
        setUser(null)
    };

    return (
        <AuthContext.Provider value={{ user, login, logout}}>
            {children}
        </AuthContext.Provider>
    );
};