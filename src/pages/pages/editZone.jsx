import React, { useState, useEffect } from 'react';
import Button from '../../components/common/Button';

const EditZone = ({ zone, onUpdateZone }) => {
  const [zoneName, setZoneName] = useState(zone?.zoneName);
  const [countries, setCountries] = useState(zone?.countries.join(', '));
  const [shippingCharge, setShippingCharge] = useState(zone?.charge);

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdateZone({
      ...zone,
      zoneName,
      countryArray: countries.split(',').map((country) => country.trim()),
      shippingCharge: parseFloat(shippingCharge),
    });
  };

  return (
    <div className="create-zone">
      <h3>Edit Zone</h3>
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
          <Button label="Update Zone"/>
      </form>
    </div>
  );
};

export default EditZone;