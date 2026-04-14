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
    const pre =
      JSON.parse(localStorage.getItem("preAssembling")) || [];

    const qc =
      JSON.parse(localStorage.getItem("qualityInspection")) || [];

    setSavedData(qc);

    // ✅ Final Assembly products
 const finalAssembly = pre.filter(
  (item) =>
    item["Process Stage"] === "Quality Inspection" &&
    item["Current Status"] === "Pending"
);

    // ✅ Rework products (VERY IMPORTANT 🔥)
    const reworkProducts = qc
      .filter((item) => item.source === "Rework")
      .map((item) => ({
        "WIP ID": item.batch,
        "Product Name": item.product,
        source: "Rework",
      }));

    // ✅ Merge both
    setPowderData([...finalAssembly, ...reworkProducts]);
  }, []);

  /* ================= OPEN FORM ================= */
  const handleInspect = (product) => {
    setSelectedProduct(product);

    setFormData({
      qcId: `QC${Date.now()}`,
      product: product["Product Name"],
      batch: product["WIP ID"],
       productId: product["Product ID"], // ✅ ADD THIS
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
    // 🔍 Find QC data
    const qc = savedData.find(
      (q) => q.batch === product["WIP ID"]
    );

    // ❌ QC not done
    if (!qc) {
      alert("QC not done yet ❌");
      return;
    }

    // ❌ Status not selected
    if (!qc.status) {
      alert("Please complete QC status ⚠️");
      return;
    }

    // ================= PASS → FUNCTIONAL TESTING =================
    if (qc.status === "Pass") {
      const existingFT =
        JSON.parse(localStorage.getItem("functionalTesting")) || [];

      const newTest = {
        testId: `T${Date.now()}`,
        product: qc.product,
        batch: qc.batch,
        functionality: "",
        performance: "",
        safety: "",
        result: "",
        testedBy: "",
        date: "",
        remarks: "",
      };

      localStorage.setItem(
        "functionalTesting",
        JSON.stringify([...existingFT, newTest])
      );

      // 🔥 UPDATE STAGE
 updateProductStage(qc.productId, "Functional Testing");


      alert("Moved to Functional Testing ✅");
    }

    // ================= FAIL → REWORK =================
    else if (qc.status === "Fail") {
      const existingRework =
        JSON.parse(localStorage.getItem("rework")) || [];

      const reworkItem = {
        reworkId: `R${Date.now()}`,
        product: qc.product,
        batch: qc.batch,
        reason: qc.remarks || "QC Failed",
        status: "Pending",
        date: new Date().toISOString().split("T")[0],
      };

      localStorage.setItem(
        "rework",
        JSON.stringify([...existingRework, reworkItem])
      );
      // 🔥 UPDATE STAGE
 updateProductStage(qc.productId, "Rework");


      alert("Moved to Rework 🔧");
    }

    // ================= REMOVE FROM QC LIST =================
    // ================= REMOVE FROM QC LIST =================
// only update preAssembling if product exists there
const allProducts =
  JSON.parse(localStorage.getItem("preAssembling")) || [];

const existsInPre = allProducts.find(
  (item) => item["WIP ID"] === product["WIP ID"]
);

if (existsInPre) {
  const updatedProducts = allProducts.map((item) => {
    if (item["WIP ID"] === product["WIP ID"]) {
      return {
        ...item,
        "Current Status": "Completed",
      };
    }
    return item;
  });

  localStorage.setItem(
    "preAssembling",
    JSON.stringify(updatedProducts)
  );
}

    // ================= REFRESH UI PROPERLY =================
const refreshed =
  JSON.parse(localStorage.getItem("preAssembling")) || [];

const filtered = refreshed.filter(
  (item) =>
    item["Process Stage"] === "Quality Inspection" &&
    item["Current Status"] === "Pending"
);

setPowderData(filtered);
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

  /* ================= HANDLE CHANGE ================= */
  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  /* ================= SAVE ================= */
 const handleSave = () => {
  let updated;

  // 🔥 ensure productId exists
  if (!formData.productId && selectedProduct) {
    formData.productId = selectedProduct["Product ID"];
  }

  const index = savedData.findIndex(
    (item) => item.qcId === formData.qcId
  );

  if (index !== -1) {
    updated = [...savedData];
    updated[index] = formData;
  } else {
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
              Quality Inspection - {viewData.product}
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
                  <th className="px-4 py-3">QC ID</th>
                  <th className="px-4 py-3">Product</th>
                  <th className="px-4 py-3">Batch</th>
                  <th className="px-4 py-3">Inspector</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Surface</th>
                  <th className="px-4 py-3">Scratch</th>
                  <th className="px-4 py-3">Paint</th>
                  <th className="px-4 py-3">Color</th>
                  <th className="px-4 py-3">Alignment</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Remarks</th>
                  <th className="px-4 py-3 text-center">Action</th>
                </tr>
              </thead>

              {/* BODY */}
              <tbody>
                <tr className="border-t hover:bg-gray-50">

                  <td className="px-4 py-3">{viewData.qcId}</td>
                  <td className="px-4 py-3">{viewData.product}</td>
                  <td className="px-4 py-3">{viewData.batch}</td>
                  <td className="px-4 py-3">{viewData.inspector}</td>
                  <td className="px-4 py-3">{viewData.date}</td>

                  <td className="px-4 py-3">{viewData.surface}</td>
                  <td className="px-4 py-3">{viewData.scratch}</td>
                  <td className="px-4 py-3">{viewData.paint}</td>
                  <td className="px-4 py-3">{viewData.color}</td>
                  <td className="px-4 py-3">{viewData.alignment}</td>

                  {/* STATUS BADGE */}
                  <td className="px-4 py-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${viewData.status === "Pass"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                        }`}
                    >
                      {viewData.status}
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
                        onClick={() => handleDelete(viewData.qcId)}
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
  <div className="p-8 bg-gray-100 min-h-screen">
    <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-xl p-6">

      {/* HEADER */}
      <h2 className="text-2xl font-semibold text-gray-700 mb-6">
        Quality Inspection
      </h2>

      {/* TABLE */}
      <div className="overflow-hidden rounded-lg border">
        <table className="w-full text-sm text-left">

          {/* HEADER */}
          <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-6 py-3">WIP ID</th>
              <th className="px-6 py-3">Product Name</th>
              <th className="px-6 py-3">Source</th>
              <th className="px-6 py-3 text-center">Actions</th>
            </tr>
          </thead>

          {/* BODY */}
          <tbody>
            {powderData.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-6 text-gray-400">
                  No Products Available
                </td>
              </tr>
            ) : (
              powderData.map((p, i) => (
                <tr
                  key={i}
                  className="border-t hover:bg-gray-50 transition"
                >
                  {/* WIP ID */}
                  <td className="px-6 py-4 font-medium text-gray-700">
                    {p["WIP ID"]}
                  </td>

                  {/* PRODUCT NAME */}
                  <td className="px-6 py-4 text-gray-600">
                    {p["Product Name"]}
                  </td>

                  {/* SOURCE */}
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      p.source === "Rework"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-blue-100 text-blue-700"
                    }`}>
                      {p.source === "Rework" ? "Rework" : "Final Assembly"}
                    </span>
                  </td>

                  {/* ACTIONS */}
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center gap-3">

                      <button
                        onClick={() => handleInspect(p)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium shadow"
                      >
                        Inspect
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