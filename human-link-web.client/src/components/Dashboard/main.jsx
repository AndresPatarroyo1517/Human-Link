/* eslint-disable no-unused-vars */
import React, { useEffect } from 'react';
import CardCursos from './cardCursos';
import TableInforms from './tableInforms';
import TableUsuarios from './tableUsuarios';
import { useAdmin } from '../../context/adminContext';
import TableEmpleados from './tableEmpleados';
import VisualizacionDatos from './visualizacionDatos';
import BarrasCursos from '../graficosCursos/barrasCursosCategoria';
import DocumentManager from './documentManager';
import AsignarCursos from './asignarCursos'; 


const Main = () => {
    const { activeMenu, activeSection, setActiveSection, setActiveMenu } = useAdmin();

    const handleChangeSection = (section) => {
        setActiveSection(section);
        if (section === "Empleados") {
            setActiveMenu("Asignar Cursos"); // Cambiar a Asignar Cursos si se selecciona Empleados
        } else {
            setActiveMenu("Añadir Cursos"); // Por defecto para otras secciones
        }
    };

    return (
        <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4 borde-content">
            <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                {activeSection === 'Empleados' ? (
                    <>
                        <h1 className="h2"><i className="bi bi-people"></i> Empleados</h1>
                        <div className="btn-toolbar mb-2 mb-md-0">
                            <div className="btn-group me-2">
                                <button onClick={() => handleChangeSection('Cursos')} type="button" className="btn btn-sm btn-outline-secondary">
                                    <i className="bi bi-journals"></i> Cursos
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        <h1 className="h2"><i className="bi bi-journals"></i> Cursos</h1>
                        <div className="btn-toolbar mb-2 mb-md-0">
                            <div className="btn-group me-2">
                                <button onClick={() => handleChangeSection('Empleados')} type="button" className="btn btn-sm btn-outline-secondary">
                                    <i className="bi bi-people"></i> Empleados
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>

            <div className="content-placeholder bg-light border rounded p-5">
                <div>
                    {activeMenu === 'Gestionar Usuarios' && <TableUsuarios />}
                    {activeMenu === 'Asignar Cursos' && <AsignarCursos />} {/* Muestra el componente AsignarCursos */}
                    {activeMenu === 'Mis Documentos' && <DocumentManager />} {/* Integra DocumentManager aquí */}
                    {activeMenu === 'Añadir Cursos' && <CardCursos />}
                    {activeMenu === 'Informes' && <VisualizacionDatos />}
                    {activeMenu === 'Certificados' && <TableInforms />}
                </div>
            </div>
        </main>
    );
};

export default Main;
