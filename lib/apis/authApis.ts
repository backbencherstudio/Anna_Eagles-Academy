
import axiosClient from "@/lib/axisoClients";



// create account 
export const createAccount = async (data: any) => {
    try {
        const response = await axiosClient.post('/api/auth/register', data);
        return response.data;
    } catch (error: any) {
        throw error;
    }
}


// login api
export const login = async (data: any) => {
    try {
        const response = await axiosClient.post('/api/auth/login', data);
        return response.data;
    } catch (error: any) {
        throw error;
    }
}


// auth check me 
export const authCheckMe = async () => {
    try {
        const response = await axiosClient.get('/api/auth/me');
        return response.data;
    } catch (error: any) {
        throw error;
    }
}




// forgot password
export const forgotPassword = async (data: any) => {
    try {
        const response = await axiosClient.post('/api/auth/forgot-password', data);
        return response.data;
    } catch (error: any) {
        throw error;
    }
}

