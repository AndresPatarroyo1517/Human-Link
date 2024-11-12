import React, { useEffect, useState } from 'react';


const Documents = () => {

    const user = localStorage.getItem('user')
    console.log(user)
    
    const renderDocumentCard = (title) => (
        <div className="col-12 mb-4">
            <div className="card w-100">
                <div className="card-body">
                    <h5 className="card-title">{title}</h5>
                    <p className="card-text">No se ha subido ningún archivo</p>
                    <form>
                        <div className="form-group">
                            <input type="file" className="form-control-file" />
                        </div>
                        <button type="button" className="btn btn-primary mt-2">Subir</button>
                    </form>
                </div>
            </div>
        </div>
    );

    return (
        <div><h2 className="mb-4">Documentos Requeridos</h2>
            <div className="container mt-5">
                <div className="row">
                    {renderDocumentCard('Hoja de Vida')}
                    {renderDocumentCard('Documento de Identidad')}
                    {renderDocumentCard('Certificados de Educación y Formación')}
                    {renderDocumentCard('Documentos Varios')}
                </div>
            </div>
        </div>
    );
}

export default Documents;