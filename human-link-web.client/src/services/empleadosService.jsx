const API_BASE_URL = 'https://localhost:7019/HumanLink/Empleado';

const empleadosService = {
    // Obtener todos los empleados
    getEmpleados: async () => {
        const response = await fetch(`${API_BASE_URL}/GetAll`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        });
        if (!response.ok) {
            throw new Error('Error al consultar los empleados');
        }
        const data = await response.json();
        return data;
    },

    // Actualizar un empleado
    updateEmpleado: async (id, empleadoData) => {
        try {
            const response = await fetch(`${API_BASE_URL}/Put-${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(empleadoData)
            });

            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(errorData || 'Error al actualizar el empleado');
            }

            // El endpoint retorna NoContent (204)
            if (response.status === 204) {
                return true;
            }

            return false;
        } catch (error) {
            console.error("Error en updateEmpleado:", error);
            throw error;
        }
    }
};

export default empleadosService;