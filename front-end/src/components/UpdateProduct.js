import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const UpdateProduct = () => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [company, setCompany] = useState("");
  const [image, setImage] = useState(null); // State to hold the selected image file
  const params = useParams();
  const navigate = useNavigate();
  
  useEffect(() => {
    const getproductdetails = async () => {
      try {
        let result = await fetch(`https://e-dashboarddone-git-main-parthiv8848.vercel.app/${params.id}`);
        result = await result.json();
        setName(result.name);
        setPrice(result.price);
        setCategory(result.category);
        setCompany(result.company);
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    };
    
    getproductdetails();
  }, [params.id]);

 


  const handleUpdate = async () => {
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("company", company);
      if (image) {
        formData.append("image", image);
      }

      let result = await fetch(`https://e-dashboarddone-git-main-parthiv8848.vercel.app/${params.id}`, {
        method: "put",
        body: formData,
      });

      await result.json();
      navigate("/");
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  return (
    <div className="product">
      <h1>Update Product</h1>

      <input
        className="inputbox"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="enter name"
      />

      <input
        className="inputbox"
        type="number"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        placeholder="enter price"
      />

      <input
        className="inputbox"
        type="text"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        placeholder="enter category"
      />

      <input
        className="inputbox"
        type="text"
        value={company}
        onChange={(e) => setCompany(e.target.value)}
        placeholder="enter company"
      />

      <div>
        <label>Update Image: </label>
        <input type="file" onChange={handleImageChange} />
      </div>

      <button className="appbutton" onClick={handleUpdate} type="button">
        Submit
      </button>
    </div>
  );
};

export default UpdateProduct;
