const API_URL = 'https://localhost:7019/HumanLink/Usuario';

const usuariosService = {

    getUsuarios: async () => {
        try {
            const response = await fetch(API_URL, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error("Error en la respuesta del servidor:", errorText);
                throw new Error(`Error al consultar los usuarios: ${response.status} - ${errorText}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error al intentar obtener usuarios:", error);
            throw error;
        }
    },

    // Obtener un usuario por su ID
    getUsuario: async (id) => {
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error("Error en la respuesta del servidor:", errorText);
                throw new Error(`Error al consultar el usuario: ${response.status} - ${errorText}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error al intentar obtener el usuario:", error);
            throw error;
        }
    },

    // Obten4er un usuario
    getUser: async () => {
        try {
            const response = await fetch(`${API_URL}/usuario`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include'
            });
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error al consultar los usuarios: ${response.status} - ${errorText}`);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error al intentar obtener usuarios:", error);
            throw error;
        }
    },

    // Añadir un nuevo usuario
    addUsuario: async (usuarioData) => {
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(usuarioData),
            });

            if (!response.ok) {
                throw new Error('Error al añadir el usuario');
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    // Actualizar un usuario existente
    // El servicio updateUsuario ya debería funcionar correctamente con esta respuesta
    updateUsuario: async (id, usuarioData) => {
        try {
            usuarioData.Idusuario = id;

            const response = await fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(usuarioData)
            });
            const responseText = await response.text();

            if (!response.ok) {
                throw new Error(responseText || 'Error al actualizar el usuario');
            }
            return responseText;
        } catch (error) {
            console.error("Error en updateUsuario:", error);
            throw error;
        }
    },
    
    // Eliminar un usuario
    deleteUsuario: async (id) => {
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('Error al eliminar el usuario');
            }

            return { message: 'Usuario eliminado correctamente' };
        } catch (error) {
            console.error(error);
            throw error;
        }
    },
};

export default usuariosService;