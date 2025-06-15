import React from 'react';

const ZoneInfo = ({ zones, onEditZone }) => {
  return (
    <div className="zone-info">
      <h3>Zone Information</h3>
      {zones.map((zone) => (
        <div key={zone._id} className="zone-card">
          <h4>{zone.zoneName}</h4>
          <p>Countries: {zone.countries.join(', ')}</p>
          <p>Price: {zone.charge}€</p>
          <button onClick={() => onEditZone(zone._id)}>Edit Zone</button>
        </div>
      ))}
    </div>
  );
};

export default ZoneInfo;