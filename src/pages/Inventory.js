import { useEffect, useState, useMemo } from "react";
import "../styles/Inventory.css";
import apiClient from "../apiClient/axiosObject.js";
import { FaCheckSquare, FaRegSquare } from "react-icons/fa";
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

  const toggleActive = async (rawId) => {
  try {
    const id = String(rawId); // Ensure string type

    const item = data.find((i) => String(i.id) === id);

    if (!item) {
      console.warn("Item not found in data. ID:", id);
      return;
    }

    const updatedItem = { isActive: !item.isActive };

    await apiClient.patch(`Products/${id}`, updatedItem);

    setData((prevData) =>
      prevData.map((i) =>
        String(i.id) === id ? { ...i, ...updatedItem } : i
      )
    );
  } catch (error) {
    console.error("Error updating item:", error);
  }
};



  const handleEdit = (id) => {
    const item = data.find((item) => item.id === id);
    setEditingRowId(id);
    setEditableItem({ ...item });
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
      setEditableItem({});
    } catch (error) {
      console.error("Error saving item:", error);
    }
  };

  const columns = useMemo(
    () => [
      {
        Header: "Item Name",
        accessor: "itemName",
        Cell: ({ row }) =>
          row.original.id === editingRowId
            ? editableItem.itemName || row.original.itemName
            : row.original.itemName,
      },
      {
        Header: "Category",
        accessor: "category",
        Cell: ({ row }) =>
          row.original.id === editingRowId
            ? editableItem.category || row.original.category
            : row.original.category,
      },
      {
        Header: "Quantity",
        accessor: "quantity",
        Cell: ({ row }) =>
          row.original.id === editingRowId ? (
            <input
              type="number"
              value={
                editableItem.quantity !== undefined
                  ? editableItem.quantity
                  : row.original.quantity
              }
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
              type="number"
              value={
                editableItem.unitPrice !== undefined
                  ? editableItem.unitPrice
                  : row.original.unitPrice
              }
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
              type="number"
              value={
                editableItem.threshold !== undefined
                  ? editableItem.threshold
                  : row.original.threshold
              }
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
      {
        Header: "Status",
        accessor: "status",
        Cell: ({ row }) => {
          const quantity =
            row.original.id === editingRowId
              ? editableItem.quantity ?? row.original.quantity
              : row.original.quantity;
          const threshold =
            row.original.id === editingRowId
              ? editableItem.threshold ?? row.original.threshold
              : row.original.threshold;

          let status = "";
          let colour = "";

          if (quantity === 0) {
            status = "Out of Stock";
            colour = "red";
          } else if (quantity < threshold) {
            status = "Low Stock";
            colour = "orange";
          } else {
            status = "In Stock";
            colour = "green";
          }

          return <span style={{ color: colour }}>{status}</span>;
        },
      },
      {
  Header: "Actions",
  accessor: "actions",
  disableSortBy: true,
  Cell: ({ row }) => {
    const current = data.find((item) => item.id === row.original.id);

    return row.original.id === editingRowId ? (
      <>
        <button
          onClick={handleSave}
          style={{ background: "none", border: "none" }}
        >
          <RiArrowUpCircleLine size={25} />
        </button>
      </>
    ) : (
      <>
        <button
          onClick={() => handleEdit(row.original.id)}
          style={{ background: "none", border: "none" }}
        >
          <AiFillEdit size={25} />
        </button>

        {/* ✅ Checkbox for active/inactive */}
        <span
          style={{ cursor: "pointer", marginLeft: "8px" }}
          onClick={() => toggleActive(row.original.id)}
        >
          {row.original.isActive ? (
            <FaCheckSquare size={20} color="green" title="Active" />
          ) : (
            <FaRegSquare size={20} color="gray" title="Inactive" />
          )}
        </span>
      </>
    );
  },
}
,
    ],
    [editingRowId, editableItem]
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
  } = useTable({ columns, data }, useGlobalFilter, useSortBy, usePagination);

  const { globalFilter } = state;

  return (
    <div className="main">
      <div className="container">
        <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
        <table className="inventory_table" {...getTableProps()}>
          <thead className="table_head">
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                    {column.render("Header")}
                    <span>
                      {column.isSorted
                        ? column.isSortedDesc
                          ? " 🔽"
                          : " 🔼"
                        : ""}
                    </span>
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
                  {row.cells.map((cell) => {
                    const cellProps = cell.getCellProps();
                    const { key, ...rest } = cellProps;
                    return (
                      <td key={key} {...rest}>
                        {cell.render("Cell")}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>

          <tfoot>
            <tr>
              <td colSpan={columns.length}>
                <button
                  onClick={() => previousPage()}
                  disabled={!canPreviousPage}
                >
                  Previous
                </button>
                <button onClick={() => nextPage()} disabled={!canNextPage}>
                  Next
                </button>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}

export default Inventory;
