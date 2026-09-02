import api from './axiosInstance'
export const getBrands = () => api.get('/brands')
