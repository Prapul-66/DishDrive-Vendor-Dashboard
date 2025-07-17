import React, { useState } from 'react';
import { API_URL } from '../../data/apiPath.js';

const AddFirm = () => {
  const [firmName, setFirmName] = useState('');
  const [area, setArea] = useState('');
  const [category, setCategory] = useState([]);
  const [region, setRegion] = useState([]);
  const [offer, setOffer] = useState('');
  const [file, setFile] = useState(null);

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    setCategory((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
    );
  };

  const handleRegionChange = (e) => {
    const value = e.target.value;
    setRegion((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
    );
  };

  const handleImageUpload = (e) => {
    setFile(e.target.files[0]);
  };

  const handleFirmSubmit = async (e) => {
    e.preventDefault();
    try {
      const loginToken = localStorage.getItem('loginToken'); // ✅ Fixed here
      console.log("Login Token:", loginToken);

      if (!loginToken) {
        alert("❌ No login token found");
        return;
      }

      const formData = new FormData();
      formData.append('firmName', firmName);
      formData.append('area', area);
      formData.append('offer', offer);
      if (file) {
        formData.append('firmImage', file);
      }

      category.forEach((val) => formData.append('category', val));
      region.forEach((val) => formData.append('region', val));

      const response = await fetch(`${API_URL}/firm/add-firm`, {
        method: 'POST',
        headers: {
          token: loginToken,
        },
        body: formData,
      });

      const contentType = response.headers.get('content-type');
      let data;

      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        console.error("Server response was not JSON:", text);
        throw new Error("Server returned invalid response");
      }

      console.log("Response:", data);

      if (response.ok) {
        alert('✅ Firm added successfully');
        const firmID = data.firmID;
        console.log("Firm ID:", firmID);
        localStorage.setItem('firmId', firmID);

        setFirmName('');
        setArea('');
        setOffer('');
        setCategory([]);
        setRegion([]);
        setFile(null);
      } else if (data.message === "Vendor can only add one firm") {
        alert("Firm already exists for this vendor. You can only add one firm.");
      } else {
        alert("Failed to add firm.");
      }

    } catch (err) {
      console.error('❌ Error:', err);

      if (err?.message?.includes('E11000 duplicate key')) {
        alert('❌ A firm with this name already exists!');
      } else {
        alert('❌ Error submitting form');
      }
    }
  };

  return (
    <div className="firmSection">
      <form className="tableForm" onSubmit={handleFirmSubmit}>
        <h2>Add Firm</h2>

        <label>Firm Name</label>
        <input type="text" value={firmName} onChange={(e) => setFirmName(e.target.value)} />

        <label>Area</label>
        <input type="text" value={area} onChange={(e) => setArea(e.target.value)} />

        {/* Category */}
        <div className="checkInp">
          <label>Category</label>
          <div className="inputsContainer">
            <label>
              <input
                type="checkbox"
                value="vegetarian"
                checked={category.includes('vegetarian')}
                onChange={handleCategoryChange}
              />
              Vegetarian
            </label>
            <label>
              <input
                type="checkbox"
                value="non-vegetarian"
                checked={category.includes('non-vegetarian')}
                onChange={handleCategoryChange}
              />
              Non-Vegetarian
            </label>
          </div>
        </div>

        {/* Region */}
        <div className="checkInp">
          <label>Region</label>
          <div className="inputsContainer">
            <label>
              <input
                type="checkbox"
                value="south-indian"
                checked={region.includes('south-indian')}
                onChange={handleRegionChange}
              />
              South Indian
            </label>
            <label>
              <input
                type="checkbox"
                value="north-indian"
                checked={region.includes('north-indian')}
                onChange={handleRegionChange}
              />
              North Indian
            </label>
            <label>
              <input
                type="checkbox"
                value="chinese"
                checked={region.includes('chinese')}
                onChange={handleRegionChange}
              />
              Chinese
            </label>
            <label>
              <input
                type="checkbox"
                value="bakery"
                checked={region.includes('bakery')}
                onChange={handleRegionChange}
              />
              Bakery
            </label>
          </div>
        </div>

        <label>Offer</label>
        <input type="text" value={offer} onChange={(e) => setOffer(e.target.value)} />

        <label>Firm Image</label>
        <input type="file" onChange={handleImageUpload} />

        <button className="btnSubmit">Submit</button>
      </form>
    </div>
  );
};

export default AddFirm;
