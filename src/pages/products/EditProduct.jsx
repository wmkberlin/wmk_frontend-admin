import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Input from "../../components/common/Input.jsx";
import Button from "../../components/common/Button.jsx";
import TextEditor from "../../components/common/TextEditor.jsx";
import FileUpload from "../../components/common/FileUpload.jsx";
import Dropdown from "../../components/common/Dropdown.jsx";
import CheckBox from "../../components/common/CheckBox.jsx";
import axiosInstance from "../../axiosInstance.js";
import PackagingSelector from "../../components/common/PackagingSelector.jsx";
import MultiSelect from "../../components/common/MultiSelect.jsx";

const EditProduct = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [product, setProduct] = useState({
    shopType: "vintage",
    chargeTax: 0,
    collections: [],
    stockAmt: 1,
    pricing: {
      price: 0,
      currency: "EUROS",
      comparePrice: 0
    },
    SKU: "",
    productImages: [],
    title: "",
    subtitle: "",
    descriptions: [
      `Maße (B/T/H) ca. in cm:  <br/>Artikelnummer im Shop: `,
    ],
    rating: 0,
    dimensions: {
      length: 0,
      height: 0,
      width: 0,
      weight: 0,
    },
    dimensionsForCargoBoard: {
      length: 0,
      height: 0,
      width: 0,
      weight: 0,
    },
    packaging: {
      type: "",
      subType: "",
    },
    Category: [],
    productStatus: "active",
    productPlace: ["new"],
    assemblyService: false,
    isProductHeavy: false,
    earRating: 10,
    noseRating: 10,
    eyeRating: 9,
    isVariantsAvailable: false,
    variants: [],
    similarToTitle: "",
    zustandText: "",
    metaTitle: "",
    metaDescription: "",
    metaLink: "https://wmk-ecommerce.onrender.com/#/product/",
    notes: ""
  });

  const [defaultData, setDefaultData] = useState({
    shopInfo: '',
    subtopic: '',
    storyShop: '',
    aboutUs: ''
  });

  const [errors, setErrors] = useState({});

  const generateZustandText = (earRating, eyeRating, noseRating) => {
    return product.shopType === "vintage" ?
      `WMK Zustandsscore: <br/><ul><li>Technischer Zustand : ${earRating}/10</li><li>Optischer Zustand : ${eyeRating}/10</li><li>Geruchsneutralität : ${noseRating}/10</li></ul><p>Vintage Möbel haben in der Regel altersbedingte Gebrauchsspuren. Der WMK Score ist, zusammen mit unseren detailreichen Fotos, eine übersichtliche und ehrliche Zustandsbewertung unserer Möbel. So wissen Sie, möglichst genau was Sie für Ihr Geld bekommen.</p>`
      : '';
  };

  useEffect(() => {
    if (product.descriptions[0] == "") {
      const updatedDescription = `Maße (B/T/H) ca. in cm: ${product.dimensions.length}X${product.dimensions.height}X${product.dimensions.width} <br/>Artikelnummer im Shop: ${product.SKU}`;
      setProduct((prevState) => ({
        ...prevState,
        descriptions: [updatedDescription],
      }));
    }


  }, [product.SKU, product.dimensions.length, product.dimensions.height, product.dimensions.width]);


  useEffect(() => {
    const updatedZustandText = generateZustandText(
      product.earRating,
      product.eyeRating,
      product.noseRating
    );
    setProduct((prevState) => ({
      ...prevState,
      zustandText: updatedZustandText,
    }));
  }, [product.earRating, product.eyeRating, product.noseRating]);

  const [packaging, setPackaging] = useState({ type: null, subtypes: [] });

  const extractTextBetweenHash = (text) => {
    const regex = /#([^#]+)#/;
    const match = text.match(regex);
    return match ? match[1] : "";
  };

  const handleTitleChange = (value) => {
    const similarToTitle = extractTextBetweenHash(value);
    setProduct((prevState) => ({
      ...prevState,
      title: value,
      similarToTitle,
    }));
  };

  const handlePackagingSelect = (type, subtypes) => {
    setPackaging({ type, subtypes });
  };

  const [boatwoodCategories, setBoatwoodCategories] = useState([]);
  const [vintageCategories, setVintageCategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isUploading1, setIsUploading1] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get("/admin_product/products/categories?page=1&limit=100");
        if (product.shopType === "vintage") {
          const vintageData = response.data.categories.filter(item => item.shopType === "vintage");
          setCategories(vintageData);
        } else {
          const otherData = response.data.categories.filter(item => item.shopType === "boatwood");
          setCategories(otherData);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, [product.shopType]);

  useEffect(() => {
    const sortedVintageCategories = categories
      .filter(category => category.shopType === "vintage");
    setVintageCategories(sortedVintageCategories);
    setBoatwoodCategories(categories.filter(category => category.shopType === "boatwood"));
  }, [categories]);

  useEffect(() => {
    const fetchDefaultData = async () => {
      try {
        const response = await axiosInstance.get(`/admin_product/getDefaultFields/${product.shopType}`);
        setDefaultData(response.data || {});
      } catch (error) {
        console.error('Error fetching defaults:', error);
      }
    };

    if (product.shopType) {
      fetchDefaultData();
    }
  }, [product.shopType]);

  const [selectOptions, setSelectOptions] = useState([
    { value: "active", label: "Active" },
    { value: "deactivated", label: "Deactivated" },
    { value: "reserved", label: "Reserved" }
  ]);

  const [selectOptionsShopType, setSelectOptionsShopType] = useState([
    { value: "vintage", label: "Vintage" },
    { value: "boatwood", label: "Boatwood" }
  ]);


  const [collections, setCollections] = useState([
    {
      id: 1,
      image: "new_arrival.jpg",
      name: "highlights",
      slug: "new-arrival",
      createdAt: "2023-10-01T09:00:00Z",
      status: "active",
      isChecked: false,
    },
    {
      id: 2,
      image: "best_sellers.jpg",
      name: "new",
      slug: "best-sellers",
      createdAt: "2023-10-01T09:30:00Z",
      status: "active",
      isChecked: false,
    },
    {
      id: 3,
      image: "special_offer.jpg",
      name: "sales",
      slug: "special-offer",
      createdAt: "2023-10-01T10:00:00Z",
      status: "inactive",
      isChecked: false,
    },
  ]);

  const handleInputChange = (key, value) => {
    setProduct(prevState => ({
      ...prevState,
      [key]: value
    }));
  };

  const handleNestedInputChange = (parentKey, key, value) => {
    if (parentKey === "descriptions") {
      const updatedDescriptions = [...product.descriptions];
      updatedDescriptions[key] = value;
      setProduct((prevState) => ({
        ...prevState,
        descriptions: updatedDescriptions,
      }));
    } else if (parentKey === "title") {
      setProduct((prevState) => ({
        ...prevState,
        title: value,
      }));
    } else if (parentKey === "Category") {
      const updatedCategory = Array.isArray(value) ? value : [value];
      setProduct((prevState) => ({
        ...prevState,
        Category: updatedCategory,
      }));
    } else {
      setProduct((prevState) => ({
        ...prevState,
        [parentKey]: {
          ...prevState[parentKey],
          [key]: value,
        },
      }));
    }
  };

  const handleAddVariant = () => {
    setProduct((prevState) => ({
      ...prevState,
      variants: [
        ...prevState.variants,
        {
          variantName: "",
          variantStock: 1,
        },
      ],
    }));
  };

    const handleDeleteVariant = useCallback((index) => {
      setProduct(prev => {
        const updatedVariants = [...prev.variants];
        updatedVariants.splice(index, 1);
        return { ...prev, variants: updatedVariants };
      });
    }, []);

  const handleVariantChange = (index, key, value) => {
    const updatedVariants = [...product.variants];
    updatedVariants[index][key] = value;
    setProduct((prevState) => ({
      ...prevState,
      variants: updatedVariants,
    }));
  };

  const handleVariantFileUpload = async (files, index) => {
    setIsUploading1(true);
    const uploadedImageUrls = [];
    for (const file of files) {
      const formData = new FormData();
      formData.append("file", file);
      try {
        const response = await axiosInstance.post(
          "/admin_product/file/upload/products",
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        const result = await response.data;
        if (result.success) {
          uploadedImageUrls.push(result.optimizedUrl);
        } else {
          console.error("Upload failed:", result.message);
        }
        setIsUploading1(false);
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    }
    const updatedVariants = [...product.variants];
    updatedVariants[index].variantImages = uploadedImageUrls;
    setProduct((prevState) => ({
      ...prevState,
      variants: updatedVariants,
    }));
  };

  const handleFileUpload = async (files) => {
    setIsUploading(true);
    const uploadedImageUrls = [];
    for (const file of files) {
      const formData = new FormData();
      formData.append("file", file);
      try {
        const response = await axiosInstance.post("/admin_product/file/upload/products", formData, {
          headers: { "Content-Type": "multipart/form-data" }
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
    setIsUploading(false);
    setProduct((prevState) => ({
      ...prevState,
      productImages: uploadedImageUrls,
    }));
  };

  const validateForm = (updatedProduct) => {
    const errors = {};

    if (!updatedProduct.shopType) errors.shopType = "Shop Type is required";
    if (!updatedProduct.pricing.price || product.pricing.price < 0) errors.price = "Price is required and must be >= 0";
    if (!updatedProduct.pricing.currency) errors.currency = "Currency is required";
    if (!updatedProduct.SKU || !/^[A-Z0-9_-]+$/.test(product.SKU)) errors.SKU = "SKU is required and must be alphanumeric";
    if (!updatedProduct.title) errors.title = "Title is required";
    if (!updatedProduct.dimensions.length || product.dimensions.length < 0) errors.length = "Length is required and must be >= 0";
    if (!updatedProduct.dimensions.height || product.dimensions.height < 0) errors.height = "Height is required and must be >= 0";
    if (!updatedProduct.dimensions.width || product.dimensions.width < 0) errors.width = "Width is required and must be >= 0";
    if (!updatedProduct.dimensions.weight || product.dimensions.weight < 0) errors.weight = "Weight is required and must be >= 0";
    if (!updatedProduct.packaging.type) errors.packagingType = "Packaging Type is required";
    if (!updatedProduct.packaging.subType) errors.packagingSubType = "Packaging Subtype is required";
    if (!updatedProduct.productStatus) errors.productStatus = "Product Status is required";
    if (!updatedProduct.Category || product.Category.length === 0) errors.Category = "At least one Category is required";

    if (product.isVariantsAvailable) {
      product.variants = product.variants.filter(variant => variant.variantName);
    }

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedProduct = {
      ...product,
      packaging: {
        type: packaging.type,
        subType: packaging.subtypes
      }
    };

    if (updatedProduct.pricing.comparePrice === 0) {
      const { comparePrice, ...pricingWithoutCompare } = updatedProduct.pricing;
      updatedProduct.pricing = pricingWithoutCompare;
    }

    if (!validateForm(updatedProduct)) return;

    try {
      const response = await axiosInstance.put(`/admin_product/products/${productId}`, updatedProduct);
      if (response.ok) {
        alert('Product updated successfully');
        navigate('/');
      } else {
        throw new Error(response.data.message || 'Failed to update product');
      }
    } catch (error) {
      alert(error.message);
    }
  };

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await axiosInstance.get(`/admin_product/products/${productId}`);
        setProduct(response.data);
        setPackaging({ type: response.data.packaging.type, subtypes: response.data.packaging.subType });
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [productId]);

  const handleDuplicateProduct = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }

      const response = await axiosInstance.post(`/admin_product/products/${productId}/duplicate`, product);
      if (response.status !== 200) {
        throw new Error("Failed to duplicate product");
      }

      alert("Product duplicated successfully!");
      navigate(`/catalog/product/manage/${response.data._id}`);
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    if (product.productPlace && product.productPlace.length > 0) {
      setCollections(prevCollections =>
        prevCollections.map(collection => ({
          ...collection,
          isChecked: product.productPlace.includes(collection.name)
        }))
      );
    }
  }, [product.productPlace]);


  const handleCheckCollection = (id, checked) => {
    setCollections((prevCollections) => {
      // First update the collection's isChecked status
      const updatedCollections = prevCollections.map((collection) =>
        collection.id === id ? { ...collection, isChecked: checked } : collection
      );

      // Then get ALL currently checked collections (not just the one that changed)
      const selectedCollections = updatedCollections
        .filter((collection) => collection.isChecked)
        .map((collection) => collection.name);

      // Update the product state with the complete list of checked collections
      setProduct((prevProduct) => ({
        ...prevProduct,
        productPlace: selectedCollections, // Replace the entire array
      }));

      return updatedCollections;
    });
  };

  // Handle next product
  const handleNextProduct = async () => {
    try {
      const response = await axiosInstance.get(`/admin_product/products/${productId}/next`);
      if (response.status !== 200) {
        throw new Error("Failed to fetch next product");
      }
      navigate(`/catalog/product/manage/${response.data._id}`);
    } catch (error) {
      setError(error.message);
    }
  };

  // Handle previous product
  const handlePreviousProduct = async () => {
    try {
      const response = await axiosInstance.get(`/admin_product/products/${productId}/previous`);
      if (response.status !== 200) {
        throw new Error("Failed to fetch previous product");
      }
      navigate(`/catalog/product/manage/${response.data._id}`);
    } catch (error) {
      setError(error.message);
    }
  };


  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <section>
      <div className="container">
        <div className="wrapper">
          <div className="content">
            <div className="content_item">
              <h2 className="sub_heading">Product Info</h2>
              <div className="content_item">
                <h2 className="sub_heading">Product Images</h2>
                <FileUpload onFileUpload={handleFileUpload} existingImages={product.productImages} onImagesReorder={(reorderedImages) => {
                  setProduct(prev => ({ ...prev, productImages: reorderedImages }));
                }} />
                {isUploading && <p>Uploading images... Please wait.</p>}
              </div>
              <Input
                type="text"
                placeholder="Enter the product title"
                label="Title"
                value={product.title}
                onChange={handleTitleChange}
                required={true}
                error={errors.title}
              />
              <Input
                type="text"
                placeholder="Product Subtitle"
                label="Subtitle"
                value={defaultData.subtopic}
                required={true}
                error={errors.subtopic}
              />
              <Input
                type="text"
                placeholder="Subtitle"
                label="Product Description"
                value={product.similarToTitle}
              />
              {product.shopType == "vintage" &&
                <TextEditor
                  label="Zustand"
                  value={product.zustandText}
                  onChange={(value) => handleInputChange("zustandText", value)}
                />
              }
              <TextEditor
                label="Description 1"
                placeholder="Enter a description"
                value={product.descriptions[0] || ""}
                onChange={(value) => handleNestedInputChange("descriptions", 0, value)}
              />
              <TextEditor
                label="Shop Info"
                placeholder="Shop Info"
                value={defaultData.shopInfo}
                readOnly={true}
                required={true}
                error={errors.shopInfo}
              />
              <TextEditor
                label="Story of the Shop"
                placeholder="Story of the Shop"
                value={defaultData.storyShop || ""}
                readOnly={true}
                required={true}
                error={errors.storyShop}
              />
              <TextEditor
                label="About us"
                placeholder="About us"
                value={defaultData.aboutUs}
                readOnly={true}
                required={true}
                error={errors.aboutUs}
              />
            </div>

            <div className="content_item12">
              <h2 className="sub_heading">Variants</h2>
              <CheckBox
                label="Does this product have variants?"
                isChecked={product.isVariantsAvailable}
                onChange={(isChecked) => handleInputChange("isVariantsAvailable", isChecked)}
              />
              {product.isVariantsAvailable && (
                <>
                  {product.variants.map((variant, index) => (
                    <div key={index} className="variant-section">
                      <div className="variant-header">
                        <h3>Variant {index + 1}</h3>
                        <Button
                          label="Delete"
                          onClick={() => handleDeleteVariant(index)}
                          variant="danger" // Assuming your Button component supports variants
                          size="small"
                        />
                      </div>                      
                      <Input
                        type="text"
                        placeholder="Variant Name"
                        label="Variant Name "
                        value={variant.variantName}
                        onChange={(value) => handleVariantChange(index, "variantName", value)}
                        error={errors[`variantName${index}`]}
                        required={true}
                      />
                      <FileUpload
                        label="Variant Images"
                        onFileUpload={(files) => handleVariantFileUpload(files, index)}
                        existingImages={variant.variantImages}
                      />
                      {isUploading1 && <p>Uploading images... Please wait.</p>}
                    </div>
                  ))}
                  <Button label="Add Variant" onClick={handleAddVariant}
                  />
                </>
              )}
            </div>
            <div className="content_item meta_data">
              <div className="column">
                <span>Search engine listing</span>
                <h2 className="meta_title">{product?.metaTitle || product.name}</h2>
                <p className="meta_link">{`https://wmk-ecommerce.onrender.com/#/product/${product?._id || product.title}`}</p>
                <p className="meta_description">{product?.metaDescription || product.description}</p>
              </div>
              <div className="column">
                <Input
                  type="text"
                  placeholder="Enter the meta title"
                  label="Title"
                  value={product?.metaTitle || product.title}
                  onChange={(value) => handleInputChange("metaTitle", value)}
                />
              </div>
              <div className="column">
                <Input
                  type="text"
                  placeholder="Enter the meta link"
                  label="Link"
                  value={`https://wmk-ecommerce.onrender.com/#/product/${product?._id || product.title}`}
                  onChange={(value) => handleInputChange("metaLink", value)}
                />
              </div>
              <div className="column">
                <TextEditor
                  type="text"
                  placeholder="Enter the meta description"
                  label="Description"
                  value={product?.metaDescription || product?.description}
                  onChange={(value) => handleInputChange("metaDescription", value)}
                />
              </div>
            </div>
          </div>
          <div className="sidebar">
            <div className="sidebar_item">
              <h2 className="sub_heading">Publish</h2>
              <Button label="Save & Exit" onClick={handleSubmit} />
            </div>
            <div className="sidebar_item">
              <h2 className="sub_heading">Actions</h2>
              <Button label="Duplicate Product" onClick={handleDuplicateProduct} className="info" />
            </div>
            <div className="sidebar_item">
              <h2 className="sub_heading">Navigation</h2>
              <Button label="Previous Product" onClick={handlePreviousProduct} className="info" />
              <Button label="Next Product" onClick={handleNextProduct} className="info" />
            </div>
            <div className="sidebar_item">
              <h2 className="sub_heading">Shop Type</h2>
              <Dropdown
                placeholder="Select shop type"
                required={true}
                selectedValue={product.shopType}
                onClick={(value) => handleInputChange("shopType", value)}
                options={selectOptionsShopType}
                error={errors.shopType}
              />
            </div>
            <div className="sidebar_item">
              <h2 className="sub_heading">Collections</h2>
              <MultiSelect
                placeholder="Select shop collection"
                options={categories}
                isSelected={product.Category}
                isMulti={true}
                onChange={(selectedIds) => handleNestedInputChange("Category", 0, selectedIds)}
              />
            </div>
            <div className="sidebar_item">
              <h2 className="sub_heading">Stock Amount</h2>
              <Input
                type="number"
                placeholder="Enter stock amount"
                value={product.stockAmt}
                required={true}
                onChange={(value) => handleInputChange("stockAmt", value)}
                error={errors.stockAmt}
              />
            </div>
            <div className="sidebar_item">
              <h2 className="sub_heading">WMK Score</h2>
              <Input
                type="number"
                placeholder="Technischer Zustand (1-5)"
                label="Technischer Zustand"
                value={product.earRating}
                onChange={(value) => handleInputChange("earRating", value)}
                min={0}
                max={10}
              />
              <Input
                type="number"
                placeholder="Optischer Zustand (1-5)"
                label="Optischer Zustand"
                value={product.eyeRating}
                onChange={(value) => handleInputChange("eyeRating", value)}
                min={0}
                max={10}
              />
              <Input
                type="number"
                placeholder="Geruchsneutralität (1-5)"
                label="Geruchsneutralität"
                value={product.noseRating}
                onChange={(value) => handleInputChange("noseRating", value)}
                min={0}
                max={10}
              />
            </div>
            <div className="sidebar_item">
              <h2 className="sub_heading">
                <span>SKU</span>
              </h2>
              <div className="column">
                <Input
                  type="number"
                  placeholder="Enter the product sku"
                  value={product.SKU}
                  onChange={(value) => handleInputChange("SKU", value)}
                  className="sm"
                  error={errors.SKU}
                  required={true}
                />
              </div>
            </div>
            <div className="sidebar_item">
              <h2 className="sub_heading">Pricing</h2>
              <Input
                type="number"
                placeholder="Enter the product price"
                label="Price"
                value={product.pricing.price}
                onChange={(value) => handleNestedInputChange("pricing", "price", value)}
                error={errors.price}
                required={true}
              />
              <Input
                type="number"
                placeholder="Enter the product compare price"
                label="Compare Price"
                value={product.pricing.comparePrice}
                onChange={(value) => handleNestedInputChange("pricing", "comparePrice", value)}
              />
            </div>

            <div className="sidebar_item">
              <h2 className="sub_heading">Dimensions</h2>
              <Input
                type="number"
                placeholder="Enter the product length in cm"
                label="Lange(cm)"
                required={true}
                value={product.dimensions.length}
                onChange={(value) => handleNestedInputChange("dimensions", "length", value)}
                error={errors.length}
              />
              <Input
                type="number"
                placeholder="Enter the product height in cm"
                label="Hohe(cm)"
                required={true}
                value={product.dimensions.height}
                onChange={(value) => handleNestedInputChange("dimensions", "height", value)}
                error={errors.height}
              />
              <Input
                type="number"
                placeholder="Enter the product width in cm"
                label="Breite(cm)"
                required={true}
                value={product.dimensions.width}
                onChange={(value) => handleNestedInputChange("dimensions", "width", value)}
                error={errors.width}
              />
            </div>
            <div className="sidebar_item">
              <h2 className="sub_heading">Dimensions for Cargoboard</h2>
              <Input
                type="number"
                placeholder="Enter the product length in cm"
                label="Lange(cm)"
                required={true}
                value={product.dimensionsForCargoBoard?.length || 0}
                onChange={(value) => handleNestedInputChange("dimensionsForCargoBoard", "length", value)}
                error={errors.length}
              />
              <Input
                type="number"
                placeholder="Enter the product width in cm"
                label="Breite(cm)"
                required={true}
                value={product.dimensionsForCargoBoard?.width || 0}
                onChange={(value) => handleNestedInputChange("dimensionsForCargoBoard", "width", value)}
                error={errors.width}
              />
              <Input
                type="number"
                placeholder="Enter the product height in cm"
                label="Hohe(cm)"
                required={true}
                value={product.dimensionsForCargoBoard?.height || 0}
                onChange={(value) => handleNestedInputChange("dimensionsForCargoBoard", "height", value)}
                error={errors.height}
              />
              <Input
                type="number"
                placeholder="Enter the product weight in kg"
                label="Weight(Kg)"
                required={true}
                value={product.dimensions?.weight || 0}
                onChange={(value) => handleNestedInputChange("dimensions", "weight", value)}
                error={errors.weight}
              />
            </div>
            <div className="sidebar_item">
              <h2 className="sub_heading">Product Status</h2>
              <Dropdown
                placeholder="Select product status"
                selectedValue={product.productStatus}
                onClick={(value) => handleInputChange("productStatus", value)}
                options={selectOptions}
                error={errors.productStatus}
                required={true}
              />
            </div>
            <div className="sidebar_item">
              <h2 className="sub_heading">Where to place product?</h2>
              <div className="sidebar_checkboxes">
                {collections.map((collection) => (
                  <CheckBox
                    key={collection.id}
                    id={collection.id}
                    label={`${collection.name}`}
                    isChecked={collection.isChecked}
                    onChange={(isChecked) =>
                      handleCheckCollection(collection.id, isChecked)
                    }
                  />
                ))}
              </div>
            </div>
            <div className="sidebar_item">
              <h2 className="sub_heading">Packaging</h2>
              <PackagingSelector selectedValues={packaging} onSelect={handlePackagingSelect} />
            </div>
            <div className="sidebar_item">
              <CheckBox
                label="Is Product Heavy?"
                isChecked={product.isProductHeavy}
                onChange={(isChecked) => handleInputChange("isProductHeavy", isChecked)}
              />
              <CheckBox
                label="Is Assembly Required?"
                isChecked={product.assemblyService}
                onChange={(isChecked) => handleInputChange("assemblyService", isChecked)}
              />
            </div>
            <div className="sidebar_item">
              <TextEditor
                label="notes"
                value={product.notes || ""}
                onChange={(value) => handleInputChange("notes", value)}
              />
            </div>
            <div className="sidebar_item">
              <CheckBox
                label="Mark as Sold Out"
                isChecked={product.stockAmt === 0}
                onChange={(isChecked) => {
                  handleInputChange("stockAmt", isChecked ? 0 : 1); // Default to 1 if unchecked
                }}

              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EditProduct;