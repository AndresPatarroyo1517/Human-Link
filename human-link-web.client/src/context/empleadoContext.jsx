import  { createContext, useContext, useState } from 'react';

const EmpleadoContext = createContext();

export const EmpleadoProvider = ({ children }) => {
    const [activeMenu, setActiveMenu] = useState('Mis Cursos');

    return (
        <EmpleadoContext.Provider value={{ activeMenu, setActiveMenu }}>
            {children}
        </EmpleadoContext.Provider>
    );
};

export const useEmpleado = () => {
    return useContext(EmpleadoContext);
};
