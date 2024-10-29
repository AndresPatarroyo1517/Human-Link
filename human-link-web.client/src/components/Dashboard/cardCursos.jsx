import React, { useState } from "react";
import { useEffect } from "react";
import cursosService from "../../services/cursosService";

const CardCursos = () => {
    // Array inicial de cursos
    const [cursos, setCursos] = useState([
        {
            titulo: "Curso ReactJS - OpenBootcamp",
            duracion: 10,
            url: "https://i.ytimg.com/vi/xgfc6q5ieGQ/hqdefault.jpg",
            descripcion: "Aprenderás cómo crear componentes reutilizables y construir interfaces de usuario interactivas con React."
        },
        {
            titulo: "Curso Java Script - OpenBootcamp",
            duracion: 8,
            url: "https://i.ytimg.com/vi/8OwZHiQBGBA/hq720.jpg?sqp=-oaymwEXCK4FEIIDSFryq4qpAwkIARUAAIhCGAE=&rs=AOn4CLCckxnyKr0ptCRMd4VKgZMRAAKW6g",
            descripcion: "Con NodeJS podrás trabajar con JavaScript en el servidor y crear aplicaciones rápidas y escalables."
        }
    ]);

    useEffect(() => {
        cursosService.getCursos()
            .then(response => {
                setCursos(response);
            })
            .catch(error => {
                console.error('Error al obtener los cursos:', error);
            });
    }, []);

    const [newCurso, setNewCurso] = useState({
        titulo: "",
        duracion: "",
        url: "",
        descripcion: ""
    });

    const [selectedCurso, setSelectedCurso] = useState(null);

    const handleInputChange = (e) => {
        setNewCurso({
            ...newCurso,
            [e.target.name]: e.target.value
        });
    };

    const handleAddCurso = () => {
        setCursos([...cursos, newCurso]);
        setNewCurso({
            titulo: "",
            duracion: "",
            url: "",
            descripcion: ""
        });
    };

    return (
        <>
            {/* Botón Añadir curso */}
            <button type="button" className="btn btn-success mb-4" data-bs-toggle="modal" data-bs-target="#aniadirModal">
                <i className="bi bi-plus-circle"></i> Añadir curso
            </button>

            {/* Modal para añadir un nuevo curso */}
            <div className="modal fade" id="aniadirModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="exampleModalLabel">Crea un nuevo curso</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form>
                                <div className="mb-3">
                                    <label htmlFor="titulo" className="col-form-label">Título:</label>
                                    <input type="text" className="form-control" id="titulo" name="titulo" value={newCurso.titulo} onChange={handleInputChange} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="descripcion" className="col-form-label">Descripción:</label>
                                    <textarea className="form-control" id="descripcion" name="descripcion" value={newCurso.descripcion} onChange={handleInputChange}></textarea>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="duracion" className="col-form-label">Duración (Horas):</label>
                                    <input type="number" className="form-control" id="duracion" name="duracion" value={newCurso.duracion} onChange={handleInputChange} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="url" className="col-form-label">Url de la imagen:</label>
                                    <input type="text" className="form-control" id="url" name="url" value={newCurso.url} onChange={handleInputChange} />
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-danger" data-bs-dismiss="modal">Cancelar</button>
                            <button type="button" className="btn btn-success" data-bs-dismiss="modal" onClick={handleAddCurso}>Añadir</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* tarjetas de los cursos */}
            <div className="row">
                {cursos.map((curso, index) => (
                    <div key={index} className="col-md-4 mb-4">
                        <div className="card h-100">
                            <img src={curso.url[0]} className="card-img-top" alt={curso.nombrecurso} />
                            <div className="card-body">
                                <h5 className="card-title">{curso.nombrecurso}</h5>
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    data-bs-toggle="modal"
                                    data-bs-target="#infoModal"
                                    onClick={() => setSelectedCurso(curso)}
                                >
                                    Saber más
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* detalles del curso */}
            {selectedCurso && (
                <div className="modal fade" id="infoModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">{selectedCurso.titulo}</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                {selectedCurso.descripcion}
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default CardCursos;
