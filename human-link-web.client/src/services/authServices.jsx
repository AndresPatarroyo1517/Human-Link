const API_URL = 'https://localhost:7019/HumanLink/Login';

export const login = async ({ usuario1, clave }) => {
    const body = {
        usuario1: usuario1, 
        clave: clave        
    };

    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    });

    const text = await response.text();

    if (!response.ok) {
        throw new Error('Credenciales incorrectas');
    }

    const data = JSON.parse(text);
    return data;
};
