import { BrowserRouter, Routes ,Route, Navigate } from 'react-router-dom';
import Login from './components/Login/login.jsx';
import AdminDashboard from './components/Dashboard/adminDashboard.jsx';
import { AuthProvider } from './context/authContext.jsx'
import { Dashboard } from './components/Empleado/empleadoDashboard.jsx'
import { Informes } from './components/Informes/informes.jsx'
import { useAuth } from './hooks/useAuth.jsx'

const ProtectedRoute = ({ children, redirectTo }) => {
    const { user } = useAuth();
    if (!user || user.username === '') {
        return <Navigate to="/" />;
    } 
    return children;
};

const AdminRoute = ({ children }) => {
    const { user } = useAuth();
    if (!user || user.username === '' || !user.isAdmin) {
        return <Navigate to="/" />;
    }
    return children;
};

//La parte de informes como ruta luego se quita, es solo para facilidad de comprobacion
const App = () => {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/AdminDashboard" element={
                        <AdminRoute>
                            <AdminDashboard />
                        </AdminRoute>
                    } />
                    <Route path="/Dashboard" element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    } />
                    <Route path="/Informes" element={
                        <Informes />
                           
                    } />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    )
};

export default App;