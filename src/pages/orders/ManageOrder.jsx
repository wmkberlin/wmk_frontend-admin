import { Link, useNavigate } from "react-router-dom";
import * as Icons from "react-icons/tb";
import React, { useState, useEffect } from "react";
import Input from "../../components/common/Input.jsx";
import Badge from "../../components/common/Badge.jsx";
import Button from "../../components/common/Button.jsx";
import CheckBox from "../../components/common/CheckBox.jsx";
import Dropdown from "../../components/common/Dropdown.jsx";
import Pagination from "../../components/common/Pagination.jsx";
import TableAction from "../../components/common/TableAction.jsx";
import SelectOption from "../../components/common/SelectOption.jsx";
import axiosInstance from "../../axiosInstance.js";
import * as XLSX from "xlsx";
import deleteSelectedRecords from "../../utilis.js";

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedValue, setSelectedValue] = useState(10); // Rows per page
  const [totalPages, setTotalPages] = useState(1); // Total number of pages
  const [bulkCheck, setBulkCheck] = useState(false);
  const [specificChecks, setSpecificChecks] = useState({});
  const navigate = useNavigate();
  // Fetch orders from the API
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axiosInstance.get(
          `https://wmk-backend.onrender.com/api/admin_orders/orders?page=${currentPage}&limit=${selectedValue}`
        );
        if (response.status !== 200) {
          throw new Error("Failed to fetch orders");
        }
        const data = response.data;
        setOrders(data.orders);
        setTotalPages(data.totalPages); // Update total pages
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [currentPage, selectedValue]); // Re-fetch when page or limit changes



  const exportToExcel = () => {
    try {
      // Prepare the data for Excel export
      const excelData = orders.map((order) => {
        // Parse shipping address
        let shippingAddress = {};
        try {
          shippingAddress = JSON.parse(order.shippingAddress);
        } catch (error) {
          console.error('Error parsing shipping address:', error);
        }
  
        return {
          'Order ID': order.id,
          'Customer Email': order.customerEmail,
          'First Name': shippingAddress.firstName || '',
          'Last Name': shippingAddress.lastName || '',
          'Total Amount': order.totalAmount,
          'Payment Method': order.paymentMethod,
          'Status': order.status,
          'Order Date': new Date(order.orderDate).toLocaleString(),
          'Address': shippingAddress.address || '',
          'City': shippingAddress.city || '',
          'Postal Code': shippingAddress.postalCode || '',
          'Apartment': shippingAddress.apartment || ''
        };
      });
  
      // Create a new workbook
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(excelData);
      
      // Add the worksheet to the workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Orders Data');
      
      // Generate the Excel file
      const date = new Date().toISOString().split('T')[0];
      XLSX.writeFile(workbook, `Orders_Data_${date}.xlsx`);
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      alert('Failed to export data to Excel');
    }
  };

  // Handle bulk checkbox
  const handleBulkCheckbox = (isChecked) => {
    setBulkCheck(isChecked);
    const updatedChecks = {};
    if (isChecked) {
      orders.forEach((order) => {
        updatedChecks[order.id] = true;
      });
    }
    setSpecificChecks(updatedChecks);
  };

  // Handle individual checkbox
  const handleCheckOrder = (isChecked, orderId) => {
    setSpecificChecks((prevChecks) => ({
      ...prevChecks,
      [orderId]: isChecked,
    }));
  };

  // Handle pagination
  const onPageChange = (page) => {
    setCurrentPage(page);
  };

  // Handle table row dropdown
  const showTableRow = (value) => {
    setSelectedValue(value);
    setCurrentPage(1); // Reset to the first page when changing rows per page
  };

 

  // Handle table actions
  const handleActionItemClick = (action, orderId) => {
    console.log("Action:", action, "Order ID:", orderId);
    var updateItem = action.toLowerCase();
    if (updateItem === "delete") {
      alert(`#${orderId} item delete`);
    } else if (updateItem === "view") {
      navigate(`/orders/manage/${orderId}`);
    }else if(updateItem === "edit"){
      navigate(`/orders/manage/${orderId}`);
    }
  };

  const handleDeleteSelected = async () => {
    const selectedIds = Object.keys(specificChecks).filter((id) => specificChecks[id]);
    if (selectedIds.length === 0) {
      alert("Please select at least one order to delete.");
      return;
    }

    const isConfirmed = window.confirm("Are you sure you want to delete the selected orders?");
    if (!isConfirmed) return;

    const success = await deleteSelectedRecords("order", selectedIds);
    if (success) {
      // Refresh the list of orders after deletion
      const response = await axiosInstance.get(
        `https://wmk-backend.onrender.com/api/admin_orders/orders?page=${currentPage}&limit=${selectedValue}`
      );
      setOrders(response.data.orders);
      setSpecificChecks({}); // Reset the checkboxes
      setBulkCheck(false); // Uncheck the bulk checkbox
    }
  };

   // Handle bulk action dropdown
   const bulkActionDropDown = (action) => {
    if (action.value === "export") {
      exportToExcel();
    } else if (action.value === "delete") {
      handleDeleteSelected();
    }
  };


  // Table action items
  const actionItems = ["View", "Edit"];

  // Bulk action options
  const bulkAction = [
    { label: "Delete", value: "delete" },
    { label: "Export", value: "export" },
  ];

  // Table row options
  const tableRow = [
    { label: "10", value: 10 },
    { label: "20", value: 20 },
    { label: "50", value: 50 },
  ];

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <section className="orders">
      <div className="container">
        <div className="wrapper">
          <div className="content transparent">
            <div className="content_head">
            <Dropdown
                placeholder="Bulk Action"
                className="sm"
                onClick={bulkActionDropDown}
                options={bulkAction}
              />
              <Input
                placeholder="Search Order..."
                className="sm table_search"
              />
            </div>
            <div className="content_body">
              <div className="table_responsive">
                <table className="separate">
                  <thead>
                    <tr>
                      <th className="td_checkbox">
                        <CheckBox
                          onChange={handleBulkCheckbox}
                          isChecked={bulkCheck}
                        />
                      </th>
                      
                      <th>Customer Email</th>
                      <th>Customer Name</th>
                      <th>Total Amount</th>
                      <th>Payment Method</th>
                      <th>Status</th>
                      <th>Order Date</th>
                      <th>Shipping Address</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id}>
                        <td className="td_checkbox">
                          <CheckBox
                            onChange={(isCheck) =>
                              handleCheckOrder(isCheck, order.id)
                            }
                            isChecked={specificChecks[order.id] || false}
                          />
                        </td>
                        <td>{order.customerEmail}</td>
                        <td>{JSON.parse(order.shippingAddress).firstName} {JSON.parse(order.shippingAddress).lastName}</td>
                        <td>{order.totalAmount}</td>
                        <td>{order.paymentMethod}</td>
                        <td>
                          {order.status.toLowerCase() === "completed" ? (
                            <Badge label={order.status} className="light-success" />
                          ) : order.status.toLowerCase() === "pending" ? (
                            <Badge label={order.status} className="light-warning" />
                          ) : (
                            <Badge label={order.status} className="light-danger" />
                          )}
                        </td>
                        <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                        <td>{JSON.parse(order.shippingAddress).city} {JSON.parse(order.shippingAddress).postalCode}</td>
                        <td className="td_action">
                          <TableAction
                            actionItems={actionItems}
                            onActionItemClick={(item) =>
                              handleActionItemClick(item, order.id)
                            }
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="content_footer">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={onPageChange}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ManageOrders;