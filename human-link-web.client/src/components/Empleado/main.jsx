import CardCursos from './cardCursos';
import Documents from './documentos/documents';
import { useEmpleado } from '../../context/empleadoContext';
import CardCursoProgreso from './cardCursoProgreso';
import Info from './Info';
import DesarrollarCursos from './desarrollarCursos';
import { CursoProvider } from '../../context/cursoContext';

const Main = () => {
    const { activeMenu } = useEmpleado();

    //const handleChangeSection = (section) => {
    //    setActiveSection(section);
    //};

    return (
        <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4 borde-content">
            <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                <h1 className="h2"><i className="bi bi-people"></i> Empleados</h1>
            </div>

            <div className="content-placeholder bg-light border rounded p-5">
                <div>
                    {activeMenu === 'Mis Documentos' && <Documents />}
                    {activeMenu === 'Info' && <Info />}
                    <CursoProvider>
                    {activeMenu === 'Mis Cursos' && <CardCursos />}
                    {activeMenu === 'Mi Progreso' && <CardCursoProgreso />}
                    {activeMenu === 'Desarrollo curso' && <DesarrollarCursos />}
                    </CursoProvider>
                </div>
            </div>
        </main>
    );
};

export default Main;