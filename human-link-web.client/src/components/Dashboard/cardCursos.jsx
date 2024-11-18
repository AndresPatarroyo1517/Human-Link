/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import cursosService from '../../services/cursosService';
import './cardCursos.css';

const CardCursos = () => {
    const [cursos, setCursos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cursoInfo, setCursoInfo] = useState(null); // Estado para almacenar la información del curso seleccionado
    const [isLoadingUsuarios, setIsLoadingUsuarios] = useState(false); // Estado para saber si estamos cargando la información de los usuarios
    const [formData, setFormData] = useState({
        Nombrecurso: '',
        Descripcion: '',
        Categoria: '',
        Duracion: '',
        Url: []  // Inicializamos el array de URLs
    });
    const [selectedCursoId, setSelectedCursoId] = useState(null); // Para almacenar el ID del curso seleccionado

    // Obtener los cursos al montar el componente
    useEffect(() => {
        cursosService.getAllCursosCategoria()
            .then(response => {
                setCursos(response); // Guardamos los cursos en el estado
                setLoading(false);    // Indicamos que ya se cargaron los cursos
            })
            .catch(error => {
                console.error('Error al obtener los cursos:', error);
                setLoading(false);
            });
    }, []);

    // Función para obtener la información de los usuarios y estadísticas del curso
    const obtenerInfoCurso = async (cursoId) => {
        setIsLoadingUsuarios(true);
        try {
            const infoCurso = await cursosService.getUsuariosEnCurso(cursoId);
            setCursoInfo(infoCurso); // Guardamos la información del curso seleccionado
        } catch (error) {
            console.error('Error al obtener información del curso:', error);
        } finally {
            setIsLoadingUsuarios(false);
        }
    };

    // Función para manejar el clic en "Modificar curso"
    const handleModificarCurso = (curso) => {
        // Llenamos el formulario con los datos del curso seleccionado
        setSelectedCursoId(curso.Idcurso); // Asignamos el Idcurso al estado
        console.log("ID del curso seleccionado:", curso.Idcurso);
        setFormData({
            Nombrecurso: curso.Nombrecurso || '',
            Descripcion: curso.Descripcion || '',
            Categoria: curso.Categoria || '',
            Duracion: curso.Duracion || '',
            Url: curso.Url || []  // Establecemos las URLs del curso
        });
    };

    // Manejar cambios en el formulario
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    // Manejar el cambio en los campos de URL
    const handleUrlChange = (index, e) => {
        const { value } = e.target;
        setFormData(prevState => {
            const newUrls = [...prevState.Url];
            newUrls[index] = value; // Actualizar la URL en la posición especificada
            return {
                ...prevState,
                Url: newUrls
            };
        });
    };

    // Agregar una nueva URL al array
    const handleAddUrl = () => {
        setFormData(prevState => ({
            ...prevState,
            Url: [...prevState.Url, ''] // Añadir una URL vacía
        }));
    };

    // Eliminar una URL del array
    const handleRemoveUrl = (index) => {
        setFormData(prevState => ({
            ...prevState,
            Url: prevState.Url.filter((_, i) => i !== index) // Eliminar la URL en la posición especificada
        }));
    };

    // Manejar el envío del formulario para modificar el curso
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const updatedCurso = {
                Idcurso: selectedCursoId, // ID del curso, ya lo tenemos
                Nombrecurso: formData.Nombrecurso,  // Nombre del curso
                Descripcion: formData.Descripcion,  // Descripción del curso
                Duracion: formData.Duracion, // Duración del curso
                Categoria: formData.Categoria,  // Categoría del curso
                Url: formData.Url,  // Pasamos las URLs modificadas
                Cuestionarios: [],  // Si no tienes cuestionarios, pasa un array vacío
                Cursousuarios: []  // Si no tienes usuarios, pasa un array vacío
            };

            // Verificar que los campos obligatorios están completos
            if (!updatedCurso.Nombrecurso || !updatedCurso.Descripcion || !updatedCurso.Categoria || !updatedCurso.Duracion) {
                alert("Todos los campos son obligatorios.");
                return;
            }

            console.log("ID del curso seleccionado:", selectedCursoId);
            console.log("Datos del curso a actualizar:", updatedCurso);

            // Enviar los datos al servicio para actualizar el curso
            const response = await cursosService.updateCurso(selectedCursoId, updatedCurso);

            // Confirmar que la actualización fue exitosa
            alert("Curso actualizado con éxito.");

            // Recargar los cursos para reflejar los cambios
            setCursos(await cursosService.getAllCursosCategoria());
        } catch (error) {
            console.error("Error al actualizar el curso:", error);
            alert("Hubo un error al actualizar el curso.");
        }
    };
    // Función para eliminar un curso
    const handleEliminarCurso = async () => {
        const confirmacion = window.confirm(
            `¿Estás seguro de que deseas eliminar el curso "${formData.Nombrecurso}"? Esta acción no se puede deshacer.`
        );

        if (!confirmacion) return;

        try {
            await cursosService.deleteCursoUsuarioEmpleado(selectedCursoId);
            alert('Curso eliminado con éxito.');

            // Actualizar la lista de cursos
            setCursos(await cursosService.getAllCursosCategoria());
        } catch (error) {
            console.error('Error al eliminar el curso:', error);
            alert('Hubo un error al intentar eliminar el curso.');
        }
    };
    if (loading) {
        return <div>Loading...</div>; // Mientras se cargan los cursos
    }

    return (
        <div>
            <div className="row">
                {cursos.map((curso, index) => (
                    <div key={index} className="col-md-4 mb-4">
                        <div className="card h-100">
                            <img
                                src={curso.Url && curso.Url[0] ? curso.Url[0] : 'url-default.jpg'}  // Usamos el primer enlace de Url para la imagen
                                className="card-img-top"
                                alt={curso.Nombrecurso || 'Curso sin título'}  // Usamos el nombre del curso para el alt de la imagen
                            />
                            <div className="card-body">
                                <h5 className="card-title">{curso.Nombrecurso || 'Curso sin título'}</h5>
                                <p className="card-text">{curso.Descripcion || 'No hay descripción disponible.'}</p>
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    data-bs-toggle="modal"
                                    data-bs-target="#modificarModal"
                                    onClick={() => handleModificarCurso(curso)} // Asignamos el curso al hacer clic
                                >
                                    Modificar curso
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal para modificar curso */}
            <div className="modal fade" id="modificarModal" tabIndex="-1" aria-labelledby="modificarModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="modificarModalLabel">
                                Modificar curso: {formData.Nombrecurso || 'Curso no encontrado'}
                            </h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            {/* Opción de eliminar curso */}
                            <p className="eliminar-curso-text" onClick={handleEliminarCurso}>
                                Eliminar curso
                            </p>
                            <form onSubmit={handleSubmit}>
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

                                {/* Campos para manejar las URLs */}
                                <div className="mb-3">
                                    <label htmlFor="Url" className="form-label">URLs del curso</label>
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

                                <button type="submit" className="btn btn-success">Guardar cambios</button>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CardCursos;