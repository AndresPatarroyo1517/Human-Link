import { BrowserRouter, Routes ,Route } from 'react-router-dom';
import Login from './components/Login/login.jsx';
import AdminDashboard from './components/Dashboard/adminDashboard.jsx';
import { AuthProvider } from './context/authContext.jsx'
import { Hola } from './components/Hola(Cambiar)/Hola.jsx'



const App = () => {
    return (
        <>
            <AuthProvider>
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<Login />} />
                        <Route path="/AdminDashboard" element={<AdminDashboard />} />
                        <Route path="/hola" element={<Hola/>}/>
                    </Routes>
                </BrowserRouter>
            </AuthProvider>
         </>
    )
};

export default App;






//import { useEffect, useState } from 'react';*/
//import './App.css'
//function App() {
//    const [users, setUsers] = useState([]);

//    useEffect(() => {
//        populateUserData();
//    }, []);

//    async function populateUserData() {
//        try {
//            const response = await fetch('https://localhost:7019/HumanLink/GetUsers');
//            if (!response.ok) {
//                throw new Error(`HTTP error! status: ${response.status}`);
//            }
//            const data = await response.json();
//            setUsers(data);
//        } catch (error) {
//            console.error('Error fetching user data:', error);
//        }
//    }

//    const contents = users.length === 0 
//        ? <p>Loading... </p>
//        : <table className="table table-striped" aria-labelledby="tableLabel">
//            <thead>
//                <tr>
//                    <th>Usuario</th>
//                    <th>Correo</th>
//                    <th>Es admin</th>
//                    <th>Nombre</th>
//                </tr>
//            </thead>
//            <tbody>
//                {users.map(user => (
//                    <tr key={user.idusuario}>
//                        <td>{user.usuario1}</td>
//                        <td>{user.correo}</td>
//                        <td>{user.isadmin ? 'Sí' : 'No'}</td>
//                        <td>
//                            {user.empleados.map(empleado => ( 
//                                <div key={empleado.idEmpleado}>{empleado.nombre}</div>
//                            ))}
//                        </td>
//                    </tr>
//                ))}
//            </tbody>
//        </table>;

//    return (
//        <div>
//            <h1 id="tableLabel">Usuarios</h1>
//            <p>Mom dont go</p>
//            <img src='https://i.pinimg.com/564x/b6/2b/f4/b62bf4d6aa7019de819f80f01667e466.jpg' alt="Imagen" />
//            {contents}
//        </div>
//    );
//}

//export default App;
