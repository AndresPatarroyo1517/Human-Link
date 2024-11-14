import React, { useEffect, useState } from 'react';
import documentsService from '../../../services/documentService';

const Documents = () => {
    const [documentos, setDocumentos] = useState([]);
    const titleDocuments = ['Hoja de Vida', 'Documento de Identidad', 'Certificados de Educacion y Formacion', 'Documentos Varios'];

    // Función para cargar documentos desde el servicio
    const cargarDocumentos = async () => {
        try {
            const response = await documentsService.getDocumentosUsuario();
            setDocumentos(response); // Actualiza el estado con los documentos
        } catch (error) {
            console.error('Error al obtener los documentos:', error);
        }
    };

    // Llamar a cargarDocumentos al montar el componente
    useEffect(() => {
        cargarDocumentos();
    }, []);

    // Descargar documento
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

    // Función para subir documentos, seleccionando el método de subida según el tipo de documento
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
            cargarDocumentos(); // Recargar la lista de documentos después de la subida
            alert('Archivo subido exitosamente');
        } catch (error) {
            console.error('Error al subir el documento:', error);
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
                                                <p className="card-text">
                                                    Archivo Subido: {documentosSubidos[0].NombreArchivo}
                                                </p>
                                                {documentosSubidos.length > 1 && (
                                                    <ul>
                                                        {documentosSubidos.slice(1).map((tipoDoc, idx) => (
                                                            <li key={idx}>{tipoDoc.NombreArchivo}</li>
                                                        ))}
                                                    </ul>
                                                )}
                                                <button
                                                    className="btn btn-secondary"
                                                    onClick={() => descargarDocumento(documentosSubidos[0].Id, documentosSubidos[0].NombreArchivo)}
                                                >
                                                    Descargar
                                                </button>
                                                <form onSubmit={(e) => handleSubirDocumento(e, tipoDocumento)}>
                                                    <div className="form-group">
                                                        <input type="file" className="form-control-file" name="file" />
                                                    </div>
                                                    <button type="submit" className="btn btn-primary mt-2">Actualizar</button>
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
