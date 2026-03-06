import { useState, useEffect } from "react";

export default function Reports() {
  const defaultColumns = [
    { name: "Report Type", type: "text" },
    { name: "Date Range", type: "text" },
    { name: "Opening Stock", type: "number" },
    { name: "Closing Stock", type: "number" },
    { name: "Total Consumption", type: "number" },
    { name: "Low Stock Items", type: "text" },
  ];

  const createEmptyRow = (cols) => {
    const row = {};
    cols.forEach((col) => {
      row[col.name] = "";
    });
    return row;
  };

  const [columns, setColumns] = useState(defaultColumns);
  const [rows, setRows] = useState([createEmptyRow(defaultColumns)]);
  const [savedData, setSavedData] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  // ✅ Load from LocalStorage
  useEffect(() => {
    const stored = localStorage.getItem("reportsData");
    if (stored) {
      setSavedData(JSON.parse(stored));
    }
  }, []);

  // ✅ Save to LocalStorage
  useEffect(() => {
    localStorage.setItem("reportsData", JSON.stringify(savedData));
  }, [savedData]);

  // ================= FORM FUNCTIONS =================

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
    setRows([...rows, createEmptyRow(columns)]);
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

  // ================= SAVE =================

  const handleSave = () => {
    const filteredRows = rows.filter((row) =>
      Object.values(row).some((val) => val !== "")
    );

    if (filteredRows.length === 0) {
      alert("No Data to Save ❌");
      return;
    }

    if (editIndex !== null) {
      const updated = [...savedData];
      updated[editIndex] = filteredRows[0];
      setSavedData(updated);
      setEditIndex(null);
    } else {
      setSavedData([...savedData, ...filteredRows]);
    }

    alert("Report Saved Successfully ✅");

    setRows([createEmptyRow(columns)]);
    setShowForm(false);
  };

  const handleCancel = () => {
    setRows([createEmptyRow(columns)]);
    setShowForm(false);
    setEditIndex(null);
  };

  const handleEdit = (index) => {
    setRows([savedData[index]]);
    setEditIndex(index);
    setShowForm(true);
  };

  const handleDelete = (index) => {
    const updated = savedData.filter((_, i) => i !== index);
    setSavedData(updated);
  };

  // ================= UI =================

  return (
    <div className="bg-gray-100 p-8 rounded-2xl">

      {/* ===== Saved Reports Table ===== */}
      {!showForm && (
        <div className="bg-white p-6 rounded-xl shadow">

          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">
              Saved Reports
            </h2>

            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 text-white px-5 py-2 rounded-lg"
            >
              + Generate Report
            </button>
          </div>

          {savedData.length === 0 ? (
            <p className="text-gray-500">No Reports Available</p>
          ) : (
            <div className="overflow-auto">
              <table className="min-w-full text-sm border">
                <thead className="bg-gray-100">
                  <tr>
                    {columns.map((col, index) => (
                      <th key={index} className="border px-4 py-2">
                        {col.name}
                      </th>
                    ))}
                    <th className="border px-4 py-2">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {savedData.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {columns.map((col, colIndex) => (
                        <td key={colIndex} className="border px-4 py-2">
                          {row[col.name]}
                        </td>
                      ))}
                      <td className="border px-4 py-2 text-center space-x-3">
                        <button
                          onClick={() => handleEdit(rowIndex)}
                          className="text-blue-600 font-semibold"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(rowIndex)}
                          className="text-red-600 font-semibold"
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

      {/* ===== Report Entry Form ===== */}
      {showForm && (
        <div>

          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">
              Generate Report
            </h2>

            <div className="flex gap-3">
              <button
                onClick={addColumn}
                className="bg-green-600 text-white px-5 py-2 rounded-lg"
              >
                + Add Column
              </button>

              <button
                onClick={addRow}
                className="bg-blue-600 text-white px-5 py-2 rounded-lg"
              >
                + Add Row
              </button>

              <button
                onClick={handleSave}
                className="bg-black text-white px-5 py-2 rounded-lg"
              >
                Save
              </button>

              <button
                onClick={handleCancel}
                className="bg-red-500 text-white px-5 py-2 rounded-lg"
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
                    <th key={index} className="border px-4 py-3 align-top">

                      <div className="flex justify-between items-center mb-2">
                        <input
                          type="text"
                          value={col.name}
                          onChange={(e) =>
                            changeColumnName(index, e.target.value)
                          }
                          className="w-full border rounded px-2 py-1 font-medium"
                        />
                        <button
                          onClick={() => deleteColumn(index)}
                          className="ml-2 text-red-600 font-bold"
                        >
                          ❌
                        </button>
                      </div>

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
                      </select>

                    </th>
                  ))}

                  <th className="border px-3 py-3">Action</th>
                </tr>
              </thead>

              <tbody>
                {rows.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {columns.map((col, colIndex) => (
                      <td key={colIndex} className="border px-3 py-2">
                        <input
                          type={col.type}
                          value={row[col.name] || ""}
                          onChange={(e) =>
                            handleChange(rowIndex, col.name, e.target.value)
                          }
                          className="w-full border rounded px-2 py-1"
                        />
                      </td>
                    ))}
                    <td className="border px-3 py-2 text-center">
                      <button
                        onClick={() => deleteRow(rowIndex)}
                        className="text-red-600 font-bold"
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