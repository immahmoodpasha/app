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

function GlobalFilter({ filter, setFilter }) {
  return (
    <input
      value={filter || ""}
      onChange={(e) => setFilter(e.target.value)}
      placeholder="Search..."
      className="search-input"
    />
  );
}



function Inventory() {
  const [data, setData] = useState([]);
  const [editingRowId, setEditingRowId] = useState(null);
  const [editableItem, setEditableItem] = useState({});
  const justStartedEditing = useRef(true);

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
        await apiClient.patch(`Products/${editingRowId}`, editableItem);
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
        accessor: "itemName",
      },
      {
        Header: "Category",
        accessor: "category",
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
  accessor: "unitPrice",
  Cell: ({ row }) =>
    row.original.id === editingRowId ? (
      <input
        className="inputfield"
        type="number"
        value={editableItem.unitPrice ?? ""}
        onChange={(e) =>
          setEditableItem((prev) => ({
            ...prev,
            unitPrice: Number(e.target.value),
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
        accessor: "status",
        Cell: ({ row }) => {
          let status = "";
          let color = "";
          if (row.original.quantity === 0) {
            status = "Out of Stock";
            color = "red";
          } else if (row.original.quantity < row.original.threshold) {
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
    ],
    [editingRowId, editableItem, handleEdit, handleSave, toggleActive]
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    state,
    setGlobalFilter,
  } = useTable(
    {
      columns,
      data,
      autoResetPage: false,
      initialState: {
        pageSize: 6,
      },
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const { globalFilter } = state;

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
                <GlobalFilter
                  filter={globalFilter}
                  setFilter={setGlobalFilter}
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
                  {headerGroup.headers.map((column) => (
                    <th
                      {...column.getHeaderProps()}
                      style={{ paddingLeft: "10px" }}
                    >
                      {column.render("Header")}
                      {!column.disableSortBy && (
                        <img
                          src="https://static.thenounproject.com/png/24967-200.png"
                          alt="Sort Icon"
                          width={16}
                          height={16}
                          onClick={() => column.toggleSortBy()}
                          style={{
                            cursor: "pointer",
                            marginLeft: "6px",
                            verticalAlign: "middle",
                          }}
                        />
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="table_body" {...getTableBodyProps()}>
              {page.map((row) => {
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
                  <div id="btn-ft">
                    <button
                      id="prev"
                      onClick={() => previousPage()}
                      disabled={!canPreviousPage}
                    >
                      Previous
                    </button>
                    <button
                      id="next"
                      onClick={() => nextPage()}
                      disabled={!canNextPage}
                    >
                      Next
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
