import React, { useState } from 'react';
import { login } from '../services/authService';
import { useAuth } from '../hooks/useAuth';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { setUser } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const userData = await login({ email, password });
            setUser(userData); 
        } catch (error) {
            console.error('Error en el login:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
            />
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Contraseña"
                required
            />
            <button type="submit">Iniciar Sesión</button>
        </form>
    );
};

export default Login;
