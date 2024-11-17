import React, { useState, useEffect } from "react";
import cursosService from "../../services/cursosService";
import usuariosService from "../../services/usuariosService";
import NominaService from "../../services/nominaService";
import "./Estadisticas.css";

const Estadisticas = () => {
    const [cursosData, setCursosData] = useState([]);
    const [usuariosData, setUsuariosData] = useState([]);
    const [bonificacionesData, setBonificacionesData] = useState([]);
    const [usuariosInscritosIds, setUsuariosInscritosIds] = useState(new Set());

    useEffect(() => {
        cursosService.getCursos()
            .then((response) => setCursosData(response))
            .catch((error) => console.error("Error al obtener los datos de cursos: ", error));

        usuariosService.getUsuarios()
            .then((response) => setUsuariosData(response))
            .catch((error) => console.error("Error al obtener los datos de usuarios: ", error));

        cursosService.getAllCursosCategoria()
            .then((response) => setUsuariosInscritosIds(new Set(response.map((curso) => curso.idusuario))))
            .catch((error) => console.error("Error al obtener los datos de cursos con usuarios y categorías: ", error));

        NominaService.getMetricasNomina()
            .then((response) => setBonificacionesData(response))
            .catch((error) => console.error("Error al obtener los datos de métricas de nómina: ", error));
    }, []);

    const totalCursos = cursosData.length;
    const totalUsuarios = usuariosData.length;
    const totalInscritos = usuariosData.filter((usuario) => usuariosInscritosIds.has(usuario.Idusuario)).length;
    const totalNoInscritos = totalUsuarios - totalInscritos;
    const totalBonificaciones = bonificacionesData.TotalBonificacion || 0;
    const promedioHorasExtras = bonificacionesData.PromedioHorasExtras
        ? parseFloat(bonificacionesData.PromedioHorasExtras.toFixed(2))
        : 0;

    return (
        <div className="estadisticas-container">
            <h2 className="estadisticas-title">Resumen</h2>
            <div className="estadisticas-grid">
                <div className="estadistica-card">
                    <h3>Total de Cursos</h3>
                    <p>{totalCursos}</p>
                </div>
                <div className="estadistica-card">
                    <h3>Total de Usuarios</h3>
                    <p>{totalUsuarios}</p>
                </div>
                <div className="estadistica-card">
                    <h3>Total de Inscritos</h3>
                    <p>{totalInscritos}</p>
                </div>
                <div className="estadistica-card">
                    <h3>Total de No Inscritos</h3>
                    <p>{totalNoInscritos}</p>
                </div>
                <div className="estadistica-card">
                    <h3>Total de Bonificaciones</h3>
                    <p>${totalBonificaciones}</p>
                </div>
                <div className="estadistica-card">
                    <h3>Promedio de Horas Extras</h3>
                    <p>{promedioHorasExtras} hrs</p>
                </div>
            </div>
        </div>
    );
};

export default Estadisticas;

