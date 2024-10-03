import  { createContext, useContext, useState } from 'react';

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
    const [activeSection, setActiveSection] = useState('Empleados');
    const [activeMenu, setActiveMenu] = useState('Asignar Cursos');

    return (
        <AdminContext.Provider value={{ activeSection, setActiveSection, activeMenu, setActiveMenu }}>
            {children}
        </AdminContext.Provider>
    );
};

export const useAdmin = () => {
    return useContext(AdminContext);
};
