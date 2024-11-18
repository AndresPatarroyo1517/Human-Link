import React, { useEffect, useState } from 'react';
import documentsService from '../../../services/documentService';

const Documents = () => {
    const [documentos, setDocumentos] = useState([]);
    const titleDocuments = ['Hoja de Vida', 'Documento de Identidad', 'Certificados de Educacion y Formacion', 'Documentos Varios'];

    const cargarDocumentos = async () => {
        try {
            const response = await documentsService.getDocumentosUsuario();
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
            cargarDocumentos(); // Recargar documentos después de actualizar el estado
        } catch (error) {
            console.error('Error al actualizar el estado del documento:', error);
            alert('Hubo un error al actualizar el estado');
        }
    };

    return (
        <div>
            <h2 className="mb-4">Documentos Requeridos</h2>
            <div className="container" style={{ minHeight: 'auto' }}>
                <div className="row">
                    {titleDocuments.map((tipoDocumento, index) => {
                        const documentosSubidos = documentos.filter(doc => doc.TipoDocumento === tipoDocumento);
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
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-secondary"
                                                                    onClick={() => descargarDocumento(tipoDoc.Id, tipoDoc.NombreArchivo)}
                                                                >
                                                                    Descargar
                                                                </button>
                                                                {tipoDoc.RolUsuario === 'Empleado' && (
                                                                    <>
                                                                        <button
                                                                            type="button"
                                                                            className="btn btn-success mx-2"
                                                                            onClick={() => handleModificarEstado(tipoDoc.Id, 'aprobado')}
                                                                        >
                                                                            Aprobar
                                                                        </button>
                                                                        <button
                                                                            type="button"
                                                                            className="btn btn-danger"
                                                                            onClick={() => handleModificarEstado(tipoDoc.Id, 'rechazado')}
                                                                        >
                                                                            Rechazar
                                                                        </button>
                                                                    </>
                                                                )}
                                                            </div>
                                                        </li>
                                                    ))}
                                                </ul>

                                                <form onSubmit={(e) => handleSubirDocumento(e, tipoDocumento)}>
                                                    <div className="form-group mt-2">
                                                        <input type="file" className="form-control-file" name="file" />
                                                    </div>
                                                    <button type="submit" className="btn btn-primary m-2">Actualizar</button>
                                                </form>
                                            </>
                                        ) : (
                                            <>
                                                <p className="card-text">No se ha subido ningún archivo</p>
                                                <form onSubmit={(e) => handleSubirDocumento(e, tipoDocumento)}>
                                                    <div className="form-group">
                                                        <input type="file" className="form-control-file" name="file" />
                                                    </div>
                                                    <button type="submit" className="btn btn-primary mt-2">Subir</button>
                                                </form>
                                            </>
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

export default Documents;
