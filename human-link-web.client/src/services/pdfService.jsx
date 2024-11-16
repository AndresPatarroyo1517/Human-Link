const API_CUROSUSUARIOS = 'https://localhost:7019/HumanLink/CursoUsuario/usuarios-en-curso';
const API_METRICASNOMINA = 'https://localhost:7019/HumanLink/Nomina/metricas-nomina';

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
