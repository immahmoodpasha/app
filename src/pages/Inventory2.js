// 1. Remove these unused imports if not needed elsewhere
// import { usePagination, useSortBy } from 'react-table';
import { useEffect, useState, useMemo, useRef } from "react";
import "../styles/Inventory.css";
import apiClient from "../apiClient/axiosObject.js";
import { FaCheckSquare, FaRegSquare, FaSearch } from "react-icons/fa";
import { FiEdit2 } from "react-icons/fi";
import { AiFillEdit } from "react-icons/ai";
import { RiArrowUpCircleLine } from "react-icons/ri";
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
    Header: "Actions",
    accessor: "actions",
    disableSortBy: true,
    Cell: ({ row }) => {
      const { id, isActive } = row.original;
      return row.original.id === editingRowId ? (
        <div className="action-buttons">
          <button
            onClick={handleSave}
            style={{ background: "none", border: "none", cursor: "pointer" }}
            title="Save Changes"
          >
            <RiArrowUpCircleLine size={25} color="#4CAF50" />
          </button>
          <button
            onClick={() => toggleActive(id)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              marginLeft: "8px"
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
      ) : (
        <div className="action-buttons">
          <button
            onClick={() => handleEdit(id)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer"
            }}
            title="Edit"
          >
            <FiEdit2 size={22} style={{ color: "#8a2be2" }} />
          </button>
          <button
            onClick={() => toggleActive(id)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              marginLeft: "8px"
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
 const response = await apiClient.get("api/Product", {headers});
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
fetchData();
}, []);

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
     <h3 className='table-title'>Inventory Items</h3>
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
 </div>
);
}
export default Inventory2;


