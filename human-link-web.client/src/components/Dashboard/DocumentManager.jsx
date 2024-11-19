/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import documentsService from '../../../services/documentService';
import './documentManager.css';

const DocumentManager = () => {
    const [documentos, setDocumentos] = useState([]);
    const [mostrarSoloEmpleados, setMostrarSoloEmpleados] = useState(false);

    const titleDocuments = ['Hoja de Vida', 'Documento de Identidad', 'Certificados de Educacion y Formacion', 'Documentos Varios'];

    // Cargar todos los documentos al activar el componente
    const cargarDocumentos = async () => {
        try {
            const response = await documentsService.getDocuments(); // Método correcto
            setDocumentos(response);
        } catch (error) {
            console.error('Error al obtener los documentos:', error);
        }
    };

    useEffect(() => {
        cargarDocumentos();
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

    const handleModificarEstado = async (id, nuevoEstado) => {
        try {
            await documentsService.updateDocumentStatus(id, nuevoEstado);
            alert(`El documento ha sido ${nuevoEstado}`);
            cargarDocumentos();
        } catch (error) {
            console.error('Error al actualizar el estado del documento:', error);
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
                                        ) : (
                                            <p>No hay documentos subidos para este tipo.</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default DocumentManager;
