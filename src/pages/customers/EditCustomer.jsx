import * as Icons from "react-icons/tb";
import { useParams, Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import Modal from "../../components/common/Modal.jsx";
import Badge from "../../components/common/Badge.jsx";
import Input from "../../components/common/Input.jsx";
import Button from "../../components/common/Button.jsx";
import Rating from "../../components/common/Rating.jsx";
import Divider from "../../components/common/Divider.jsx";
import Toggler from "../../components/common/Toggler.jsx";
import CheckBox from "../../components/common/CheckBox.jsx";
import Dropdown from "../../components/common/Dropdown.jsx";
import Offcanvas from "../../components/common/Offcanvas.jsx";
import Thumbnail from "../../components/common/Thumbnail.jsx";
import Accordion from "../../components/common/Accordion.jsx";
import TableAction from "../../components/common/TableAction.jsx";
import MultiSelect from "../../components/common/MultiSelect.jsx";
import axiosInstance from "../../axiosInstance.js";

const EditCustomer = () => {
  const { customerId } = useParams();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch customer data from the API
  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const response = await axiosInstance.get(`/auth/customer/${customerId}`);
        if (response.status !== 200) {
          throw new Error("Failed to fetch customer data");
        }
        const data = response.data;
        setCustomer(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchCustomer();
  }, [customerId]);

  // Show loading state
  if (loading) {
    return <div>Loading...</div>;
  }

  // Show error state
  if (error) {
    return <div>Error: {error}</div>;
  }

  // If customer data is not found
  if (!customer) {
    return <div>Customer not found</div>;
  }

  return (
    <section>
      <div className="container">
        <div className="wrapper">
          <div className="content">
            <div className="content_item">
              <h2 className="sub_heading">Detail</h2>
              <div className="column">
                <Input
                  type="text"
                  placeholder="Enter the customer name"
                  label="Name"
                  icon={<Icons.TbUser />}
                  value={customer.name}
                  disabled // Make the field read-only
                />
              </div>
              <div className="column">
                <Input
                  type="text"
                  placeholder="Enter the customer email"
                  label="Email"
                  icon={<Icons.TbMail />}
                  value={customer.contact.email}
                  disabled // Make the field read-only
                />
              </div>
              <div className="column">
                <Input
                  type="tel"
                  placeholder="Enter the customer phone"
                  label="Phone"
                  icon={<Icons.TbPhone />}
                  value={customer.contact.phone}
                  disabled // Make the field read-only
                />
              </div>
              
            </div>
            <div className="content_item">
              <h2 className="sub_heading">Addresses</h2>
              {customer.addresses.map((address, key) => (
                <div className="column" key={key}>
                  <Accordion title={`#${key < 9 ? `0${key + 1}` : key + 1} Address`}>
                    <table className="bordered">
                      <thead>
                        <tr>
                          <th>Street</th>
                          <th>City</th>
                          <th>State</th>
                          <th>Zip Code</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>{address.street}</td>
                          <td>{address.city}</td>
                          <td>{address.state}</td>
                          <td>{address.zip}</td>
                        </tr>
                      </tbody>
                    </table>
                  </Accordion>
                </div>
              ))}
            </div>
            <div className="content_item">
              <h2 className="sub_heading">Payments</h2>
              <div className="column">
                <div className="table_responsive">
                  <table className="bordered">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Order ID</th>
                        <th>Transaction ID</th>
                        <th>Payment Method</th>
                        <th>Amount</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                    {customer.purchase_history.map((order, key) => {
  // Extract the first transaction detail (assuming there's only one)
  const transactionDetail = order.transactionDetails[0];

  return (
    <tr key={key}>
      <td>{key + 1}</td>
      <td>
        <Link to={`/orders/manage/${order.order_id}`}>
          #{order.order_id}
          <Icons.TbExternalLink />
        </Link>
      </td>
      <td>{transactionDetail?.paymentId || "N/A"}</td>
      <td>{transactionDetail?.paymentSource?.paypal ? "PayPal" : "N/A"}</td>
      <td>{order.transaction_amount}</td>
      <td className="td_status">
        <Badge
          label={transactionDetail?.status || "N/A"}
          className={
            transactionDetail?.status?.toLowerCase() === "completed"
              ? "light-success"
              : transactionDetail?.status?.toLowerCase() === "pending"
              ? "light-warning"
              : "light-danger"
          }
        />
      </td>
    </tr>
  );
})}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div className="content_item">
              <h2 className="sub_heading">Reviews</h2>
              <div className="column">
                <table className="bordered">
                  <thead>
                    <tr>
                      
                      <th>Product ID</th>
                      <th>Rating</th>
                      <th>Review Text</th>
                      <th>Review Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                </table>
              </div>
            </div>
          </div>
          <div className="sidebar">
            <div className="sidebar_item">
              <h2 className="sub_heading">Status</h2>
              <div className="column">
                <Dropdown
                  placeholder="Select Status"
                  selectedValue={customer.status}
                  options={[
                    { value: "active", label: "Active" },
                    { value: "inactive", label: "Inactive" },
                  ]}
                  disabled // Make the dropdown read-only
                />
              </div>
            </div>
            <div className="sidebar_item">
              <h2 className="sub_heading">Image</h2>
              <div className="column">
                <Thumbnail preloadedImage={customer.image || `https://ui-avatars.com/api/?name=${customer.name}&background=random&color=fff`} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EditCustomer;