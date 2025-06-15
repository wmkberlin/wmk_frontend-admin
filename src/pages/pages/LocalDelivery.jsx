import React, { useState, useEffect } from "react";
import CheckBox from "../../components/common/CheckBox";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import axiosInstance from "../../axiosInstance";
import { TbLocation } from "react-icons/tb";
import { Link } from "react-router-dom";
// import { fetchLocalDeliverySettings, updateLocalDeliverySettings } from "./api/localDeliveryApi";

const LocalDelivery = ({ locationId }) => {
  const [settings, setSettings] = useState({
    offersDelivery: false,
    deliveryZones: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch local delivery settings on component mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await axiosInstance.get(
            `https://wmk-backend.onrender.com/api/shipping_admin/getShopLists`
        );
        if (response.status !== 200) {
            throw new Error("Failed to fetch orders");
        }
        const data = response.data;
        console.log(data);
        
        setSettings(data.shopList);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, [locationId]);

  // Handle changes in delivery settings
  const handleChange = (field, value) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  // Handle changes in delivery zones
  const handleDeliveryZoneChange = (index, field, value) => {
    setSettings((prev) => {
      const updatedZones = [...prev.deliveryZones];
      updatedZones[index][field] = value;
      return { ...prev, deliveryZones: updatedZones };
    });
  };

  // Handle form submission
  const handleSubmit = async () => {
    try {
    //   await updateLocalDeliverySettings(locationId, settings);
      alert("Local delivery settings updated successfully!");
    } catch (error) {
      console.error("Error updating settings:", error);
      alert("Failed to update settings. Please try again.");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container">
    <div className="local-delivery">
      <h2>Local delivery</h2>
      <span>Deliver orders to customers directly from your locations</span>

      {/* Offers Delivery Checkbox
      <CheckBox
        label="This location offers local delivery"
        checked={settings.offersDelivery}
        onChange={(checked) => handleChange("offersDelivery", checked)}
      /> */}

      {/* Delivery Zones */}
      <div className="container-localDeliver">
      <h4>Your locations</h4>
      <div className="container-subDiv">
      {settings.map((setting, index) => (
          <Link to={`/delivery/local-settings/${setting.storeId}`}>
        <div className="storeDiv">
            <div className="storeDivRight">
                <TbLocation/>
                <div className="subStoreDivRight">
                    <span>{setting.storeName}</span>
                    <span>{setting.storeAddress}</span>
                </div>
            </div>
            <div className="offersDelivery">
                {setting.offersDelivery ? `Offers Delivery` : 'Dont offer delivery'}
            </div>
        </div>
        </Link>
      ))}
      </div>

      {/* Add New Zone Button */}
      {/* <Button
        label="Add New Delivery Zone"
        onClick={() =>
          setSettings((prev) => ({
            ...prev,
            deliveryZones: [...prev.deliveryZones, { name: "", postalCodes: [], deliveryFee: 0 }],
          }))
        }
      />   */}
          </div>


      {/* Save Button */}
      {/* <Button label="Save" onClick={handleSubmit} /> */}
      </div>
      </div>
  );
};

export default LocalDelivery;