const API_URL = 'https://localhost:7019/HumanLink/Nomina';

const NominaService = {
    getNomina: async () => {
        const response = await fetch(API_URL + '/Get', {
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

    addNomina: async (newNomina) => {
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(newNomina), // Enviamos la nueva nómina como JSON
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Nómina añadida con éxito:', data);
                return data; // Devolvemos la nómina creada
            } else {
                const errorData = await response.json();
                console.error("Error al añadir la nómina:", errorData);
                throw new Error('Error al añadir la nómina');
            }
        } catch (error) {
            console.error("Error añadiendo la nómina:", error);
            throw error; // Lanzamos el error para manejo en el componente
        }
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

    deleteNomina: async (nominaId) => {
        try {
            const response = await fetch(`${API_URL}/${nominaId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Error al eliminar la nómina:", errorData);
                throw new Error('No se pudo eliminar la nómina');
            }

            return true; // Indica que la eliminación fue exitosa
        } catch (error) {
            console.error("Error eliminando la nómina:", error);
            alert('Ocurrió un error al eliminar la nómina');
            throw error; // Re-lanza el error para manejo en el componente
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