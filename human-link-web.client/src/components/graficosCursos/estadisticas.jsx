import React, { useState, useEffect } from 'react';
import cursosService from '../../services/cursosService';
import usuariosService from '../../services/usuariosService';
import NominaService from '../../services/nominaService';
import './Estadisticas.css';

const Estadisticas = () => {
    const [cursosData, setCursosData] = useState([]);
    const [usuariosData, setUsuariosData] = useState([]);
    const [bonificacionesData, setBonificacionesData] = useState([]);
    const [usuariosInscritosIds, setUsuariosInscritosIds] = useState(new Set());

    useEffect(() => {
        // Obtener datos de cursos
        cursosService.getCursos()
            .then((response) => {
                setCursosData(response);
            })
            .catch((error) => {
                console.error("Error al obtener los datos de cursos (general): ", error);
            });

        // Obtener datos de usuarios
        usuariosService.getUsuarios()
            .then((response) => {
                setUsuariosData(response);
            })
            .catch((error) => {
                console.error("Error al obtener los datos de usuarios (general): ", error);
            });

        // Obtener datos de cursos con usuarios y categorías
        cursosService.getAllCursosCategoria()
            .then((response) => {
                setUsuariosInscritosIds(new Set(response.map((curso) => curso.idusuario)));
            })
            .catch((error) => {
                console.error("Error al obtener los datos de cursos con usuarios y categorias: ", error);
            });

        // Obtener métricas de nómina (bonificaciones y horas extras)
        NominaService.getMetricasNomina()
            .then((response) => {
                setBonificacionesData(response);
            })
            .catch((error) => {
                console.error("Error al obtener los datos de métricas de nómina: ", error);
            });
    }, []);

    const totalCursos = cursosData.length;
    const totalUsuarios = usuariosData.length;
    const totalInscritos = usuariosData.filter((usuario) => usuariosInscritosIds.has(usuario.Idusuario)).length;
    const totalNoInscritos = usuariosData.length - totalInscritos;
    const totalBonificaciones = bonificacionesData.TotalBonificacion;
    const promedioHorasExtras = bonificacionesData.PromedioHorasExtras
        ? parseFloat(bonificacionesData.PromedioHorasExtras.toFixed(2))
        : 0;

    return (
        <div className="estadisticas">
            <div className="estadisticas-item total-cursos">
                <h3>Total de Cursos</h3>
                <p>{totalCursos}</p>
            </div>

            <div className="estadisticas-item total-usuarios">
                <h3>Total de Usuarios</h3>
                <p>{totalUsuarios}</p>
            </div>

            <div className="estadisticas-item total-inscritos">
                <h3>Total de Inscritos a Cursos</h3>
                <p>{totalInscritos}</p>
            </div>

            <div className="estadisticas-item total-no-inscritos">
                <h3>Total de No Inscritos a Cursos</h3>
                <p>{totalNoInscritos}</p>
            </div>

            <div className="estadisticas-item total-bonificaciones">
                <h3>Total de Bonificaciones</h3>
                <p>{totalBonificaciones}</p>
            </div>

            <div className="estadisticas-item promedio-horas-extras">
                <h3>Promedio de Horas Extras</h3>
                <p>{promedioHorasExtras}</p>
            </div>
        </div>
    );
};

export default Estadisticas;

