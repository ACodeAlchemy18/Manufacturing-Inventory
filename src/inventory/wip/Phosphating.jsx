import { useState, useEffect } from "react";

export default function Phosphating() {
  const [savedData, setSavedData] = useState([]);
  const [products, setProducts] = useState([]);
  const [rawMaterials, setRawMaterials] = useState([]);

  const [showForm, setShowForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [formData, setFormData] = useState({});
  const [materialList, setMaterialList] = useState([]);
  const [selectedMaterial, setSelectedMaterial] = useState("");
  const [quantity, setQuantity] = useState("");

  const [isViewing, setIsViewing] = useState(false);
  const [viewData, setViewData] = useState(null);
  const [editIndex, setEditIndex] = useState(null);

  const [showQCForm, setShowQCForm] = useState(false);
  const [qcData, setQcData] = useState({
    qcStatus: "",
    qcCheckedBy: "",
    qcDate: "",
    qcRemarks: "",
  });

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("preAssembling")) || [];
    setSavedData(stored);

    setProducts(stored.filter((p) => p["Process Stage"] === "Phosphating"));
    setRawMaterials(JSON.parse(localStorage.getItem("rawMaterials")) || []);
  }, []);

  /* ================= OPEN FORM ================= */
  const openForm = (product) => {
    setSelectedProduct(product);

    const prevMaterials = product.materials || [];
    const totalOutput = prevMaterials.reduce(
      (sum, m) => sum + (m.outputQty || m.qty || 0),
      0
    );

    setFormData({
      "Phosphating ID": `PH-${Date.now()}`,
      Date: new Date().toISOString().split("T")[0],
      "Product Name": product["Product Name"],
      Quantity: totalOutput,
      "Phosphating Type": "",
      "Current Status": "Pending",
    });

    setMaterialList([]);
    setShowForm(true);
  };

 /* ================= ADD MATERIAL ================= */
const addMaterial = () => {
  if (!selectedMaterial || !quantity) return;

  const qtyToAdd = Number(quantity);

  // 1️⃣ Add to Phosphating material list
  setMaterialList([
    ...materialList,
    {
      material: selectedMaterial,
      qty: qtyToAdd,
      usableQty: 0,
      unusableQty: 0,
      outputQty: qtyToAdd,
    },
  ]);

  // 2️⃣ Reduce quantity from Pre-Assembling
  const updatedSavedData = [...savedData];
  const productIndex = updatedSavedData.findIndex(
    (d) => d["Product ID"] === selectedProduct["Product ID"]
  );

  if (productIndex !== -1) {
    const preMaterials = updatedSavedData[productIndex].materials || [];
    const materialIndex = preMaterials.findIndex(
      (m) => m.material === selectedMaterial
    );

    if (materialIndex !== -1) {
      preMaterials[materialIndex].qty = Math.max(
        0,
        Number(preMaterials[materialIndex].qty || 0) - qtyToAdd
      );
    }

    updatedSavedData[productIndex].materials = preMaterials;
    setSavedData(updatedSavedData);
    localStorage.setItem("preAssembling", JSON.stringify(updatedSavedData));
  }

  // 3️⃣ Reduce quantity from global Raw Materials using the reusable function
  // 3️⃣ Reduce quantity from global Raw Materials
const materialObj = rawMaterials.find(
  (rm) => rm["Material Name"] === selectedMaterial
);

if (materialObj) {
  // Ensure type matches: convert both sides to string
  const materialId = String(materialObj["Material ID"]);

  reduceMaterialQuantity(materialId, qtyToAdd);

  // Refresh state after updating localStorage
  const updatedRawMaterials = JSON.parse(localStorage.getItem("rawMaterials")) || [];
  setRawMaterials(updatedRawMaterials);
}
  // 4️⃣ Reset form inputs
  setSelectedMaterial("");
  setQuantity("");
};




