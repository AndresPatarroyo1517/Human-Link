import React, { useState, useEffect } from "react";
import Plot from "react-plotly.js";
import cursosService from "../../services/cursosService";
import "./Style-graficos.css";

const PromedioNotasCurso = () => {
    const [data, setData] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("");

    useEffect(() => {
        cursosService.getAllCursosCategoria()
            .then((response) => {
                // Obtener todas las categorías sin duplicados
                const categoriasUnicas = [...new Set(response.map(curso => curso.categoria))];
                setCategorias(categoriasUnicas);

                // Agrupar cursos por categoría y calcular el promedio de notas
                const groupedData = response.reduce((acc, curso) => {
                    if (!acc[curso.categoria]) {
                        acc[curso.categoria] = {};
                    }
                    const nombreCurso = curso.nombrecurso;

                    if (!acc[curso.categoria][nombreCurso]) {
                        acc[curso.categoria][nombreCurso] = { notas: [] };
                    }

                    // Agregar las notas del curso al arreglo correspondiente
                    if (curso.notas && curso.notas.length > 0) {
                        acc[curso.categoria][nombreCurso].notas.push(...curso.notas);
                    }
                    return acc;
                }, {});

                // Convertir el objeto agrupado en un formato adecuado para graficar
                const formattedData = Object.keys(groupedData).reduce((acc, categoria) => {
                    acc[categoria] = Object.keys(groupedData[categoria]).map(nombreCurso => {
                        const notas = groupedData[categoria][nombreCurso].notas;
                        const promedio = notas.length > 0
                            ? notas.reduce((sum, nota) => sum + nota, 0) / notas.length
                            : 0;
                        return {
                            nombreCurso,
                            promedioNotas: promedio
                        };
                    });
                    return acc;
                }, {});

                setData(formattedData);
            })
            .catch((error) => {
                console.error("Error al obtener los datos: ", error);
            });
    }, []);

    // Filtrar los cursos por la categoría seleccionada
    const cursosFiltrados = categoriaSeleccionada
        ? data[categoriaSeleccionada] || []
        : [];

    // Extraer datos para el gráfico
    const xData = cursosFiltrados.map((curso) => curso.nombreCurso);
    const yData = cursosFiltrados.map((curso) => curso.promedioNotas);

    // Generar colores únicos para cada barra
    const colors = xData.map(() =>
        `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(
            Math.random() * 255
        )}, ${Math.floor(Math.random() * 255)}, 1)`
    );

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
                            type: "bar",
                            marker: { color: colors },
                            name: "Promedio de Notas",
                        },
                    ]}
                    layout={{
                        title: `Promedio de Notas por Curso en "${categoriaSeleccionada}"`,
                        xaxis: {
                            title: "Cursos",
                            automargin: true,
                        },
                        yaxis: {
                            title: "Promedio de Notas",
                            range: [0, 50],
                        },
                        height: 330,
                        margin: {
                            l: 40,
                            r: 30,
                            t: 50,
                            b: 40,
                        },
                    }}
                    config={{ responsive: true }}
                />
            )}
        </div>
    );
};

export default PromedioNotasCurso;

