import axios from 'axios';
import { useEffect, useState } from 'react';
import '../styles/Inventory.css';
import apiClient from '../apiClient/axiosObject.js';
  
function Inventory() {
  const [data, setData] = useState([]);

  const fetchData = async () => {
  try {
    const response = await apiClient.get('Products');
    setData(response.data);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};
  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = (id) => {
  apiClient.delete(`Products/${id}`)
    .then(() => {
      fetchData(); 
    })
    .catch(error => {
      console.error('Error deleting item:', error);
    });
};


  return (
    <div className='main'>
      <table className='inventory_table'>
        <thead className='table_head'>
          <tr >
            <th>ItemName</th>
            <th>Category</th>
            <th>Quantity</th>
            <th>Unit Price</th>
            <th>Threshold</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {
            data.map((item) => (
              <tr key={item.id}>
                <td>{item.itemName}</td>
                <td>{item.category}</td>
                <td>{item.quantity}</td>
                <td>${item.unitPrice.toFixed(2)}</td>
                <td>{item.threshold}</td>
                <td>{item.status}</td>
                <td>
                  <button>Edit</button>
                  <button onClick={() => handleDelete(item.id)}>Delete</button>
                </td>
              </tr>
            ))
          }
        </tbody>
      </table>
    </div>
  );
}

export default Inventory;
