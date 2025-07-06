import axiosInstance from '../axiosInstance';
import axios from 'axios';

// Create a separate axios instance for coupons
const couponAxios = axios.create({
    baseURL: 'http://localhost:8000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token interceptor for couponAxios
couponAxios.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
}, (error) => Promise.reject(error));

export const fetchCoupons = () => couponAxios.get('/discount-coupons/admin/coupons');
export const fetchCoupon = (id) => couponAxios.get(`/discount-coupons/admin/coupons/${id}`);
export const createCoupon = (data) => couponAxios.post('/discount-coupons/admin/create', data);
export const updateCoupon = (id, data) => couponAxios.put(`/discount-coupons/admin/coupons/${id}`, data);
export const deleteCoupon = (id) => couponAxios.delete(`/discount-coupons/admin/coupons/${id}`);
export const toggleCouponStatus = (id) => couponAxios.patch(`/discount-coupons/admin/coupons/${id}/toggle`); 