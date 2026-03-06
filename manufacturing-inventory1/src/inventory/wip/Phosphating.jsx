import { useState, useEffect } from "react";

export default function Phosphating() {
  const defaultColumns = [
    { name: "WIP ID", type: "number" },

    { name: "Product Name", type: "text" },

    { name: "Chemical Used", type: "text" },

    { name: "Quantity in Process", type: "number" },

    {
      name: "Quality Check Result",
      type: "dropdown",
      options: ["Pass", "Fail", "Rework"],
    },

    {
      name: "Status",
      type: "dropdown",
      options: ["Pending", "In Progress", "Completed"],
    },
  ];

  // ================= CREATE EMPTY ROW =================
  const createEmptyRow = (cols) => {
    const row = {};
    cols.forEach((col) => {
      row[col.name] = "";
    });
    return row;
  };

  // ================= STATES =================
// ================= STATES =================
const [columns, setColumns] = useState(() => {
  const savedColumns = localStorage.getItem("phosphating_columns");

  // first time load
  if (!savedColumns) return defaultColumns;

  const parsedColumns = JSON.parse(savedColumns);

  // ✅ restore dropdown options if missing
  return parsedColumns.map((col) => {
    const defaultCol = defaultColumns.find(
      (d) => d.name === col.name
    );

    if (col.type === "dropdown" && defaultCol?.options) {
      return { ...col, options: defaultCol.options };
    }

    return col;
  });
});

  const [savedData, setSavedData] = useState(() => {
    const data = localStorage.getItem("phosphating_data");
    return data ? JSON.parse(data) : [];
  });

  const [rows, setRows] = useState([createEmptyRow(columns)]);
  const [showForm, setShowForm] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  // ================= LOCAL STORAGE SAVE =================
  useEffect(() => {
    localStorage.setItem("phosphating_data", JSON.stringify(savedData));
  }, [savedData]);

  useEffect(() => {
    localStorage.setItem("phosphating_columns", JSON.stringify(columns));
  }, [columns]);

  // ================= ADD COLUMN =================
  const addColumn = () => {
    const newColumn = {
      name: `New Column ${columns.length + 1}`,
      type: "text",
    };

    const updatedColumns = [...columns, newColumn];
    setColumns(updatedColumns);

    const updatedRows = rows.map((row) => ({
      ...row,
      [newColumn.name]: "",
    }));

    setRows(updatedRows);
  };

  // ================= DELETE COLUMN =================
  const deleteColumn = (index) => {
    const columnToDelete = columns[index].name;

    const updatedColumns = columns.filter((_, i) => i !== index);
    setColumns(updatedColumns);

    const updatedRows = rows.map((row) => {
      const updatedRow = { ...row };
      delete updatedRow[columnToDelete];
      return updatedRow;
    });

    setRows(updatedRows);
  };

  // ================= ADD ROW =================
  const addRow = () => {
    setRows([...rows, createEmptyRow(columns)]);
  };

  // ================= DELETE ROW =================
  const deleteRow = (rowIndex) => {
    const updatedRows = rows.filter((_, i) => i !== rowIndex);
    setRows(updatedRows);
  };

  // ================= CHANGE COLUMN NAME =================
  const changeColumnName = (index, newName) => {
    const oldName = columns[index].name;

    const updatedColumns = [...columns];
    updatedColumns[index].name = newName;
    setColumns(updatedColumns);

    const updatedRows = rows.map((row) => {
      const updatedRow = { ...row };
      updatedRow[newName] = updatedRow[oldName];
      delete updatedRow[oldName];
      return updatedRow;
    });

    setRows(updatedRows);
  };

  // ================= CHANGE COLUMN TYPE =================
  const changeColumnType = (index, newType) => {
    const updated = [...columns];
    updated[index].type = newType;
    setColumns(updated);
  };

  // ================= HANDLE INPUT =================
  const handleChange = (rowIndex, columnName, value) => {
    const updatedRows = [...rows];
    updatedRows[rowIndex][columnName] = value;
    setRows(updatedRows);
  };

  // ================= SAVE =================
// ================= SAVE =================
const handleSave = () => {

  const filteredRows = rows.filter((row) =>
    Object.values(row).some((val) => val !== "")
  );

  if (filteredRows.length === 0) {
    alert("No Data to Save ❌");
    return;
  }

  /* ======================================
        LOAD PRE-ASSEMBLING DATA
  ====================================== */
  const preAssembling =
    JSON.parse(localStorage.getItem("preAssembling")) || [];

  /* ======================================
        SUBTRACT FROM PRE-ASSEMBLING
  ====================================== */
  filteredRows.forEach((entry) => {

    const wipId = Number(entry["WIP ID"]);
    const qtyUsed = Number(entry["Quantity in Process"]);

    const index = preAssembling.findIndex(
      (item) => Number(item["WIP ID"]) === wipId
    );

    if (index !== -1) {

const availableQty = Number(
  preAssembling[index]["Issued Quantity"] || 0
);

      // ✅ prevent negative stock
      if (availableQty < qtyUsed) {
        alert(
          `Not enough quantity in Pre-Assembling for WIP ID ${wipId}`
        );
        return;
      }

      // ✅ subtract stock
    preAssembling[index]["Issued Quantity"] =
  availableQty - qtyUsed;
    }
  });

  /* ======================================
        SAVE UPDATED PRE-ASSEMBLING
  ====================================== */
  localStorage.setItem(
    "preAssembling",
    JSON.stringify(preAssembling)
  );

  /* ======================================
        SAVE PHOSPHATING DATA
  ====================================== */
  if (editIndex !== null) {
    const updatedData = [...savedData];
    updatedData[editIndex] = filteredRows[0];
    setSavedData(updatedData);
    alert("Data Updated Successfully ✅");
    setEditIndex(null);
  } else {
    setSavedData([...savedData, ...filteredRows]);
    alert("Phosphating Saved & Stock Updated ✅");
  }

  setRows([createEmptyRow(columns)]);
  setShowForm(false);
};

  // ================= EDIT =================
  const handleEdit = (index) => {
    setRows([savedData[index]]);
    setEditIndex(index);
    setShowForm(true);
  };

  // ================= DELETE SAVED =================
  const handleDeleteSaved = (index) => {
    const updated = savedData.filter((_, i) => i !== index);
    setSavedData(updated);
  };

  // ================= CANCEL =================
  const handleCancel = () => {
    setRows([createEmptyRow(columns)]);
    setShowForm(false);
    setEditIndex(null);
  };

  return (
    <div className="bg-gray-100 p-8 rounded-2xl">

      {!showForm && (
        <div className="bg-white p-6 rounded-xl shadow">

          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">
              Saved Phosphating Data
            </h2>

            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 text-white px-5 py-2 rounded-lg"
            >
              + Add
            </button>
          </div>

          {savedData.length === 0 ? (
            <p className="text-gray-500">No Data Available</p>
          ) : (
            <div className="overflow-auto">
              <table className="min-w-full text-sm border">
                <thead className="bg-gray-100">
                  <tr>
                    {columns.map((col, i) => (
                      <th key={i} className="border px-4 py-2">
                        {col.name}
                      </th>
                    ))}
                    <th className="border px-4 py-2">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {savedData.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {columns.map((col, i) => (
                        <td key={i} className="border px-4 py-2">
                          {row[col.name]}
                        </td>
                      ))}
                      <td className="border text-center space-x-2">
                        <button
                          onClick={() => handleEdit(rowIndex)}
                          className="bg-yellow-500 text-white px-3 py-1 rounded"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => handleDeleteSaved(rowIndex)}
                          className="bg-red-600 text-white px-3 py-1 rounded"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>

              </table>
            </div>
          )}
        </div>
      )}

      {showForm && (
        <div>

          <div className="flex justify-between mb-6">
            <h2 className="text-2xl font-semibold">
              Phosphating Stage Entry
            </h2>

            <div className="flex gap-3">
              <button onClick={addColumn} className="bg-green-600 text-white px-5 py-2 rounded-lg">
                + Add Column
              </button>

              <button onClick={addRow} className="bg-blue-600 text-white px-5 py-2 rounded-lg">
                + Add Row
              </button>

              <button onClick={handleSave} className="bg-black text-white px-5 py-2 rounded-lg">
                Save
              </button>

              <button onClick={handleCancel} className="bg-red-500 text-white px-5 py-2 rounded-lg">
                Cancel
              </button>
            </div>
          </div>

          <div className="overflow-auto bg-white rounded-xl border shadow-sm">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  {columns.map((col, index) => (
                    <th key={index} className="border px-4 py-3">

                      <input
                        value={col.name}
                        onChange={(e) =>
                          changeColumnName(index, e.target.value)
                        }
                        className="w-full border rounded px-2 py-1 mb-2"
                      />

                      <select
                        value={col.type}
                        onChange={(e) =>
                          changeColumnType(index, e.target.value)
                        }
                        className="w-full border rounded px-2 py-1"
                      >
                        <option value="text">Text</option>
                        <option value="number">Number</option>
                        <option value="date">Date</option>
                        <option value="dropdown">Dropdown</option>
                      </select>

                    </th>
                  ))}
                  <th className="border">Action</th>
                </tr>
              </thead>

              <tbody>
                {rows.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {columns.map((col, colIndex) => (
                      <td key={colIndex} className="border px-3 py-2">

                        {col.type === "dropdown" ? (
                          <select
                            value={row[col.name] || ""}
                            onChange={(e) =>
                              handleChange(rowIndex, col.name, e.target.value)
                            }
                            className="w-full border rounded px-2 py-1"
                          >
                            <option value="">Select</option>
                            {col.options?.map((opt, i) => (
                              <option key={i}>{opt}</option>
                            ))}
                          </select>
                        ) : (
                          <input
                            type={col.type}
                            value={row[col.name] || ""}
                            onChange={(e) =>
                              handleChange(rowIndex, col.name, e.target.value)
                            }
                            className="w-full border rounded px-2 py-1"
                          />
                        )}

                      </td>
                    ))}

                    <td className="border text-center">
                      <button
                        onClick={() => deleteRow(rowIndex)}
                        className="text-red-600"
                      >
                        ❌
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>

        </div>
      )}
    </div>
  );
}