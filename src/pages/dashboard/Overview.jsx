import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as Icons from "react-icons/tb";
import Bar from '../../charts/Bar.jsx';
import Area from '../../charts/Area.jsx';
import Products from '../../api/Products.json';
import Badge from '../../components/common/Badge.jsx';
import Button from '../../components/common/Button.jsx';
import Profile from '../../components/common/Profile.jsx';
import axiosInstance from '../../axiosInstance.js';

const Overview = () => {
    const [salesSummary, setSalesSummary] = useState({
        totalOrders: 0,
        totalSalesPrice: 0,
        totalItems: 0,
        recentOrders: [],
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
	const navigate = useNavigate();
	// useEffect(() => {
    //     const fetchSalesData = async () => {
    //         try {
    //             const response = await axiosInstance.get('/sales/data');
    //             if (response.status !== 200) {
    //                 throw new Error("Failed to fetch sales data");
    //             }

    //             const data = response.data;
    //             setSalesData(data);
    //         } catch (err) {
    //             console.error("Error fetching sales data:", err.message);
    //         }
    //     };

    //     fetchSalesData();
    // }, []);

    // Fetch sales summary data
    useEffect(() => {
        const fetchSalesSummary = async () => {
            try {
                const response = await axiosInstance.get('/admin_orders/sales/summary');
                if (response.status !== 200) {
                    throw new Error("Failed to fetch sales summary");
                }

                const data = response.data;
                setSalesSummary(data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchSalesSummary();
    }, []);

    // Display loading state
    if (loading) {
        return <div>Loading...</div>;
    }

    // Display error state
    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <section>
            <div className="container">
                <div className="wrapper">
                    <div className="content">
                        <div className="content_item sale_overview">
                            <div className="sale_overview_card">
                                <Icons.TbShoppingCart />
                                <div className="sale_overview_content">
                                    <h5 className="sale_title">Total Sale</h5>
                                    <h4 className="sale_value">${salesSummary.totalSalesPrice}</h4>
                                </div>
                            </div>
                            <div className="sale_overview_card">
                                <Icons.TbShoppingBag />
                                <div className="sale_overview_content">
                                    <h5 className="sale_title">Total Orders</h5>
                                    <h4 className="sale_value">{salesSummary.totalOrders}</h4>
                                </div>
                            </div>
                            <div className="sale_overview_card">
                                <Icons.TbPackage />
                                <div className="sale_overview_content">
                                    <h5 className="sale_title">Total Items</h5>
                                    <h4 className="sale_value">{salesSummary.totalItems}</h4>
                                </div>
                            </div>
                        </div>
                        <div className="content_item">
                            <h2 className="sub_heading">
                                <span>Sale Analytic</span>
                                <Button
                                    label="View Sales"
                                    className="sm"
									onClick={() => navigate('/venue/manage')} 
                                />
                            </h2>
                            <Area /> 
                        </div>
                    </div>
                    <div className="sidebar">
                        <div className="sidebar_item">
                            <h2 className="sub_heading">Order Recently</h2>
                            <div className="recent_orders column">
                                {salesSummary.recentOrders.map((order, key) => (
                                    <Link key={key} to={`/orders/manage/${order._id}`} className="recent_order">
                                        <figure className="recent_order_img">
                                            <img src={order.orderLines[0]?.productImage || "default-image.jpg"} alt="" />
                                        </figure>
                                        <div className="recent_order_content">
                                            <h4 className="recent_order_title">{order.orderLines[0]?.productName || "N/A"}</h4>
                                            <p className="recent_order_category">Order ID: #{order._id}</p>
                                        </div>
                                        <div className="recent_order_details">
                                            <h5 className="recent_order_price">${order.order_total}</h5>
                                            <p className="recent_order_quantity">Items: {order.orderLines.length}</p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Overview;