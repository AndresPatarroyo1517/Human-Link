import logo from '../../assets/hl.png'
import { useEmpleado } from '../../context/empleadoContext';

const Slidebar = () => {

    const { setActiveMenu } = useEmpleado();  

    const options = [
        { label: 'Mis Cursos', icon: 'bi bi-person-lines-fill' },
        { label: 'Mis Documentos', icon: 'bi bi-archive' },
        { label: 'Mi Progreso', icon: 'bi bi-file-earmark-medical' }
    ];

    return (
        <nav
  id="sidebar"
  className="col-md-3 col-lg-2 d-md-block bg-light sidebar borde-content position-fixed h-100"
>
  <div className="position-sticky pt-3">
    <div className="text-center my-4">
      <div className="logo-placeholder rounded-circle mx-auto mb-3">
          <img src={logo} style={{ width: '6rem', height: '6rem' }}></img>
      </div>
    </div>
    <ul className="nav flex-column text-center">
      {options.map((option, index) => (
        <li className="nav-item" key={index}>
          <button
            onClick={() => setActiveMenu(option.label)}
            className="nav-link buttonSlideBar text-center active"
          >
            <i className={`${option.icon} me-2`}></i> {option.label}
          </button>
        </li>
      ))}
    </ul>
  </div>
</nav>

    );
};
export default Slidebar;
