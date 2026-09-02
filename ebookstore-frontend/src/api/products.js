import api from './axiosInstance'

export const getProducts       = (params) => api.get('/products', { params })
export const getProductById    = (id)     => api.get(`/products/${id}`)
export const getRelatedProducts= (id)     => api.get(`/products/${id}/related`)
export const getFeaturedProducts=()       => api.get('/products/featured')
