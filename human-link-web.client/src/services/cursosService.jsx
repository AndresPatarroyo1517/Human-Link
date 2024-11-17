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

    // Obtener cursos seg�n el id del empleado
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

    postCursoUsuarioEmpleado: async (cursoId) => {
        const response = await fetch(API_URL + '/inscripcion', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include', // Enviar cookies con la solicitud
            body: JSON.stringify({
                Idcurso: cursoId,
                Progreso: 0,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Error details:", errorData);
        }
        return response;
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
