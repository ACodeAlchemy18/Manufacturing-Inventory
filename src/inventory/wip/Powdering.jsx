import { useState, useEffect } from "react";

export default function Powdering() {
  const [savedData, setSavedData] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isViewing, setIsViewing] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [viewData, setViewData] = useState(null);
  const [formData, setFormData] = useState({});






  /* ================= LOAD DATA FUNCTION ================= */
  const loadData = () => {
    const data = JSON.parse(localStorage.getItem("preAssembling")) || [];
    const filtered = data.filter(
      (p) => p["Process Stage"]?.trim().toLowerCase() === "powdering"
    );
    setSavedData(filtered);
  };

  /* ================= INITIAL LOAD ================= */
  useEffect(() => {
    loadData();
  }, []);

  /* ================= OPEN FORM ================= */
  const openForm = (product) => {
    setSelectedProduct(product);

    setFormData({
      productName: product["Product Name"],
      wipId: product["WIP ID"],
      powderingId: product["WIP ID"], // Add this line
      date: new Date().toISOString().split("T")[0],
      incomingQty: Number(
        product?.phosphating?.finishedQty ??
        product?.phosphating?.outputQty ??
        product?.["Output Qty"] ??
        0
      ),
      powderType: "",
      colorCode: "",
      coatingThickness: "",
      ovenTemperature: "",
      curingTime: "",
      powderUsedQty: "",

      // Scrap
      usableQty: 0,
      usableReason: "",
      usableCustomReason: "",
      unusableQty: 0,
      unusableReason: "",
      unusableCustomReason: "",
      finishedQty: product?.["Output Qty"] || 0,
      status: "Pending QC",
    });

    setIsEditing(true);
    setIsViewing(false);
  };


  const [showQCForm, setShowQCForm] = useState(false);
  const [qcData, setQcData] = useState({
    qcStatus: "",
    qcCheckedBy: "",
    qcDate: "",
    qcRemarks: "",
  });

  /* ================= SAVE ================= */
  const handleSave = () => {
    const data = JSON.parse(localStorage.getItem("preAssembling")) || [];
    const index = data.findIndex((d) => d["WIP ID"] === formData.wipId);
    if (index === -1) return;

    // Add a proper Powdering ID
    const powderingData = {
      ...formData,
      powderingId: formData.wipId, // rename WIP ID as Powdering ID
    };

    data[index].powdering = powderingData;
    localStorage.setItem("preAssembling", JSON.stringify(data));
    alert("Saved Successfully");

    setIsEditing(false);
    loadData();
  };

  /* ================= VIEW ================= */
  const handleView = (product) => {
    setViewData(product);
    setSelectedProduct(product);
    setIsViewing(true);
  };

  /* ================= MOVE NEXT ================= */
 const moveToNextStage = (product) => {
  const data = JSON.parse(localStorage.getItem("preAssembling")) || [];
  const index = data.findIndex((d) => d["WIP ID"] === product["WIP ID"]);
  if (index === -1) return;

  // QC check
  if (!product?.powdering?.qc || product.powdering.qc.qcStatus !== "Approved") {
    alert("QC not approved yet.");
    return;
  }

  // ✅ Update internal process
  data[index]["Process Stage"] = "Quality Inspection";
  data[index]["Current Status"] = "Pending";

  localStorage.setItem("preAssembling", JSON.stringify(data));

  // ✅ IMPORTANT: Update Product Master
  updateProductStage(product["Product ID"], "Quality Inspection");

  alert(`${product["Product Name"]} moved to Quality Inspection`);

  loadData();
};


