import React, { useState, useEffect } from "react";
import cursosService from "../../services/cursosService";
import { useEmpleado } from '../../context/empleadoContext';
import { useCurso } from '../../context/cursoContext';

const CardCursos = () => {
    const [cursos, setCursos] = useState([]);
    const [cursosGeneral, setCursosGeneral] = useState([]);
    const [idcuremp, setIdcuremp] = useState([]);
    const { setActiveMenu } = useEmpleado();
    const { setSelectedCurso } = useCurso();

    useEffect(() => {
        cargarCursosEmpleado();
        cargarCursosGenerales();
        cargarIdCurEmp();
    }, []);

    const cargarCursosEmpleado = async () => {
        try {
            const response = await cursosService.getCursosEmpleado();
            console.log("Response from getCursosEmpleado:", response);
            setCursos(response);
        } catch (error) {
            console.error('Error al obtener los cursos:', error);
        }
    };

    const cargarCursosGenerales = async () => {
        try {
            const response = await cursosService.getCursos();
            console.log("Response from getCursos:", response);
            setCursosGeneral(response);
        } catch (error) {
            console.error('Error al obtener los cursos:', error);
        }
    };

    const cargarIdCurEmp = async () => {
        try {
            const response = await cursosService.getIdCurEmpp();
            console.log("Response from getIdCurEmpp:", response);
            setIdcuremp(response);
        } catch (error) {
            console.error('Error al obtener los cursos:', error);
        }
    };


    const inscribirse = async (Idcurso, modalId) => {
        try {
            const response = await cursosService.postCursoUsuarioEmpleado(Idcurso);
            if (response.ok) {
                alert("Inscripción realizada con éxito.");
                const modal = document.getElementById(modalId);
                if (modal) {
                    const modalInstance = bootstrap.Modal.getInstance(modal);
                    modalInstance.hide();
                }
                // Recargar los cursos y IDs relacionados
                await cargarCursosEmpleado();
                await cargarIdCurEmp();

                // Cerrar el modal manualmente
                
            } else {
                const errorData = await response.json();
                alert("Hubo un problema con la inscripción: " + errorData.message);
            }
        } catch (error) {
            console.error("Error al inscribirse:", error);
            alert("Hubo un error al intentar inscribirse.");
        }
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
        const cursoSeleccionado = cursos.find(c => c.Idcurso === curso.Idcurso);
        if (cursoSeleccionado) {
            setSelectedCurso([cursoSeleccionado, idcuremp]);
            setActiveMenu('Desarrollo curso');
        } else {
            alert("Curso no disponible en este momento. Por favor, recargue la página.");
        }
    }}
>
    Ingresar
</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* cursos */}
            <div><h2 className="mb-4">Cursos que te podrían interesar</h2></div>

            {/* tarjetas de los cursos */}
            <div className="row">
                {cursosGeneral.map((curso, index) => (
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
                                        data-bs-target={'#modalcurso' + index}
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
                                                    <button type="button" className="btn btn-success" onClick={() => inscribirse(curso.Idcurso, 'modalcurso' + index)}>Inscribirme</button>
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
