import React, { useState, useEffect } from "react";
import "./LocalDeliveryPage.css"; // CSS for the page
import CheckBox from "../../components/common/CheckBox";
import { TbLocation } from "react-icons/tb";
import { useParams } from "react-router-dom";
import axiosInstance from "../../axiosInstance"; // Import your axios instance
import Modal from "../../components/common/Modal"; // Import the Modal component
import Button from "../../components/common/Button";

const LocalDeliveryPage = () => {
  const { shopId } = useParams(); // Get storeId from the URL
  const [offersDelivery, setOffersDelivery] = useState(false);
  const [deliveryZones, setDeliveryZones] = useState([]);
  const [storeName, setStoreName] = useState("");
  const [storeAddress, setStoreAddress] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newZoneName, setNewZoneName] = useState("");
  const [newZonePostalCodes, setNewZonePostalCodes] = useState("");
  const [newZoneDeliveryFee, setNewZoneDeliveryFee] = useState(0);
  const [postalCodeTags, setPostalCodeTags] = useState([]);
  const [isEditing, setIsEditing] = useState(false); // State to track if editing
  const [editingZoneId, setEditingZoneId] = useState(null); // State to store the ID of the zone being edited

  // Fetch store details on component mount
  useEffect(() => {
    const fetchStoreDetails = async () => {
      try {
        const response = await axiosInstance.get(`/shipping_admin/shop/${shopId}`);
        const storeData = response.data.storeData;

        // Update state with fetched data
        setStoreName(storeData.storeName);
        setStoreAddress(storeData.storeAddress);
        setOffersDelivery(storeData.offersDelivery);
        setDeliveryZones(storeData.deliveryZones || []);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStoreDetails();
  }, [shopId]);

  // Handle adding or updating a zone
  const handleSaveZone = async () => {
    try {
      const zoneData = {
        name: newZoneName,
        postalCodes: postalCodeTags,
        deliveryFee: newZoneDeliveryFee,
      };

      if (isEditing) {
        // Update existing zone
        const response = await axiosInstance.put(
          `/shipping_admin/shop/${shopId}/updateZone/${editingZoneId}`,
          zoneData
        );
        setDeliveryZones(
          deliveryZones.map((zone) =>
            zone._id === editingZoneId ? response.data.zone : zone
          )
        );
      } else {
        // Add new zone
        const response = await axiosInstance.post(
          `/shipping_admin/shop/${shopId}/zones`,
          zoneData
        );
        setDeliveryZones([...deliveryZones, response.data.zone]);
      }

      setIsModalOpen(false);
      setPostalCodeTags([]); // Clear the tags after saving
      setIsEditing(false); // Reset editing state
      setEditingZoneId(null); // Reset editing zone ID
    } catch (error) {
      setError(error.message);
    }
  };

  // Handle editing a zone
  const handleEditZone = (zone) => {
    setNewZoneName(zone.name);
    setPostalCodeTags(zone.postalCodes);
    setNewZoneDeliveryFee(zone.deliveryFee);
    setIsEditing(true);
    setEditingZoneId(zone._id);
    setIsModalOpen(true);
  };

  // Handle toggling delivery offering
  const handleOffersDeliveryChange = async (checked) => {
    try {
      await axiosInstance.put(`/shipping_admin/shop/${shopId}/offers-delivery`, {
        offersDelivery: checked,
      });
      setOffersDelivery(checked);
    } catch (error) {
      setError(error.message);
    }
  };

  // Handle postal code input
// Add this function
const handlePostalCodeInput = () => {
  const inputValue = newZonePostalCodes.trim();
  
  if (inputValue) {
    const newPincodes = inputValue
      .split(',')
      .map(pincode => pincode.trim())
      .filter(pincode => pincode.length > 0);
    
    const uniqueNewPincodes = newPincodes.filter(
      pincode => !postalCodeTags.includes(pincode)
    );
    
    if (uniqueNewPincodes.length > 0) {
      setPostalCodeTags([...postalCodeTags, ...uniqueNewPincodes]);
    }
    
    setNewZonePostalCodes("");
  }
};

  // Remove a postal code
  const removePostalCode = (index) => {
    const newTags = postalCodeTags.filter((_, i) => i !== index);
    setPostalCodeTags(newTags);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="local-delivery-page">
      <h1>Local delivery for {storeName}</h1>

      {/* Location Status */}
      <div className="location-status">
        <h2>Location status</h2>
        <div className="storeDiv1">
          <div className="storeDivRight">
            <TbLocation />
            <div className="subStoreDivRight">
              <span>{storeName}</span>
              <span>{storeAddress}</span>
            </div>
          </div>
        </div>
        <CheckBox
          label="This location offers local delivery"
          isChecked={offersDelivery}
          onChange={handleOffersDeliveryChange}
        />
      </div>

      {/* Delivery Zones */}
      <div className="delivery-zones">
        <h2>Delivery zones</h2>

        {/* Delivery Zones Table */}
        <table className="delivery-zones-table">
          <thead>
            <tr>
              <th>Zone Name</th>
              <th>Postal Codes</th>
              <th>Delivery Fee</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {deliveryZones.map((zone, index) => (
              <tr key={index}>
                <td>{zone.name}</td>
                <td className="zoneTableValue">
                  <span>{zone.postalCodes.length} postal codes • No delivery information</span>
                  <span className="postalCodeLiist">
                    {zone.postalCodes.map((code, index) => (
                      <span key={index}>
                        {code}
                        {index < zone.postalCodes.length - 1 ? ", " : ""}
                      </span>
                    ))}
                  </span>
                </td>
                <td>€{zone.deliveryFee}.00</td>
                <td>
                  <button onClick={() => handleEditZone(zone)}>Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Add Zone Button */}
        <button onClick={() => setIsModalOpen(true)}>Add Zone</button>
      </div>

      {/* Modal for adding/editing a zone */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="add-zone-modal">
          <h2>{isEditing ? "Edit Delivery Zone" : "Add New Delivery Zone"}</h2>
          <input
            type="text"
            placeholder="Zone Name"
            value={newZoneName}
            onChange={(e) => setNewZoneName(e.target.value)}
          />
          <div className="postal-code-input">
            <div className="postalCodeList">
              {postalCodeTags.map((tag, index) => (
                <div key={index} className="postal-code-tag">
                  {tag}
                  <span onClick={() => removePostalCode(index)}>×</span>
                </div>
              ))}
            </div>
            <input
              type="text"
              placeholder="Postal Codes (comma separated)"
              value={newZonePostalCodes}
              onChange={(e) => setNewZonePostalCodes(e.target.value)}
              onKeyDown={handlePostalCodeInput}
            />
          </div>
          <input
            type="number"
            placeholder="Delivery Fee"
            value={newZoneDeliveryFee}
            onChange={(e) => setNewZoneDeliveryFee(parseFloat(e.target.value))}
          />
          <Button onClick={handleSaveZone} label={isEditing ? "Save Changes" : "Save"} />
        </div>
      </Modal>
    </div>
  );
};

export default LocalDeliveryPage;