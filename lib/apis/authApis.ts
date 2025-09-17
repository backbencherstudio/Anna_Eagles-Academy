import axios from 'axios';
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



