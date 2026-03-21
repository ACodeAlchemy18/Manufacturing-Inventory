import { useState, useEffect } from "react";

export default function FunctionalTesting() {
  const [isEditing, setIsEditing] = useState(false);
  const [savedData, setSavedData] = useState([]);
  const [qcData, setQcData] = useState([]);

  const [columns, setColumns] = useState([
    { name: "Test ID", type: "text" },
    { name: "Product", type: "dropdown" },
    { name: "Batch", type: "text" },
    {
      name: "Type",
      type: "dropdown",
      options: ["Electrical", "Mechanical", "Performance"],
    },
    {
      name: "Result",
      type: "dropdown",
      options: ["Pass", "Fail"],
    },
    { name: "Tested By", type: "text" },
    { name: "Date", type: "date" },
    { name: "Remarks", type: "text" },
  ]);

  const [rows, setRows] = useState([]);

  /* ================= LOAD DATA ================= */

  useEffect(() => {
    const ft = localStorage.getItem("functionalTesting");
    if (ft) setSavedData(JSON.parse(ft));

    // ✅ ONLY PASS FROM QC
    const qc =
      JSON.parse(localStorage.getItem("qualityInspection")) || [];

    const passed = qc.filter((q) => q.Status === "Pass");

    setQcData(passed);
  }, []);

  /* ================= ADD ROW ================= */

  const addRow = () => {
    const newRow = {};
    columns.forEach((col) => {
      if (col.name === "Test ID") {
        newRow[col.name] = `T${Date.now()}`;
      } else {
        newRow[col.name] = "";
      }
    });
    setRows([...rows, newRow]);
  };

  /* ================= HANDLE CHANGE ================= */

  const handleChange = (rowIndex, columnName, value) => {
    const updated = [...rows];
    updated[rowIndex][columnName] = value;

    // ✅ AUTO BATCH FROM QC
    if (columnName === "Product") {
      const selected = qcData.find((q) => q.Product === value);
      if (selected) {
        updated[rowIndex]["Batch"] = selected.Batch;
      }
    }

    setRows(updated);
  };

  /* ================= SAVE ================= */

  const handleSave = () => {
  const updatedData = [...savedData, ...rows];

  setSavedData(updatedData);
  localStorage.setItem(
    "functionalTesting",
    JSON.stringify(updatedData)
  );

  /* ========= FAIL → REWORK ========= */
  const failed = rows.filter((r) => r.Result === "Fail");

  if (failed.length > 0) {
    const existing =
      JSON.parse(localStorage.getItem("reworkData")) || [];

    const newRework = failed.map((f, index) => ({
      "Rework ID": `RW${Date.now()}${index}`,
      Product: f.Product,
      Batch: f.Batch,
      Defect: f.Remarks || "Functional Failure",
      Stage: "Functional Testing",
      Status: "Pending",
      "Reworked By": "",
      Date: new Date().toISOString().split("T")[0],
      Remarks: "",
      processed: false,
    }));

    // ✅ IMPORTANT: keep this inside
    localStorage.setItem(
      "reworkData",
      JSON.stringify([...existing, ...newRework])
    );
  }

  /* ========= PASS → PACKAGING ========= */
  const passed = rows.filter((r) => r.Result === "Pass");

  if (passed.length > 0) {
    const existing =
      JSON.parse(localStorage.getItem("packagingData")) || [];

    const newPack = passed.map((p, index) => ({
      product: p.Product,
      batch: p.Batch,
      testId: p["Test ID"],
      status: "Pending",
    }));

    localStorage.setItem(
      "packagingData",
      JSON.stringify([...existing, ...newPack])
    );
  }

  alert("Functional Testing Saved & Flow Updated ✅");

  setRows([]);
  setIsEditing(false);
};
  /* ================= DELETE / EDIT ================= */

  const deleteSavedRow = (index) => {
    const updated = savedData.filter((_, i) => i !== index);
    setSavedData(updated);
    localStorage.setItem("functionalTesting", JSON.stringify(updated));
  };

  const editSavedRow = (index) => {
    setRows([savedData[index]]);
    setIsEditing(true);

    const updated = savedData.filter((_, i) => i !== index);
    setSavedData(updated);
    localStorage.setItem("functionalTesting", JSON.stringify(updated));
  };

  const deleteRow = (rowIndex) => {
    setRows(rows.filter((_, i) => i !== rowIndex));
  };

  /* ================= VIEW MODE ================= */

  if (!isEditing) {
    return (
      <div className="bg-gray-100 p-8 rounded-2xl">
        <div className="flex justify-between mb-6">
          <h2 className="text-2xl font-semibold">
            Functional Testing
          </h2>

          <button
            onClick={() => setIsEditing(true)}
            className="bg-purple-600 text-white px-5 py-2 rounded-lg"
          >
            + Add Test
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
                    No Testing Data
                  </td>
                </tr>
              ) : (
                savedData.map((row, index) => (
                  <tr key={index}>
                    {columns.map((col, i) => (
                      <td key={i} className="border px-3 py-2">
                        {col.name === "Result" ? (
                          <span
                            className={`px-2 py-1 rounded text-white ${
                              row[col.name] === "Pass"
                                ? "bg-green-500"
                                : "bg-red-500"
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

  /* ================= EDIT MODE ================= */

  return (
    <div className="bg-gray-100 p-8 rounded-2xl">
      <div className="flex justify-between mb-6">
        <h2 className="text-2xl font-semibold">
          Add Functional Testing
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

                    {col.name === "Product" ? (
                      <select
                        value={row[col.name] || ""}
                        onChange={(e) =>
                          handleChange(rowIndex, col.name, e.target.value)
                        }
                        className="w-full border px-2 py-1"
                      >
                        <option value="">Select Product</option>
                        {qcData.map((q, i) => (
                          <option key={i}>{q.Product}</option>
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