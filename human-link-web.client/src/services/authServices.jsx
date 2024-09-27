const API_URL = 'https://localhost:7019/HumanLink/Login';

export const login = async ({ usuario1, clave }) => {
    const body = {
        usuario: usuario1, 
        clave: clave        
    };

    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(body),
    });

    if (!response.ok) {
        throw new Error('Credenciales incorrectas');
    }

    const data = await response.json();
    const { token } = data
    callProtectedEndpoint(token)
    return data;
};

const callProtectedEndpoint = async(token) => {

    fetch('https://localhost:7019/HumanLink/GetUsers', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('No autorizado');
        })
        .then(data => console.log(data));
}
