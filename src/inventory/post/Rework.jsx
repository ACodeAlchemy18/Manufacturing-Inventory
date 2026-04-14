import { useState, useEffect } from "react";

export default function Rework() {
  const [reworkData, setReworkData] = useState([]);
  const [viewData, setViewData] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const [formData, setFormData] = useState({
    reworkType: "",
    description: "",
    doneBy: "",
    date: "",
  });

  /* ================= LOAD DATA ================= */
  useEffect(() => {
    const rw = JSON.parse(localStorage.getItem("rework")) || [];
    setReworkData(rw);
  }, []);

  /* ================= VIEW ================= */
  const handleView = (item) => {
    setViewData(item);
  };

  /* ================= OPEN FORM ================= */
  const handleOpenForm = (item) => {
    setSelectedItem(item);
    setShowForm(true);
  };

  /* ================= SAVE REWORK ================= */
  const handleSaveRework = () => {
    const updated = reworkData.map((r) => {
      if (r.reworkId === selectedItem.reworkId) {
        return {
          ...r,
          ...formData,
          reworkStatus: "Completed",
        };
      }
      return r;
    });

    setReworkData(updated);
    localStorage.setItem("rework", JSON.stringify(updated));

    setShowForm(false);
    setFormData({
      reworkType: "",
      description: "",
      doneBy: "",
      date: "",
    });

    alert("Rework Saved Successfully ✅");
  };

  // 🔥 ADD THIS FUNCTION
const updateProductStage = (productId, newStage) => {
  const products =
    JSON.parse(localStorage.getItem("preAssembling")) || [];

  const updated = products.map((p) =>
    p["WIP ID"] === productId
      ? {
          ...p,
          "Process Stage": newStage,
          "Current Status": "Pending",
        }
      : p
  );

  localStorage.setItem("preAssembling", JSON.stringify(updated));
};

  /* ================= MOVE TO QC ================= */
  const handleMove = (item) => {
  const qc =
    JSON.parse(localStorage.getItem("qualityInspection")) || [];

  const newQC = {
    qcId: `QC${Date.now()}`,
    product: item.product,
    batch: item.batch,
    productId: item.productId, // ✅ IMPORTANT
    status: "Pending",
    source: "Rework",
  };

  localStorage.setItem(
    "qualityInspection",
    JSON.stringify([...qc, newQC])
  );

  // 🔥 UPDATE PRODUCT MASTER
  updateProductStage(item.productId, "Quality Inspection");

  // remove from rework
  const updated = reworkData.filter(
    (r) => r.reworkId !== item.reworkId
  );

  setReworkData(updated);
  localStorage.setItem("rework", JSON.stringify(updated));

  alert("Moved to Quality Inspection 🚀");
  setViewData(null);
};



  /* ================= REWORK FORM ================= */
  if (showForm && selectedItem) {
    return (
      <div className="p-8 bg-gray-100">
        <div className="bg-white p-6 rounded shadow max-w-3xl mx-auto">

          <h2 className="text-xl font-semibold mb-4">
            Rework Form - {selectedItem.product}
          </h2>

          <div className="space-y-3">

            <input
              type="text"
              placeholder="Rework Type (Repair / Replace)"
              value={formData.reworkType}
              className="w-full border p-2"
              onChange={(e) =>
                setFormData({ ...formData, reworkType: e.target.value })
              }
            />

            <textarea
              placeholder="Rework Description"
              value={formData.description}
              className="w-full border p-2"
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />

            <input
              type="text"
              placeholder="Done By"
              value={formData.doneBy}
              className="w-full border p-2"
              onChange={(e) =>
                setFormData({ ...formData, doneBy: e.target.value })
              }
            />

            <input
              type="date"
              value={formData.date}
              className="w-full border p-2"
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
            />
          </div>

          <div className="mt-4 flex gap-3">
            <button
              onClick={handleSaveRework}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Save
            </button>

            <button
              onClick={() => setShowForm(false)}
              className="bg-gray-600 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>

        </div>
      </div>
    );
  }

  /* ================= VIEW PAGE ================= */
  if (viewData) {
    return (
      <div className="p-8 bg-gray-100">
        <div className="bg-white p-6 rounded shadow max-w-4xl mx-auto">

          <h2 className="text-xl font-semibold mb-4">
            Rework Details - {viewData.product}
          </h2>

          <table className="w-full border">
            <tbody>
              <tr>
                <td className="border p-2 font-medium">Rework ID</td>
                <td className="border p-2">{viewData.reworkId}</td>
              </tr>

              <tr>
                <td className="border p-2 font-medium">Product</td>
                <td className="border p-2">{viewData.product}</td>
              </tr>

              <tr>
                <td className="border p-2 font-medium">Batch</td>
                <td className="border p-2">{viewData.batch}</td>
              </tr>

              <tr>
                <td className="border p-2 font-medium">Source</td>
                <td className="border p-2">
                  {viewData.reason?.includes("Functional")
                    ? "Functional Testing"
                    : "Quality Inspection"}
                </td>
              </tr>

              <tr>
                <td className="border p-2 font-medium">Reason</td>
                <td className="border p-2">{viewData.reason}</td>
              </tr>

              <tr>
                <td className="border p-2 font-medium">Rework Type</td>
                <td className="border p-2">{viewData.reworkType}</td>
              </tr>

              <tr>
                <td className="border p-2 font-medium">Description</td>
                <td className="border p-2">{viewData.description}</td>
              </tr>

              <tr>
                <td className="border p-2 font-medium">Done By</td>
                <td className="border p-2">{viewData.doneBy}</td>
              </tr>

              <tr>
                <td className="border p-2 font-medium">Date</td>
                <td className="border p-2">{viewData.date}</td>
              </tr>
            </tbody>
          </table>

          <div className="mt-4 flex gap-3">
           

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
  return (
  <div className="p-8 bg-gray-100 min-h-screen">
    <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-xl p-6">

      {/* HEADER */}
      <h2 className="text-2xl font-semibold text-gray-700 mb-6">
        Rework Management
      </h2>

      {/* TABLE */}
      <div className="overflow-hidden rounded-lg border">
        <table className="w-full text-sm text-left">

          {/* HEADER */}
          <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-4 py-3">Rework ID</th>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Batch</th>
              <th className="px-4 py-3">Source</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>

          {/* BODY */}
          <tbody>
            {reworkData.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-6 text-gray-400">
                  No Rework Data Available
                </td>
              </tr>
            ) : (
              reworkData.map((r, i) => (
                <tr
                  key={i}
                  className="border-t hover:bg-gray-50 transition"
                >
                  {/* REWORK ID */}
                  <td className="px-6 py-4 font-medium text-gray-700">
                    {r.reworkId}
                  </td>

                  {/* PRODUCT */}
                  <td className="px-6 py-4 text-gray-600">
                    {r.product}
                  </td>

                  {/* BATCH */}
                  <td className="px-6 py-4 text-gray-600">
                    {r.batch}
                  </td>

                  {/* SOURCE */}
                  <td
                    className={`px-6 py-4 font-medium ${
                      r.source === "Functional Testing"
                        ? "text-blue-600"
                        : "text-red-600"
                    }`}
                  >
                    {r.source || "Quality Inspection"}
                  </td>

                  {/* STATUS */}
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        r.reworkStatus === "Completed"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {r.reworkStatus || "Pending"}
                    </span>
                  </td>

                  {/* ACTIONS */}
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center gap-3">

                      <button
                        onClick={() => handleOpenForm(r)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium shadow"
                      >
                        Rework
                      </button>

                      <button
                        onClick={() => handleView(r)}
                        className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium shadow"
                      >
                        View
                      </button>

                      <button
                        onClick={() => handleMove(r)}
                        disabled={r.reworkStatus !== "Completed"}
                        className={`px-4 py-2 rounded-md text-sm font-medium text-white shadow ${
                          r.reworkStatus === "Completed"
                            ? "bg-green-600 hover:bg-green-700"
                            : "bg-gray-400 cursor-not-allowed"
                        }`}
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