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
                const categoriasUnicas = [...new Set(response.map(curso => curso.categoria))];
                setCategorias(categoriasUnicas);
                const groupedData = response.reduce((acc, curso) => {
                    if (!acc[curso.categoria]) {
                        acc[curso.categoria] = {};
                    }
                    const nombreCurso = curso.nombrecurso;
                    if (!acc[curso.categoria][nombreCurso]) {
                        acc[curso.categoria][nombreCurso] = new Set();
                    }
                    acc[curso.categoria][nombreCurso].add(curso.idusuario);
                    return acc;
                }, {});

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

    const cursosFiltrados = categoriaSeleccionada
        ? data[categoriaSeleccionada] || []
        : [];
    const xData = cursosFiltrados.map(curso => curso.nombreCurso);
    const yData = cursosFiltrados.map(curso => curso.inscritos);

    const colors = xData.map(() =>
        `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(
            Math.random() * 255
        )}, ${Math.floor(Math.random() * 255)}, 1)`
    );

    return (
        <div className="contenedor-grafico contenedor-barrasCursos">
           
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

            {cursosFiltrados.length === 0 ? (
                <div>Cargando datos o no hay cursos en esta categoría...</div>
            ) : (
                <Plot
                    data={[
                        {
                            x: xData,
                            y: yData,
                            type: 'bar',
                            marker: { color: colors },
                            name: 'Cantidad de Inscritos',
                        },
                    ]}
                    layout={{
                        title: `Cantidad de Inscritos por Curso en "${categoriaSeleccionada}"`,
                        xaxis: {
                            title: 'Cursos',
                            automargin: true,
                        },
                        yaxis: {
                            title: 'Cantidad de Inscritos',
                            range: [0, Math.max(...yData) + 1], 
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

export default BarrasCursos;

