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

    getAllUsers: async () => {
        const response = await api.get('/Admin/GetAllUser');
        return response.data;
    },

    getAllBlogsForAdmin: async () => {
        const response = await api.get('/Admin/All-blogs-for-admin');
        return response.data;
    },

    approveBlog: async (id: number) => {
        const response = await api.put(`/Admin/Approve/${id}`);
        return response.data;
    },
    rejectBlog: async (id: number) => {
        const response = await api.put(`/Admin/Reject/${id}`);
        return response.data;
    },

    getAllApprovedBlogs: async () => {
        const response = await api.get('/Blog/Get-All-Approved');
        return response.data;
    },

    getBlogById: async (id: number) => {
        const response = await api.get(`/Blog/GetById/${id}`);
        return response.data;
    },

    getCommentsByBlogId: async (blogId: number) => {
        const response = await api.get(`/Comment/All-Comment-By-Blog/${blogId}`);
        return response.data;
    },
    createComment: async (blogId: number, content: string) => {
        const response = await api.post(`/Comment/Create`, { blogId, content });
        return response.data;
    },
    updateComment: async (commentId: number, content: string) => {
        const response = await api.put(`/Comment/Update/${commentId}`, { content });
        return response.data;
    },
    deleteComment: async (commentId: number) => {
        const response = await api.delete(`/Comment/Delete/${commentId}`);
        return response.data;
    },
    // Course Category APIs
    getCourseCategories: async () => {
        const response = await api.get('/CourseCategory');
        return response.data;
    },
    createCourseCategory: async (data: { name: string; description: string; age: string }) => {
        const response = await api.post('/CourseCategory', data);
        return response.data;
    },
    updateCourseCategory: async (id: number, data: { name: string; description: string; age: string }) => {
        const response = await api.put(`/CourseCategory/${id}`, data);
        return response.data;
    },
    // Course APIs
    getCourses: async () => {
        const response = await api.get('/Course');
        return response.data;
    },
    createCourse: async (data: any) => {
        const response = await api.post('/Course', data);
        return response.data;
    },
    updateCourse: async (id: number, data: any) => {
        const response = await api.put(`/Course/${id}`, data);
        return response.data;
    },
    deleteCourse: async (id: number) => {
        const response = await api.delete(`/Course/${id}`);
        return response.data;
    },
    getCourseQuestions: async () => {
        const response = await api.get('/CourseQuestion');
        return response.data;
    },
    updateCourseOption: async (optionId: number, data: { optionText: string; optionValue: number; displayOrder: number }) => {
        const response = await api.put(`/CourseOption/${optionId}`, data);
        return response.data;
    },
    createCourseOption: async (questionId: number, data: { optionText: string; optionValue: number; displayOrder: number }) => {
        const response = await api.post(`/CourseOption/${questionId}`, data);
        return response.data;
    },
    // RiskLevel APIs
    getAllRiskLevels: async () => {
        const response = await api.get('/RiskLevel');
        return response.data;
    },
    createRiskLevel: async (data: { riskLevel1: string; riskDescription: string }) => {
        const response = await api.post('/RiskLevel', data);
        return response.data;
    },
    updateRiskLevel: async (id: number, data: { riskLevel1: string; riskDescription: string }) => {
        const response = await api.put(`/RiskLevel/${id}`, data);
        return response.data;
    },
    deleteRiskLevel: async (id: number) => {
        const response = await api.delete(`/RiskLevel/Delete/${id}`);
        return response.data;
    },
}; 