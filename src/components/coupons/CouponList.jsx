import React, { useEffect, useState } from 'react';
import { fetchCoupons, deleteCoupon, toggleCouponStatus } from '../../api/coupons';
import { Link } from 'react-router-dom';

const cardStyle = {
  maxWidth: '900px',
  margin: '40px auto',
  padding: '32px',
  background: '#fff',
  borderRadius: '12px',
  boxShadow: '0 2px 16px rgba(0,0,0,0.08)',
};

const buttonStyle = {
  background: '#1e293b',
  color: '#fff',
  border: 'none',
  borderRadius: '6px',
  padding: '10px 20px',
  fontWeight: 'bold',
  fontSize: '1rem',
  cursor: 'pointer',
  marginBottom: '20px',
  float: 'right',
};

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  marginTop: '20px',
};

const thStyle = {
  background: '#f1f5f9',
  fontWeight: 'bold',
  padding: '12px',
  borderBottom: '2px solid #e2e8f0',
  textAlign: 'left',
};

const tdStyle = {
  padding: '10px',
  borderBottom: '1px solid #e2e8f0',
  verticalAlign: 'middle',
};

const statusStyle = status => ({
  color: status === 'active' ? 'green' : 'red',
  fontWeight: 'bold',
  textTransform: 'capitalize',
});

const errorStyle = { color: 'red', marginBottom: '10px' };

const smallButtonStyle = {
  ...buttonStyle,
  padding: '4px 8px',
  fontSize: '0.85rem',
  minWidth: '70px',
  marginBottom: 0,
};

const actionButtonGroup = {
  display: 'flex',
  gap: '6px',
  alignItems: 'center',
  justifyContent: 'center',
  flexWrap: 'wrap',
  maxWidth: '220px',
};

const CouponList = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(null);
  const [actionError, setActionError] = useState('');

  useEffect(() => {
    fetchCoupons()
      .then(res => setCoupons(res.data.coupons))
      .catch(() => setError('Failed to fetch coupons'))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this coupon?')) return;
    setActionLoading(id);
    setActionError('');
    try {
      await deleteCoupon(id);
      setCoupons(coupons.filter(c => c._id !== id));
    } catch (err) {
      let message = 'Failed to delete coupon.';
      if (err.response && err.response.data && err.response.data.message) {
        message = err.response.data.message;
      }
      setActionError(message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleToggleStatus = async (id) => {
    setActionLoading(id);
    setActionError('');
    try {
      const res = await toggleCouponStatus(id);
      setCoupons(coupons.map(c => c._id === id ? { ...c, ...res.data.coupon } : c));
    } catch (err) {
      let message = 'Failed to toggle status.';
      if (err.response && err.response.data && err.response.data.message) {
        message = err.response.data.message;
      }
      setActionError(message);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div style={cardStyle}>
      <h2 style={{marginBottom:'10px'}}>Coupons</h2>
      <Link to="/coupons/create">
        <button style={buttonStyle}>Create Coupon</button>
      </Link>
      <div style={{clear:'both'}}></div>
      {loading && <div>Loading coupons...</div>}
      {error && <div style={errorStyle}>{error}</div>}
      {actionError && <div style={errorStyle}>{actionError}</div>}
      {!loading && !error && (
        coupons.length === 0 ? (
          <div style={{marginTop:'30px',textAlign:'center',color:'#888'}}>No coupons found.</div>
        ) : (
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Code</th>
                <th style={thStyle}>Value</th>
                <th style={thStyle}>Type</th>
                <th style={thStyle}>Category</th>
                <th style={thStyle}>Start</th>
                <th style={thStyle}>End</th>
                <th style={thStyle}>Status</th>
                <th style={thStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map(coupon => (
                <tr key={coupon._id}>
                  <td style={tdStyle}><b>{coupon.discountCode}</b></td>
                  <td style={tdStyle}>{coupon.discountValue}</td>
                  <td style={tdStyle}>{coupon.discountType}</td>
                  <td style={tdStyle}>{coupon.productCategory}</td>
                  <td style={tdStyle}>{coupon.startDate ? coupon.startDate.slice(0,10) : ''}</td>
                  <td style={tdStyle}>{coupon.endDate ? coupon.endDate.slice(0,10) : ''}</td>
                  <td style={{...tdStyle, ...statusStyle(coupon.status)}}>{coupon.status}</td>
                  <td style={tdStyle}>
                    <div style={actionButtonGroup}>
                      <Link to={`/coupons/${coupon._id}`}>
                        <button style={smallButtonStyle}>Edit</button>
                      </Link>
                      <button
                        style={{...smallButtonStyle, background:'#dc2626', opacity: actionLoading === coupon._id ? 0.6 : 1}}
                        onClick={() => handleDelete(coupon._id)}
                        disabled={actionLoading === coupon._id}
                      >Delete</button>
                      <button
                        style={{...smallButtonStyle, background:'#64748b', opacity: actionLoading === coupon._id ? 0.6 : 1}}
                        onClick={() => handleToggleStatus(coupon._id)}
                        disabled={actionLoading === coupon._id}
                      >{coupon.isActive ? 'Deactivate' : 'Activate'}</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )
      )}
    </div>
  );
};

export default CouponList; 