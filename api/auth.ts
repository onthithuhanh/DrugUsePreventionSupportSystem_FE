import api from './config';

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterData extends LoginRequest {
    fullName: string;
    address: string; 
}

export const authApi = {
    login: async (credentials: LoginRequest) => {
        const response = await api.post('/User/Login', credentials);
        //localStorage.setItem('token', response.data)
        //api.defaults.headers.common['Authorization'] = `Bearer ${response.data}`;
        return response.data;
    },

    register: async (data: RegisterData) => {
        const response = await api.post('/User/Register', data);
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
    createCourseQuestion: async (courseId: number, data: { questionText: string }) => {
        const response = await api.post(`/CourseQuestion/${courseId}`, data);
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
    // AgeGroup APIs
    getAllAgeGroups: async () => {
        const response = await api.get('/AgeGroup');
        return response.data;
    },
    getAgeGroupById: async (id: number) => {
        const response = await api.get(`/AgeGroup/${id}`);
        return response.data;
    },
    createAgeGroup: async (data: { name: string; description: string; minAge: number; maxAge: number }) => {
        const response = await api.post('/AgeGroup', data);
        return response.data;
    },
    updateAgeGroup: async (id: number, data: { name: string; description: string; minAge: number; maxAge: number }) => {
        const response = await api.put(`/AgeGroup/${id}`, data);
        return response.data;
    },
    deleteAgeGroup: async (id: number) => {
        const response = await api.delete(`/AgeGroup/Delete/${id}`);
        return response.data;
    },
    getMyProfile: async () => {
        const response = await api.get('/User/MyProfile');
        localStorage.setItem('userData', JSON.stringify(response.data));
        return response.data;
    },
    updateProfile: async (data: { email: string; fullName: string; address: string; dateOfBirth: string }) => {
        const response = await api.put('/User/Update-Profile', data);
        return response.data;
    },
    postBlog: async (data: { title: string; content: string }) => {
        const response = await api.post('/Blog/Post-blog', data);
        return response.data;
    },
    registerCourse: async (courseId: number) => {
        const response = await api.post(`/Course/Register/${courseId}`);
        return response.data;
    },
    getRegisteredCourses: async () => {
        const response = await api.get('/CourseRegister');
        return response.data;
    },
    // AssessmentType APIs
    getAllAssessmentTypes: async () => {
        const response = await api.get('/AssessmentType');
        return response.data;
    },
    getAssessmentTypeById: async (id: number) => {
        const response = await api.get(`/AssessmentType/${id}`);
        return response.data;
    },
    createAssessmentType: async (data: { name: string; description: string }) => {
        const response = await api.post('/AssessmentType', data);
        return response.data;
    },
    updateAssessmentType: async (id: number, data: { name: string; description: string }) => {
        const response = await api.put(`/AssessmentType/${id}`, data);
        return response.data;
    },
    deleteAssessmentType: async (id: number) => {
        const response = await api.delete(`/AssessmentType/Delete/${id}`);
        return response.data;
    },
    // Assessment APIs
    getAllAssessments: async () => {
        const response = await api.get('/Assessment');
        return response.data;
    },
    getAssessmentById: async (id: number) => {
        const response = await api.get(`/Assessment/${id}`);
        return response.data;
    },
    createAssessment: async (data: { title: string; description: string; assessmentType: number; ageGroup: number; createdDate: string; isActive: boolean }) => {
        const response = await api.post('/Assessment', data);
        return response.data;
    },
    updateAssessment: async (id: number, data: { title: string; description: string; assessmentType: number; ageGroup: number; createdDate: string; isActive: boolean }) => {
        const response = await api.put(`/Assessment/${id}`, data);
        return response.data;
    },
    deleteAssessment: async (id: number) => {
        const response = await api.delete(`/Assessment/Delete/${id}`);
        return response.data;
    },
    // AssessmentQuestion APIs
    getAllAssessmentQuestions: async () => {
        const response = await api.get('/AssessmentQuestion/GetAll');
        return response.data;
    },
    getAssessmentQuestionById: async (id: number) => {
        const response = await api.get(`/AssessmentQuestion/${id}`);
        return response.data;
    },
    createAssessmentQuestion: async (data: { assessmentId: number; questionText: string; questionType: string }) => {
        const response = await api.post('/AssessmentQuestion/Add', data);
        return response.data;
    },
    updateAssessmentQuestion: async (id: number, data: { assessmentId: number; questionText: string; questionType: string }) => {
        const response = await api.put(`/AssessmentQuestion/Update/${id}`, data);
        return response.data;
    },
    deleteAssessmentQuestion: async (id: number) => {
        const response = await api.delete(`/AssessmentQuestion/Delete/${id}`);
        return response.data;
    },
    // AssessmentOption APIs
    getAllAssessmentOptions: async () => {
        const response = await api.get('/AssessmentOption/GetAll');
        return response.data;
    },
    getAssessmentOptionById: async (id: number) => {
        const response = await api.get(`/AssessmentOption/${id}`);
        return response.data;
    },
    createAssessmentOption: async (data: { questionId: number; optionText: string; optionValue: number }) => {
        const response = await api.post('/AssessmentOption/Add', data);
        return response.data;
    },
    updateAssessmentOption: async (id: number, data: { questionId: number; optionText: string; optionValue: number }) => {
        const response = await api.put(`/AssessmentOption/Update/${id}`, data);
        return response.data;
    },
    deleteAssessmentOption: async (id: number) => {
        const response = await api.delete(`/AssessmentOption/Delete/${id}`);
        return response.data;
    },
}; 