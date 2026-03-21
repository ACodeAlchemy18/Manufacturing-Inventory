import { useState, useEffect } from "react";

export default function Dispatch() {
  const [isEditing, setIsEditing] = useState(false);
  const [savedData, setSavedData] = useState([]);
  const [fgData, setFgData] = useState([]);

  const [columns] = useState([
    { name: "Dispatch ID", type: "text" },
    { name: "Product", type: "dropdown" },
    { name: "Batch", type: "text" },
    { name: "Destination", type: "text" },
    { name: "Transport", type: "text" },
    {
      name: "Status",
      type: "dropdown",
      options: ["Ready", "Shipped"],
    },
    { name: "Dispatched By", type: "text" },
    { name: "Date", type: "date" },
    { name: "Remarks", type: "text" },
  ]);

  const [rows, setRows] = useState([]);

  /* ================= LOAD ================= */

  useEffect(() => {
    const dispatch = localStorage.getItem("dispatchData");
    if (dispatch) setSavedData(JSON.parse(dispatch));

    // ✅ GET FROM FINISHED GOODS (CORRECT FLOW)
    const fg =
      JSON.parse(localStorage.getItem("finishedGoods")) || [];

    // Only ready or partial items
    const availableFG = fg.filter(
      (f) => f.status !== "Dispatched"
    );

    setFgData(availableFG);
  }, []);

  /* ================= ADD ROW ================= */

  const addRow = () => {
    const newRow = {};
    columns.forEach((col) => {
      if (col.name === "Dispatch ID") {
        newRow[col.name] = `DIS${Date.now()}`;
      } else if (col.name === "Status") {
        newRow[col.name] = "Ready";
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
      ...updatedRows[rowIndex],
      [columnName]: value,
    };

    // AUTO FILL BATCH FROM FG
    if (columnName === "Product") {
      const selected = fgData.find(
        (f) => f.productName === value
      );

      if (selected) {
        updatedRows[rowIndex]["Batch"] = selected.batch;
      }
    }

    setRows(updatedRows);
  };

  /* ================= SAVE ================= */

  const handleSave = () => {
    const updated = [...savedData, ...rows];

    setSavedData(updated);
    localStorage.setItem("dispatchData", JSON.stringify(updated));

    // 🔥 UPDATE FINISHED GOODS STATUS
    const fg =
      JSON.parse(localStorage.getItem("finishedGoods")) || [];

    const updatedFG = fg.map((f) => {
      const shippedItem = rows.find(
        (r) =>
          r.Product === f.productName &&
          r.Batch === f.batch &&
          r.Status === "Shipped"
      );

      if (shippedItem) {
        return {
          ...f,
          status: "Dispatched",
        };
      }

      return f;
    });

    localStorage.setItem(
      "finishedGoods",
      JSON.stringify(updatedFG)
    );

    alert("Dispatch Saved 🚚");

    setRows([]);
    setIsEditing(false);
  };

  /* ================= DELETE / EDIT ================= */

  const deleteRow = (index) => {
    const updated = savedData.filter((_, i) => i !== index);
    setSavedData(updated);
    localStorage.setItem("dispatchData", JSON.stringify(updated));
  };

  const editRow = (index) => {
    setRows([savedData[index]]);
    setIsEditing(true);

    const updated = savedData.filter((_, i) => i !== index);
    setSavedData(updated);
    localStorage.setItem("dispatchData", JSON.stringify(updated));
  };

  /* ================= STATUS COLOR ================= */

  const getStatusColor = (status) => {
    switch (status) {
      case "Shipped":
        return "bg-green-500 text-white";
      case "Ready":
        return "bg-blue-500 text-white";
      default:
        return "bg-gray-300";
    }
  };

  /* ================= VIEW MODE ================= */

  if (!isEditing) {
    return (
      <div className="bg-gray-100 p-8 rounded-2xl">
        <div className="flex justify-between mb-6">
          <h2 className="text-2xl font-semibold">Dispatch</h2>

          <button
            onClick={() => setIsEditing(true)}
            className="bg-purple-600 text-white px-5 py-2 rounded-lg"
          >
            + Start Dispatch
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
                    No Dispatch Data
                  </td>
                </tr>
              ) : (
                savedData.map((row, index) => (
                  <tr key={index}>
                    {columns.map((col, i) => {
                      if (col.name === "Status") {
                        return (
                          <td key={i} className="border px-3 py-2">
                            <span
                              className={`px-2 py-1 rounded text-xs ${getStatusColor(
                                row[col.name]
                              )}`}
                            >
                              {row[col.name]}
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
        <h2 className="text-2xl font-semibold">Dispatch</h2>

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
                        {fgData.map((f, i) => (
                          <option key={i}>{f.productName}</option>
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