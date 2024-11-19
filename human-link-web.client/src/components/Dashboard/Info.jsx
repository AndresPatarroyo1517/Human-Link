import { useState, useEffect } from 'react';
import empleadosService from '../../services/empleadosService';
import usuariosService from '../../services/usuariosService';

const Info = () => {
    const [empleadoInfo, setEmpleadoInfo] = useState({});
    const [userInfo, setUserInfo] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({});

    useEffect(() => {
        empleadosService.getEmpleado()
            .then(response => setEmpleadoInfo(response))
            .catch(error => console.error('Error al obtener el empleado:', error));
    }, []);

    useEffect(() => {
        usuariosService.getUser()
            .then(response => {
                setUserInfo(response);
                setEditData({ ...response, Clave: "" }); // Clave en blanco al iniciar edición
            })
            .catch(error => console.error('Error al obtener el usuario:', error));
    }, []);

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSave = () => {
        const updatedData = {
            ...editData,
            Clave: editData.Clave === "" ? userInfo.Clave : editData.Clave,
        };
        usuariosService.updateUsuario(userInfo.IdUsuario, updatedData)
            .then(() => {
                setUserInfo(updatedData);
                setIsEditing(false);
            })
            .catch(error => console.error('Error al actualizar el usuario:', error));
    };

    return (
        <div className="container-fluid">
            <div className="row">
                {/* Cuadro izquierdo */}
                <div className="col-md-4 col-12">
                    <div className="card mb-4">
                        <div className="card-body">
                            <h5 className="card-title">Información General</h5>
                            <ul>
                                <li><strong>Nombre:</strong> {empleadoInfo.Nombre}</li>
                                <li><strong>Fecha de contratación:</strong> {empleadoInfo.Fechacontratacion}</li>
                                <li><strong>Departamento:</strong> {empleadoInfo.Departamento}</li>
                                <li><strong>Cargo:</strong> {empleadoInfo.Cargo}</li>
                            </ul>
                        </div>
                    </div>

                    {/* Información del usuario */}
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">Información del Usuario</h5>
                            {isEditing ? (
                                <div>
                                    <ul>
                                        <li>
                                            <strong>Username:</strong>
                                            <input
                                                type="text"
                                                name="Usuario1"
                                                value={editData.Usuario1 || ''}
                                                onChange={handleChange}
                                                className="form-control"
                                            />
                                        </li>
                                        <li>
                                            <strong>Email:</strong>
                                            <input
                                                type="email"
                                                name="Correo"
                                                value={editData.Correo || ''}
                                                onChange={handleChange}
                                                className="form-control"
                                            />
                                        </li>
                                        <li>
                                            <strong>Clave:</strong>
                                            <input
                                                type="password"
                                                name="Clave"
                                                value={editData.Clave || ''}
                                                onChange={handleChange}
                                                className="form-control"
                                                placeholder="Dejar en blanco para no cambiar"
                                            />
                                        </li>
                                    </ul>
                                    <button className="btn btn-success me-2" onClick={handleSave}>Guardar</button>
                                    <button className="btn btn-secondary" onClick={() => setIsEditing(false)}>Cancelar</button>
                                </div>
                            ) : (
                                <div>
                                    <ul>
                                        <li><strong>Username:</strong> {userInfo.Usuario1}</li>
                                        <li><strong>Email:</strong> {userInfo.Correo}</li>
                                    </ul>
                                    <button className="btn btn-primary" onClick={handleEditClick}>Editar Usuario</button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                

               
            </div>
        </div>
    );
};

export default Info;