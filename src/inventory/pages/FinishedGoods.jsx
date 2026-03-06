import { useEffect, useState } from "react";

/* ===================================
        FINISHED GOODS MODULE
=================================== */

export default function FinishedGoods() {

  const [fgData, setFgData] = useState([]);
  const [selectedFG, setSelectedFG] = useState(null);

  const [qcQty, setQcQty] = useState("");
  const [rejectQty, setRejectQty] = useState("");

  useEffect(() => {
    loadFinishedGoods();
  }, []);

  /* ================= LOAD FROM POWDERING ================= */

  const loadFinishedGoods = () => {

    const powder =
      JSON.parse(localStorage.getItem("powderingData")) || [];

    const savedFG =
      JSON.parse(localStorage.getItem("finishedGoods")) || [];

    const fgList = powder.map((p, index) => {

      const existing = savedFG.find(
        f => f.wipId === p["WIP ID"]
      );

      return existing || {
        fgId: "FG-" + (index + 1),
        wipId: p["WIP ID"],
        productName: p["Product Name"],
        completedQty: Number(p["Output Qty"] || 0),
        qcPassed: 0,
        rejected: 0,
        availableStock: 0,
        status: "Pending QC",
        date: new Date().toLocaleDateString(),
      };
    });

    setFgData(fgList);
  };

  /* ================= OPEN QC ================= */

  const openQC = (item) => {
    setSelectedFG(item);
    setQcQty("");
    setRejectQty("");
  };

  /* ================= SAVE QC ================= */

  const saveQC = () => {

    const pass = Number(qcQty || 0);
    const reject = Number(rejectQty || 0);

    if (pass + reject > selectedFG.completedQty)
      return alert("Invalid Quantity");

    const updated = fgData.map(f => {

      if (f.fgId === selectedFG.fgId) {
        return {
          ...f,
          qcPassed: pass,
          rejected: reject,
          availableStock: pass,
          status: "QC Approved"
        };
      }
      return f;
    });

    setFgData(updated);
    localStorage.setItem(
      "finishedGoods",
      JSON.stringify(updated)
    );

    setSelectedFG(null);
    alert("QC Updated ✅");
  };

  /* ================= DISPATCH ================= */

  const dispatchItem = (item) => {

    const qty = prompt("Enter Dispatch Quantity");

    if (!qty) return;

    const dispatchQty = Number(qty);

    if (dispatchQty > item.availableStock)
      return alert("Not enough stock");

    const updated = fgData.map(f => {

      if (f.fgId === item.fgId) {
        return {
          ...f,
          availableStock:
            f.availableStock - dispatchQty
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

  /* ================= UI ================= */

  return (
    <div className="p-8 bg-gray-100 rounded-2xl">

      <h2 className="text-2xl font-semibold mb-6">
        Finished Goods Inventory
      </h2>

      <div className="bg-white p-6 rounded-xl shadow">

        <table className="min-w-full border text-sm">

          <thead className="bg-gray-50">
            <tr>
              <th className="border px-3 py-2">FG ID</th>
              <th className="border px-3 py-2">Product</th>
              <th className="border px-3 py-2">Completed</th>
              <th className="border px-3 py-2">QC Passed</th>
              <th className="border px-3 py-2">Rejected</th>
              <th className="border px-3 py-2">Available</th>
              <th className="border px-3 py-2">Status</th>
              <th className="border px-3 py-2">Actions</th>
            </tr>
          </thead>

          <tbody>
            {fgData.map((fg, i) => (
              <tr key={i}>

                <td className="border px-3 py-2">{fg.fgId}</td>
                <td className="border px-3 py-2">{fg.productName}</td>
                <td className="border px-3 py-2">{fg.completedQty}</td>
                <td className="border px-3 py-2">{fg.qcPassed}</td>
                <td className="border px-3 py-2">{fg.rejected}</td>
                <td className="border px-3 py-2">{fg.availableStock}</td>
                <td className="border px-3 py-2">{fg.status}</td>

                <td className="border px-3 py-2 flex gap-2">

                  <button
                    onClick={() => openQC(fg)}
                    className="bg-blue-600 text-white px-2 py-1 rounded"
                  >
                    QC
                  </button>

                  <button
                    onClick={() => dispatchItem(fg)}
                    className="bg-green-600 text-white px-2 py-1 rounded"
                  >
                    Dispatch
                  </button>

                </td>

              </tr>
            ))}
          </tbody>

        </table>
      </div>

      {/* ================= QC MODAL ================= */}

      {selectedFG && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center">

          <div className="bg-white p-6 rounded-xl w-96">

            <h3 className="font-semibold mb-4">
              QC Check ({selectedFG.productName})
            </h3>

            <p className="text-sm mb-2">
              Completed Qty: {selectedFG.completedQty}
            </p>

            <input
              type="number"
              placeholder="QC Passed Qty"
              value={qcQty}
              onChange={(e)=>setQcQty(e.target.value)}
              className="border w-full p-2 mb-3"
            />

            <input
              type="number"
              placeholder="Rejected Qty"
              value={rejectQty}
              onChange={(e)=>setRejectQty(e.target.value)}
              className="border w-full p-2 mb-4"
            />

            <div className="flex gap-2">

              <button
                onClick={saveQC}
                className="bg-blue-600 text-white px-4 py-2 rounded w-full"
              >
                Save
              </button>

              <button
                onClick={()=>setSelectedFG(null)}
                className="bg-gray-400 text-white px-4 py-2 rounded w-full"
              >
                Cancel
              </button>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}