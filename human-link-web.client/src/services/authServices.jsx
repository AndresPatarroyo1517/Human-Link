const API_URL = '';

export const login = async (credentials) => {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
    });

    if (!response.ok) {
        throw new Error('Error en la autenticación');
    }

    return response.json();
};
