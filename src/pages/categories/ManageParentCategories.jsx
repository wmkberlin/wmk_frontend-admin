import * as Icons from "react-icons/tb";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Input from "../../components/common/Input.jsx";
import Badge from "../../components/common/Badge.jsx";
import Button from "../../components/common/Button.jsx";
import CheckBox from "../../components/common/CheckBox.jsx";
import Dropdown from "../../components/common/Dropdown.jsx";
import Thumbnail from "../../components/common/Thumbnail.jsx";
import Pagination from "../../components/common/Pagination.jsx";
import axiosInstance from "../../axiosInstance.js";
import deleteSelectedRecords from "../../utilis.js";

const ManageParentCategories = () => {
  const navigate = useNavigate();
  const [parentCategories, setParentCategories] = useState([]);
  const [bulkCheck, setBulkCheck] = useState(false);
  const [specificChecks, setSpecificChecks] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [searchTimeout, setSearchTimeout] = useState(null);

  // Fetch categories based on search query
  const searchCategories = async (query = "") => {
    try {
      const response = await axiosInstance.get("/admin_product/search/component", {
        params: { searchQuery: query, component: "parentCategory" },
      });
      setParentCategories(response.data.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // Handle search input change
  const handleSearch = (e) => {
    const query = e;
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    setSearchQuery(query);
    // Set a new timeout to call the API after 300ms
    const timeout = setTimeout(() => {
      searchCategories(query); // Fetch categories with the search query
    }, 300);

    // Save the timeout ID to clear it later
    setSearchTimeout(timeout);
  };

  // Fetch all parent categories on component mount
  useEffect(() => {
    const fetchParentCategories = async () => {
      try {
        const response = await axiosInstance.get("/admin_product/parent-categories");
        setParentCategories(response.data);
      } catch (error) {
        console.error("Error fetching parent categories:", error);
      }
    };
    fetchParentCategories();
  }, []);

  // Handle bulk checkbox selection
  const handleBulkCheckbox = (isCheck) => {
    setBulkCheck(isCheck);
    if (isCheck) {
      const updateChecks = {};
      parentCategories.forEach((category) => {
        updateChecks[category._id] = true;
      });
      setSpecificChecks(updateChecks);
    } else {
      setSpecificChecks({});
    }
  };

  // Handle individual checkbox selection
  const handleCheckCategory = (isCheck, id) => {
    setSpecificChecks((prevSpecificChecks) => ({
      ...prevSpecificChecks,
      [id]: isCheck,
    }));
  };

  // Handle deletion of selected records
  const handleDeleteSelected = async () => {
    const selectedIds = Object.keys(specificChecks).filter((id) => specificChecks[id]);
    if (selectedIds.length === 0) {
      alert("Please select at least one category to delete.");
      return;
    }

    const isConfirmed = window.confirm("Are you sure you want to delete the selected categories?");
    if (!isConfirmed) return;

    const success = await deleteSelectedRecords("parentCategory", selectedIds);
    if (success) {
      // Refresh the list of parent categories after deletion
      const response = await axiosInstance.get("/admin_product/parent-categories");
      setParentCategories(response.data);
      setSpecificChecks({}); // Reset the checkboxes
      setBulkCheck(false); // Uncheck the bulk checkbox
    }
  };

  return (
    <section className="categories">
      <div className="container">
        <div className="content">
          <div className="content_head">
            <Input
              placeholder="Search Parent Categories..."
              className="sm table_search"
              value={searchQuery}
              onChange={handleSearch}
            />
            <div className="btn_parent">
              <Link to="/catalog/parent-category/add" className="sm button">
                <Icons.TbPlus />
                <span>Create Parent Category</span>
              </Link>
              <Button
                label="Delete Selected"
                icon={<Icons.TbTrash />}
                className="sm danger"
                onClick={handleDeleteSelected}
              />
            </div>
          </div>
          <div className="content_body">
            <div className="table_responsive">
              <table className="separate">
                <thead>
                  <tr>
                    <th className="td_checkbox">
                      <CheckBox onChange={handleBulkCheckbox} isChecked={bulkCheck} />
                    </th>
                    
                    <th className="td_image">Image</th>
                    <th>Title</th>
                    <th>Type</th>
                    <th>Subcategories</th>
                    <th>Created At</th>
                  </tr>
                </thead>
                <tbody>
                  {[...parentCategories]
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // Sort by date descending
                    .map((category, key) => (
                      <tr key={key}>
                        <td className="td_checkbox">
                          <CheckBox
                            onChange={(isCheck) => handleCheckCategory(isCheck, category._id)}
                            isChecked={specificChecks[category._id] || false}
                          />
                        </td>
                        <td className="td_image">
                          <img src={category.image[0]} alt={category.title} width="50" height="50" />
                        </td>
                        <td>
                          <Link to={`/catalog/sub-category/${category._id}`}>{category.title}</Link>
                        </td>
                        <td>{category.type}</td>
                        <td className="td_subcategories">
                          {category.subCategoriesID.length > 0 ? (
                            <Badge label={`${category.subCategoriesID.length} Subcategories`} className="light-info" />
                          ) : (
                            <Badge label="No Subcategories" className="light-warning" />
                          )}
                        </td>
                        <td>{new Date(category.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
            <Pagination />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ManageParentCategories;