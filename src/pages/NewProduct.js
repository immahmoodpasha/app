import React from 'react';
import "../styles/NewProduct.css";

function NewProduct () {
  return (
    <div id="addprod-page">
      <div id="addprod-cont">
        <h2 id="head-addprod">ADD PRODUCT</h2>
        <form id="addprod-form">
          <div id="prod-name">
            <label htmlFor="pn">Product Name</label>
            <input type="text" id="pn" required/>
          </div>
          <div id="prod-img">
            <label htmlFor="pn">Product Image URL</label>
            <input type="text" id="pi" required/>
          </div>
          <div id="categ">
            <label htmlFor="ct">Category</label>
            <input type="text" id="ct" required/>
          </div>
          <div id="quant">
            <label htmlFor="qn">Quantity</label>
            <input type="number" id="qn" required/>
          </div>
          <div id="un-pr">
            <label htmlFor="up">Unit Price</label>
            <input type="number" id="up" required/>
          </div>
          <div id="thres">
            <label htmlFor="th">Threshold</label>
            <input type="number" id="th" required/>
          </div>
          <button id="btn-addprod">ADD</button>
        </form>
    </div>
    </div>
  )
}

export default NewProduct