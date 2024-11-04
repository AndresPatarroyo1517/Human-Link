import { useEffect, useState } from "react";
import empleadosService from "../../services/empleadosService";

const TableEmpleados = () => {

    const [empleados, setEmpleados] = useState([]);

    const handleInputChange = (e) => {
        //setNewCurso({
        //    ...newCurso,
        //    [e.target.name]: e.target.value
        //});
    };

    const handleAddCurso = () => {
        //setCursos([...cursos, newCurso]);
        //setNewCurso({
        //    titulo: "",
        //    duracion: "",
        //    url: "",
        //    descripcion: ""
        //});
    };

    useEffect(() => {
        empleadosService.getEmpleados()
            .then(response => {
                setEmpleados(response);
                console.log(response);
            })
            .catch(error => {
                console.error('Error al obtener los empleados:', error);
            });
    }, []);

    return (
        <>
            {/* Botón Asignar curso */}
            <button type="button" className="btn btn-success mb-4" data-bs-toggle="modal" data-bs-target="#aniadirModal">
                <i className="bi bi-plus-circle"></i> Asignar curso
            </button>

            <table className="table table-striped mt-4">
                <thead>
                    <tr>
                        <th scope="col">Empleado</th>
                        <th scope="col">Cargo</th>
                        <th scope="col">Departamento</th>
                    </tr>
                </thead>
                <tbody>
                    {empleados.map((empleado, index) => (
                        <tr key={index}>
                            <td>{empleado.nombre}</td>
                            <td>{empleado.cargo}</td>
                            <td>{empleado.departamento}</td>
                        </tr>
                    ))}
                    
                    {/*<tr>*/}
                    {/*    <td>Documento 2</td>*/}
                    {/*    <td>3.5 MB</td>*/}
                    {/*    <td>15/02/2023</td>*/}
                    {/*</tr>*/}
                    {/*<tr>*/}
                    {/*    <td>Documento 3</td>*/}
                    {/*    <td>1.2 MB</td>*/}
                    {/*    <td>20/03/2023</td>*/}
                    {/*</tr>*/}
                    {/*<tr>*/}
                    {/*    <td>Documento 4</td>*/}
                    {/*    <td>4.8 MB</td>*/}
                    {/*    <td>05/04/2023</td>*/}
                    {/*</tr>*/}
                </tbody>
            </table>

            {/* Modal para asignar un curso */}
            <div className="modal fade" id="aniadirModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="exampleModalLabel">Asignar curso</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form>
                                <div className="mb-3">
                                    <label htmlFor="empleado" className="col-form-label">Empleado:</label>
                                    <input type="text" className="form-control" id="empleado" name="empleado" value={"c.valor"} onChange={handleInputChange} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="curso-buscador" className="col-form-label">Buscar curso:</label>
                                    <input type="text" className="form-control" id="curso-buscador" name="curso-buscador" value={"c.valor"} onChange={handleInputChange} />
                                    <button type="button" className="btn btn-primary">Buscar</button>
                                    {/*<textarea className="form-control" id="descripcion" name="descripcion" value={"c.valor"} onChange={handleInputChange}></textarea>*/}
                                </div>
                                <div className="mb-3">
                                    {/*<label htmlFor="curso" className="col-form-label"></label>*/}
                                    {/*<input type="text" className="form-control" id="curso" name="curso" value={"c.valor"} onChange={handleInputChange} />*/}
                                    <ul>
                                        <input type="radio" /><li>Python</li>
                                        <input type="radio" /><li>Finanzas</li>
                                    </ul>
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

        </>
    )
}

export default TableEmpleados;