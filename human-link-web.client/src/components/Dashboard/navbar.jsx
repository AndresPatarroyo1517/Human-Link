import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.jsx';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const cerrarSesion = async () => {
        await logout();
        navigate('/');
    };

    return (
        <nav className="navbar navbar-expand-lg custom-navbar-bg px-4">
            <a className="navbar-brand" href="#">Mi Empresa</a>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent" aria-controls="navbarContent" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarContent">
                <ul className="navbar-nav ms-auto">
                    <li className="nav-item dropdown">
                        <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false"> <i className="bi bi-person-fill-lock"> </i>
                            Mi Cuenta
                        </a>
                        <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                            <li><a className="dropdown-item" href="#"> <i className="bi bi-person-fill-gear"></i> Configuración</a></li>
                            <li className="li-linea-divisora"><hr className="dropdown-divider" /></li>
                            <li><a className="dropdown-item text-danger" onClick={cerrarSesion}><i className="bi bi-box-arrow-left"></i> Cerrar Sesión</a></li>
                        </ul>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;

