import { useState, useEffect } from "react";

export default function FinishedGoods() {
  const [fgList, setFgList] = useState([]);
  const [savedData, setSavedData] = useState([]);

  const [selectedItem, setSelectedItem] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [viewData, setViewData] = useState(null);

  const [formData, setFormData] = useState({
    fgId: "",
    product: "",
    batch: "",
    qty: "",
    packedBy: "",
    date: "",
    remarks: "",
    status: "Finished",
  });

  /* ================= LOAD ================= */
  useEffect(() => {
    const fg = JSON.parse(localStorage.getItem("finishedGoodsQueue")) || [];
    const saved = JSON.parse(localStorage.getItem("finishedGoods")) || [];

    setFgList(fg);
    setSavedData(saved);
  }, []);

  /* ================= OPEN FORM ================= */
  const handleFinish = (item) => {
    setSelectedItem(item);

    setFormData({
      fgId: `FG${Date.now()}`,
      product: item.product,
      batch: item.batch,
      qty: "",
      packedBy: "",
      date: new Date().toISOString().split("T")[0],
      remarks: "",
      status: "Finished",
    });

    setIsFormOpen(true);
    setViewData(null);
  };

  /* ================= SAVE ================= */
  const handleSave = () => {
    const index = savedData.findIndex((i) => i.fgId === formData.fgId);

    let updated;
    if (index !== -1) {
      updated = [...savedData];
      updated[index] = formData;
    } else {
      updated = [...savedData, formData];
    }

    setSavedData(updated);
    localStorage.setItem("finishedGoods", JSON.stringify(updated));

    alert("Finished Goods Saved ✅");
    setIsFormOpen(false);
  };

  /* ================= VIEW ================= */
  const handleView = (item) => {
    const data = savedData.find((i) => i.fgId === item.fgId);
    setViewData(data);
  };

  /* ================= EDIT ================= */
  const handleEdit = (item) => {
    setFormData(item);
    setIsFormOpen(true);
    setViewData(null);
  };

  /* ================= DELETE ================= */
  const handleDelete = (id) => {
    const updated = savedData.filter((i) => i.fgId !== id);

    setSavedData(updated);
    localStorage.setItem("finishedGoods", JSON.stringify(updated));

    setViewData(null);
    alert("Deleted ✅");
  };

  /* ================= MOVE TO DISPATCH ================= */
  const handleMove = (item) => {
    const dispatch =
      JSON.parse(localStorage.getItem("dispatch")) || [];

    const newDispatch = {
      dispatchId: `D${Date.now()}`,
      product: item.product,
      batch: item.batch,
      qty: item.qty,
      status: "Ready",
      date: new Date().toISOString().split("T")[0],
    };

    localStorage.setItem(
      "dispatch",
      JSON.stringify([...dispatch, newDispatch])
    );

    const updated = savedData.filter((i) => i.fgId !== item.fgId);

    setSavedData(updated);
    localStorage.setItem("finishedGoods", JSON.stringify(updated));

    setViewData(null);
    alert("Moved to Dispatch 🚚");
  };

  /* ================= VIEW PAGE ================= */
  if (viewData) {
    return (
      <div className="p-8 bg-gray-100">
        <div className="bg-white p-6 rounded shadow max-w-6xl mx-auto">

          <div className="flex justify-between mb-4 border-b pb-2">
            <h2 className="text-xl font-semibold">
              Finished Goods - {viewData.product}
            </h2>

            <button
              onClick={() => setViewData(null)}
              className="bg-gray-600 text-white px-4 py-2 rounded"
            >
              Back
            </button>
          </div>

          {/* HORIZONTAL TABLE */}
          <div className="overflow-x-auto border rounded">
            <table className="min-w-[900px] w-full text-sm">

              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 border">FG ID</th>
                  <th className="p-3 border">Product</th>
                  <th className="p-3 border">Batch</th>
                  <th className="p-3 border">Qty</th>
                  <th className="p-3 border">Packed By</th>
                  <th className="p-3 border">Date</th>
                  <th className="p-3 border">Status</th>
                  <th className="p-3 border">Remarks</th>
                  <th className="p-3 border">Action</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td className="border p-2">{viewData.fgId}</td>
                  <td className="border p-2">{viewData.product}</td>
                  <td className="border p-2">{viewData.batch}</td>
                  <td className="border p-2">{viewData.qty}</td>
                  <td className="border p-2">{viewData.packedBy}</td>
                  <td className="border p-2">{viewData.date}</td>
                  <td className="border p-2">{viewData.status}</td>
                  <td className="border p-2">{viewData.remarks}</td>

                  <td className="border p-2 space-x-2 text-center">

                    <button
                      onClick={() => handleEdit(viewData)}
                      className="bg-yellow-500 text-white px-2 py-1 rounded"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(viewData.fgId)}
                      className="bg-red-500 text-white px-2 py-1 rounded"
                    >
                      Delete
                    </button>

                    <button
                      onClick={() => handleMove(viewData)}
                      className="bg-green-600 text-white px-2 py-1 rounded"
                    >
                      Move
                    </button>

                  </td>
                </tr>
              </tbody>

            </table>
          </div>

        </div>
      </div>
    );
  }

  /* ================= FORM ================= */
  if (isFormOpen) {
    return (
      <div className="p-8 bg-gray-100">
        <div className="bg-white p-6 rounded shadow max-w-3xl mx-auto">

          <h2 className="text-xl font-semibold mb-4">
            Finish Goods Form
          </h2>

          <div className="grid grid-cols-2 gap-4">

            <input value={formData.fgId} disabled className="border p-2" />
            <input value={formData.product} disabled className="border p-2" />
            <input value={formData.batch} disabled className="border p-2" />

            <input
              placeholder="Quantity"
              value={formData.qty}
              onChange={(e) =>
                setFormData({ ...formData, qty: e.target.value })
              }
              className="border p-2"
            />

            <input
              placeholder="Packed By"
              value={formData.packedBy}
              onChange={(e) =>
                setFormData({ ...formData, packedBy: e.target.value })
              }
              className="border p-2"
            />

            <input
              type="date"
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
              className="border p-2"
            />

            <input
              placeholder="Remarks"
              value={formData.remarks}
              onChange={(e) =>
                setFormData({ ...formData, remarks: e.target.value })
              }
              className="border p-2"
            />

          </div>

          <div className="mt-4 flex gap-3">
            <button
              onClick={handleSave}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Save
            </button>

            <button
              onClick={() => setIsFormOpen(false)}
              className="bg-gray-600 text-white px-4 py-2 rounded"
            >
              Cancel
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
        Finished Goods
      </h2>

      {/* TABLE */}
      <div className="overflow-hidden rounded-lg border">
        <table className="w-full text-sm text-left">

          {/* HEADER */}
          <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-4 py-3">FG ID</th>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Batch</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>

          {/* BODY */}
          <tbody>
            {savedData.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-6 text-gray-400">
                  No Finished Goods Available
                </td>
              </tr>
            ) : (
              savedData.map((item, i) => (
                <tr
                  key={item.fgId || i}
                  className="border-t hover:bg-gray-50 transition"
                >
                  {/* FG ID */}
                  <td className="px-6 py-4 font-medium text-gray-700">
                    {item.fgId}
                  </td>

                  {/* PRODUCT */}
                  <td className="px-6 py-4 text-gray-600">
                    {item.product}
                  </td>

                  {/* BATCH */}
                  <td className="px-6 py-4 text-gray-600">
                    {item.batch}
                  </td>

                  {/* ACTIONS */}
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center gap-3">

                      <button
                        onClick={() => handleFinish(item)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium shadow"
                      >
                        Finish
                      </button>

                      <button
                        onClick={() => handleView(item)}
                        className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium shadow"
                      >
                        View
                      </button>

                      <button
                        onClick={() => handleMove(item)}
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