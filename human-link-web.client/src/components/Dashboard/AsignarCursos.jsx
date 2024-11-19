/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useCallback } from "react";
import empleadosService from '../../services/empleadosService';
import cursosService from '../../services/cursosService';

const AsignarCursos = () => {
    const [empleados, setEmpleados] = useState([]);
    const [cursos, setCursos] = useState([]);
    const [selectedEmpleado, setSelectedEmpleado] = useState(""); // Empleado seleccionado
    const [selectedCurso, setSelectedCurso] = useState(""); // Curso seleccionado
    const [loading, setLoading] = useState(false); // Estado de carga para evitar múltiples envíos

    useEffect(() => {
        const loadEmpleados = async () => {
            try {
                const data = await empleadosService.getEmpleados();
                console.log("Empleados cargados:", data);
                setEmpleados(data);
            } catch (error) {
                console.error("Error al cargar empleados:", error);
            }
        };

        const loadCursos = async () => {
            try {
                const data = await cursosService.getCursos();
                console.log("Cursos cargados:", data);
                setCursos(data);
            } catch (error) {
                console.error("Error al cargar cursos:", error);
            }
        };

        loadEmpleados();
        loadCursos();
    }, []);

    const handleEmpleadoSelect = useCallback((event) => {
        setSelectedEmpleado(event.target.value);
    }, []);

    const handleCursoSelect = useCallback((event) => {
        setSelectedCurso(event.target.value);
    }, []);

    const handleAsignarCurso = useCallback(async () => {
        if (!selectedEmpleado || !selectedCurso) {
            alert("Por favor, selecciona un empleado y un curso.");
            return;
        }

        // Verificar si ya está en proceso de asignación para evitar duplicados
        if (loading) return;

        setLoading(true); // Establecer estado de carga a verdadero

        try {
            await cursosService.postCursoUsuarioEmpleado({
                empleadoId: selectedEmpleado,
                cursoId: selectedCurso,
            });

            alert("Curso asignado exitosamente.");
            setSelectedEmpleado(""); // Limpiar selección
            setSelectedCurso(""); // Limpiar selección
        } catch (error) {
            console.error("Error al asignar el curso:", error);
            alert("Hubo un error al asignar el curso.");
        } finally {
            setLoading(false); // Restablecer estado de carga
        }
    }, [selectedEmpleado, selectedCurso, loading]);

    return (
        <div className="border rounded p-4">
            <h3 className="fw-bold">Asignar Cursos</h3>

            {/* Selección de Empleado */}
            <div className="mb-4">
                <h5>Selecciona un Empleado</h5>
                <select
                    className="form-select"
                    value={selectedEmpleado}
                    onChange={handleEmpleadoSelect}
                >
                    <option value="">Seleccione un empleado</option>
                    {empleados.length === 0 ? (
                        <option>Cargando empleados...</option>
                    ) : (
                        empleados.map((empleado) => (
                            <option key={empleado.Idempleado} value={empleado.Idempleado}>
                                {empleado.Nombre}
                            </option>
                        ))
                    )}
                </select>
            </div>

            {/* Selección de Curso */}
            <div className="mb-4">
                <h5>Selecciona un Curso</h5>
                <select
                    className="form-select"
                    value={selectedCurso}
                    onChange={handleCursoSelect}
                >
                    <option value="">Seleccione un curso</option>
                    {cursos.length === 0 ? (
                        <option>Cargando cursos...</option>
                    ) : (
                        cursos.map((curso) => (
                            <option key={curso.Idcurso} value={curso.Idcurso}>
                                {curso.Nombrecurso}
                            </option>
                        ))
                    )}
                </select>
            </div>

            {/* Botón para asignar curso */}
            <button
                className="btn btn-success mt-4"
                onClick={handleAsignarCurso}
                disabled={loading} // Desactivar botón si está en proceso
            >
                {loading ? 'Asignando...' : 'Asignar Curso'}
            </button>
        </div>
    );
};

export default AsignarCursos;
