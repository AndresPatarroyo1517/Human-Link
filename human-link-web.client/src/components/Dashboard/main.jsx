import CardCursos from './cardCursos';
import TableInforms from './tableInforms';
import { useAdmin } from '../../context/adminContext';
import TableEmpleados from './tableEmpleados';

const Main = () => {
    const { activeMenu, activeSection, setActiveSection, setActiveMenu } = useAdmin();

    const handleChangeSection = (section) => {
        setActiveSection(section);
        if (section != "Empleados") {
            setActiveMenu("Añadir Cursos");
        } else {
            setActiveMenu("Asignar Cursos");
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
                    {activeMenu === 'Asignar Cursos' && <TableEmpleados />}
                    {activeMenu === 'Mis Documentos' && <p>Mostrando servicios...</p>}
                    {activeMenu === 'Informes' && <p>Mostrando informes...</p>}
                    {activeMenu === 'Añadir Cursos' && <CardCursos />}
                    {activeMenu === 'Certificados' && <TableInforms />}
                </div>
            </div>
        </main>
    );
};

export default Main;