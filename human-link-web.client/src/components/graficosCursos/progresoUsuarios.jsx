import React, { useState, useEffect } from "react";
import Plot from "react-plotly.js";
import cursosService from "../../services/cursosService";
import "./Style-graficos.css";

const ProgresoUsuarios = () => {
    const [estadisticas, setEstadisticas] = useState({ noIniciados: 0, enProgreso: 0, completados: 0 });

    useEffect(() => {
        cursosService.getAllCursosCategoria()
            .then((response) => {
                // Inicializar contadores
                let noIniciados = 0;
                let enProgreso = 0;
                let completados = 0;

                // Recorrer los cursos para clasificar el progreso
                response.forEach((curso) => {
                    if (curso.progreso === 0) {
                        noIniciados++;
                    } else if (curso.progreso > 0 && curso.progreso < 100) {
                        enProgreso++;
                    } else if (curso.progreso === 100) {
                        completados++;
                    }
                });

                // Actualizar las estadísticas en el estado
                setEstadisticas({ noIniciados, enProgreso, completados });
            })
            .catch((error) => {
                console.error("Error al obtener los datos: ", error);
            });
    }, []);

    return (
        <div className="contenedor-grafico">
            <Plot
                data={[
                    {
                        x: ["No Iniciados", "En Progreso", "Completados"],
                        y: [estadisticas.noIniciados, estadisticas.enProgreso, estadisticas.completados],
                        type: "bar",
                        marker: { color: ["#d9534f", "#f0ad4e", "#5cb85c"] },
                    },
                ]}
                layout={{
                    title: "Distribución del Progreso de Usuarios inscritos a cursos",
                    xaxis: { title: "Estado" },
                    yaxis: {
                        title: "Cantidad de Usuarios"
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

export default ProgresoUsuarios;