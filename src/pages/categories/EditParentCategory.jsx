import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Input from "../../components/common/Input.jsx";
import FileUpload from "../../components/common/FileUpload.jsx";
import Button from "../../components/common/Button.jsx";
import TextEditor from "../../components/common/TextEditor.jsx";
import axiosInstance from "../../axiosInstance.js";
import Dropdown from "../../components/common/Dropdown.jsx";

const EditParentCategory = () => {
  const { id } = useParams(); // Get the category ID from the URL
  const navigate = useNavigate();
  const [parentCategory, setParentCategory] = useState({
    title: "",
    description: "",
    image: [],
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

  // Fetch the existing category data on component mount
  useEffect(() => {
    const fetchParentCategory = async () => {
      try {
        const response = await axiosInstance.get(`/admin_product/parent-categories/${id}`);
        const categoryData = response.data;

        // Populate the form fields with the fetched data
        setParentCategory({
          title: categoryData.title,
          description: categoryData.description,
          image: categoryData.image || [], // Ensure image is an array
          subCategoriesID: categoryData.subCategoriesID || [], // Ensure subCategoriesID is an array
          type: categoryData.type
        });
      } catch (error) {
        console.error("Error fetching parent category:", error);
        alert("Failed to fetch parent category data. Please try again.");
      }
    };

    fetchParentCategory();
  }, [id]);

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
        type: parentCategory.type
      };

      // Call the API to update the parent category
      const response = await axiosInstance.put(
        `/admin_product/parent-categories/${id}`,
        categoryData
      );

      // Check if the request was successful
      if (response.status === 200) {
        alert("Parent Category updated successfully!");
        // Navigate back to the parent categories list
        navigate("/catalog/sub-category/manage");
      } else {
        throw new Error("Failed to update parent category");
      }
    } catch (error) {
      console.error("Error updating parent category:", error);
      alert("An error occurred while updating the parent category. Please try again.");
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
              {/* Display existing images */}
              {parentCategory.image.length > 0 && (
                <div className="existing-images">
                  <h3>Existing Images</h3>
                  <div className="image-list">
                    {parentCategory.image.map((img, index) => (
                      <img
                        key={index}
                        src={img}
                        alt={`Category Image ${index + 1}`}
                        width="100"
                        height="100"
                        style={{ marginRight: "10px" }}
                      />
                    ))}
                  </div>
                </div>
              )}
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

export default EditParentCategory;