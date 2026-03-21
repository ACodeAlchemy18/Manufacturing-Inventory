import { useState, useEffect } from "react";

export default function Packaging() {
  const [isEditing, setIsEditing] = useState(false);
  const [savedData, setSavedData] = useState([]);
  const [testData, setTestData] = useState([]);

  const [columns] = useState([
    { name: "Package ID", type: "text" },
    { name: "Product", type: "dropdown" },
    { name: "Batch", type: "text" },
    { name: "Packaging Type", type: "text" },
    {
      name: "Status",
      type: "dropdown",
      options: ["Pending", "Completed"],
    },
    { name: "Packed By", type: "text" },
    { name: "Date", type: "date" },
    { name: "Remarks", type: "text" },
  ]);

  const [rows, setRows] = useState([]);

  /* ================= LOAD ================= */

  useEffect(() => {
    const pack = localStorage.getItem("packagingData");
    if (pack) setSavedData(JSON.parse(pack));

    const ft =
      JSON.parse(localStorage.getItem("functionalTesting")) || [];

    const passedItems = ft.filter((item) => item.Result === "Pass");

    setTestData(passedItems);
  }, []);

  /* ================= ADD ROW ================= */

  const addRow = () => {
    const newRow = {};
    columns.forEach((col) => {
      if (col.name === "Package ID") {
        newRow[col.name] = `PKG${Date.now()}`;
      } else if (col.name === "Status") {
        newRow[col.name] = "Pending";
      } else {
        newRow[col.name] = "";
      }
    });
    setRows([...rows, newRow]);
  };

  /* ================= HANDLE CHANGE ================= */

  const handleChange = (rowIndex, columnName, value) => {
    const updatedRows = [...rows];

    updatedRows[rowIndex] = {
      ...updatedRows[rowIndex], // ✅ KEEP OLD DATA
      [columnName]: value,      // ✅ UPDATE CURRENT FIELD
    };

    // AUTO FILL BATCH
    if (columnName === "Product") {
      const selected = testData.find((t) => t.Product === value);
      if (selected) {
        updatedRows[rowIndex]["Batch"] = selected.Batch;
      }
    }

    setRows(updatedRows);
  };

  /* ================= SAVE ================= */

  const handleSave = () => {
    const updated = [...savedData, ...rows];

    setSavedData(updated);
    localStorage.setItem("packagingData", JSON.stringify(updated));

    // SEND COMPLETED TO DISPATCH
    const completed = rows.filter((r) => r.Status === "Completed");

    if (completed.length > 0) {
      const existing =
        JSON.parse(localStorage.getItem("dispatchData")) || [];

      const newDispatch = completed.map((p, index) => ({
        "Dispatch ID": `D${Date.now()}${index}`,
        Product: p.Product,
        Batch: p.Batch,
        Status: "Ready",
        Date: new Date().toISOString().split("T")[0],
      }));

      localStorage.setItem(
        "dispatchData",
        JSON.stringify([...existing, ...newDispatch])
      );
    }

    alert("Packaging Saved & Sent to Dispatch 🚚");

    setRows([]);
    setIsEditing(false);
  };

  /* ================= DELETE / EDIT ================= */

  const deleteRow = (index) => {
    const updated = savedData.filter((_, i) => i !== index);
    setSavedData(updated);
    localStorage.setItem("packagingData", JSON.stringify(updated));
  };

  const editRow = (index) => {
    setRows([savedData[index]]);
    setIsEditing(true);

    const updated = savedData.filter((_, i) => i !== index);
    setSavedData(updated);
    localStorage.setItem("packagingData", JSON.stringify(updated));
  };

  /* ================= VIEW MODE ================= */

  if (!isEditing) {
    return (
      <div className="bg-gray-100 p-8 rounded-2xl">
        <div className="flex justify-between mb-6">
          <h2 className="text-2xl font-semibold">Packaging</h2>

          <button
            onClick={() => setIsEditing(true)}
            className="bg-purple-600 text-white px-5 py-2 rounded-lg"
          >
            + Start Packaging
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
                    No Packaging Data
                  </td>
                </tr>
              ) : (
                savedData.map((row, index) => (
                  <tr key={index}>
                    {columns.map((col, i) => {
                      if (col.name === "Status") {
                        const status = row[col.name] || "Pending";

                        return (
                          <td key={i} className="border px-3 py-2">
                            <span
                              className={`px-2 py-1 rounded text-white ${
                                status === "Completed"
                                  ? "bg-green-500"
                                  : "bg-yellow-500"
                              }`}
                            >
                              {status}
                            </span>
                          </td>
                        );
                      }

                      return (
                        <td key={i} className="border px-3 py-2">
                          {row[col.name]}
                        </td>
                      );
                    })}

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
        <h2 className="text-2xl font-semibold">Packaging</h2>

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

                    {col.name === "Product" ? (
                      <select
                        value={row[col.name] || ""}
                        onChange={(e) =>
                          handleChange(rowIndex, col.name, e.target.value)
                        }
                        className="w-full border px-2 py-1"
                      >
                        <option value="">Select Product</option>
                        {testData.map((t, i) => (
                          <option key={i}>{t.Product}</option>
                        ))}
                      </select>

                    ) : col.type === "dropdown" ? (
                      <select
                        value={row[col.name] || ""}
                        onChange={(e) =>
                          handleChange(rowIndex, col.name, e.target.value)
                        }
                        className="w-full border px-2 py-1"
                      >
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