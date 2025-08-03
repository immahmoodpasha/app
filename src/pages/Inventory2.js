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

const Inventory2 = () => {
// 2. Simplify the component state
const [data, setData] = useState([]);
const [loading, setLoading] = useState(true);

// 3. Basic columns definition
const columns = useMemo(() => [
    {
        Header: "Item Name",
        accessor: "name",
    },
    {
        Header: "Category",
        accessor: "category.name", // Using dot notation for nested property
        Cell: ({ value }) => value || 'N/A' // Simple cell renderer
    }
], []);

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
    const response = await apiClient.get("api/Product");
    setData(response.data.data || []);
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

// 7. Simplified table render
return (
  <div className="table-container">
    <table className="inventory_table" {...getTableProps()}>
      <thead>
        {headerGroups.map(headerGroup => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
              <th 
                {...column.getHeaderProps()}
                style={{
                  padding: '8px',
                  borderBottom: '1px solid #ddd',
                  textAlign: 'left'
                }}
              >
                {column.render('Header')}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map(row => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map(cell => (
                <td 
                  {...cell.getCellProps()}
                  style={{
                    padding: '8px',
                    borderBottom: '1px solid #eee'
                  }}
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
);
}
export default Inventory2;