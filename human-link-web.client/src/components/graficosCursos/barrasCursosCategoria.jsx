import { useState, useEffect, useRef } from 'react';
import Plot from 'react-plotly.js';
import Plotly from 'plotly.js-dist';
import cursosService from '../../services/cursosService';
import './Style-graficos.css';

const BarrasCursosCategoria = ({ onImagenGenerada }) => {
    const [data, setData] = useState([]);
    const imageC = useRef(null);

    useEffect(() => {
        cursosService.getAllCursosCategoria()
            .then(response => {
                const groupedData = response.reduce((acc, curso) => {
                    acc[curso.categoria] = (acc[curso.categoria] || 0) + 1;
                    return acc;
                }, {});

                const formattedData = Object.keys(groupedData).map(categoria => ({
                    categoria,
                    cantidad: groupedData[categoria]
                }));

                setData(formattedData);
            })
            .catch(error => {
                console.error("Error al obtener cursos con categorias: " + error);
            });
    }, []);

    useEffect(() => {
        const generarImagen = async () => {
            const graficoElement = document.querySelector('.contenedor-grafico-export');
            if (!graficoElement) {
                throw new Error('No se encontr� el elemento del gr�fico');
            }

            try {
                const imageData = await Plotly.toImage(graficoElement.querySelector('.js-plotly-plot'), {
                    format: 'png',
                    width: 800,
                    height: 400
                });

                if (onImagenGenerada) {
                    onImagenGenerada(imageData); 
                }

                if (imageC.current) {
                    imageC.current.src = imageData;  
                }
            } catch (error) {
                //console.error('Error al generar la imagen del gr�fico:', 'tabla');
            }
        };

        if (data.length > 0) {
            generarImagen();
        }
    }, [data, onImagenGenerada]);

    if (data.length === 0) {
        return <div>Cargando datos...</div>;
    }

    const xData = data.map(item => item.categoria);
    const yData = data.map(item => item.cantidad);

    const colors = xData.map(() =>
        `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(
            Math.random() * 255
        )}, ${Math.floor(Math.random() * 255)}, 1)`
    );

    return (
        <div className="contenedor-grafico-export">
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
                    title: 'Cantidad de Inscritos por Categor�a',
                    xaxis: {
                        title: 'Categor�as',
                        automargin: true,
                    },
                    yaxis: {
                        title: 'Cantidad de Inscritos',
                        range: [0, Math.max(...yData) + 1],
                    },
                    height: 350,
                    margin: {
                        l: 40,
                        r: 30,
                        t: 50,
                        b: 40,
                    },
                }}
                config={{ responsive: true }}
            />
        </div>
    );
};

export default BarrasCursosCategoria;
