import React, { useState } from 'react';
import Button from '../../components/common/Button';
import { useParams } from 'react-router-dom';

const CreateZone = ({ onCreateZone }) => {
  const packaging = useParams();
  const [zoneName, setZoneName] = useState('');
  const [countries, setCountries] = useState('');
  const [shippingCharge, setShippingCharge] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreateZone({
      zoneName,
      countryArray: countries.split(',').map((country) => country.trim()),
      shippingCharge: parseFloat(shippingCharge),
      packagingType: packaging.type.replace('_', ' ')
    });
  };


  return (
    <div className="create-zone">
      <h3>Create New Zone</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Zone Name"
          value={zoneName}
          onChange={(e) => setZoneName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Countries (comma-separated)"
          value={countries}
          onChange={(e) => setCountries(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Shipping Charge (in euros)"
          value={shippingCharge}
          onChange={(e) => setShippingCharge(e.target.value)}
          required
        />
        <Button label="Create Zone"/>
      </form>
    </div>
  );
};

export default CreateZone;