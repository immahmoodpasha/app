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



function Inventory() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [editingRowId, setEditingRowId] = useState(null);
  const [editableItem, setEditableItem] = useState({});
  const justStartedEditing = useRef(true);
  const {getAuthHeader} = useJWT();
  const [serverParams, setServerParams] = useState({
    pageNumber: 1,
    sortBy: 'itemName',
    isAscending: true,
    filterQuery: ''
  });
  const [totalItems, setTotalItems] = useState(0);

  const headers = getAuthHeader();

  const fetchData = async (pageNumber, pageSize) => {
    setLoading(true);
    try {
      const response = await apiClient.get("api/Product",{
        params: {
          PageNumber: serverParams.pageNumber,
          PageSize: serverParams.pageSize,
          sortBy: serverParams.sortBy,
          isAscending: serverParams.isAscending,
          filterQuery: serverParams.filterQuery
        },
        headers: headers,
      });
      console.log("API Response:", response.data);
      console.log("Response of fetch: ", response)
      console.log("Data structure:", {
        hasData: !!response.data.data,
        dataType: Array.isArray(response.data.data) ? 'array' : typeof response.data.data,
        dataLength: Array.isArray(response.data.data) ? response.data.data.length : 'N/A',
        firstItem: response.data.data?.[0]
      });
      setData(response.data.data);
      console.log(data);
      setTotalItems(response.data.total);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally{
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [serverParams]);

  const handlePageChange = (newPage) => {
    setServerParams(prev=>({
      ...prev, pageNumber: newPage
    }));
  }

  const handleSort = (columnName) => {
    setServerParams(prev=>({
      ...prev, sortBy: columnName,
      isAscending: prev.sortBy === columnName ? !prev.isAscending : true,
      pageNumber: 1
    }))
  }

  const handleSearch = (value) => {
    debouncedSearch(value);
  }

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
      try {
        await apiClient.patch(`api/Product/${editingRowId}`, editableItem, {headers});
        setData((prevData) =>
          prevData.map((item) =>
            item.id === editingRowId ? { ...item, ...editableItem } : item
          )
        );
        setEditingRowId(null);
      } catch (error) {
        console.error("Error saving item:", error);
      }
    };

    const toggleActive = async (id) => {
      const item = data.find((item) => item.id === id);
      if (!item) return;
      const updatedItem = { ...item, isActive: !item.isActive };
      try {
        await apiClient.patch(`Products/${id}`, updatedItem);
        setData((prevData) =>
          prevData.map((i) => (i.id === id ? updatedItem : i))
        );
      } catch (error) {
        console.error("Error updating item:", error);
      }
    };

    return { handleEdit, handleSave, toggleActive };
  }, [data, editableItem, editingRowId]);

  const columns = useMemo(
    () => [
      {
        Header: "Item Name",
        accessor: "name",
      }
    ],
    []);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable(
    {
      columns,
      data: data || [],
    }
  );

  useEffect(()=>{
    setServerParams(prev=>({
      ...prev,
      pageNumber: pageIndex + 1,
      pageSize: pageSize
    }));
  }, [pageIndex, pageSize]);



  const debouncedSearch = useRef(
    debounce((value)=> {
      setServerParams(prev=>({
        ...prev,
        filterQuery: value,
        pageNumber: 1
      }));
    }, 300)
  ).current;

  useEffect(()=>{
    return ()=>{
      debouncedSearch.cancel();
    }
  },[debouncedSearch]);

  return (
    <div className="main">
      <div className="container">
        <div id="invHeader">
          <div id="left">
            <div id="invTitle">Inventory Items</div>
          </div>
          <div id="right">
            <div id="search-cont">
              <FaSearch id="search-icon" />
              <div id="search">
                <input 
                type="text"
                value={serverParams.filterQuery}
                onChange={(e)=>setServerParams(prev=>({...prev, filterQuery: e.target.value}))}
                onKeyDown={(e)=>{
                  if (e.key === 'Enter'){
                    debouncedSearch(e.target.value);
                  }
                }}
                placeholder="Search..."
                className="search_input"
                />
              </div>
            </div>
            <div id="addNewItem">Add Item</div>
          </div>
        </div>
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
        </div>
      </div>
    </div>
  );
}

export default Inventory;
