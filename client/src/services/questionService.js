import api from './api';

export const getQuestions = (params) => api.get('/questions', { params });
export const getQuestion = (id) => api.get(`/questions/${id}`);
export const createQuestion = (data) => api.post('/questions', data);
export const updateQuestion = (id, data) => api.put(`/questions/${id}`, data);
export const deleteQuestion = (id) => api.delete(`/questions/${id}`);
export const getTrending = (params) => api.get('/questions/trending', { params });
export const getTags = () => api.get('/questions/tags');
export const getCompanies = () => api.get('/questions/companies');
export const getQuestionsByCompany = (company) => api.get(`/questions/company/${encodeURIComponent(company)}`);

export const addAnswer = (data) => api.post('/answers', data);
export const updateAnswer = (id, data) => api.put(`/answers/${id}`, data);
export const deleteAnswer = (id) => api.delete(`/answers/${id}`);

export const vote = (data) => api.post('/votes', data);

export const getBookmarks = () => api.get('/users/bookmarks');
export const toggleBookmark = (question_id) => api.post('/users/bookmarks', { question_id });
