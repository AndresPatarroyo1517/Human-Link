import React from "react";
import TortaInscritos from "../graficosCursos/tortaInscritos";
import BarrasCursosCategoria from "../graficosCursos/barrasCursosCategoria";
import "./visualizacionDatos.css";

const VisualizacionDatos = () => {
    return (
        //<div className="dashboardContainer">
        //    <h2 className="title">Dashboard de Cursos</h2>
        //    <div className="graphsContainer">
        //        <div className="graphItem">
        //            <BarrasCursosCategoria />
        //        </div>
        //        <div className="graphItem">
        //            <TortaInscritos />
        //        </div>
        //    </div>
        //</div>
        <div className="contenedor-graficos">
            <BarrasCursosCategoria />
            <TortaInscritos />
        </div>
    );
};

export default VisualizacionDatos;