import { EmpleadoProvider } from "../../context/empleadoContext";
import Main from "../Empleado/main";
import Navbar from "../Empleado/navbar";
import Slidebar from "../Empleado/slidebar";

export const Dashboard = () => {

    return (
        <EmpleadoProvider>
            <Navbar />
            <div className="container-fluid">
                <div className="row">
                    <Slidebar />
                    <Main />
                </div>
            </div>
        </EmpleadoProvider>
    );
};