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

const SoldOutProducts = () => {
  const [bulkCheck, setBulkCheck] = useState(false);
  const [specificChecks, setSpecificChecks] = useState({});
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const productsPerPage = 20;

  // Fetch out-of-stock products from API
  useEffect(() => {
    const fetchSoldOutProducts = async () => {
      try {
        const response = await axiosInstance.get(`/admin_product/outOfStock`, {
          params: {
            page: currentPage,
            limit: productsPerPage,
          },
        });

        if (response.status !== 200) {
          throw new Error("Failed to fetch out-of-stock products");
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

    fetchSoldOutProducts();
  }, [currentPage]);

  // Search functionality for out-of-stock products
  const searchSoldOutProducts = async (query = "") => {
    try {
      const response = await axiosInstance.get("/admin_product/outOfStock/search", {
        params: { 
          searchQuery: query,
          page: currentPage,
          limit: productsPerPage
        },
      });
      setProducts(response.data.products);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching out-of-stock products:", error);
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
      searchSoldOutProducts(query);
    }, 300);

    setSearchTimeout(timeout);
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
          const response = await axiosInstance.get(`/admin_product/products/out-of-stock`, {
            params: {
              page: currentPage,
              limit: productsPerPage,
            },
          });
  
          if (response.status !== 200) {
            throw new Error("Failed to fetch out-of-stock products");
          }
  
          const data = await response.data;
          setProducts(data.products);
          setTotalPages(data.totalPages);
        } catch (error) {
          setError(error.message);
        }
      };
  
      await fetchProducts();
      setSpecificChecks({});
      setBulkCheck(false);
      alert("Selected products deleted successfully");
    } catch (error) {
      console.error("Error deleting products:", error);
      alert("An error occurred while deleting products");
    }
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
                placeholder="Search Out-of-Stock Products..."
                className="sm table_search"
                value={searchQuery}
                onChange={handleSearch}
              />
              <div className="btn_parent">
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
                  onClick={() => {
                    setCurrentPage(1);
                    setSearchQuery("");
                    setLoading(true);
                  }}
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
                            alt={product.title}
                          />
                        </td>
                        <td className="hyperlink-ProductText" colSpan="4">
                          <Link to={`/catalog/product/manage/${product._id}`}>{product.title}</Link>
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
                          <Badge label="Out of Stock" className="light-danger" />
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

export default SoldOutProducts;