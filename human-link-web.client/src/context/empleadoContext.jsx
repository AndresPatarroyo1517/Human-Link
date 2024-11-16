/* eslint-disable react/prop-types */
import { createContext, useContext, useState, useEffect } from 'react';

const EmpleadoContext = createContext();

export const EmpleadoProvider = ({ children }) => {
    // Inicializamos el estado con el valor de localStorage o el valor por defecto
    const [activeMenu, setActiveMenu] = useState(() => {
        const savedMenu = localStorage.getItem('empleadoActiveMenu');
        return savedMenu || 'Mis Cursos';
    });

    // Actualizamos localStorage cuando cambia el valor
    useEffect(() => {
        localStorage.setItem('empleadoActiveMenu', activeMenu);
    }, [activeMenu]);

    // Wrapper function para actualizar tanto el estado como localStorage
    const updateActiveMenu = (newMenu) => {
        setActiveMenu(newMenu);
    };

    return (
        <EmpleadoContext.Provider
            value={{
                activeMenu,
                setActiveMenu: updateActiveMenu
            }}
        >
            {children}
        </EmpleadoContext.Provider>
    );
};

export const useEmpleado = () => {
    const context = useContext(EmpleadoContext);
    if (!context) {
        throw new Error('useEmpleado debe ser usado dentro de un EmpleadoProvider');
    }
    return context;
};