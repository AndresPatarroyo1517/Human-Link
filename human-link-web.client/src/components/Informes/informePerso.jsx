import { useState } from 'react';
import jsPDF from 'jspdf';
import { fetchCursoPerso, fetchNominaPerso } from '../../services/pdfService.jsx';
import './informes.css'

export function InformePerso({ id }) {
    const [isLoading, setIsLoading] = useState(false)
    const [usuario, setUsuario] = useState('')

    const obtenerDatos = async (idUsuario) => {
        try {
            setIsLoading(true);
            const [c, n] = await Promise.all([
                fetchCursoPerso(idUsuario),
                fetchNominaPerso(idUsuario)
            ])
            setUsuario(n.Empleado)
            return { cursos: c, nomina: n };
        } catch (e) {
            console.log('Error al traer las métricas personalizadas: ' + e);
            throw e;
        } finally {
            setIsLoading(false);
        }
    };

    const pdfPersoNomina = async () => {
        try {
            setIsLoading(true);
            const { nomina } = await obtenerDatos(id);

            const doc = new jsPDF();
            doc.setFont("helvetica", "bold");
            doc.setFontSize(16);
            doc.text("Reporte de Nómina - HumanLink Software", 20, 20);
            doc.setFontSize(12);
            doc.text("Usuario: " + usuario, 20, 30);
            doc.text("Fecha: " + new Date().toLocaleDateString(), 160, 30);

            doc.autoTable({
                startY: 40,
                head: [["Nombre", "Cargo", "Departamento", "Salario Base", "Horas Extras", "Bonificación", "Salario Total"]],
                body: [[
                    nomina.Empleado,
                    nomina.Cargo,
                    nomina.Departamento || 'No disponible',
                    nomina.SalarioBase || 'No disponible',
                    nomina.HorasExtra || 'No disponible',
                    nomina.Bonificacion || 'No disponible',
                    nomina.SalarioTotal || 'No disponible'
                ]],
                theme: 'grid',
                headStyles: {
                    fillColor: [47, 85, 151],
                    textColor: 255,
                    fontStyle: 'bold',
                    halign: 'center',
                },
                bodyStyles: {
                    fontSize: 10,
                    valign: 'middle',
                    halign: 'center',
                },
                columnStyles: {
                    0: { cellWidth: 'auto' },
                },
                margin: { top: 30, bottom: 30 },
            });

            doc.setFontSize(8);
            doc.text("HumanLink Software - Todos los derechos reservados", 100, doc.internal.pageSize.height - 10, { align: "center" });
            doc.save('ReporteSalario_' + usuario + '.pdf');
        } catch (error) {
            console.error('Error al generar el PDF de nómina:', error);
        }
    };

    const pdfPersoCurso = async () => {
        try {
            setIsLoading(true);
            const { cursos } = await obtenerDatos(id);

            const doc = new jsPDF();
            doc.setFont("helvetica", "bold");
            doc.setFontSize(16);
            doc.text("Reporte de Cursos - HumanLink Software", 20, 20);
            doc.setFontSize(12);
            doc.text("Usuario: " + usuario, 20, 30);
            doc.text("Fecha: " + new Date().toLocaleDateString(), 160, 30);

            doc.autoTable({
                startY: 40,
                head: [["Nombre del Curso", "Progreso", "Notas", "Inicio del Curso"]],
                body: cursos.map(datos => [
                    datos.NombreCurso,
                    `${datos.Progreso}%`,
                    datos.Notas || 'Sin notas',
                    datos.FechaInicio || 'No disponible'
                ]),
                theme: 'grid',
                headStyles: {
                    fillColor: [47, 85, 151],
                    textColor: 255,
                    fontStyle: 'bold',
                    halign: 'center',
                },
                bodyStyles: {
                    fontSize: 10,
                    valign: 'middle',
                    halign: 'center',
                },
                columnStyles: {
                    0: { cellWidth: 'auto' },
                },
                margin: { top: 30, bottom: 30 },
            });

            doc.setFontSize(8);
            doc.text("HumanLink Software - Todos los derechos reservados", 100, doc.internal.pageSize.height - 10, { align: "center" });
            doc.save('ReporteCursos_' + usuario + '.pdf');
        } catch (error) {
            console.error('Error al generar el PDF de cursos:', error);
        }
    };

    return (
        <>
            <button
                className='export-button'
                onClick={pdfPersoNomina}
                disabled={isLoading}
            >
                {isLoading ? 'Cargando...' : 'Reporte Nómina'}
            </button>
            <button
                className='export-button'
                onClick={pdfPersoCurso}
                disabled={isLoading}
            >
                {isLoading ? 'Cargando...' : 'Reporte Cursos'}
            </button>
        </>
    );
}