import React, { useState, useEffect } from "react";
import Plot from "react-plotly.js";
import cursosService from "../../services/cursosService";
import usuariosService from "../../services/usuariosService"; // Asegúrate de tener este servicio
import "./Style-graficos.css";

const ProgresoUsuarios = () => {
    const [estadisticas, setEstadisticas] = useState({ noIniciados: 0, enProgreso: 0, completados: 0 });

    useEffect(() => {
        // Petición para obtener todos los usuarios
        usuariosService.getUsuarios()
            .then((usuariosResponse) => {
                // Inicializar contadores
                let noIniciados = 0;
                let enProgreso = 0;
                let completados = 0;

                // Obtenemos todos los usuarios sin cursos
                const usuariosSinCursos = new Set();

                // Recorrer los usuarios y clasificar según el progreso de los cursos
                usuariosResponse.forEach((usuario) => {
                    // Si no tiene cursos, lo consideramos como no iniciado
                    if (usuario.Cursousuarios.length === 0) {
                        usuariosSinCursos.add(usuario.Idusuario); // Evitar duplicados
                        noIniciados++;
                    } else {
                        // Clasificar en base al progreso de los cursos
                        usuario.Cursousuarios.forEach((curso) => {
                            if (curso.Progreso === 0) {
                                noIniciados++;
                            } else if (curso.Progreso > 0 && curso.Progreso < 100) {
                                enProgreso++;
                            } else if (curso.Progreso === 100) {
                                completados++;
                            }
                        });
                    }
                });

                // Contamos los usuarios sin cursos
                noIniciados += usuariosSinCursos.size;

                // Actualizar las estadísticas en el estado
                setEstadisticas({ noIniciados, enProgreso, completados });
            })
            .catch((error) => {
                console.error("Error al obtener los datos de usuarios: ", error);
            });

    }, []);

    return (
        <div className="contenedor-grafico">
            <Plot
                data={[{
                    x: ["No Iniciados", "En Progreso", "Completados"],
                    y: [estadisticas.noIniciados, estadisticas.enProgreso, estadisticas.completados],
                    type: "bar",
                    marker: { color: ["#d9534f", "#f0ad4e", "#5cb85c"] },
                }]}
                layout={{
                    title: "Distribución del Progreso de Usuarios",
                    xaxis: { title: "Estado" },
                    yaxis: { title: "Cantidad de Usuarios" },
                    height: 350,
                }}
                config={{ responsive: true }}
            />
        </div>
    );
};

export default ProgresoUsuarios;
