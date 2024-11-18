import { useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { fetchCursosUsuarios, fetchMetricasNomina } from '../../services/pdfService.jsx';
import './informes.css'; 
import  InformeAnalisis  from './informeAnalisis.jsx';

export const Informes = ({ imageSrc}) => {
    const [dataUC, setDataUC] = useState([]);
    const [mNomina, setMNomina] = useState({});
    const [showMoreCursos, setShowMoreCursos] = useState(false);
    const [isImageReady, setIsImageReady] = useState(false); 

    useEffect(() => {
        const obtenerDatos = async () => {
            try {
                const data = await fetchCursosUsuarios();
                const metricas = await fetchMetricasNomina();
                setDataUC(data);
                setMNomina(metricas);
            } catch (error) {
                setDataUC([]);
                setMNomina({});
            }
        };
        obtenerDatos();
    }, []);

    useEffect(() => {
        if (imageSrc) {
            setIsImageReady(true);  
        } else {
            setIsImageReady(false); 
        }
    }, [imageSrc]);

    const pdfMetricaNomina = () => {
        const doc = new jsPDF();

        doc.setFont("helvetica", "bold");
        doc.setFontSize(16);
        doc.text("Reporte de Métricas de Nómina", 20, 20);
        doc.setFontSize(12);
        doc.text("Fecha: " + new Date().toLocaleDateString(), 160, 20);

        doc.autoTable({
            startY: 30,
            head: [["Nómina Total", "Bonificación Total", "Emp. con Bon.", "Emp. sin Bon.", "Emp. con Hr.", "Emp. sin Hr."]],
            body: [[
                mNomina.TotalNomina || 'No disponible',
                mNomina.TotalBonificacion || 'No disponible',
                mNomina.EmpleadosSinBonificacion || 'No disponible',
                mNomina.EmpleadosConBonificacion || 'No disponible',
                mNomina.EmpleadosSinHorasExtras || 'No disponible',
                mNomina.EmpleadosConHorasExtras || 'No disponible'
            ]],
            theme: "grid",
            headStyles: {
                fillColor: [47, 85, 151],
                textColor: 255,
                fontStyle: "bold",
                halign: "center"
            },
            bodyStyles: {
                fontSize: 10,
                valign: "middle",
                halign: "center"
            },
            columnStyles: {
                0: { cellWidth: 'auto' },
            },
            margin: { top: 30, bottom: 30 },
        });

        doc.setFontSize(8);
        doc.text("HumanLink Software - Todos los derechos reservados", 100, doc.internal.pageSize.height - 10, { align: "center" });
        doc.save("MetricasNomina.pdf");
    };


    const pdfCursoUsuario = async () => {
        const doc = new jsPDF();

        try {

            doc.setFont("helvetica", "bold");
            doc.setFontSize(16);
            doc.text("Reporte de Cursos con Gráfico", 20, 20);
            doc.setFontSize(12);
            doc.text("Fecha: " + new Date().toLocaleDateString(), 160, 20);

            doc.addImage(imageSrc, 'PNG', 10, 30, 190, 95);

            doc.autoTable({
                startY: 130,
                head: [["Nombre del Curso", "Categoría", "Cantidad de Usuarios", "Fecha de Inicio", "Progreso", "Prom. Notas"]],
                body: dataUC.map(curso => [
                    curso.NombreCurso,
                    curso.CategoriaCurso || 'No pertenece a ninguna categoría',
                    curso.CantidadUsuarios,
                    curso.FechaInicioMasReciente,
                    `${curso.PromedioProgreso}%`,
                    curso.PromedioNotas || 'No disponible' 
                ]),
                theme: "grid",
                headStyles: {
                    fillColor: [47, 85, 151],
                    textColor: 255,
                    fontStyle: "bold",
                    halign: "center"
                },
                bodyStyles: {
                    fontSize: 10,
                    valign: "middle",
                    halign: "center"
                },
                columnStyles: {
                    0: { cellWidth: 'auto' },
                },
                margin: { top: 30, bottom: 30 },
            });
            doc.setFontSize(8);
            doc.text("HumanLink Software - Todos los derechos reservados", 100, doc.internal.pageSize.height - 10, { align: "center" });
            doc.save("ReporteConGrafico.pdf");
        } catch (error) {
            console.error('Error al generar el PDF:', error);
            alert('Error al generar el PDF. Por favor, intente nuevamente.');
        }
    };


    return (
        <div className="contenedor-completo">
            <div className="contenedor-tabla">
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
                    <button className="show-more-button" onClick={() => setShowMoreCursos((prev) => !prev)}>
                        {showMoreCursos ? "Ver menos" : "Ver más"}
                    </button>
                )}
                <div className="button-container">
                <button
                    className="export-button"
                    onClick={pdfCursoUsuario}
                    disabled={!isImageReady} 
                >
                    Exportar con Gráfico
                </button>
                <button
                    className="export-button"
                    onClick={pdfMetricaNomina}
                    disabled={!isImageReady} 
                >
                    Exportar métricas
                    </button>
                    <InformeAnalisis/>
                </div>
            </div>
        </div>
    );
};

