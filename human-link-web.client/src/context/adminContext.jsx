/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { createContext, useContext, useState, useEffect } from 'react';

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
    // Inicializamos el estado con los valores de localStorage o los valores por defecto
    const [activeSection, setActiveSection] = useState(() => {
        const savedSection = localStorage.getItem('activeSection');
        return savedSection || 'Empleados';
    });

    const [activeMenu, setActiveMenu] = useState(() => {
        const savedMenu = localStorage.getItem('activeMenu');
        return savedMenu || 'Asignar Cursos';
    });

    // Actualizamos localStorage cuando cambian los valores
    useEffect(() => {
        localStorage.setItem('activeSection', activeSection);
    }, [activeSection]);

    useEffect(() => {
        localStorage.setItem('activeMenu', activeMenu);
    }, [activeMenu]);

    // Wrapper functions para actualizar tanto el estado como localStorage
    const updateActiveSection = (newSection) => {
        setActiveSection(newSection);
    };

    const updateActiveMenu = (newMenu) => {
        setActiveMenu(newMenu);
    };

    return (
        <AdminContext.Provider
            value={{
                activeSection,
                setActiveSection: updateActiveSection,
                activeMenu,
                setActiveMenu: updateActiveMenu
            }}
        >
            {children}
        </AdminContext.Provider>
    );
};

export const useAdmin = () => {
    const context = useContext(AdminContext);
    if (!context) {
        throw new Error('useAdmin debe ser usado dentro de un AdminProvider');
    }
    return context;
};
