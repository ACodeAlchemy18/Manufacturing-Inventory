import { useEffect, useState } from "react";

export default function FinishedGoods() {
  const [fgData, setFgData] = useState([]);

  /* ================= LOAD DATA ================= */

  useEffect(() => {
    loadFinishedGoods();
  }, []);

  const loadFinishedGoods = () => {
    const packaging =
      JSON.parse(localStorage.getItem("packagingData")) || [];

    const savedFG =
      JSON.parse(localStorage.getItem("finishedGoods")) || [];

    const fgList = packaging.map((p, index) => {
      const existing = savedFG.find(
        (f) => f.packageId === p["Package ID"]
      );

      return (
        existing || {
          fgId: "FG-" + (index + 1),
          packageId: p["Package ID"],
          productName: p["Product"],
          batch: p["Batch"],
          quantity: 1,
          availableStock: 1,
          dispatchedQty: 0,
          status: "Ready",
          date: new Date().toLocaleDateString(),
        }
      );
    });

    setFgData(fgList);
  };

  /* ================= DISPATCH ================= */

  const dispatchItem = (item) => {
    const qty = prompt("Enter Dispatch Quantity");

    if (!qty) return;

    const dispatchQty = Number(qty);

    if (dispatchQty <= 0)
      return alert("Enter valid quantity");

    if (dispatchQty > item.availableStock)
      return alert("Not enough stock");

    const updated = fgData.map((f) => {
      if (f.fgId === item.fgId) {
        const newAvailable = f.availableStock - dispatchQty;

        return {
          ...f,
          availableStock: newAvailable,
          dispatchedQty: f.dispatchedQty + dispatchQty,
          status:
            newAvailable === 0
              ? "Dispatched"
              : "Partial",
        };
      }
      return f;
    });

    setFgData(updated);
    localStorage.setItem(
      "finishedGoods",
      JSON.stringify(updated)
    );
  };

  /* ================= DELETE ================= */

  const deleteItem = (index) => {
    const updated = fgData.filter((_, i) => i !== index);
    setFgData(updated);
    localStorage.setItem(
      "finishedGoods",
      JSON.stringify(updated)
    );
  };

  /* ================= STATUS COLOR ================= */

  const getStatusColor = (status) => {
    switch (status) {
      case "Ready":
        return "bg-yellow-100 text-yellow-700";
      case "Partial":
        return "bg-orange-100 text-orange-700";
      case "Dispatched":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  /* ================= UI ================= */

  return (
    <div className="bg-gray-100 p-8 rounded-2xl">
      
      {/* HEADER */}
      <div className="flex justify-between mb-6">
        <h2 className="text-2xl font-semibold">
          Finished Goods Inventory
        </h2>

        <button
          onClick={loadFinishedGoods}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg"
        >
          🔄 Refresh
        </button>
      </div>

      {/* TABLE */}
      <div className="overflow-auto bg-white rounded-xl border shadow-sm">
        <table className="min-w-full text-sm">
          
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2">FG ID</th>
              <th className="border px-4 py-2">Product</th>
              <th className="border px-4 py-2">Batch</th>
              <th className="border px-4 py-2">Total Qty</th>
              <th className="border px-4 py-2">Available</th>
              <th className="border px-4 py-2">Dispatched</th>
              <th className="border px-4 py-2">Status</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>

          <tbody>
            {fgData.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center p-4">
                  No Finished Goods Available
                </td>
              </tr>
            ) : (
              fgData.map((fg, index) => (
                <tr key={index}>
                  
                  <td className="border px-3 py-2">
                    {fg.fgId}
                  </td>

                  <td className="border px-3 py-2">
                    {fg.productName}
                  </td>

                  <td className="border px-3 py-2">
                    {fg.batch}
                  </td>

                  <td className="border px-3 py-2">
                    {fg.quantity}
                  </td>

                  <td className="border px-3 py-2">
                    {fg.availableStock}
                  </td>

                  <td className="border px-3 py-2">
                    {fg.dispatchedQty}
                  </td>

                  {/* STATUS */}
                  <td className="border px-3 py-2">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(
                        fg.status
                      )}`}
                    >
                      {fg.status}
                    </span>
                  </td>

                  {/* ACTIONS */}
                  <td className="border px-3 py-2 flex gap-2 justify-center">
                    
                    <button
                      onClick={() => dispatchItem(fg)}
                      className="bg-green-600 text-white px-3 py-1 rounded"
                    >
                      Dispatch
                    </button>

                    <button
                      onClick={() => deleteItem(index)}
                      className="bg-red-600 text-white px-3 py-1 rounded"
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
    </div>
  );
}