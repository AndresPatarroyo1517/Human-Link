/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import documentService from '../../services/documentService';
import empleadosService from '../../services/empleadosService'; // Importar el servicio de empleados
import './documentManager.css';


const DocumentManager = () => {
    const [documents, setDocuments] = useState([]);
    const [file, setFile] = useState(null);
    const [selectedDocument, setSelectedDocument] = useState(null);
    const [searchEmployee, setSearchEmployee] = useState('');
    const [employees, setEmployees] = useState([]); // Almacenar empleados relacionados
    const [selectedEmployee, setSelectedEmployee] = useState(null); // Empleado seleccionado para asignar
    const [showAssignModal, setShowAssignModal] = useState(false); // Estado para controlar el modal

    const loadDocuments = async () => {
        try {
            const data = await documentService.getDocuments();
            setDocuments(data);
        } catch (error) {
            console.error("Error al cargar documentos:", error);
        }
    };

    const loadEmployees = async () => {
        try {
            const data = await empleadosService.getEmpleados();
            setEmployees(data);
        } catch (error) {
            console.error("Error al cargar empleados:", error);
        }
    };

    useEffect(() => {
        loadDocuments();
        loadEmployees(); // Cargar empleados al iniciar
    }, []);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) return;

        try {
            await documentService.uploadFile(file);
            setFile(null);
            loadDocuments();
        } catch (error) {
            console.error("Error al subir el archivo:", error);
        }
    };

    const handleDocumentSelect = (document) => {
        setSelectedDocument(document);
    };

    const handleAssignEmployeeClick = () => {
        setShowAssignModal(true); // Mostrar el modal para asignar empleado
    };

    const handleSearchEmployee = () => {
        // Aquí puedes filtrar la lista de empleados según el nombre
        if (searchEmployee) {
            const filteredEmployees = employees.filter(employee =>
                employee.Nombre.toLowerCase().includes(searchEmployee.toLowerCase())
            );
            setEmployees(filteredEmployees);
        }
    };

    const handleEmployeeSelect = (employee) => {
        setSelectedEmployee(employee); // Establecer el empleado seleccionado
    };

    const handleAssign = () => {
        if (selectedDocument && selectedEmployee) {
            console.log(`Asignando ${selectedEmployee.Nombre} al documento: ${selectedDocument.NombreArchivo}`);
            // Aquí puedes agregar la lógica para asignar el empleado al documento
            setShowAssignModal(false); // Cerrar el modal
            setSelectedEmployee(null); // Reiniciar el empleado seleccionado
        }
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
                            <td>{document.Tamanio}</td>
                            <td>{new Date(document.Fecha).toLocaleDateString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Botones para gestionar documentos */}
            <div className="d-flex flex-column">
                <button className="btn btn-light mb-2">Eliminar Documento</button>
                <button className="btn btn-light mb-2" onClick={handleAssignEmployeeClick}>
                    Asignar a Empleado
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

            {/* Modal para asignar empleado */}
            <div className={`modal fade ${showAssignModal ? 'show' : ''}`} style={{ display: showAssignModal ? 'block' : 'none' }} tabIndex="-1" aria-labelledby="assignEmployeeModalLabel" aria-hidden={!showAssignModal}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title fw-bold" id="assignEmployeeModalLabel">Asignar Empleado</h5>
                            <button type="button" className="btn-close" onClick={() => setShowAssignModal(false)} aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div>
                                <strong>Nombre archivo:</strong> {selectedDocument ? selectedDocument.NombreArchivo : 'Ninguno'}
                            </div>
                            <div className="mb-3 mt-2">
                                <label htmlFor="employeeSearch" className="form-label">Nombre empleado</label>
                                <div className="input-group">
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="employeeSearch"
                                        value={searchEmployee}
                                        onChange={(e) => setSearchEmployee(e.target.value)}
                                        placeholder="Buscar empleado"
                                    />
                                    <button className="btn btn-success" onClick={handleSearchEmployee}>Buscar</button>
                                </div>
                            </div>
                            <div className="employee-results" style={{ border: '1px solid #ccc', borderRadius: '5px', padding: '10px', maxHeight: '200px', overflowY: 'scroll' }}>
                                {employees.map((employee) => (
                                    <div key={employee.Id} className="d-flex align-items-center mb-1">
                                        <div
                                            onClick={() => handleEmployeeSelect(employee)}
                                            className={`rounded-circle me-2 ${selectedEmployee === employee ? 'bg-success' : 'bg-secondary'}`}
                                            style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                                        ></div>
                                        {employee.Nombre}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-danger" onClick={() => setShowAssignModal(false)}>Cancelar</button>
                            <button type="button" className="btn btn-success" onClick={handleAssign}>Asignar</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DocumentManager;

