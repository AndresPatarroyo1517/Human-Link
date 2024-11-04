/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import documentService from '../services/documentService';
import cursosService from '../services/cursosService'; // Importa el servicio de cursos

const DocumentManager = () => {
    const [documents, setDocuments] = useState([]);
    const [file, setFile] = useState(null);
    const [selectedDocument, setSelectedDocument] = useState(null); // Documento seleccionado
    const [searchCourse, setSearchCourse] = useState('');
    const [courses, setCourses] = useState([]); // Estado para los cursos

    const loadDocuments = async () => {
        try {
            const data = await documentService.getDocuments();
            setDocuments(data);
        } catch (error) {
            console.error("Error al cargar documentos:", error);
        }
    };

    const loadCourses = async () => {
        try {
            const data = await cursosService.getCursos(); // Cargar los cursos desde el backend
            setCourses(data);
        } catch (error) {
            console.error("Error al cargar cursos:", error);
        }
    };

    useEffect(() => {
        loadDocuments();
        loadCourses(); // Cargar cursos al iniciar
    }, []);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) return;

        try {
            await documentService.uploadFile(file);
            setFile(null); // Reinicia la entrada de archivo
            loadDocuments(); // Recarga los documentos después de la subida
        } catch (error) {
            console.error("Error al subir el archivo:", error);
        }
    };

    const handleDocumentSelect = (document) => {
        setSelectedDocument(document);
    };

    const handleAssignCourse = () => {
        console.log("Asignar curso a documento:", selectedDocument);
    };

    return (
        <div>
            <button type="button" className="btn btn-success mb-4" data-bs-toggle="modal" data-bs-target="#uploadModal">
                Añadir Documento
            </button>

            {/* Tabla de documentos */}
            <table className="table">
                <thead>
                    <tr>
                        <th></th>
                        <th>Documentos</th>
                        <th>Tamaño</th>
                        <th>Fecha subida</th>
                    </tr>
                </thead>
                <tbody>
                    {documents.map((document) => (
                        <tr key={document.Id}>
                            <td>
                                <input
                                    type="radio"
                                    name="selectedDocument"
                                    onChange={() => handleDocumentSelect(document)}
                                />
                            </td>
                            <td>{document.NombreArchivo}</td>
                            <td>{document.Tamaño}</td>
                            <td>{new Date(document.Fecha).toLocaleDateString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Botones para gestionar documentos */}
            <div className="d-flex flex-column">
                <button className="btn btn-light mb-2">Eliminar Documento</button>
                <button className="btn btn-light mb-2" data-bs-toggle="modal" data-bs-target="#assignCourseModal">
                    Asignar a Curso
                </button>
            </div>

            {/* Modal para añadir documento */}
            <div className="modal fade" id="uploadModal" tabIndex="-1" aria-labelledby="uploadModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="uploadModalLabel">Añadir Documento</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <input type="file" onChange={handleFileChange} />
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-danger" data-bs-dismiss="modal">Cancelar</button>
                            <button type="button" className="btn btn-success" onClick={handleUpload} data-bs-dismiss="modal">Guardar Documento</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal para asignar curso */}
            <div className="modal fade" id="assignCourseModal" tabIndex="-1" aria-labelledby="assignCourseModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title fw-bold" id="assignCourseModalLabel">Asignar Curso</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div>
                                <strong>Nombre archivo:</strong> {selectedDocument ? selectedDocument.NombreArchivo : 'Ninguno'}
                            </div>
                            <div className="mb-3 mt-2">
                                <label htmlFor="courseSearch" className="form-label">Nombre curso o etiqueta</label>
                                <div className="input-group">
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="courseSearch"
                                        value={searchCourse}
                                        onChange={(e) => setSearchCourse(e.target.value)}
                                        placeholder="Buscar curso"
                                    />
                                    <button className="btn btn-success">Buscar</button>
                                </div>
                            </div>
                            <div>
                                <h6>Cursos relacionados:</h6>
                                <div className="d-flex flex-column">
                                    {courses
                                        .filter(course => course.name.toLowerCase().includes(searchCourse.toLowerCase()))
                                        .map(course => (
                                            <div key={course.id} className="d-flex align-items-center">
                                                <div className={`rounded-circle me-2 ${course.type === 'resources' ? 'bg-success' : 'bg-secondary'}`} style={{ width: '20px', height: '20px' }}></div>
                                                {course.name}
                                            </div>
                                        ))}
                                </div>
                            </div>
                            <div className="mt-3">
                                <strong>Tipo de documento:</strong>
                                <div className="d-flex">
                                    <div className="text-center me-3">
                                        <div className="rounded-circle bg-success" style={{ width: '30px', height: '30px' }}></div>
                                        <small>Recursos</small>
                                    </div>
                                    <div className="text-center">
                                        <div className="rounded-circle bg-secondary" style={{ width: '30px', height: '30px' }}></div>
                                        <small>Evaluación</small>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-danger" data-bs-dismiss="modal">Cancelar</button>
                            <button type="button" className="btn btn-success" onClick={handleAssignCourse} data-bs-dismiss="modal">Asignar</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DocumentManager;
