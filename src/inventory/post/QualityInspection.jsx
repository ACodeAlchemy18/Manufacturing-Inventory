import { useState, useEffect } from "react";

export default function QualityInspection() {
  const [powderData, setPowderData] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [viewData, setViewData] = useState(null);
  const [savedData, setSavedData] = useState([]);

  const [formData, setFormData] = useState({
    qcId: "",
    product: "",
    batch: "",
    inspector: "",
    date: "",
    surface: "",
    scratch: "",
    paint: "",
    color: "",
    alignment: "",
    status: "",
    remarks: "",
  });

  /* ================= LOAD DATA ================= */
  useEffect(() => {
    const data =
      JSON.parse(localStorage.getItem("preAssembling")) || [];

    const qc =
      JSON.parse(localStorage.getItem("qualityInspection")) || [];

    setSavedData(qc);

    const inspected = qc.map((q) => q.batch);

    const filtered = data.filter(
      (item) =>
        item["Process Stage"] === "Final Assembly" &&
        item["Current Status"] === "Pending"
    );

    setPowderData(filtered);
  }, []);

  /* ================= OPEN FORM ================= */
  const handleInspect = (product) => {
    setSelectedProduct(product);

    setFormData({
      qcId: `QC${Date.now()}`,
      product: product["Product Name"],
      batch: product["WIP ID"],
      inspector: "",
      date: new Date().toISOString().split("T")[0],
      surface: "",
      scratch: "",
      paint: "",
      color: "",
      alignment: "",
      status: "",
      remarks: "",
    });
  };

  /* ================= VIEW ================= */
  const handleView = (product) => {
    const qc = savedData.find(
      (q) => q.batch === product["WIP ID"]
    );

    if (!qc) {
      alert("No QC data found");
      return;
    }

    setViewData(qc);
  };

  /* ================= MOVE ================= */
  const handleMove = (product) => {
    const qc = savedData.find(
      (q) => q.batch === product["WIP ID"]
    );

    if (!qc) {
      alert("QC not done yet ❌");
      return;
    }

    if (qc.status !== "Pass") {
      alert("Only PASS products can move ❌");
      return;
    }

    const existing =
      JSON.parse(localStorage.getItem("functionalTesting")) || [];

    const newTest = {
      "Test ID": `T${Date.now()}`,
      Product: qc.product,
      Batch: qc.batch,
      Result: "",
      "Tested By": "",
      Date: "",
    };

    localStorage.setItem(
      "functionalTesting",
      JSON.stringify([...existing, newTest])
    );

    alert("Moved to Functional Testing ✅");
  };

  /* ================= HANDLE CHANGE ================= */
  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  /* ================= SAVE ================= */
  const handleSave = () => {
  let updated;

  const index = savedData.findIndex(
    (item) => item.qcId === formData.qcId
  );

  if (index !== -1) {
    // UPDATE existing
    updated = [...savedData];
    updated[index] = formData;
  } else {
    // ADD new
    updated = [...savedData, formData];
  }

  setSavedData(updated);
  localStorage.setItem("qualityInspection", JSON.stringify(updated));

  alert("QC Saved ✅");

  setSelectedProduct(null);
};


//edit
const handleEdit = (qc) => {
  setSelectedProduct(qc); // IMPORTANT

  setFormData({
    qcId: qc.qcId,
    product: qc.product,
    batch: qc.batch,
    inspector: qc.inspector || "",
    date: qc.date || "",
    surface: qc.surface || "",
    scratch: qc.scratch || "",
    paint: qc.paint || "",
    color: qc.color || "",
    alignment: qc.alignment || "",
    status: qc.status || "",
    remarks: qc.remarks || "",
  });

  setViewData(null);
};

//Delete
const handleDelete = (qcId) => {
  const confirmDelete = window.confirm("Are you sure?");
  if (!confirmDelete) return;

  const updated = savedData.filter((item) => item.qcId !== qcId);

  setSavedData(updated);
  localStorage.setItem("qualityInspection", JSON.stringify(updated));

  alert("Deleted ✅");

  setViewData(null);
};




if (viewData) {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-lg p-6">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6 border-b pb-3">
          <h2 className="text-2xl font-semibold text-gray-700">
            Functional Test - {viewData.product}
          </h2>

          <button
            onClick={() => setViewData(null)}
            className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded"
          >
            Back
          </button>
        </div>

        {/* SCROLLABLE TABLE */}
        <div className="overflow-x-auto border rounded-lg">

          <table className="min-w-[1400px] w-full text-sm border-collapse">

            {/* HEADER */}
            <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
              <tr>
                {[
                  "Test ID",
                  "Product",
                  "Batch",
                  "Tested By",
                  "Date",
                  "Functionality",
                  "Performance",
                  "Safety",
                  "Result",
                  "Remarks",
                  "Action",
                ].map((head, i) => (
                  <th
                    key={i}
                    className="px-4 py-3 border text-left whitespace-nowrap"
                  >
                    {head}
                  </th>
                ))}
              </tr>
            </thead>

            {/* BODY */}
            <tbody>
              <tr className="hover:bg-gray-50">

                <td className="px-4 py-3 border">{viewData.testId}</td>
                <td className="px-4 py-3 border">{viewData.product}</td>
                <td className="px-4 py-3 border">{viewData.batch}</td>
                <td className="px-4 py-3 border">{viewData.testedBy}</td>
                <td className="px-4 py-3 border">{viewData.date}</td>
                <td className="px-4 py-3 border">{viewData.functionality}</td>
                <td className="px-4 py-3 border">{viewData.performance}</td>
                <td className="px-4 py-3 border">{viewData.safety}</td>

                {/* RESULT */}
                <td className="px-4 py-3 border">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      viewData.result === "Pass"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {viewData.result}
                  </span>
                </td>

                <td className="px-4 py-3 border whitespace-nowrap">
                  {viewData.remarks || "-"}
                </td>

                {/* ACTION */}
                <td className="px-4 py-3 border text-center">
                  <div className="flex justify-center gap-2">

                    <button
                      onClick={() => handleEdit(viewData)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded text-xs"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(viewData.testId)}
                      className="bg-red-600 text-white px-3 py-1 rounded text-xs"
                    >
                      Delete
                    </button>

                  </div>
                </td>

              </tr>
            </tbody>

          </table>
        </div>

      </div>
    </div>
  );
}

  /* ================= LIST VIEW ================= */
  if (!selectedProduct) {
    return (
      <div className="p-8 bg-gray-100 rounded-2xl">
        <h2 className="text-2xl font-semibold mb-6">
          Quality Inspection
        </h2>

        <table className="min-w-full bg-white rounded-xl shadow">
          <thead className="bg-purple-100">
            <tr>
              <th className="p-3 border">Product ID</th>
              <th className="p-3 border">Product Name</th>
              <th className="p-3 border">Action</th>
            </tr>
          </thead>

          <tbody>
            {powderData.map((p, i) => (
              <tr key={i}>
                <td className="border p-2">{p["WIP ID"]}</td>
                <td className="border p-2">{p["Product Name"]}</td>

                <td className="border p-2 space-x-2 text-center">
                  <button
                    onClick={() => handleInspect(p)}
                    className="bg-blue-600 text-white px-3 py-1 rounded"
                  >
                    Inspect
                  </button>

                  <button
                    onClick={() => handleView(p)}
                    className="bg-gray-600 text-white px-3 py-1 rounded"
                  >
                    View
                  </button>

                  <button
                    onClick={() => handleMove(p)}
                    className="bg-green-600 text-white px-3 py-1 rounded"
                  >
                    Move
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  /* ================= FORM VIEW ================= */
return (
  <div className="p-8 bg-gray-100 rounded-2xl">
    <h2 className="text-xl font-semibold mb-4">
      Quality Inspection Form
    </h2>

    <div className="bg-white p-6 rounded shadow grid grid-cols-2 gap-4">

      {/* BASIC INFO */}
      <input value={formData.qcId} disabled className="border p-2" />
      <input value={formData.product} disabled className="border p-2" />
      <input value={formData.batch} disabled className="border p-2" />

      {/* INSPECTOR */}
      <input
        placeholder="Inspector"
        value={formData.inspector}
        onChange={(e) => handleChange("inspector", e.target.value)}
        className="border p-2"
      />

      {/* DATE */}
      <input
        type="date"
        value={formData.date}
        onChange={(e) => handleChange("date", e.target.value)}
        className="border p-2"
      />

      {/* SURFACE */}
      <select
        value={formData.surface}
        onChange={(e) => handleChange("surface", e.target.value)}
        className="border p-2"
      >
        <option value="">Select Surface</option>
        <option value="Smooth">Smooth</option>
        <option value="Rough">Rough</option>
      </select>

      {/* SCRATCH */}
      <select
        value={formData.scratch}
        onChange={(e) => handleChange("scratch", e.target.value)}
        className="border p-2"
      >
        <option value="">Select Scratch</option>
        <option value="Yes">Yes</option>
        <option value="No">No</option>
      </select>

      {/* PAINT */}
      <select
        value={formData.paint}
        onChange={(e) => handleChange("paint", e.target.value)}
        className="border p-2"
      >
        <option value="">Select Paint</option>
        <option value="Good">Good</option>
        <option value="Bad">Bad</option>
      </select>

      {/* COLOR */}
      <select
        value={formData.color}
        onChange={(e) => handleChange("color", e.target.value)}
        className="border p-2"
      >
        <option value="">Select Color</option>
        <option value="Correct">Correct</option>
        <option value="Mismatch">Mismatch</option>
      </select>

      {/* ALIGNMENT */}
      <select
        value={formData.alignment}
        onChange={(e) => handleChange("alignment", e.target.value)}
        className="border p-2"
      >
        <option value="">Select Alignment</option>
        <option value="Perfect">Perfect</option>
        <option value="Misaligned">Misaligned</option>
      </select>

      {/* STATUS */}
      <select
        value={formData.status}
        onChange={(e) => handleChange("status", e.target.value)}
        className="border p-2"
      >
        <option value="">Select Status</option>
        <option value="Pass">Pass</option>
        <option value="Fail">Fail</option>
      </select>

      {/* REMARKS */}
      <textarea
        placeholder="Remarks"
        value={formData.remarks}
        onChange={(e) => handleChange("remarks", e.target.value)}
        className="border p-2 col-span-2"
      />

      {/* BUTTONS */}
      <div className="col-span-2 flex gap-4">
        <button
          onClick={handleSave}
          className="bg-green-600 text-white px-5 py-2 rounded"
        >
          Save
        </button>

        <button
          onClick={() => setSelectedProduct(null)}
          className="bg-gray-600 text-white px-5 py-2 rounded"
        >
          Back
        </button>
      </div>

    </div>
  </div>
);
}