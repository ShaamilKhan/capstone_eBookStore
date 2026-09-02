import api from './axiosInstance'

export const getAddresses      = ()          => api.get('/addresses')
export const addAddress        = (data)      => api.post('/addresses', data)
export const updateAddress     = (id, data)  => api.put(`/addresses/${id}`, data)
export const deleteAddress     = (id)        => api.delete(`/addresses/${id}`)
export const setDefaultAddress = (id)        => api.put(`/addresses/${id}/default`)
