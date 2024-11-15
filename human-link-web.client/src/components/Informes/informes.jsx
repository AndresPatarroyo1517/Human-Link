import { useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { fetchCursosUsuarios } from '../../services/pdfService.jsx';
import './informes.css'; 

export function Informes() {
    const [dataUC, setDataUC] = useState([]);

    useEffect(() => {
        const obtenerDatos = async () => {
            try {
                const data = await fetchCursosUsuarios();
                setDataUC(data);
            } catch (error) {
                console.error("Error al cargar los datos:", error);
            }
        };

        obtenerDatos();
    }, []);

    const exportarAPdf = () => {
        const doc = new jsPDF();
        doc.text("Reporte de Usuarios por Curso", 7, 7);
        doc.autoTable({
            startY: 20,
            head: [["Nombre del Curso", "Cantidad de Usuarios", "Fecha de Inicio", "Progreso", "Prom. Notas"]],
            body: dataUC.map(curso => [
                curso.NombreCurso,
                curso.CantidadUsuarios,
                curso.FechaInicioMasReciente,
                curso.PromedioProgreso,
                curso.PromedioNotas
            ]),
        });
        doc.save("UsuariosPorCurso.pdf");
    };

    return (
        <div className="informes-container">
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
                    {dataUC.map((curso, index) => (
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
            <button className="export-button" onClick={exportarAPdf}>Exportar a PDF</button>
        </div>
    );
}
