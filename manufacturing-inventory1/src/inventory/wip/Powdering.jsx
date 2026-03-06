import { useState, useEffect } from "react";

export default function Powdering() {

  // ================= DEFAULT COLUMNS =================
  const defaultColumns = [
    { name: "WIP ID", type: "number" },
    { name: "Product Name", type: "text" },
    { name: "Powder Type", type: "text" },
    { name: "Quantity Coated", type: "number" },

    {
      name: "Quality Status",
      type: "dropdown",
      options: ["Pass", "Fail", "Rework"],
    },

    {
      name: "Status",
      type: "dropdown",
      options: ["Pending", "In Progress", "Completed"],
    },
  ];

  // ================= STATES =================
  const [columns, setColumns] = useState(defaultColumns);
  const [rows, setRows] = useState([]);
  const [savedData, setSavedData] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // ================= CREATE EMPTY ROW =================
  const createEmptyRow = (cols) => {
    const row = {};
    cols.forEach((col) => (row[col.name] = ""));
    return row;
  };

  // ================= LOAD DATA (MAIN FIX) =================
  useEffect(() => {
    const storedColumns = localStorage.getItem("powdering_columns");
    const storedData = localStorage.getItem("powderingData");

    // Restore Columns
    if (storedColumns) {
      const parsedCols = JSON.parse(storedColumns);

      const restoredCols = parsedCols.map((col) => {
        const def = defaultColumns.find((d) => d.name === col.name);

        if (col.type === "dropdown" && def?.options) {
          return { ...col, options: def.options };
        }
        return col;
      });

      setColumns(restoredCols);
      setRows([createEmptyRow(restoredCols)]);
    } else {
      setRows([createEmptyRow(defaultColumns)]);
    }

    // Restore Data
    if (storedData) {
      try {
        setSavedData(JSON.parse(storedData));
      } catch {
        setSavedData([]);
      }
    }

    setIsLoaded(true);
  }, []);

  // ================= SAVE TO LOCALSTORAGE =================
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(
        "powdering_columns",
        JSON.stringify(columns)
      );
    }
  }, [columns, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(
        "powderingData",
        JSON.stringify(savedData)
      );
    }
  }, [savedData, isLoaded]);

  // ================= COLUMN FUNCTIONS =================
  const addColumn = () => {
    const newColumn = {
      name: `New Column ${columns.length + 1}`,
      type: "text",
    };

    setColumns([...columns, newColumn]);

    setRows(rows.map((r) => ({ ...r, [newColumn.name]: "" })));
  };

  const deleteColumn = (index) => {
    const colName = columns[index].name;

    setColumns(columns.filter((_, i) => i !== index));

    setRows(
      rows.map((row) => {
        const updated = { ...row };
        delete updated[colName];
        return updated;
      })
    );
  };

  const changeColumnName = (index, newName) => {
    const oldName = columns[index].name;

    const updatedCols = [...columns];
    updatedCols[index].name = newName;
    setColumns(updatedCols);

    setRows(
      rows.map((row) => {
        const updated = { ...row };
        updated[newName] = updated[oldName];
        delete updated[oldName];
        return updated;
      })
    );
  };

  const changeColumnType = (index, newType) => {
    const updated = [...columns];
    updated[index].type = newType;
    setColumns(updated);
  };

  // ================= ROW FUNCTIONS =================
  const addRow = () => {
    setRows([...rows, createEmptyRow(columns)]);
  };

  const deleteRow = (index) => {
    setRows(rows.filter((_, i) => i !== index));
  };

  const handleChange = (rowIndex, columnName, value) => {
    const updated = [...rows];
    updated[rowIndex][columnName] = value;
    setRows(updated);
  };

  // ================= SAVE =================
