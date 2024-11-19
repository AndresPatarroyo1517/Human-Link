
import React, { useState, useEffect } from "react";
import usuariosService from "../../services/usuariosService";
import empleadosService from "../../services/empleadosService";
import nominasService from "../../services/nominaService";
import { InformePerso } from '../Informes/informePerso'
import { fetchNominaPerso } from '../../services/pdfService.jsx';

const UserManagementTable = () => {

    // Estados para gestión de usuarios, empleados y nóminas
    const [usuarios, setUsuarios] = useState([]);
    const [empleadosDisponibles, setEmpleadosDisponibles] = useState([]);
    const [selectedUsuario, setSelectedUsuario] = useState(null);
    const [selectedEmpleado, setSelectedEmpleado] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    


    // Estados para manejo de nómina
    const [nomina, setNomina] = useState({
        Empleado: '',
        HorasExtra: 0,
        Bonificacion: 0
    });
    const initialNominaState = { horasExtra: '', bonificacion: '' };
    const [formDataNomina, setFormDataNomina] = useState(initialNominaState);
    const [showNegativeWarning, setShowNegativeWarning] = useState(false);
    const [tempNominaData, setTempNominaData] = useState(null);
    const [confirmNegativeValues, setConfirmNegativeValues] = useState(false);

    const [newEmpleado, setNewEmpleado] = useState({
        idempleado: "",
        nombre: "",
        cargo: "",
        salario: "",
        departamento: "",
        fechaInicio: "",
        fechaFin: ""
    });

    // Carga inicial de datos
    useEffect(() => {
        loadUsuarios();
        loadEmpleadosDisponibles();
    }, []);

    // Métodos de carga de datos
    const loadUsuarios = async () => {
        try {
            const data = await usuariosService.getUsuarios();
            setUsuarios(data);
        } catch (error) {
            console.error("Error al cargar usuarios:", error);
        }
    };

    const loadEmpleadosDisponibles = async () => {
        try {
            const empleados = await empleadosService.getEmpleados();
            const disponibles = empleados.filter(empleado => empleado.idusuario != 0);
            setEmpleadosDisponibles(disponibles);
        } catch (error) {
            console.error("Error al cargar empleados disponibles:", error);
        }
    };

    // Métodos de manejo de cambios en formularios
    const handleInputChangeEmpleado = (e) => {
        const { name, value } = e.target;
        setNewEmpleado(prev => ({ ...prev, [name]: value }));
    };

    // Método para agregar empleado con validaciones
    const handleAddEmpleado = async () => {
        try {
            // Validaciones
            const requiredFields = ['nombre', 'cargo', 'salario', 'departamento', 'fechaInicio'];
            const missingFields = requiredFields.filter(field => !newEmpleado[field]);

            if (missingFields.length > 0) {
                alert(`Por favor complete los siguientes campos: ${missingFields.join(', ')}`);
                return;
            }

            // Generación de ID, correo y contraseña
            const id = await generarIdEmpleado(newEmpleado.idempleado);
            const nombres = newEmpleado.nombre.split(" ");
            const primerNombre = nombres[0];
            const segundoNombre = nombres[1] || "human";
            const randomNumbers = Math.floor(100 + Math.random() * 900);

            const correo = `${primerNombre.toLowerCase()}.${segundoNombre.toLowerCase()}@example.com`;
            const clave = `clave${primerNombre}${randomNumbers}`;

            // Preparación de datos para registro
            const empleadoToAdd = {
                Idempleado: id,
                Nombre: newEmpleado.nombre,
                Cargo: newEmpleado.cargo,
                Salario: newEmpleado.salario,
                Departamento: newEmpleado.departamento,
                Fechacontratacion: newEmpleado.fechaInicio,
                Fechaterminacioncontrato: newEmpleado.fechaFin || null,
                EmpleadoUsuario: id
            };

            const usuarioToAdd = {
                Idusuario: id,
                Usuario1: `${primerNombre.toLowerCase()}${randomNumbers}`, // Valor único.
                Correo: correo, // Correo válido generado.
                Isadmin: false, // Según tu lógica.
                Isemailverified: false,
                Clave: clave, // Genera una clave válida.
                Cursousuarios: [], // Array vacío si no hay cursos.
                Empleados: [] // Array vacío si no hay empleados.
            };

            const nominaToAdd = {
                Idnomina: id,
                Bonificacion: 0,
                Horasextra: 0,
                Totalnomina: newEmpleado.salario,
                Idempleado: id
            };

            // Mostrar lo que se insentará
            console.log(empleadoToAdd);
            console.log(usuarioToAdd);
            console.log(nominaToAdd);

            // Registro en servicios
            try {
                // Agregar el usuario
                await usuariosService.addUsuario(usuarioToAdd);

                // Verificar que el usuario se agregó correctamente
                const usuarios = await usuariosService.getUsuarios();
                console.log("Usuarios actualizados:", usuarios);

                // Agregar el empleado
                await empleadosService.addEmpleado(empleadoToAdd);

                // Verificar que el empleado se agregó correctamente
                const empleados = await empleadosService.getEmpleados();
                console.log("Empleados actualizados:", empleados);

                // Agregar la nómina
                await nominasService.addNomina(nominaToAdd);

                console.log("Registros agregados correctamente.");
            } catch (error) {
                console.error("Error al agregar los registros:", error);
            }

            // Actualización de estados
            await loadUsuarios();
            await loadEmpleadosDisponibles();

            // Reseteo de formulario
            setNewEmpleado({
                idempleado: "",
                nombre: "",
                cargo: "",
                salario: "",
                departamento: "",
                fechaInicio: "",
                fechaFin: ""
            });

            alert("Usuario y empleado creados exitosamente");

        } catch (error) {
            console.error("Error al agregar el usuario:", error);
            alert(`Error al crear el usuario: ${error.message}`);
        }
    };

    // Método para verificar y/o generar un ID único para empleado
    const generarIdEmpleado = async (idPropuesto) => {
        try {
            // Obtén todos los empleados
            const empleados = await empleadosService.getEmpleados();
            const idsExistentes = empleados.map(emp => emp.Idempleado);

            if (idPropuesto && !idsExistentes.includes(idPropuesto)) {
                return idPropuesto; // Si el ID propuesto no existe, úsalo
            }

            // Si el ID propuesto ya existe o no se proporciona, genera uno nuevo
            const maxId = Math.max(0, ...idsExistentes); // Obtén el máximo ID existente
            return maxId + 1; // Devuelve el siguiente ID disponible
        } catch (error) {
            console.error("Error al generar/verificar ID único:", error);
            throw new Error("No se pudo generar/verificar el ID.");
        }
    };

    const handleDeleteEmpleado = async (empleadoId) => {
        try {
            // Obtener la información del empleado para tener acceso a los IDs relacionados
            const empleado = await empleadosService.getEmpleado(empleadoId);
            if (!empleado) {
                alert("No se encontró el empleado a eliminar");
                return;
            }

            // 1. Eliminar la nómina primero
            try {
                await nominasService.deleteNomina(empleadoId);
                console.log("Nómina eliminada correctamente");
            } catch (error) {
                console.error("Error al eliminar la nómina:", error);
                throw error;
            }

            // 2. Eliminar el empleado
            try {
                await empleadosService.deleteEmpleado(empleadoId);
                console.log("Empleado eliminado correctamente");
            } catch (error) {
                console.error("Error al eliminar el empleado:", error);
                throw error;
            }

            // 3. Eliminar el usuario asociado
            try {
                await usuariosService.deleteUsuario(empleado.EmpleadoUsuario);
                console.log("Usuario eliminado correctamente");
            } catch (error) {
                console.error("Error al eliminar el usuario:", error);
                throw error;
            }

            

            // Actualizar la lista de empleados
            await loadEmpleadosDisponibles();
            await loadUsuarios();

            alert("Empleado eliminado exitosamente");
        } catch (error) {
            console.error("Error en el proceso de eliminación:", error);
            alert(`Error al eliminar el empleado: ${error.message}`);
        }
    };

    const handleEditEmpleado = async () => {
        try {
            // Verificar si hay un empleado seleccionado
            if (!selectedEmpleado) {
                alert("No hay empleado seleccionado para editar");
                return;
            }

            // Obtener los datos actuales del empleado y usuario para mantener los valores que no se editen
            const empleadoActual = await empleadosService.getEmpleado(selectedEmpleado.Idempleado);
            const usuarioActual = await usuariosService.getUsuario(empleadoActual.EmpleadoUsuario);

            if (!empleadoActual || !usuarioActual) {
                alert("El empleado o usuario seleccionado no existe en el sistema.");
                return;
            }

            // Crear el objeto del empleado actualizado
            const empleadoToUpdate = {
                Idempleado: empleadoActual.Idempleado,
                Nombre: selectedEmpleado.Nombre || empleadoActual.Nombre,
                Cargo: selectedEmpleado.Cargo || empleadoActual.Cargo,
                Salario: selectedEmpleado.Salario || empleadoActual.Salario,
                Departamento: selectedEmpleado.Departamento || empleadoActual.Departamento,
                Fechacontratacion: selectedEmpleado.Fechacontratacion || empleadoActual.Fechacontratacion,
                Fechaterminacioncontrato: selectedEmpleado.Fechaterminacioncontrato || empleadoActual.Fechaterminacioncontrato,
                EmpleadoUsuario: empleadoActual.EmpleadoUsuario
            };

            // Crear el objeto del usuario actualizado
            const usuarioToUpdate = {
                Idusuario: empleadoActual.EmpleadoUsuario,
                Usuario1: selectedUsuario.Usuario1 || usuarioActual.Usuario1, // Actualizar nombre de usuario si se modifica el nombre
                Correo: selectedUsuario.Correo || usuarioActual.Correo, // Actualizar correo si se proporciona uno nuevo
                Clave: usuarioActual.Clave, // La contraseña permanece igual  
            };

            // Mostrar lo que se insentará
            console.log("Empleado a actualizar:", empleadoToUpdate);
            console.log("Usuario a actualizar:", usuarioToUpdate);

            // Actualizar empleado y usuario
            await empleadosService.updateEmpleado(empleadoToUpdate.Idempleado, empleadoToUpdate);
            await usuariosService.updateUsuario(usuarioToUpdate.Idusuario, usuarioToUpdate);

            // Resetear el formulario y recargar datos
            setSelectedEmpleado(null);
            await loadEmpleadosDisponibles();
            await loadUsuarios();

            alert("Empleado y usuario actualizados exitosamente");

        } catch (error) {
            console.error("Error al editar el empleado o usuario:", error);
            alert(`Error al editar el empleado o usuario: ${error.message}`);
        }
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
            console.log('entro bonificacion')
        }

        // Si se ha modificado algún valor, recalculamos el total de la nómina
        updatedNomina.Idnomina = nomina.IdNomina;

        const salarioBase = nomina.SalarioBase || 0;

        // Calculamos el Totalnomina directamente aquí y lo redondeamos
        updatedNomina.Totalnomina = salarioBase +
            ((updatedNomina.Horasextra || 0) * (salarioBase / 30 / 8) * 1.25) +  // Valor de las horas extra
            (updatedNomina.Bonificacion || 0);  // Sumamos la bonificación

        // Redondeamos Totalnomina (puedes redondear a 2 decimales si es necesario)
        updatedNomina.Totalnomina = Math.round(updatedNomina.Totalnomina);  // Redondeo a entero
        // Si prefieres redondear a 2 decimales, usa:
        // updatedNomina.Totalnomina = parseFloat(updatedNomina.Totalnomina.toFixed(2));

        console.log(updatedNomina);
        nominasService.updateNominaEmpleado(updatedNomina, nomina.IdNomina);
    };

    // Reinicia el formulario y estados relacionados
    const resetForm = () => {
        setFormDataNomina(initialNominaState);
        setTempNominaData(null);
        setConfirmNegativeValues(false);
    };

    // Componente de advertencia (se puede extraer a un componente separado)
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
            <button
                type="button"
                className="btn btn-success mb-4"
                data-bs-toggle="modal"
                data-bs-target="#addEmpleadoModal"
            >
                <i className="bi bi-plus-circle"></i> Registrar un nuevo empleado
            </button>

            <input
                type="text"
                className="form-control mb-3"
                placeholder="Buscar usuario..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />

            <div className="table-responsive">
                <table className="table table-striped table-bordered">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Cargo</th>
                            <th>Salario</th>
                            <th>Departamento</th>
                            <th>Inicio de contrato</th>
                            <th>Fin de contrato</th>
                            <th>User</th>
                            <th>Correo</th>
                            <th>Acciones</th>
                            <th>Reportes</th>
                        </tr>
                    </thead>
                    <tbody>
                        {usuarios && usuarios.length > 0 ? (
                            usuarios.map((usuario) => {
                                const empleado = empleadosDisponibles.find(
                                    (empleado) => empleado.EmpleadoUsuario === usuario.Idusuario
                                );
                                if (!empleado) return null; // Si no hay empleado relacionado, no renderizar

                                const search = searchTerm.toLowerCase();
                                const nombreUsuario = usuario.Usuario1?.toLowerCase() || '';
                                const correoUsuario = usuario.Correo?.toLowerCase() || '';
                                const nombreEmpleado = empleado.Nombre.toLowerCase();
                                const cargoEmpleado = empleado.Cargo.toLowerCase();
                                const salarioEmpleado = empleado.Salario.toString();
                                const departamentoEmpleado = empleado.Departamento.toLowerCase();
                                const inicioContrato = empleado.Fechacontratacion || 'indefinido';
                                const finContrato = empleado.Fechaterminacioncontrato || 'indefinido';

                                // Filtrar los resultados
                                if (
                                    nombreUsuario.includes(search) ||
                                    correoUsuario.includes(search) ||
                                    nombreEmpleado.includes(search) ||
                                    cargoEmpleado.includes(search) ||
                                    salarioEmpleado.includes(search) ||
                                    departamentoEmpleado.includes(search) ||
                                    inicioContrato.toLowerCase().includes(search) ||
                                    finContrato.toLowerCase().includes(search)
                                ) {
                                    return (
                                        <tr key={`${usuario.Idusuario}-${empleado.Idempleado}`}>
                                            <td>{empleado.Idempleado}</td>
                                            <td>{empleado.Nombre}</td>
                                            <td>{empleado.Cargo}</td>
                                            <td>{empleado.Salario}</td>
                                            <td>{empleado.Departamento}</td>
                                            <td>{inicioContrato}</td>
                                            <td>{finContrato}</td>
                                            <td>{usuario.Usuario1}</td>
                                            <td>{usuario.Correo}</td>
                                            <td>
                                                <button
                                                    className="btn btn-primary me-2"
                                                    data-bs-toggle="modal"
                                                    data-bs-target="#editEmpleadoModal"
                                                    onClick={() => {
                                                        setSelectedEmpleado(empleado);
                                                        setSelectedUsuario(usuario);
                                                    }}
                                                >
                                                    Editar
                                                </button>
                                                <button
                                                    className="btn btn-danger me-2"
                                                    data-bs-toggle="modal"
                                                    data-bs-target="#deleteEmpleadoModal"
                                                    onClick={() => {
                                                        setSelectedEmpleado({
                                                            ...empleado,
                                                            Usuario: usuario
                                                        });
                                                    }}
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
                                                <InformePerso
                                                    id={usuario.Idusuario} />
                                            </td>
                                        </tr>
                                    );
                                }

                                return null;
                            })
                        ) : (
                            <tr>
                                <td colSpan="11">No hay usuarios disponibles</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        
            {/* Modal de agregar empleado */}
            <div className="modal fade" id="addEmpleadoModal" tabIndex="-1" aria-labelledby="addEmpleadoModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="addEmpleadoModalLabel">Añadir Empleado</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form>
                                <div className="mb-3">
                                    <label htmlFor="idempleado" className="col-form-label">ID de Empleado:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="idempleado"
                                        name="idempleado"
                                        value={newEmpleado.idempleado}
                                        onChange={handleInputChangeEmpleado}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="nombre" className="col-form-label">Nombre Completo:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="nombre"
                                        name="nombre"
                                        value={newEmpleado.nombre}
                                        onChange={handleInputChangeEmpleado}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="cargo" className="col-form-label">Cargo:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="cargo"
                                        name="cargo"
                                        value={newEmpleado.cargo}
                                        onChange={handleInputChangeEmpleado}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="departamento" className="col-form-label">Departamento:</label>
                                    <select
                                        className="form-control"
                                        id="departamento"
                                        name="departamento"
                                        value={newEmpleado.departamento}
                                        onChange={handleInputChangeEmpleado}
                                    >
                                        <option value="">--Selecciona un Departamento--</option>
                                        <option value="IT">IT</option>
                                        <option value="Finanzas">Finanzas</option>
                                        <option value="Recursos Humanos">Recursos Humanos</option>
                                        <option value="Tecnologia">Tecnología</option>
                                        <option value="Marketing">Marketing</option>
                                        <option value="Administracion">Administración</option>
                                        <option value="Operaciones">Operaciones</option>
                                        <option value="Ventas">Ventas</option>
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="salario" className="col-form-label">Salario:</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        id="salario"
                                        name="salario"
                                        value={newEmpleado.salario}
                                        onChange={handleInputChangeEmpleado}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="fechaInicio" className="col-form-label">Fecha de Contratación:</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        id="fechaInicio"
                                        name="fechaInicio"
                                        value={newEmpleado.fechaInicio}
                                        onChange={handleInputChangeEmpleado}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="fechaFin" className="col-form-label">Fecha de Terminación de Contrato:</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        id="fechaFin"
                                        name="fechaFin"
                                        value={newEmpleado.fechaFin}
                                        onChange={handleInputChangeEmpleado}
                                    />
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-danger" data-bs-dismiss="modal">Cancelar</button>
                            <button type="button" className="btn btn-success" data-bs-dismiss="modal" onClick={handleAddEmpleado}>Guardar Empleado</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal de edición Empleado */}
            <div className="modal fade" id="editEmpleadoModal" tabIndex="-1" aria-labelledby="editEmpleadoModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="editEmpleadoModalLabel">Editar Empleado y Usuario</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form>
                                {/* Campo para el nombre del empleado */}
                                <div className="mb-3">
                                    <label htmlFor="Nombre" className="col-form-label">Nombre:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="Nombre"
                                        name="Nombre"
                                        value={selectedEmpleado?.Nombre || ""}
                                        onChange={(e) => setSelectedEmpleado({ ...selectedEmpleado, Nombre: e.target.value })}
                                    />
                                </div>

                                {/* Campo para el cargo del empleado */}
                                <div className="mb-3">
                                    <label htmlFor="Cargo" className="col-form-label">Cargo:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="Cargo"
                                        name="Cargo"
                                        value={selectedEmpleado?.Cargo || ""}
                                        onChange={(e) => setSelectedEmpleado({ ...selectedEmpleado, Cargo: e.target.value })}
                                    />
                                </div>

                                {/* Campo para el salario del empleado */}
                                <div className="mb-3">
                                    <label htmlFor="Salario" className="col-form-label">Salario:</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        id="Salario"
                                        name="Salario"
                                        value={selectedEmpleado?.Salario || ""}
                                        onChange={(e) => setSelectedEmpleado({ ...selectedEmpleado, Salario: e.target.value })}
                                    />
                                </div>

                                {/* Campo para el departamento del empleado */}
                                <div className="mb-3">
                                    <label htmlFor="Departamento" className="col-form-label">Departamento:</label>
                                    <select
                                        className="form-control"
                                        id="Departamento"
                                        name="Departamento"
                                        value={selectedEmpleado?.Departamento || ""}
                                        onChange={(e) =>
                                            setSelectedEmpleado({ ...selectedEmpleado, Departamento: e.target.value })
                                        }
                                    >
                                        <option value="">--Selecciona un Departamento--</option>
                                        <option value="IT">IT</option>
                                        <option value="Finanzas">Finanzas</option>
                                        <option value="Recursos Humanos">Recursos Humanos</option>
                                        <option value="Tecnologia">Tecnología</option>
                                        <option value="Marketing">Marketing</option>
                                        <option value="Administracion">Administración</option>
                                        <option value="Operaciones">Operaciones</option>
                                        <option value="Ventas">Ventas</option>
                                    </select>
                                </div>

                                {/* Campo para la fecha de contratación del empleado */}
                                <div className="mb-3">
                                    <label htmlFor="fechaContratacion" className="col-form-label">Fecha de Contratación:</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        id="fechaContratacion"
                                        name="fechaContratacion"
                                        value={selectedEmpleado?.Fechacontratacion || ""}
                                        onChange={(e) => setSelectedEmpleado({ ...selectedEmpleado, Fechacontratacion: e.target.value })}
                                    />
                                </div>

                                {/* Campo para la fecha de terminación de contrato del empleado */}
                                <div className="mb-3">
                                    <label htmlFor="fechaTerminacion" className="col-form-label">Fecha de Terminación de Contrato:</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        id="fechaTerminacion"
                                        name="fechaTerminacion"
                                        value={selectedEmpleado?.Fechaterminacioncontrato || ""}
                                        onChange={(e) => setSelectedEmpleado({ ...selectedEmpleado, Fechaterminacioncontrato: e.target.value })}
                                    />
                                </div>

                                {/* Campo para el nombre del usuario */}
                                <div className="mb-3">
                                    <label htmlFor="nombreUsuario" className="col-form-label">Nombre de Usuario:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="nombreUsuario"
                                        name="nombreUsuario"
                                        value={selectedUsuario?.Usuario1 || ""}
                                        onChange={(e) => setSelectedUsuario({ ...selectedUsuario, Usuario1: e.target.value })}
                                    />
                                </div>

                                {/* Campo para el correo del usuario */}
                                <div className="mb-3">
                                    <label htmlFor="correoUsuario" className="col-form-label">Correo:</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        id="correoUsuario"
                                        name="correoUsuario"
                                        value={selectedUsuario?.Correo || ""}
                                        onChange={(e) => setSelectedUsuario({ ...selectedUsuario, Correo: e.target.value })}
                                    />
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-danger" data-bs-dismiss="modal">Cancelar</button>
                            <button type="button" className="btn btn-success" data-bs-dismiss="modal" onClick={handleEditEmpleado}>Actualizar Empleado y Usuario</button>
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

            {/* Modal de advertencia para eliminar empleado */}
            <div className="modal fade" id="deleteEmpleadoModal" tabIndex="-1" aria-labelledby="deleteEmpleadoModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="deleteEmpleadoModalLabel">Confirmar Eliminación</h1>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            ></button>
                        </div>
                        <div className="modal-body">
                            <p>¿Está seguro que desea eliminar al empleado {selectedEmpleado?.Nombre}?</p>
                            <p className="text-danger">Esta acción eliminará toda la información asociada al empleado y no se puede deshacer.</p>
                        </div>
                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                data-bs-dismiss="modal"
                            >
                                Cancelar
                            </button>
                            <button
                                type="button"
                                className="btn btn-danger"
                                data-bs-dismiss="modal"
                                onClick={() => handleDeleteEmpleado(selectedEmpleado?.Idempleado)}
                            >
                                Eliminar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default UserManagementTable;