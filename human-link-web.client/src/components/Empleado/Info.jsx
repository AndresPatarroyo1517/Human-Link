import { useState, useEffect } from 'react';
import empleadosService from '../../services/empleadosService';
import NominaService from '../../services/nominaService';
import Plot from 'react-plotly.js';
import cursosService from '../../services/cursosService';
import usuariosService from '../../services/usuariosService';

const Info = () => {
    const [empleadoInfo, setEmpleadoInfo] = useState({});
    const [nominaInfo, setNominaInfo] = useState({});
    const [cursos, setCursos] = useState([]);
    const [userInfo, setUserInfo] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({});

    useEffect(() => {
        cursosService.getCursosProgeso()
            .then(response => setCursos(response))
            .catch(error => console.error('Error al obtener los cursos:', error));
    }, []);

    useEffect(() => {
        empleadosService.getEmpleado()
            .then(response => setEmpleadoInfo(response))
            .catch(error => console.error('Error al obtener el empleado:', error));
    }, []);

    useEffect(() => {
        NominaService.getNomina()
            .then(response => setNominaInfo(response))
            .catch(error => console.error('Error al obtener la n�mina:', error));
    }, []);

    useEffect(() => {
        usuariosService.getUser()
            .then(response => {
                setUserInfo(response);
                setEditData({ ...response, Clave: "" }); // Clave en blanco al iniciar edici�n
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
                            <h5 className="card-title">Informaci�n General</h5>
                            <ul>
                                <li><strong>Nombre:</strong> {empleadoInfo.Nombre}</li>
                                <li><strong>Fecha de contrataci�n:</strong> {empleadoInfo.Fechacontratacion}</li>
                                <li><strong>Departamento:</strong> {empleadoInfo.Departamento}</li>
                                <li><strong>Cargo:</strong> {empleadoInfo.Cargo}</li>
                            </ul>
                        </div>
                    </div>

                    {/* Informaci�n del usuario */}
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">Informaci�n del Usuario</h5>
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

                {/* Cuadros derecho */}
                <div className="col-md-8 col-12">
                    <div className="row">
                        <div className="col-12 mb-4">
                            <div className="card">
                                <div className="card-body">
                                    {grafico(nominaInfo, empleadoInfo)}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Cursos finalizados */}
                <div className="col-md-8 col-12">
                    <h3 className="mb-4">Cursos Finalizados</h3>
                    {cursos.filter(curso => curso.Progreso === '100').map((curso, index) => (
                        <div key={index} className="card mb-3">
                            <div className="row g-0 align-items-center">
                                <div className="col-md-2">
                                    <img
                                        src={curso.Curso.Url[0]}
                                        alt="Imagen del curso"
                                        className="img-fluid rounded-start"
                                        style={{ objectFit: 'cover' }}
                                    />
                                </div>
                                <div className="col-md-8">
                                    <div className="card-body">
                                        <h5 className="card-title">{curso.Curso.Nombrecurso}</h5>
                                        <p className="card-text">{curso.Curso.Descripcion}</p>
                                        <p className="card-text">
                                            <small className="text-muted">Duraci�n: {curso.Curso.Duracion} horas</small>
                                        </p>
                                    </div>
                                </div>
                                <div className="col-md-2 text-center">
                                    <i className="bi bi-check-circle-fill text-success" style={{ fontSize: '2rem' }}></i>
                                    <p className="text-muted mt-2">Completado</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const grafico = (nominaInfo, empleadoInfo) => {
    const valorHora = empleadoInfo.Salario ? (empleadoInfo.Salario / 199.18) : 0;
    const horasExtra = nominaInfo.Horasextra ? (nominaInfo.Horasextra * (valorHora * 1.25)) : 0;

    const data = [{
        values: [nominaInfo.Bonificacion, horasExtra],
        labels: ['Bonos', 'Horas Extra'],
        type: 'pie',
        hoverinfo: 'label+percent',
        textinfo: 'percent',
        textposition: 'inside',
        marker: {
            colors: ['#ff6347', '#4682b4'],
        },
    }];

    const layout = {
        title: 'Comparaci�n de Bonos y Horas Extra',
        height: 400,
        width: 500,
        showlegend: true,
    };

    const tableData = [
        { category: 'Horas Extra', value: Math.round(horasExtra) },
        { category: 'Bonificaci�n', value: nominaInfo.Bonificacion },
    ];

    return (
        <div style={{ display: 'flex', alignItems: 'center' }}>
            <Plot
                data={data}
                layout={layout}
                config={{ responsive: true }}
                style={{ width: '50%' }}
            />
            <table className="table table-bordered" style={{ width: '30%', marginLeft: '40px' }}>
                <thead>
                    <tr>
                        <th>Categor�a</th>
                        <th>Valor</th>
                    </tr>
                </thead>
                <tbody>
                    {tableData.map((item, index) => (
                        <tr key={index}>
                            <td>{item.category}</td>
                            <td>{item.value}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Info;