const handleSave = () => {

  const filteredRows = rows.filter((row) =>
    Object.values(row).some((v) => v !== "")
  );

  if (!filteredRows.length) {
    alert("No Data to Save ❌");
    return;
  }

  // ===== LOAD PHOSPHATING DATA =====
  const phosphating =
    JSON.parse(localStorage.getItem("phosphating_data")) || [];

  // ===== SUBTRACT FROM PHOSPHATING =====
  for (const entry of filteredRows) {

    const wipId = Number(entry["WIP ID"]);
    const qtyUsed = Number(entry["Quantity Coated"]);

    const index = phosphating.findIndex(
      (p) => Number(p["WIP ID"]) === wipId
    );

    if (index === -1) {
      alert(`WIP ID ${wipId} not found in Phosphating ❌`);
      return;
    }

    const availableQty = Number(
      phosphating[index]["Quantity in Process"] || 0
    );

    if (availableQty < qtyUsed) {
      alert(
        `Not enough quantity in Phosphating for WIP ID ${wipId}`
      );
      return;
    }

    // subtract quantity
    phosphating[index]["Quantity in Process"] =
      availableQty - qtyUsed;
  }

  // ===== SAVE UPDATED PHOSPHATING =====
  localStorage.setItem(
    "phosphating_data",
    JSON.stringify(phosphating)
  );

  // ===== SAVE POWDERING DATA =====
  if (editIndex !== null) {
    const updated = [...savedData];
    updated[editIndex] = filteredRows[0];
    setSavedData(updated);
    setEditIndex(null);
  } else {
    setSavedData([...savedData, ...filteredRows]);
  }

  alert("Powdering Saved & Phosphating Stock Updated ✅");

  setRows([createEmptyRow(columns)]);
  setShowForm(false);
};

  const handleCancel = () => {
    setRows([createEmptyRow(columns)]);
    setShowForm(false);
    setEditIndex(null);
  };

  // ================= EDIT / DELETE =================
  const handleEdit = (index) => {
    setRows([savedData[index]]);
    setEditIndex(index);
    setShowForm(true);
  };

  const handleDelete = (index) => {
    setSavedData(savedData.filter((_, i) => i !== index));
  };

  // ================= UI =================
  return (
    <div className="bg-gray-100 p-8 rounded-2xl">

      {/* ================= SAVED TABLE ================= */}
      {isLoaded && !showForm && (
        <div className="bg-white p-6 rounded-xl shadow">

          <div className="flex justify-between mb-6">
            <h2 className="text-2xl font-semibold">
              Saved Powdering Data
            </h2>

            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 text-white px-5 py-2 rounded-lg"
            >
              + Add
            </button>
          </div>

          {savedData.length === 0 ? (
            <p>No Data Available</p>
          ) : (
            <div className="overflow-auto">
              <table className="min-w-full border text-sm">
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
                  {savedData.map((row, rIndex) => (
                    <tr key={rIndex}>
                      {columns.map((col, cIndex) => (
                        <td key={cIndex} className="border px-4 py-2">
                          {row[col.name]}
                        </td>
                      ))}

                      <td className="border px-4 py-2 text-center space-x-2">
                        <button
                          onClick={() => handleEdit(rIndex)}
                          className="text-blue-600"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => handleDelete(rIndex)}
                          className="text-red-600"
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

      {/* ================= FORM ================= */}
      {showForm && (
        <div className="bg-white p-6 rounded-xl shadow">

          <div className="flex gap-3 mb-6">
            <button onClick={addColumn} className="bg-green-600 text-white px-4 py-2 rounded">
              + Column
            </button>

            <button onClick={addRow} className="bg-blue-600 text-white px-4 py-2 rounded">
              + Row
            </button>

            <button onClick={handleSave} className="bg-black text-white px-4 py-2 rounded">
              Save
            </button>

            <button onClick={handleCancel} className="bg-red-500 text-white px-4 py-2 rounded">
              Cancel
            </button>
          </div>

          <table className="min-w-full border text-sm">
            <thead className="bg-gray-50">
              <tr>
                {columns.map((col, i) => (
                  <th key={i} className="border px-3 py-3">

                    <input
                      value={col.name}
                      onChange={(e) =>
                        changeColumnName(i, e.target.value)
                      }
                      className="border w-full mb-2 px-2 py-1"
                    />

                    <select
                      value={col.type}
                      onChange={(e) =>
                        changeColumnType(i, e.target.value)
                      }
                      className="border w-full px-2 py-1"
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
              {rows.map((row, rIndex) => (
                <tr key={rIndex}>
                  {columns.map((col, cIndex) => (
                    <td key={cIndex} className="border px-2 py-2">

                      {col.type === "dropdown" ? (
                        <select
                          value={row[col.name] || ""}
                          onChange={(e) =>
                            handleChange(rIndex, col.name, e.target.value)
                          }
                          className="border w-full px-2 py-1"
                        >
                          <option value="">Select</option>
                          {col.options?.map((opt, i) => (
                            <option key={i} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type={col.type}
                          value={row[col.name] || ""}
                          onChange={(e) =>
                            handleChange(rIndex, col.name, e.target.value)
                          }
                          className="border w-full px-2 py-1"
                        />
                      )}

                    </td>
                  ))}

                  <td className="border text-center">
                    <button
                      onClick={() => deleteRow(rIndex)}
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
      )}
    </div>
  );
}