//update
  const updateProductStage = (productId, newStage) => {
  const products = JSON.parse(localStorage.getItem("products")) || [];

  const updatedProducts = products.map((p) =>
    p.productId === productId
      ? { ...p, stage: newStage }
      : p
  );

  localStorage.setItem("products", JSON.stringify(updatedProducts));
};


  //edit
  const handleEdit = (product) => {
    setSelectedProduct(product);

    // Merge existing powdering data with defaults
    const existing = product.powdering || {}; // fallback if powdering doesn't exist yet

    setFormData({
      productName: product["Product Name"],
      wipId: product["WIP ID"],
      powderingId: product["WIP ID"],
      date: existing.date || new Date().toISOString().split("T")[0],
      incomingQty:
        existing.incomingQty ??
        Number(product?.phosphating?.finishedQty ?? product?.phosphating?.outputQty ?? product?.["Output Qty"] ?? 0),
      powderType: existing.powderType || "",
      colorCode: existing.colorCode || "",
      coatingThickness: existing.coatingThickness || "",
      ovenTemperature: existing.ovenTemperature || "",
      curingTime: existing.curingTime || "",
      powderUsedQty: existing.powderUsedQty || "",
      usableQty: existing.usableQty || 0,
      usableReason: existing.usableReason || "",
      usableCustomReason: existing.usableCustomReason || "",
      unusableQty: existing.unusableQty || 0,
      unusableReason: existing.unusableReason || "",
      unusableCustomReason: existing.unusableCustomReason || "",
      finishedQty: existing.finishedQty || product?.["Output Qty"] || 0,
      status: existing.status || "Pending QC",
    });

    setIsEditing(true);
    setIsViewing(false);
  };

  //d
  const handleDelete = (product) => {
    if (!window.confirm("Are you sure you want to delete this entry?")) return;

    const data = JSON.parse(localStorage.getItem("preAssembling")) || [];
    const index = data.findIndex((d) => d["WIP ID"] === product["WIP ID"]);
    if (index === -1) return;

    delete data[index].powdering; // removes powdering entry
    localStorage.setItem("preAssembling", JSON.stringify(data));
    loadData();
    alert("Deleted Successfully");
  };











  /* ================= Powdering Material TABLE VIEW ================= */
  if (isViewing && viewData) {
    const index = savedData.findIndex(
      (d) => d["Product ID"] === viewData["Product ID"]
    );

    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-6">

          {/* HEADER */}
          <div className="flex justify-between items-center mb-6 border-b pb-3">
            <h2 className="text-2xl font-semibold text-gray-700">
              {viewData["Product Name"]} - Powdering Details
            </h2>

            <button
              onClick={() => setIsViewing(false)}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-md transition"
            >
              Back
            </button>
          </div>

          {/* TABLE WRAPPER WITH HORIZONTAL SCROLL */}
          <div className="overflow-x-auto rounded-lg border shadow-sm">
            <table className="min-w-full text-sm divide-y divide-gray-200">

              {/* HEADER */}
              <thead className="bg-gray-100 text-gray-600 uppercase text-xs sticky top-0">
                <tr>
                  <th className="px-4 py-3 text-left">Powdering ID</th>
                  <th className="px-4 py-3 text-left">Date</th>
                  <th className="px-4 py-3 text-left">Powder Type</th>
                  <th className="px-4 py-3 text-left">Color Code</th>
                  <th className="px-4 py-3 text-left">Coating Thickness</th>
                  <th className="px-4 py-3 text-left">Oven Temp</th>
                  <th className="px-4 py-3 text-left">Curing Time</th>
                  <th className="px-4 py-3 text-left">Powder Used Qty</th>
                  <th className="px-4 py-3 text-left">Incoming Qty</th>
                  <th className="px-4 py-3 text-left">Scrap</th>
                  <th className="px-4 py-3 text-left">Finished Qty</th>
                  <th className="px-4 py-3 text-center">Action</th>
                </tr>
              </thead>

              {/* BODY */}
              <tbody className="bg-white divide-y divide-gray-200">
                {viewData.powdering ? (
                  <tr className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{viewData.powdering?.powderingId || "-"}</td>
                    <td className="px-4 py-3">{viewData.powdering.date || "-"}</td>
                    <td className="px-4 py-3">{viewData.powdering.powderType || "-"}</td>
                    <td className="px-4 py-3">{viewData.powdering.colorCode || "-"}</td>
                    <td className="px-4 py-3">{viewData.powdering.coatingThickness || "-"}</td>
                    <td className="px-4 py-3">{viewData.powdering.ovenTemperature || "-"}</td>
                    <td className="px-4 py-3">{viewData.powdering.curingTime || "-"}</td>
                    <td className="px-4 py-3">{viewData.powdering.powderUsedQty || "-"}</td>
                    <td className="px-4 py-3">{viewData.powdering.incomingQty || "-"}</td>
                    <td className="px-4 py-3 text-xs">
                      {viewData.powdering.usableQty && (
                        <div className="text-green-600">
                          Usable: {viewData.powdering.usableQty} (
                          {viewData.powdering.usableReason === "Other"
                            ? viewData.powdering.usableCustomReason
                            : viewData.powdering.usableReason}
                          )
                        </div>
                      )}
                      {viewData.powdering.unusableQty && (
                        <div className="text-red-600">
                          Unusable: {viewData.powdering.unusableQty} (
                          {viewData.powdering.unusableReason === "Other"
                            ? viewData.powdering.unusableCustomReason
                            : viewData.powdering.unusableReason}
                          )
                        </div>
                      )}
                      {!viewData.powdering.usableQty && !viewData.powdering.unusableQty && (
                        <span className="text-gray-400">No Scrap</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">
                        {viewData.powdering.finishedQty || viewData.powdering.incomingQty || "-"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleEdit(viewData)}
                          className="bg-indigo-600 text-white px-3 py-1.5 rounded text-xs"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(viewData)}
                          className="bg-red-500 text-white px-3 py-1.5 rounded text-xs"
                        >
                          Delete
                        </button>
                        <button
                          onClick={() => setShowQCForm(true)}
                          className="bg-blue-500 text-white px-3 py-1.5 rounded text-xs"
                        >
                          QC
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  <tr>
                    <td colSpan="12" className="text-center py-4 text-gray-400">
                      No Powdering Data
                    </td>
                  </tr>
                )}
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

                    updated[index].powdering = {
                      ...updated[index].powdering,
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

          {/* ================= QC DISPLAY ================= */}
          {viewData.powdering?.qc && (
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
                          className={`px-2 py-1 rounded text-xs font-medium ${viewData.powdering.qc.qcStatus === "Approved"
                              ? "bg-green-100 text-green-700"
                              : viewData.powdering.qc.qcStatus === "Rejected"
                                ? "bg-red-100 text-red-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                        >
                          {viewData.powdering.qc.qcStatus}
                        </span>
                      </td>

                      {/* CHECKED BY */}
                      <td className="px-4 py-3">
                        {viewData.powdering.qc.qcCheckedBy}
                      </td>

                      {/* DATE */}
                      <td className="px-4 py-3">
                        {viewData.powdering.qc.qcDate}
                      </td>

                      {/* REMARKS */}
                      <td className="px-4 py-3">
                        {viewData.powdering.qc.qcRemarks}
                      </td>

                      {/* ACTION */}
                      <td className="px-4 py-3 text-center">
                        <div className="flex justify-center gap-3">

                          {/* EDIT */}
                          <button
                            onClick={() => {
                              setQcData(viewData.powdering?.qc || {});
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

                              delete updated[index].powdering.qc;

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
  /* ================= FORM UI ================= */
  if (isEditing) {
    return (
      <div className="p-8 bg-gray-100 min-h-screen">
        <div className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow">

          <h2 className="text-xl font-semibold mb-6">Powdering Entry</h2>

          <div className="grid grid-cols-2 gap-6">

            {/* PRODUCT NAME */}
            <div className="flex flex-col">
              <label className="text-sm text-gray-500 mb-1">Product Name</label>
              <input
                value={formData.productName}
                readOnly
                className="border p-2 bg-gray-100"
              />
            </div>

            {/* POWDERING ID */}
            <div className="flex flex-col">
              <label className="text-sm text-gray-500 mb-1">Powdering ID</label>
              <input
                value={formData.wipId}
                readOnly
                className="border p-2 bg-gray-100"
              />
            </div>

            {/* DATE */}
            <div className="flex flex-col">
              <label className="text-sm text-gray-500 mb-1">Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="border p-2"
              />
            </div>

            {/* INCOMING QTY */}
            <div className="flex flex-col">
              <label className="text-sm text-gray-500 mb-1">Incoming Qty</label>
              <input
                value={formData.incomingQty}
                readOnly
                className="border p-2 bg-gray-100"
              />
            </div>

            {/* POWDER TYPE */}
            <div className="flex flex-col">
              <label className="text-sm text-gray-500 mb-1">Powder Type</label>
              <input
                placeholder="Powder Type"
                onChange={(e) => setFormData({ ...formData, powderType: e.target.value })}
                className="border p-2"
              />
            </div>

            {/* COLOR CODE */}
            <div className="flex flex-col">
              <label className="text-sm text-gray-500 mb-1">Color Code</label>
              <input
                placeholder="Color Code"
                onChange={(e) => setFormData({ ...formData, colorCode: e.target.value })}
                className="border p-2"
              />
            </div>

            {/* COATING THICKNESS */}
            <div className="flex flex-col">
              <label className="text-sm text-gray-500 mb-1">Coating Thickness</label>
              <input
                placeholder="Coating Thickness"
                onChange={(e) => setFormData({ ...formData, coatingThickness: e.target.value })}
                className="border p-2"
              />
            </div>

            {/* OVEN TEMPERATURE */}
            <div className="flex flex-col">
              <label className="text-sm text-gray-500 mb-1">Oven Temperature</label>
              <input
                placeholder="Oven Temperature"
                onChange={(e) => setFormData({ ...formData, ovenTemperature: e.target.value })}
                className="border p-2"
              />
            </div>

            {/* CURING TIME */}
            <div className="flex flex-col">
              <label className="text-sm text-gray-500 mb-1">Curing Time</label>
              <input
                placeholder="Curing Time"
                onChange={(e) => setFormData({ ...formData, curingTime: e.target.value })}
                className="border p-2"
              />
            </div>

            {/* POWDER USED QTY */}
            <div className="flex flex-col">
              <label className="text-sm text-gray-500 mb-1">Powder Used Qty</label>
              <input
                placeholder="Powder Used Qty"
                onChange={(e) => setFormData({ ...formData, powderUsedQty: e.target.value })}
                className="border p-2"
              />
            </div>

            {/* 🔥 SCRAP SECTION */}
            <div className="col-span-2 border p-4 rounded bg-gray-50">
              <h3 className="text-sm font-semibold mb-3">Scrap Details</h3>

              <div className="flex flex-col gap-4">

                {/* USABLE SCRAP */}
                <div className="flex gap-4 items-end">
                  <div className="flex flex-col">
                    <label className="text-xs text-gray-500 mb-1">Usable Qty</label>
                    <input
                      type="number"
                      placeholder="Usable Qty"
                      value={formData.usableQty}
                      onChange={(e) => {
                        const usable = Number(e.target.value) || 0;
                        const unusable = Number(formData.unusableQty) || 0;
                        const input = Number(formData.incomingQty) || 0;
                        setFormData({
                          ...formData,
                          usableQty: usable,
                          finishedQty: Math.max(0, input - (usable + unusable)),
                        });
                      }}
                      className="border p-2 w-32"
                    />
                  </div>

                  <div className="flex flex-col">
                    <label className="text-xs text-gray-500 mb-1">Reason</label>
                    <select
                      value={formData.usableReason}
                      onChange={(e) => setFormData({ ...formData, usableReason: e.target.value })}
                      className="border p-2"
                    >
                      <option value="">Reason</option>
                      <option>Rework</option>
                      <option>Powder Recovery</option>
                      <option>Carry Forward</option>
                      <option>Other</option>
                    </select>
                  </div>

                  {formData.usableReason === "Other" && (
                    <div className="flex flex-col">
                      <label className="text-xs text-gray-500 mb-1">Custom Reason</label>
                      <input
                        type="text"
                        placeholder="Enter reason"
                        value={formData.usableCustomReason}
                        onChange={(e) => setFormData({ ...formData, usableCustomReason: e.target.value })}
                        className="border p-2"
                      />
                    </div>
                  )}
                </div>

                {/* UNUSABLE SCRAP */}
                <div className="flex gap-4 items-end">
                  <div className="flex flex-col">
                    <label className="text-xs text-gray-500 mb-1">Unusable Qty</label>
                    <input
                      type="number"
                      placeholder="Unusable Qty"
                      value={formData.unusableQty}
                      onChange={(e) => {
                        const unusable = Number(e.target.value) || 0;
                        const usable = Number(formData.usableQty) || 0;
                        const input = Number(formData.incomingQty) || 0;
                        setFormData({
                          ...formData,
                          unusableQty: unusable,
                          finishedQty: Math.max(0, input - (usable + unusable)),
                        });
                      }}
                      className="border p-2 w-32"
                    />
                  </div>

                  <div className="flex flex-col">
                    <label className="text-xs text-gray-500 mb-1">Reason</label>
                    <select
                      value={formData.unusableReason}
                      onChange={(e) => setFormData({ ...formData, unusableReason: e.target.value })}
                      className="border p-2"
                    >
                      <option value="">Reason</option>
                      <option>Burnt</option>
                      <option>Over Coating</option>
                      <option>Defect</option>
                      <option>Other</option>
                    </select>
                  </div>

                  {formData.unusableReason === "Other" && (
                    <div className="flex flex-col">
                      <label className="text-xs text-gray-500 mb-1">Custom Reason</label>
                      <input
                        type="text"
                        placeholder="Enter reason"
                        value={formData.unusableCustomReason}
                        onChange={(e) => setFormData({ ...formData, unusableCustomReason: e.target.value })}
                        className="border p-2"
                      />
                    </div>
                  )}
                </div>

                {/* FINISHED QTY */}
                <div className="flex flex-col">
                  <label className="text-xs text-gray-500 mb-1">Finished Qty</label>
                  <input
                    value={formData.finishedQty}
                    readOnly
                    className="border p-2 bg-gray-100 w-32"
                  />
                </div>

              </div>
            </div>

          </div>

          <div className="mt-6 flex gap-3">
            <button
              onClick={() => setIsEditing(false)}
              className="border px-4 py-2 rounded"
            >
              Cancel
            </button>

            <button
              onClick={handleSave}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Save
            </button>
          </div>

        </div>
      </div>
    );
  }


  /* ================= PRODUCT LIST ================= */
  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-xl p-6">

        <h2 className="text-2xl font-semibold text-gray-700 mb-6">
          Powdering Products
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
              {savedData.map((p, i) => (
                <tr key={i} className="border-t hover:bg-gray-50">

                  <td className="px-6 py-4 font-medium text-gray-700">
                    {i + 1}
                  </td>

                  <td className="px-6 py-4 text-gray-600">
                    {p["Product Name"]}
                  </td>

                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center gap-3">

                      <button
                        onClick={() => openForm(p)}
                        className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm"
                      >
                        Add Material
                      </button>

                      <button
                        onClick={() => handleView(p)}
                        className="bg-emerald-500 text-white px-4 py-2 rounded-md text-sm"
                      >
                        View
                      </button>

                      <button
                        onClick={() => {
                          if (p?.powdering?.qc?.qcStatus !== "Approved") {
                            alert("QC not approved yet.");
                          } else {
                            moveToNextStage(p);
                          }
                        }}
                        className="bg-purple-600 text-white px-4 py-2 rounded-md text-sm"
                      >
                        Move Next
                      </button>

                    </div>
                  </td>

                </tr>
              ))}

              {savedData.length === 0 && (
                <tr>
                  <td colSpan="3" className="text-center py-4 text-gray-400">
                    No products in Powdering
                  </td>
                </tr>
              )}

            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}