// 1. Remove these unused imports if not needed elsewhere
// import { usePagination, useSortBy } from 'react-table';
import { useEffect, useState, useMemo, useRef } from "react";
import "../styles/Inventory.css";
import apiClient from "../apiClient/axiosObject.js";
import { FaCheckSquare, FaRegSquare, FaSearch, FaPlus } from "react-icons/fa";
import { FiEdit2 } from "react-icons/fi";
import { AiFillEdit } from "react-icons/ai";
import { RiArrowUpCircleLine, RiCloseCircleLine } from "react-icons/ri";
import sort from '../assets/sort.png'
import sortUp from '../assets/sortUp.png'
import sortDown from '../assets/sortDown.png'
import barGraph from '../assets/barGraph.png'
import ProductPriceAnalysisModal from "../components/ProductPriceAnalysisModal";

import {
useTable,
useSortBy,
usePagination,
useGlobalFilter,
} from "react-table";
import { useJWT } from "../jwtContextProvider.js";
import {debounce, values} from 'lodash';
import '../styles/Inventory.css'
import { AreaChart,Line, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, defs, linearGradient, LabelList} from 'recharts';


const SortIcon = ({ active, isAsc }) => (
  <span style={{ marginLeft: 6, fontSize: 14, color: active ? '#8a2be2' : '#bbb', verticalAlign: 'middle' }}>
    {active ? (isAsc ? <img src={sortUp} height={'20px'}/> : <img src={sortDown} height={'20px'}/>) : <img src={sort} height={'20px'}/>}
  </span>
);

const Inventory2 = () => {
// 2. Simplify the component state
const [selectedProductId, setSelectedProductId] = useState(null);
const [loading, setLoading] = useState(false);
const [data, setData] = useState([]);
const [editingRowId, setEditingRowId] = useState(null);
const [editableItem, setEditableItem] = useState({});
const justStartedEditing = useRef(true);
const [serverParams, setServerParams] = useState({
pageNumber: 1,
sortBy: 'name',
isAscending: true,
filterQuery: ''
});
const [categories, setCategories] = useState([]);
const [totalItems, setTotalItems] = useState(0);
const {getAuthHeader} = useJWT();
const headers = getAuthHeader();
const [searchInput, setSearchInput] = useState('');
const [isModalOpen, setIsModalOpen] = useState(false);
const [newItem, setNewItem] = useState({
name: "",
costPrice: "",
price: "",
units: "",
quantity: "",
threshold: "",
imageUrl: "",
categoryId: ""
});
const [editPopup, setEditPopup] = useState({
  open: false,
  row: null,
  field: 'quantity',
});
const [isPriceModalOpen, setIsPriceModalOpen] = useState(false);
const [productPriceData, setProductPriceData] = useState({});


const handleEditPopup = (row) => {
  setEditPopup({
    open: true,
    row,
    field: 'quantity'
  });
};

const closeEditPopup = () => {
  setEditPopup({
    open: false,
    row: null,
    field: 'quantity'
  })
}

const handleEditFieldChange = (e) => {
  setEditPopup(prev => ({
    ...prev,
    field: e.target.value
  }));
};

const handleEditPopupSubmit = async (e) => {
  e.preventDefault();
  const {row, field} = editPopup;
  let payload = {...row.original};
  if (field === 'quantity') {
    payload.quantity = Number(e.target.quantity.value);
    payload.costPrice = Number(e.target.costPrice.value);
  } else if (field === 'threshold'){
    payload.threshold = Number(e.target.threshold.value);
  } else if (field === 'price') {
    payload.price = Number(e.target.price.value);
  }

  try{
    await apiClient.put(`api/Product/${row.original.id}`, payload, {headers});
    setData(prev =>
      prev.map(item=>
        item.id === row.original.id ? {...item, ...payload} : item
      )
    );
    closeEditPopup();
  }catch (error){
    console.error("Error updating item:",error);
  }
};
  

  useEffect(()=>{
    const fetchCategories = async () => {
    try{
      const response = await apiClient.get("api/Product/category", {headers});
      setCategories(response.data.data || []);
      console.log(categories);
    }catch(error){
      console.error("Error fetching Categories: ",error);
    }
  };
    fetchCategories();
  },[loading]);

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
    console.log("Added Item: ",newItem)
    setIsModalOpen(false);
    // Reset form and refresh data
    setNewItem({
      name: "",
      costPrice: "",
      price: "",
      units: "",
      quantity: "",
      threshold: "",
      imageUrl: "",
      categoryId: ""
    });
    // Refresh the table data
    fetchData();
  } catch (error) {
    console.error("Error adding item:", error);
  }
};

