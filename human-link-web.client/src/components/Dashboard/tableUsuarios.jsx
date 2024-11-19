import React, { useState, useEffect } from "react"
import usuariosService from "../../services/usuariosService"
import empleadosService from "../../services/empleadosService"
import { InformePerso } from '../Informes/informePerso'
import { fetchNominaPerso } from '../../services/pdfService.jsx'; 
import NominaService from '../../services/nominaService'; 

const UserManagementTable = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [empleadosDisponibles, setEmpleadosDisponibles] = useState([]); // Empleados disponibles
    const [newUsuario, setNewUsuario] = useState({
        idusuario: "",
        usuario1: "",
        correo: "",
        clave: "",
        idempleado: ""
    });
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedUsuario, setSelectedUsuario] = useState(null);
    const [nomina, setNomina] = useState([]);


    useEffect(() => {
        loadUsuarios();
        loadEmpleadosDisponibles(); // Cargar empleados disponibles al cargar el componente
    }, []);

    const loadUsuarios = async () => {
        try {
            const data = await usuariosService.getUsuarios();
            console.log("Usuarios cargados:", data);
            setUsuarios(data);
        } catch (error) {
            console.error("Error al cargar usuarios:", error);
        }
    };

    const loadEmpleadosDisponibles = async () => {
        try {
            const empleados = await empleadosService.getEmpleados(); // Obtener todos los empleados
            // Filtramos los empleados que no tienen un usuario asignado
            const empleadosConUsuarioDisponible = empleados.filter(empleado => empleado.EmpleadoUsuario === 0);
            setEmpleadosDisponibles(empleadosConUsuarioDisponible); // Establecer los empleados disponibles en el estado
        } catch (error) {
            console.error("Error al cargar empleados disponibles:", error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewUsuario({ ...newUsuario, [name]: value });
    };

    const handleAddUsuario = async () => {
        try {
            // Validaciones básicas
            if (!newUsuario.usuario1 || !newUsuario.correo || !newUsuario.clave) {
                alert("Por favor complete todos los campos requeridos");
                return;
            }

            // Crear el usuario
            const usuarioToAdd = {
                Usuario1: newUsuario.usuario1,
                Correo: newUsuario.correo,
                Clave: newUsuario.clave,
                Isadmin: false,
                Isemailverified: false
            };

            // Agregar el usuario
            const addedUsuario = await usuariosService.addUsuario(usuarioToAdd);

            if (addedUsuario && newUsuario.idempleado) {
                // Buscar el empleado en la lista de disponibles
                const empleadoToUpdate = empleadosDisponibles.find(
                    emp => emp.Idempleado.toString() === newUsuario.idempleado
                );

                if (empleadoToUpdate) {
                    // Actualizar el empleado con el ID del usuario nuevo
                    const empleadoActualizado = {
                        ...empleadoToUpdate,
                        EmpleadoUsuario: addedUsuario.Idusuario
                    };

                    // Llamar al servicio de actualización de empleado
                    await empleadosService.updateEmpleado(
                        empleadoToUpdate.Idempleado,
                        empleadoActualizado
                    );

                    // Actualizar la lista de empleados disponibles
                    await loadEmpleadosDisponibles();
                }
            }

            // Actualizar la lista de usuarios
            await loadUsuarios();

            // Limpiar el formulario
            setNewUsuario({
                idusuario: "",
                usuario1: "",
                correo: "",
                clave: "",
                idempleado: ""
            });

            // Opcional: Mostrar mensaje de éxito
            alert("Usuario creado exitosamente");

        } catch (error) {
            console.error("Error al agregar el usuario:", error);
            alert("Error al crear el usuario: " + error.message);
        }
    };

    const handleDeleteUsuario = async (id) => {
        try {
            await usuariosService.deleteUsuario(id);
            setUsuarios((prevUsuarios) => prevUsuarios.filter(usuario => usuario.Idusuario !== id));
        } catch (error) {
            console.error("Error al eliminar usuario:", error);
        }
    };

    const handleEditUsuario = async () => {
        try {
            if (!selectedUsuario) {
                console.error("No hay usuario seleccionado para actualizar");
                return;
            }

            // Asegurarse de que todos los campos necesarios estén presentes
            const usuarioToUpdate = {
                Idusuario: selectedUsuario.Idusuario,
                Usuario1: selectedUsuario.Usuario1,
                Correo: selectedUsuario.Correo,
                Clave: selectedUsuario.Clave,
                Isadmin: selectedUsuario.Isadmin || false,
                Isemailverified: selectedUsuario.Isemailverified || false
            };

            console.log("Enviando actualización:", usuarioToUpdate);

            const updatedUsuario = await usuariosService.updateUsuario(
                selectedUsuario.Idusuario,
                usuarioToUpdate
            );

            // Actualizar el estado local solo si la actualización fue exitosa
            setUsuarios(prevUsuarios =>
                prevUsuarios.map(usuario =>
                    usuario.Idusuario === selectedUsuario.Idusuario
                        ? { ...usuario, ...usuarioToUpdate }
                        : usuario
                )
            );

            // Cerrar el modal y limpiar el estado
            setSelectedUsuario(null);

            // Recargar los datos para asegurar sincronización con el backend
            await loadUsuarios();

        } catch (error) {
            console.error("Error al actualizar el usuario:", error);
            // Aquí deberías mostrar un mensaje de error al usuario
            alert("Error al actualizar el usuario: " + error.message);
        }
    };

    const openEditModal = (usuario) => {
        setSelectedUsuario(usuario); // Establecer el usuario seleccionado
    };

    const openEditNominaModal = async (usuario) => {
        resetForm()
        setSelectedUsuario(usuario); // Actualizamos el estado con el usuario seleccionado
        try {
            // Usamos usuario.Idusuario directamente
            const nominaData = await fetchNominaPerso(usuario.Idusuario);

            // Verificamos si la respuesta tiene las claves que esperamos
            if (nominaData && nominaData.Empleado) {
                setNomina(nominaData); // Actualizamos el estado de nomina con los datos obtenidos
                console.log(nominaData); // Mostramos los datos obtenidos en la consola
            } else {
                console.log('Error al traer los datos o no se encontraron registros de nómina');
                setNomina([]); // Limpiamos el estado de nomina si no hay datos válidos
            }
        } catch (error) {
            console.error("Error al obtener la nómina:", error);
            setNomina([]); // Limpiamos los datos en caso de error
        }
    };

    const initialNominaState = { horasExtra: '', bonificacion: '' };

    const [formDataNomina, setFormDataNomina] = useState(initialNominaState);
    const [showNegativeWarning, setShowNegativeWarning] = useState(false);
    const [showOvertimeWarning, setShowOvertimeWarning] = useState(false);
    const [tempNominaData, setTempNominaData] = useState(null);
    const [confirmNegativeValues, setConfirmNegativeValues] = useState(false);

    const handleChangeEditNomina = (event) => {
        const { name, value } = event.target;
        setFormDataNomina(prevState => ({
            ...prevState,
            [name]: parseInt(value, 10) || 0 // Asegura valores numéricos
        }));
    };

    const handleUpdateNomina = (formDataNomina, nomina) => {
        console.log(nomina)
        if ((formDataNomina.horasExtra < 0 || formDataNomina.bonificacion < 0) && !confirmNegativeValues) {
            setTempNominaData(nominaData);
            setShowNegativeWarning(true);
            return;
        }
        handleConfirmNegative(formDataNomina, nomina);
    };

    const handleConfirmNegative = (formDataNomina, nomina) => {
        setShowNegativeWarning(false);  // Cierra la advertencia
console.log('entro principal')
        // Comprobamos si las horas extra superan las 48 horas
        const extraTotal = formDataNomina.horasExtra + nomina.HorasExtra;
        if (extraTotal > 48) {
            alert('Las Horas extra no pueden superar las 48 horas, revisa tus datos y vuelve a intentar');
            return;  // Si las horas extra exceden el límite, salimos de la función
        }

        // Creamos el objeto `updatedNomina` para enviar solo los campos modificados
        const updatedNomina = {};

        // Si las horas extra son diferentes a 0 o a lo que estaba antes, las agregamos al objeto
        if (formDataNomina.horasExtra !== "") {
            updatedNomina.Horasextra = formDataNomina.horasExtra + nomina.HorasExtra;  // Sumamos las horas extra
            console.log('entro horas')
        }

        // Si la bonificación es diferente de 0, la agregamos al objeto
        if (formDataNomina.Bonificacion !== "") {
            updatedNomina.Bonificacion = formDataNomina.bonificacion + nomina.Bonificacion;  // Sumamos la bonificación
            console.log('rntro bonificacion')
        }

        // Si se ha modificado algún valor, recalculamos el total de la nómina
        updatedNomina.Idnomina = nomina.IdNomina;
        
            const salarioBase = nomina.SalarioBase || 0;

            // Calculamos el Totalnomina directamente aquí
            updatedNomina.Totalnomina = salarioBase +
                ((updatedNomina.Horasextra || 0) * (salarioBase / 30 / 8) * 1.25) +  // Valor de las horas extra
                (updatedNomina.Bonificacion || 0);  // Sumamos la bonificación
            console.log(updatedNomina)
            NominaService.updateNominaEmpleado(updatedNomina, nomina.IdNomina);
        

    };

    // Reinicia el formulario y estados relacionados
    const resetForm = () => {
        setFormDataNomina(initialNominaState);
        setTempNominaData(null);
        setConfirmNegativeValues(false);
    };

    const WarningModal = ({ title, message, onConfirm, onCancel }) => (
        <div className="modal fade show" style={{ display: "block" }} tabIndex="-1" role="dialog">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">{title}</h5>
                        <button type="button" className="btn-close" onClick={onCancel}></button>
                    </div>
                    <div className="modal-body">{message}</div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancelar</button>
                        <button type="button" className="btn btn-primary" onClick={onConfirm}>Confirmar</button>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <>
            <button type="button" className="btn btn-success mb-4" data-bs-toggle="modal" data-bs-target="#addUserModal">
                <i className="bi bi-plus-circle"></i> Añadir Usuario
            </button>

            <input
                type="text"
                className="form-control mb-3"
                placeholder="Buscar usuario..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />

            <table className="table table-striped table-bordered">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre de Usuario</th>
                        <th>Correo</th>
                        <th>Acciones</th>
                        <th>Reportes</th>
                    </tr>
                </thead>
                <tbody>
                    {usuarios && usuarios.length > 0 ? (
                        usuarios
                            .filter((usuario) => {
                                const nombreUsuario = usuario.Usuario1 ? usuario.Usuario1.toLowerCase() : '';
                                const correoUsuario = usuario.Correo ? usuario.Correo.toLowerCase() : '';
                                const search = searchTerm.toLowerCase();

                                return nombreUsuario.includes(search) || correoUsuario.includes(search);
                            })
                            .map((usuario) => (
                                <tr key={usuario.Idusuario}>
                                    <td>{usuario.Idusuario}</td>
                                    <td>{usuario.Usuario1}</td>
                                    <td>{usuario.Correo}</td>
                                    <td>
                                        <button
                                            className="btn btn-primary me-2"
                                            data-bs-toggle="modal"
                                            data-bs-target="#editUserModal"
                                            onClick={() => openEditModal(usuario)} 
                                        >
                                            Editar
                                        </button>
                                        <button
                                            className="btn btn-danger"
                                            onClick={() => handleDeleteUsuario(usuario.Idusuario)}
                                        >
                                            Eliminar
                                        </button>
                                        <button
                                            className="btn btn-primary"
                                            data-bs-toggle="modal"
                                            data-bs-target="#editNominaModal"
                                            onClick={() => openEditNominaModal(usuario)}>
                                            Editar nomina
                                        </button>
                                    </td>
                                    <td>
                                        <InformePerso id={usuario.Idusuario} />
                                    </td>
                                </tr>
                            ))
                    ) : (
                        <tr>
                            <td colSpan="4">No hay usuarios disponibles</td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* Modal de agregar usuario */}
            <div className="modal fade" id="addUserModal" tabIndex="-1" aria-labelledby="addUserModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="addUserModalLabel">Añadir Usuario</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form>
                                <div className="mb-3">
                                    <label htmlFor="idusuario" className="col-form-label">ID de Usuario:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="idusuario"
                                        name="idusuario"
                                        value={newUsuario.idusuario}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="usuario1" className="col-form-label">Nombre de Usuario:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="usuario1"
                                        name="usuario1"
                                        value={newUsuario.usuario1}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="correo" className="col-form-label">Correo:</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        id="correo"
                                        name="correo"
                                        value={newUsuario.correo}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="clave" className="col-form-label">Clave:</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        id="clave"
                                        name="clave"
                                        value={newUsuario.clave}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="idempleado" className="col-form-label">Seleccionar Empleado:</label>
                                    <select
                                        id="idempleado"
                                        name="idempleado"
                                        className="form-control"
                                        value={newUsuario.idempleado}
                                        onChange={handleInputChange}
                                    >
                                        <option value="">Seleccione un empleado</option>
                                        {empleadosDisponibles.length > 0 ? (
                                            empleadosDisponibles.map(empleado => (
                                                <option key={empleado.Idempleado} value={empleado.Idempleado}>
                                                    {empleado.Idempleado} - {empleado.Nombre}
                                                </option>
                                            ))
                                        ) : (
                                            <option>No hay empleados disponibles</option>
                                        )}
                                    </select>
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-danger" data-bs-dismiss="modal">Cancelar</button>
                            <button type="button" className="btn btn-success" data-bs-dismiss="modal" onClick={handleAddUsuario}>Guardar Usuario</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal de edición */}
            <div className="modal fade" id="editUserModal" tabIndex="-1" aria-labelledby="editUserModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="editUserModalLabel">Editar Usuario</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form>
                                <div className="mb-3">
                                    <label htmlFor="usuario1" className="col-form-label">Nombre de Usuario:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="usuario1"
                                        name="usuario1"
                                        value={selectedUsuario?.Usuario1 || ""}
                                        onChange={(e) => setSelectedUsuario({ ...selectedUsuario, Usuario1: e.target.value })}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="correo" className="col-form-label">Correo:</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        id="correo"
                                        name="correo"
                                        value={selectedUsuario?.Correo || ""}
                                        onChange={(e) => setSelectedUsuario({ ...selectedUsuario, Correo: e.target.value })}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="clave" className="col-form-label">Clave:</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        id="clave"
                                        name="clave"
                                        value={ ""}
                                        onChange={(e) => setSelectedUsuario({ ...selectedUsuario, Clave: e.target.value })}
                                    />
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-danger" data-bs-dismiss="modal">Cancelar</button>
                            <button type="button" className="btn btn-success" data-bs-dismiss="modal" onClick={handleEditUsuario}>Actualizar Usuario</button>
                        </div>
                    </div>
                </div>
            </div>

            {/*Modal de editar nomina*/}
            <div className="modal fade" id="editNominaModal" tabIndex="-1" aria-labelledby="editNominaModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="editNominaModalLabel">Empleado: {nomina.Empleado}</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form>
                                <div className="mb-3">
                                    <label htmlFor="horasExtraInput" className="form-label">Agregar horas extra:</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        id="horasExtraInput"
                                        name="horasExtra"
                                        value={formDataNomina.horasExtra}
                                        onChange={handleChangeEditNomina}
                                        aria-describedby="horasExtraHelp"
                                    />
                                    <div id="horasExtraHelp" className="form-text">
                                        Actualmente el empleado tiene {nomina.HorasExtra} horas extra.
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="bonificacionInput" className="form-label">Agregar bonificación:</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        id="bonificacionInput"
                                        name="bonificacion"
                                        value={formDataNomina.bonificacion}
                                        onChange={handleChangeEditNomina}
                                    />
                                    <div className="form-text">
                                        Actualmente el empleado tiene ${nomina.Bonificacion} en bonificaciones.
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                            <button type="button" className="btn btn-primary" onClick={() => handleUpdateNomina(formDataNomina, nomina)}>Agregar</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal de advertencia por valores negativos */}
            {showNegativeWarning && (
                <WarningModal
                    title="Advertencia"
                    message="Has ingresado valores negativos. ¿Deseas continuar?"
                    onConfirm={() => handleConfirmNegative(tempNominaData, nomina)}
                    onCancel={() => setShowNegativeWarning(false)}
                />
            )}
        </>
    );
};

export default UserManagementTable;