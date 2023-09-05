// AddProduct.js

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AddProduct = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [company, setCompany] = useState("");
  const [image, setImage] = useState(null);
  const [error, setError] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
     console.log("Selected image file:", file);
    setImage(file);
  };

  const addProduct = async () => {
    if (!name || !price || !category || !company || !image) {
      setError(true);
      return;
    }

    setError(false);
console.log("Image file:", image);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price);
    formData.append("category", category);
    formData.append("company", company);
    formData.append("image", image);

    try {
      const response = await fetch("https://helloword-9tgz.onrender.com/add-product", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      console.log("Server Response:",response.status, data);
      // Optionally, you can navigate to the product list page after successful addition
      // Example (if using useNavigate hook):
      navigate("/");
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  return (
    <div className="product">
      <h1>Add Product</h1>

      <input
        className="inputbox"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter name"
      />
      {error && !name && <span className="invalid-input">Enter valid name</span>}

      <input
        className="inputbox"
        type="number"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        placeholder="Enter price"
      />
      {error && !price && <span className="invalid-input">Enter valid price</span>}

      <input
        className="inputbox"
        type="text"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        placeholder="Enter category"
      />
      {error && !category && (
        <span className="invalid-input">Enter valid category</span>
      )}

      <input
        className="inputbox"
        type="text"
        value={company}
        onChange={(e) => setCompany(e.target.value)}
        placeholder="Enter company"
      />
      {error && !company && (
        <span className="invalid-input">Enter valid company</span>
      )}

      <input
        type="file"
        onChange={handleImageChange}
        accept="image/*"
        style={{ margin: "10px 0" }}
      />
      {error && !image && <span className="invalid-input">Select an image</span>}

      <button className="appbutton" onClick={addProduct} type="button">
        Submit
      </button>
    </div>
  );
};

export default AddProduct;
