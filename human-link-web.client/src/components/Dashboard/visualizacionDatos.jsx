import TortaInscritos from "../graficosCursos/tortaInscritos";
import "./visualizacionDatos.css";
import BarrasCursos from "../graficosCursos/barrasCursos";
import { useEffect, useState } from "react";
import { Informes } from "../Informes/informes";
import BarrasCursosCategoria from "../graficosCursos/barrasCursosCategoria";
import PromedioNotasCurso from "../graficosCursos/promedioNotasCurso";
import TortaNominaExtras from "../graficosCursos/tortaHorasExtras";
import ProgresoUsuarios from "../graficosCursos/progresoUsuarios";
import Estadisticas from "../graficosCursos/estadisticas";

const VisualizacionDatos = () => {

    
    const [imageSrc, setImageSrc] = useState(null);

    useEffect(() => {

    }, [Informes])

    const manejarImagenGenerada = (imageData) => {
        setImageSrc(imageData)
    }

    return (
        <div>
            <div>
                <Estadisticas />
            </div>
            <div className="contenedor-graficos">
                <TortaInscritos />
                <BarrasCursosCategoria onImagenGenerada={manejarImagenGenerada} />
                <BarrasCursos />
                <PromedioNotasCurso />
                <TortaNominaExtras />
                <ProgresoUsuarios />
                <Informes imageSrc={imageSrc} style={{ gridColumn: 'span 2' }} />
            </div>
        </div>
    );
};

export default VisualizacionDatos;