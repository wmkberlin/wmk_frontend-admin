import axiosInstance from '../axiosInstance';

export const fetchCoupons = () => axiosInstance.get('/discount-coupons/admin/coupons');
export const fetchCoupon = (id) => axiosInstance.get(`/discount-coupons/admin/coupons/${id}`);
export const createCoupon = (data) => axiosInstance.post('/discount-coupons/admin/create', data);
export const updateCoupon = (id, data) => axiosInstance.put(`/discount-coupons/admin/coupons/${id}`, data); 