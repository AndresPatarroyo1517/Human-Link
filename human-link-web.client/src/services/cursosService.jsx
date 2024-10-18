const API_URL = 'https://localhost:7019/HumanLink/CursoUsuario';

const cursosService = {

    // Obtener cursos según el id del empleado
    getCursosEmpleado: async () => {
        const response = await fetch(API_URL + "/id", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include', // Enviar cookies con la solicitud
            /*body: JSON.stringify(userData),*/ // Convertir el objeto a JSON
        });

        if (!response.ok) {
            throw new Error('Error al consultar los cursos del usuario');
        }

        const data = await response.json();
        return data;
    } 
}

export default cursosService;