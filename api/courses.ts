import api from './config';

export const coursesApi = {
    getAllCourses: async () => {
        const response = await api.get('/course');
        return response.data;
    },

    getCourseById: async (id: string) => {
        const response = await api.get(`/course/${id}`);
        return response.data;
    },

    createCourse: async (courseData: any) => {
        const response = await api.post('/course', courseData);
        return response.data;
    },

    updateCourse: async (id: string, courseData: any) => {
        const response = await api.put(`/course/${id}`, courseData);
        return response.data;
    },

    deleteCourse: async (id: string) => {
        const response = await api.delete(`/course/${id}`);
        return response.data;
    }
};