import { useEffect, useState, useRef } from 'react';
import jsPDF from 'jspdf';
import Plotly from "plotly.js";
import 'jspdf-autotable';
import { fetchCursosUsuarios, fetchMetricasNomina } from '../../services/pdfService.jsx';
import './informes.css'; 
import BarrasCursosCategoria from "../graficosCursos/barrasCursosCategoria";
export function Informes() {
    const [dataUC, setDataUC] = useState([]);
    const [mNomina, setMNomina] = useState({});
    const [showMoreCursos, setShowMoreCursos] = useState(false);
    const barrasCursosCategoriaRef = useRef(null);

    useEffect(() => {
        const obtenerDatos = async () => {
            try {
                const data = await fetchCursosUsuarios();
                const metricas = await fetchMetricasNomina();
                setDataUC(data);
                setMNomina(metricas);
            } catch (error) {
                console.error("Error al cargar los datos:", error);
                setDataUC([]);
                setMNomina({});
            }
        };
        obtenerDatos();
    }, []);

    const pdfMetricaNomina = () => {
        const doc = new jsPDF();
        doc.text("Reporte de Métricas de Nómina", 6, 6);
        doc.autoTable({
            startY: 20,
            head: [["Nómina Total", "Bonificación Total", "Emp. sin Bon.", "Emp. con Bon.", "Emp. sin Hr.", "Emp. con Hr."]],
            body: [
                mNomina.TotalNomina,
                mNomina.TotalBonificacion,
                mNomina.PromedioHorasExtras,
                mNomina.EmpleadosSinBonificacion,
                mNomina.EmpleadosConBonificacion,
                mNomina.EmpleadosSinHorasExtras,
                mNomina.EmpleadosConHorasExtras
            ],
        });
        doc.save("MetricasNomina.pdf");
    };

    // Función para exportar el gráfico a PDF
    const pdfConGrafico = () => {
        const doc = new jsPDF();
        doc.text("Reporte de Cursos con Gráfico", 7, 7);

        // Convertir el gráfico en imagen
        Plotly.toImage(barrasCursosCategoriaRef.current, { format: 'png', width: 500, height: 300 })
            .then((imgData) => {
                // Añadir el gráfico como imagen en el PDF
                doc.addImage(imgData, 'PNG', 10, 20, 180, 100); // Posición y tamaño
                // Añadir la tabla de datos (si lo deseas también)
                doc.autoTable({
                    startY: 130,
                    head: [["Nombre del Curso", "Cantidad de Usuarios", "Fecha de Inicio", "Progreso", "Prom. Notas"]],
                    body: dataUC.map(curso => [
                        curso.NombreCurso,
                        curso.CantidadUsuarios,
                        curso.FechaInicioMasReciente,
                        curso.PromedioProgreso,
                        curso.PromedioNotas
                    ]),
                });
                doc.save("ReporteConGrafico.pdf");
            })
            .catch(error => console.error("Error al generar imagen del gráfico:", error));
    };

    return (
        <div className="informes-container">
            <div className="tables-container">
                <div className="table-column">
                    <h2 className="informes-title">Usuarios por Curso</h2>
                    <table className="informes-table">
                        <thead>
                            <tr>
                                <th>Nombre del Curso</th>
                                <th>Cantidad de Usuarios</th>
                                <th>Fecha de Inicio más Reciente</th>
                                <th>Promedio del progreso</th>
                                <th>Promedio de notas</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dataUC.slice(0, showMoreCursos ? dataUC.length : 10).map((curso, index) => (
                                <tr key={index}>
                                    <td>{curso.NombreCurso}</td>
                                    <td>{curso.CantidadUsuarios}</td>
                                    <td>{curso.FechaInicioMasReciente}</td>
                                    <td>{curso.PromedioProgreso}</td>
                                    <td>{curso.PromedioNotas}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {dataUC.length > 10 && (
                        <button className="show-more-button" onClick={() => setShowMoreCursos(prev => !prev)}>
                            {showMoreCursos ? "Ver menos" : "Ver más"}
                        </button>
                    )}
                    <button className="export-button" onClick={pdfConGrafico}>Exportar con Gráfico</button>
                </div>
                <div className="table-column">
                    <h2 className="informes-title">Métricas de Nómina</h2>
                    <table className="informes-table">
                        <thead>
                            <tr>
                                <th>Nómina Total</th>
                                <th>Bonificación Total</th>
                                <th>Promedio de Horas extras</th>
                                <th>Empleados sin Bonificación</th>
                                <th>Empleados con Bonificación</th>
                                <th>Empleados sin Horas extras</th>
                                <th>Empleados con Horas extras</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{mNomina.TotalNomina}</td>
                                <td>{mNomina.TotalBonificacion}</td>
                                <td>{mNomina.PromedioHorasExtras}</td>
                                <td>{mNomina.EmpleadosSinBonificacion}</td>
                                <td>{mNomina.EmpleadosConBonificacion}</td>
                                <td>{mNomina.EmpleadosSinHorasExtras}</td>
                                <td>{mNomina.EmpleadosConHorasExtras}</td>
                            </tr>
                        </tbody>
                    </table>
                    <button className="export-button" onClick={pdfMetricaNomina}>Exportar métricas</button>
                </div>
            </div>
            <div ref={barrasCursosCategoriaRef}>
                <BarrasCursosCategoria />
            </div>
        </div>
    )
}