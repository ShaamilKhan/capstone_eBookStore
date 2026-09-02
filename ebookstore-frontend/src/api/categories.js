import api from './axiosInstance'
export const getCategories = () => api.get('/categories')
