const API_URL = 'https://localhost:7019/HumanLink/Empleado/GetAll';

const empleadosService = {
    // Obtener cursos en general
    getEmpleados: async () => {
        const response = await fetch(API_URL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include', // Enviar cookies con la solicitud
            /*body: JSON.stringify(userData),*/ // Convertir el objeto a JSON
        });

        if (!response.ok) {
            throw new Error('Error al consultar los empleados');
        }

        const data = await response.json();
        return data;
    },
}

export default empleadosService;