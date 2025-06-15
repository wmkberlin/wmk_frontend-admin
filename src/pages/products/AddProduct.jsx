import axiosInstance from "../../axiosInstance.js";
import * as Icons from "react-icons/tb";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { debounce } from "lodash";

// Components
import Modal from "../../components/common/Modal.jsx";
import Input from "../../components/common/Input.jsx";
import Tagify from "../../components/common/Tagify.jsx";
import Button from "../../components/common/Button.jsx";
import Divider from "../../components/common/Divider.jsx";
import CheckBox from "../../components/common/CheckBox.jsx";
import Dropdown from "../../components/common/Dropdown.jsx";
import Textarea from "../../components/common/Textarea.jsx";
import Offcanvas from "../../components/common/Offcanvas.jsx";
import Accordion from "../../components/common/Accordion.jsx";
import FileUpload from "../../components/common/FileUpload.jsx";
import TextEditor from "../../components/common/TextEditor.jsx";
import TableAction from "../../components/common/TableAction.jsx";
import MultiSelect from "../../components/common/MultiSelect.jsx";
import PackagingSelector from "../../components/common/PackagingSelector.jsx";

// Initial state outside component to prevent recreation
const INITIAL_PRODUCT_STATE = {
  shopType: "vintage",
  chargeTax: 19,
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
  notes: `Name:-  <br/> Address :- <br/> Phone Number :- <br/> Email Address :-  `
};

const selectOptions = [
  { value: "active", label: "Active" },
  { value: "deactivated", label: "Deactivated" },
  { value: "reserved", label: "Reserved" }
];

const selectOptionsShopType = [
  { value: "vintage", label: "Vintage" },
  { value: "boatwood", label: "Boatwood" }
];

