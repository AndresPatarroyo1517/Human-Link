const API_URL = 'https://localhost:7019/HumanLink/Nomina';



const NominaService = {
    getNomina: async () => {
        const response = await fetch(API_URL+'/Get', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error('Error al consultar la nómina');
        }

        const data = await response.json();
        console.log(data)
        return data;
    },

    updateNominaEmpleado: async (updatedNomina, nominaId) => {
        try {
            console.log('Datos ingresados ' + updatedNomina, 'id: ' + nominaId)
            const response = await fetch(API_URL + '/' + nominaId, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(updatedNomina), // Solo enviamos los campos modificados
            });

            if (response.ok) {
                alert('Nómina actualizada con éxito');
            } else {
                const errorData = await response.json();
                console.error("Error al actualizar la nómina:", errorData);
                alert('Error al actualizar la nómina');
            }
        } catch (error) {
            console.error("Error actualizando la nómina:", error);
            alert('Ocurrió un error al actualizar la nómina');
        }
    }
}


export default NominaService;