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

useEffect(() => {
  const qc =
    JSON.parse(localStorage.getItem("qualityInspection")) || [];

  const ft =
    JSON.parse(localStorage.getItem("functionalTesting")) || [];

  setSavedData(ft);

  // ✅ Only PASS + NOT MOVED products
const filtered = qc.filter(
  (item) =>
    item.status === "Pass" &&
    item.currentStatus !== "Completed"
    // OPTIONAL:
    // && !item.testDone   // 🔥 if you want hide tested items
);

  setQcData(filtered);
}, []);


 const handleTest = (product) => {
  setSelectedProduct(product);

  // 🔍 Check if test already exists for this batch
  const existing = savedData.find(
    (f) => f.batch === product.batch
  );

  setFormData({
    testId: existing ? existing.testId : `FT${Date.now()}`,
    product: product.product,
    batch: product.batch,
     productId: product.productId, // ✅ ADD THIS
    testedBy: existing?.testedBy || "",
    date:
      existing?.date ||
      new Date().toISOString().split("T")[0],
    functionality: existing?.functionality || "",
    performance: existing?.performance || "",
    safety: existing?.safety || "",
    result: existing?.result || "",
    remarks: existing?.remarks || "",
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

const handleSave = () => {
  let updated;

  // 🔥 IMPORTANT FIX
  if (!formData.productId && selectedProduct) {
    formData.productId = selectedProduct.productId;
  }

  const index = savedData.findIndex(
    (item) => item.batch === formData.batch
  );

  if (index !== -1) {
    updated = [...savedData];
    updated[index] = formData;
  } else {
    updated = [...savedData, formData];
  }

  setSavedData(updated);
  localStorage.setItem("functionalTesting", JSON.stringify(updated));

  // 🔥 MARK QC AS TESTED
  const qc =
    JSON.parse(localStorage.getItem("qualityInspection")) || [];

  const updatedQC = qc.map((item) => {
    if (item.batch === formData.batch) {
      return {
        ...item,
        testDone: true,
      };
    }
    return item;
  });

  localStorage.setItem("qualityInspection", JSON.stringify(updatedQC));

  // 🔥 REFRESH TABLE
  const filtered = updatedQC.filter(
    (item) =>
      item.status === "Pass" &&
      item.currentStatus !== "Completed"
  );

  setQcData(filtered);

  alert("Test Saved ✅");
  setSelectedProduct(null);
};

//handleMove
 /* ================= MOVE ================= */
const handleMove = (product) => {
  const ft = savedData.find(
    (f) => f.batch === product.batch
  );

  if (!ft) {
    alert("Functional Testing not done ❌");
    return;
  }

  if (!ft.result) {
    alert("Please complete test result ⚠️");
    return;
  }

  // ================= PASS → PACKAGING =================
  if (ft.result === "Pass") {
    const existingPackaging =
      JSON.parse(localStorage.getItem("packaging")) || [];

    const newPack = {
  packId: `P${Date.now()}`,
  productId: ft.productId,   // ✅ IMPORTANT
  product: ft.product,
  batch: ft.batch,
  status: "Pending",
  date: new Date().toISOString().split("T")[0],
};

    localStorage.setItem(
      "packaging",
      JSON.stringify([...existingPackaging, newPack])
    );

     // 🔥 UPDATE PRODUCT MASTER
  updateProductStage(ft.productId, "Packaging");
    alert("Moved to Packaging 📦");
  }

  // ================= FAIL → REWORK =================
  else if (ft.result === "Fail") {
  const existingRework =
    JSON.parse(localStorage.getItem("rework")) || [];

  const reworkItem = {
    reworkId: `R${Date.now()}`,
    product: ft.product,
    batch: ft.batch,
    reason: ft.remarks || "Functional Test Failed",
    status: "Pending",
    date: new Date().toISOString().split("T")[0],
    source: "Functional Testing", // 🔥 FIX
  };

  localStorage.setItem(
    "rework",
    JSON.stringify([...existingRework, reworkItem])
  );

  // 🔥 UPDATE PRODUCT MASTER
  updateProductStage(ft.productId, "Rework");
  
  alert("Moved to Rework 🔧");
}

  // 🔥 IMPORTANT: MARK QC AS COMPLETED
  const qcData =
    JSON.parse(localStorage.getItem("qualityInspection")) || [];

  const updatedQC = qcData.map((item) => {
    if (item.batch === product.batch) {
      return {
        ...item,
        currentStatus: "Completed",
      };
    }
    return item;
  });

  localStorage.setItem("qualityInspection", JSON.stringify(updatedQC));

  // ================= REMOVE FROM FUNCTIONAL TESTING =================
  const updated = savedData.map((item) => {
  if (item.batch === product.batch) {
    return {
      ...item,
      status: "Completed", // ✅ mark completed
    };
  }
  return item;
});

setSavedData(updated);
localStorage.setItem("functionalTesting", JSON.stringify(updated));
  // ================= UPDATE UI =================
  setQcData((prev) =>
    prev.filter((p) => p.batch !== product.batch)
  );
};



//updateproduct stage
const updateProductStage = (productId, newStage) => {
  const products =
    JSON.parse(localStorage.getItem("products")) || [];

  const updated = products.map((p) =>
    p.productId === productId
      ? { ...p, stage: newStage }
      : p
  );

  localStorage.setItem("products", JSON.stringify(updated));
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

  // remove from savedData
  const updated = savedData.filter((item) => item.testId !== id);

  setSavedData(updated);
  localStorage.setItem("functionalTesting", JSON.stringify(updated));

  // 🔥 ALSO refresh qcData (table data)
  const qc =
    JSON.parse(localStorage.getItem("qualityInspection")) || [];

  const filtered = qc.filter(
    (item) =>
      item.status === "Pass" &&
      item.currentStatus !== "Completed"
  );

  setQcData(filtered);

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
          Functional Testing - {viewData.product}
        </h2>

        <button
          onClick={() => setViewData(null)}
          className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded"
        >
          Back
        </button>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto border rounded-lg">
        <table className="min-w-[1200px] w-full text-sm">

          {/* HEADER */}
          <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-4 py-3">Test ID</th>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Batch</th>
              <th className="px-4 py-3">Tested By</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Functionality</th>
              <th className="px-4 py-3">Performance</th>
              <th className="px-4 py-3">Safety</th>
              <th className="px-4 py-3">Result</th>
              <th className="px-4 py-3">Remarks</th>
              <th className="px-4 py-3 text-center">Action</th>
            </tr>
          </thead>

          {/* BODY */}
          <tbody>
            <tr className="border-t hover:bg-gray-50">

              <td className="px-4 py-3">{viewData.testId}</td>
              <td className="px-4 py-3">{viewData.product}</td>
              <td className="px-4 py-3">{viewData.batch}</td>
              <td className="px-4 py-3">{viewData.testedBy || "-"}</td>
              <td className="px-4 py-3">{viewData.date || "-"}</td>
              <td className="px-4 py-3">{viewData.functionality || "-"}</td>
              <td className="px-4 py-3">{viewData.performance || "-"}</td>
              <td className="px-4 py-3">{viewData.safety || "-"}</td>

              {/* RESULT BADGE */}
              <td className="px-4 py-3">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    viewData.result === "Pass"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {viewData.result || "-"}
                </span>
              </td>

              <td className="px-4 py-3">
                {viewData.remarks || "-"}
              </td>

              {/* ACTION */}
              <td className="px-4 py-3 text-center">
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

  /* ================= LIST ================= */
  if (!selectedProduct) {
  return (
  <div className="p-8 bg-gray-100 min-h-screen">
    <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-xl p-6">

      {/* HEADER */}
      <h2 className="text-2xl font-semibold text-gray-700 mb-6">
        Functional Testing
      </h2>

      {/* TABLE */}
      <div className="overflow-hidden rounded-lg border">
        <table className="w-full text-sm text-left">

          {/* HEADER */}
          <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-4 py-3">Product ID</th>
              <th className="px-4 py-3">Product Name</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>

          {/* BODY */}
          <tbody>
            {qcData.length === 0 ? (
              <tr>
                <td colSpan="3" className="text-center py-6 text-gray-400">
                  No Products Available
                </td>
              </tr>
            ) : (
              qcData.map((p, i) => (
                <tr
                  key={i}
                  className="border-t hover:bg-gray-50 transition"
                >
                  {/* PRODUCT ID */}
                  <td className="px-6 py-4 font-medium text-gray-700">
                    {p.batch}
                  </td>

                  {/* PRODUCT NAME */}
                  <td className="px-6 py-4 text-gray-600">
                    {p.product}
                  </td>

                  {/* ACTIONS */}
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center gap-3">

                      <button
                        onClick={() => handleTest(p)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium shadow"
                      >
                        Test
                      </button>

                      <button
                        onClick={() => handleView(p)}
                        className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium shadow"
                      >
                        View
                      </button>

                      <button
                        onClick={() => handleMove(p)}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium shadow"
                      >
                        Move
                      </button>

                    </div>
                  </td>

                </tr>
              ))
            )}
          </tbody>

        </table>
      </div>
    </div>
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