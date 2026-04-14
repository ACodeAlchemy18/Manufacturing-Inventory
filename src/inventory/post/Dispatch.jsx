import { useState, useEffect } from "react";

export default function Dispatch() {
  const [dispatchList, setDispatchList] = useState([]);
  const [savedData, setSavedData] = useState([]);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [viewData, setViewData] = useState(null);

  const [formData, setFormData] = useState({
    dispatchId: "",
    product: "",
    batch: "",
    destination: "",
    transport: "",
    status: "",
    dispatchedBy: "",
    date: "",
    remarks: "",
  });

  /* ================= LOAD ================= */
  useEffect(() => {
    const list = JSON.parse(localStorage.getItem("dispatch")) || [];
    const saved = JSON.parse(localStorage.getItem("dispatchData")) || [];

    setDispatchList(list);
    setSavedData(saved);
  }, []);

  /* ================= OPEN FORM ================= */
  const handleDispatch = (product) => {
    setSelectedProduct(product);

    setFormData({
      dispatchId: `D${Date.now()}`,
      product: product.product,
      batch: product.batch,
      destination: "",
      transport: "",
      status: "Dispatched",
      dispatchedBy: "",
      date: new Date().toISOString().split("T")[0],
      remarks: "",
    });
  };

  /* ================= CHANGE ================= */
  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  /* ================= SAVE ================= */
  const handleSave = () => {
    const index = savedData.findIndex(
      (item) => item.dispatchId === formData.dispatchId
    );

    let updated;

    if (index !== -1) {
      updated = [...savedData];
      updated[index] = formData;
    } else {
      updated = [...savedData, formData];
    }

    setSavedData(updated);
    localStorage.setItem("dispatchData", JSON.stringify(updated));

    alert("Dispatch Saved ✅");
    setSelectedProduct(null);
  };

  /* ================= VIEW ================= */
  const handleView = (product) => {
    const data = savedData.find((d) => d.batch === product.batch);

    if (!data) {
      alert("No Dispatch Data ❌");
      return;
    }

    setViewData(data);
  };

  /* ================= DELETE ================= */
  const handleDelete = (id) => {
    if (!window.confirm("Delete?")) return;

    const updated = savedData.filter((d) => d.dispatchId !== id);

    setSavedData(updated);
    localStorage.setItem("dispatchData", JSON.stringify(updated));

    alert("Deleted ✅");
    setViewData(null);
  };

  /* ================= VIEW PAGE ================= */
  if (viewData) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-lg p-6">

          <div className="flex justify-between items-center mb-6 border-b pb-3">
            <h2 className="text-2xl font-semibold text-gray-700">
              Dispatch - {viewData.product}
            </h2>

            <button
              onClick={() => setViewData(null)}
              className="bg-gray-200 px-4 py-2 rounded"
            >
              Back
            </button>
          </div>

          <div className="overflow-x-auto border rounded-lg">
            <table className="min-w-[1200px] w-full text-sm">

              <thead className="bg-gray-100 text-xs uppercase">
                <tr>
                  <th className="px-4 py-3">Dispatch ID</th>
                  <th className="px-4 py-3">Product</th>
                  <th className="px-4 py-3">Batch</th>
                  <th className="px-4 py-3">Destination</th>
                  <th className="px-4 py-3">Transport</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Dispatched By</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Remarks</th>
                  <th className="px-4 py-3 text-center">Action</th>
                </tr>
              </thead>

              <tbody>
                <tr className="border-t">

                  <td className="px-4 py-3">{viewData.dispatchId}</td>
                  <td className="px-4 py-3">{viewData.product}</td>
                  <td className="px-4 py-3">{viewData.batch}</td>
                  <td className="px-4 py-3">{viewData.destination}</td>
                  <td className="px-4 py-3">{viewData.transport}</td>

                  <td className="px-4 py-3">
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">
                      {viewData.status}
                    </span>
                  </td>

                  <td className="px-4 py-3">{viewData.dispatchedBy}</td>
                  <td className="px-4 py-3">{viewData.date}</td>
                  <td className="px-4 py-3">{viewData.remarks}</td>

                  <td className="px-4 py-3 text-center space-x-2">

                    <button
                      onClick={() => {
                        setSelectedProduct(true);
                        setFormData(viewData);
                        setViewData(null);
                      }}
                      className="bg-yellow-500 text-white px-3 py-1 rounded text-xs"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(viewData.dispatchId)}
                      className="bg-red-600 text-white px-3 py-1 rounded text-xs"
                    >
                      Delete
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

  /* ================= LIST ================= */
  if (!selectedProduct) {
   return (
  <div className="p-8 bg-gray-100 min-h-screen">
    <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-xl p-6">

      {/* HEADER */}
      <h2 className="text-2xl font-semibold text-gray-700 mb-6">
        Dispatch
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
            {dispatchList.length === 0 ? (
              <tr>
                <td colSpan="3" className="text-center py-6 text-gray-400">
                  No Products Available for Dispatch
                </td>
              </tr>
            ) : (
              dispatchList.map((p, i) => (
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
                        onClick={() => handleDispatch(p)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium shadow"
                      >
                        Dispatch
                      </button>

                      <button
                        onClick={() => handleView(p)}
                        className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium shadow"
                      >
                        View
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
    <div className="p-8 bg-gray-100">
      <div className="bg-white p-6 rounded shadow grid grid-cols-2 gap-4">

        <input value={formData.dispatchId} disabled className="border p-2" />
        <input value={formData.product} disabled className="border p-2" />
        <input value={formData.batch} disabled className="border p-2" />

        <input
          placeholder="Destination"
          onChange={(e) => handleChange("destination", e.target.value)}
          className="border p-2"
        />

        <input
          placeholder="Transport"
          onChange={(e) => handleChange("transport", e.target.value)}
          className="border p-2"
        />

        <input
          placeholder="Dispatched By"
          onChange={(e) => handleChange("dispatchedBy", e.target.value)}
          className="border p-2"
        />

        <input
          type="date"
          value={formData.date}
          onChange={(e) => handleChange("date", e.target.value)}
          className="border p-2"
        />

        <input
          placeholder="Remarks"
          onChange={(e) => handleChange("remarks", e.target.value)}
          className="border p-2 col-span-2"
        />

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