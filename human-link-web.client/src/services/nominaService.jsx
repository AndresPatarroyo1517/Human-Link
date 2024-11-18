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
            throw new Error('Error al consultar la n�mina');
        }

        const data = await response.json();
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
                alert('N�mina actualizada con �xito');
            } else {
                const errorData = await response.json();
                console.error("Error al actualizar la n�mina:", errorData);
                alert('Error al actualizar la n�mina');
            }
        } catch (error) {
            console.error("Error actualizando la n�mina:", error);
            alert('Ocurri� un error al actualizar la n�mina');
        }
    },

    getMetricasNomina: async () => {
        const response = await fetch(API_URL + "/metricas-nomina", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error('Error al consultar la n�mina');
        }

        const data = await response.json();
        return data;
    }
}


export default NominaService;