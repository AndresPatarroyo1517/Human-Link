import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import cursosService from '../../services/cursosService';
import './Style-graficos.css';

const BarrasCursos = () => {
    const [data, setData] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("");

    useEffect(() => {
        cursosService.getAllCursosCategoria()
            .then(response => {
                // Obtener todas las categorías sin duplicados
                const categoriasUnicas = [...new Set(response.map(curso => curso.categoria))];
                setCategorias(categoriasUnicas);

                // Agrupar cursos por categoría y contar inscritos por curso
                const groupedData = response.reduce((acc, curso) => {
                    if (!acc[curso.categoria]) {
                        acc[curso.categoria] = {};
                    }
                    const nombreCurso = curso.nombrecurso;
                    if (!acc[curso.categoria][nombreCurso]) {
                        acc[curso.categoria][nombreCurso] = new Set(); // Usar Set para contar usuarios únicos
                    }
                    acc[curso.categoria][nombreCurso].add(curso.idusuario);
                    return acc;
                }, {});

                // Convertir el objeto agrupado en un formato adecuado para graficar
                const formattedData = Object.keys(groupedData).reduce((acc, categoria) => {
                    acc[categoria] = Object.keys(groupedData[categoria]).map(nombreCurso => ({
                        nombreCurso,
                        inscritos: groupedData[categoria][nombreCurso].size
                    }));
                    return acc;
                }, {});

                setData(formattedData);
            })
            .catch(error => {
                console.error('Error al obtener los datos: ', error);
            });
    }, []);

    // Filtrar los cursos por la categoría seleccionada
    const cursosFiltrados = categoriaSeleccionada
        ? data[categoriaSeleccionada] || []
        : [];

    // Extraer datos para el gráfico
    const xData = cursosFiltrados.map(curso => curso.nombreCurso);
    const yData = cursosFiltrados.map(curso => curso.inscritos);

    return (
        <div className="contenedor-grafico contenedor-barrasCursos">
            {/* Menú desplegable para seleccionar la categoría */}
            <select
                value={categoriaSeleccionada}
                onChange={(e) => setCategoriaSeleccionada(e.target.value)}
                className="select-categoria"
            >
                <option value="">Seleccione una categoría</option>
                {categorias.map((categoria) => (
                    <option key={categoria} value={categoria}>
                        {categoria}
                    </option>
                ))}
            </select>

            {/* Si no hay datos aún, se puede mostrar un loading */}
            {cursosFiltrados.length === 0 ? (
                <div>Cargando datos o no hay cursos en esta categoría...</div>
            ) : (
                <Plot
                    data={[
                        {
                            x: xData,
                            y: yData,
                            type: 'bar',
                            marker: { color: 'rgba(40, 78, 250, 0.5)' },
                            name: 'Cantidad de Inscritos'
                        }
                    ]}
                    layout={{
                        title: `Cantidad de Inscritos por Curso en "${categoriaSeleccionada}"`,
                        xaxis: {
                            title: 'Cursos',
                            automargin: true,
                        },
                        yaxis: {
                            title: 'Cantidad de Inscritos',
                            range: [0, Math.max(...yData) + 1] // Ajustar rango del eje Y
                        },
                        margin: {
                            l: 40,
                            r: 30,
                            t: 50,
                            b: 40
                        }
                    }}
                    config={{ responsive: true }}
                />
            )}
        </div>
    );
};

export default BarrasCursos;
