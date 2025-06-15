import React, { useState, useEffect } from "react";
import axiosInstance from "../../axiosInstance.js";
import Input from "../../components/common/Input.jsx";
import Button from "../../components/common/Button.jsx";
import Dropdown from "../../components/common/Dropdown.jsx";
import { useNavigate } from "react-router-dom";

const ManageNewsLetter = () => {
    const [emailList, setEmailList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    // Fetch newsletter subscriptions
    useEffect(() => {
        const fetchNewsletter = async () => {
            try {
                const response = await axiosInstance.get("/auth/subscription");
                
                // Ensure response.data is an array
                console.log(response);
                
                const data = Array.isArray(response.data.data) ? response.data.data : [];
                setEmailList(data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
                setEmailList([]); // Reset to empty array on error
            }
        };
        fetchNewsletter();
    }, []);

    const bulkActionDropDown = (action) => {
        if (action.value === "export") {
            exportToExcel();
        } else if (action.value === "delete") {
            // Implement delete functionality
        }
    };

    const bulkAction = [
        { label: "Delete", value: "delete" },
        { label: "Export", value: "export" },
    ];

    const filteredEmails = Array.isArray(emailList) 
        ? emailList.filter(email => 
            email?.email?.toLowerCase().includes(searchTerm.toLowerCase())
          )
        : [];

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    if (error) {
        return <div className="error">Error: {error}</div>;
    }

    return (
        <section className="newsletter">
            <div className="container">
                <div className="wrapper">
                    <div className="content transparent">
                        <div className="content_head">
                            <Dropdown
                                placeholder="Bulk Action"
                                className="sm"
                                onChange={bulkActionDropDown}
                                options={bulkAction}
                            />
                            <Input
                                placeholder="Search Emails..."
                                className="sm table_search"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="content_body">
                            <div className="table_responsive">
                                <table className="separate">
                                    <thead>
                                        <tr>
                                            <th>Email</th>
                                            <th>Subscription Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredEmails.length > 0 ? (
                                            filteredEmails.map((subscription, index) => (
                                                <tr key={subscription._id || index}>
                                                    <td>{subscription.email}</td>
                                                    <td>
                                                        {new Date(subscription.subscribedAt).toLocaleDateString()}
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="3" className="text-center">
                                                    No subscriptions found
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ManageNewsLetter;