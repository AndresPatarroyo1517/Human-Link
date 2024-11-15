const API_CUROSUSUARIOS = 'https://localhost:7019/HumanLink/CursoUsuario/usuarios-en-curso';

export const fetchCursosUsuarios = async () => {
    try {
        const response = await fetch(API_CUROSUSUARIOS, {
            method: 'GET',
            credentials: 'include' 
        }); 
        if (!response.ok) {
            throw new Error("Error al obtener los datos de cursos y usuarios");
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching data:", error);
        return [];
    }
};
