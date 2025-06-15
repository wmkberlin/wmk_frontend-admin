import * as Icons from "react-icons/tb";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../../components/common/Input.jsx";
import Badge from "../../components/common/Badge.jsx";
import Button from "../../components/common/Button.jsx";
import CheckBox from "../../components/common/CheckBox.jsx";
import Dropdown from "../../components/common/Dropdown.jsx";
import Pagination from "../../components/common/Pagination.jsx";
import TableAction from "../../components/common/TableAction.jsx";
import SelectOption from "../../components/common/SelectOption.jsx";
import axiosInstance from "../../axiosInstance.js";
import deleteSelectedRecords from "../../utilis.js";

const ManageCustomer = () => {
    const [bulkCheck, setBulkCheck] = useState(false);
    const [specificChecks, setSpecificChecks] = useState({});
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [limit, setLimit] = useState(10);
    const [selectedValue, setSelectedValue] = useState(5);

    const [tableRow, setTableRow] = useState([
        { value: 2, label: "2" },
        { value: 5, label: "5" },
        { value: 10, label: "10" },
    ]);
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch customers from the API
    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const response = await axiosInstance.get(`/auth/customers/all?page=${currentPage}&limit=${limit}`);
                if (response.status !== 200) {
                    throw new Error("Failed to fetch customers");
                }

                const data = response.data;
                console.log(data);
                setCustomers(data.customers);
                setTotalPages(data.totalPages);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchCustomers();
    }, [currentPage, limit]);

    
    const bulkAction = [
        { value: "delete", label: "Delete" },
    ];

    const onPageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const handleBulkCheckbox = (isCheck) => {
        setBulkCheck(isCheck);
        if (isCheck) {
            const updateChecks = {};
            customers.forEach((customer) => {
                updateChecks[customer._id] = true;
            });
            setSpecificChecks(updateChecks);
        } else {
            setSpecificChecks({});
        }
    };

    const handleCheckCustomer = (isCheck, id) => {
        setSpecificChecks((prevSpecificChecks) => ({
            ...prevSpecificChecks,
            [id]: isCheck,
        }));
    };

    const showTableRow = (selectedOption) => {
        setSelectedValue(selectedOption.label);
        setLimit(selectedOption.value);
        setCurrentPage(1);
    };

    const handleDeleteSelected = async () => {
        const selectedIds = Object.keys(specificChecks).filter((id) => specificChecks[id]);
        if (selectedIds.length === 0) {
          alert("Please select at least one customer to delete.");
          return;
        }
    
        const isConfirmed = window.confirm("Are you sure you want to delete the selected customers?");
        if (!isConfirmed) return;
    
        const success = await deleteSelectedRecords ("customer", selectedIds);
        if (success) {
          // Refresh the list of customers after deletion
          const response = await axiosInstance.get(`/auth/customers/all?page=${currentPage}&limit=${limit}`);
          setCustomers(response.data.customers);
          setSpecificChecks({}); // Reset the checkboxes
          setBulkCheck(false); // Uncheck the bulk checkbox
        }
      };
    
      // Handle bulk action dropdown
      const bulkActionDropDown = (selectedOption) => {
        if (selectedOption.value === "delete") {
          handleDeleteSelected();
        } else {
          console.log(selectedOption);
        }
      };

    const actionItems = ["Delete", "edit"];

    const handleActionItemClick = (item, itemID) => {
        const updateItem = item.toLowerCase();
        if (updateItem === "delete") {
            alert(`#${itemID} item delete`);
        } else if (updateItem === "edit") {
            navigate(`/customers/manage/${itemID}`);
        }
    };

    // Display loading state
    if (loading) {
        return <div>Loading...</div>;
    }

    // Display error state
    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <section className="customer">
            <div className="container">
                <div className="wrapper">
                    <div className="content transparent">
                        <div className="content_head">
                            <Input
                                placeholder="Search Customer..."
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
                                            
                                            <th className="td_image">image</th>
                                            <th colSpan="4">name</th>
                                            <th>email</th>
                                            <th>orders</th>
                                            <th className="td_status">status</th>
                                            <th className="td_date">created at</th>
                                            <th>actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {customers.map((customer, key) => {
                                            return (
                                                <tr key={key}>
                                                    <td className="td_checkbox">
                                                        <CheckBox
                                                            onChange={(isCheck) =>
                                                                handleCheckCustomer(isCheck, customer._id)
                                                            }
                                                            isChecked={specificChecks[customer._id] || false}
                                                        />
                                                    </td>
                                                    <td className="td_image">
                                                        <img
                                                            src={customer.image || `https://ui-avatars.com/api/?name=${customer.name}&background=random&color=fff`}
                                                            alt={customer.name}
                                                        />
                                                    </td>
                                                    <td colSpan="4">
                                                        <Link to={customer._id.toString()}>{customer.name}</Link>
                                                    </td>
                                                    <td>{customer.contact.email}</td>
                                                    <td>{customer.purchase_history.length}</td>
                                                    <td className="td_status">
                                                        {customer.status.toLowerCase() === "active" ||
                                                         customer.status.toLowerCase() === "completed" ||
                                                         customer.status.toLowerCase() === "new" ||
                                                         customer.status.toLowerCase() === "coming soon" ? (
                                                            <Badge
                                                                label={customer.status}
                                                                className="light-success"
                                                            />
                                                        ) : customer.status.toLowerCase() === "inactive" ||
                                                              customer.status.toLowerCase() === "out of stock" ||
                                                              customer.status.toLowerCase() === "locked" ||
                                                              customer.status.toLowerCase() === "discontinued" ? (
                                                            <Badge
                                                                label={customer.status}
                                                                className="light-danger"
                                                            />
                                                        ) : customer.status.toLowerCase() === "on sale" ||
                                                              customer.status.toLowerCase() === "featured" ||
                                                              customer.status.toLowerCase() === "pending" ? (
                                                            <Badge
                                                                label={customer.status}
                                                                className="light-warning"
                                                            />
                                                        ) : customer.status.toLowerCase() === "archive" ||
                                                              customer.status.toLowerCase() === "pause" ? (
                                                            <Badge
                                                                label={customer.status}
                                                                className="light-secondary"
                                                            />
                                                        ) : (
                                                            ""
                                                        )}
                                                    </td>
                                                    <td className="td_date">{customer.createdAt}</td>
                                                    <td className="td_action">
                                                        <TableAction
                                                            actionItems={actionItems}
                                                            onActionItemClick={(item) =>
                                                                handleActionItemClick(item, customer._id)
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
                        <div className="content_footer">
                            <Dropdown
                                className="top show_rows sm"
                                placeholder="please select"
                                selectedValue={selectedValue}
                                onClick={showTableRow}
                                options={tableRow}
                            />
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

export default ManageCustomer;