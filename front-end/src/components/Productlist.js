import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Productlist = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getProducts();
  }, []);

  const getProducts = async () => {
    try {
      let result = await fetch("https://e-dashboarddone.vercel.app/products");
      result = await result.json();
      console.log("Response data:", result);
      if (Array.isArray(result)) {
        setProducts(result);
      } else {
        console.error("Invalid data format for products.");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const deleteProduct = async (id) => {
    try {
      let result = await fetch(`https://e-dashboarddone.vercel.app/product/${id}`, {
        method: "DELETE",
      });
      result = await result.json();

      if (result) {
        getProducts();
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const searchHandle = async (event) => {
    let key = event.target.value;

    if (key) {
      try {
        let result = await fetch(`https://e-dashboarddone.vercel.app/search/${key}`);
        result = await result.json();

        if (result) {
          setProducts(result);
        }
      } catch (error) {
        console.error("Error searching products:", error);
      }
    } else {
      getProducts();
    }
  };

  // Construct the image URL
const serverUrl = 'https://e-dashboarddone.vercel.app'; // Replace with your backend server URL

const constructImageUrl = (imagePath) => {
  // Check if the imagePath already contains 'uploads/' and remove it if present
  if (imagePath.startsWith('uploads/')) {
    imagePath = imagePath.substring('uploads/'.length);
  }
  
  const encodedImageName = encodeURIComponent(imagePath);
  return `${serverUrl}/uploads/${encodedImageName}`;
};






  return (
    <div className="productlist">
      <h3>Product List</h3>
      <input
        type="text"
        className="search-product-box"
        placeholder="Search Product"
        onChange={searchHandle}
      />

      <ul>
        <li>s.no.</li>
        <li>Name</li>
        <li>Price</li>
        <li>Category</li>
        <li>Company</li>
        <li>Image</li>
        <li>Delete</li>
        <li>Update</li>
      </ul>

      {products.length > 0 ? (
        products.map((item, index) => (
          <ul key={item._id}>
            <li>{index + 1}</li>
            <li>{item.name}</li>
            <li>{item.price}</li>
            <li>{item.category}</li>
            <li>{item.company}</li>
            <li>
              {item.image ? (
               <img
                  src={constructImageUrl(item.image)} // Use the constructed image URL
                  alt={item.name}
                  style={{ width: "100px", height: "100px" }}
                      loading="lazy"
                />
              ) : (
                "No Image"
              )}
            </li>
            <li className="buttons">
              <div>
                <button onClick={() => deleteProduct(item._id)}>Delete</button>
              </div>
            </li>
            <li>
              <div>
                <Link to={"/update/" + item._id}>Update</Link>
              </div>
            </li>
          </ul>
        ))
      ) : (
        <h1>No match found</h1>
      )}
    </div>
  );
};

export default Productlist;
