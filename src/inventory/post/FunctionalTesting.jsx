import { useState, useEffect } from "react";

export default function FunctionalTesting() {
  const [qcData, setQcData] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [viewData, setViewData] = useState(null);
  const [savedData, setSavedData] = useState([]);

  const [formData, setFormData] = useState({
    testId: "",
    product: "",
    batch: "",
    testedBy: "",
    date: "",
    functionality: "",
    performance: "",
    safety: "",
    result: "",
    remarks: "",
  });

  /* ================= LOAD DATA ================= */
  useEffect(() => {
    const qc =
      JSON.parse(localStorage.getItem("qualityInspection")) || [];

    const ft =
      JSON.parse(localStorage.getItem("functionalTesting")) || [];

    setSavedData(ft);

    // Only PASS products
    const filtered = qc.filter((item) => item.status === "Pass");

    setQcData(filtered);
  }, []);

  /* ================= OPEN FORM ================= */
  const handleTest = (product) => {
    setSelectedProduct(product);

    setFormData({
      testId: `FT${Date.now()}`,
      product: product.product,
      batch: product.batch,
      testedBy: "",
      date: new Date().toISOString().split("T")[0],
      functionality: "",
      performance: "",
      safety: "",
      result: "",
      remarks: "",
    });
  };

  /* ================= VIEW ================= */
  const handleView = (product) => {
    const ft = savedData.find((f) => f.batch === product.batch);

    if (!ft) {
      alert("No Test Data ❌");
      return;
    }

    setViewData(ft);
  };

  /* ================= HANDLE CHANGE ================= */
  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  /* ================= SAVE ================= */
  const handleSave = () => {
    let updated;

    const index = savedData.findIndex(
      (item) => item.testId === formData.testId
    );

    if (index !== -1) {
      updated = [...savedData];
      updated[index] = formData;
    } else {
      updated = [...savedData, formData];
    }

    setSavedData(updated);
    localStorage.setItem("functionalTesting", JSON.stringify(updated));

    alert("Test Saved ✅");
    setSelectedProduct(null);
  };

  /* ================= EDIT ================= */
  const handleEdit = (data) => {
    setSelectedProduct(true);

    setFormData({
      ...data,
    });

    setViewData(null);
  };

  /* ================= DELETE ================= */
  const handleDelete = (id) => {
    const confirmDelete = window.confirm("Delete?");
    if (!confirmDelete) return;

    const updated = savedData.filter((item) => item.testId !== id);

    setSavedData(updated);
    localStorage.setItem("functionalTesting", JSON.stringify(updated));

    alert("Deleted ✅");
    setViewData(null);
  };

 if (viewData) {
  return (
    <div className="p-8 bg-gray-100 rounded-2xl">
      <div className="bg-white p-6 rounded-xl shadow">

        <h2 className="text-2xl font-semibold mb-6">
          Functional Test Details
        </h2>

        <table className="min-w-full border border-gray-300 rounded-lg overflow-hidden">
          
          <thead className="bg-purple-100">
            <tr>
              <th className="p-3 border text-left">Field</th>
              <th className="p-3 border text-left">Value</th>
            </tr>
          </thead>

          <tbody>
            <tr className="hover:bg-gray-50">
              <td className="p-3 border font-medium">Test ID</td>
              <td className="p-3 border">{viewData.testId}</td>
            </tr>

            <tr className="hover:bg-gray-50">
              <td className="p-3 border font-medium">Product</td>
              <td className="p-3 border">{viewData.product}</td>
            </tr>

            <tr className="hover:bg-gray-50">
              <td className="p-3 border font-medium">Batch</td>
              <td className="p-3 border">{viewData.batch}</td>
            </tr>

            <tr className="hover:bg-gray-50">
              <td className="p-3 border font-medium">Tested By</td>
              <td className="p-3 border">{viewData.testedBy}</td>
            </tr>

            <tr className="hover:bg-gray-50">
              <td className="p-3 border font-medium">Date</td>
              <td className="p-3 border">{viewData.date}</td>
            </tr>

            <tr className="hover:bg-gray-50">
              <td className="p-3 border font-medium">Functionality</td>
              <td className="p-3 border">{viewData.functionality}</td>
            </tr>

            <tr className="hover:bg-gray-50">
              <td className="p-3 border font-medium">Performance</td>
              <td className="p-3 border">{viewData.performance}</td>
            </tr>

            <tr className="hover:bg-gray-50">
              <td className="p-3 border font-medium">Safety</td>
              <td className="p-3 border">{viewData.safety}</td>
            </tr>

            <tr className="hover:bg-gray-50">
              <td className="p-3 border font-medium">Result</td>
              <td
                className={`p-3 border font-semibold ${
                  viewData.result === "Pass"
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {viewData.result}
              </td>
            </tr>

            <tr className="hover:bg-gray-50">
              <td className="p-3 border font-medium">Remarks</td>
              <td className="p-3 border">{viewData.remarks}</td>
            </tr>
          </tbody>

        </table>

        {/* BUTTONS */}
        <div className="mt-6 flex gap-3">
          <button
            onClick={() => handleEdit(viewData)}
            className="bg-yellow-500 text-white px-4 py-2 rounded"
          >
            Edit
          </button>

          <button
            onClick={() => handleDelete(viewData.testId)}
            className="bg-red-600 text-white px-4 py-2 rounded"
          >
            Delete
          </button>

          <button
            onClick={() => setViewData(null)}
            className="bg-gray-600 text-white px-4 py-2 rounded"
          >
            Back
          </button>
        </div>

      </div>
    </div>
  );
}

  /* ================= LIST ================= */
  if (!selectedProduct) {
  return (
    <div className="p-8 bg-gray-100 rounded-2xl">
      <h2 className="text-2xl font-semibold mb-6">
        Functional Testing
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
          {qcData.length === 0 ? (
            <tr>
              <td colSpan="3" className="text-center p-4">
                No Data Available
              </td>
            </tr>
          ) : (
            qcData.map((p, i) => (
              <tr key={i}>
                <td className="border p-2">{p.batch}</td>
                <td className="border p-2">{p.product}</td>

                <td className="border p-2 space-x-2 text-center">

                  <button
                    onClick={() => handleTest(p)}
                    className="bg-blue-600 text-white px-3 py-1 rounded"
                  >
                    Test
                  </button>

                  <button
                    onClick={() => handleView(p)}
                    className="bg-gray-600 text-white px-3 py-1 rounded"
                  >
                    View
                  </button>

                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

  /* ================= FORM ================= */
  return (
  <div className="p-8 bg-gray-100 rounded-2xl">
    <div className="bg-white p-6 rounded-xl shadow grid grid-cols-2 gap-4">

      {/* READ ONLY FIELDS */}
      <input value={formData.testId} disabled className="border p-2 rounded" />
      <input value={formData.product} disabled className="border p-2 rounded" />
      <input value={formData.batch} disabled className="border p-2 rounded" />

      {/* TESTED BY */}
      <input
        placeholder="Tested By"
        value={formData.testedBy}
        onChange={(e) => handleChange("testedBy", e.target.value)}
        className="border p-2 rounded"
      />

      {/* DATE */}
      <input
        type="date"
        value={formData.date}
        onChange={(e) => handleChange("date", e.target.value)}
        className="border p-2 rounded"
      />

      {/* FUNCTIONALITY */}
      <select
        value={formData.functionality}
        onChange={(e) => handleChange("functionality", e.target.value)}
        className="border p-2 rounded"
      >
        <option value="">Select Functionality</option>
        <option value="Working">Working</option>
        <option value="Not Working">Not Working</option>
      </select>

      {/* PERFORMANCE */}
      <select
        value={formData.performance}
        onChange={(e) => handleChange("performance", e.target.value)}
        className="border p-2 rounded"
      >
        <option value="">Select Performance</option>
        <option value="Good">Good</option>
        <option value="Poor">Poor</option>
      </select>

      {/* SAFETY */}
      <select
        value={formData.safety}
        onChange={(e) => handleChange("safety", e.target.value)}
        className="border p-2 rounded"
      >
        <option value="">Select Safety</option>
        <option value="Safe">Safe</option>
        <option value="Unsafe">Unsafe</option>
      </select>

      {/* RESULT */}
      <select
        value={formData.result}
        onChange={(e) => handleChange("result", e.target.value)}
        className="border p-2 rounded"
      >
        <option value="">Select Result</option>
        <option value="Pass">Pass</option>
        <option value="Fail">Fail</option>
      </select>

      {/* REMARKS */}
      <textarea
        placeholder="Remarks"
        value={formData.remarks}
        onChange={(e) => handleChange("remarks", e.target.value)}
        className="col-span-2 border p-2 rounded"
      />

      {/* BUTTONS */}
      <div className="col-span-2 flex gap-3">
        <button
          onClick={handleSave}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Save
        </button>

        <button
          onClick={() => setSelectedProduct(null)}
          className="bg-gray-600 text-white px-4 py-2 rounded"
        >
          Back
        </button>
      </div>

    </div>
  </div>
);
}