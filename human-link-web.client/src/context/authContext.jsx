import { createContext, useState, useEffect } from 'react';
import { login as loginService, logout as logoutService} from '../services/authServices.jsx';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState({ username: "", isAdmin: false });

    const login = async (username, password, recordar) => {
        const userData = await loginService(username, password, recordar);
        
        setUser(userData);
        return userData;
    };

    const logout = async () => {
        await logoutService()
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout}}>
            {children}
        </AuthContext.Provider>
    );
};