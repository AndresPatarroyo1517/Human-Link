/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import documentsService from '../../../services/documentService'; //Importar servicio de documentos
import empleadosService from '../../../services/empleadosService'; // Importar servicio de empleados
import './documentManager.css';

const DocumentManager = () => {
    const [documentos, setDocumentos] = useState([]);
    const [empleados, setEmpleados] = useState([]);
    const [mostrarSoloEmpleados, setMostrarSoloEmpleados] = useState(false);
    const [selectedDocument, setSelectedDocument] = useState(null);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [searchEmployee, setSearchEmployee] = useState('');
    const [showAssignModal, setShowAssignModal] = useState(false);

    const titleDocuments = ['Hoja de Vida', 'Documento de Identidad', 'Certificados de Educacion y Formacion', 'Documentos Varios'];

    const cargarDocumentos = async () => {
        try {
            const response = await documentsService.getDocumentosUsuario();
            setDocumentos(response);
        } catch (error) {
            console.error('Error al obtener los documentos:', error);
        }
    };

    const cargarEmpleados = async () => {
        try {
            const response = await empleadosService.getEmpleados();
            setEmpleados(response);
        } catch (error) {
            console.error('Error al cargar empleados:', error);
        }
    };

    useEffect(() => {
        cargarDocumentos();
        cargarEmpleados();
    }, []);

    const descargarDocumento = async (id, nombreArchivo) => {
        try {
            const blob = await documentsService.downloadDocument(id);
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = nombreArchivo;
            link.click();
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error al descargar el documento:', error);
        }
    };

    const handleSubirDocumento = async (e, tipoDocumento) => {
        e.preventDefault();
        const file = e.target.elements.file.files[0];

        if (!file) {
            alert('Seleccione un archivo');
            return;
        }

        try {
            if (tipoDocumento === 'Documentos Varios') {
                await documentsService.uploadDocumentVarios(file, tipoDocumento);
            } else {
                await documentsService.uploadDocument(file, tipoDocumento);
            }
            cargarDocumentos();
            alert('Archivo subido exitosamente');
        } catch (error) {
            console.error('Error al subir el documento:', error);
        }
    };

    const handleModificarEstado = async (id, nuevoEstado) => {
        try {
            await documentsService.updateDocumentStatus(id, nuevoEstado);
            alert(`El documento ha sido ${nuevoEstado}`);
            cargarDocumentos();
        } catch (error) {
            console.error('Error al actualizar el estado del documento:', error);
        }
    };

    const handleAssignEmployeeClick = () => {
        setShowAssignModal(true);
    };

    const handleSearchEmployee = () => {
        if (searchEmployee) {
            const filteredEmployees = empleados.filter(employee =>
                employee.Nombre.toLowerCase().includes(searchEmployee.toLowerCase())
            );
            setEmpleados(filteredEmployees);
        }
    };

    const handleAssign = () => {
        if (selectedDocument && selectedEmployee) {
            console.log(`Asignando ${selectedEmployee.Nombre} al documento: ${selectedDocument.NombreArchivo}`);
            setShowAssignModal(false);
            setSelectedEmployee(null);
        }
    };

    const documentosFiltrados = mostrarSoloEmpleados
        ? documentos.filter(doc => doc.RolUsuario === 'Empleado')
        : documentos;

    return (
        <div>
            <h2 className="mb-4">Documentos Requeridos</h2>
            <button className="btn btn-info mb-3" onClick={() => setMostrarSoloEmpleados(!mostrarSoloEmpleados)}>
                {mostrarSoloEmpleados ? 'Ver Todos los Documentos' : 'Ver Documentos de Empleados'}
            </button>

            <div className="container">
                <div className="row">
                    {titleDocuments.map((tipoDocumento, index) => {
                        const documentosSubidos = documentosFiltrados.filter(doc => doc.TipoDocumento === tipoDocumento);
                        return (
                            <div className="col-12 mb-4" key={index}>
                                <div className="card w-100">
                                    <div className="card-body">
                                        <h5 className="card-title">{tipoDocumento}</h5>
                                        {documentosSubidos.length > 0 ? (
                                            <>
                                                <ul className="list-group">
                                                    {documentosSubidos.map((tipoDoc, idx) => (
                                                        <li key={idx} className="list-group-item d-flex justify-content-between align-items-center">
                                                            {tipoDoc.NombreArchivo}
                                                            <div>
                                                                <button className="btn btn-secondary" onClick={() => descargarDocumento(tipoDoc.Id, tipoDoc.NombreArchivo)}>
                                                                    Descargar
                                                                </button>
                                                                {tipoDoc.RolUsuario === 'Empleado' && (
                                                                    <>
                                                                        <button className="btn btn-success mx-2" onClick={() => handleModificarEstado(tipoDoc.Id, 'aprobado')}>
                                                                            Aprobar
                                                                        </button>
                                                                        <button className="btn btn-danger" onClick={() => handleModificarEstado(tipoDoc.Id, 'rechazado')}>
                                                                            Rechazar
                                                                        </button>
                                                                    </>
                                                                )}
                                                            </div>
                                                        </li>
                                                    ))}
                                                </ul>
                                                <form onSubmit={(e) => handleSubirDocumento(e, tipoDocumento)}>
                                                    <input type="file" className="form-control-file mt-2" name="file" />
                                                    <button type="submit" className="btn btn-primary m-2">Actualizar</button>
                                                </form>
                                            </>
                                        ) : (
                                            <form onSubmit={(e) => handleSubirDocumento(e, tipoDocumento)}>
                                                <input type="file" className="form-control-file" name="file" />
                                                <button type="submit" className="btn btn-primary mt-2">Subir</button>
                                            </form>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Modal para asignar empleado */}
            <div className={`modal fade ${showAssignModal ? 'show' : ''}`} style={{ display: showAssignModal ? 'block' : 'none' }}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Asignar Empleado</h5>
                            <button type="button" className="btn-close" onClick={() => setShowAssignModal(false)}></button>
                        </div>
                        <div className="modal-body">
                            <div><strong>Archivo:</strong> {selectedDocument ? selectedDocument.NombreArchivo : 'Ninguno'}</div>
                            <input
                                type="text"
                                className="form-control mt-2"
                                placeholder="Buscar empleado"
                                value={searchEmployee}
                                onChange={(e) => setSearchEmployee(e.target.value)}
                            />
                            <button className="btn btn-success mt-2" onClick={handleSearchEmployee}>Buscar</button>
                            <div className="mt-3">
                                {empleados.map((empleado, index) => (
                                    <div key={index} onClick={() => setSelectedEmployee(empleado)}>{empleado.Nombre}</div>
                                ))}
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-danger" onClick={() => setShowAssignModal(false)}>Cancelar</button>
                            <button className="btn btn-success" onClick={handleAssign}>Asignar</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DocumentManager;
