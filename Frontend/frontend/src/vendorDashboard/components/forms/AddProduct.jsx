import React, { useState } from 'react';
import { API_URL } from '../../data/apiPath.js';

const AddProduct = () => {
  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState([]);
  const [bestseller, setBestseller] = useState(false);
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    setCategory((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
    );
  };

  const handleBestsellerChange = (e) => {
    const value = e.target.value === 'yes';
    setBestseller(value);
  };

  const handleImageUpload = (e) => {
    setImage(e.target.files[0]);
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();

    const loginToken = localStorage.getItem('loginToken'); // ✅ Corrected key
    const firmID = localStorage.getItem('firmId');

    if (!loginToken || !firmID) {
      console.error("❌ No login token or firm ID found");
      alert("❌ You must be logged in and have a firm registered.");
      return;
    }

    // Basic form validation
    if (!productName || !price || !description || !image) {
      alert('⚠️ Please fill all required fields.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('productName', productName);
      formData.append('price', price);
      formData.append('description', description);
      formData.append('image', image);
      category.forEach((val) => formData.append('category', val));
      formData.append('bestseller', bestseller ? 'yes' : 'no');

      const response = await fetch(`${API_URL}/product/add-product/${firmID}`, {
        method: 'POST',
        headers: {
          token: loginToken, // ✅ Include token in header
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        alert('✅ Product added successfully!');
        // Reset form
        setProductName('');
        setPrice('');
        setCategory([]);
        setBestseller(false);
        setImage(null);
        setDescription('');
      } else {
        alert(`❌ Failed: ${data.message || 'Server Error'}`);
      }
    } catch (error) {
      console.error(error);
      alert('❌ Failed to add product');
    }
  };

  return (
    <div className="firmSection">
      <form className="tableForm" onSubmit={handleAddProduct}>
        <h2>Add Product</h2>

        <label>Product Name</label>
        <input
          type="text"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
        />

        <label>Price</label>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        {/* Category Section */}
        <div className="checkInp">
          <label>Category</label>
          <div className="inputsContainer">
            {['veg', 'non-veg', 'dessert'].map((cat) => (
              <div className="checkBoxContainer" key={cat}>
                <label>{cat}</label>
                <input
                  type="checkbox"
                  value={cat}
                  checked={category.includes(cat)}
                  onChange={handleCategoryChange}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Bestseller Section */}
        <div className="checkInp">
          <label>Bestseller</label>
          <div className="inputsContainer">
            <div className="checkBoxContainer">
              <label>Yes</label>
              <input
                type="radio"
                name="bestseller"
                value="yes"
                checked={bestseller === true}
                onChange={handleBestsellerChange}
              />
            </div>
            <div className="checkBoxContainer">
              <label>No</label>
              <input
                type="radio"
                name="bestseller"
                value="no"
                checked={bestseller === false}
                onChange={handleBestsellerChange}
              />
            </div>
          </div>
        </div>

        <label>Description</label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <label>Product Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
        />

        <div className="btnSubmit">
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
