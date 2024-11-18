const API_URL = 'https://localhost:7019/HumanLink/CursoUsuario';
const API_URL_CURSO = 'https://localhost:7019/HumanLink/Curso';

const cursosService = {
    // Obtener cursos en general
    getCursos: async () => {
        const response = await fetch(API_URL_CURSO, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include', // Enviar cookies con la solicitud
        });

        if (!response.ok) {
            throw new Error('Error al consultar los cursos');
        }

        const data = await response.json();
        return data;
    },

    // Obtener cursos según el id del empleado
    getCursosEmpleado: async () => {
        const response = await fetch(API_URL + "/id", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include', // Enviar cookies con la solicitud
        });

        if (!response.ok) {
            throw new Error('Error al consultar los cursos del usuario');
        }

        const data = await response.json();
        return data;
    },

    // Obtener los cursos del usuario y su progreso
    getCursosProgeso: async () => {
        const response = await fetch(API_URL + "/progreso", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include', // Enviar cookies con la solicitud
        });

        if (!response.ok) {
            throw new Error('Error al consultar los cursos con el progreso del usuario');
        }

        const data = await response.json();
        return data;
    },
    getIdCurEmpp: async () => { 
        const response = await fetch(API_URL + "/Idcuremp", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include', // Enviar cookies con la solicitud
        });

        if (!response.ok) {
            throw new Error('Error al consultar los cursos del usuario');
        }

        const data = await response.json();
        return data;
    },


    // Obtener todos los cursos con CursoUsuario y Curso
    getAllCursosCategoria: async () => {
        const response = await fetch(API_URL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include', // Enviar cookies con la solicitud
        });

        if (!response.ok) {
            throw new Error('Error al consultar todos los cursos y categorias');
        }

        const data = await response.json();
        return data;
    },
    postCursoUsuarioEmpleado: async ({ empleadoId, cursoId }) => {
        // Crear el objeto Cursousuario que se enviará al backend
        const cursousuario = {
            Idusuario: empleadoId, // Cambiar 'empleadoId' a 'Idusuario'
            Idcurso: cursoId,      // Cambiar 'cursoId' a 'Idcurso'
            Progreso: 0,           // Iniciar con progreso 0
        };

        try {
            const response = await fetch(`${API_URL}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', // Enviar cookies con la solicitud
                body: JSON.stringify(cursousuario), // Enviar el objeto en formato JSON
            });

            if (!response.ok) {
                const errorData = await response.json();
                if (response.status === 409) {
                    // Si el servidor responde con conflicto (usuario ya inscrito)
                    console.error("Error: El usuario ya está inscrito en este curso.");
                    alert("El usuario ya está inscrito en este curso.");
                } else {
                    // Otro tipo de error
                    console.error("Error al asignar curso:", errorData);
                    alert("Hubo un error al asignar el curso.");
                }
                throw new Error('Error al asignar curso');
            }

            const data = await response.json();
            console.log("Curso asignado exitosamente:", data);
            alert("Curso asignado exitosamente.");

            return data; // Devuelve la respuesta del servidor (cursousuario creado)
        } catch (error) {
            console.error("Error en la solicitud:", error);
            throw error;
        }
    },



    // Eliminar curso del usuario
    deleteCursoUsuarioEmpleado: async (Idcurso) => {
        try {
            const response = await fetch(`${API_URL}/empleado/${Idcurso}`, {
                method: 'DELETE',
                credentials: 'include',
            }
            );

            if (!response.ok) {
                throw new Error('No se pudo eliminar el curso');
            }

            return response;
        } catch (error) {
            console.error('Error al eliminar el curso:', error);
            throw error;
        }
    },
}

export default cursosService;
