import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import * as Icons from "react-icons/tb";
import axiosInstance from "../../axiosInstance.js";
import Badge from "../../components/common/Badge.jsx";
import Button from "../../components/common/Button.jsx";
import Profile from "../../components/common/Profile.jsx";
import truck from "../../images/common/delivery-truck.gif";

const OrderDetail = () => {
  const { orderID } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch order details from the API
  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await axiosInstance.get(`https://wmk-backend.onrender.com/api/admin_orders/orders/${orderID}`);
        if (response.status !== 200) {
          throw new Error("Failed to fetch order details");
        }
        setOrder(response.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderID]);

  // Handle invoice download
  const handleInvoice = () => {
    alert("Under Construction invoice page");
  };

  // Handle cancel order
  const handleCancelOrder = async () => {
    const isConfirmed = window.confirm("Are you sure you want to cancel this order?");
    if (!isConfirmed) return;

    try {
      // Update the order status to "Canceled"
      const response = await axiosInstance.put(`https://wmk-backend.onrender.com/api/admin_orders/orders/${orderID}/cancel`);
      if (response.status !== 200) {
        throw new Error("Failed to cancel the order");
      }

      // Update the local state to reflect the canceled status
      setOrder((prevOrder) => ({
        ...prevOrder,
        status: "Canceled",
      }));

      alert("Order canceled successfully!");
    } catch (error) {
      console.error("Error canceling order:", error);
      alert("Failed to cancel the order. Please try again.");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!order) {
    return <div>Order not found</div>;
  }

  return (
    <section className="orders">
      <div className="container">
        <div className="wrapper">
          <div className="content">
            <div className="content_item">
              <h2 className="sub_heading">
                <span>Order #{orderID}</span>
                <Button
                  icon={<Icons.TbDownload />}
                  label="invoice"
                  className="bg_light_success sm"
                  onClick={handleInvoice}
                />
                {order.status.toLowerCase() !== "canceled" && (
                  <Button
                    icon={<Icons.TbX />}
                    label="Cancel Order"
                    className="bg_light_danger sm"
                    onClick={handleCancelOrder}
                  />
                )}
              </h2>
              <table className="bordered">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Item Price</th>
                    <th>Quantity</th>
                    <th>Total Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {order.productListDetail.map((line) => (
                    <tr key={line.productItemId}>
                      <td>
                        <img src={line.productImage} alt="" />
                      </td>
                      <td>
                        <Link className="truncate-text" to={`/catalog/product/manage/${line._id}`}>
                          {line.title}
                        </Link>
                      </td>
                      <td>${line.price}</td>
                      <td>{line.qty}</td>
                      <td>${line.price * line.qty}</td>
                    </tr>
                  ))}
                  <tr>
                    <td colSpan="4" className="td_no_p">
                      <b>Sub Total</b>
                    </td>
                    <td colSpan="1" className="td_no_p">
                      <b>${order.orderTotal}</b>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="content_item">
              <h2 className="sub_heading">
                <span>Order Status</span>
              </h2>
              <div className="order_status">
                <div className="order_status_item">
                  <div className="order_status_icon">
                    {order.status.toLowerCase() === "pending" ? (
                      <Icons.TbChecklist />
                    ) : order.status.toLowerCase() === "processing" ? (
                      <Icons.TbReload />
                    ) : order.status.toLowerCase() === "packed" ? (
                      <Icons.TbPackage />
                    ) : order.status.toLowerCase() === "shipping" ? (
                      <Icons.TbTruckDelivery />
                    ) : order.status.toLowerCase() === "out for delivery" ? (
                      <Icons.TbTruckLoading />
                    ) : order.status.toLowerCase() === "delivered" ? (
                      <Icons.TbShoppingBagCheck />
                    ) : order.status.toLowerCase() === "canceled" ? (
                      <Icons.TbX />
                    ) : (
                      ""
                    )}
                  </div>
                  <div className="order_status_content">
                    <h3>{order.status}</h3>
                    <p>{order.timestamp}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="sidebar">
            <div className="sidebar_item">
              <div className="logistics_item">
                <img src={truck} alt="" height="100px" />
                <p>
                  <b>Order Date: </b> {order.orderDate}
                </p>
                <p>
                  <b>Shipping Address: </b>
                  {JSON.parse(order.shippingAddress).apartment} , {JSON.parse(order.shippingAddress).address}
                </p>
              </div>
            </div>
            <div className="sidebar_item">
              <h2 className="sub_heading">Payment Details:</h2>
              <div className="column">
                <div className="detail_list">
                  <div className="detail_list_item">
                    <b>Transaction ID:</b>
                    <p>{order.paymemtData[0]?.paymentId}</p>
                  </div>
                  <div className="detail_list_item">
                    <b>Payment Method:</b>
                    <td>{order.paymentMethod}</td>
                  </div>
                  <div className="detail_list_item">
                    <b>Amount:</b>
                    <p>{order.paymemtData[0]?.captures[0]?.amount.value}</p>
                  </div>
                  <div className="detail_list_item">
                    <b>Payment Status:</b>
                    {order.paymemtData[0]?.captures[0]?.status.toLowerCase() === "active" ||
                    order.paymemtData[0]?.captures[0]?.status.toLowerCase() === "completed" ||
                    order.paymemtData[0]?.captures[0]?.status.toLowerCase() === "approved" ||
                    order.paymemtData[0]?.captures[0]?.status.toLowerCase() === "delivered" ||
                    order.paymemtData[0]?.captures[0]?.status.toLowerCase() === "success" ||
                    order.paymemtData[0]?.captures[0]?.status.toLowerCase() === "shipped" ||
                    order.paymemtData[0]?.captures[0]?.status.toLowerCase() === "new" ||
                    order.paymemtData[0]?.captures[0]?.status.toLowerCase() === "coming soon" ? (
                      <Badge
                        label={order.paymemtData[0]?.captures[0]?.status}
                        className="light-success"
                      />
                    ) : order.paymemtData[0]?.captures[0]?.status.toLowerCase() === "inactive" ||
                      order.paymemtData[0]?.captures[0]?.status.toLowerCase() === "out of stock" ||
                      order.paymemtData[0]?.captures[0]?.status.toLowerCase() === "rejected" ||
                      order.paymemtData[0]?.captures[0]?.status.toLowerCase() === "locked" ||
                      order.paymemtData[0]?.captures[0]?.status.toLowerCase() === "discontinued" ? (
                      <Badge
                        label={order.paymemtData[0]?.captures[0]?.status}
                        className="light-danger"
                      />
                    ) : order.paymemtData[0]?.captures[0]?.status.toLowerCase() === "on sale" ||
                      order.paymemtData[0]?.captures[0]?.status.toLowerCase() === "featured" ||
                      order.paymemtData[0]?.captures[0]?.status.toLowerCase() === "shipping" ||
                      order.paymemtData[0]?.captures[0]?.status.toLowerCase() === "processing" ||
                      order.paymemtData[0]?.captures[0]?.status.toLowerCase() === "pending" ? (
                      <Badge
                        label={order.paymemtData[0]?.captures[0]?.status}
                        className="light-warning"
                      />
                    ) : order.paymemtData[0]?.captures[0]?.status.toLowerCase() === "archive" ||
                      order.paymemtData[0]?.captures[0]?.status.toLowerCase() === "pause" ? (
                      <Badge
                        label={order.paymemtData[0]?.captures[0]?.status}
                        className="light-secondary"
                      />
                    ) : (
                      order.paymemtData[0]?.captures[0]?.status
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="sidebar_item">
              <h2 className="sub_heading">Customer Details:</h2>
              <div className="column">
                <Profile
                  name={order.customerEmail}
                  slogan="customer"
                  link={`/customers/manage/${order.customerEmail}`}
                  src={order.customerEmail.image}
                />
              </div>
              <div className="column">
                <div className="detail_list">
                  <div className="detail_list_item">
                    <Icons.TbMail />
                    <p>{order.customerEmail}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="sidebar_item">
              <h2 className="sub_heading">Billing Address:</h2>
              <div className="column">
                <div className="detail_list">
                  <div className="detail_list_item">
                    <Icons.TbPoint />
                    <p>{order.paymemtData[0]?.shipping?.addressLine1}</p>
                  </div>
                  <div className="detail_list_item">
                    <Icons.TbPoint />
                    <p>{order.paymemtData[0]?.shipping?.adminArea1}, {order.paymemtData[0]?.shipping?.postalCode}</p>
                  </div>
                  <div className="detail_list_item">
                    <Icons.TbPoint />
                    <p>{order.paymemtData[0]?.shipping?.countryCode}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OrderDetail;