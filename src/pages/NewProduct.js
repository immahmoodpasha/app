import React, { useState } from 'react';
import "../styles/NewProduct.css";

function NewProduct() {
  const url = "http://localhost:3113/Products";

  const [product, setProduct] = useState({
    name: '',
    image: '',
    category: '',
    quantity: '',
    unitPrice: '',
    threshold: ''
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setProduct((prev) => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      name: product.pn,
      image: product.pi,
      category: product.ct,
      quantity: Number(product.qn),
      unitPrice: Number(product.up),
      threshold: Number(product.th)
    };

    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })
    .then(response => {
      if (!response.ok) throw new Error('Failed to add product');
      return response.json();
    })
    .then(data => {
      alert("Product added successfully!");
      setProduct({
        pn: '',
        pi: '',
        ct: '',
        qn: '',
        up: '',
        th: ''
      });
    })
    .catch(err => {
      console.error(err);
      alert("Something went wrong while adding the product.");
    });
  };

  return (
    <div id="addprod-page">
      <div id="addprod-cont">
        <h2 id="head-addprod">ADD PRODUCT</h2>
        <form id="addprod-form" onSubmit={handleSubmit}>
          <div id="prod-name">
            <label htmlFor="pn">Product Name</label>
            <input type="text" id="pn" value={product.pn} onChange={handleChange} required />
          </div>
          <div id="prod-img">
            <label htmlFor="pi">Product Image URL</label>
            <input type="text" id="pi" value={product.pi} onChange={handleChange} required />
          </div>
          <div id="categ">
            <label htmlFor="ct">Category</label>
            <input type="text" id="ct" value={product.ct} onChange={handleChange} required />
          </div>
          <div id="quant">
            <label htmlFor="qn">Quantity</label>
            <input type="number" id="qn" value={product.qn} onChange={handleChange} required />
          </div>
          <div id="un-pr">
            <label htmlFor="up">Unit Price</label>
            <input type="number" id="up" value={product.up} onChange={handleChange} required />
          </div>
          <div id="thres">
            <label htmlFor="th">Threshold</label>
            <input type="number" id="th" value={product.th} onChange={handleChange} required />
          </div>
          <button id="btn-addprod" type="submit">ADD</button>
        </form>
      </div>
    </div>
  );
}

export default NewProduct;