import React, { useState, useEffect } from "react";
import Input from "../../components/common/Input.jsx";
import Dropdown from "../../components/common/Dropdown.jsx";
import FileUpload from "../../components/common/FileUpload.jsx";
import Button from "../../components/common/Button.jsx";
import TextEditor from "../../components/common/TextEditor.jsx";
import axiosInstance from "../../axiosInstance.js";
import { useNavigate } from "react-router-dom";
import MultiSelect from "../../components/common/MultiSelect.jsx";

const AddCategories = () => {
  const [category, setCategory] = useState({
    shopType: "vintage",
    name: "",
    description: "",
    image: [""],
    platforms: {
      ownPlatform: true
    },
    products: [],
    parentCategory: [],
    isActive: true,
    discount: {
      percentage: 0,
      expiresAt: null,
      isActive: false
    },
    discountInPrice: {
      percentage: 0,
      expiresAt: null,
      isActive: false
    },
    createdAt: new Date(),
  });

  const navigate = useNavigate();
  const [isUploading, setIsUploading] = useState(false);

  // Handle input changes
  const handleInputChange = (field, value) => {
    setCategory((prev) => ({ ...prev, [field]: value }));
  };

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

  // Handle nested input changes (e.g., platforms, discount)
  const handleNestedInputChange = (parentField, field, value) => {
    setCategory((prev) => ({
      ...prev,
      [parentField]: { ...prev[parentField], [field]: value },
    }));
  };

  const [parentCategoryObject, setParentCategoryObject] = useState([]);
  useEffect(() => {
    console.log(category);
    
  }, [category.parentCategory])
  
  // Handle file upload for category image
  const handleFileUpload = async (files) => {
    setIsUploading(true);
    const uploadedImageUrls = [];
    for (const file of files) {
      const formData = new FormData();
      formData.append("file", file);
      try {
        const response = await axiosInstance.post(
          "/admin_product/file/upload/category",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        const result = await response.data;
        if (result.success) {
          const fileUrl = result.optimizedUrl;
          uploadedImageUrls.push(fileUrl);
        } else {
          console.error("Upload failed:", result.message);
        }
        setIsUploading(false); // Set uploading status to true
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    }
    setCategory((prevState) => ({
      ...prevState,
      image: uploadedImageUrls,
    }));
    console.log(category);
  };

  const handleShopTypeChange = (selectedOption) => {
    setCategory(prevState => ({
      ...prevState,
      shopType: selectedOption.value,
    }));
  };

  const [parentCategories, setParentCategories] = useState([]);
  const [data, setData] = useState([]);

  useEffect(() => {
    console.log(category.parentCategory);
  
    if (parentCategoryObject && parentCategoryObject.length > 0) {
      // Extract the array of parent IDs from the "0" key
  
      // Map over the parent IDs and find the corresponding details from parentCategories
      const details = parentCategoryObject.map((parentId) => {
        // Find the parent category in the parentCategories array
        const parent = parentCategories.find((cat) => cat._id === parentId);
        return {
          _id: parentId,
          title: parent ? parent.title : 'Unknown', // Fallback if not found
        };
      });
  
      // Update the state with the new parentCategory details
      setCategory((prevState) => ({
        ...prevState,
        parentCategory: details,
      }));
    }
  }, [parentCategoryObject, parentCategories]);


  const [selectOptionsShopType, setSelectOptionsShopType] = useState([
    { value: "vintage", label: "Vintage" },
    { value: "boatwood", label: "Boatwood" }
  ]);

    // Fetch all parent categories on component mount
    useEffect(() => {
      const fetchParentCategories = async () => {
        try {
          const response = await axiosInstance.get("/admin_product/parent-categories");
          setData(response.data);
          if (category.shopType === "vintage") {
            // Filter response.data for "vintage" type
            const vintageData = response.data.filter(item => item.type === "vintage");
            console.log(vintageData);
            
            setParentCategories(vintageData);
          } else {
            // Filter response.data for other types (non-vintage)
            const otherData = response.data.filter(item => item.type === "boatwood");
            setParentCategories(otherData);
          }
        } catch (error) {
          console.error("Error fetching parent categories:", error);
        }
      };
      fetchParentCategories();
    }, []);


    useEffect(() => {
      if (category.shopType === "vintage") {
        // Filter response.data for "vintage" type
        const vintageData = data.filter(item => item.type === "vintage");
        console.log(vintageData);
        
        setParentCategories(vintageData);
      } else {
        // Filter response.data for other types (non-vintage)
        const otherData = data.filter(item => item.type === "boatwood");
        setParentCategories(otherData);
      }
    }, [category.shopType])
    
  // Handle form submission
  const handleSubmit = async () => {
    try {
      if (!category.name || !category.shopType) {
        alert("Name and Shop Type are required fields.");
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

      const response = await axiosInstance.post(
        "/admin_product/products/categories",
        categoryData
      );

      if (response.status !== 200 && response.status !== 201) {
        throw new Error("Failed to add category");
      }

      alert("Category saved successfully!");
      navigate("/catalog/categories/manage");
    } catch (error) {
      console.error("Error saving category:", error);
      alert("An error occurred while saving the category. Please try again.");
    }
  };

  return (
    <section>
      <div className="container">
        <div className="wrapper">
          <div className="content">
            <div className="content_item">
              <h2 className="sub_heading">Category Info</h2>
              <Input
                type="text"
                placeholder="Enter the category name"
                label="Name"
                value={category.name}
                onChange={(value) => handleInputChange("name", value)}
              />
              <Input
                type="text"
                placeholder="Enter the category handle (URL-friendly)"
                label="Handle"
                value={category.handle}
                onChange={(value) => handleInputChange("handle", value)}
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
              <FileUpload onFileUpload={handleFileUpload}/>
              {isUploading && <p>Uploading images... Please wait.</p>}
            </div>
            <div className="content_item">
              <h2 className="sub_heading">Parent Category</h2>
               <MultiSelect
                placeholder="Select parent category"
                options={parentCategories}
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
                onChange={(value) =>
                  handleNestedInputChange("discount", "isActive", value === "Active")
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
              <Button label="Save & Exit" onClick={handleSubmit} />
              <Button label="Save" onClick={handleSubmit} className="success" />
            </div>
            <div className="sidebar_item">
              <h2 className="sub_heading">Shop Type</h2>
              <Dropdown
                placeholder="Select shop type"
                selectedValue={category.shopType}
                onClick={(value) => handleShopTypeChange(value)}
                options={selectOptionsShopType}
              />
            </div>
            <div className="sidebar_item">
              <h2 className="sub_heading">Category Status</h2>
              <Dropdown
                placeholder="Select category status"
                selectedValue={category.isActive ? "Active" : "Inactive"}
                onChange={(value) =>
                  handleInputChange("isActive", value === "Active")
                }
                options={[
                  { label: "Active", value: "Active" },
                  { label: "Inactive", value: "Inactive" },
                ]}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AddCategories;