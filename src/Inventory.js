import React from 'react'
// import { useNavigate } from 'react-router-dom';
// const navigate=useNavigate();
//   const handleSubmit=(e)=>{
//     e.preventDefault();
//     navigate("/Inventory")

//   }
  //3113
function Inventory() {
  return (
    <div>
      <table>
        <tr>
          <th>Item Name</th>
          <th>Category</th>
          <th>Quantity</th>
          <th>Unit Price</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </table>

    </div>
  )
}

export default Inventory;