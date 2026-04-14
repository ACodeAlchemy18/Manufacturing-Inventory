import { useState, useEffect } from "react";

export default function StockMovements() {
  const [movements, setMovements] = useState([]);

  const [formData, setFormData] = useState({
    movementId: "",
    product: "",
    batch: "",
    fromStage: "",
    toStage: "",
    quantity: "",
    status: "",
    date: "",
    remarks: "",
  });

  const [showForm, setShowForm] = useState(false);

  /* ================= LOAD ================= */
  useEffect(() => {
    const data =
      JSON.parse(localStorage.getItem("stockMovements")) || [];
    setMovements(data);
  }, []);

  /* ================= OPEN FORM ================= */
  const openForm = (product) => {
    setFormData({
      movementId: `SM${Date.now()}`,
      product: product.product,
      batch: product.batch,
      fromStage: product.currentStage || "Unknown",
      toStage: "",
      quantity: "",
      status: "Pending",
      date: new Date().toISOString().split("T")[0],
      remarks: "",
    });

    setShowForm(true);
  };

  /* ================= SAVE MOVEMENT ================= */
  const handleSave = () => {
    const updated = [...movements, formData];

    setMovements(updated);
    localStorage.setItem("stockMovements", JSON.stringify(updated));

    alert("Stock Movement Saved ✅");
    setShowForm(false);
  };

  /* ================= DELETE ================= */
  const handleDelete = (id) => {
    const updated = movements.filter((m) => m.movementId !== id);

    setMovements(updated);
    localStorage.setItem("stockMovements", JSON.stringify(updated));

    alert("Deleted ✅");
  };

  /* ================= LIST VIEW ================= */
  if (!showForm) {
    return (
      <div className="p-8 bg-gray-100">

        <h2 className="text-2xl font-semibold mb-6">
          Stock Movements
        </h2>

        <table className="w-full bg-white border rounded-lg">

          <thead className="bg-blue-100">
            <tr>
              <th className="border p-2">Movement ID</th>
              <th className="border p-2">Product</th>
              <th className="border p-2">Batch</th>
              <th className="border p-2">From</th>
              <th className="border p-2">To</th>
              <th className="border p-2">Qty</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Date</th>
              <th className="border p-2">Action</th>
            </tr>
          </thead>

          <tbody>
            {movements.length === 0 ? (
              <tr>
                <td colSpan="9" className="text-center p-4">
                  No Stock Movements
                </td>
              </tr>
            ) : (
              movements.map((m) => (
                <tr key={m.movementId}>
                  <td className="border p-2">{m.movementId}</td>
                  <td className="border p-2">{m.product}</td>
                  <td className="border p-2">{m.batch}</td>
                  <td className="border p-2">{m.fromStage}</td>
                  <td className="border p-2">{m.toStage}</td>
                  <td className="border p-2">{m.quantity}</td>
                  <td className="border p-2">{m.status}</td>
                  <td className="border p-2">{m.date}</td>

                  <td className="border p-2 space-x-2 text-center">
                    <button
                      onClick={() => handleDelete(m.movementId)}
                      className="bg-red-600 text-white px-2 py-1 rounded"
                    >
                      Delete
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
    <div className="p-8 bg-gray-100">

      <div className="bg-white p-6 rounded shadow max-w-3xl mx-auto">

        <h2 className="text-xl font-semibold mb-4">
          Add Stock Movement
        </h2>

        <div className="grid grid-cols-2 gap-4">

          <input
            value={formData.movementId}
            disabled
            className="border p-2"
          />

          <input
            value={formData.product}
            disabled
            className="border p-2"
          />

          <input
            value={formData.batch}
            disabled
            className="border p-2"
          />

          <input
            placeholder="From Stage"
            value={formData.fromStage}
            onChange={(e) =>
              setFormData({ ...formData, fromStage: e.target.value })
            }
            className="border p-2"
          />

          <input
            placeholder="To Stage"
            value={formData.toStage}
            onChange={(e) =>
              setFormData({ ...formData, toStage: e.target.value })
            }
            className="border p-2"
          />

          <input
            placeholder="Quantity"
            value={formData.quantity}
            onChange={(e) =>
              setFormData({ ...formData, quantity: e.target.value })
            }
            className="border p-2"
          />

          <input
            placeholder="Status"
            value={formData.status}
            onChange={(e) =>
              setFormData({ ...formData, status: e.target.value })
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
            className="border p-2 col-span-2"
          />

        </div>

        <div className="mt-4 flex gap-3">
          <button
            onClick={handleSave}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Save Movement
          </button>

          <button
            onClick={() => setShowForm(false)}
            className="bg-gray-600 text-white px-4 py-2 rounded"
          >
            Back
          </button>
        </div>

      </div>
    </div>
  );
}