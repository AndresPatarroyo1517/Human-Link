const API_URL_LOGIN = 'https://localhost:7019/HumanLink/Login/login';
const API_URL_LOGOUT = 'https://localhost:7019/HumanLink/Login/logout';

const postRequest = async (url, body = {}) => {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(body),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error en la solicitud');
    }
    return response.json();
};

export const loginService = async ( usuario1, clave, recordar ) => {
    const body = {
        usuario: usuario1,
        clave: clave,
        recordar: recordar
    };
    const data = await postRequest(API_URL_LOGIN, body);

    saveUser(data, recordar);
    return data;
};
export const logoutService = async () => {
    const data = await postRequest(API_URL_LOGOUT);
    deleteUser();
    return data;
};

const saveUser = (data, recordar) => {
    const userData = JSON.stringify(data);
    if (recordar) {
        localStorage.setItem('user', userData);
    } else {
        sessionStorage.setItem('user', userData);
    }
};

const deleteUser = () => {
    localStorage.removeItem('user');
    sessionStorage.removeItem('user');
};