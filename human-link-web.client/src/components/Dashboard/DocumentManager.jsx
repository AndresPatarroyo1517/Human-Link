/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import documentService from '../services/documentService';

const DocumentManager = () => {
    const [documents, setDocuments] = useState([]);
    const [file, setFile] = useState(null);

    const loadDocuments = async () => {
        try {
            const data = await documentService.getDocuments();
            setDocuments(data);
        } catch (error) {
            console.error("Error al cargar documentos:", error);
        }
    };

    useEffect(() => {
        loadDocuments();
    }, []);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) return;

        try {
            await documentService.uploadFile(file);
            setFile(null); // Reset file input
            loadDocuments(); // Reload documents after upload
        } catch (error) {
            console.error("Error al subir el archivo:", error);
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
                        <th>Documentos</th>
                        <th>Tamaño</th>
                        <th>Fecha subida</th>
                    </tr>
                </thead>
                <tbody>
                    {documents.map((document) => (
                        <tr key={document.Id}>
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
                <button className="btn btn-light mb-2">Asignar a Curso</button>
            </div>

            {/* Modal para añadir documento */}
            <div className="modal fade" id="uploadModal" tabIndex="-1" aria-labelledby="uploadModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="uploadModalLabel">Subir Documento</h5>
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
        </div>
    );
};

export default DocumentManager;

