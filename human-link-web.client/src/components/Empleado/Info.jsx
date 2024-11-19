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
            .then(response => {
                setCursos(response)
            })
            .catch(error => console.error('Error al obtener los cursos:', error));
    }, []);

    useEffect(() => {
        empleadosService.getEmp()
            .then(response => setEmpleadoInfo(response))
            .catch(error => console.error('Error al obtener el empleado:', error));
    }, []);

    useEffect(() => {
        NominaService.getNomina()
            .then(response => setNominaInfo(response))
            .catch(error => console.error('Error al obtener la nómina:', error));
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
                    <h3 className="mb-5 text-center text-primary">Cursos Finalizados</h3>
                    {cursos.filter(curso => curso.Progreso === 100).map((curso, index) => (
                        <div
                            key={index}
                            className="card mb-4 shadow-sm border-0 rounded-3"
                            style={{ overflow: 'hidden', backgroundColor: '#f8f9fa' }}
                        >
                            <div className="row g-0">
                                {/* Imagen del curso */}
                                <div className="col-md-4">
                                    <img
                                        src={curso.Curso.Url[0]}
                                        alt="Imagen del curso"
                                        className="img-fluid"
                                        style={{
                                            objectFit: 'cover',
                                            height: '100%',
                                        }}
                                    />
                                </div>
                                {/* Detalles del curso */}
                                <div className="col-md-6">
                                    <div className="card-body">
                                        <h5 className="card-title fw-bold text-dark">{curso.Curso.Nombrecurso}</h5>
                                        <p className="card-text text-muted">{curso.Curso.Descripcion}</p>
                                        <p className="card-text">
                                            <small className="text-primary fw-semibold">Duración: {curso.Curso.Duracion} horas</small>
                                        </p>
                                    </div>
                                </div>
                                {/* Estado de completado */}
                                <div className="col-md-2 text-center d-flex flex-column justify-content-center align-items-center bg-success text-white">
                                    <i
                                        className="bi bi-check-circle-fill"
                                        style={{ fontSize: '3rem' }}
                                    ></i>
                                    <p className="fw-semibold mt-2">Completado</p>
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
        title: 'Comparación de Bonos y Horas Extra',
        height: 400,
        width: 500,
        showlegend: true,
    };

    const tableData = [
        { category: 'Horas Extra', value: Math.round(horasExtra) },
        { category: 'Bonificación', value: nominaInfo.Bonificacion },
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
                        <th>Categoría</th>
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