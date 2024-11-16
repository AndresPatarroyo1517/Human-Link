import TortaInscritos from "../graficosCursos/tortaInscritos";
import BarrasCursosCategoria from "../graficosCursos/barrasCursosCategoria";
import "./visualizacionDatos.css";
import BarrasCursos from "../graficosCursos/barrasCursos";
import { useEffect } from "react";
import formService from "../../services/formService";

const VisualizacionDatos = () => {

    useEffect(() => {
        formService.getRespuestas()
            .then(response => {
                console.log(response)
            })
            .catch(error => {
                console.error("Error al consultar formularios: " + error)
            })
    })

    return (
        <div className="contenedor-graficos">
            <TortaInscritos />
            <BarrasCursosCategoria />
            <BarrasCursos />
        </div>
    );
};

export default VisualizacionDatos;