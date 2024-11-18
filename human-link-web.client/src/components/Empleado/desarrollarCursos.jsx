import React, { useEffect, useState } from 'react';
import { useCurso } from '../../context/cursoContext';
import { useEmpleado } from  '../../context/empleadoContext';
import './DesarrollarCursos.css';
import formService from '../../services/formService';
import cursosService from '../../services/cursosService'

const DesarrollarCursos = () => {
    const apiKey = 'AIzaSyAdRZMAsJHz2KPzYbCr6QCDQI8-zAObpVU';
    const { selectedCurso } = useCurso();
    const { setActiveMenu } = useEmpleado();
    const [descripciones, setDescripciones] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [isError, setIsError] = useState(false);

    const obtenerVideoId = (url) => {
        const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|v\/|.+\?v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
        const match = url.match(regex);
        return match ? match[1] : null;
    };

        const [isQuizCompleted, setIsQuizCompleted] = useState(false);

        const handleQuizClick = () => {
            setIsQuizCompleted(true);
        };

        const handleCompleteQuiz = async () => {
            setIsQuizCompleted(false);
            setIsLoading(true);
            console.log(selectedCurso);
            console.log(selectedCurso[0].Url.length - 1);
            const body = {
                idcuremp: 0,
                idusuario: 0,
                idcurso: selectedCurso[0].Idcurso,
                progreso: selectedCurso[0].Url.length - 1,
                notas: []
            };
            const response = await formService.putCargarNota(body);
            setIsLoading(false);
            console.log(response);
            if (response.Notas == null) {
                /*alert("No se ha enviado ninguna respuesta.");*/
                setIsError(true);
                setModalMessage("Ninguna nota fue cargada en la base de datos.");
                setShowModal(true);
            } else {
                /*alert("Nota cargada exitosamente.");*/
                setIsError(false);
                setModalMessage("Nota cargada exitosamente en la base de datos.");
                setShowModal(true);
            }

        };

    useEffect(() => {
        const fetchDescriptions = async () => {
            const descriptions = await Promise.all(selectedCurso[0].Url.slice(1).map(async (url) => {
                const videoId = obtenerVideoId(url);
                if (videoId) {
                    const response = await fetch(`https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${apiKey}&part=snippet`);
                    const data = await response.json();
                    return data.items[0]?.snippet?.description || 'Descripción no disponible';
                }
                return 'Descripción no disponible';
            }));
            setDescripciones(descriptions);
        };

        fetchDescriptions();
    }, [selectedCurso, apiKey]);

const eliminar = async (modalId) => {
    const curso = selectedCurso[0];
    const idcuremp = selectedCurso[1];

    for (const id of idcuremp) {
        if (id.Idcurso === curso.Idcurso) {
            try {
                const response = await cursosService.deleteCursoUsuarioEmpleado(id.Idcuremp);
                if (response.ok) {
                    alert("Curso eliminado con éxito.");
                    const modal = document.getElementById(modalId);
                    if (modal) {
                        const modalInstance = bootstrap.Modal.getInstance(modal);
                        modalInstance.hide();
                    }
                    setActiveMenu('Mis Cursos');
                    // Recargar cursos del empleado
                    await cargarCursosEmpleado();

                    // Cerrar el modal

                } else {
                    alert(`Error al eliminar el curso: ${response.statusText}`);
                }
            } catch (error) {
                console.error("Error al eliminar el curso:", error);
            }
        }
    }
};
        console.log(selectedCurso)
        return (
            <>
                <h2 className="mb-4">{selectedCurso[0].Nombrecurso}</h2>
                {selectedCurso[0].Url.slice(1).map((url, index) => (
                    <div key={index} className="video-card position-relative p-3 mb-4">
                        <p className="d-inline-flex gap-1">
                            <a className="btn btn-primary" data-bs-toggle="collapse" href={'#parte' + index} role="button" aria-expanded="false" aria-controls={'parte' + index}>
                                {selectedCurso[0].Nombrecurso} - Video {index + 1}
                            </a>
                        </p>
                        <div className="collapse" id={'parte' + index}>
                            <div className="card card-body text-center" style={{ width: '100%' }}>
                                <div className="video-container">
                                    <iframe
                                        className="video-frame"
                                        width="560"
                                        height="315"
                                        src={url}
                                        title="YouTube video player"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                        referrerPolicy="strict-origin-when-cross-origin"
                                        allowFullScreen
                                    ></iframe>
                                </div>
                                <p className="mt-3"><strong>Descripci�n:</strong> {descripciones[index]}</p>
                                <a href="https://docs.google.com/forms/d/e/1FAIpQLScQUXiRBXzSpb_unC0wDAC0VYN1IWZBc1o6ZZozAZUXMJ9rZA/viewform?usp=sf_link" target="_blank">
                                    <button className="btn btn-secondary bottom-0 end-0 m-3" onClick={handleQuizClick}>Cuestionario</button>
                                </a>
                                <button className="btn btn-success" onClick={handleCompleteQuiz} disabled={!isQuizCompleted}>
                                    Finalizar cuestionario
                                </button>
                                {isLoading && (
                                    <div className="d-flex justify-content-center">
                                        <div className="spinner-border" role="status">
                                            <span className="visually-hidden">Cargando...</span>
                                        </div>
                                    </div>
                                )}
                                {showModal && (
                                    <div
                                        className="modal fade show"
                                        style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
                                        tabIndex="-1"
                                    >
                                        <div className="modal-dialog">
                                            <div className={`modal-content ${isError ? 'bg-danger text-white' : ''}`}>
                                                <div className="modal-header">
                                                    <h5 className="modal-title">{isError ?
                                                        'No se ha enviado ninguna respuesta' : 'Respuesta recibida'}</h5>
                                                    <button
                                                        type="button"
                                                        className="btn-close"
                                                        onClick={() => setShowModal(false)}
                                                    ></button>
                                                </div>
                                                <div className="modal-body">
                                                    <p>{modalMessage}</p>
                                                </div>
                                                <div className="modal-footer">
                                                    <button
                                                        type="button"
                                                        className="btn btn-primary"
                                                        onClick={() => setShowModal(false)}
                                                    >
                                                        Cerrar
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}

                <button type="button" className="btn btn-danger" data-bs-toggle="modal" data-bs-target="#exampleModal">
                    Eliminar curso
                </button>

                <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h1 className="modal-title fs-5" id="exampleModalLabel">Eliminar curso {selectedCurso[0].Nombrecurso}</h1>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                si guarda los cambios se eliminara su progreso y notas que tenga en el curso ¿Desea continuar?
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                <button type="button" className="btn btn-primary" onClick={() => eliminar('exampleModal')}>Save changes</button>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    };

    export default DesarrollarCursos;

