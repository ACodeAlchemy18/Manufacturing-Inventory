import { useState, useEffect } from "react";

export default function PreAssembling() {
  const [isEditing, setIsEditing] = useState(false);
  const [savedData, setSavedData] = useState([]);

  /* ===============================
     UPDATED COLUMNS (Dropdown Added)
  =============================== */

  const [columns, setColumns] = useState([
    { name: "WIP ID", type: "number" },

    { name: "Product Name", type: "text" },

    { name: "Raw Material ID", type: "number" },

    { name: "Issued Quantity", type: "number" },

    {
      name: "Process Stage",
      type: "dropdown",
      options: ["Pre-Assembling", "Phosphating", "Powder Coating"],
    },

    {
      name: "Current Status",
      type: "dropdown",
      options: ["Pending", "In Progress", "Completed", "On Hold"],
    },
  ]);

  const [rows, setRows] = useState([
    {
      "WIP ID": "",
      "Product Name": "",
      "Raw Material ID": "",
      "Issued Quantity": "",
      "Process Stage": "",
      "Current Status": "",
    },
  ]);

  /* ===============================
     LOAD DATA
  =============================== */

  useEffect(() => {
    const data = localStorage.getItem("preAssembling");
    if (data) setSavedData(JSON.parse(data));
  }, []);

  /* ===============================
     SAVE DATA
  =============================== */

  const handleSave = () => {

  // ===== LOAD RAW MATERIAL =====
  const rawMaterials =
    JSON.parse(localStorage.getItem("rawMaterials")) || [];

  // ===== SUBTRACT MATERIAL =====
  rows.forEach((entry) => {
    const materialId = Number(entry["Raw Material ID"]);
    const issuedQty = Number(entry["Issued Quantity"]);

    const materialIndex = rawMaterials.findIndex(
      (mat) => Number(mat["Material ID"]) === materialId
    );

    if (materialIndex !== -1) {
      const availableQty = Number(
        rawMaterials[materialIndex]["Available Quantity"]
      );

      rawMaterials[materialIndex]["Available Quantity"] =
        availableQty - issuedQty;
    }
  });

  // ===== SAVE UPDATED RAW MATERIAL =====
  localStorage.setItem(
    "rawMaterials",
    JSON.stringify(rawMaterials)
  );

  // ===== SAVE PRE-ASSEMBLING DATA =====
  const updatedData = [...savedData, ...rows];
  setSavedData(updatedData);
  localStorage.setItem("preAssembling", JSON.stringify(updatedData));

  alert("Pre-Assembling Saved & Stock Updated ✅");

  setIsEditing(false);

  const emptyRow = {};
  columns.forEach((col) => (emptyRow[col.name] = ""));
  setRows([emptyRow]);
};


// =====delete row =====
const deleteSavedRow = (index) => {

  const rawMaterials =
    JSON.parse(localStorage.getItem("rawMaterials")) || [];

  const deletedRow = savedData[index];

  const materialId = Number(deletedRow["Raw Material ID"]);
  const issuedQty = Number(deletedRow["Issued Quantity"]);

  const materialIndex = rawMaterials.findIndex(
    (mat) => Number(mat["Material ID"]) === materialId
  );

  // ✅ RESTORE STOCK
  if (materialIndex !== -1) {
    rawMaterials[materialIndex]["Available Quantity"] =
      Number(rawMaterials[materialIndex]["Available Quantity"]) +
      issuedQty;
  }

  localStorage.setItem(
    "rawMaterials",
    JSON.stringify(rawMaterials)
  );

  const updated = savedData.filter((_, i) => i !== index);
  setSavedData(updated);
  localStorage.setItem("preAssembling", JSON.stringify(updated));
};

// =====edit row =====
const editSavedRow = (index) => {

  const rawMaterials =
    JSON.parse(localStorage.getItem("rawMaterials")) || [];

  const oldRow = savedData[index];

  const materialId = Number(oldRow["Raw Material ID"]);
  const issuedQty = Number(oldRow["Issued Quantity"]);

  const materialIndex = rawMaterials.findIndex(
    (mat) => Number(mat["Material ID"]) === materialId
  );

  // ✅ RETURN OLD STOCK FIRST
  if (materialIndex !== -1) {
    rawMaterials[materialIndex]["Available Quantity"] =
      Number(rawMaterials[materialIndex]["Available Quantity"]) +
      issuedQty;
  }

  localStorage.setItem(
    "rawMaterials",
    JSON.stringify(rawMaterials)
  );

  // open edit mode
  setRows([oldRow]);
  setIsEditing(true);

  const updated = savedData.filter((_, i) => i !== index);
  setSavedData(updated);
  localStorage.setItem("preAssembling", JSON.stringify(updated));
};



  /* ===============================
     ORIGINAL FUNCTIONS (UNCHANGED)
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

  const addRow = () => {
    const newRow = {};
    columns.forEach((col) => (newRow[col.name] = ""));
    setRows([...rows, newRow]);
  };

  const deleteRow = (rowIndex) => {
    const updatedRows = rows.filter((_, i) => i !== rowIndex);
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
            Pre-Assembling Stage Table
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
          Pre-Assembling Stage Table
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
  );
}