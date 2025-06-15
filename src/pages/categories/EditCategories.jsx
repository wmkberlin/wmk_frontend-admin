import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Input from "../../components/common/Input.jsx";
import Dropdown from "../../components/common/Dropdown.jsx";
import FileUpload from "../../components/common/FileUpload.jsx";
import Button from "../../components/common/Button.jsx";
import TextEditor from "../../components/common/TextEditor.jsx";
import axiosInstance from "../../axiosInstance.js";
import MultiSelect from "../../components/common/MultiSelect.jsx";

const EditCategories = () => {
  const { categoryid } = useParams(); // Get category ID from URL
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState({
    shopType: "vintage",
    name: "",
    description: "",
    image: [],
    platforms: {
      ownPlatform: true,
    },
    products: [],
    parentCategory: [],
    isActive: true,
    createdAt: new Date(),
    discount: {
      percentage: 0,
      expiresAt: null,
      isActive: false,
    },
    discountInPrice: {
      percentage: 0,
      expiresAt: null,
      isActive: false
    },
  });

    useEffect(() => {
      setCategory(prev => ({
        ...prev,
        discountInPrice: {
          ...prev.discountInPrice,
          expiresAt: prev.discount.expiresAt,
          isActive: prev.discount.isActive
        }
      }));
    }, [category.discount.expiresAt, category.discount.isActive]);
  const navigate = useNavigate();

  // State to store all parent categories
  const [parentCategories, setParentCategories] = useState([]);
  const [parentCategoryObject, setParentCategoryObject] = useState([]);

  useEffect(() => {
    console.log(category.parentCategory);

    if (parentCategoryObject && parentCategoryObject.length > 0) {
      // Map over the parent IDs and find the corresponding details from parentCategories
      const details = parentCategoryObject.map((parentId) => {
        // Find the parent category in the parentCategories array
        const parent = parentCategories.find((cat) => cat._id === parentId);
        return {
          _id: parentId,
          title: parent ? parent.title : "Unknown", // Fallback if not found
        };
      });

      // Update the state with the new parentCategory details
      setCategory((prevState) => ({
        ...prevState,
        parentCategory: details, // Replace the entire parentCategory array
      }));
    }
  }, [parentCategoryObject, parentCategories]);

  // Fetch all parent categories on component mount
  useEffect(() => {
    const fetchParentCategories = async () => {
      try {
        const response = await axiosInstance.get("/admin_product/parent-categories");
        if (category.shopType === "vintage") {
          // Filter response.data for "vintage" type
          const vintageData = response.data.filter((item) => item.type === "vintage");
          setParentCategories(vintageData);
        } else {
          // Filter response.data for other types (non-vintage)
          const otherData = response.data.filter((item) => item.type !== "vintage");
          setParentCategories(otherData);
        }
      } catch (error) {
        console.error("Error fetching parent categories:", error);
      }
    };
    fetchParentCategories();
  }, [category.shopType]);

  const [isUploading, setIsUploading] = useState(false);

  // Fetch category details from API
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await axiosInstance.get(`/admin_product/products/categories/${categoryid}`);
        if (response.status !== 200) {
          throw new Error("Failed to fetch category details");
        }

        const data = await response.data;

        // Map API response to match category state structure
        const mappedCategory = {
          shopType: data.shopType || "",
          name: data.name || "",
          description: data.description || "",
          image: data.image?.src ? [data.image.src] : [], // Convert image to array
          platforms: data.platforms || { ownPlatform: true },
          products: data.products || [],
          isActive: data.isActive !== undefined ? data.isActive : true,
          createdAt: data.createdAt ? new Date(data.createdAt) : new Date(),
          handle: data.handle || "",
          parentCategory: data.parentCategory,
          discount: data.discount || {
            percentage: 0,
            expiresAt: null,
            isActive: false,
          },
          discountInPrice: data.discountInPrice || {
            percentage: 0,
            expiresAt: null,
            isActive: false,
          },
          
        };

        setCategory(mappedCategory);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching category:", error);
        setLoading(false);
      }
    };

    fetchCategory();
  }, [categoryid]);

  // Handle input changes
  const handleInputChange = (field, value) => {
    setCategory((prev) => ({ ...prev, [field]: value }));
  };

  // Handle nested input changes (e.g., platforms, discount)
  const handleNestedInputChange = (parentField, field, value) => {
    setCategory((prev) => ({
      ...prev,
      [parentField]: { ...prev[parentField], [field]: value },
    }));
    console.log(category);
    
  };

  // Handle file upload
  const handleFileUpload = async (files) => {
    setIsUploading(true);
    const uploadedImageUrls = [];
    for (const file of files) {
      const formData = new FormData();
      formData.append("file", file);
      try {
        const response = await axiosInstance.post("/admin_product/file/upload/category", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        const result = await response.data;
        if (result.success) {
          uploadedImageUrls.push(result.optimizedUrl);
        } else {
          console.error("Upload failed:", result.message);
        }
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    }

    setCategory((prevState) => ({
      ...prevState,
      image: uploadedImageUrls,
    }));
    setIsUploading(false);
  };

  // Handle form submission (update category)
  const handleSubmit = async () => {
    try {
      if (!category.name || !category.shopType) {
        alert("Name and Shop Type are required fields.");
        return;
      }

      if (category.image.length === 0) {
        alert("Please upload at least one image.");
        return;
      }

      if (isUploading) {
        alert("Please wait for the image upload to complete.");
        return;
      }

      const categoryData = {
        shopType: category.shopType,
        name: category.name,
        description: category.description,
        image: category.image,
        platforms: category.platforms,
        products: category.products,
        isActive: category.isActive,
        parentCategory: category.parentCategory,
        discount: {
          percentage: category.discount.percentage,
          expiresAt: category.discount.expiresAt,
          isActive: category.discount.isActive,
        },
        discountInPrice: {
          percentage: category.discountInPrice.percentage,
          expiresAt: category.discount.expiresAt,
          isActive: category.discount.isActive,
        },
      };

      const response = await axiosInstance.put(
        `/admin_product/products/categories/${categoryid}`,
        categoryData
      );

      if (response.status !== 200) {
        throw new Error("Failed to update category");
      }

      // // Update product prices if discount is active
      // if (category.discount.isActive && category.discount.percentage > 0) {
      //   const productsToUpdate = await axiosInstance.get(`/admin_product/products/by-category/${categoryid}`);
      //   for (const product of productsToUpdate.data) {
      //     const discountPrice = product.price * (1 - category.discount.percentage / 100);
      //     await axiosInstance.put(`/admin_product/products/${product._id}`, {
      //       discountPrice,
      //       sale: true, // Mark the product as on sale
      //     });
      //   }
      // }

      navigate("/catalog/categories/manage");
      alert("Category updated successfully!");
    } catch (error) {
      console.error("Error updating category:", error);
      alert("An error occurred while updating the category. Please try again.");
    }
  };

  return (
    <section>
      <div className="container">
        {loading ? (
          <p>Loading category details...</p>
        ) : (
          <div className="wrapper">
            <div className="content">
              <div className="content_item">
                <h2 className="sub_heading">Edit Category Info</h2>
                <Input
                  type="text"
                  placeholder="Enter category name"
                  label="Name"
                  value={category.name}
                  onChange={(value) => handleInputChange("name", value)}
                />
                <TextEditor
                  label="Description"
                  placeholder="Enter a description"
                  value={category.description}
                  onChange={(value) => handleInputChange("description", value)}
                />
              </div>

              <div className="content_item">
                <h2 className="sub_heading">Category Image</h2>
                <FileUpload onFileUpload={handleFileUpload} />
                {isUploading && <p>Uploading images... Please wait.</p>}
              </div>

              <div className="content_item">
                <h2 className="sub_heading">Parent Category</h2>
                <MultiSelect
                  placeholder="Select parent category"
                  options={parentCategories}
                  isSelected={category.parentCategory}
                  isMulti={true}
                  onChange={(value) => setParentCategoryObject(value)}
                />
              </div>

              <div className="content_item">
                <h2 className="sub_heading">Discount</h2>
                <Input
                  type="number"
                  placeholder="Enter discount percentage"
                  label="Discount Percentage"
                  value={category.discount.percentage}
                  onChange={(value) =>
                    handleNestedInputChange("discount", "percentage", parseFloat(value))
                  }
                />
              <Input
                type="number"
                placeholder="Enter discount percentage"
                label="Discount Percentage(In EUROS)"
                value={category?.discountInPrice?.percentage || 0}
                onChange={(value) =>
                  handleNestedInputChange("discountInPrice", "percentage", parseFloat(value))
                }
              />
                <Input
                  type="date"
                  placeholder="Enter discount expiry date"
                  label="Discount Expiry Date"
                  value={category.discount.expiresAt ? new Date(category.discount.expiresAt).toISOString().split('T')[0] : ""}
                  onChange={(value) =>
                    handleNestedInputChange("discount", "expiresAt", new Date(value))
                  }
                />
                <Dropdown
                  placeholder="Activate Discount"
                  selectedValue={category.discount.isActive ? "Active" : "Inactive"}
                  onClick={(value) =>
                    handleNestedInputChange("discount", "isActive", value.value === "Active")
                  }
                  options={[
                    { label: "Active", value: "Active" },
                    { label: "Inactive", value: "Inactive" },
                  ]}
                />
              </div>
            </div>

            <div className="sidebar">
              <div className="sidebar_item">
                <h2 className="sub_heading">Publish</h2>
                <Button label="Update Category" onClick={handleSubmit} />
              </div>

              <div className="sidebar_item">
                <h2 className="sub_heading">Shop Type</h2>
                <Dropdown
                  placeholder="Select shop type"
                  selectedValue={category.shopType}
                  onClick={(value) => handleInputChange("shopType", value)}
                  options={[
                    { value: "vintage", label: "Vintage" },
                    { value: "boatwood", label: "Boatwood" },
                  ]}
                />
              </div>

              <div className="sidebar_item">
                <h2 className="sub_heading">Category Status</h2>
                <Dropdown
                  placeholder="Select category status"
                  selectedValue={category.isActive ? "Active" : "Inactive"}
                  onChange={(value) => handleInputChange("isActive", value === "Active")}
                  options={[
                    { label: "Active", value: "Active" },
                    { label: "Inactive", value: "Inactive" },
                  ]}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default EditCategories;