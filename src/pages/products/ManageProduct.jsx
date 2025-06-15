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
import axiosInstance from "../../axiosInstance.js";

const ManageProduct = () => {
  const [fields, setFields] = useState({
    name: "",
    sku: "",
    store: "",
    status: "",
    priceRange: [0, 100],
  });
  const [bulkCheck, setBulkCheck] = useState(false);
  const [specificChecks, setSpecificChecks] = useState({});
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedValue, setSelectedValue] = useState(5);
  const [tableRow, setTableRow] = useState([
    { value: 2, label: "2" },
    { value: 5, label: "5" },
    { value: 10, label: "10" },
  ]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchTimeout, setSearchTimeout] = useState(null);

    // Fetch categories based on search query
const searchCategories = async (query = "") => {
  try {
    const response = await axiosInstance.get("/admin_product/search/component", {
      params: { searchQuery: query , component: "product",               page: currentPage,
        limit: productsPerPage},
    });
    setProducts(response.data.data);
    setTotalPages(response.totalPages)
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
const showTableRow = (selectedOption) => {

  setSelectedValue(selectedOption.label);

};


  const [totalPages, setTotalPages] = useState(1);
  const productsPerPage = 20;

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axiosInstance.get(`/admin_product/products`, {
          params: {
            page: currentPage,
            limit: productsPerPage,
          },
        });

        if (response.status !== 200) {
          throw new Error("Failed to fetch products");
        }

        const data = await response.data;
        setProducts(data.products);
        setTotalPages(data.totalPages);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [currentPage]);

  const handleInputChange = (key, value) => {
    setFields({
      ...fields,
      [key]: value,
    });
  };

  const bulkAction = [
    { value: "delete", label: "Delete" },
    { value: "category", label: "Category" },
    { value: "status", label: "Status" },
  ];

  const bulkActionDropDown = (selectedOption) => {
    console.log(selectedOption);
  };

  const onPageChange = (newPage) => {
    setCurrentPage(newPage);
 };

  // Handle bulk checkbox (Select All)
  const handleBulkCheckbox = (isCheck) => {
    setBulkCheck(isCheck);
    if (isCheck) {
      const updateChecks = {};
      products.forEach((product) => {
        updateChecks[product._id] = true;
      });
      setSpecificChecks(updateChecks);
    } else {
      setSpecificChecks({});
    }
  };

  // Handle individual checkbox
  const handleCheckProduct = (isCheck, id) => {
    setSpecificChecks((prevSpecificChecks) => ({
      ...prevSpecificChecks,
      [id]: isCheck,
    }));
  };

  const deleteSelectedProducts = async () => {
    try {
      const selectedIds = Object.keys(specificChecks).filter((id) => specificChecks[id]);
      if (selectedIds.length === 0) {
        alert("No products selected");
        return;
      }
  
      const response = await axiosInstance.post("/admin_product/products/delete-selected", {
        productIds: selectedIds,
      });
  
      if (response.status !== 200) {
        throw new Error("Failed to delete products");
      }
  
      // Refresh the product list for the same page
      const fetchProducts = async () => {
        try {
          const response = await axiosInstance.get(`/admin_product/products`, {
            params: {
              page: currentPage,
              limit: productsPerPage,
            },
          });
  
          if (response.status !== 200) {
            throw new Error("Failed to fetch products");
          }
  
          const data = await response.data;
          setProducts(data.products);
          setTotalPages(data.totalPages);
        } catch (error) {
          setError(error.message);
        }
      };
  
      await fetchProducts(); // Re-fetch products for the same page
  
      setSpecificChecks({}); // Clear selected products
      setBulkCheck(false); // Uncheck the "Select All" checkbox
  
      alert("Selected products deleted successfully");
    } catch (error) {
      console.error("Error deleting products:", error);
      alert("An error occurred while deleting products");
    }
  };

  const [isOffcanvasOpen, setIsOffcanvasOpen] = useState(false);

  const handleToggleOffcanvas = () => {
    setIsOffcanvasOpen(!isOffcanvasOpen);
  };

  const handleCloseOffcanvas = () => {
    setIsOffcanvasOpen(false);
  };

  const handleSliderChange = (newValues) => {
    setFields({
      ...fields,
      priceRange: newValues,
    });
  };

  const stores = [
    { label: "FashionFiesta" },
    { label: "TechTreasures" },
    { label: "GadgetGrove" },
    { label: "HomeHarbor" },
    { label: "HealthHaven" },
    { label: "BeautyBoutique" },
    { label: "Bookworm's Haven" },
    { label: "PetParadise" },
    { label: "FoodieFinds" },
  ];

  const status = [
    { label: "In Stock" },
    { label: "Out of Stock" },
    { label: "Available Soon" },
    { label: "Backorder" },
    { label: "Refurbished" },
    { label: "On Sale" },
    { label: "Limited Stock" },
    { label: "Discontinued" },
    { label: "Coming Soon" },
    { label: "New Arrival" },
    { label: "Preorder" },
  ];

  const handleSelectStore = (selectedValues) => {
    setFields({
      ...fields,
      store: selectedValues,
    });
  };

  const handleSelectStatus = (selectedValues) => {
    setFields({
      ...fields,
      status: selectedValues.label,
    });
  };
  const returnDateReadable = (isoDate) => {
  const readableDate = new Date(isoDate).toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  return readableDate;
}

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <section className="products">
      <div className="container">
        <div className="wrapper">
          <div className="content transparent">
            <div className="content_head">
              <Input
                placeholder="Search Product By SKU or Name..."
                className="sm table_search"
                value={searchQuery}
                onChange={handleSearch}
              />
              <div className="btn_parent">
                <Link to="/catalog/product/add" className="sm button">
                  <Icons.TbPlus />
                  <span>Create Product</span>
                </Link>
                <Button
                  label="Delete Selected"
                  icon={<Icons.TbTrash />}
                  className="sm danger"
                  onClick={deleteSelectedProducts}
                />
                <Button
                  label="Reload"
                  icon={<Icons.TbRefresh />}
                  className="sm"
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
                      
                      <th className="td_image">image</th>
                      <th className="td_name" colSpan="4">name</th>
                      <th>price</th>
                      <th>store</th>
                      <th>sku</th>
                      <th>created at</th>
                      <th className="td_status">status</th>
                      <th className="td_status">stock status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product, key) => (
                      <tr key={key}>
                        <td className="td_checkbox">
                          <CheckBox
                            onChange={(isCheck) => handleCheckProduct(isCheck, product._id)}
                            isChecked={specificChecks[product._id] || false}
                          />
                        </td>
                        <td className="td_image">
                          <img
                            src={product.productImages?.[0] || "placeholder-image-url"}
                          />
                        </td>
                        <td className="hyperlink-ProductText" colSpan="4">
                          <Link to={product._id}>{product.title}</Link>
                        </td>
                        <td>
                          {`${product.pricing.price} `}
                          <b>€</b>
                        </td>
                        <td>{product.shopType}</td>
                        <td>{product.SKU}</td>
                        <td>{returnDateReadable(product.createdAt)}</td>
                        <td className="td_status">{product.rating || "No Ratings"}</td>
                        <td className="td_status">
                          {product.stockAmt > 0 ? (
                            <Badge label="In Stock" className="light-success" />
                          ) : (
                            <Badge label="Out of Stock" className="light-danger" />
                          )}
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

export default ManageProduct;