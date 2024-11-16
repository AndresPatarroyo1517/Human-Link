import TortaInscritos from "../graficosCursos/tortaInscritos";
import "./visualizacionDatos.css";
import BarrasCursos from "../graficosCursos/barrasCursos";
import { useEffect } from "react";
import formService from "../../services/formService";
import { Informes } from "../Informes/informes";

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
            <BarrasCursos />
            {/*Aqui no ponga una grafica de nomina, la requiero para que se exporte al PDF*/}
            {/*<Informes/>*/}
        </div>
    );
};

export default VisualizacionDatos;