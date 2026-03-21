import { useState, useEffect } from "react";

export default function Rework() {
  const [isEditing, setIsEditing] = useState(false);
  const [savedData, setSavedData] = useState([]);
  const [rows, setRows] = useState([]);

  const [columns] = useState([
    { name: "Rework ID", type: "text" },
    { name: "Product", type: "text" },
    { name: "Batch", type: "text" },
    { name: "Defect", type: "text" },
    { name: "Stage", type: "text" },
    {
      name: "Status",
      type: "dropdown",
      options: ["Pending", "In Progress", "Completed"],
    },
    { name: "Reworked By", type: "text" },
    { name: "Date", type: "date" },
    { name: "Remarks", type: "text" },
  ]);

  /* ================= LOAD ================= */

  useEffect(() => {
    const data = localStorage.getItem("reworkData");
    if (data) setSavedData(JSON.parse(data));
  }, []);

  /* ================= ADD ROW ================= */

  const addRow = () => {
    const newRow = {};
    columns.forEach((col) => {
      if (col.name === "Rework ID") {
        newRow[col.name] = `RW${Date.now()}${Math.floor(Math.random() * 1000)}`;
      } else {
        newRow[col.name] = "";
      }
    });

    newRow.processed = false; // 🔥 important flag

    setRows([...rows, newRow]);
  };

  /* ================= HANDLE CHANGE ================= */

  const handleChange = (rowIndex, columnName, value) => {
    const updated = [...rows];
    updated[rowIndex][columnName] = value;
    setRows(updated);
  };

  /* ================= SAVE ================= */

  const handleSave = () => {
    const updatedData = [...savedData, ...rows];

    /* 🔥 SEND ONLY NEW COMPLETED ITEMS TO QC */
    const completedItems = rows.filter(
      (row) => row.Status === "Completed" && !row.processed
    );

    if (completedItems.length > 0) {
      const existingQC =
        JSON.parse(localStorage.getItem("qualityInspection")) || [];

const reworkedToQC = completedItems.map((item, index) => ({
  "QC ID": `QC${Date.now()}${index}`,
  Product: item.Product,
  Batch: item.Batch,
  Inspector: "Recheck Required",   // ✅ default value
  Date: new Date().toISOString().split("T")[0], // ✅ auto date
  Status: "Pending",  // ✅ IMPORTANT (not empty)
  Remarks: `Reworked from ${item.Stage}: ${item.Defect}`,
}));

      localStorage.setItem(
        "qualityInspection",
        JSON.stringify([...existingQC, ...reworkedToQC])
      );
    }

    /* 🔥 MARK AS PROCESSED */
    const finalData = updatedData.map((item) => {
      if (item.Status === "Completed") {
        return { ...item, processed: true };
      }
      return item;
    });

    setSavedData(finalData);
    localStorage.setItem("reworkData", JSON.stringify(finalData));

    alert("Rework Updated & Sent Back to QC 🔄");

    setRows([]);
    setIsEditing(false);
  };

  /* ================= DELETE / EDIT ================= */

  const deleteRow = (index) => {
    const updated = savedData.filter((_, i) => i !== index);
    setSavedData(updated);
    localStorage.setItem("reworkData", JSON.stringify(updated));
  };

  const editRow = (index) => {
    setRows([savedData[index]]);
    setIsEditing(true);

    const updated = savedData.filter((_, i) => i !== index);
    setSavedData(updated);
    localStorage.setItem("reworkData", JSON.stringify(updated));
  };

  /* ================= VIEW MODE ================= */

  if (!isEditing) {
    return (
      <div className="bg-gray-100 p-8 rounded-2xl">
        <div className="flex justify-between mb-6">
          <h2 className="text-2xl font-semibold">
            Rework Management
          </h2>

          <button
            onClick={() => setIsEditing(true)}
            className="bg-purple-600 text-white px-5 py-2 rounded-lg"
          >
            + Manage Rework
          </button>
        </div>

        <div className="overflow-auto bg-white rounded-xl border shadow-sm">
          <table className="min-w-full text-sm">
            <thead className="bg-purple-100">
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
                    No Rework Data
                  </td>
                </tr>
              ) : (
                savedData.map((row, index) => (
                  <tr key={index}>
                    {columns.map((col, i) => (
                      <td key={i} className="border px-3 py-2">
                        {col.name === "Status" ? (
                          <span
                            className={`px-2 py-1 rounded text-white ${
                           row[col.name] === "Completed"
  ? "bg-green-500"
  : row[col.name] === "In Progress"
  ? "bg-blue-500"
  : row[col.name] === "Pending"
  ? "bg-yellow-500"
  : "bg-gray-500"
                            }`}
                          >
                            {row[col.name]}
                          </span>
                        ) : (
                          row[col.name]
                        )}
                      </td>
                    ))}

                    <td className="border text-center space-x-2">
                      <button
                        onClick={() => editRow(index)}
                        className="text-blue-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteRow(index)}
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

  /* ================= EDIT MODE ================= */

  return (
    <div className="bg-gray-100 p-8 rounded-2xl">
      <div className="flex justify-between mb-6">
        <h2 className="text-2xl font-semibold">
          Rework Management
        </h2>

        <div className="flex gap-3">
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
        </div>
      </div>

      <div className="overflow-auto bg-white rounded-xl border shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="bg-purple-100">
            <tr>
              {columns.map((col, i) => (
                <th key={i} className="border px-4 py-2">
                  {col.name}
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
                        className="w-full border px-2 py-1"
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
                        className="w-full border px-2 py-1"
                      />
                    )}
                  </td>
                ))}

                <td className="border text-center">
                  <button
                    onClick={() =>
                      setRows(rows.filter((_, i) => i !== rowIndex))
                    }
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