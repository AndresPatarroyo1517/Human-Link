import TortaInscritos from "../graficosCursos/tortaInscritos";
import "./visualizacionDatos.css";
import BarrasCursos from "../graficosCursos/barrasCursos";
import { useEffect } from "react";
import formService from "../../services/formService";
import { Informes } from "../Informes/informes";
import BarrasCursosCategoria from "../graficosCursos/barrasCursosCategoria";
import PromedioNotasCurso from "../graficosCursos/promedioNotasCurso";
import TortaNominaExtras from "../graficosCursos/tortaHorasExtras";
import ProgresoUsuarios from "../graficosCursos/progresoUsuarios";
import Estadisticas from "../graficosCursos/estadisticas";

const VisualizacionDatos = () => {

    //useEffect(() => {
    //    formService.getRespuestas()
    //        .then(response => {
    //            console.log(response)
    //        })
    //        .catch(error => {
    //            console.error("Error al consultar formularios: " + error)
    //        })
    //})

    return (
        <div>
            <div>
                <Estadisticas />
            </div>
            <div className="contenedor-graficos">
                <TortaInscritos />
                <BarrasCursosCategoria />
                <BarrasCursos />
                <PromedioNotasCurso />
                <TortaNominaExtras />
                <ProgresoUsuarios />
                {/*Aqui no ponga una grafica de nomina, la requiero para que se exporte al PDF*/}
                {/*<Informes/>*/}
            </div>
        </div>
    );
};

export default VisualizacionDatos;