import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../axiosInstance.js";
import Badge from "../../components/common/Badge.jsx";
import Button from "../../components/common/Button.jsx";
import Input from "../../components/common/Input.jsx";
import Dropdown from "../../components/common/Dropdown.jsx";
import TableAction from "../../components/common/TableAction.jsx";

const ViewSales = () => {
    const { saleId } = useParams(); // Get the sale ID from the URL
    const [sale, setSale] = useState(null);
    const [orderLine, setOrderLine] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch the sale by ID
    useEffect(() => {
        const fetchSale = async () => {
            try {
                const response = await axiosInstance.get(`/admin_orders/sale/${saleId}`);
                if (response.status !== 200) {
                    throw new Error("Failed to fetch sale");
                }

                const data = response.data;
                setSale(data.sale);
                setOrderLine(data.orderData);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchSale();
    }, [saleId]);

    // Display loading state
    if (loading) {
        return <div>Loading...</div>;
    }

    // Display error state
    if (error) {
        return <div>Error: {error}</div>;
    }

    // If sale data is not found
    if (!sale) {
        return <div>Sale not found</div>;
    }

    // Parse shipping address
    const parseShippingAddress = (shippingAddress) => {
        try {
            const address = JSON.parse(shippingAddress);
            return `${address.firstName} ${address.lastName}, ${address.address}, ${address.city}, ${address.postalCode}`;
        } catch (error) {
            return "Invalid address format";
        }
    };

    return (
        <section className="view-sale">
            <div className="container">
                <div className="wrapper">
                    <div className="content">
                        <h1 className="heading">Sale Details</h1>
                        <div className="details">
                            <div className="detail-item">
                                <span className="label">Sale ID:</span>
                                <span className="value">#{sale._id}</span>
                            </div>
                            <div className="detail-item">
                                <span className="label">Customer Email:</span>
                                <Input
                                    type="text"
                                    value={sale.user_email}
                                    readOnly
                                    className="sm"
                                />
                            </div>
                            <div className="detail-item">
                                <span className="label">Order Date:</span>
                                <Input
                                    type="text"
                                    value={new Date(sale.order_date).toLocaleDateString()}
                                    readOnly
                                    className="sm"
                                />
                            </div>
                            <div className="detail-item">
                                <span className="label">Shipping Address:</span>
                                <Input
                                    type="text"
                                    value={parseShippingAddress(sale.shipping_address)}
                                    readOnly
                                    className="sm"
                                />
                            </div>
                            <div className="detail-item">
                                <span className="label">Shipping Method:</span>
                                <Input
                                    type="text"
                                    value={sale.shipping_method}
                                    readOnly
                                    className="sm"
                                />
                            </div>
                            <div className="detail-item">
                                <span className="label">Total Amount:</span>
                                <Input
                                    type="text"
                                    value={`$${sale.order_total}`}
                                    readOnly
                                    className="sm"
                                />
                            </div>
                            <div className="detail-item">
                                <span className="label">Payment Method:</span>
                                <Input
                                    type="text"
                                    value={sale.paymentMethod}
                                    readOnly
                                    className="sm"
                                />
                            </div>
                            <div className="detail-item">
                                <span className="label">Status:</span>
                                <Badge
                                    label={sale.order_status.status}
                                    className={
                                        sale.order_status.status.toLowerCase() === "completed"
                                            ? "light-success"
                                            : sale.order_status.status.toLowerCase() === "pending"
                                            ? "light-warning"
                                            : "light-danger"
                                    }
                                />
                            </div>
                        </div>

                        <h2 className="sub-heading">Order Lines</h2>
                        <div className="order-lines">
                            <table className="bordered">
                                <thead>
                                    <tr>
                                        <th>Product ID</th>
                                        {/* <th>Product Name</th> */}
                                        <th>Quantity</th>
                                        <th>Price</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orderLine.map((line, key) => (
                                        <tr key={key}>
                                            <td>{line.product_item_id}</td>
                                            {/* <td>{line.productName}</td> */}
                                            <td>{line.qty}</td>
                                            <td>${line.price}</td>
                                            <td className="td_action">
                                                <TableAction
                                                    actionItems={["View", "Edit"]}
                                                    onActionItemClick={(item) => {
                                                        if (item.toLowerCase() === "view") {
                                                            // Handle view action
                                                        } else if (item.toLowerCase() === "edit") {
                                                            // Handle edit action
                                                        }
                                                    }}
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="actions">
                            <Button
                                label="Back to Sales"
                                className="outline"
                                onClick={() => {
                                    // Navigate back to the sales list
                                    window.history.back();
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ViewSales;