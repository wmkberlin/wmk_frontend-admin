import React, { useState, useEffect } from "react";
import axiosInstance from "../../axiosInstance.js";
import Input from "../../components/common/Input.jsx";
import Button from "../../components/common/Button.jsx";
import Badge from "../../components/common/Badge.jsx";
import Dropdown from "../../components/common/Dropdown.jsx";
import Pagination from "../../components/common/Pagination.jsx";
import TableAction from "../../components/common/TableAction.jsx";
import { useNavigate } from "react-router-dom";

const ManageSales = () => {
    const [sales, setSales] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [limit, setLimit] = useState(10);
	const navigate = useNavigate();
    // Fetch sales from the API
    useEffect(() => {
        const fetchSales = async () => {
            try {
                const response = await axiosInstance.get(`/admin_orders/all/sales?page=${currentPage}&limit=${limit}`);
                if (response.status !== 200) {
                    throw new Error("Failed to fetch sales");
                }

                const data = response.data;
                setSales(data.sales);
                setTotalPages(data.totalPages);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchSales();
    }, [currentPage, limit]);

    // Handle page change
    const onPageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    // Handle limit change
    const showTableRow = (selectedOption) => {
        setLimit(selectedOption.value);
        setCurrentPage(1);
    };

    // Handle action items (e.g., delete, edit)
    const handleActionItemClick = (item, itemID) => {
        const updateItem = item.toLowerCase();
        if (updateItem === "delete") {
            alert(`#${itemID} item delete`);
        } else if (updateItem === "view") {
            // Navigate to edit page
			navigate(`/venue/${itemID}`)
        }
    };

    const exportToExcel = () => {
        try {
          // Import xlsx library dynamically to reduce bundle size
          import('xlsx').then((XLSX) => {
            // Prepare the data for Excel export
            const excelData = sales.map((sale) => {
              // Parse shipping address
              let shippingAddress = {};
              try {
                shippingAddress = JSON.parse(sale.shipping_address);
              } catch (error) {
                console.error('Error parsing shipping address:', error);
              }
      
              // Format order lines
              const orderLines = sale.orderLines.map(line => 
                `Product ID: ${line.product_item_id}, Qty: ${line.qty}, Price: $${line.price}`
              ).join('; ');
      
              return {
                'Order ID': sale._id,
                'Customer Email': sale.user_email,
                'Order Date': new Date(sale.order_date).toLocaleString(),
                'First Name': shippingAddress.firstName || '',
                'Last Name': shippingAddress.lastName || '',
                'Address': shippingAddress.address || '',
                'City': shippingAddress.city || '',
                'Postal Code': shippingAddress.postalCode || '',
                'Apartment': shippingAddress.apartment || '',
                'Shipping Method': sale.shipping_method,
                'Order Total': `$${sale.order_total}`,
                'Payment Method': sale.paymentMethod,
                'Status': sale.order_status.status,
                'Order Lines': orderLines
              };
            });
      
            // Create a new workbook
            const workbook = XLSX.utils.book_new();
            const worksheet = XLSX.utils.json_to_sheet(excelData);
            
            // Add the worksheet to the workbook
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Sales Data');
            
            // Generate the Excel file
            const date = new Date().toISOString().split('T')[0];
            XLSX.writeFile(workbook, `Sales_Data_${date}.xlsx`);
          });
        } catch (error) {
          console.error('Error exporting to Excel:', error);
          alert('Failed to export data to Excel');
        }
      };

    const bulkActionDropDown = (action) => {
        if (action.value === "export") {
          exportToExcel();
        } 
      };

        // Bulk action options
        const bulkAction = [
            { label: "Delete", value: "delete" },
            { label: "Export", value: "export" },
        ];
      
    // Parse shipping address
    const parseShippingAddress = (shippingAddress) => {
        try {
            const address = JSON.parse(shippingAddress);
            return `${address.firstName} ${address.lastName}, ${address.address}, ${address.city}, ${address.postalCode}`;
        } catch (error) {
            return "Invalid address format";
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
        <section className="sales">
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
                                placeholder="Search Sales..."
                                className="sm table_search"
                            />
                        </div>
                        <div className="content_body">
                            <div className="table_responsive">
                                <table className="separate">
                                    <thead>
                                        <tr>
                                            
                                            <th>Customer Email</th>
                                            <th>Order Date</th>
                                            <th>Shipping Address</th>
                                            <th>Shipping Method</th>
                                            <th>Total Amount</th>
                                            <th>Payment Method</th>
                                            <th className="td_status">Status</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {sales.map((sale, key) => (
                                            <tr key={key}>
                                                <td>{sale.user_email}</td>
                                                <td>{new Date(sale.order_date).toLocaleDateString()}</td>
                                                <td>{parseShippingAddress(sale.shipping_address)}</td>
                                                <td>{sale.shipping_method}</td>
                                                <td>${sale.order_total}</td>
                                                <td>{sale.paymentMethod}</td>
                                                <td className="td_status">
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
                                                </td>
                                                <td className="td_action">
                                                    <TableAction
                                                        actionItems={["View"]}
                                                        onActionItemClick={(item) =>
                                                            handleActionItemClick(item, sale._id)
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
                            <Dropdown
                                className="top show_rows sm"
                                placeholder="please select"
                                selectedValue={limit}
                                onClick={showTableRow}
                                options={[
                                    { value: 2, label: "2" },
                                    { value: 5, label: "5" },
                                    { value: 10, label: "10" },
                                ]}
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

export default ManageSales;