const deleteMaterial = (index) => {
  const removedMaterial = materialList[index];
  const updated = materialList.filter((_, i) => i !== index);
  setMaterialList(updated);

  // Restore quantity back to Pre-Assembling
  const updatedSavedData = [...savedData];
  const productIndex = updatedSavedData.findIndex(
    (d) => d["Product ID"] === selectedProduct["Product ID"]
  );

  if (productIndex !== -1) {
    const preMaterials = updatedSavedData[productIndex].materials || [];
    const materialIndex = preMaterials.findIndex(
      (m) => m.material === removedMaterial.material
    );

    if (materialIndex !== -1) {
      preMaterials[materialIndex].qty += removedMaterial.qty;
    }

    updatedSavedData[productIndex].materials = preMaterials;
    setSavedData(updatedSavedData);
    localStorage.setItem("preAssembling", JSON.stringify(updatedSavedData));
  }
};









  /* ================= SAVE PHOSPHATING ================= */
  const handleSave = () => {
    const updated = [...savedData];
    let index;

    if (editIndex !== null) {
      index = editIndex;
    } else {
      index = updated.findIndex(
        (d) => d["Product ID"] === selectedProduct["Product ID"]
      );
    }

    if (index === -1) return alert("Product not found!");

    const totalOutputQty = materialList.reduce(
      (sum, m) => sum + (m.outputQty ?? m.qty ?? 0),
      0
    );

    updated[index].phosphating = {
      ...formData,
      materials: materialList,
      outputQty: totalOutputQty,
    };

    updated[index]["Output Qty"] = totalOutputQty;
    localStorage.setItem("preAssembling", JSON.stringify(updated));
    setSavedData(updated);
    setEditIndex(null);
    setShowForm(false);

    setProducts(updated.filter((p) => p["Process Stage"] === "Phosphating"));
    alert("Phosphating Data Saved!");
  };

  /* ================= MOVE TO POWDERING ================= */
  const moveToPowdering = (product) => {
    const updated = [...savedData];
    const index = updated.findIndex((d) => d["Product ID"] === product["Product ID"]);
    if (index === -1) return alert("Product not found!");

    const phosphatingData = updated[index].phosphating;

    if (!phosphatingData?.qc) return alert("⚠️ Please complete QC before moving!");
    if ((phosphatingData.qc.qcStatus || "").toLowerCase() !== "approved")
      return alert("❌ Only QC Approved products can move!");

    updated[index]["Process Stage"] = "Powdering";
    updated[index]["Current Status"] = "Pending";

    setSavedData(updated);
    localStorage.setItem("preAssembling", JSON.stringify(updated));
    setProducts(updated.filter((p) => p["Process Stage"] === "Phosphating"));
    alert(`✅ ${product["Product Name"]} moved to Powdering!`);
  };

  /* ================= VIEW ================= */
  const handleView = (product) => {
    const data = savedData.find((d) => d["Product ID"] === product["Product ID"]);
    if (!data) return alert("No data found!");
    setViewData(data);
    setIsViewing(true);
  };

  /* ================= DELETE PHOSPHATING ================= */
  const handleDelete = (index) => {
    const updated = [...savedData];
    delete updated[index].phosphating;
    updated[index]["Process Stage"] = "Phosphating";
    updated[index]["Current Status"] = "Pending";

    setSavedData(updated);
    localStorage.setItem("preAssembling", JSON.stringify(updated));
    setViewData(updated[index]);
    setProducts(updated.filter((p) => p["Process Stage"] === "Phosphating"));
    alert("Deleted successfully!");
  };

  /* ================= EDIT ================= */
  const handleEdit = (data, index) => {
    if (!data.phosphating) return alert("No data to edit!");
    setSelectedProduct(data);
    setEditIndex(index);
    setFormData({ ...data.phosphating });
    setMaterialList(data.phosphating.materials || []);
    setShowForm(true);
    setIsViewing(false);
  };


  /* ================= FORM VIEW ================= */
  if (showForm) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6">

          <h2 className="text-2xl font-semibold text-gray-700 mb-6 border-b pb-3">
            Phosphating Entry
          </h2>

          {/* PRODUCT INFO */}
          <div className="grid grid-cols-2 gap-6 mb-6">

            {/* Phosphating ID */}
            <div>
              <label className="block text-sm text-gray-500 mb-1">
                Phosphating ID
              </label>
              <input
                value={formData["Phosphating ID"]}
                readOnly
                className="w-full border p-2 bg-gray-100 rounded-md"
              />
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm text-gray-500 mb-1">
                Date
              </label>
              <input
                type="date"
                value={formData.Date}
                onChange={(e) =>
                  setFormData({ ...formData, Date: e.target.value })
                }
                className="w-full border p-2 rounded-md"
              />
            </div>

            {/* Product Name */}
            <div>
              <label className="block text-sm text-gray-500 mb-1">
                Product Name
              </label>
              <input
                value={formData["Product Name"]}
                readOnly
                className="w-full border p-2 bg-gray-100 rounded-md"
              />
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-sm text-gray-500 mb-1">
                Quantity
              </label>
              <input
                type="number"
                placeholder="Enter Quantity"
                value={formData.Quantity}
                onChange={(e) =>
                  setFormData({ ...formData, Quantity: e.target.value })
                }
                className="w-full border p-2 rounded-md"
              />
            </div>

            {/* Phosphating Type */}
            <div>
              <label className="block text-sm text-gray-500 mb-1">
                Phosphating Type
              </label>
              <select
                value={formData["Phosphating Type"]}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    "Phosphating Type": e.target.value,
                  })
                }
                className="w-full border p-2 rounded-md"
              >
                <option value="">Select Type</option>
                <option>Zinc Phosphating</option>
                <option>Iron Phosphating</option>
                <option>Other</option>
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm text-gray-500 mb-1">
                Status
              </label>
              <select
                value={formData["Current Status"]}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    "Current Status": e.target.value,
                  })
                }
                className="w-full border p-2 rounded-md"
              >
                <option>Pending</option>
                <option>Approved</option>
                <option>Rejected</option>
              </select>
            </div>

          </div>

          {/* ADD MATERIAL */}
          <div className="mb-6 border rounded-lg p-4 bg-gray-50">
            <h3 className="font-semibold mb-3">Add Material</h3>

            <div className="flex gap-3">
              <select
                value={selectedMaterial}
                onChange={(e) => setSelectedMaterial(e.target.value)}
                className="w-1/2 border p-2 rounded-md"
              >
                <option value="">Select Material</option>
                {rawMaterials.map((rm, i) => (
                  <option key={i}>{rm["Material Name"]}</option>
                ))}
              </select>

              <input
                type="number"
                placeholder="Quantity"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-1/4 border p-2 rounded-md"
              />

              <button
                onClick={addMaterial}
                className="bg-indigo-600 text-white px-4 rounded-md"
              >
                Add
              </button>
            </div>
          </div>

          {/* MATERIAL TABLE */}
          <div className="border rounded-lg overflow-hidden mb-6">
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2">Material</th>
                  <th className="px-4 py-2">Qty</th>
                  <th className="px-4 py-2">Scrap</th>
                  <th className="px-4 py-2">Output</th>
                  <th className="px-4 py-2 text-center">Action</th>
                </tr>
              </thead>

              <tbody>
                {materialList.map((m, i) => (
                  <tr key={i} className="border-t">
                    <td className="px-4 py-2">{m.material}</td>

                    <td className="px-4 py-2">{m.qty}</td>

                    {/* 🔥 SCRAP SECTION */}
                    <td className="px-4 py-2">
                      <div className="flex flex-col gap-2">

                        {/* ✅ Usable Scrap */}
                        <div className="flex gap-2">
                          <input
                            type="number"
                            placeholder="Usable Qty"
                            value={m.usableQty || ""}
                            onChange={(e) => {
                              const updated = [...materialList];
                              updated[i].usableQty = Number(e.target.value) || 0;

                              const usable = updated[i].usableQty || 0;
                              const unusable = Number(updated[i].unusableQty) || 0;
                              const input = updated[i].qty || 0;

                              updated[i].outputQty = Math.max(
                                0,
                                input - (usable + unusable)
                              );

                              setMaterialList(updated);
                            }}
                            className="border p-1 w-24"
                          />

                          <select
                            value={m.usableReason || ""}
                            onChange={(e) => {
                              const updated = [...materialList];
                              updated[i].usableReason = e.target.value;
                              setMaterialList(updated);
                            }}
                            className="border p-1"
                          >
                            <option value="">Reason</option>
                            <option>Rework</option>
                            <option>Chemical Loss</option>
                            <option>Carry Forward</option>
                            <option>Other</option>
                          </select>

                          {m.usableReason === "Other" && (
                            <input
                              type="text"
                              placeholder="Enter reason"
                              value={m.usableCustomReason || ""}
                              onChange={(e) => {
                                const updated = [...materialList];
                                updated[i].usableCustomReason = e.target.value;
                                setMaterialList(updated);
                              }}
                              className="border p-1"
                            />
                          )}
                        </div>

                        {/* ❌ Unusable Scrap */}
                        <div className="flex gap-2">
                          <input
                            type="number"
                            placeholder="Unusable Qty"
                            value={m.unusableQty || ""}
                            onChange={(e) => {
                              const updated = [...materialList];
                              updated[i].unusableQty = Number(e.target.value) || 0;

                              const usable = Number(updated[i].usableQty) || 0;
                              const unusable = updated[i].unusableQty || 0;
                              const input = updated[i].qty || 0;

                              updated[i].outputQty = Math.max(
                                0,
                                input - (usable + unusable)
                              );

                              setMaterialList(updated);
                            }}
                            className="border p-1 w-24"
                          />

                          <select
                            value={m.unusableReason || ""}
                            onChange={(e) => {
                              const updated = [...materialList];
                              updated[i].unusableReason = e.target.value;
                              setMaterialList(updated);
                            }}
                            className="border p-1"
                          >
                            <option value="">Reason</option>
                            <option>Damage</option>
                            <option>Over Treatment</option>
                            <option>Defect</option>
                            <option>Other</option>
                          </select>

                          {m.unusableReason === "Other" && (
                            <input
                              type="text"
                              placeholder="Enter reason"
                              value={m.unusableCustomReason || ""}
                              onChange={(e) => {
                                const updated = [...materialList];
                                updated[i].unusableCustomReason = e.target.value;
                                setMaterialList(updated);
                              }}
                              className="border p-1"
                            />
                          )}
                        </div>

                        {/* ✅ OUTPUT DISPLAY */}
                        <div className="text-xs">
                          <span className="bg-green-100 text-green-700 px-2 py-1 rounded">
                            Output: {m.outputQty ?? m.qty}
                          </span>
                        </div>

                      </div>
                    </td>

                    {/* OUTPUT COLUMN */}
                    <td className="px-4 py-2">
                      {m.outputQty ?? m.qty}
                    </td>

                    <td className="text-center">
                      <button
                        onClick={() => deleteMaterial(i)}
                        className="text-red-500"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}

                {materialList.length === 0 && (
                  <tr>
                    <td colSpan="5" className="text-center py-4 text-gray-400">
                      No materials added
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setShowForm(false)}
              className="px-4 py-2 border rounded-md"
            >
              Cancel
            </button>

            <button
              onClick={handleSave}
              className="bg-emerald-500 text-white px-5 py-2 rounded-md"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    );
  }





  /* ================= Material data TABLE VIEW ================= */

  if (isViewing) {

const index = savedData.findIndex(
  (d) => d["Product ID"] === viewData["Product ID"]
);

    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-6">

          {/* HEADER */}
          <div className="flex justify-between items-center mb-6 border-b pb-3">
            <h2 className="text-2xl font-semibold text-gray-700">
              {viewData["Product Name"]}
            </h2>

            <button
              onClick={() => setIsViewing(false)}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-md transition"
            >
              Back
            </button>
          </div>

          {/* TABLE */}
          <div className="overflow-hidden rounded-lg border">
            <table className="w-full text-sm">

              {/* HEADER */}
              <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
                <tr>
                  <th className="px-4 py-3 text-left">Phosphating ID</th>
                  <th className="px-4 py-3 text-left">Date</th> {/* ✅ ADD THIS */}
                  <th className="px-4 py-3 text-left">Material</th>
                  <th className="px-4 py-3 text-left">Quantity</th>
                  <th className="px-4 py-3 text-left">Scrap</th>
                  <th className="px-4 py-3 text-left">Output</th>
                  <th className="px-4 py-3 text-left">Process</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-center">Action</th>
                </tr>
              </thead>

              {/* BODY */}
              <tbody>
                {viewData.phosphating?.materials?.map((m, i) => (
                  <tr key={i} className="border-t hover:bg-gray-50">

                    {/* ID */}
                    <td className="px-4 py-3 font-medium text-gray-700">
                      {i === 0 ? viewData.phosphating?.["Phosphating ID"] : ""}
                    </td>

                    {/* DATE */}
                    <td className="px-4 py-3 text-gray-600">
                      {i === 0 ? viewData.phosphating?.Date : ""}
                    </td>

                    {/* MATERIAL */}
                    <td className="px-4 py-3 text-gray-700">
                      {m.material}
                    </td>

                    {/* QTY */}
                    <td className="px-4 py-3">
                      <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">
                        {m.qty}
                      </span>
                    </td>

                    {/* SCRAP */}
                    <td className="px-4 py-3">
                      <div className="text-xs">

                        {m.usableQty ? (
                          <div className="text-green-600">
                            Usable: {m.usableQty} (
                            {m.usableReason === "Other"
                              ? m.usableCustomReason
                              : m.usableReason}
                            )
                          </div>
                        ) : null}

                        {m.unusableQty ? (
                          <div className="text-red-600">
                            Unusable: {m.unusableQty} (
                            {m.unusableReason === "Other"
                              ? m.unusableCustomReason
                              : m.unusableReason}
                            )
                          </div>
                        ) : null}

                        {!m.usableQty && !m.unusableQty && (
                          <span className="text-gray-400">No Scrap</span>
                        )}

                      </div>
                    </td>

                    {/* OUTPUT */}
                    <td className="px-4 py-3">
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">
                        {m.outputQty ?? m.qty}
                      </span>
                    </td>



                    {/* PROCESS */}
                    <td className="px-4 py-3 text-gray-600">
                      {i === 0 ? "Phosphating" : ""}
                    </td>

                    {/* STATUS */}
                    <td className="px-4 py-3">
                      {i === 0 && (
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${viewData.phosphating?.["Current Status"] === "Approved"
                            ? "bg-green-100 text-green-700"
                            : viewData.phosphating?.["Current Status"] === "Rejected"
                              ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-700"
                            }`}
                        >
                          {viewData.phosphating?.["Current Status"]}
                        </span>
                      )}
                    </td>

                    {/* ACTION */}
                    <td className="px-4 py-3 text-center">
                      {i === 0 && (
                        <div className="flex justify-center gap-3">

                          <button
                            onClick={() => handleEdit(viewData, index)}
                            className="bg-indigo-600 text-white px-3 py-1.5 rounded-md text-xs"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() => handleDelete(index)}
                            className="bg-red-500 text-white px-3 py-1.5 rounded-md text-xs"
                          >
                            Delete
                          </button>

                          {/* QC BUTTON */}
                          <button
                            onClick={() => setShowQCForm(true)}
                            className="bg-blue-500 text-white px-3 py-1.5 rounded-md text-xs"
                          >
                            QC
                          </button>

                        </div>
                      )}
                    </td>

                  </tr>
                ))}
              </tbody>

            </table>
          </div>

          {/* ================= QC FORM ================= */}
          {showQCForm && (
            <div className="mt-6 border rounded-lg p-4 bg-gray-50">

              <h3 className="text-md font-semibold text-gray-600 mb-3">
                Quality Check (QC)
              </h3>

              <div className="grid grid-cols-2 gap-4">

                <select
                  value={qcData.qcStatus}
                  onChange={(e) =>
                    setQcData({ ...qcData, qcStatus: e.target.value })
                  }
                  className="border p-2"
                >
                  <option value="">Select Status</option>
                  <option>Pending</option>
                  <option>Approved</option>
                  <option>Rejected</option>
                </select>

                <input
                  type="text"
                  placeholder="Checked By"
                  value={qcData.qcCheckedBy}
                  onChange={(e) =>
                    setQcData({ ...qcData, qcCheckedBy: e.target.value })
                  }
                  className="border p-2"
                />

                <input
                  type="date"
                  value={qcData.qcDate}
                  onChange={(e) =>
                    setQcData({ ...qcData, qcDate: e.target.value })
                  }
                  className="border p-2"
                />

                <input
                  type="text"
                  placeholder="Remarks"
                  value={qcData.qcRemarks}
                  onChange={(e) =>
                    setQcData({ ...qcData, qcRemarks: e.target.value })
                  }
                  className="border p-2"
                />

              </div>

              <div className="mt-4 flex gap-3">

                <button
                  onClick={() => {
                    const updated = [...savedData];

                    updated[index].phosphating = {
                      ...updated[index].phosphating,
                      qc: qcData,
                    };

                    setSavedData(updated);
                    localStorage.setItem("preAssembling", JSON.stringify(updated));

                    setViewData(updated[index]);

                    // 🔥 THIS LINE FIXES YOUR ISSUE
                    setProducts(
                      updated.filter((p) => p["Process Stage"] === "Phosphating")
                    );

                    setShowQCForm(false);
                  }}
                  className="bg-green-500 text-white px-4 py-2 rounded"
                >
                  Save QC
                </button>

                <button
                  onClick={() => setShowQCForm(false)}
                  className="border px-4 py-2 rounded"
                >
                  Cancel
                </button>

              </div>

            </div>
          )}

          {/* ================= QC DISPLAY ================= */}
          {viewData.phosphating?.qc && (
            <div className="mt-6">

              <h3 className="text-md font-semibold text-gray-700 mb-3">
                QC Details
              </h3>

              <div className="overflow-hidden border rounded-lg">
                <table className="w-full text-sm">

                  <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
                    <tr>
                      <th className="px-4 py-3 text-left">Status</th>
                      <th className="px-4 py-3 text-left">Checked By</th>
                      <th className="px-4 py-3 text-left">Date</th>
                      <th className="px-4 py-3 text-left">Remarks</th>
                      <th className="px-4 py-3 text-center">Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr className="border-t hover:bg-gray-50">

                      {/* STATUS */}
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${viewData.phosphating.qc.qcStatus === "Approved"
                            ? "bg-green-100 text-green-700"
                            : viewData.phosphating.qc.qcStatus === "Rejected"
                              ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-700"
                            }`}
                        >
                          {viewData.phosphating.qc.qcStatus}
                        </span>
                      </td>

                      {/* CHECKED BY */}
                      <td className="px-4 py-3">
                        {viewData.phosphating.qc.qcCheckedBy}
                      </td>

                      {/* DATE */}
                      <td className="px-4 py-3">
                        {viewData.phosphating.qc.qcDate}
                      </td>

                      {/* REMARKS */}
                      <td className="px-4 py-3">
                        {viewData.phosphating.qc.qcRemarks}
                      </td>

                      {/* ACTION */}
                      <td className="px-4 py-3 text-center">
                        <div className="flex justify-center gap-3">

                          {/* EDIT */}
                          <button
                            onClick={() => {
                              setQcData(viewData.phosphating?.qc || {});
                              setShowQCForm(true);
                            }}
                            className="bg-indigo-500 text-white px-3 py-1.5 rounded-md text-xs"
                          >
                            Edit
                          </button>

                          {/* DELETE */}
                          <button
                            onClick={() => {
                              const updated = [...savedData];

                              delete updated[index].phosphating.qc;

                              setSavedData(updated);
                              localStorage.setItem("preAssembling", JSON.stringify(updated));

                              setViewData(updated[index]);
                            }}
                            className="bg-red-500 text-white px-3 py-1.5 rounded-md text-xs"
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
          )}

        </div>
      </div>
    );
  }



  /* ================= TABLE VIEW ================= */
  return (
  <div className="p-8 bg-gray-100 min-h-screen">
    <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-xl p-6">

      {/* HEADER */}
      <h2 className="text-2xl font-semibold text-gray-700 mb-6">
        Phosphating Products
      </h2>

      {/* TABLE */}
      <div className="overflow-hidden rounded-lg border">
        <table className="w-full text-sm text-left">

          {/* HEADER */}
          <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-6 py-3">Product ID</th>
              <th className="px-6 py-3">Product Name</th>
              <th className="px-6 py-3 text-center">Actions</th>
            </tr>
          </thead>

          {/* BODY */}
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan="3" className="text-center py-6 text-gray-400">
                  No Products Available
                </td>
              </tr>
            ) : (
              products.map((p, i) => (
                <tr
                  key={i}
                  className="border-t hover:bg-gray-50 transition"
                >
                  {/* PRODUCT ID */}
                  <td className="px-6 py-4 font-medium text-gray-700">
                    {p["Product ID"] || i + 1}
                  </td>

                  {/* PRODUCT NAME */}
                  <td className="px-6 py-4 text-gray-600">
                    {p["Product Name"]}
                  </td>

                  {/* ACTIONS */}
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center gap-3">

                      <button
                        onClick={() => openForm(p)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium shadow"
                      >
                        Add Material
                      </button>

                      <button
                        onClick={() => handleView(p)}
                        className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-md text-sm font-medium shadow"
                      >
                        View
                      </button>

                      <button
                        onClick={() => moveToPowdering(p)}
                        disabled={
                          p.phosphating?.qc?.qcStatus?.toLowerCase() !== "approved"
                        }
                        className={`px-4 py-2 rounded-md text-sm font-medium text-white shadow ${
                          p.phosphating?.qc?.qcStatus?.toLowerCase() === "approved"
                            ? "bg-blue-600 hover:bg-blue-700"
                            : "bg-gray-400 cursor-not-allowed"
                        }`}
                      >
                        Move to Powdering
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