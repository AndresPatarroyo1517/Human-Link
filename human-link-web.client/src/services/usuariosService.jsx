const API_URL = 'https://localhost:7019/HumanLink/Usuario';

const usuariosService = {
    // Obtener usuarios
    getUsuarios: async () => {
        try {
            const response = await fetch(API_URL, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include'
            });

            // Imprimir en consola el código de estado y el texto de respuesta
            console.log("Código de estado:", response.status);

            if (!response.ok) {
                const errorText = await response.text();  // Obtener texto de error si no es JSON
                console.error("Error en la respuesta del servidor:", errorText);
                throw new Error(`Error al consultar los usuarios: ${response.status} - ${errorText}`);
            }

            const data = await response.json();
            console.log("Datos recibidos:", data);  // Verificar datos recibidos en la consola
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
                body: JSON.stringify(usuarioData)
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
            console.log("Enviando datos de actualización:", usuarioData);

            // Asegurarse de que el ID en el objeto coincida con el ID del endpoint
            usuarioData.Idusuario = id;

            const response = await fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    // Asegúrate de incluir el token de autorización si es necesario
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                credentials: 'include',
                body: JSON.stringify(usuarioData)
            });

            // Manejar específicamente la respuesta 204
            if (response.status === 204) {
                console.log("Usuario actualizado exitosamente");
                // Retornar los datos enviados ya que la respuesta está vacía
                return usuarioData;
            }

            if (!response.ok) {
                // Intentar obtener el mensaje de error del servidor
                const errorData = await response.text();
                throw new Error(errorData || 'Error al actualizar el usuario');
            }

            // Si hay una respuesta con contenido (aunque no debería en este caso)
            const data = await response.json();
            return data;
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
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error('Error al eliminar el usuario');
            }

            return { message: 'Usuario eliminado correctamente' };
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
};

export default usuariosService;