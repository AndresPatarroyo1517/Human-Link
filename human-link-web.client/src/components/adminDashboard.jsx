import { Navbar } from '../components/Dashboard/navbar';
import { Slidebar } from '../components/Dashboard/slidebar';
import { Main } from '../components/Dashboard/main';
import { AdminProvider } from '../context/adminContext';

export const AdminDashboard = () => {
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
