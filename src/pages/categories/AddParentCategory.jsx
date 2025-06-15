import React, { useState } from "react";
import Input from "../../components/common/Input.jsx";
import FileUpload from "../../components/common/FileUpload.jsx";
import Button from "../../components/common/Button.jsx";
import TextEditor from "../../components/common/TextEditor.jsx";
import axiosInstance from "../../axiosInstance.js";
import Dropdown from "../../components/common/Dropdown.jsx";

const AddParentCategory = () => {
  // State to manage parent category data
  const [parentCategory, setParentCategory] = useState({
    title: "",
    description: "",
    image: ["https://s3bucketwmk.s3.ap-southeast-2.amazonaws.com/category/Wohnzimmer_1.webp"],
    subCategoriesID: [],
    type: "Vintage"
  });

    const [selectOptionsShopType, setSelectOptionsShopType] = useState([
      { value: "vintage", label: "Vintage" },
      { value: "boatwood", label: "Boatwood" }
    ]);
    const handleShopTypeChange = (selectedOption) => {
      setParentCategory(prevState => ({
        ...prevState,
        type: selectedOption.value,
      }));
    };

  // Handle input changes
  const handleInputChange = (field, value) => {
    setParentCategory((prev) => ({ ...prev, [field]: value }));
  };

  // Handle file upload for category image
  const handleFileUpload = async (files) => {
    const uploadedImageUrls = [];
    for (const file of files) {
      const formData = new FormData();
      formData.append("file", file); // Append each file to FormData
      try {
        // Upload file to the server
        const response = await axiosInstance.post(
          "/admin_product/file/upload/category",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data", // Important for file upload
            },
          }
        );

        const result = await response.data;

        if (result.success) {
          // Assuming the server returns the file URL or path
          const fileUrl = result.optimizedUrl; // Adjust this based on your server response
          uploadedImageUrls.push(fileUrl); // Store the URL in the array
        } else {
          console.error("Upload failed:", result.message);
        }
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    }
    // Update image in the state with the uploaded image URLs
    setParentCategory((prevState) => ({
      ...prevState,
      image: uploadedImageUrls,
    }));
  };

  // Handle form submission
  const handleSubmit = async () => {
    try {
      // Validate required fields
      if (!parentCategory.title || !parentCategory.description) {
        alert("Title and Description are required fields.");
        return;
      }

      // Prepare the data to be sent to the API
      const categoryData = {
        title: parentCategory.title,
        description: parentCategory.description,
        image: parentCategory.image,
        subCategoriesID: parentCategory.subCategoriesID,
      };

      // Call the API to save the parent category
      const response = await axiosInstance.post("/admin_product/parent-categories", categoryData);

      // Check if the request was successful
      if (response.status === 201) {
        alert("Parent Category saved successfully!");
        // Reset the form
        setParentCategory({
          title: "",
          description: "",
          image: [],
          subCategoriesID: [],
        });
        navigate("/catalog/sub-category/manage");
      } else {
        throw new Error("Failed to save parent category");
      }
    } catch (error) {
      console.error("Error saving parent category:", error);
      alert("An error occurred while saving the parent category. Please try again.");
    }
  };

  return (
    <section>
      <div className="container">
        <div className="wrapper">
          <div className="content">
            <div className="content_item">
              <h2 className="sub_heading">Parent Category Info</h2>
              <Input
                type="text"
                placeholder="Enter the category title"
                label="Title"
                value={parentCategory.title}
                onChange={(value) => handleInputChange("title", value)}
              />
              <TextEditor
                label="Description"
                placeholder="Enter a description"
                value={parentCategory.description}
                onChange={(value) => handleInputChange("description", value)}
              />
            </div>
            <div className="content_item">
              <h2 className="sub_heading">Category Image</h2>
              <FileUpload onFileUpload={handleFileUpload} />
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
                selectedValue={parentCategory.type}
                onClick={(value) => handleShopTypeChange(value)}
                options={selectOptionsShopType}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AddParentCategory;