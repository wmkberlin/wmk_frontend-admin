import * as Icons from "react-icons/tb";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../../components/common/Input.jsx";
import Badge from "../../components/common/Badge.jsx";
import Button from "../../components/common/Button.jsx";
import CheckBox from "../../components/common/CheckBox.jsx";
import Dropdown from "../../components/common/Dropdown.jsx";
import Pagination from "../../components/common/Pagination.jsx";
import axiosInstance from "../../axiosInstance.js";

const ManageCategories = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [bulkCheck, setBulkCheck] = useState(false);
  const [specificChecks, setSpecificChecks] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); // Current page
  const [totalPages, setTotalPages] = useState(1); // Total pages
  const [limit, setLimit] = useState(10); // Items per page

  // Fetch categories on component mount or page change
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get("/admin_product/products/categories", {
          params: { page: currentPage, limit },
        });

        if (response.status !== 200) {
          throw new Error("Failed to fetch categories");
        }

        const { categories, totalPages } = response.data;
        setCategories(categories);
        setTotalPages(totalPages);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, [currentPage, limit]); // Re-fetch when page or limit changes

  // Fetch categories based on search query
  const searchCategories = async (query = "") => {
    try {
      const response = await axiosInstance.get("/admin_product/search/component", {
        params: { searchQuery: query, component: "category", page: currentPage, limit },
      });
      setCategories(response.data.data);
      setTotalPages(response.data.totalPages);
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
    const timeout = setTimeout(() => {
      searchCategories(query);
    }, 300);
    setSearchTimeout(timeout);
  };

  // Handle bulk checkbox (Select All)
  const handleBulkCheckbox = (isCheck) => {
    setBulkCheck(isCheck);
    if (isCheck) {
      const updateChecks = {};
      categories.forEach((category) => {
        updateChecks[category._id] = true;
      });
      setSpecificChecks(updateChecks);
    } else {
      setSpecificChecks({});
    }
  };

  // Handle individual checkbox
  const handleCheckCategory = (isCheck, id) => {
    setSpecificChecks((prevSpecificChecks) => ({
      ...prevSpecificChecks,
      [id]: isCheck,
    }));
  };

  const deleteSelectedCategories = async () => {
    try {
      const selectedIds = Object.keys(specificChecks).filter((id) => specificChecks[id]);
      if (selectedIds.length === 0) {
        alert("No categories selected");
        return;
      }
  
      const response = await axiosInstance.post("/admin_product/categories/delete-selected", {
        categoryIds: selectedIds,
      });
  
      if (response.status !== 200) {
        throw new Error("Failed to delete categories");
      }
  
      // Refresh the category list for the same page
      const fetchCategories = async () => {
        try {
          const response = await axiosInstance.get("/admin_product/products/categories", {
            params: { page: currentPage, limit },
          });
  
          if (response.status !== 200) {
            throw new Error("Failed to fetch categories");
          }
  
          const { categories, totalPages } = response.data;
          setCategories(categories);
          setTotalPages(totalPages);
        } catch (error) {
          console.error("Error fetching categories:", error);
        }
      };
  
      await fetchCategories(); // Re-fetch categories for the same page
  
      setSpecificChecks({}); // Clear selected categories
      setBulkCheck(false); // Uncheck the "Select All" checkbox
  
      alert("Selected categories deleted successfully");
    } catch (error) {
      console.error("Error deleting categories:", error);
      alert("An error occurred while deleting categories");
    }
  };

  // Handle page change
  const onPageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <section className="categories">
      <div className="container">
        <div className="content">
          <div className="content_head">
            <Input
              placeholder="Search Categories..."
              className="sm table_search"
              value={searchQuery}
              onChange={handleSearch}
            />
            <div className="btn_parent">
              <Link to="/catalog/category/add" className="sm button">
                <Icons.TbPlus />
                <span>Create Categories</span>
              </Link>
              <Button
                label="Delete Selected"
                icon={<Icons.TbTrash />}
                className="sm danger"
                onClick={deleteSelectedCategories}
              />
            </div>
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
                    
                    <th className="td_image">Image</th>
                    <th>Name</th>
                    <th>Parent Category</th>
                    <th>Shop Type</th>
                    <th>Status</th>
                    <th>Created At</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((category, key) => (
                    <tr key={key}>
                      <td className="td_checkbox">
                        <CheckBox
                          onChange={(isCheck) => handleCheckCategory(isCheck, category._id)}
                          isChecked={specificChecks[category._id] || false}
                        />
                      </td>
                      <td className="td_image">
                        <img src={category.image?.src} alt={category.name} width="50" height="50" />
                      </td>
                      <td>
                        <Link to={`/catalog/category/${category._id}`}>{category.name}</Link>
                      </td>
                      <td>
                        {category.parentCategory?.title || "No Parent Category Assigned"}
                      </td>
                      <td>{category.shopType}</td>
                      <td className="td_status">
                        <Badge
                          label={category.isActive ? "Active" : "Inactive"}
                          className={category.isActive ? "light-success" : "light-danger"}
                        />
                      </td>
                      <td>{new Date(category.createdAt).toLocaleDateString()}</td>
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
    </section>
  );
};

export default ManageCategories;