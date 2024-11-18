import { useAdmin } from '../../context/adminContext';
import logo from '../../assets/hl.png'
const Slidebar = () => {
    const { activeSection, setActiveMenu } = useAdmin();

    const options = activeSection === 'Empleados' ? [
        { label: 'Gestionar Usuarios', icon: 'bi bi-people' },
        { label: 'Asignar Cursos', icon: 'bi bi-person-lines-fill' },
        { label: 'Mis Documentos', icon: 'bi bi-archive' },
        { label: 'Informes', icon: 'bi bi-file-earmark-medical' }
    ] : [
            { label: 'Añadir Cursos', icon: 'bi bi-folder-plus' },
            { label: 'Modificar Cursos', icon: 'bi bi-journals' }, 
        { label: 'Mis Documentos', icon: 'bi bi-archive' },
        { label: 'Certificados', icon: 'bi bi-patch-check' }
    ];

    return (
        <nav id="sidebar" className="col-md-3 col-lg-2 d-md-block bg-light sidebar borde-content">
            <div className="position-sticky pt-3">
                <div className="text-center my-4">
                    <div className="logo-placeholder rounded-circle mx-auto mb-3">
                        <img src={logo} style={{ width: '6rem', height: '6rem' }}></img>
                    </div>
                </div>
                <ul className="nav flex-column">
                    {options.map((option, index) => (
                        <li className="nav-item" key={index}>
                            <button onClick={() => setActiveMenu(option.label)} className="nav-link active buttonSlideBar">
                                <i className={option.icon}></i> {option.label}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </nav>
    );
};

export default Slidebar;

