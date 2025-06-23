import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { createCoupon, fetchCoupon, updateCoupon } from '../../api/coupons';

const defaultForm = {
  discountCode: '',
  discountValue: '',
  discountType: 'percentage',
  productCategory: '',
  startDate: '',
  endDate: '',
  maxUsage: '',
  minOrderAmount: '',
  description: ''
};

const formStyle = {
  maxWidth: '500px',
  margin: '40px auto',
  padding: '32px',
  background: '#fff',
  borderRadius: '12px',
  boxShadow: '0 2px 16px rgba(0,0,0,0.08)',
  display: 'flex',
  flexDirection: 'column',
  gap: '18px',
};

const labelStyle = {
  fontWeight: 'bold',
  marginBottom: '6px',
  display: 'block',
};

const inputStyle = {
  width: '100%',
  padding: '10px',
  border: '1px solid #ccc',
  borderRadius: '6px',
  fontSize: '1rem',
  marginBottom: '8px',
};

const buttonStyle = {
  background: '#1e293b',
  color: '#fff',
  border: 'none',
  borderRadius: '6px',
  padding: '12px',
  fontWeight: 'bold',
  fontSize: '1rem',
  cursor: 'pointer',
  marginTop: '10px',
  transition: 'background 0.2s',
};

const errorStyle = { color: 'red', marginBottom: '10px' };
const successStyle = { color: 'green', marginBottom: '10px' };

const CouponForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(!!id);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (id) {
      fetchCoupon(id)
        .then(res => {
          const data = res.data;
          setForm({
            discountCode: data.discountCode || '',
            discountValue: data.discountValue || '',
            discountType: data.discountType || 'percentage',
            productCategory: data.productCategory || '',
            startDate: data.startDate ? data.startDate.slice(0, 10) : '',
            endDate: data.endDate ? data.endDate.slice(0, 10) : '',
            maxUsage: data.maxUsage || '',
            minOrderAmount: data.minOrderAmount || '',
            description: data.description || ''
          });
        })
        .catch(() => setError('Failed to fetch coupon'))
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      if (id) {
        await updateCoupon(id, form);
        setSuccess('Coupon updated successfully!');
      } else {
        await createCoupon(form);
        setSuccess('Coupon created successfully!');
        setForm(defaultForm);
      }
      setTimeout(() => navigate('/coupons'), 1000);
    } catch (err) {
      setError('Failed to save coupon. Please check your input.');
    }
  };

  if (loading) return <div style={{textAlign:'center',marginTop:'40px'}}>Loading...</div>;

  return (
    <form onSubmit={handleSubmit} style={formStyle} autoComplete="off">
      <h2 style={{textAlign:'center',marginBottom:'10px'}}>{id ? 'Edit Coupon' : 'Create Coupon'}</h2>
      {error && <div style={errorStyle}>{error}</div>}
      {success && <div style={successStyle}>{success}</div>}
      {!id && (
        <div>
          <label style={labelStyle}>Discount Code</label>
          <input name="discountCode" value={form.discountCode} onChange={handleChange} required style={inputStyle} placeholder="e.g. SAVE20" />
        </div>
      )}
      <div>
        <label style={labelStyle}>Discount Value</label>
        <input name="discountValue" value={form.discountValue} onChange={handleChange} required type="number" min="1" style={inputStyle} placeholder="e.g. 20" />
      </div>
      <div>
        <label style={labelStyle}>Discount Type</label>
        <select name="discountType" value={form.discountType} onChange={handleChange} style={inputStyle}>
          <option value="percentage">Percentage</option>
          <option value="fixed">Fixed</option>
        </select>
      </div>
      <div>
        <label style={labelStyle}>Product Category</label>
        <input name="productCategory" value={form.productCategory} onChange={handleChange} required style={inputStyle} placeholder="e.g. vintage" />
      </div>
      <div style={{display:'flex',gap:'12px'}}>
        <div style={{flex:1}}>
          <label style={labelStyle}>Start Date</label>
          <input name="startDate" value={form.startDate} onChange={handleChange} type="date" required style={inputStyle} />
        </div>
        <div style={{flex:1}}>
          <label style={labelStyle}>End Date</label>
          <input name="endDate" value={form.endDate} onChange={handleChange} type="date" required style={inputStyle} />
        </div>
      </div>
      <div>
        <label style={labelStyle}>Max Usage</label>
        <input name="maxUsage" value={form.maxUsage} onChange={handleChange} required type="number" min="1" style={inputStyle} placeholder="e.g. 100" />
      </div>
      <div>
        <label style={labelStyle}>Min Order Amount</label>
        <input name="minOrderAmount" value={form.minOrderAmount} onChange={handleChange} required type="number" min="0" style={inputStyle} placeholder="e.g. 50" />
      </div>
      <div>
        <label style={labelStyle}>Description</label>
        <input name="description" value={form.description} onChange={handleChange} required style={inputStyle} placeholder="e.g. 20% off vintage items" />
      </div>
      <button type="submit" style={buttonStyle}>{id ? 'Update' : 'Create'} Coupon</button>
    </form>
  );
};

export default CouponForm; 