import Navbar from "./navbar.jsx";
import Slidebar from './slidebar';
import Main from './main.jsx';
import { AdminProvider } from '../../context/adminContext.jsx';
import './adminDashboard.css';

const AdminDashboard = () => {
    return (
        <AdminProvider>
            <Navbar />
            <div className="container-fluid">
                <div className="row">
                    <Slidebar />
                    <Main />
                </div>
            </div>
        </AdminProvider>
    );
};

export default AdminDashboard;
