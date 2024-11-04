const TableInforms = ({ colum1, colum2, colum3 }) => {
    return (
        <>
            <table className="table table-striped mt-4">
                <thead>
                    <tr>
                        <th scope="col">{colum1 || "Usuario"}</th>
                        <th scope="col">{colum2 || "Curso"}</th>
                        <th scope="col">{colum3 || "Certificado"}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Documento 1</td>
                        <td>Curso A</td>
                        <td>Certificado 1</td>
                    </tr>
                    <tr>
                        <td>Documento 2</td>
                        <td>Curso B</td>
                        <td>Certificado 2</td>
                    </tr>
                    <tr>
                        <td>Documento 3</td>
                        <td>Curso C</td>
                        <td>Certificado 3</td>
                    </tr>
                    <tr>
                        <td>Documento 4</td>
                        <td>Curso D</td>
                        <td>Certificado 4</td>
                    </tr>
                </tbody>
            </table>
        </>
    );
};

export default TableInforms;

