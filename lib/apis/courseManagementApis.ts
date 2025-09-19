import axiosClient from "@/lib/axisoClients";

// create course 

export const createCourse = async (formData: FormData) => {
    try {
        const response = await axiosClient.post('/api/admin/series', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error: any) {
        throw error;
    }
}

// get all courses
export const getAllCourses = async () => {
    try {
        const response = await axiosClient.get('/api/admin/series');
        return response.data;
    } catch (error: any) {
        throw error;
    }
}

// get single course 
export const getSingleCourse = async (id: string) => {
    try {
        const response = await axiosClient.get(`/api/admin/series/${id}`);
        return response.data;
    } catch (error: any) {
        throw error;
    }
}



// delete course
export const deleteCourse = async (id: string) => {
    try {
        const response = await axiosClient.delete(`/api/admin/series/${id}`);
        return response.data;
    } catch (error: any) {
        throw error;
    }
}