const AddProduct = ({ productData }) => {
  const navigate = useNavigate();
  const [product, setProduct] = useState(INITIAL_PRODUCT_STATE);
  const [errors, setErrors] = useState({});
  const [categories, setCategories] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isUploading1, setIsUploading1] = useState(false);
  const [defaultData, setDefaultData] = useState({
    shopInfo: '',
    subtopic: '',
    storyShop: '',
    aboutUs: ''
  });
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
      id: 3,
      image: "special_offer.jpg",
      name: "sales",
      slug: "special-offer",
      createdAt: "2023-10-01T10:00:00Z",
      status: "inactive",
      isChecked: false,
    },
  ]);

  // Memoized packaging state
  const [packaging, setPackaging] = useState({ type: null, subtypes: [] });

  // Generate zustand text memoized
  const generateZustandText = useCallback((earRating, eyeRating, noseRating, shopType) => {
    return shopType === "vintage" ?
      `WMK Zustandsscore: <br/><ul><li>Technischer Zustand : ${earRating}/10</li><li>Optischer Zustand : ${eyeRating}/10</li><li>Geruchsneutralität : ${noseRating}/10</li></ul><p>Vintage Möbel haben in der Regel altersbedingte Gebrauchsspuren. Der WMK Score ist, zusammen mit unseren detailreichen Fotos, eine übersichtliche und ehrliche Zustandsbewertung unserer Möbel. So wissen Sie, möglichst genau was Sie für Ihr Geld bekommen.</p>`
      : '';
  }, []);

  // Combined effect for zustand text and description updates
  useEffect(() => {
    const updatedZustandText = generateZustandText(
      product.earRating,
      product.eyeRating,
      product.noseRating,
      product.shopType
    );

    const updatedDescription = `Maße (B/T/H) ca. in cm: ${product.dimensions.length}X${product.dimensions.height}X${product.dimensions.width} <br/>Artikelnummer im Shop: ${product.SKU}`;

    setProduct(prev => ({
      ...prev,
      zustandText: updatedZustandText,
      descriptions: [updatedDescription]
    }));
  }, [product.earRating, product.eyeRating, product.noseRating, product.shopType, product.SKU, product.dimensions, generateZustandText]);

  // Fetch categories with cleanup
  useEffect(() => {
    let isMounted = true;

    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get("/admin_product/products/categories?page=1&limit=100");
        if (isMounted) {
          const filteredCategories = product.shopType === "vintage"
            ? response.data.categories.filter(item => item.shopType === "vintage")
            : response.data.categories.filter(item => item.shopType === "boatwood");

          setCategories(filteredCategories);

          const sharedDescriptionResponse = await axiosInstance.get("/admin_product/shared-description");
          const sharedDescription = sharedDescriptionResponse.data.description || "";

          setProduct(prev => ({
            ...prev,
            subtitle: sharedDescription,
          }));
        }
      } catch (error) {
        if (isMounted) {
          console.error("Error fetching categories:", error);
        }
      }
    };

    fetchCategories();

    return () => {
      isMounted = false;
    };
  }, [product.shopType]);

  // Fetch default data with cleanup
  useEffect(() => {
    let isMounted = true;

    const fetchDefaultData = async () => {
      try {
        const response = await axiosInstance.get(`/admin_product/getDefaultFields/${product.shopType}`);
        if (isMounted) {
          setDefaultData(response.data || {});
        }
      } catch (error) {
        if (isMounted) {
          console.error('Error fetching defaults:', error);
        }
      }
    };

    if (product.shopType) {
      fetchDefaultData();
    }

    return () => {
      isMounted = false;
    };
  }, [product.shopType]);

  // Extract text between hash marks
  const extractTextBetweenHash = useCallback((text) => {
    const regex = /#([^#]+)#/;
    const match = text.match(regex);
    return match ? match[1] : "";
  }, []);

  // Handle title change with debounce
  const handleTitleChange = useCallback((value) => {
    const similarToTitle = extractTextBetweenHash(value);
    setProduct(prev => ({
      ...prev,
      title: value,
      similarToTitle,
    }));
  }, [extractTextBetweenHash]);

  // Handle packaging select
  const handlePackagingSelect = useCallback((type, subtypes) => {
    setPackaging({ type, subtypes });
  }, []);

  const handleCheckCollection = (id, checked) => {
    setCollections((prevCollections) => {
      const updatedCollections = prevCollections.map((collection) =>
        collection.id === id ? { ...collection, isChecked: checked } : collection
      );
      const selectedCollections = updatedCollections
        .filter((collection) => collection.isChecked)
        .map((collection) => collection.name);
      setProduct((prevProduct) => ({
        ...prevProduct,
        productPlace: [...prevProduct.productPlace, ...selectedCollections],
      }));
      console.log(selectedCollections);

      return updatedCollections;
    });
  };

  const category = categories.map(category => ({
    label: category.name,
    value: category._id
  }));

  // Generic input change handler
  const handleInputChange = useCallback((key, value) => {
    setProduct(prev => ({
      ...prev,
      [key]: value
    }));
  }, []);

  // Add variant handler
  const handleAddVariant = useCallback(() => {
    setProduct(prev => ({
      ...prev,
      variants: [
        ...prev.variants,
        {
          variantName: "",
          variantStock: 1,
          variantImages: []
        },
      ],
    }));
  }, []);

  // Handle variant change
  const handleVariantChange = useCallback((index, key, value) => {
    setProduct(prev => {
      const updatedVariants = [...prev.variants];
      updatedVariants[index][key] = value;
      return { ...prev, variants: updatedVariants };
    });
  }, []);

  // Optimized file upload with parallel processing
  const handleVariantFileUpload = useCallback(async (files, index) => {
    setIsUploading1(true);
    try {
      const uploadPromises = files.map(file => {
        const formData = new FormData();
        formData.append("file", file);
        return axiosInstance.post(
          "/admin_product/file/upload/products",
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
      });

      const results = await Promise.all(uploadPromises);
      const uploadedImageUrls = results
        .filter(res => res.data.success)
        .map(res => res.data.optimizedUrl);

      setProduct(prev => {
        const updatedVariants = [...prev.variants];
        updatedVariants[index].variantImages = uploadedImageUrls;
        return { ...prev, variants: updatedVariants };
      });
    } catch (error) {
      console.error("Error uploading files:", error);
    } finally {
      setIsUploading1(false);
    }
  }, []);

  // Nested input change handler
  const handleNestedInputChange = useCallback((parentKey, key, value) => {
    setProduct(prev => {
      if (parentKey === "descriptions") {
        const updatedDescriptions = [...prev.descriptions];
        updatedDescriptions[key] = value;
        return { ...prev, descriptions: updatedDescriptions };
      } else if (parentKey === "Category") {
        const updatedCategory = Array.isArray(value) ? value : [value];
        return { ...prev, Category: updatedCategory };
      } else if (typeof key === 'object') {
        return { ...prev, [parentKey]: { ...prev[parentKey], ...key } };
      } else {
        return {
          ...prev,
          [parentKey]: { ...prev[parentKey], [key]: value }
        };
      }
    });
  }, []);

  // Status change handlers
  const handleProductStatusChange = useCallback((selectedOption) => {
    setProduct(prev => ({
      ...prev,
      productStatus: selectedOption.value
    }));
  }, []);

  const handleShopTypeChange = useCallback((selectedOption) => {
    setProduct(prev => ({
      ...prev,
      shopType: selectedOption.value,
      chargeTax: selectedOption.value === 'vintage' ? 19 : 0
    }));
  }, []);

  // Optimized file upload for main product images
  const handleFileUpload = useCallback(async (files) => {
    setIsUploading(true);
    try {
      const uploadPromises = files.map(file => {
        const formData = new FormData();
        formData.append("file", file);
        return axiosInstance.post(
          "/admin_product/file/upload/products",
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
      });

      const results = await Promise.all(uploadPromises);
      const uploadedImageUrls = results
        .filter(res => res.data.success)
        .map(res => res.data.optimizedUrl);

      setProduct(prev => ({
        ...prev,
        productImages: uploadedImageUrls,
      }));
      setIsUploading(false);
    } catch (error) {
      console.error("Error uploading files:", error);
    }
  }, []);

  // Add this function to handle variant deletion
  const handleDeleteVariant = useCallback((index) => {
    setProduct(prev => {
      const updatedVariants = [...prev.variants];
      updatedVariants.splice(index, 1);
      return { ...prev, variants: updatedVariants };
    });
  }, []);

  // Form validation
  const validateForm = useCallback((productToValidate) => {
    const newErrors = {};

    if (!productToValidate.shopType) newErrors.shopType = "Shop Type is required";
    if (!productToValidate.pricing.price || productToValidate.pricing.price < 0)
      newErrors.price = "Price is required and must be >= 0";
    if (!productToValidate.SKU || !/^[A-Z0-9_-]+$/.test(productToValidate.SKU))
      newErrors.SKU = "SKU is required and must be alphanumeric";
    if (!productToValidate.title) newErrors.title = "Title is required";
    if (!productToValidate.dimensions.length || productToValidate.dimensions.length < 0)
      newErrors.length = "Length is required and must be >= 0";
    if (!productToValidate.dimensions.width || productToValidate.dimensions.width < 0)
      newErrors.width = "Width is required and must be >= 0";
    if (!productToValidate.dimensions.weight || productToValidate.dimensions.weight < 0)
      newErrors.weight = "Weight is required and must be >= 0";
    if (!productToValidate.packaging.type)
      newErrors.packagingType = "Packaging Type is required";
    if (!productToValidate.Category || productToValidate.Category.length === 0)
      newErrors.Category = "At least one Category is required";

    if (product.isVariantsAvailable) {
      product.variants = product.variants.filter(variant => variant.variantName);
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, []);

  // Debounced form submission
  const handleSubmit = useCallback(async (e) => {
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
      const response = await axiosInstance.post("/admin_product/products", updatedProduct);
      if (response.ok) {
        alert('Product created successfully');
        navigate('/');
      } else {
        throw new Error(response.data.message || 'Failed to create product');
      }
    } catch (error) {
      alert(error.message);
    }
  }, [product, packaging, validateForm, navigate]);

  // Memoized debounced submit
  const debouncedSubmit = useMemo(() => debounce(handleSubmit, 500), [handleSubmit]);

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => debouncedSubmit.cancel();
  }, [debouncedSubmit]);

  return (
    <section>
      <div className="container">
        <div className="wrapper">
          <div className="content">
            <div className="content_item">
              <h2 className="sub_heading">Product Info</h2>
              <div className="content_item">
                <h2 className="sub_heading">Product Images</h2>
                <FileUpload
                  onFileUpload={handleFileUpload}
                  onImagesReorder={(reorderedImages) => {
                    setProduct(prev => ({ ...prev, productImages: reorderedImages }));
                  }}
                />
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
                onChange={(value) => handleInputChange("similarToTitle", value)}
              />

              {product.shopType === "vintage" && (
                <TextEditor
                  label="Zustand"
                  value={product.zustandText}
                  onChange={(value) => handleInputChange("zustandText", value)}
                />
              )}

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
                      />
                      {isUploading1 && <p>Uploading images... Please wait.</p>}
                    </div>
                  ))}
                  <Button
                    label="Add Variant"
                    onClick={handleAddVariant}
                  />
                </>
              )}
            </div>

            <div className="content_item meta_data">
              <div className="column">
                <span>Search engine listing</span>
                <h2 className="meta_title">{product.metaTitle || product.name}</h2>
                <p className="meta_description">{product.metaDescription || product.description}</p>
              </div>

              <div className="column">
                <Input
                  type="text"
                  placeholder="Enter the meta title"
                  label="Title"
                  value={product.metaTitle || product.title}
                  onChange={(value) => handleInputChange("metaTitle", value)}
                />
              </div>

              <div className="column">
                <Input
                  type="text"
                  placeholder="Enter the meta link"
                  label="Link"
                  value={`${product.metaLink}/${product.metaTitle || product.title}`}
                  onChange={(value) => handleInputChange("metaLink", value)}
                />
              </div>

              <div className="column">
                <Textarea
                  type="text"
                  placeholder="Enter the meta description"
                  label="Description"
                  value={product.metaDescription || product.description}
                  onChange={(value) => handleInputChange("metaDescription", value)}
                />
              </div>
            </div>
          </div>

          <div className="sidebar">
            <div className="sidebar_item">
              <h2 className="sub_heading">Publish</h2>
              <Button label="Save & Exit" onClick={debouncedSubmit} />
            </div>

            <div className="sidebar_item">
              <h2 className="sub_heading">Shop Type</h2>
              <Dropdown
                placeholder="Select shop type"
                required={true}
                selectedValue={product.shopType}
                onClick={handleShopTypeChange}
                options={selectOptionsShopType}
                error={errors.shopType}
              />
            </div>

            <div className="sidebar_item">
              <h2 className="sub_heading">Collections</h2>
              <MultiSelect
                placeholder="Select shop collection"
                options={categories}
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

            {product.shopType === "vintage" && (
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
            )}

            <div className="sidebar_item">
              <h2 className="sub_heading">SKU</h2>
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
                label="Breite(cm)"
                required={true}
                value={product.dimensions.length}
                onChange={(value) => handleNestedInputChange("dimensions", "length", value)}
                error={errors.length}
              />
              <Input
                type="number"
                placeholder="Enter the product height in cm"
                label="Tiefe(cm)"
                required={true}
                value={product.dimensions.height}
                onChange={(value) => handleNestedInputChange("dimensions", "height", value)}
                error={errors.height}
              />
              <Input
                type="number"
                placeholder="Enter the product width in cm"
                label="Höhe(cm)"
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
                value={product.dimensionsForCargoBoard.length}
                onChange={(value) => handleNestedInputChange("dimensionsForCargoBoard", "length", value)}
              />
              <Input
                type="number"
                placeholder="Enter the product width in cm"
                label="Breite(cm)"
                required={true}
                value={product.dimensionsForCargoBoard.width}
                onChange={(value) => handleNestedInputChange("dimensionsForCargoBoard", "width", value)}
              />
              <Input
                type="number"
                placeholder="Enter the product height in cm"
                label="Hohe(cm)"
                required={true}
                value={product.dimensionsForCargoBoard.height}
                onChange={(value) => handleNestedInputChange("dimensionsForCargoBoard", "height", value)}
              />

              <Input
                type="number"
                placeholder="Enter the product weight in kg"
                label="Weight(Kg)"
                required={true}
                value={product.dimensions.weight}
                onChange={(value) => handleNestedInputChange("dimensions", "weight", value)}
                error={errors.weight}
              />
            </div>

            <div className="sidebar_item">
              <h2 className="sub_heading">Product Status</h2>
              <Dropdown
                placeholder="Select product status"
                selectedValue={product.productStatus}
                onClick={handleProductStatusChange}
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
                    label={collection.name}
                    isChecked={collection.isChecked}
                    onChange={(isChecked) => handleCheckCollection(collection.id, isChecked)}
                  />
                ))}
              </div>
            </div>

            <div className="sidebar_item">
              <h2 className="sub_heading">Packaging</h2>
              <PackagingSelector onSelect={handlePackagingSelect} />
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
                value={product.notes}
                onChange={(value) => handleInputChange("notes", value)}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default React.memo(AddProduct);