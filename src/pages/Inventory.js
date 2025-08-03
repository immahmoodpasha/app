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
    () => {
      const cols = [
      {
        Header: "Item Name",
        accessor: "name",
        id: "name"
      },
      {
        Header: "Category",
        accessor: "category",
        Cell: ({ value }) => {
          console.log("Value: ", value);
          return value?.name || 'N/A';

        }
      },
      {
  Header: "Quantity",
  accessor: "quantity",
  Cell: ({ row }) =>
    row.original.id === editingRowId ? (
      <input
        className="inputfield"
        type="number"
        value={editableItem.quantity ?? ""}
        onChange={(e) =>
          setEditableItem((prev) => ({
            ...prev,
            quantity: Number(e.target.value),
          }))
        }
      />
    ) : (
      row.original.quantity
    ),
},
{
  Header: "Unit Price",
  accessor: "price",
  Cell: ({ row }) =>
    row.original.id === editingRowId ? (
      <input
        className="inputfield"
        type="number"
        value={editableItem.unitPrice ?? ""}
        onChange={(e) =>
          setEditableItem((prev) => ({
            ...prev,
            price: Number(e.target.value),
          }))
        }
      />
    ) : (
      `$${(row.original.unitPrice ?? 0).toFixed(2)}`
    ),
},
{
  Header: "Threshold",
  accessor: "threshold",
  Cell: ({ row }) =>
    row.original.id === editingRowId ? (
      <input
        className="inputfield"
        type="number"
        value={editableItem.threshold ?? ""}
        onChange={(e) =>
          setEditableItem((prev) => ({
            ...prev,
            threshold: Number(e.target.value),
          }))
        }
      />
    ) : (
      row.original.threshold
    ),
},
,
      {
        Header: "Status",
        accessor: "productStatus",
        Cell: ({ row }) => {
          let status = "";
          let color = "";
          if (values === "OutOfStock") {
            status = "Out of Stock";
            color = "red";
          } else if (values === "LowStock") {
            status = "Low Stock";
            color = "orange";
          } else {
            status = "In Stock";
            color = "green";
          }
          return <span style={{ color }}>{status}</span>;
        },
      },
      {
        Header: "Actions",
        accessor: "actions",
        disableSortBy: true,
        Cell: ({ row }) => {
          const { id, isActive } = row.original;
          return row.original.id === editingRowId ? (
            <>
              <button
                onClick={handleSave}
                style={{ background: "none", border: "none" }}
              >
                <RiArrowUpCircleLine size={25} />
              </button>
              <button
                onClick={() => toggleActive(id)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "blueviolet",
                }}
              >
                {isActive ? (
                  <FaCheckSquare size={24} style={{ color: "blueviolet" }} />
                ) : (
                  <FaRegSquare size={24} style={{ color: "blueviolet" }} />
                )}
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => handleEdit(id)}
                style={{ background: "none", border: "none", marginRight: 10 }}
              >
                <FiEdit2 size={22} style={{ color: "blueviolet" }} />
              </button>
              <button
                onClick={() => toggleActive(id)}
                style={{
                  background: "none",
                  border: "none",
                  color: "blueviolet",
                }}
              >
                {isActive ? (
                  <FaCheckSquare size={25} />
                ) : (
                  <FaRegSquare size={25} />
                )}
              </button>
            </>
          );
        },
      },
    ];
  console.log("Columns definition:", cols);
  return cols;
  },
    [editingRowId, editableItem, handleEdit, handleSave, toggleActive]
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    state: {pageIndex, pageSize}
  } = useTable(
    {
      columns,
      data,
      manualPagination: true,
      manualSortBy: true,
      manualGlobalFilter: true,
      pageCount: Math.ceil(totalItems / serverParams.pageSize),
      autoResetPage: false,
      initialState: {
        pageIndex: 0,
        pageSize: 10,
      },
      state: {
        pageIndex: serverParams.pageNumber,
        pageSize: serverParams.pageSize
      }
    },
    useSortBy,
    usePagination
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
            <thead className="table_head">
              {headerGroups.map((headerGroup) => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => {
                    const {key, ...headerProps} = column.getHeaderProps();
                    return(
                    <th
                    key={key}
                      {...headerProps}
                      onClick={()=>handleSort(column.id)}
                      style={{ paddingLeft: "10px" }}
                    >
                      <div style={{ display: "flex", alignItems: "center" }}>
                        {column.render("Header")}
                        {!column.disableSortBy && (
                          <span style={{ marginLeft: "5px" }}>
                            {serverParams.sortBy === column.id
                              ? serverParams.isAscending ? "↑" : "↓"
                              : "↕"}
                          </span>
                        )}
                      </div>
                    </th>)
                  })}
                </tr>
              ))}
            </thead>
            <tbody className="table_body">
              {console.log("Current data in table: ", {data, loading})}
              {loading ? (
                <tr>
                  <td colSpan={columns.length} style={{ textAlign: "center" }}>
                    Loading...
                  </td>
                </tr>
              ) : data && data.length > 0 ? (
                data.map((row, rowIndex) => {
                  console.log(`Row ${rowIndex}:`, row);
                  if (!row || typeof row !== "object") return null;
                  return (
                  <tr key={row.id}>
                    {columns.map(column => {
                      let value;
                      if (typeof column.accessor === "function"){
                        value = column.accessor(row);
                      }else{
                        value = column.accessor.split(".").reduce((obj, key)=> {
                          console.log(`Accessing key '${key}' in: `, obj);
                          return (obj && obj[key] !== undefined ? obj[key] : null);
                        },row);
                      }
                      // console.log(`Column ${column.accessor}:`, {
                      //   hasAccessor: column.accessor in row,
                      //   value: row[column.accessor],
                      //   column
                      // });
                      let cellContent;
                      if (column.Cell){
                        cellContent = column.Cell({ value, row: { original: row } });
                      }else{
                        cellContent = value;
                      }
                      return(
                      <td key={`${row.id}-${column.accessor}`}>
                        {cellContent}
                      </td>
                      );
                    })}
                  </tr>
                  );
                  })
              ) : (
                <tr>
                  <td colSpan={columns.length} style={{ textAlign: "center" }}>
                    No data found
                  </td>
                </tr>
              )}
              {data.map((row, i) => {
                prepareRow(row);
                return (
                  <tr {...row.getRowProps()}>
                    {row.cells.map((cell) => (
                      <td key={cell.column.id} {...cell.getCellProps()}>
                        {cell.render("Cell")}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={columns.length} style={{ textAlign: "center" }}>
                  <div className="pagination-controls">
                    <button
                      onClick={() => handlePageChange(1)}
                      disabled={serverParams.pageNumber === 1}
                      className="pagination-button"
                    >
                      {'<<'}
                    </button>
                    <button
                      onClick={() => handlePageChange(serverParams.pageNumber - 1)}
                      disabled={serverParams.pageNumber === 1}
                      className="pagination-button"
                    >
                      {'<'}
                    </button>
                    <span className="page-info">
                      Page {serverParams.pageNumber} of {Math.ceil(totalItems / serverParams.pageSize)}
                    </span>
                    <button
                      onClick={() => handlePageChange(serverParams.pageNumber + 1)}
                      disabled={serverParams.pageNumber >= Math.ceil(totalItems / serverParams.pageSize)}
                      className="pagination-button"
                    >
                      {'>'}
                    </button>
                    <button
                      onClick={() => handlePageChange(Math.ceil(totalItems / serverParams.pageSize))}
                      disabled={serverParams.pageNumber >= Math.ceil(totalItems / serverParams.pageSize)}
                      className="pagination-button"
                    >
                      {'>>'}
                    </button>
                  </div>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Inventory;
