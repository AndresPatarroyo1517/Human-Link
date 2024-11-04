/* eslint-disable react/prop-types */
import { createContext, useContext, useState } from 'react';

const CursoContext = createContext();

export const CursoProvider = ({ children }) => {
    const [cursos, setCursos] = useState([]);
    const [selectedCurso, setSelectedCurso] = useState(null);

    return (
        <CursoContext.Provider value={{ cursos, setCursos, selectedCurso, setSelectedCurso }}>
            {children}
        </CursoContext.Provider>
    );
};

export const useCurso = () => {
    return useContext(CursoContext);
};