const handleSort = (columnId) => {
  setServerParams(prev => ({
    ...prev,
    sortBy: columnId,
    isAscending: prev.sortBy === columnId ? !prev.isAscending : true,
    pageNumber: 1
  }));
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
     await apiClient.delete(`api/Product/${updatedItem.id}`, {headers});
     setData((prevData) =>
       prevData.map((i) => (i.id === id ? updatedItem : i))
     );
   } catch (error) {
     console.error("Error updating item:", error);
   }
 };
 return { handleEdit, handleSave, toggleActive };
}, [data, editableItem, editingRowId]);

// Handler to open the price analysis popup and fetch data
const handleProductPrice = async (row) => {
  setIsPriceModalOpen(true);
  try {
    const response = await apiClient.get(`api/Statistics/ProductPriceAnalysis/${row.original.id}`, { headers });
    if (response.data && response.data.data) {
      setProductPriceData(response.data.data);
      console.log('Product Price Data:', response.data.data);
    } else {
      setProductPriceData({});
      console.warn('No data received for product price analysis');
    }
  } catch (error) {
    setProductPriceData({});
    console.error('Error fetching product price analysis:', error);
  }
};

// 3. Basic columns definition
const columns = useMemo(() => [
 {
   Header: "Item Name",
   accessor: "name",
   Cell: ({ row, value }) => value
 },
 {
   Header: "Category",
   accessor: "category.name",
   Cell: ({ row, value }) => value || 'N/A'
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
   Header: "Threshold",
   accessor: "threshold",
   Cell: ({ row, value }) =>
     row.original.id === editingRowId ? (
       <input
         type="number"
         value={editableItem.threshold || ''}
         onChange={(e) =>
           setEditableItem(prev => ({
             ...prev,
             threshold: Number(e.target.value)
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
     if (value === "Out Of Stock") return "Out of Stock";
     if (value === "Low Stock") return "Low Stock";
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
     return (
       <div className="action-buttons" style={{ justifyContent: 'center', alignItems: 'center' }}>
         <button
           onClick={() => handleEditPopup(row)}
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
         <button style={{
    background: "none",
    border: "none",
    padding: 0,
    cursor: "pointer",
    display: "flex",
    alignItems: "center"
  }} onClick={() => setSelectedProductId(row.original.id)}>
  <img src={barGraph} alt="Price Analysis" style={{ width: 24, height: 24 }} />
</button>
       </div>
     );
   },
 },
], [editingRowId, editableItem, handleEdit, handleSave, toggleActive]);

console.log("PPD",productPriceData);

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
    const totalItemsResponse = await apiClient.get("api/Statistics/InventorySummary", {headers});
    setTotalItems(totalItemsResponse.data.data.totalItems);
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
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        <h3 className='table-title' style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>Inventory Items</h3>
        <form onSubmit={handleSearch} className="search-form" style={{ position: 'relative', width: '250px' }}>
          <input
            type="text"
            placeholder="Search inventory..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="search-input"
            style={{
              width: '100%',
              padding: '8px 32px 8px 36px',
              borderRadius: '20px',
              border: '1px solid #ccc',
              fontSize: '15px',
              outline: 'none',
            }}
          />
          <FaSearch
            className="search-icon"
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'grey',
              fontSize: '18px',
              pointerEvents: 'none'
            }
          }
          />
        </form>
      </div>
      
      
      <button 
          onClick={() => setIsModalOpen(true)}
          className="add-item-button"
          style={{
            backgroundColor: '#8a2be2',
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
          onMouseOver={(e) => e.target.style.backgroundColor = '#4c187d'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#8a2be2'}
        >
          <FaPlus /> Add Item
        </button>
    </div>
    <hr className='header-line' />
  </div>
  <div className="table-content">
    <table className="inventory_table" {...getTableProps()}>
      <thead>
        {headerGroups.map((headerGroup, i) => (
          <tr key={`header-${i}`} {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column, j) => {
              // List of columns you want to be sortable (including editable columns)
              const sortableColumns = [
                'name',
                'quantity',
                'threshold',
                'price',
                'productStatus'
              ];
              const colId = column.id || column.accessor;
              const isSortable = sortableColumns.includes(colId);
              const isSortActive = serverParams.sortBy === colId;
              return (
                <th
                  key={`header-cell-${j}`}
                  {...column.getHeaderProps()}
                  style={{
                    padding: '8px',
                    borderBottom: '1px solid #ddd',
                    textAlign: 'center',
                    fontWeight: 900,
                    cursor: isSortable ? 'pointer' : 'default',
                    userSelect: 'none'
                  }}
                  onClick={isSortable ? () => handleSort(colId) : undefined}
                >
                  <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                    {column.render('Header')}
                    {isSortable && (
                      <SortIcon active={isSortActive} isAsc={serverParams.isAscending} />
                    )}
                  </span>
                </th>
              );
            })}
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
      <tfoot>
        <tr>
          <td colSpan={columns.length} style={{ textAlign: 'center', padding: '16px 0', border: 'none' }}>
            <div style={{ display: 'inline-flex', gap: '24px', justifyContent: 'center', alignItems:'center' }}>
              <button style={{
                backgroundColor: `${serverParams.pageNumber===1? '#bb97db' : '#8a2be2' }`,
                color: 'white',
                fontSize: '16px',
                border: 'none',
                width: '100px',
                padding: '8px 0',
                borderRadius: '10px',
                cursor: 'pointer'
              }}
              onClick={()=>{
                setServerParams((prev)=>({
                  ...prev,
                  pageNumber: prev.pageNumber - 1
                }));
              }}
              disabled={serverParams.pageNumber===1}
              >
                Previous
              </button>
              <div style={{fontSize: '16px', fontWeight: '800'}}>
                {serverParams.pageNumber}
              </div>
              <button style={{
                backgroundColor: `${serverParams.pageNumber>=Math.ceil(totalItems/10)? '#bb97db' : '#8a2be2' }`,
                color: 'white',
                fontSize: '16px',
                border: 'none',
                width: '100px',
                padding: '8px 0',
                borderRadius: '10px',
                cursor: 'pointer'
              }}
              onClick={()=>{
                setServerParams((prev)=>({
                  ...prev,
                  pageNumber: prev.pageNumber + 1
                }));
              }}
              disabled={serverParams.pageNumber>=Math.ceil(totalItems/10)}
              >{console.log("total items", totalItems, Math.ceil(totalItems/10))}
                Next
              </button>
            </div>
          </td>
        </tr>
        </tfoot>
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
          {['name', 'units', 'imageUrl'].map(field => (
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

          <div style={{marginBottom: '15px'}}>
            <label style={{marginBottom: '5px'}}>
              Category:
            </label>
            <select
              name="categoryId"
              value={newItem.categoryId}
              onChange={handleInputChange}
              required
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px',
              }}
            >
              <option value="">Select a category</option>
              {categories.map(cat=>(
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          
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
                backgroundColor: '#8a2be2',
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
  {editPopup.open && (
  <div style={{
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2000,
  }}>
    <div style={{
      backgroundColor: 'white',
      padding: '24px',
      borderRadius: '8px',
      width: '100%',
      maxWidth: '400px',
      position: 'relative'
    }}>
      <button
        onClick={closeEditPopup}
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
      >×</button>
      <h3 style={{ marginBottom: '16px' }}>Edit {editPopup.field.charAt(0).toUpperCase() + editPopup.field.slice(1)}</h3>
      <div style={{ marginBottom: '16px' }}>
        <label>
          Edit Field:&nbsp;
          <select value={editPopup.field} onChange={handleEditFieldChange} style={{ padding: '6px 12px', borderRadius: '4px' }}>
            <option value="quantity">Quantity</option>
            <option value="threshold">Threshold</option>
            <option value="price">Price</option>
          </select>
        </label>
      </div>
      <form onSubmit={handleEditPopupSubmit}>
        {editPopup.field === 'quantity' && (
          <>
            <div style={{ marginBottom: '12px' }}>
              <label>Quantity:</label>
              <input
                type="number"
                name="quantity"
                defaultValue={editPopup.row.original.quantity}
                min="0"
                required
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
              />
            </div>
            <div style={{ marginBottom: '12px' }}>
              <label>Cost Price:</label>
              <input
                type="number"
                name="costPrice"
                defaultValue={editPopup.row.original.costPrice || ''}
                min="0"
                step="0.01"
                required
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
              />
            </div>
          </>
        )}
        {editPopup.field === 'threshold' && (
          <div style={{ marginBottom: '12px' }}>
            <label>Threshold:</label>
            <input
              type="number"
              name="threshold"
              defaultValue={editPopup.row.original.threshold}
              min="0"
              required
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
            />
          </div>
        )}
        {editPopup.field === 'price' && (
          <div style={{ marginBottom: '12px' }}>
            <label>Price:</label>
            <input
              type="number"
              name="price"
              defaultValue={editPopup.row.original.price}
              min="0"
              step="0.01"
              required
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
            />
          </div>
        )}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button type="button" onClick={closeEditPopup} style={{
            padding: '8px 16px',
            backgroundColor: '#f5f5f5',
            border: '1px solid #ddd',
            borderRadius: '4px',
            cursor: 'pointer',
          }}>Cancel</button>
          <button type="submit" style={{
            padding: '8px 16px',
            backgroundColor: '#8a2be2',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}>Save</button>
        </div>
      </form>
    </div>
  </div>
)}
{selectedProductId && (
  <ProductPriceAnalysisModal
    productId={selectedProductId}
    headers={headers}
    onClose={() => setSelectedProductId(null)}
  />
)}
</div>

);
}
export default Inventory2;
