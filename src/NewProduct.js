import React from 'react';
import "./NewProduct.css";

function NewProduct () {
  return (
    <div>
        <h2>ADD PRODUCT</h2>
        <form>
            <label htmlFor="pn">Product Name:</label>
            <input type="text" id="pn"/>
            <input type="" />
            <button>ADD</button>
        </form>
    </div>
  )
}

export default NewProduct