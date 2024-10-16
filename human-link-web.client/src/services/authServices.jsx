const API_URL_LOGIN = 'https://localhost:7019/HumanLink/Login';
const API_URL_LOGOUT = 'https://localhost:7019/HumanLink/Logout';

export const login = async ({ usuario1, clave, recordar}) => {
    const body = {
        usuario: usuario1, 
        clave: clave,
        recordar: recordar
    };

    const response = await fetch(API_URL_LOGIN, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
    });

    if (!response.ok) {
        throw new Error('Credenciales incorrectas');
    }
    const data = await response.json();
    recordar
        ? window.localStorage.setItem('user', JSON.stringify(data))
        : window.sessionStorage.setItem('user', JSON.stringify(data))
    return data;
};


export const logout = async () => {
    const response = await fetch(API_URL_LOGOUT, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include'
    });

    if (!response.ok) {
        throw new Error('No se pudo eliminar la cookie');
    }
    const data = await response.json();
    localStorage.removeItem('user');
    sessionStorage.removeItem('user');

    return data;
}
