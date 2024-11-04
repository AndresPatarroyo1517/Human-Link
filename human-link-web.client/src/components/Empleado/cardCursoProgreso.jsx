/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import './CardCursoProgreso.css';
import { useEffect } from 'react';
import cursosService from '../../services/cursosService';

const CardCursoProgreso = () => {
    const [cursos, setCursos] = useState([]);

    //const [newCurso, setNewCurso] = useState({
    //    nombrecurso: "",
    //    duracion: "",
    //    url: "",
    //    descripcion: ""
    //});

    useEffect(() => {
        cursosService.getCursosProgeso()
            .then(response => {
                console.log(response);
                setCursos(response);
            })
            .catch(error => {
                console.error('Error al obtener los cursos y progreso:', error);
            });
    }, []);

    return (
        <>
            <div className="row">
                {cursos.map((curso, index) => (
                    <div key={index} className="contenedor-card">
                        <div className="contenedor-titulo">
                            <h3>{ curso.curso.nombrecurso }</h3>
                        </div>
                        <div className="contenedor-body">
                            <div className="contenedor-img">
                                <img src={curso.curso.url[0] } alt="Imagen de curso" />
                            </div>
                            <div className="contenedor-progreso">
                                <h3>Progreso</h3>
                                <div className="progress" role="progressbar" aria-label="Success example" aria-valuenow={curso.progreso} aria-valuemin="0" aria-valuemax="100">
                                    <div className="progress-bar" style={{ width: `${curso.progreso}%` }}>{curso.progreso}%</div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))};
            </div>
            
        </>
    );
};

export default CardCursoProgreso;