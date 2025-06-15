import * as Icons from "react-icons/tb";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../../components/common/Input.jsx";
import Badge from "../../components/common/Badge.jsx";
import Button from "../../components/common/Button.jsx";
import CheckBox from "../../components/common/CheckBox.jsx";
import Dropdown from "../../components/common/Dropdown.jsx";
import Offcanvas from "../../components/common/Offcanvas.jsx";
import Pagination from "../../components/common/Pagination.jsx";
import TableAction from "../../components/common/TableAction.jsx";
import RangeSlider from "../../components/common/RangeSlider.jsx";
import MultiSelect from "../../components/common/MultiSelect.jsx";
import axios from "axios";
import axiosInstance from "../../axiosInstance.js";

const ManageTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [fields, setFields] = useState({
    name: "",
    order_id: "",
    status: "",
    priceRange: [0, 100],
  });
  const [bulkCheck, setBulkCheck] = useState(false);
  const [specificChecks, setSpecificChecks] = useState({});
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState('');
  const [selectedValue, setSelectedValue] = useState(10);

  useEffect(() => {
    fetchTransactions();
  }, [currentPage]);

  const fetchTransactions = async () => {
    try {
      const response = await axiosInstance.get(
        `https://wmk-backend.onrender.com/api/admin_payment/payments?page=${currentPage}&limit=${selectedValue}`
      );
      if (response.status !== 200) {
        throw new Error("Failed to fetch orders");
      }
      setTransactions(response.data.payments);
      setTotalPage(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  const handleInputChange = (key, value) => {
    setFields({
      ...fields,
      [key]: value,
    });
  };

  const handleBulkCheckbox = (isCheck) => {
    setBulkCheck(isCheck);
    setSpecificChecks(isCheck ? transactions.reduce((acc, t) => ({ ...acc, [t.paymentId]: true }), {}) : {});
  };

  const handleCheckProduct = (isCheck, id) => {
    setSpecificChecks((prev) => ({ ...prev, [id]: isCheck }));
  };

  const actionItems = ["Delete", "Edit"];
  const handleActionItemClick = (item, itemID) => {
    if (item.toLowerCase() === "delete") {
      alert(`#${itemID} item deleted`);
    } else if (item.toLowerCase() === "edit") {
      navigate(`/payment/transactions/${itemID}`);
    }
  };

  return (
    <section className="transactions">
      <div className="container">
        <div className="content transparent">
          <div className="content_head">
            <Input placeholder="Search Transaction..." className="sm table_search" />
            <Button label="Reload" icon={<Icons.TbRefresh />} className="sm" onClick={fetchTransactions} />
          </div>
          <div className="content_body">
            <div className="table_responsive">
              <table className="separate">
                <thead>
                  <tr>
                    <th><CheckBox onChange={handleBulkCheckbox} isChecked={bulkCheck} /></th>
                    <th>Charge ID</th>
                    <th>Payer Name</th>
                    <th>Amount</th>
                    <th>Payment Channel</th>
                    <th>Status</th>
                    <th>Created At</th>
                    <th>Operations</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction) => (
                    <tr key={transaction.paymentId}>
                      <td>
                        <CheckBox
                          onChange={(isCheck) => handleCheckProduct(isCheck, transaction.paymentId)}
                          isChecked={specificChecks[transaction.paymentId] || false}
                        />
                      </td>
                      <td>{transaction.paymentId}</td>
                      <td>
                        <Link to={`/transactions/${transaction.paymentId}`}>
                          {transaction.payer?.name?.givenName} {transaction.payer?.name?.surname}
                        </Link>
                      </td>
                      <td>
                        {transaction.captures?.[0]?.amount?.value} {transaction.captures?.[0]?.amount?.currencyCode}
                      </td>
                      <td>{transaction.paymentSource?.paypal?.emailAddress || "N/A"}</td>
                      <td>
                        <Badge label={transaction.status} className={transaction.status === "Completed" ? "light-success" : "light-warning"} />
                      </td>
                      <td>{new Date(transaction.captures?.[0]?.createTime).toLocaleDateString()}</td>
                      <td>
                        <TableAction
                          actionItems={actionItems}
                          onActionItemClick={(item) => handleActionItemClick(item, transaction.paymentId)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="content_footer">
            <Pagination currentPage={currentPage} totalPages={totalPage} onPageChange={setCurrentPage} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ManageTransactions;