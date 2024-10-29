import axios from "axios";

const apiClient = axios.create({
    baseURL: 'http://localhost:3000/auth',
    headers: {
        'Content-Type': 'application/json',
    },
});


export const registerUser = async (userData) => {
        const respond = await apiClient.post('/register', userData);
        return respond.data;
};

export const loginUser = async (userData) => {
    const respond = await apiClient.post('/login', userData);
    console.log(respond.data)
    return respond.data;
}
