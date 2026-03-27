import { useState, useEffect } from "react";

export default function RawMaterials() {
  const [isEditing, setIsEditing] = useState(false);
  const [savedData, setSavedData] = useState([]);

  /* ===============================
     COLUMN CONFIG (UPDATED)
  =============================== */

  const [columns, setColumns] = useState([
    { name: "Material ID", type: "number" },

    { name: "Material Name", type: "text" },

    {
  name: "Material Type",
  type: "dropdown",
  options: ["Raw", "Chemical", "Hardware", "Consumable"],
  allowCustom: true,
},
{
  name: "Unit of Measure",
  type: "dropdown",
  options: ["Kg", "Meters", "Liters"],
  allowCustom: true,
},

    { name: "Available Quantity", type: "number" },

    { name: "Low Stock", type: "number" }, // ✅ renamed

    {
      name: "Stock Status",
      type: "dropdown",
      options: ["In Stock", "Low Stock", "Out of Stock"],
    },
  ]);

  const [rows, setRows] = useState([
    {
      "Material ID": "",
      "Material Name": "",
      "Material Type": "",
      "Unit of Measure": "",
      "Available Quantity": "",
      "Low Stock": "",
      "Stock Status": "",
    },
  ]);

  /* ===============================
      LOAD DATA
  =============================== */

  useEffect(() => {
    const data = localStorage.getItem("rawMaterials");
    if (data) setSavedData(JSON.parse(data));
  }, []);

  /* ===============================
      SAVE DATA
  =============================== */

  const handleSave = () => {
    const updatedData = [...savedData, ...rows];
    setSavedData(updatedData);
    localStorage.setItem("rawMaterials", JSON.stringify(updatedData));

    alert("Data Saved Successfully ✅");
    setIsEditing(false);
  };

  const deleteSavedRow = (index) => {
    const updated = savedData.filter((_, i) => i !== index);
    setSavedData(updated);
    localStorage.setItem("rawMaterials", JSON.stringify(updated));
  };

  const editSavedRow = (index) => {
    setRows([savedData[index]]);
    setIsEditing(true);

    const updated = savedData.filter((_, i) => i !== index);
    setSavedData(updated);
    localStorage.setItem("rawMaterials", JSON.stringify(updated));
  };

  const handleCancel = () => {
  setIsEditing(false);

  // Reset rows to fresh empty row
  const emptyRow = {};
  columns.forEach((col) => (emptyRow[col.name] = ""));
  setRows([emptyRow]);
};
  /* ===============================
      COLUMN FUNCTIONS
  =============================== */

  const addColumn = () => {
    const newColumn = {
      name: `New Column ${columns.length + 1}`,
      type: "text",
    };

    setColumns([...columns, newColumn]);

    const updatedRows = rows.map((row) => ({
      ...row,
      [newColumn.name]: "",
    }));

    setRows(updatedRows);
  };

  const deleteColumn = (index) => {
    if (columns.length === 1) return;

    const columnName = columns[index].name;

    const updatedColumns = columns.filter((_, i) => i !== index);
    setColumns(updatedColumns);

    const updatedRows = rows.map((row) => {
      const newRow = { ...row };
      delete newRow[columnName];
      return newRow;
    });

    setRows(updatedRows);
  };

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

  const changeColumnType = (index, newType) => {
    const updated = [...columns];
    updated[index].type = newType;
    setColumns(updated);
  };

  /* ===============================
      ROW FUNCTIONS
  =============================== */

  const addRow = () => {
    const newRow = {};
    columns.forEach((col) => (newRow[col.name] = ""));
    setRows([...rows, newRow]);
  };

  const deleteRow = (rowIndex) => {
    if (rows.length === 1) return;
    setRows(rows.filter((_, i) => i !== rowIndex));
  };

  const handleChange = (rowIndex, columnName, value) => {
    const updatedRows = [...rows];
    updatedRows[rowIndex][columnName] = value;
    setRows(updatedRows);
  };

  /* ===============================
        VIEW MODE
  =============================== */

  if (!isEditing) {
    return (
      <div className="bg-gray-100 p-8 rounded-2xl">
        <div className="flex justify-between mb-6">
          <h2 className="text-2xl font-semibold">
            Raw Material Stock Table
          </h2>

          <button
            onClick={() => setIsEditing(true)}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg"
          >
            + Add
          </button>
        </div>

        <div className="overflow-auto bg-white rounded-xl border shadow-sm">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
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
              {savedData.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + 1} className="text-center p-4">
                    No Data Found
                  </td>
                </tr>
              ) : (
                savedData.map((row, index) => (
                  <tr key={index}>
                    {columns.map((col, i) => (
                      <td key={i} className="border px-3 py-2">
                        {row[col.name]}
                      </td>
                    ))}
                    <td className="border text-center space-x-2">
                      <button
                        onClick={() => editSavedRow(index)}
                        className="text-blue-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteSavedRow(index)}
                        className="text-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  /* ===============================
        EDIT MODE
  =============================== */

  return (
    <div className="bg-gray-100 p-8 rounded-2xl">
      <div className="flex justify-between mb-6">
        <h2 className="text-2xl font-semibold">
          Raw Material Stock Table
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
          {/* ✅ CANCEL BUTTON */}
  <button
    onClick={handleCancel}
    className="bg-gray-400 text-white px-5 py-2 rounded-lg"
  >
    Cancel
  </button>
        </div>
      </div>

      <div className="overflow-auto bg-white rounded-xl border shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((col, index) => (
                <th key={index} className="border px-4 py-3 relative">

                  {/* Column Name */}
                  <input
                    value={col.name}
                    onChange={(e) =>
                      changeColumnName(index, e.target.value)
                    }
                    className="w-full border rounded px-2 py-1 mb-2"
                  />

                  {/* Column Type */}
                  <select
                    value={col.type}
                    onChange={(e) =>
                      changeColumnType(index, e.target.value)
                    }
                    className="w-full border rounded px-2 py-1 mb-2"
                  >
                    <option value="text">Text</option>
                    <option value="number">Number</option>
                    <option value="date">Date</option>
                    <option value="dropdown">Dropdown</option>
                  </select>

                  {/* DELETE COLUMN BUTTON */}
                  <button
                    onClick={() => deleteColumn(index)}
                    className="absolute top-1 right-1 text-red-600 text-xs"
                  >
                    ❌
                  </button>

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
  row[col.name] === "__custom__" ? (
    <input
      type="text"
      placeholder="Enter value"
      value={row[`${col.name}_custom`] || ""}
      onChange={(e) =>
        handleChange(
          rowIndex,
          `${col.name}_custom`,
          e.target.value
        )
      }
      onBlur={() => {
        handleChange(
          rowIndex,
          col.name,
          row[`${col.name}_custom`] || ""
        );
      }}
      className="w-full border rounded px-2 py-1"
      autoFocus
    />
  ) : (
    <select
      value={row[col.name] || ""}
      onChange={(e) => {
        const value = e.target.value;

        if (value === "__custom__") {
          handleChange(rowIndex, col.name, "__custom__");
        } else {
          handleChange(rowIndex, col.name, value);
        }
      }}
      className="w-full border rounded px-2 py-1"
    >
      <option value="">Select</option>

      {col.options?.map((opt, i) => (
        <option key={i} value={opt}>
          {opt}
        </option>
      ))}

      <option value="__custom__">Enter Custom</option>
    </select>
  )
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
  );
}