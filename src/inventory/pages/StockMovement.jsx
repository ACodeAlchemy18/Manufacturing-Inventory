import { useEffect, useState } from "react";

export default function StockMovement() {
  const [movements, setMovements] = useState([]);

  /* ===============================
        LOAD MOVEMENTS
  =============================== */
  useEffect(() => {
    const data =
      JSON.parse(localStorage.getItem("stockMovements")) || [];
    setMovements(data);
  }, []);

  /* ===============================
        CLEAR HISTORY (OPTIONAL)
  =============================== */
  const clearHistory = () => {
    if (!window.confirm("Clear all stock movements?")) return;

    localStorage.removeItem("stockMovements");
    setMovements([]);
  };

  return (
    <div className="p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">
          Stock Movement
        </h1>

        <button
          onClick={clearHistory}
          className="bg-red-500 text-white px-4 py-2 rounded-lg"
        >
          Clear History
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow overflow-auto">
        <table className="w-full text-sm">

          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">Movement ID</th>
              <th className="p-3">Date</th>
              <th className="p-3">Product ID</th>
              <th className="p-3">Product Name</th>
              <th className="p-3">Type</th>
              <th className="p-3">From</th>
              <th className="p-3">To</th>
              <th className="p-3">Quantity</th>
              <th className="p-3">Balance</th>
              <th className="p-3">Done By</th>
            </tr>
          </thead>

          <tbody>
            {movements.length === 0 ? (
              <tr>
                <td colSpan="10" className="text-center p-6 text-gray-500">
                  No Stock Movement Found
                </td>
              </tr>
            ) : (
              movements.map((m) => (
                <tr key={m.id} className="border-t text-center">
                  <td className="p-3">{m.id}</td>
                  <td className="p-3">{m.date}</td>
                  <td className="p-3">{m.productId}</td>
                  <td className="p-3">{m.productName}</td>
                  <td className="p-3">{m.type}</td>
                  <td className="p-3">{m.from}</td>
                  <td className="p-3">{m.to}</td>
                  <td className="p-3">{m.qty}</td>
                  <td className="p-3">{m.balance}</td>
                  <td className="p-3">{m.user}</td>
                </tr>
              ))
            )}
          </tbody>

        </table>
      </div>
    </div>
  );
}







