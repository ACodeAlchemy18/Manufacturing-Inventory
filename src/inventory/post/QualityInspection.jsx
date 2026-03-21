import { useState, useEffect } from "react";

export default function QualityInspection() {
  const [isEditing, setIsEditing] = useState(false);
  const [savedData, setSavedData] = useState([]);
  const [powderData, setPowderData] = useState([]);

  const [columns, setColumns] = useState([
    { name: "QC ID", type: "text" },
    { name: "Product", type: "dropdown" },
    { name: "Batch", type: "text" },
    { name: "Inspector", type: "text" },
    { name: "Date", type: "date" },
    {
      name: "Status",
      type: "dropdown",
      options: ["Pass", "Fail"],
    },
    { name: "Remarks", type: "text" },
  ]);

  const [rows, setRows] = useState([]);

  /* ================= LOAD DATA ================= */

  useEffect(() => {
    const qc = localStorage.getItem("qualityInspection");
    if (qc) setSavedData(JSON.parse(qc));

    const powder =
      JSON.parse(localStorage.getItem("powderingData")) || [];

    // ✅ Only Completed items come to QC
    const filtered = powder.filter(
      (p) => p.Status === "Completed"
    );

    setPowderData(filtered);
  }, []);

  /* ================= ADD ROW ================= */

  const addRow = () => {
    const newRow = {};
    columns.forEach((col) => {
      if (col.name === "QC ID") {
        newRow[col.name] = `QC${Date.now()}`;
      } else {
        newRow[col.name] = "";
      }
    });
    setRows([...rows, newRow]);
  };

  /* ================= HANDLE CHANGE ================= */

  const handleChange = (rowIndex, columnName, value) => {
    const updatedRows = [...rows];
    updatedRows[rowIndex][columnName] = value;

    // ✅ Auto fill Batch using WIP ID
    if (columnName === "Product") {
      const selected = powderData.find(
        (p) => p["Product Name"] === value
      );

      if (selected) {
        updatedRows[rowIndex]["Batch"] = selected["WIP ID"];
      }
    }

    setRows(updatedRows);
  };

  /* ================= SAVE ================= */

  const handleSave = () => {
    const updatedData = [...savedData, ...rows];

    setSavedData(updatedData);
    localStorage.setItem(
      "qualityInspection",
      JSON.stringify(updatedData)
    );

    /* ========= FAIL → REWORK ========= */
    const failedItems = rows.filter(
      (row) => row.Status === "Fail"
    );

    if (failedItems.length > 0) {
      const existing =
        JSON.parse(localStorage.getItem("reworkData")) || [];

const newRework = failedItems.map((item, index) => ({
  "Rework ID": `RW${Date.now()}${index}`,
  Product: item.Product,
  Batch: item.Batch,
  Defect: item.Remarks,
  Stage: "Quality Inspection",
  Status: "Pending",
  "Reworked By": "",
  Date: "",
  Remarks: "",
  processed: false
}));

      localStorage.setItem(
        "reworkData",
        JSON.stringify([...existing, ...newRework])
      );
    }

    /* ========= PASS → FUNCTIONAL TEST ========= */
    const passedItems = rows.filter(
      (row) => row.Status === "Pass"
    );

    if (passedItems.length > 0) {
      const existing =
        JSON.parse(localStorage.getItem("functionalTesting")) || [];

const newPass = passedItems.map((item, index) => ({
  "Test ID": `T${Date.now()}${index}`,
  Product: item.Product,
  Batch: item.Batch,
  Type: "",
  Result: "",
  "Tested By": "",
  Date: "",
  Remarks: "",
}));

      localStorage.setItem(
        "functionalTesting",
        JSON.stringify([...existing, ...newPass])
      );
    }

    alert("QC Saved & Flow Updated ✅");

    setRows([]);
    setIsEditing(false);
  };

  /* ================= DELETE / EDIT ================= */

  const deleteSavedRow = (index) => {
    const updated = savedData.filter((_, i) => i !== index);
    setSavedData(updated);
    localStorage.setItem("qualityInspection", JSON.stringify(updated));
  };

  const editSavedRow = (index) => {
    setRows([savedData[index]]);
    setIsEditing(true);

    const updated = savedData.filter((_, i) => i !== index);
    setSavedData(updated);
    localStorage.setItem("qualityInspection", JSON.stringify(updated));
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
            Quality Inspection
          </h2>

          <button
            onClick={() => setIsEditing(true)}
            className="bg-purple-600 text-white px-5 py-2 rounded-lg"
          >
            + Add QC
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
                    No QC Data Found
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
                              row[col.name] === "Pass"
  ? "bg-green-500"
  : row[col.name] === "Fail"
  ? "bg-red-500"
  : "bg-yellow-500"
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
          Add Quality Inspection
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
                        {powderData.map((p, i) => (
                          <option key={i}>
                            {p["Product Name"]}
                          </option>
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