const API_URL = 'https://localhost:7019/HumanLink/Nomina/Get';


const NominaService = {
    getNomina: async () => {
        const response = await fetch(API_URL, {
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
    }
}


export default NominaService;