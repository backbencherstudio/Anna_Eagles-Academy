import axiosClient from "@/lib/axisoClients";

// create quiz

export const createQuiz = async (data: any) => {
    try {
        const response = await axiosClient.post('/api/admin/quiz', data);
        return response.data;
    } catch (error: any) {
        throw error;
    }
}
