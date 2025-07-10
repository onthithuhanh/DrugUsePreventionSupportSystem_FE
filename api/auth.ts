import api from './config';

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterData extends LoginRequest {
    name: string;
}

export const authApi = {
    login: async (credentials: LoginRequest) => {
        const response = await api.post('/User/Login', credentials);
        //localStorage.setItem('token', response.data)
        //api.defaults.headers.common['Authorization'] = `Bearer ${response.data}`;
        return response.data;
    },

    register: async (data: RegisterData) => {
        const response = await api.post('/Auth/register', data);
        return response.data;
    },

    logout: async () => {
        const response = await api.post('/auth/logout');
        return response.data;
    },

    getCurrentUser: async () => {
        const response = await api.get('/auth/me');
        return response.data;
    },
}; 