import { useEffect, useState } from "react";
import "../styles/Inventory.css";
import apiClient from "../apiClient/axiosObject.js";
import { FaCheckSquare, FaRegSquare } from "react-icons/fa";
import { AiFillEdit } from "react-icons/ai";
import { RiArrowUpCircleLine } from "react-icons/ri";

function Inventory() {
  const [data, setData] = useState([]);
  const [editingRowId, setEditingRowId] = useState(null);
  const [editableItem,setEditableItem] = useState({});

  const fetchData = async () => {
    try {
      const response = await apiClient.get("Products");
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const toggleActive = async (id) => {
    try {
      const item = data.find((item) => item.id === id);
      const updatedItem = { ...item, isActive: !item.isActive };
      await apiClient.patch(`Products/${id}`, updatedItem);
      setData(data.map((item) => (item.id === id ? updatedItem : item)));
    } catch (error) {
      console.error("Error updating item:", error);
    }
  };
  const handleEdit=(id) => {
    const item = data.find((item) => item.id === id);
    setEditingRowId(id);
    setEditableItem({...item });
  };
  const handleSave = async () => {
    try {
      await apiClient.patch(`Products/${editingRowId}`, editableItem);
      setData(data.map((item) => (item.id === editingRowId ? editableItem : item)));
      setEditingRowId(null);
    } catch (error) {
      console.error("Error saving item:", error);
    }
  };

  return (
    <div className="main">
      <div className="container">
        <table className="inventory_table">
          <thead className="table_head">
            <tr>
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
            {data.map((item) => {
              let status = "";
              let colour = "";
              if (item.quantity == 0) {
                status = "Out of Stock";
                colour = "red";
              } else if (item.quantity < item.threshold) {
                status = "Low Stock";
                colour = "orange";
              } else {
                status = "In Stock";
                colour = "green";
              }
              return item.id == editingRowId ? (
                  <tr key={item.id}>
                    <td>{item.itemName}</td>
                    <td>{item.category}</td>
                    <td>
                      <input
                        type="number"
                        value={editableItem.quantity}
                        onChange={(e) =>
                          setEditableItem({
                            ...editableItem,
                            quantity: e.target.value,
                          })
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        value={editableItem.unitPrice}
                        onChange={(e) =>
                          setEditableItem({
                            ...editableItem,
                            unitPrice: e.target.value,
                          })
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        value={editableItem.threshold}
                        onChange={(e) =>
                          setEditableItem({
                            ...editableItem,
                            threshold: e.target.value,
                          })
                        }
                      />
                    </td>
                    <td style={{ color: colour }}>{status}</td>
                    <td>
                      <button style={{ background: "none", border: "none" }} onClick={handleSave} >
                        <RiArrowUpCircleLine size={25} />
                      </button>
                      <button
                        onClick={() => toggleActive(item.id)}
                        style={{ background: "none", border: "none" }}
                      >
                        {item.isActive ? (
                          <FaCheckSquare size={25} />
                        ) : (
                          <FaRegSquare size={25} />
                        )}
                      </button>
                    </td>
                  </tr>
                ) : (
                  <tr key={item.id}>
                    <td>{item.itemName}</td>
                    <td>{item.category}</td>
                    <td>{item.quantity}</td>
                    <td>${item.unitPrice.toFixed(2)}</td>
                    <td>{item.threshold}</td>
                    <td style={{ color: colour }}>{status}</td>
                    <td>
                      <button style={{ background: "none", border: "none" }} onClick={() => handleEdit(item.id)}>
                        <AiFillEdit size={25} />
                      </button>
                      <button
                        onClick={() => toggleActive(item.id)}
                        style={{ background: "none", border: "none" }}
                      >
                        {item.isActive ? (
                          <FaCheckSquare size={25} />
                        ) : (
                          <FaRegSquare size={25} />
                        )}
                      </button>
                    </td>
                  </tr>
                );
              
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Inventory;
