import TortaInscritos from "../graficosCursos/tortaInscritos";
import BarrasCursosCategoria from "../graficosCursos/barrasCursosCategoria";
import "./visualizacionDatos.css";
import BarrasCursos from "../graficosCursos/barrasCursos";
import { useEffect } from "react";
import formService from "../../services/formService";
import { Informes } from '../Informes/informes.jsx'

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
            <Informes/>
        </div>
    );
};

export default VisualizacionDatos;