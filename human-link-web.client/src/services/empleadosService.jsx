const API_URL = 'https://localhost:7019/HumanLink/Empleado/Get';

const empleadosService = {
    // Obtener información del empleado logueado
    getEmpleado: async () => {
        const response = await fetch(API_URL, { // No es necesario pasar el ID en la URL
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include', // Enviar cookies con la solicitud
        });

        if (!response.ok) {
            throw new Error('Error al consultar el empleado');
        }

        const data = await response.json();
        console.log(data);
        return data;
    },
}

export default empleadosService;
