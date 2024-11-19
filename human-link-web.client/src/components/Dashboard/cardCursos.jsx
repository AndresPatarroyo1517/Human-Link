/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import cursosService from '../../services/cursosService';
import './card.css'

const CardCursos = () => {
    const [cursos, setCursos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        Nombrecurso: '',
        Descripcion: '',
        Categoria: '',
        Duracion: '',
        Url: [],
    });
    const [selectedCursoId, setSelectedCursoId] = useState(null);

    useEffect(() => {
        cargarCursos();
    }, []);

    const cargarCursos = async () => {
        try {
            const response = await cursosService.getCursos();
            setCursos(response);
        } catch (error) {
            console.error('Error al obtener los cursos:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEliminarCurso = async (idCurso) => {
        const confirmar = window.confirm('¿Estás seguro de que deseas eliminar este curso?');
        if (!confirmar) return;

        try {
            await cursosService.deleteCursoUsuarioEmpleado(idCurso);
            alert('Curso eliminado con éxito.');
            cargarCursos(); // Recargar la lista de cursos
        } catch (error) {
            console.error('Error al eliminar el curso:', error);
            alert('Hubo un error al eliminar el curso.');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleUrlChange = (index, e) => {
        const { value } = e.target;
        setFormData((prevState) => {
            const newUrls = [...prevState.Url];
            newUrls[index] = value;
            return {
                ...prevState,
                Url: newUrls,
            };
        });
    };

    const handleAddUrl = () => {
        setFormData((prevState) => ({
            ...prevState,
            Url: [...prevState.Url, ''],
        }));
    };

    const handleRemoveUrl = (index) => {
        setFormData((prevState) => ({
            ...prevState,
            Url: prevState.Url.filter((_, i) => i !== index),
        }));
    };

    const handleEditarCurso = (curso) => {
        setSelectedCursoId(curso.Idcurso);
        setFormData({
            Nombrecurso: curso.Nombrecurso || '',
            Descripcion: curso.Descripcion || '',
            Categoria: curso.Categoria || '',
            Duracion: curso.Duracion || '',
            Url: curso.Url || [],
        });
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <button
                type="button"
                className="btn btn-success mb-3"
                data-bs-toggle="modal"
                data-bs-target="#crearModal"
            >
                Agregar Curso
            </button>

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
                                <button
                                    type="button"
                                    className="btn btn-primary me-2"
                                    data-bs-toggle="modal"
                                    data-bs-target="#editarModal"
                                    onClick={() => handleEditarCurso(curso)}
                                >
                                    Editar
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-danger"
                                    onClick={() => handleEliminarCurso(curso.Idcurso)}
                                >
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal para agregar curso */}
            <div className="modal fade" id="crearModal" tabIndex="-1" aria-labelledby="crearModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="crearModalLabel">Agregar Nuevo Curso</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form>
                                {renderFormFields()}
                                <button type="submit" className="btn btn-success">Crear Curso</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal para editar curso */}
            <div className="modal fade" id="editarModal" tabIndex="-1" aria-labelledby="editarModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="editarModalLabel">Editar Curso</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form>
                                {renderFormFields()}
                                <button type="submit" className="btn btn-primary">Actualizar Curso</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    function renderFormFields() {
        return (
            <>
                <div className="mb-3">
                    <label htmlFor="Nombrecurso" className="form-label">Nombre del curso</label>
                    <input
                        type="text"
                        className="form-control"
                        id="Nombrecurso"
                        name="Nombrecurso"
                        value={formData.Nombrecurso}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="Descripcion" className="form-label">Descripción</label>
                    <textarea
                        className="form-control"
                        id="Descripcion"
                        name="Descripcion"
                        value={formData.Descripcion}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="Categoria" className="form-label">Categoría</label>
                    <input
                        type="text"
                        className="form-control"
                        id="Categoria"
                        name="Categoria"
                        value={formData.Categoria}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="Duracion" className="form-label">Duración (en horas)</label>
                    <input
                        type="number"
                        className="form-control"
                        id="Duracion"
                        name="Duracion"
                        value={formData.Duracion}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">URLs del curso</label>
                    {formData.Url.map((url, index) => (
                        <div key={index} className="d-flex mb-2">
                            <input
                                type="text"
                                className="form-control"
                                value={url}
                                onChange={(e) => handleUrlChange(index, e)}
                            />
                            <button
                                type="button"
                                className="btn btn-danger ms-2"
                                onClick={() => handleRemoveUrl(index)}
                            >
                                Eliminar
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={handleAddUrl}
                    >
                        Añadir URL
                    </button>
                </div>
            </>
        );
    }
};

export default CardCursos;
