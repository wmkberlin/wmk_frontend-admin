import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import ProductList from './productList';
import ZoneInfo from './zoneInfo';
import CreateZone from './createZone';
import EditZone from './editZone';
import axiosInstance from '../../axiosInstance';
import Button from '../../components/common/Button';
import * as Icons from "react-icons/tb";
import Modal from '../../components/common/Modal';

// import '../../styles/'
const ShippingCharge = () => {
  let selectedType = useParams();
  const [products, setProducts] = useState([]);
  const [zones, setZones] = useState([]);
  const [isCreatingZone, setIsCreatingZone] = useState(false);
  const [editingZoneId, setEditingZoneId] = useState(null);
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false); // State for Add Product modal
  const [isAddZoneModalOpen, setIsAddZoneModalOpen] = useState(false); // State for Add Zone modal
  const [isEditZoneModalOpen, setIsEditZoneModalOpen] = useState(false); // State for Edit Zone modal

  // Fetch products and zones when packaging type is selected
  useEffect(() => {
    if (selectedType) {
        const fetchDetails = async() => {
            try {
                console.log(selectedType);
                selectedType.type = selectedType.type.replace(/_/g, " ");
                const response = await axiosInstance.get(
                    `https://wmk-backend.onrender.com/api/shipping_admin/getDetailsByPackagingType/${selectedType.type}`
                );
                if (response.status !== 200) {
                    throw new Error("Failed to fetch orders");
                }
                const data = response.data;
                setProducts(data.products);
                setZones(data.zones);
                
            } catch (error) {
                
            }
        }
        fetchDetails();
    }
  }, [selectedType]);

  const handleCreateZone = async (zoneData) => {
    const response = await axiosInstance.post("/shipping_admin/createZone", zoneData);
      // Check if the request was successful
      if (response.status != 201) {
        throw new Error("Failed to save category");
      }

      const result = await response.data;
      console.log("Category saved successfully:", result);
      setZones([...zones, response.data.zone]);
      setIsAddZoneModalOpen(false); // Close the Add Zone modal
  };

  const handleUpdateZone = async (zoneId, zoneData) => {
    console.log(zoneId, zoneData);
    
    const response = await axiosInstance.put(`/shipping_admin/updateZone/${zoneId._id}`, zoneId);
    
    // Check if the request was successful
    if (response.status !== 200) {
      throw new Error("Failed to update zone");
    }
  
    const result = await response.data;
    console.log("Zone updated successfully:", result);
    
    // Update the zones state
    setZones(zones.map(zone => 
      zone._id === zoneId._id ? result.zone : zone
    ));
    
    setIsEditZoneModalOpen(false); // Close the Edit Zone modal
  };

  // const handleUpdateZone = async (zoneId, zoneData) => {
  //   try {
  //     const response = await axiosInstance.put(`/shipping_admin/updateZone/${zoneId}`, zoneData);
      
  //     // Check if the request was successful
  //     if (response.status !== 200) {
  //       throw new Error("Failed to update zone");
  //     }
    
  //     const result = response.data;
  //     console.log("Zone updated successfully:", result);
      
  //     // Update the zones state
  //     setZones(zones.map(zone => 
  //       zone._id === zoneId ? result.zone : zone
  //     ));
      
  //     setIsEditZoneModalOpen(false); // Close the Edit Zone modal
  //   } catch (error) {
  //     console.error("Error updating zone:", error);
  //     throw error;
  //   }
  // };

    // Handle adding a new product
    const handleAddProduct = (productData) => {
      // Add your logic to save the product
      console.log('Product Data:', productData);
      setIsAddProductModalOpen(false); // Close the Add Product modal
    };
  return (
    <div className="shippingContent">
      <div className="shippingSubDiv">
        {selectedType && (
          <>
            <span>DPD {selectedType.type}</span>
            <ProductList
              products={products}
              onAddProduct={() => setIsAddProductModalOpen(true)} // Open Add Product modal
            />
            <div className="zoneInfoBtn">
            {/* <ZoneInfo
              zones={zones}
              onEditZone={setEditingZoneId}
            /> */}
            <div className="zone-info">
              <div className='zonebtnInfo'>
              <h3>Zone Information</h3>
              <Button
                label="Create New Zone"
                icon={<Icons.TbPlus />}
                className="sm"
                onClick={() => setIsAddZoneModalOpen(true)} // Open Add Zone modal
                />
            </div>
            <div className='zonelist'>
              {zones.map((zone) => (
                <div key={zone._id} className="zone-card">
                  <h4>{zone.zoneName}</h4>
                  <p>Countries: {zone.countries.join(', ')}</p>
                  <p>Price: {zone.charge}€</p>
                  <button onClick={() => {
                        setEditingZoneId(zone._id);
                        setIsEditZoneModalOpen(true); // Open Edit Zone modal
                      }}>
                        Edit Zone
                      </button>                </div>
              ))}
              </div>
            </div>

            </div>
          </>
        )}
        {/* Add Product Modal */}
<Modal isOpen={isAddProductModalOpen} onClose={() => setIsAddProductModalOpen(false)}>
<div className="create-zone">
  <h2>Add Product</h2>
  <form onSubmit={(e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const productData = Object.fromEntries(formData.entries());
    handleAddProduct(productData);
  }}>
    <input type="text" name="name" placeholder="Product Name" required />
    <input type="text" name="packagingType" placeholder="Packaging Type" required />
    <Button label="Add Product"/>
  </form>
  </div>
</Modal>

{/* Add Zone Modal */}
<Modal isOpen={isAddZoneModalOpen} onClose={() => setIsAddZoneModalOpen(false)}>
  <CreateZone onCreateZone={handleCreateZone} onCancel={() => setIsAddZoneModalOpen(false)} />
</Modal>

{/* Edit Zone Modal */}
<Modal isOpen={isEditZoneModalOpen} onClose={() => setIsEditZoneModalOpen(false)}>
  <EditZone
    zone={zones.find((zone) => zone._id === editingZoneId)}
    onUpdateZone={handleUpdateZone}
    onCancel={() => setIsEditZoneModalOpen(false)}
  />
</Modal>

      </div>
    </div>
  );
};

export default ShippingCharge;