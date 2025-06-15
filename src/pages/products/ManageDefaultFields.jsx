import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Input from '../../components/common//Input'; // Assuming your custom Input component
import TextEditor from '../../components/common/TextEditor'; // Assuming your custom TextEditor component
import Button from '../../components/common/Button'; // Assuming your custom Button component
import axios from 'axios';
import axiosInstance from '../../axiosInstance';

const ManageDefaultFields = () => {
    const { type } = useParams();
    const [formData, setFormData] = useState({
        shopInfo: '',
        subtopic: '',
        storyShop: '',
        aboutUs: ''
    });
    
    useEffect(() => {
        fetchDefaults();
    }, [type]);

    const fetchDefaults = async () => {
        try {
            const response = await axiosInstance.get(`/admin_product/getDefaultFields/${type}`);
            setFormData(response.data || {});
        } catch (error) {
            console.error('Error fetching defaults:', error);
        }
    };

    const handleChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async () => {
        try {
            await axiosInstance.put('/admin_product/updateDefaultFields', { type, ...formData });
            alert('Global defaults updated successfully!');
        } catch (error) {
            console.error('Error updating defaults:', error);
        }
    };

    return (
        <div className="container">
            <h2>Manage Default Fields For {type}</h2>
            <Input
                type="text"
                label="Subtopic"
                placeholder="Enter subtopic"
                value={formData.subtopic}
                onChange={(value) => handleChange('subtopic', value)}
            />
            <TextEditor
                label="Shop Info"
                placeholder="Enter shopInfo"
                value={formData.shopInfo}
                onChange={(value) => handleChange('shopInfo', value)}
            />
            <TextEditor
                label="Story Shop"
                placeholder="Enter story shop details"
                value={formData.storyShop}
                onChange={(value) => handleChange('storyShop', value)}
            />
            <TextEditor
                label="About Us"
                placeholder="Enter about us information"
                value={formData.aboutUs}
                onChange={(value) => handleChange('aboutUs', value)}
            />
            <Button label="Save" onClick={handleSubmit} />
        </div>
    );
};

export default ManageDefaultFields;
