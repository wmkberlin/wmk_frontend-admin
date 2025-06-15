import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Input from '../../components/common//Input'; // Assuming your custom Input component
import TextEditor from '../../components/common/TextEditor'; // Assuming your custom TextEditor component
import Button from '../../components/common/Button'; // Assuming your custom Button component
import axios from 'axios';
import axiosInstance from '../../axiosInstance';

const ManageDefaultFieldsDashboard = () => {
    const [formData, setFormData] = useState({
        welcomeText: '',
        sliderText: '',
        shopTiming: '',
    });
    
    useEffect(() => {
        fetchDefaults();
    }, []);

    const fetchDefaults = async () => {
        try {
            const response = await axiosInstance.get(`/admin_product/dashboardTexts`);
            setFormData(response.data || {});
            console.log(formData);
            
        } catch (error) {
            console.error('Error fetching defaults:', error);
        }
    };

    const handleChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async () => {
        try {
          // Destructure the form data
          const { welcomeText, sliderText, shopTiming } = formData;
      
          // Send the data in the required format
          await axiosInstance.put('/admin_product/updateDashboardTexts', {
            welcomeText,
            sliderText,
            shopTiming,
          });
      
          alert('Global defaults updated successfully!');
        } catch (error) {
          console.error('Error updating defaults:', error);
        }
      };

    return (
        <div className="container">
            <h2>Manage Default Fields For Dashboard</h2>
            <Input
                type="text"
                label="Welcome Text"
                placeholder="Enter Welcome Text"
                value={formData.welcomeText}
                onChange={(value) => handleChange('welcomeText', value)}
            />
            <Input
                type="text"
                label="Slider Text"
                placeholder="Enter Slider Text"
                value={formData.sliderText}
                onChange={(value) => handleChange('sliderText', value)}
            />
            <Input
                type="text"
                label="Shop Timing Text"
                placeholder="Enter Shop Timing Text"
                value={formData.shopTiming}
                onChange={(value) => handleChange('shopTiming', value)}
            />
            <Button label="Save" onClick={handleSubmit} />
        </div>
    );
};

export default ManageDefaultFieldsDashboard;
