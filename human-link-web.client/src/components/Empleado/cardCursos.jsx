/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import cursosService from "../../services/cursosService";
import { useEffect } from "react";
import { useEmpleado } from '../../context/empleadoContext';
import { useCurso } from '../../context/cursoContext';

const CardCursos = () => {
    // Array inicial de cursos
    const [cursos, setCursos] = useState([]);

    const [cursosGeneral, setCursosGeneral] = useState([]);

    const { setActiveMenu } = useEmpleado();

    useEffect(() => {
        cursosService.getCursosEmpleado()
            .then(response => {
                console.log("Response from getCursosEmpleado:", response);
                setCursos(response);
            })
            .catch(error => {
                console.error('Error al obtener los cursos:', error);
            });
    }, []);

    useEffect(() => {
        cursosService.getCursos()
        .then(response => {
                console.log("Response from getCursos:", response);
                setCursosGeneral(response);
            })
            .catch(error => {
                console.error('Error al obtener los cursos:', error);
            });
    }, []);

    
    const [newCurso, setNewCurso] = useState({
        nombrecurso: "",
        duracion: "",
        url: "",
        descripcion: ""
    });

    const { setSelectedCurso } = useCurso();

    const handleInputChange = (e) => {
        setNewCurso({
            ...newCurso,
            [e.target.name]: e.target.value
        });
    };

    const handleAddCurso = () => {
        setCursos([...cursos, newCurso]);
        setNewCurso({
            nombrecurso: "",
            duracion: "",
            url: "",
            descripcion: ""
        });
    };

   

    return (
        <>
            {/* Mis cursos */}
            <div><h2 className="mb-4">Mis cursos</h2></div>

            {/* tarjetas de los cursos */}
            <div className="row">
                {cursos.map((curso, index) => (
                    <div key={index} className="col-md-4 mb-4">
                        <div className="card h-100">
                            <img src={curso.Url && curso.Url.length > 0 ? curso.Url[0] : "imagen no encontrada"} className="card-img-top" alt={curso.Nombrecurso} />
                            <div className="card-body">
                                <h5 className="card-title">{curso.Nombrecurso}</h5>
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={() => {
                                        setSelectedCurso(curso);
                                        setActiveMenu('Desarrollo curso')
                                    }
                                    }
                                >
                                    Ingresar
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {/* cursos */}
            <div><h2 className="mb-4">Cursos que te podrian interesar</h2></div>

            {/* tarjetas de los cursos */}
            <div className="row">
                {cursosGeneral.map((curso, index) => (
                    // Verificamos si el curso ya está en 'cursos' antes de renderizarlo
                    !cursos.some(c => c.Nombrecurso === curso.Nombrecurso) && (
                        <div key={index} className="col-md-4 mb-4">
                            <div className="card h-100">
                                <img src={curso.Url && curso.Url.length > 0 ? curso.Url[0] : "imagen no encontrada"} className="card-img-top" alt={curso.Nombrecurso} />
                                <div className="card-body">
                                    <h5 className="card-title">{curso.Nombrecurso}</h5>
                                    <button
                                        type="button"
                                        className="btn btn-primary"
                                        data-bs-toggle="modal"
                                        data-bs-target={'#modalcurso' + index} // Aquí eliminamos el '#' extra
                                    >
                                        Launch static backdrop modal
                                    </button>

                                    {/* Modal registro curso */}
                                    <div className="modal fade" id={'modalcurso' + index} data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                                        <div className="modal-dialog">
                                            <div className="modal-content">
                                                <div className="modal-header">
                                                    <h1 className="modal-title fs-5" id="staticBackdropLabel">{curso.Nombrecurso}</h1>
                                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                </div>
                                                <div className="modal-body">
                                                    <h2 className="fs-5">Categoria</h2>
                                                    <p>{curso.Categoria}</p>
                                                    <hr />
                                                    <h2 className="fs-5">Descripcion</h2>
                                                    <p>{curso.Descripcion}</p>
                                                    <h2 className="fs-5">Duracion</h2>
                                                    <p>Este curso consta de un total de {curso.Duracion} Horas</p>
                                                </div>
                                                <div className="modal-footer">
                                                    <button type="button" className="btn btn-success">Inscribirme</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                ))}
            </div>

        </>
          
        
    );
    };

export default CardCursos;
