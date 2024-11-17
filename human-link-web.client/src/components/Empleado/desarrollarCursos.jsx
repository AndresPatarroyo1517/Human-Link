import React, { useEffect, useState } from 'react';
import { useCurso } from '../../context/cursoContext';
import { useEmpleado } from  '../../context/empleadoContext';
import './DesarrollarCursos.css';
import formService from '../../services/formService';

const DesarrollarCursos = () => {
    const apiKey = 'AIzaSyAdRZMAsJHz2KPzYbCr6QCDQI8-zAObpVU';
    const { selectedCurso } = useCurso();
    const { setActiveMenu } = useEmpleado();
    const [descripciones, setDescripciones] = useState([]);

    const obtenerVideoId = (url) => {
        const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|v\/|.+\?v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
        const match = url.match(regex);
        return match ? match[1] : null;
    };

        const [isQuizCompleted, setIsQuizCompleted] = useState(false);

        const obtenerVideoId = (url) => {
            const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|v\/|.+\?v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
            const match = url.match(regex);
            return match ? match[1] : null;
        };

        const handleQuizClick = () => {
            setIsQuizCompleted(true);
        };

        const handleCompleteQuiz = async () => {
            setIsQuizCompleted(false);

            const body = {
                idcuremp: 0,
                idusuario: 0,
                idcurso: selectedCurso.Idcurso,
                progreso: 0,
                notas: []
            };
            const response = await formService.putCargarNota(body);
        };

        useEffect(() => {
            const fetchDescriptions = async () => {
                const descriptions = await Promise.all(selectedCurso.Url.slice(1).map(async (url) => {
                    const videoId = obtenerVideoId(url);
                    if (videoId) {
                        const response = await fetch(`https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${apiKey}&part=snippet`);
                        const data = await response.json();
                        return data.items[0]?.snippet?.description || 'Descripci�n no disponible';
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
                <h2 className="mb-4">{selectedCurso.Nombrecurso}</h2>
                {selectedCurso.Url.slice(1).map((url, index) => (
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
                            </div>
                        </div>
                    </div>
                ))}

                <button type="button" class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#exampleModal">
                    Eliminar curso
                </button>

                <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h1 class="modal-title fs-5" id="exampleModalLabel">Eliminar curso {selectedCurso[0].Nombrecurso }</h1>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                                si guarda los cambios se eliminara su progreso y notas que tenga en el curso �Desea continuar?
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                <button type="button" class="btn btn-primary" onClick={() => eliminar('exampleModal') }>Save changes</button>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    };

    export default DesarrollarCursos;

