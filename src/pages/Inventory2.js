// 1. Remove these unused imports if not needed elsewhere
// import { usePagination, useSortBy } from 'react-table';
import { useEffect, useState, useMemo, useRef } from "react";
import "../styles/Inventory.css";
import apiClient from "../apiClient/axiosObject.js";
import { FaCheckSquare, FaRegSquare, FaSearch, FaPlus } from "react-icons/fa";
import { FiEdit2 } from "react-icons/fi";
import { AiFillEdit } from "react-icons/ai";
import { RiArrowUpCircleLine, RiCloseCircleLine } from "react-icons/ri";
import {
useTable,
useSortBy,
usePagination,
useGlobalFilter,
} from "react-table";
import { useJWT } from "../jwtContextProvider.js";
import {debounce, values} from 'lodash';
import '../styles/Inventory.css'

const Inventory2 = () => {
// 2. Simplify the component state
const [loading, setLoading] = useState(false);
const [data, setData] = useState([]);
const [editingRowId, setEditingRowId] = useState(null);
const [editableItem, setEditableItem] = useState({});
const justStartedEditing = useRef(true);
const [serverParams, setServerParams] = useState({
pageNumber: 1,
sortBy: 'itemName',
isAscending: true,
filterQuery: ''
});
const [totalItems, setTotalItems] = useState(0);
const {getAuthHeader} = useJWT();
const headers = getAuthHeader();
const [searchInput, setSearchInput] = useState('');
const [isModalOpen, setIsModalOpen] = useState(false);
const [newItem, setNewItem] = useState({
name: "",
costPrice: 0,
price: 0,
units: "",
quantity: 0,
threshold: 0,
imageUrl: "",
categoryId: ""
});

// Add this function to handle search
const handleSearch = (e) => {
  e.preventDefault();
  setServerParams(prev => ({
    ...prev,
    filterQuery: searchInput,
    pageNumber: 1 // Reset to first page when searching
  }));
};

const handleInputChange = (e) => {
  const { name, value } = e.target;
  setNewItem(prev => ({
    ...prev,
    [name]: name === 'costPrice' || name === 'price' || name === 'quantity' || name === 'threshold' 
      ? parseFloat(value) || 0 
      : value
  }));
};

const handleAddItem = async (e) => {
  e.preventDefault();
  try {
    await apiClient.post('api/Product', newItem, { headers });
    setIsModalOpen(false);
    // Reset form and refresh data
    setNewItem({
      name: "",
      costPrice: 0,
      price: 0,
      units: "",
      quantity: 0,
      threshold: 0,
      imageUrl: "",
      categoryId: ""
    });
    // Refresh the table data
    fetchData();
  } catch (error) {
    console.error("Error adding item:", error);
  }
};

const { handleEdit, handleSave, toggleActive } = useMemo(() => {
 const handleEdit = (id) => {
   const item = data.find((item) => item.id === id);
   if (item) {
     justStartedEditing.current = true;
     setEditingRowId(id);
     setEditableItem({ ...item });
   }
 };
 const handleSave = async () => {
     if (!editingRowId) return;
  
     try {
       await apiClient.put(`api/Product/${editableItem.id}`, editableItem, { headers });
    
       setData(prevData =>
         prevData.map(item =>
           item.id === editingRowId ? { ...item, ...editableItem } : item
         )
       );
    
       setEditingRowId(null);
       setEditableItem({});
     } catch (error) {
       console.error("Error saving item:", error);
     }
   };
 const toggleActive = async (id) => {
   const item = data.find((item) => item.id === id);
   if (!item) return;
   const updatedItem = { ...item, isActive: !item.isActive };
   try {
     await apiClient.put(`api/Product/${updatedItem.id}`, updatedItem);
     setData((prevData) =>
       prevData.map((i) => (i.id === id ? updatedItem : i))
     );
   } catch (error) {
     console.error("Error updating item:", error);
   }
 };
 return { handleEdit, handleSave, toggleActive };
}, [data, editableItem, editingRowId]);

// 3. Basic columns definition
const columns = useMemo(() => [
 {
   Header: "Item Name",
   accessor: "name",
   Cell: ({ row, value }) =>
     row.original.id === editingRowId ? (
       <input
         value={editableItem.name || ''}
         onChange={(e) =>
           setEditableItem(prev => ({ ...prev, name: e.target.value }))
         }
       />
     ) : (
       value
     )
 },
 {
   Header: "Category",
   accessor: "category.name",
   Cell: ({ row, value }) =>
     row.original.id === editingRowId ? (
       <input
         value={editableItem.category?.name || ''}
         onChange={(e) =>
           setEditableItem(prev => ({
             ...prev,
             category: {
               ...prev.category,
               name: e.target.value
             }
           }))
         }
       />
     ) : (
       value || 'N/A'
     )
 },
 {
   Header: "Quantity",
   accessor: "quantity",
   Cell: ({ row, value }) =>
     row.original.id === editingRowId ? (
       <input
         type="number"
         value={editableItem.quantity || ''}
         onChange={(e) =>
           setEditableItem(prev => ({
             ...prev,
             quantity: Number(e.target.value)
           }))
         }
       />
     ) : (
       value
     )
 },
 {
   Header: "Unit Price",
   accessor: "price",
   Cell: ({ row, value }) =>
     row.original.id === editingRowId ? (
       <input
         type="number"
         step="0.01"
         value={editableItem.price || ''}
         onChange={(e) =>
           setEditableItem(prev => ({
             ...prev,
             price: Number(e.target.value)
           }))
         }
       />
     ) : (
       value ? `$${value.toFixed(2)}` : '$0.00'
     )
 },
 {
   Header: "Status",
   accessor: "productStatus",
   Cell: ({ row, value }) => {
     if (row.original.id === editingRowId) {
       return (
         <select
           value={editableItem.productStatus || ''}
           onChange={(e) =>
             setEditableItem(prev => ({
               ...prev,
               productStatus: e.target.value
             }))
           }
         >
           <option value="InStock">In Stock</option>
           <option value="LowStock">Low Stock</option>
           <option value="OutOfStock">Out of Stock</option>
         </select>
       );
     }
     if (value === "OutOfStock") return "Out of Stock";
     if (value === "LowStock") return "Low Stock";
     return "In Stock";
   }
 },
 {
   Header: "Active",
   accessor: "isActive",
   disableSortBy: true,
   Cell: ({ row }) => {
     const { id, isActive } = row.original;
     return (
       <div
         style={{
           display: 'flex',
           justifyContent: 'center',
           alignItems: 'center',
           height: '100%'
         }}
       >
         <button
           onClick={() => toggleActive(id)}
           style={{
             background: 'none',
             border: 'none',
             cursor: 'pointer',
             padding: '4px',
             display: 'flex',
             alignItems: 'center',
             justifyContent: 'center',
             borderRadius: '4px',
             transition: 'background-color 0.2s',
             ':hover': {
               backgroundColor: 'rgba(138, 43, 226, 0.1)'
             }
           }}
           title={isActive ? "Deactivate" : "Activate"}
         >
           {isActive ? (
             <FaCheckSquare size={24} style={{ color: "#8a2be2" }} />
           ) : (
             <FaRegSquare size={24} style={{ color: "#8a2be2" }} />
           )}
         </button>
       </div>
     );
   },
 },
 {
   Header: "Actions",
   accessor: "actions",
   disableSortBy: true,
   Cell: ({ row }) => {
     const { id } = row.original;
     return row.original.id === editingRowId ? (
       <div className="action-buttons" style={{ justifyContent: 'center' }}>
         <button
           onClick={handleSave}
           style={{
             background: "none",
             border: "none",
             cursor: "pointer",
             padding: '4px 8px',
             borderRadius: '4px',
             display: 'flex',
             alignItems: 'center',
             transition: 'background-color 0.2s',
             ':hover': {
               backgroundColor: 'rgba(76, 175, 80, 0.1)'
             }
           }}
           title="Save Changes"
         >
           <RiArrowUpCircleLine size={24} color="#4CAF50" />
         </button>
         <button
           onClick={() => setEditingRowId(null)}
           style={{
             background: "none",
             border: "none",
             cursor: "pointer",
             marginLeft: "8px",
             padding: '4px 8px',
             borderRadius: '4px',
             display: 'flex',
             alignItems: 'center',
             transition: 'background-color 0.2s',
             ':hover': {
               backgroundColor: 'rgba(244, 67, 54, 0.1)'
             }
           }}
           title="Cancel"
         >
           <RiCloseCircleLine size={24} color="#F44336" />
         </button>
       </div>
     ) : (
       <div className="action-buttons" style={{ justifyContent: 'center' }}>
         <button
           onClick={() => handleEdit(id)}
           style={{
             background: "none",
             border: "none",
             cursor: "pointer",
             padding: '4px 8px',
             borderRadius: '4px',
             display: 'flex',
             alignItems: 'center',
             transition: 'background-color 0.2s',
             ':hover': {
               backgroundColor: 'rgba(138, 43, 226, 0.1)'
             }
           }}
           title="Edit"
         >
           <FiEdit2 size={22} style={{ color: "#8a2be2" }} />
         </button>
       </div>
     );
   },
 },
], [editingRowId, editableItem, handleEdit, handleSave, toggleActive]);

// 4. Basic table instance
const {
getTableProps,
getTableBodyProps,
headerGroups,
rows,
prepareRow,
} = useTable({
columns,
data: data || [],
});

// 5. Simplified fetch function
const fetchData = async () => {
  setLoading(true);
  try {
    const response = await apiClient.get("api/Product", {
      params: {
        pageNumber: serverParams.pageNumber,
        sortBy: serverParams.sortBy,
        isAscending: serverParams.isAscending,
        filterQuery: serverParams.filterQuery
      },
      headers
    });
    setData(response.data.data || []);
    console.log("Data fetched:", response.data.data);
  } catch (error) {
    console.error("Error fetching data:", error);
  } finally {
    setLoading(false);
  }
};

// 6. Fetch data on mount
useEffect(() => {
  const timer = setTimeout(() => {
    fetchData();
  }, 300); // Add debounce to prevent too many requests

  return () => clearTimeout(timer);
}, [serverParams]);

if (loading) {
return (
<div style={{
display: 'flex',
justifyContent: 'center',
alignItems: 'center',
height: '200px'
}}>
<div>Loading products...</div>
</div>
);
}

if (!data || data.length === 0) {
return <div>No products found</div>;
}

// 7. Simplified table render
return (
<div className="inventory-table-container">
  <div className='table-header'>
    <div className='header-content'>
      <h3 className='table-title'>Inventory Items</h3>
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        <form onSubmit={handleSearch} className="search-form">
          <div className="search-input-container">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search inventory..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="search-input"
            />
          </div>
        </form>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="add-item-button"
          style={{
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '20px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontWeight: '500',
            transition: 'background-color 0.2s',
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#45a049'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#4CAF50'}
        >
          <FaPlus /> Add Item
        </button>
      </div>
    </div>
    <hr className='header-line' />
  </div>
  <div className="table-content">
    <table className="inventory_table" {...getTableProps()}>
      <thead>
        {headerGroups.map((headerGroup, i) => (
          <tr key={`header-${i}`} {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column, j) => (
              <th
                key={`header-cell-${j}`}
                {...column.getHeaderProps()}
                style={{
                  padding: '8px',
                  borderBottom: '1px solid #ddd',
                  textAlign: 'center',
                  fontWeight: 900
                }}
              >
                {column.render('Header')}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row, i) => {
          prepareRow(row);
          return (
            <tr key={`row-${i}`} {...row.getRowProps()}>
              {row.cells.map((cell, j) => (
                <td
                  key={`cell-${i}-${j}`}
                  {...cell.getCellProps()}
                >
                  {cell.render('Cell')}
                </td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
    {loading && <div>Loading...</div>}
  </div>
  {isModalOpen && (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '24px',
        borderRadius: '8px',
        width: '100%',
        maxWidth: '500px',
        maxHeight: '90vh',
        overflowY: 'auto',
        position: 'relative',
      }}>
        <button 
          onClick={() => setIsModalOpen(false)}
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            background: 'none',
            border: 'none',
            fontSize: '20px',
            cursor: 'pointer',
            color: '#666',
          }}
        >
          ×
        </button>
        <h2 style={{ marginBottom: '20px', color: '#333' }}>Add New Item</h2>
        <form onSubmit={handleAddItem}>
          {['name', 'units', 'imageUrl', 'categoryId'].map(field => (
            <div key={field} style={{ marginBottom: '15px' }}>
              <label style={{
                display: 'block',
                marginBottom: '5px',
                fontWeight: '500',
                color: '#444',
              }}>
                {field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')}:
              </label>
              <input
                type={field === 'imageUrl' ? 'url' : 'text'}
                name={field}
                value={newItem[field]}
                onChange={handleInputChange}
                required={field !== 'imageUrl'}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '14px',
                }}
              />
            </div>
          ))}
          
          {['costPrice', 'price', 'quantity', 'threshold'].map(field => (
            <div key={field} style={{ marginBottom: '15px' }}>
              <label style={{
                display: 'block',
                marginBottom: '5px',
                fontWeight: '500',
                color: '#444',
              }}>
                {field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')}:
              </label>
              <input
                type="number"
                name={field}
                value={newItem[field]}
                onChange={handleInputChange}
                min="0"
                step={field.includes('Price') ? '0.01' : '1'}
                required
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '14px',
                }}
              />
            </div>
          ))}
          
          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '10px',
            marginTop: '20px',
          }}>
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              style={{
                padding: '8px 16px',
                backgroundColor: '#f5f5f5',
                border: '1px solid #ddd',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                padding: '8px 16px',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Add Item
            </button>
          </div>
        </form>
      </div>
    </div>
  )}
</div>
);
}
export default Inventory2;
