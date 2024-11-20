import { useState, useEffect, useRef, useCallback } from 'react';
import Plot from 'react-plotly.js';
import Plotly from 'plotly.js-dist';
import cursosService from '../../services/cursosService';
import './Style-graficos.css';

const BarrasCursosCategoria = ({ onImagenGenerada }) => {
    const [data, setData] = useState([]);
    const plotRef = useRef(null);

    // Fetch data
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
                console.error('Error fetching data:', error);
            });
    }, []);

    // Generate image when plot is ready
    const generateImage = useCallback(async () => {
        try {
            if (!plotRef.current) {
                console.log('Plot reference not ready');
                return;
            }

            const plotElement = plotRef.current.querySelector('.js-plotly-plot');
            if (!plotElement) {
                console.log('Plot element not found');
                return;
            }

            console.log('Generating image...');
            const imageData = await Plotly.toImage(plotElement, {
                format: 'png',
                width: 800,
                height: 400,
                scale: 2  // Better quality
            });

            console.log('Image generated:', imageData.slice(0, 50) + '...');
            onImagenGenerada(imageData);

        } catch (error) {
            console.error('Error generating image:', error);
        }
    }, [onImagenGenerada]);

    // Setup plot and generate image when data changes
    useEffect(() => {
        if (data.length > 0) {
            // Dar tiempo a Plotly para renderizar completamente
            const timer = setTimeout(() => {
                generateImage();
            }, 1000);

            return () => clearTimeout(timer);
        }
    }, [data, generateImage]);

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
        <div className="contenedor-grafico-export" ref={plotRef}>
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
                    title: 'Cantidad de Inscritos por Categoría',
                    xaxis: {
                        title: 'Categorías',
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
                config={{
                    responsive: true,
                    displayModeBar: false // Opcional: oculta la barra de herramientas
                }}
            />
        </div>
    );
};

export default BarrasCursosCategoria;