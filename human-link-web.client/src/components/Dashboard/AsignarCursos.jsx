/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import './asignarCursos.css';
import empleadosService from '../../services/empleadosService';
import cursosService from '../../services/cursosService'; // Asegúrate de que el servicio de cursos esté importado

const AsignarCursos = () => {
    const [empleados, setEmpleados] = useState([]);
    const [cursos, setCursos] = useState([]);
    const [selectedEmpleados, setSelectedEmpleados] = useState(new Set()); // Empleados seleccionados
    const [selectedCursos, setSelectedCursos] = useState(new Set()); // Cursos seleccionados

    useEffect(() => {
        const loadEmpleados = async () => {
            try {
                const data = await empleadosService.getEmpleados();
                setEmpleados(data);
            } catch (error) {
                console.error("Error al cargar empleados:", error);
            }
        };

        const loadCursos = async () => {
            try {
                const data = await cursosService.getCursos();
                setCursos(data);
            } catch (error) {
                console.error("Error al cargar cursos:", error);
            }
        };

        loadEmpleados();
        loadCursos();
    }, []);

    const handleEmpleadoSelect = (empleadoId) => {
        const updatedSelection = new Set(selectedEmpleados);
        if (updatedSelection.has(empleadoId)) {
            updatedSelection.delete(empleadoId);
        } else {
            updatedSelection.add(empleadoId);
        }
        setSelectedEmpleados(updatedSelection);
    };

    const handleCursoSelect = (cursoId) => {
        const updatedSelection = new Set(selectedCursos);
        if (updatedSelection.has(cursoId)) {
            updatedSelection.delete(cursoId);
        } else {
            updatedSelection.add(cursoId);
        }
        setSelectedCursos(updatedSelection);
    };

    const handleSaveChanges = () => {
        console.log("Empleados seleccionados:", Array.from(selectedEmpleados));
        console.log("Cursos seleccionados:", Array.from(selectedCursos));
    };

    return (
        <div className="border rounded p-4">
            <h3 className="fw-bold">Asignar Cursos</h3>
            <div className="d-flex">
                {/* Columna de Empleados */}
                <div className="me-4">
                    <h5>Empleados</h5>
                    {empleados.map(empleado => (
                        <div key={empleado.id} className="d-flex align-items-center mb-2">
                            <div
                                className={`rounded-circle me-2 ${selectedEmpleados.has(empleado.id) ? 'bg-success' : 'bg-secondary'}`}
                                style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                                onClick={() => handleEmpleadoSelect(empleado.id)}
                            ></div>
                            {empleado.nombre}
                        </div>
                    ))}
                </div>

                {/* Columna de Cursos */}
                <div>
                    <h5>Cursos</h5>
                    {cursos.map(curso => (
                        <div key={curso.id} className="d-flex align-items-center mb-2">
                            <div
                                className={`rounded-circle me-2 ${selectedCursos.has(curso.id) ? 'bg-success' : 'bg-secondary'}`}
                                style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                                onClick={() => handleCursoSelect(curso.id)}
                            ></div>
                            {curso.name}
                        </div>
                    ))}
                </div>
            </div>

            {/* Botón para guardar cambios */}
            <button
                className="btn btn-success mt-4"
                onClick={handleSaveChanges}
            >
                Guardar Cambios
            </button>
        </div>
    );
};

export default AsignarCursos;
