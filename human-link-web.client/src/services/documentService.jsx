const API_URL_DOCUMENTS = 'https://localhost:7019/HumanLink/Archivos';

const documentsService = {
    // Subir un documento
    uploadDocument: async (file, tipoDocumento) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('tipoDocumento', tipoDocumento);

        const response = await fetch(API_URL_DOCUMENTS, {
            method: 'POST',
            body: formData,
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error('Error al subir el documento');
        }

        return await response.json();
    },
    uploadDocumentVarios: async (file, tipoDocumento) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('tipoDocumento', tipoDocumento);

        const response = await fetch(API_URL_DOCUMENTS + '/varios', {
            method: 'POST',
            body: formData,
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error('Error al subir el documento');
        }

        return await response.json();
    },


    // Obtener todos los documentos
    getDocuments: async () => {
        const response = await fetch(API_URL_DOCUMENTS, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error('Error al obtener los documentos');
        }

        return await response.json();
    },

    // Obtener documentos por nombre
    getDocumentsByName: async (documentName) => {
        const response = await fetch(`${ API_URL_DOCUMENTS }/query/${ documentName }`, {
            method: 'GET',
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error('Error al buscar documentos');
        }

        return await response.json();
    },
    getDocumentosUsuario: async () => {
        const response = await fetch(`${API_URL_DOCUMENTS}/propietario`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include', // Enviar cookies con la solicitud
        });

        if (!response.ok) {
            throw new Error('Error al consultar los documentos');
        }

        const data = await response.json();
        return data;
    },
    // Descargar un documento
    downloadDocument: async (id) => {
        const response = await fetch(`${API_URL_DOCUMENTS}/descargar/${id}`, {
            method: 'GET',
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error('Error al descargar el documento');
        }

        return response.blob(); // Devolver el documento como blob
    },
    deleteDocument: async (id) => {
        const response = await fetch(`${API_URL_DOCUMENTS}/eliminar/${id}`, {
            method: 'DELETE',
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error('Error al eliminar el documento');
        }

        return await response.json();
    },

    updateDocumentStatus: async (id, estado) => {
        try {
            const response = await fetch(`${API_URL_DOCUMENTS}/estado/${id}`, {
                method: "PUT",
                credentials: 'include',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(estado), // Env�a el estado directamente
            });

            if (!response.ok) {
                const errorResponse = await response.json();
                throw new Error(errorResponse.message || "Error al actualizar el estado del documento");
            }

            return await response.json();
        } catch (error) {
            console.error("Error en updateDocumentStatus:", error);
            throw error;
        }
    }

};


export default documentsService;