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
    console.log(data)
    return data;
};
