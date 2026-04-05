import { useState, useEffect } from "react";

export default function PreAssembling() {
  const [isEditing, setIsEditing] = useState(false);
  const [isViewing, setIsViewing] = useState(false);

  const [savedData, setSavedData] = useState([]);
  const [products, setProducts] = useState([]);
  const [rawMaterials, setRawMaterials] = useState([]);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [viewData, setViewData] = useState(null);

  const [formData, setFormData] = useState({});
  const [materialList, setMaterialList] = useState([]);

  const [selectedMaterial, setSelectedMaterial] = useState("");
  const [quantity, setQuantity] = useState("");

  const [editIndex, setEditIndex] = useState(null);
  const [showQCForm, setShowQCForm] = useState(false);

  const [qcData, setQcData] = useState({
    qcStatus: "",
    qcCheckedBy: "",
    qcDate: "",
    qcRemarks: "",
  });

  // ✅ Load data from localStorage
  useEffect(() => {
    setSavedData(JSON.parse(localStorage.getItem("preAssembling")) || []);
    setProducts(JSON.parse(localStorage.getItem("products")) || []);
    setRawMaterials(JSON.parse(localStorage.getItem("rawMaterials")) || []);
  }, []);

  // ================= OPEN FORM =================
  const openForm = (product) => {
    setSelectedProduct(product);
    setIsEditing(true);
    setIsViewing(false);

    setFormData({
      "WIP ID": Date.now(),
      "Product Name": product.productName,
      "Product ID": String(product.productId),
      "Process Stage": "Pre-Assembling",
      "Current Status": "",
    });
    setMaterialList([]);
    setEditIndex(null);
  };

  // ================= ADD MATERIAL =================
  const addMaterial = () => {
    if (!selectedMaterial || !quantity) return;

    setMaterialList([
      ...materialList,
      {
        material: selectedMaterial,
        qty: Number(quantity),
        usableQty: 0,
        usableReason: "",
        usableCustomReason: "",
        unusableQty: 0,
        unusableReason: "",
        unusableCustomReason: "",
        outputQty: Number(quantity),
      },
    ]);
    setSelectedMaterial("");
    setQuantity("");
  };

  // ================= DELETE MATERIAL =================
  const deleteMaterial = (i) => {
    setMaterialList(materialList.filter((_, index) => index !== i));
  };

  // ================= SAVE NEW ENTRY =================
  const handleSave = () => {
    if (materialList.length === 0) {
      alert("Please add at least one material!");
      return;
    }

    const newEntry = {
      ...formData,
      "Product ID": String(formData["Product ID"]),
      materials: materialList,
    };

    const filtered = savedData.filter(
      (d) => String(d["Product ID"]) !== String(formData["Product ID"])
    );

    const updated = [...filtered, newEntry];

    setSavedData(updated);
    localStorage.setItem("preAssembling", JSON.stringify(updated));
    setIsEditing(false);
  };

  // ================= VIEW PRODUCT =================
  const handleView = (product) => {
    const found = savedData.find(
      (d) => String(d["Product ID"]) === String(product.productId)
    );

    if (!found) {
      alert("No data found!");
      return;
    }

    setViewData(found);
    setSelectedProduct(product);
    setIsViewing(true);
  };

  // ================= DELETE PRODUCT =================
  const handleDelete = (index) => {
    const updated = savedData.filter((_, i) => i !== index);
    setSavedData(updated);
    localStorage.setItem("preAssembling", JSON.stringify(updated));
    setIsViewing(false);
  };

  // ================= EDIT PRODUCT =================
  const handleEdit = (data, index) => {
    setIsViewing(false);
    setIsEditing(true);

    setFormData(data);
    setMaterialList(
      (data.materials || []).map((m) => ({
        ...m,
        usableQty: m.usableQty || 0,
        unusableQty: m.unusableQty || 0,
        outputQty: m.outputQty ?? m.qty,
      }))
    );
    setEditIndex(index);
  };

  // ================= UPDATE PRODUCT =================
  const handleUpdate = () => {
    if (editIndex === null) return;

    const updated = [...savedData];
    updated[editIndex] = { ...formData, materials: materialList };

    setSavedData(updated);
    localStorage.setItem("preAssembling", JSON.stringify(updated));
    setIsEditing(false);
  };

  // ================= MOVE TO PHOSPHATING =================
  const moveToPhosphating = (product) => {
    const index = savedData.findIndex(
      (d) => String(d["Product ID"]) === String(product.productId)
    );
    if (index === -1) return;

    const updated = [...savedData];
    updated[index]["Process Stage"] = "Phosphating";
    updated[index]["Current Status"] = "Pending";
    setSavedData(updated);
    localStorage.setItem("preAssembling", JSON.stringify(updated));

    alert(`${product.productName} moved to Phosphating!`);
  };

  // ================= RENDER =================
  if (isViewing && viewData) {
    const index = savedData.findIndex(
      (d) => String(d["Product ID"]) === String(viewData["Product ID"])
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
                  <th className="px-4 py-3 text-left">WIP ID</th>
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
                {viewData.materials.map((m, i) => (
                  <tr key={i} className="border-t hover:bg-gray-50">

                    <td className="px-4 py-3 font-medium text-gray-700">
                      {i === 0 ? viewData["WIP ID"] : ""}
                    </td>

                    <td className="px-4 py-3 text-gray-700">
                      {m.material}
                    </td>

                    <td className="px-4 py-3">
                      <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">
                        {m.qty}
                      </span>
                    </td>

                    {/* SCRAP */}
                    <td className="px-4 py-3">
                      <div className="text-xs">
                        {m.usableQty && (
                          <div className="text-green-600">
                            Usable: {m.usableQty} (
                            {m.usableReason === "Other"
                              ? m.usableCustomReason
                              : m.usableReason}
                            )
                          </div>
                        )}

                        {m.unusableQty && (
                          <div className="text-red-600">
                            Unusable: {m.unusableQty} (
                            {m.unusableReason === "Other"
                              ? m.unusableCustomReason
                              : m.unusableReason}
                            )
                          </div>
                        )}

                        {!m.usableQty && !m.unusableQty && (
                          <span className="text-gray-400">No Scrap</span>
                        )}
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">
                        {m.outputQty ?? m.qty}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-gray-600">
                      {i === 0 ? viewData["Process Stage"] : ""}
                    </td>

                    <td className="px-4 py-3">
                      {i === 0 && (
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${viewData["Current Status"] === "Completed"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                            }`}
                        >
                          {viewData["Current Status"]}
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

          {/* ✅ QC FORM */}
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

                    updated[index] = {
                      ...viewData,
                      qc: qcData,
                    };

                    setSavedData(updated);
                    localStorage.setItem("preAssembling", JSON.stringify(updated));

                    setViewData(updated[index]);
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

          {/* ✅ QC DATA DISPLAY */}
          {viewData.qc && (
            <div className="mt-6">

              <h3 className="text-md font-semibold text-gray-700 mb-3">
                QC Details
              </h3>

              <div className="overflow-hidden border rounded-lg">
                <table className="w-full text-sm">

                  {/* HEADER */}
                  <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
                    <tr>
                      <th className="px-4 py-3 text-left">Status</th>
                      <th className="px-4 py-3 text-left">Checked By</th>
                      <th className="px-4 py-3 text-left">Date</th>
                      <th className="px-4 py-3 text-left">Remarks</th>
                      <th className="px-4 py-3 text-center">Action</th>
                    </tr>
                  </thead>

                  {/* BODY */}
                  <tbody>
                    <tr className="border-t hover:bg-gray-50">

                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${viewData.qc.qcStatus === "Approved"
                          ? "bg-green-100 text-green-700"
                          : viewData.qc.qcStatus === "Rejected"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                          }`}>
                          {viewData.qc.qcStatus}
                        </span>
                      </td>

                      <td className="px-4 py-3">
                        {viewData.qc.qcCheckedBy}
                      </td>

                      <td className="px-4 py-3">
                        {viewData.qc.qcDate}
                      </td>

                      <td className="px-4 py-3">
                        {viewData.qc.qcRemarks}
                      </td>

                      {/* ACTION */}
                      <td className="px-4 py-3 text-center">
                        <div className="flex justify-center gap-3">

                          {/* EDIT */}
                          <button
                            onClick={() => {
                              setQcData(viewData.qc);
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
                              delete updated[index].qc;

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

  /* ================= PRODUCT LIST ================= */
  if (!isEditing) {
    return (
      <div className="p-8 bg-gray-100 min-h-screen">
        <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-xl p-6">

          <h2 className="text-2xl font-semibold text-gray-700 mb-6">
            Pre-Assembling Products
          </h2>

          <div className="overflow-hidden rounded-lg border">
            <table className="w-full text-sm text-left">

              <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
                <tr>
                  <th className="px-4 py-3">Product ID</th>
                  <th className="px-4 py-3">Product Name</th>
                  <th className="px-4 py-3 text-center">Actions</th>
                </tr>
              </thead>

              <tbody>
                {products
                  .filter(p => {
                    const saved = savedData.find(
                      (sd) => sd["Product ID"] === p.productId
                    );
                    // ✅ Show product ONLY if:
                    // 1. No entry exists (new product)
                    // 2. OR still in Pre-Assembling stage

                    return (
                      !saved ||
                      saved["Process Stage"] === "Pre-Assembling" ||
                      saved["Process Stage"] === ""
                    );
                  })
                  .map((p, i) => {
                    const saved = savedData.find(
                      (sd) => sd["Product ID"] === p.productId
                    );

                    return (
                      <tr key={i} className="border-t hover:bg-gray-50 transition">
                        <td className="px-6 py-4 font-medium text-gray-700">{p.productId}</td>
                        <td className="px-6 py-4 text-gray-600">{p.productName}</td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex justify-center gap-3">

                            <button
                              onClick={() => openForm(p)}
                              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium shadow"
                            >
                              Add Material
                            </button>

                            <button
                              onClick={() => {
                                if (saved) handleView(p);
                                else alert("No data available for this product yet.");
                              }}
                              className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-md text-sm font-medium shadow"
                            >
                              View
                            </button>

                            <button
                              onClick={() => {
                                if (!saved) {
                                  alert("Cannot move. No material data found yet.");
                                } else if (saved?.qc?.qcStatus !== "Approved") {
                                  alert("Cannot move. QC not approved yet.");
                                } else {
                                  moveToPhosphating(p); // ✅ only this needed
                                }
                              }}
                              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium shadow"
                            >
                              Move to Phosphating
                            </button>

                          </div>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  /* ================= FORM ================= */
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6">

        {/* HEADER */}
        <h2 className="text-2xl font-semibold text-gray-700 mb-6 border-b pb-3">
          Add Raw Material
        </h2>

        {/* PRODUCT INFO */}
        <div className="grid grid-cols-2 gap-6 mb-6">

          <div>
            <label className="block text-sm text-gray-500 mb-1">
              Product Name
            </label>
            <input
              value={selectedProduct?.productName}
              readOnly
              className="w-full border rounded-md p-2 bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-500 mb-1">
              WIP ID
            </label>
            <input
              value={formData["WIP ID"]}
              readOnly
              className="w-full border rounded-md p-2 bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-500 mb-1">
              Process Stage
            </label>
            <select
              onChange={(e) =>
                setFormData({
                  ...formData,
                  "Process Stage": e.target.value,
                })
              }
              className="w-full border rounded-md p-2"
            >
              <option value="">Select Process</option>
              <option>Pre-Assembling</option>
              <option>Phosphating</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-500 mb-1">
              Status
            </label>
            <select
              onChange={(e) =>
                setFormData({
                  ...formData,
                  "Current Status": e.target.value,
                })
              }
              className="w-full border rounded-md p-2"
            >
              <option value="">Select Status</option>
              <option>Pending</option>
              <option>Completed</option>
            </select>
          </div>
        </div>

        {/* ADD MATERIAL SECTION */}
        <div className="mb-6 border rounded-lg p-4 bg-gray-50">
          <h3 className="text-md font-semibold text-gray-600 mb-3">
            Add Material
          </h3>

          <div className="flex gap-3">
            <select
              value={selectedMaterial}
              onChange={(e) => setSelectedMaterial(e.target.value)}
              className="w-1/2 border rounded-md p-2"
            >
              <option value="">Select Material</option>
              {rawMaterials.map((rm, i) => (
                <option key={i}>
                  {rm["Material Name"]}
                </option>
              ))}
            </select>

            <input
              type="number"
              placeholder="Quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-1/4 border rounded-md p-2"
            />

            <button
              onClick={addMaterial}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 rounded-md"
            >
              Add
            </button>

          </div>

        </div>


        {/* MATERIAL TABLE */}
        <div className="mb-6">
          <h3 className="text-md font-semibold text-gray-600 mb-2">
            Material List
          </h3>

          <div className="overflow-hidden rounded-lg border">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 text-gray-600">
                <tr>
                  <th className="px-4 py-2 text-left">Material</th>
                  <th className="px-4 py-2 text-left">Quantity</th>
                  <th className="px-4 py-2 text-left">Scrap</th>
                  <th className="px-4 py-2 text-left">Output Qty</th>
                  <th className="px-4 py-2 text-center">Action</th>
                </tr>
              </thead>

              <tbody>
                {materialList.map((m, i) => (
                  <tr key={i} className="border-t">

                    <td className="px-4 py-2">
                      {m.material}
                    </td>

                    <td className="px-4 py-2">
                      {m.qty}
                    </td>

                    {/* SCRAP INPUT PER MATERIAL */}
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

                              // ✅ AUTO OUTPUT CALCULATION + VALIDATION
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

                              // ✅ ONLY reason update (FIXED BUG)
                              updated[i].usableReason = e.target.value;

                              setMaterialList(updated);
                            }}
                            className="border p-1"
                          >
                            <option value="">Reason</option>
                            <option>Cut Piece</option>
                            <option>Extra Material</option>
                            <option>Rework</option>
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

                              // ✅ AUTO OUTPUT CALCULATION + VALIDATION
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

                              // ✅ ONLY reason update (FIXED BUG)
                              updated[i].unusableReason = e.target.value;

                              setMaterialList(updated);
                            }}
                            className="border p-1"
                          >
                            <option value="">Reason</option>
                            <option>Damage</option>
                            <option>Burnt</option>
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

                    <td className="px-4 py-2 text-center">
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
                    <td
                      colSpan="3"
                      className="text-center py-4 text-gray-400"
                    >
                      No materials added
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex justify-end gap-3">
          <button
            onClick={() => setIsEditing(false)}
            className="px-4 py-2 rounded-md border text-gray-600"
          >
            Cancel
          </button>

          <button
            onClick={editIndex !== null ? handleUpdate : handleSave}
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2 rounded-md"
          >
            {editIndex !== null ? "Update" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}