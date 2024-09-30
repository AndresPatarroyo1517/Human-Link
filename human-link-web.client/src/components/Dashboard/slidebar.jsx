import React from 'react';
import { useAdmin } from '../../context/adminContext';  

export const Slidebar = () => {

    const { activeSection, setActiveMenu } = useAdmin();  

    const options = activeSection === 'Empleados' ? [
        { label: 'Asignar Cursos', icon: 'bi bi-person-lines-fill' },
        { label: 'Mis Documentos', icon: 'bi bi-archive' },
        { label: 'Informes', icon: 'bi bi-file-earmark-medical' }
    ] : [{ label: 'A�adir Cursos', icon: 'bi bi-folder-plus' },
    { label: 'Mis Documentos', icon: 'bi bi-archive' },
    { label: 'Certificados', icon: 'bi bi-patch-check' }];

    return (
        <nav id="sidebar" className="col-md-3 col-lg-2 d-md-block bg-light sidebar borde-content">
            <div className="position-sticky pt-3">
                <div className="text-center my-4">
                    <div className="logo-placeholder bg-secondary rounded-circle mx-auto mb-3"></div>
                    <h5>LOGO</h5>
                </div>
                <ul className="nav flex-column">
                    {options.map((option, index) => (
                        <li className="nav-item" key={index}>
                            {/* <a className="nav-link active" href="#"><i className="bi bi-check2-circle">  </i>
                Asignar Cursos
              </a> */}
                            <button onClick={() => setActiveMenu(option.label)} className="nav-link active buttonSlideBar"><i className={option.icon}></i> {option.label}</button>
                        </li>
                    ))}
                </ul>
            </div>
        </nav>
    );
};