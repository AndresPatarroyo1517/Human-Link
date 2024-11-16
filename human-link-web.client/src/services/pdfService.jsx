const API_CUROSUSUARIOS = 'https://localhost:7019/HumanLink/CursoUsuario/usuarios-en-curso'
const API_METRICASNOMINA = 'https://localhost:7019/HumanLink/Nomina/metricas-nomina'
const API_PERSO = 'https://localhost:7019/HumanLink/Usuario/usuario'


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

export const fetchMetricasNomina = async () => {
    try {
        const response = await fetch(API_METRICASNOMINA, {
            method: 'GET',
            credentials: 'include'
        });
        if (!response.ok) {
            throw new Error("Error al obtener los datos de metricas de nómina");
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching data:", error);
        return [];
    }
};

export const fetchCursoPerso = async (id) => {
    try {
        const response = await fetch(`${API_PERSO}/${id}/cursos`, {
            method: 'GET',
            credentials: 'include'
        });
        if (!response.ok) {
            throw new Error("Error al obtener los datos de personalizados del usuario");
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching data:", error);
        return [];
    }
};

export const fetchNominaPerso = async (id) => {
    try {
        const response = await fetch(`${API_PERSO}/${id}/salario`, {
            method: 'GET',
            credentials: 'include'
        });
        if (!response.ok) {
            throw new Error("Error al obtener los datos personalizados del usuario con su salario");
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching data:", error);
        return [];
    }
};