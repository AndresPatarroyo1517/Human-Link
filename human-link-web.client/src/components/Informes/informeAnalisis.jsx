import { fetchAnalisis } from '../../services/pdfService.jsx';
import * as XLSX from 'xlsx';
import { useEffect, useState } from 'react';

function InformeAnalisis() {
    const [data, setData] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const d = await fetchAnalisis()
                setData(d)
            } catch (e) {
                console.error('Error al traer los datos de análisis', e)
            }
        }
        fetchData()
    }, [])

    const exportExcel = () => {
        if (!data) return;
        const workbook = XLSX.utils.book_new();

        if (data.SalaryStats) {
            const salarySheet = XLSX.utils.json_to_sheet(data.SalaryStats);
            XLSX.utils.book_append_sheet(workbook, salarySheet, 'Salarios');
        }

        if (data.CourseStats) {
            const courseSheet = XLSX.utils.json_to_sheet(data.CourseStats);
            XLSX.utils.book_append_sheet(workbook, courseSheet, 'Cursos');
        }

        if (data.EmployeeCount) {
            const employeeSheet = XLSX.utils.json_to_sheet(data.EmployeeCount);
            XLSX.utils.book_append_sheet(workbook, employeeSheet, 'Empleados');
        }

        if (data.BonusStats) {
            const bonusSheet = XLSX.utils.json_to_sheet(data.BonusStats);
            XLSX.utils.book_append_sheet(workbook, bonusSheet, 'Bonificaciones');
        }

        if (data.PopularCourses) {
            const popularCoursesSheet = XLSX.utils.json_to_sheet(data.PopularCourses);
            XLSX.utils.book_append_sheet(workbook, popularCoursesSheet, 'Cursos Populares');
        }

        try {
            XLSX.writeFile(workbook, 'informe_análisis.xlsx');
        } catch (error) {
            console.error('Error al generar el archivo Excel:', error);
            alert('Hubo un error al generar el archivo Excel');
        }
    };

    return (
        <button className='export-button' onClick={exportExcel} disabled={!data}>Generar Análisis</button>
  );
}

export default InformeAnalisis;