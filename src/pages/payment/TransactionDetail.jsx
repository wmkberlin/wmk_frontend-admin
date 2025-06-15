// TransactionDetail Component
import React, { useEffect, useState } from 'react';
import * as Icons from "react-icons/tb";
import { Link, useParams } from 'react-router-dom';
import Profile from "../../components/common/Profile.jsx";
import axiosInstance from '../../axiosInstance.js';

const TransactionDetail = () => {
  const { transactionId } = useParams();
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        const response = await axiosInstance.get(
          `https://wmk-backend.onrender.com/api/admin_payment/transactions/${transactionId}`
        );
        if (response.status !== 200) {
          throw new Error("Failed to fetch orders");
        }
        const data = response.data;
        setTransaction(data);
      } catch (error) {
        console.error("Error fetching transaction details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTransaction();
  }, [transactionId]);

  if (loading) return <p>Loading transaction details...</p>;
  if (!transaction) return <p>Transaction not found</p>;

  return (
    <section className="transaction-detail">
      <div className="container">
        <div className="wrapper">
          <div className="content">
            <div className="content_item">
              <table className="bordered normal">
                <thead>
                  <tr>
                    <th>Attribute</th>
                    <th>Value</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="td_id">Payment ID</td>
                    <td>{transaction.paymentId}</td>
                  </tr>
                  <tr>
                    <td className="td_id">Payer Name</td>
                    <td>{transaction.payer.name.givenName} {transaction.payer.name.surname}</td>
                  </tr>
                  <tr>
                    <td className="td_id">Email</td>
                    <td>{transaction.payer.email}</td>
                  </tr>
                  <tr>
                    <td className="td_id">Amount</td>
                    <td>{transaction.captures[0]?.amount.value} {transaction.captures[0]?.amount.currencyCode}</td>
                  </tr>
                  <tr>
                    <td className="td_id">Status</td>
                    <td>{transaction.status}</td>
                  </tr>
                  <tr>
                    <td className="td_id">Created At</td>
                    <td>{new Date(transaction.captures[0]?.createTime).toLocaleString()}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="sidebar">
            <div className="sidebar_item">
              <h2 className="sub_heading">Payer Details:</h2>
              <div className="column">
                <Profile
                  name={`${transaction.payer.name.givenName} ${transaction.payer.name.surname}`}
                  slogan="Payer"
                  src="/default-avatar.png"
                />
              </div>
              <div className="column">
                <div className="detail_list">
                  <div className="detail_list_item">
                    <Icons.TbMail />
                    <p>{transaction.payer.email}</p>
                  </div>
                  <div className="detail_list_item">
                    <Icons.TbLocation />
                    <p>{transaction.shipping.countryCode}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default TransactionDetail;
