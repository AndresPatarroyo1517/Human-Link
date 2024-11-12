import { useState, useEffect } from 'react';
import empleadosService from '../../services/empleadosService';
import NominaService from '../../services/nominaService';
import Plot from 'react-plotly.js';
import cursosService from '../../services/cursosService';

const Info = () => {

    const [empleadoInfo, setEmpleadoInfo] = useState([]);

    const [nominaInfo, setNominaInfo] = useState([]);

    const [cursos, setCursos] = useState([]);


    useEffect(() => {
        cursosService.getCursosProgeso()
            .then(response => {
                console.log('response cursos p',response);
                setCursos(response);
            })
            .catch(error => {
                console.error('Error al obtener los cursos y progreso:', error);
            });
    }, []);

    useEffect(() => {
        empleadosService.getEmpleado()
            .then(response => {
                console.log("Response from getEmpleados:", response);
                setEmpleadoInfo(response);
            })
            .catch(error => {
                console.error('Error al obtener los empleados:', error);
            });
    }, []);

    useEffect(() => {
        NominaService.getNomina()
        .then(response => {
                console.log("Response from getNomina:", response);
                setNominaInfo(response);
            })
            .catch(error => {
                console.error('Error al obtener la nomina:', error);
            });
    }, []);


    return (
        <div className="container-fluid">
        <div className="row">
            {/* Cuadro izquierdo */}
            <div className="col-md-4 col-12">
                <div className="card mb-4" style={{ height: '80%' }}>
                    <div className="card-body">
                        <h5 className="card-title">Información General</h5>
                            <ul>
                                <li><strong>Nombre:</strong> {empleadoInfo.Nombre}</li>
                                <li><strong>Fecha de contratacion:</strong>{empleadoInfo.Fechacontratacion}</li>
                                <li><strong>Departamento:</strong>{ empleadoInfo.Departamento}</li>
                                <li><strong>Cargo:</strong> { empleadoInfo.Cargo }</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Cuadros derecho */}
            <div className="col-md-8 col-12">
                <div className="row">
                        <div className="col-12 mb-4">
                            <div className="card" style={{ height: '100%', width: '100%' }}>
                            <div className="card-body">
                                    {grafico(nominaInfo, empleadoInfo)}
                            </div>
                        </div>
                    </div>
                </div>
                </div>
                <div className="col-md-8 col-12" style={{ width: '100%' }} >
                    <h3 className="mb-4">Cursos Finalizados</h3>
                    {cursos.map((curso, index) => (
                        curso.Progreso == '100' && ( // Solo muestra cursos con progreso 100%
                            <div key={index} className="card mb-3" style={{ width: '100%' }}>
                                <div className="row g-0 align-items-center">
                                    {/* Imagen del curso */}
                                    <div className="col-md-2">
                                        <img
                                            src={curso.Curso.Url[0]}
                                            alt="Imagen del curso"
                                            className="img-fluid rounded-start"
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                    </div>

                                    {/* Información del curso */}
                                    <div className="col-md-8">
                                        <div className="card-body">
                                            <h5 className="card-title">{curso.Curso.Nombrecurso}</h5>
                                            <p className="card-text">{curso.Curso.Descripcion}</p>
                                            <p className="card-text">
                                                <small className="text-muted">Duración: {curso.Curso.Duracion} horas</small>
                                            </p>
                                        </div>
                                    </div>

                                    {/* Icono de verificación */}
                                    <div className="col-md-2 text-center">
                                        <i className="bi bi-check-circle-fill text-success" style={{ fontSize: '2rem' }}></i>
                                        <p className="text-muted mt-2">Completado</p>
                                    </div>
                                </div>
                            </div>
                        )
                    ))}
                </div>
             
        </div>
        </div>
  );

}


const grafico = (nominaInfo,empleadoInfo) => {

    const valorHora = (empleadoInfo.Salario / 199.18) 

    

    let horasExtra = (nominaInfo.Horasextra * (valorHora * 1.25));

    const data = [{
        values: [nominaInfo.Bonificacion,horasExtra], // Valores de bonos y horas extra
        labels: ['Bonos', 'Horas Extra'], // Etiquetas para cada sección
        type: 'pie', // Tipo de gráfico
        hoverinfo: 'label+percent', // Información que aparece al pasar el cursor
        textinfo: 'percent', // Mostrar los porcentajes en las porciones
        textposition: 'inside', // Mostrar el texto dentro del gráfico
        marker: {
            colors: ['#ff6347', '#4682b4'], // Colores personalizados
        },
    }];

    const layout = {
        title: 'Comparación de Bonos y Horas Extra', // Título del gráfico
        height: 400,
        width: 500,
        showlegend: true, // Mostrar la leyenda
    };

    const tableData = [
        { category: 'Horas Extra', value: Math.round(horasExtra) },
        { category: 'Bonificación', value: nominaInfo.Bonificacion },
    ];

    return(
        <div style={{ display: 'flex', alignItems: 'center' }}>
            {/* Gráfico de pastel */}
            <Plot
                data={data}
                layout={layout}
                config={{ responsive: true }}
                style={{ width: '50%' }} // Ajusta el ancho del gráfico
            />

            {/* Tabla con los valores */}
            <table className="table table-bordered" style={{ width: '30%', marginLeft: '40px', zIndex: '1' }}>
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
}

export default Info;