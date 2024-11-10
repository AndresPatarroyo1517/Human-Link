const API_URL_FORM_SQL = 'https://localhost:7019/HumanLink/Form';

const formService = {
    // Obtener cursos en general
    getRespuestas: async () => {
        const response = await fetch(API_URL_FORM_SQL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
             // Enviar cookies con la solicitud
            /*body: JSON.stringify(userData),*/ // Convertir el objeto a JSON
        });

        if (!response.ok) {
            throw new Error('Error al consultar las respuestas del formulario SQL');
        }

        const data = await response.json();
        return data;
    },
}

export default formService;