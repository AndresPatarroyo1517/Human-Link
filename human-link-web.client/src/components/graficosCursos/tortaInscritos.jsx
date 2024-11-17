import React, { useEffect, useState } from "react";
import Plot from "react-plotly.js";
import cursosService from "../../services/cursosService";
import usuariosService from "../../services/usuariosService";
import './Style-graficos.css';

const TortaInscritos = () => {
    const [cursosData, setCursosData] = useState([]);
    const [usuariosData, setUsuariosData] = useState([]);
    const [usuariosInscritosIds, setUsuariosInscritosIds] = useState(new Set());

    useEffect(() => {
        cursosService.getAllCursosCategoria()
            .then(response => {
                setCursosData(response);
                setUsuariosInscritosIds(new Set(response.map((curso) => curso.idusuario)));
                console.log(response.map((curso) => curso.idusuario));
                console.log(response);
            })
            .catch(error => {
                console.error('Error al obtener los datos de cursos: ', error);
            });
        usuariosService.getUsuarios()
            .then(response => {
                setUsuariosData(response);
                console.log(response);
            })
            .catch(error => {
                console.error('Error al obtener los datos de usuarios: ', error);
            });
    }, []);

    // Si no hay datos aún, se puede mostrar un loading
    if (usuariosData.length == 0 && cursosData.length == 0) {
        return <div>Cargando datos...</div>;
    }
    
    const inscritos = usuariosData.filter((usuario) => usuariosInscritosIds.has(usuario.Idusuario)).length;
    const noInscritos = usuariosData.length - inscritos;

    return (
        <div className="contenedor-grafico">
            <Plot
                data={[
                    {
                        type: "pie",
                        values: [inscritos, noInscritos],
                        labels: ["Inscritos", "No Inscritos"],
                        textinfo: "label+percent",
                        insidetextorientation: "radial",
                        marker: {
                            colors: ["#0e3aff", "#f12b00"],
                        },
                    },
                ]}
                layout={{
                    title: "Porcentaje de Inscritos vs No Inscritos",
                    //width: "100%",
                    height: 350,
                    margin: { t: 50, l: 50, r: 50, b: 50 },
                }}
                config={{ responsive: true }}
                
            />
        </div>
    );
};

export default TortaInscritos;

