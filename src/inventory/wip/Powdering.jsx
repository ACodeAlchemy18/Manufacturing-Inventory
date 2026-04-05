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

    console.log("ALL DATA:", data);

    const filtered = data.filter(
      (p) => p["Process Stage"] === "Powdering"
    );

    console.log("FILTERED:", filtered);

    setSavedData(filtered);
  };

  /* ================= INITIAL LOAD ================= */
useEffect(() => {
  const data = JSON.parse(localStorage.getItem("preAssembling")) || [];

  const filtered = data.filter(
    (p) =>
      p["Process Stage"] &&
      p["Process Stage"].trim().toLowerCase() === "powdering"
  );

  console.log("Powdering Data:", filtered); // ✅ debug

  setSavedData(filtered);
}, []);

  /* ================= OPEN FORM ================= */
  /* ================= OPEN FORM ================= */
  const openForm = (product) => {
    setSelectedProduct(product);

    setFormData({
  productName: product["Product Name"],
  wipId: product["WIP ID"],
  date: new Date().toISOString().split("T")[0],
incomingQty: Number(
  product?.phosphating?.outputQty ||
  product?.phosphating?.finishedQty ||
  product?.["Output Qty"] ||
  0
),

  powderType: "",
  colorCode: "",
  coatingThickness: "",
  ovenTemperature: "",
  curingTime: "",
  powderUsedQty: "",

  // ✅ SCRAP SYSTEM
  usableQty: 0,
  usableReason: "",
  usableCustomReason: "",

  unusableQty: 0,
  unusableReason: "",
  unusableCustomReason: "",

  finishedQty: product["Output Qty"] || 0,

  status: "Pending QC",
});

    setIsEditing(true);
    setIsViewing(false);
  };

  /* ================= SAVE ================= */
  const handleSave = () => {
   const data = JSON.parse(localStorage.getItem("preAssembling")) || [];

    const index = data.findIndex(
      (d) => d["WIP ID"] === formData.wipId
    );

    if (index === -1) return;

    // ✅ attach powdering data
    data[index].powdering = formData;

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

    const index = data.findIndex(
      (d) => d["WIP ID"] === product["WIP ID"] // ✅ FIXED (use unique ID)
    );

    if (index === -1) return;

    data[index]["Process Stage"] = "Final Assembly";
    data[index]["Current Status"] = "Pending";

    localStorage.setItem("preAssembling", JSON.stringify(data));

    alert(`${product["Product Name"]} moved to Final Assembly`);

    // ✅ reload updated data
    loadData();
  };

  /* ================= VIEW UI ================= */
  if (isViewing && viewData) {
    return (
      <div className="p-8 bg-gray-100 min-h-screen">
        <div className="max-w-5xl mx-auto bg-white p-6 rounded-xl shadow">

          <h2 className="text-xl font-semibold mb-4">
            {viewData["Product Name"]}
          </h2>

          <p><b>WIP ID:</b> {viewData["WIP ID"]}</p>
          <p><b>Process:</b> {viewData["Process Stage"]}</p>
          <p><b>Status:</b> {viewData["Current Status"]}</p>

          <button
            onClick={() => setIsViewing(false)}
            className="mt-4 bg-gray-300 px-4 py-2 rounded"
          >
            Back
          </button>
        </div>
      </div>
    );
  }

  /* ================= FORM UI ================= */
  if (isEditing) {
    return (
      <div className="p-8 bg-gray-100 min-h-screen">
        <div className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow">

          <h2 className="text-xl font-semibold mb-6">
            Powdering Entry
          </h2>

          <div className="grid grid-cols-2 gap-4">

            <input value={formData.productName} readOnly className="border p-2 bg-gray-100" />
            <input value={formData.wipId} readOnly className="border p-2 bg-gray-100" />

            <input type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="border p-2"
            />

            <input
              value={formData.incomingQty}
              readOnly
              className="border p-2 bg-gray-100"
            />

            <input
              placeholder="Powder Type"
              onChange={(e) => setFormData({ ...formData, powderType: e.target.value })}
              className="border p-2"
            />

            <input
              placeholder="Color Code"
              onChange={(e) => setFormData({ ...formData, colorCode: e.target.value })}
              className="border p-2"
            />

            <input
              placeholder="Coating Thickness"
              onChange={(e) => setFormData({ ...formData, coatingThickness: e.target.value })}
              className="border p-2"
            />

            <input
              placeholder="Oven Temperature"
              onChange={(e) => setFormData({ ...formData, ovenTemperature: e.target.value })}
              className="border p-2"
            />

            <input
              placeholder="Curing Time"
              onChange={(e) => setFormData({ ...formData, curingTime: e.target.value })}
              className="border p-2"
            />

            <input
              placeholder="Powder Used Qty"
              onChange={(e) => setFormData({ ...formData, powderUsedQty: e.target.value })}
              className="border p-2"
            />

            {/* 🔥 SCRAP SECTION */}
<div className="col-span-2 border p-3 rounded bg-gray-50">

  <h3 className="text-sm font-semibold mb-2">Scrap Details</h3>

  <div className="flex flex-col gap-3">

    {/* ✅ USABLE SCRAP */}
    <div className="flex gap-2">

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

      <select
        value={formData.usableReason}
        onChange={(e) =>
          setFormData({ ...formData, usableReason: e.target.value })
        }
        className="border p-2"
      >
        <option value="">Reason</option>
        <option>Rework</option>
        <option>Powder Recovery</option>
        <option>Carry Forward</option>
        <option>Other</option>
      </select>

      {formData.usableReason === "Other" && (
        <input
          type="text"
          placeholder="Enter reason"
          value={formData.usableCustomReason}
          onChange={(e) =>
            setFormData({
              ...formData,
              usableCustomReason: e.target.value,
            })
          }
          className="border p-2"
        />
      )}
    </div>

    {/* ❌ UNUSABLE SCRAP */}
    <div className="flex gap-2">

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

      <select
        value={formData.unusableReason}
        onChange={(e) =>
          setFormData({ ...formData, unusableReason: e.target.value })
        }
        className="border p-2"
      >
        <option value="">Reason</option>
        <option>Burnt</option>
        <option>Over Coating</option>
        <option>Defect</option>
        <option>Other</option>
      </select>

      {formData.unusableReason === "Other" && (
        <input
          type="text"
          placeholder="Enter reason"
          value={formData.unusableCustomReason}
          onChange={(e) =>
            setFormData({
              ...formData,
              unusableCustomReason: e.target.value,
            })
          }
          className="border p-2"
        />
      )}
    </div>

    {/* ✅ OUTPUT */}
    <div>
      <span className="bg-green-100 text-green-700 px-3 py-1 rounded text-sm">
        Finished Qty: {formData.finishedQty}
      </span>
    </div>
    <input
  value={formData.finishedQty}
  readOnly
  className="border p-2 bg-gray-100"
/>

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
                          if (p?.qc?.qcStatus !== "Approved") {
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