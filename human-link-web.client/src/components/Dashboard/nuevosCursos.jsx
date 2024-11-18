/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import cursosService from '../../services/cursosService';
import './cardCursos.css';

const NuevosCursos = () => {
    const [cursos, setCursos] = useState([]);
    const [loading, setLoading] = useState(true);

    // Estado para el formulario del nuevo curso
    const [newCursoForm, setNewCursoForm] = useState({
        Nombrecurso: '',
        Descripcion: '',
        Categoria: '',
        Duracion: '',
        Url: [''], // Array inicial de URLs
    });

    const [isCreating, setIsCreating] = useState(false); // Estado para mostrar el modal de creación

    // Cargar cursos al montar el componente
    useEffect(() => {
        cargarCursos();
    }, []);

    const cargarCursos = async () => {
        setLoading(true);
        try {
            const response = await cursosService.getAllCursosCategoria();
            setCursos(response);
        } catch (error) {
            console.error('Error al obtener los cursos:', error);
        } finally {
            setLoading(false);
        }
    };

    // Manejar cambios en los inputs del formulario de nuevo curso
    const handleNewCursoInputChange = (e) => {
        const { name, value } = e.target;
        setNewCursoForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Manejar cambios en las URLs del nuevo curso
    const handleNewUrlChange = (index, e) => {
        const { value } = e.target;
        setNewCursoForm((prev) => {
            const newUrls = [...prev.Url];
            newUrls[index] = value;
            return {
                ...prev,
                Url: newUrls,
            };
        });
    };

    const handleAddNewUrl = () => {
        setNewCursoForm((prev) => ({
            ...prev,
            Url: [...prev.Url, ''],
        }));
    };

    const handleRemoveNewUrl = (index) => {
        setNewCursoForm((prev) => ({
            ...prev,
            Url: prev.Url.filter((_, i) => i !== index),
        }));
    };

    // Crear un nuevo curso
    const handleCreateCurso = async (e) => {
        e.preventDefault();
        try {
            // Validar campos obligatorios
            if (
                !newCursoForm.Nombrecurso ||
                !newCursoForm.Descripcion ||
                !newCursoForm.Categoria ||
                !newCursoForm.Duracion
            ) {
                alert('Todos los campos son obligatorios.');
                return;
            }

            // Crear el curso usando el servicio
            await cursosService.postCurso(newCursoForm);
            alert('Curso creado con éxito.');
            setIsCreating(false); // Cerrar el modal
            setNewCursoForm({ Nombrecurso: '', Descripcion: '', Categoria: '', Duracion: '', Url: [''] }); // Limpiar el formulario
            cargarCursos(); // Recargar los cursos
        } catch (error) {
            console.error('Error al crear el curso:', error);
            alert('Hubo un error al crear el curso.');
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <div className="d-flex justify-content-between mb-4">
                <h2>Lista de Cursos</h2>
                <button
                    className="btn btn-success"
                    onClick={() => setIsCreating(true)}
                >
                    Añadir Curso
                </button>
            </div>
            <div className="row">
                {cursos.map((curso, index) => (
                    <div key={index} className="col-md-4 mb-4">
                        <div className="card h-100">
                            <img
                                src={curso.Url && curso.Url[0] ? curso.Url[0] : 'url-default.jpg'}
                                className="card-img-top"
                                alt={curso.Nombrecurso || 'Curso sin título'}
                            />
                            <div className="card-body">
                                <h5 className="card-title">{curso.Nombrecurso || 'Curso sin título'}</h5>
                                <p className="card-text">{curso.Descripcion || 'No hay descripción disponible.'}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal para crear curso */}
            {isCreating && (
                <div className="modal show d-block" tabIndex="-1" role="dialog">
                    <div className="modal-dialog modal-lg" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Crear Nuevo Curso</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setIsCreating(false)}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={handleCreateCurso}>
                                    <div className="mb-3">
                                        <label htmlFor="Nombrecurso" className="form-label">Nombre del curso</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="Nombrecurso"
                                            name="Nombrecurso"
                                            value={newCursoForm.Nombrecurso}
                                            onChange={handleNewCursoInputChange}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="Descripcion" className="form-label">Descripción</label>
                                        <textarea
                                            className="form-control"
                                            id="Descripcion"
                                            name="Descripcion"
                                            value={newCursoForm.Descripcion}
                                            onChange={handleNewCursoInputChange}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="Categoria" className="form-label">Categoría</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="Categoria"
                                            name="Categoria"
                                            value={newCursoForm.Categoria}
                                            onChange={handleNewCursoInputChange}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="Duracion" className="form-label">Duración (en horas)</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            id="Duracion"
                                            name="Duracion"
                                            value={newCursoForm.Duracion}
                                            onChange={handleNewCursoInputChange}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="Url" className="form-label">URLs del curso</label>
                                        {newCursoForm.Url.map((url, index) => (
                                            <div key={index} className="d-flex mb-2">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={url}
                                                    onChange={(e) => handleNewUrlChange(index, e)}
                                                />
                                                <button
                                                    type="button"
                                                    className="btn btn-danger ms-2"
                                                    onClick={() => handleRemoveNewUrl(index)}
                                                >
                                                    Eliminar
                                                </button>
                                            </div>
                                        ))}
                                        <button
                                            type="button"
                                            className="btn btn-secondary"
                                            onClick={handleAddNewUrl}
                                        >
                                            Añadir URL
                                        </button>
                                    </div>
                                    <button type="submit" className="btn btn-success">Crear Curso</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NuevosCursos;
