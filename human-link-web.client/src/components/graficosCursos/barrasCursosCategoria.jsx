import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import cursosService from '../../services/cursosService';
import './BarCursosCategoria.css';

const BarrasCursosCategoria = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        cursosService.getAllCursosCategoria()
            .then(response => {
                // Agrupar cursos por categoría y contar la cantidad de inscritos
                const groupedData = response.reduce((acc, curso) => {
                    acc[curso.categoria] = (acc[curso.categoria] || 0) + 1;
                    return acc;
                }, {});

                // Convertir el objeto agrupado en un array para graficar
                const formattedData = Object.keys(groupedData).map(categoria => ({
                    categoria,
                    cantidad: groupedData[categoria]
                }));

                setData(formattedData);
            })
            .catch(error => {
                console.error('Error al obtener los datos: ', error);
            });
    }, []);

    // Si no hay datos aún, se puede mostrar un loading
    if (data.length === 0) {
        return <div>Cargando datos...</div>;
    }

    // Extraer datos para el gráfico
    const xData = data.map(item => item.categoria);
    const yData = data.map(item => item.cantidad);

    return (
        <div className="contenedor-grafico">
            <Plot
                data={[
                    {
                        x: xData,
                        y: yData,
                        type: 'bar',
                        marker: { color: 'rgba(75, 192, 192, 0.5)' },
                        name: 'Cantidad de Inscritos'
                    }
                ]}
                layout={{
                    title: 'Cantidad de Inscritos por Categoría',
                    xaxis: {
                        title: 'Categorías',
                        automargin: true,
                    },
                    yaxis: {
                        title: 'Cantidad de Inscritos',
                        range: [0, Math.max(...yData) + 1] // Ajustar rango del eje Y
                    },
                    //width: 500,
                    //height: 300,
                    margin: {
                        l: 40,
                        r: 30,
                        t: 50,
                        b: 40
                    }
                }}
                config={{ responsive: true }}
            />
        </div>
    );
};

export default BarrasCursosCategoria;
