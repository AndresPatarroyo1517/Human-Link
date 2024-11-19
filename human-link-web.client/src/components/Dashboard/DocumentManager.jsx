import React, { useEffect, useState } from "react";
import documentsService from "../../services/documentService";

const DocumentManager = () => {
    const [documentos, setDocumentos] = useState([]);
    const [estadoSeleccionado, setEstadoSeleccionado] = useState({}); // Estado para guardar el valor del select por documento

    const titleDocuments = ["Hoja de Vida", "Documento de Identidad", "Certificados de Educacion y Formacion", "Documentos Varios"];

    const cargarDocumentos = async () => {
        try {
            const response = await documentsService.getDocuments();
            setDocumentos(response);
        } catch (error) {
            console.error("Error al obtener los documentos:", error);
        }
    };

    useEffect(() => {
        cargarDocumentos();
    }, []);

    const descargarDocumento = async (id, nombreArchivo) => {
        try {
            const blob = await documentsService.downloadDocument(id);
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = nombreArchivo;
            link.click();
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Error al descargar el documento:", error);
        }
    };

    const handleActualizarEstado = async (id) => {
        const estado = estadoSeleccionado[id];
        if (!estado) {
            alert("Por favor selecciona un estado antes de guardar.");
            return;
        }

        try {
            await documentsService.updateDocumentStatus(id, estado);
            cargarDocumentos();
            alert("Estado actualizado exitosamente");
        } catch (error) {
            console.error("Error al actualizar el estado:", error);
            alert(`Hubo un error al actualizar el estado: ${error.message}`);
        }
    };

    const handleEstadoChange = (id, nuevoEstado) => {
        setEstadoSeleccionado((prev) => ({
            ...prev,
            [id]: nuevoEstado, // Actualizar el estado seleccionado para el documento espec�fico
        }));
    };

    return (
        <div>
            <h2 className="mb-4">Documentos Requeridos</h2>
            <div className="container" style={{ minHeight: "auto" }}>
                <div className="row">
                    {titleDocuments.map((tipoDocumento, index) => {
                        const documentosSubidos = documentos.filter((doc) => doc.TipoDocumento === tipoDocumento);
                        return (
                            <>
                                <p className="d-inline-flex gap-1" key={index}>
                                    <button
                                        className="btn btn-primary"
                                        type="button"
                                        data-bs-toggle="collapse"
                                        data-bs-target={`#collapseDocument${index}`}
                                        aria-expanded="false"
                                        aria-controls="collapseExample"
                                        style={{ width: "100%" }}
                                    >
                                        {tipoDocumento}
                                    </button>
                                </p>
                                <div className="collapse" id={`collapseDocument${index}`}>
                                    <div className="card card-body" style={{ width: "100%" }}>
                                        <table className="table caption-top">
                                            <caption>List of documents</caption>
                                            <thead>
                                                <tr>
                                                    <th scope="col">#</th>
                                                    <th scope="col">Propietario</th>
                                                    <th scope="col">Estado</th>
                                                    <th scope="col">Nombre Archivo</th>
                                                    <th scope="col">Opciones</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {documentosSubidos.length > 0 ? (
                                                    documentosSubidos.map((docTable, idx) => (
                                                        <>
                                                            <tr key={docTable.Id}>
                                                                <th scope="row">{idx + 1}</th>
                                                                <td>{docTable.Propietario || "N/A"}</td>
                                                                <td>{docTable.Estado || "N/A"}</td>
                                                                <td>{docTable.NombreArchivo || "N/A"}</td>
                                                                <td>
                                                                    <button
                                                                        className="btn btn-primary me-4"
                                                                        data-bs-toggle="modal"
                                                                        data-bs-target={`#ModalVerificar${docTable.Id}`}
                                                                    >
                                                                        <i className="bi bi-file-earmark-check"></i> Verificaci�n
                                                                    </button>
                                                                    <button
                                                                        className="btn btn-success"
                                                                        onClick={() =>
                                                                            descargarDocumento(docTable.Id, docTable.NombreArchivo)
                                                                        }
                                                                    >
                                                                        <i className="bi bi-arrow-down-circle"></i>
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                            <div
                                                                className="modal fade"
                                                                id={`ModalVerificar${docTable.Id}`}
                                                                tabIndex="-1"
                                                                aria-labelledby="ModalVerificarLabel"
                                                                aria-hidden="true"
                                                            >
                                                                <div className="modal-dialog">
                                                                    <div className="modal-content">
                                                                        <div className="modal-header">
                                                                            <h1 className="modal-title fs-5" id="ModalVerificarLabel">
                                                                                Verificaci�n de documento
                                                                            </h1>
                                                                            <button
                                                                                type="button"
                                                                                className="btn-close"
                                                                                data-bs-dismiss="modal"
                                                                                aria-label="Close"
                                                                            ></button>
                                                                        </div>
                                                                        <div className="modal-body">
                                                                            Selecciona una opci�n de verificaci�n para el archivo{" "}
                                                                            <strong>{docTable.NombreArchivo}</strong>
                                                                            <select
                                                                                className="form-select"
                                                                                aria-label="Estado de Verificaci�n"
                                                                                value={estadoSeleccionado[docTable.Id] || ""}
                                                                                onChange={(e) =>
                                                                                    handleEstadoChange(docTable.Id, e.target.value)
                                                                                }
                                                                            >
                                                                                <option value="">Seleccione una opci�n:</option>
                                                                                <option value="Verificado">Verificado</option>
                                                                                <option value="Rechazado">Rechazado</option>
                                                                            </select>
                                                                        </div>
                                                                        <div className="modal-footer">
                                                                            <button
                                                                                type="button"
                                                                                className="btn btn-secondary"
                                                                                data-bs-dismiss="modal"
                                                                            >
                                                                                Close
                                                                            </button>
                                                                            <button
                                                                                type="button"
                                                                                className="btn btn-primary"
                                                                                onClick={() => handleActualizarEstado(docTable.Id)}
                                                                            >
                                                                                Save changes
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan="4">No hay documentos disponibles</td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default DocumentManager;
