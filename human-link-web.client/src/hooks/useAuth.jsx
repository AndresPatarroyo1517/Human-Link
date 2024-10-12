import { useContext } from 'react';
import { AuthContext } from '../context/authContext.jsx';

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe ser utilizado dentro de un AuthProvider');
    }
    console.log(context);
    return context;
};
