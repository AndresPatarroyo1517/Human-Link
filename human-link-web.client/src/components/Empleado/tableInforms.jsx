const TableInforms = () => {

    return (
        <>
            <table className="table table-striped mt-4">
                <thead>
                    <tr>
                        <th scope="col">Usuario</th>
                        <th scope="col">Departamento</th>
                        <th scope="col">Curso</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Documento 1</td>
                        <td>2 MB</td>
                        <td>01/01/2023</td>
                    </tr>
                    <tr>
                        <td>Documento 2</td>
                        <td>3.5 MB</td>
                        <td>15/02/2023</td>
                    </tr>
                    <tr>
                        <td>Documento 3</td>
                        <td>1.2 MB</td>
                        <td>20/03/2023</td>
                    </tr>
                    <tr>
                        <td>Documento 4</td>
                        <td>4.8 MB</td>
                        <td>05/04/2023</td>
                    </tr>
                </tbody>
            </table>
        </>
    )
}

export default TableInforms;