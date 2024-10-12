import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.jsx';
import './Login.css'; 

const Login = () => {
    const [usuario1, setUsuario1] = useState('');
    const [clave, setClave] = useState('');
    const { user, login } = useAuth();
    const navigate = useNavigate();
    const [ errorLogin, setErrorLogin ] = useState(false);

    const handleSubmit = async (e) => {
       
        e.preventDefault();
        try {
            const usuarioLogin = await login({ usuario1, clave });
            //setUser(userData);
            if (usuarioLogin && usuarioLogin.isAdmin) {
                navigate('/AdminDashboard');
            } else if (usuarioLogin) {
                navigate('/Hola');
            }
            setErrorLogin(false);
        } catch (error) {
            setErrorLogin(true);
            console.error('Error en el login:', error);
        }
    };

    return (
        <div className="container">
            <div className="screen">
                <div className="screen__content">
                    {errorLogin ? <div className="div-errorLogin">
                        <p>Usuario y/o clave incorrectos.</p>
                    </div>  : null}
                    <form className="login" onSubmit={handleSubmit}>
                        <div className="login__field">
                            <i className="login__icon fas fa-user"></i>
                            <input
                                type="email"
                                className="login__input"
                                placeholder="Username"
                                value={usuario1}
                                onChange={(e) => setUsuario1(e.target.value)}
                                required
                            />
                        </div>
                        <div className="login__field">
                            <i className="login__icon fas fa-lock"></i>
                            <input
                                type="password"
                                className="login__input"
                                placeholder="Password"
                                value={clave}
                                onChange={(e) => setClave(e.target.value)}
                                required
                            />
                        </div>
                        <button className="button login__submit" type="submit" onClick={handleSubmit}>
                            <span className="button__text">Iniciar Sesión</span>
                            <i className="button__icon fas fa-chevron-right"></i>
                        </button>
                    </form>
                    <div className="social-login">
                        <h3>Consulta el Código</h3>
                        <div className="social-icons">
                            <a href="https://github.com/AndresPatarroyo1517/Human-Link" className="social-login__icon fab fa-github-alt"></a>
                        </div>
                    </div>
                </div>
                <div className="screen__background">
                    <span className="screen__background__shape screen__background__shape4"></span>
                    <span className="screen__background__shape screen__background__shape3"></span>
                    <span className="screen__background__shape screen__background__shape2"></span>
                    <span className="screen__background__shape screen__background__shape1"></span>
                </div>
            </div>
        </div>
    );
};

export default Login;

