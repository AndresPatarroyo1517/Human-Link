const API_BASE_URL = 'https://localhost:7019/HumanLink/Empleado';

const empleadosService = {
    // Obtener información de un empleado por ID
    getEmpleado: async (id) => {
        const response = await fetch(`${API_BASE_URL}/${id}`, {  // Se usa el ID en la URL
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
    getEmp: async () => {
        const response = await fetch(`${API_BASE_URL}/usuario`, {  // Se usa el ID en la URL
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

    // Crear un nuevo empleado
    addEmpleado: async (empleadoData) => {
        try {
            const response = await fetch(`${API_BASE_URL}/Post`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(empleadoData),
            });

            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(errorData || 'Error al agregar el empleado');
            }

            // Retornar el objeto del empleado creado (según el diseño del API)
            const data = await response.json();
            console.log("Empleado creado:", data);
            return data;
        } catch (error) {
            console.error("Error en addEmpleado:", error);
            throw error;
        }
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
                body: JSON.stringify(empleadoData),
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
    },

    // Eliminar un empleado
    deleteEmpleado: async (id) => {
        try {
            const response = await fetch(`${API_BASE_URL}/Delete-${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });

            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(errorData || 'Error al eliminar el empleado');
            }

            // El endpoint retorna NoContent (204)
            if (response.status === 204) {
                return true;
            }

            return false;
        } catch (error) {
            console.error("Error en deleteEmpleado:", error);
            throw error;
        }
    }
};

export default empleadosService;