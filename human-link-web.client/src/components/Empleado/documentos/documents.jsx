import React, { useEffect, useState } from 'react';
import documentsService from '../../../services/documentService';

const Documents = () => {
    const [documentos, setDocumentos] = useState([]);
    const [archivoSeleccionado, setArchivoSeleccionado] = useState(null); // Estado para el archivo seleccionado
    const titleDocuments = ['Hoja de Vida', 'Documento de Identidad', 'Certificados de Educacion y Formacion', 'Documentos Varios'];

    const cargarDocumentos = async () => {
        try {
            const response = await documentsService.getDocumentosUsuario();
            setDocumentos(response);
            console.log(documentos)
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

    const handleDelete = async (id) => {
        try {
            await documentsService.deleteDocument(id);
            alert('Archivo eliminado exitosamente');
            cargarDocumentos(); // Recargar documentos después de eliminar
            setArchivoSeleccionado(null); // Limpiar el archivo seleccionado
            const modal = document.getElementById('deleteModal'); // Cerrar el modal manualmente
            const modalInstance = bootstrap.Modal.getInstance(modal);
            modalInstance.hide();
        } catch (error) {
            console.error(error);
            alert('Hubo un error al eliminar el archivo');
        }
    };

    const verify = (estado) => {
        if (estado == 'Verificado') {
            return "bi bi-patch-check-fill text-success"
        } else if (estado == 'sin verificar') {
            return "bi bi-stopwatch-fill text-secondary"
        } else if (estado == 'Rechazado') {
            return "bi bi-x-octagon-fill text-danger"
        } else {
            return '';
        }
    }

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
                                                {documentosSubidos.map((tipoDoc, idx) => (<>
                                                    <p className="card-text">Archivo Subido <span className={verify(tipoDoc.Estado)}></span></p> 
                                                <ul className="list-group">
                                                        <li key={idx} className="list-group-item d-flex justify-content-between align-items-center">
                                                            {tipoDoc.NombreArchivo} 
                                                            <button
                                                                type="button"
                                                                className="btn btn-danger"
                                                                data-bs-toggle="modal"
                                                                data-bs-target="#deleteModal"
                                                                onClick={() => setArchivoSeleccionado(tipoDoc)} // Almacena el archivo seleccionado
                                                            >
                                                                Delete
                                                            </button>
                                                        </li> 
                                                    
                                                    </ul></>
                                                ))}
                                                <form onSubmit={(e) => handleSubirDocumento(e, tipoDocumento)}>
                                                    <div className="form-group mt-2">
                                                        <input type="file" className="form-control-file" name="file" />
                                                    </div>
                                                    <button type="submit" className="btn btn-primary m-2">Actualizar</button>
                                                    <button
                                                        type="button"
                                                        className="btn btn-secondary m-2"
                                                        onClick={() => descargarDocumento(documentosSubidos[0].Id, documentosSubidos[0].NombreArchivo)}
                                                    >
                                                        Descargar
                                                    </button>
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

            {/* Modal para eliminar archivo */}
            <div className="modal fade" id="deleteModal" tabIndex="-1" aria-labelledby="deleteModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="deleteModalLabel">Seguro que deseas borrar este archivo</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            {archivoSeleccionado ? archivoSeleccionado.NombreArchivo : 'Cargando...'}
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={() => handleDelete(archivoSeleccionado.Id)}
                            >
                                Eliminar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Documents;
