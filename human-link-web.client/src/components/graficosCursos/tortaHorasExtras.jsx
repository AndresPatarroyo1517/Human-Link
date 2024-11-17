import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import nominaService from '../../services/nominaService';
import './Style-graficos.css';

const TortaHorasExtras = () => {
    const [data, setData] = useState(null);

    useEffect(() => {
        nominaService.getMetricasNomina()
            .then(response => {
                setData(response);
                console.log(response);
            })
            .catch(error => {
                console.error('Error al obtener los datos: ', error);
            });
    }, []);

    if (!data) {
        return <div>Cargando datos...</div>;
    }

    const {
        PorcentajeEmpleadosConHorasExtras,
        PorcentajeEmpleadosSinHorasExtras
    } = data;

    return (
        <div className="contenedor-grafico contenedor-torta">
            <Plot
                data={[
                    {
                        values: [
                            PorcentajeEmpleadosConHorasExtras,
                            PorcentajeEmpleadosSinHorasExtras,
                        ],
                        labels: ['Con Horas Extras', 'Sin Horas Extras'],
                        type: 'pie',
                        textinfo: 'label+percent',
                        insidetextorientation: 'radial',
                        marker: {
                            colors: ["#0e3aff", "#f12b00"],
                        },
                    },
                ]}
                layout={{
                    title: 'Porcentaje de Empleados con y sin Horas Extras',
                    height: 350,
                    margin: {
                        l: 40,
                        r: 40,
                        t: 40,
                        b: 40,
                    },
                }}
                config={{ responsive: true }}
            />
        </div>
    );
};

export default TortaHorasExtras;
