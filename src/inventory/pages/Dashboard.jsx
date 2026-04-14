import { useState } from "react";
import {
  FaBoxesStacked,
  FaIndustry,
  FaWarehouse,
  FaRecycle,
  FaTriangleExclamation
} from "react-icons/fa6";

export default function Dashboard() {

  /* Dummy Data (Later connect with backend) */

  const summary = {
    rawMaterials: 120,
    wipItems: 45,
    finishedGoods: 30,
    scrap: 75
  };

  const productionStages = [
    { stage: "Pre-Assembling", qty: 20 },
    { stage: "Phosphating", qty: 15 },
    { stage: "Powdering", qty: 10 }
  ];

  const rawMaterials = [
    { name: "Steel Sheet", available: 500, min: 200 },
    { name: "Bolts", available: 100, min: 150 },
    { name: "Powder Paint", available: 80, min: 100 }
  ];

  const activities = [
    "Steel Sheet added (200kg)",
    "Product A moved to Phosphating",
    "20 items finished",
    "Scrap generated 10kg"
  ];




  const deleteAllData = () => {
  const confirmDelete = window.confirm(
    "⚠️ This will delete ALL data permanently. Are you sure?"
  );
  if (!confirmDelete) return;

  // 🔥 CLEAR ALL STORAGE KEYS
  localStorage.removeItem("preAssembling");
 



  alert("All data deleted successfully 🗑️");

  // 🔄 Refresh page
  window.location.reload();
};


  return (
    <div className="p-6 space-y-8">

      {/* Page Title */}
      <h1 className="text-2xl font-bold text-purple-700">
       Dashboard
      </h1>
       <button
    onClick={deleteAllData}
    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
  >
    Delete All Data
  </button>

      {/* ================= SUMMARY CARDS ================= */}

      <div className="grid grid-cols-4 gap-6">

        <Card
          icon={<FaBoxesStacked />}
          title="Raw Materials"
          value={summary.rawMaterials}
        />

        <Card
          icon={<FaIndustry />}
          title="WIP Inventory"
          value={summary.wipItems}
        />

        <Card
          icon={<FaWarehouse />}
          title="Finished Goods"
          value={summary.finishedGoods}
        />

        <Card
          icon={<FaRecycle />}
          title="Total Scrap"
          value={`${summary.scrap} kg`}
        />

      </div>

      {/* ================= PRODUCTION STATUS ================= */}

      <div className="bg-white p-6 rounded-2xl shadow-sm">

        <h2 className="text-lg font-semibold mb-4 text-purple-700">
          Production Status
        </h2>

        <div className="grid grid-cols-3 gap-4">

          {productionStages.map((stage, index) => (
            <div
              key={index}
              className="bg-purple-50 p-4 rounded-xl text-center"
            >
              <p className="text-sm text-gray-600">{stage.stage}</p>
              <p className="text-2xl font-bold text-purple-700">
                {stage.qty}
              </p>
            </div>
          ))}

        </div>
      </div>

      {/* ================= RAW MATERIAL STATUS ================= */}

      <div className="bg-white p-6 rounded-2xl shadow-sm">

        <h2 className="text-lg font-semibold mb-4 text-purple-700">
          Raw Material Status
        </h2>

        <table className="w-full text-left">

          <thead className="border-b">
            <tr>
              <th className="py-2">Material</th>
              <th>Available</th>
              <th>Minimum Level</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>

            {rawMaterials.map((material, index) => {

              const low = material.available < material.min;

              return (
                <tr key={index} className="border-b">

                  <td className="py-2">{material.name}</td>

                  <td>{material.available}</td>

                  <td>{material.min}</td>

                  <td>
                    {low ? (
                      <span className="text-red-500 flex items-center gap-1">
                        <FaTriangleExclamation />
                        Low
                      </span>
                    ) : (
                      <span className="text-green-600">OK</span>
                    )}
                  </td>

                </tr>
              );
            })}

          </tbody>

        </table>

      </div>

      {/* ================= LOWER SECTION ================= */}

      <div className="grid grid-cols-2 gap-6">

        {/* Scrap Summary */}

        <div className="bg-white p-6 rounded-2xl shadow-sm">

          <h2 className="text-lg font-semibold mb-4 text-purple-700">
            Scrap Summary
          </h2>

          <div className="space-y-2 text-gray-700">

            <p>Total Scrap Generated : <b>75 kg</b></p>
            <p>Used Scrap : <b>45 kg</b></p>
            <p>Unused Scrap : <b>30 kg</b></p>

          </div>

        </div>

        {/* Recent Activity */}

        <div className="bg-white p-6 rounded-2xl shadow-sm">

          <h2 className="text-lg font-semibold mb-4 text-purple-700">
            Recent Activities
          </h2>

          <ul className="space-y-2 text-gray-700">

            {activities.map((activity, index) => (
              <li key={index}>✔ {activity}</li>
            ))}

          </ul>

        </div>

      </div>

      {/* ================= LOW STOCK ALERT ================= */}

      <div className="bg-red-50 p-6 rounded-2xl border border-red-200">

        <h2 className="text-lg font-semibold text-red-600 mb-3">
          Low Stock Alerts
        </h2>

        <ul className="space-y-1">

          {rawMaterials
            .filter((m) => m.available < m.min)
            .map((item, index) => (
              <li key={index} className="text-red-600">
                ⚠ {item.name} stock is below minimum level
              </li>
            ))}

        </ul>

      </div>

    </div>
  );
}


/* ================= CARD COMPONENT ================= */

function Card({ icon, title, value }) {

  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm flex items-center gap-4">

      <div className="text-3xl text-purple-600">
        {icon}
      </div>

      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <p className="text-xl font-bold text-purple-700">{value}</p>
      </div>

    </div>
  );
}