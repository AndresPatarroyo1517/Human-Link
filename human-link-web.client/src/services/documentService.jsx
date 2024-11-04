const API_URL_DOCUMENTOS = 'https://localhost:7019/HumanLink/Archivos';

const documentService = {
    // Subir un archivo
    uploadFile: async (file) => {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch(API_URL_DOCUMENTOS, {
            method: 'POST',
            body: formData,
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error('Error al subir el archivo');
        }

        return await response.json();
    },

    // Obtener todos los documentos
    getDocuments: async () => {
        const response = await fetch(API_URL_DOCUMENTOS, {
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
};

export default documentService;
