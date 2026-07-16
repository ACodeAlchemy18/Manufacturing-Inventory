import { useState, useEffect } from "react";

export default function Packaging() {
  const [packData, setPackData] = useState([]);
  const [savedData, setSavedData] = useState([]);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [viewData, setViewData] = useState(null);

  const [formData, setFormData] = useState({
    packId: "",
    product: "",
    batch: "",
    packingType: "",
    material: "",
    packedBy: "",
    date: "",
    qty: "",
    status: "",
  });

  /* ================= LOAD DATA ================= */
  useEffect(() => {
    const pack = JSON.parse(localStorage.getItem("packaging")) || [];
    const saved = JSON.parse(localStorage.getItem("packagingData")) || [];

    setPackData(pack);
    setSavedData(saved);
  }, []);

  /* ================= OPEN FORM ================= */
  const handlePack = (product) => {
    setSelectedProduct(product);

    setFormData({
      packId: `P${Date.now()}`,
      product: product.product,
      batch: product.batch,
       productId: product.productId, // ✅ ADD THIS
      packingType: "",
      material: "",
      packedBy: "",
      date: new Date().toISOString().split("T")[0],
      qty: "",
      status: "Packed",
    });
  };

  /* ================= HANDLE CHANGE ================= */
  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  /* ================= SAVE ================= */
 const handleSave = () => {
  let updated;

  const finalData = {
    ...formData,
    productId:
      formData.productId || selectedProduct?.productId,
  };

  const index = savedData.findIndex(
    (item) => item.packId === finalData.packId
  );

  if (index !== -1) {
    updated = [...savedData];
    updated[index] = finalData;
  } else {
    updated = [...savedData, finalData];
  }

  setSavedData(updated);
  localStorage.setItem("packagingData", JSON.stringify(updated));

  alert("Saved Successfully ✅");
  setSelectedProduct(null);
};

//updateproductstege
const updateProductStage = (productId, newStage) => {
  const products =
    JSON.parse(localStorage.getItem("products")) || [];

  const updated = products.map((p) =>
    p.productId === productId
      ? { ...p, stage: newStage, status: newStage }
      : p
  );

  localStorage.setItem("products", JSON.stringify(updated));
};

  /* ================= VIEW ================= */
  const handleView = (product) => {
    const data = savedData.find((p) => p.batch === product.batch);

    if (!data) {
      alert("No Packaging Data ❌");
      return;
    }

    setViewData(data);
  };

  /* ================= MOVE ================= */
const handleMove = (product) => {
  const pack = savedData.find(
    (p) => p.batch === product.batch
  );

  if (!pack) {
    alert("Packaging not done ❌");
    return;
  }

  // 🔥 CHECK PACKING COMPLETED
  if (!pack.status || pack.status !== "Packed") {
    alert("Complete Packaging First ⚠️");
    return;
  }

  // ================= MOVE → FINISHED GOODS =================
const finished =
  JSON.parse(localStorage.getItem("finishedGoods")) || [];

const newFG = {
  fgId: `FG${Date.now()}`,
  productId: pack.productId,   // ✅ Added Product ID
  product: pack.product,
  batch: pack.batch,
  qty: pack.qty,
  packingType: pack.packingType,
  status: "Ready",
  date: new Date().toISOString().split("T")[0],
};
  localStorage.setItem(
    "finishedGoods",
    JSON.stringify([...finished, newFG])
  );

  // 🔥 UPDATE PRODUCT MASTER
updateProductStage(pack.productId, "Finished Goods");

  // ================= REMOVE FROM PACKAGING =================
  const updated = packData.filter(
    (p) => p.batch !== product.batch
  );

  setPackData(updated);
  localStorage.setItem("packaging", JSON.stringify(updated));


  alert("Moved to Finished Goods ✅");
};



  /* ================= EDIT ================= */
const handleEdit = (data) => {
  setSelectedProduct(true);   // open form

  setFormData({
    ...data,                  // load full data into form
  });

  setViewData(null);          // close view page
};


  /* ================= DELETE ================= */
const handleDelete = (id) => {
  const confirmDelete = window.confirm("Are you sure to delete?");
  if (!confirmDelete) return;

  const updated = savedData.filter(
    (item) => item.packId !== id
  );

  setSavedData(updated);
  localStorage.setItem("packagingData", JSON.stringify(updated));

  alert("Deleted Successfully ✅");
  setViewData(null);
};

  /* ================= VIEW PAGE ================= */
  if (viewData) {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-lg p-6">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6 border-b pb-3">
          <h2 className="text-2xl font-semibold text-gray-700">
            Packaging - {viewData.product}
          </h2>

          <button
            onClick={() => setViewData(null)}
            className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded"
          >
            Back
          </button>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto border rounded-lg">
          <table className="min-w-[1000px] w-full text-sm">

            {/* HEADER */}
            <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
              <tr>
                <th className="px-4 py-3">Pack ID</th>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Batch</th>
                <th className="px-4 py-3">Packing Type</th>
                <th className="px-4 py-3">Material</th>
                <th className="px-4 py-3">Packed By</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Qty</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-center">Action</th>
              </tr>
            </thead>

            {/* BODY */}
            <tbody>
              <tr className="border-t hover:bg-gray-50">

                <td className="px-4 py-3">{viewData.packId}</td>
                <td className="px-4 py-3">{viewData.product}</td>
                <td className="px-4 py-3">{viewData.batch}</td>
                <td className="px-4 py-3">{viewData.packingType || "-"}</td>
                <td className="px-4 py-3">{viewData.material || "-"}</td>
                <td className="px-4 py-3">{viewData.packedBy || "-"}</td>
                <td className="px-4 py-3">{viewData.date || "-"}</td>
                <td className="px-4 py-3">{viewData.qty || "-"}</td>

                {/* STATUS BADGE */}
                <td className="px-4 py-3">
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs">
                    {viewData.status || "Packed"}
                  </span>
                </td>

                {/* ACTION */}
                <td className="px-4 py-3 text-center">
                  <div className="flex justify-center gap-2">

                    {/* EDIT */}
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

                    {/* DELETE */}
                    <button
                      onClick={() => {
                        const confirmDelete = window.confirm("Delete?");
                        if (!confirmDelete) return;

                        const updated = savedData.filter(
                          (item) => item.packId !== viewData.packId
                        );

                        setSavedData(updated);
                        localStorage.setItem("packagingData", JSON.stringify(updated));

                        alert("Deleted ✅");
                        setViewData(null);
                      }}
                      className="bg-red-600 text-white px-3 py-1 rounded text-xs"
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
        Packaging
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
            {packData.length === 0 ? (
              <tr>
                <td colSpan="3" className="text-center py-6 text-gray-400">
                  No Products Available
                </td>
              </tr>
            ) : (
              packData.map((p, i) => (
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
                        onClick={() => handlePack(p)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium shadow"
                      >
                        Packing
                      </button>

                      <button
                        onClick={() => handleView(p)}
                        className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium shadow"
                      >
                        View
                      </button>

                      <button
                        onClick={() => handleMove(p)}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm font-medium shadow"
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

  /* ================= FORM ================= */
  return (
    <div className="p-8 bg-gray-100">

      <div className="bg-white p-6 rounded shadow grid grid-cols-2 gap-4">

        <input value={formData.packId} disabled className="border p-2" />
        <input value={formData.product} disabled className="border p-2" />
        <input value={formData.batch} disabled className="border p-2" />

        <input
          placeholder="Packing Type"
          onChange={(e) => handleChange("packingType", e.target.value)}
          className="border p-2"
        />

        <input
          placeholder="Material Used"
          onChange={(e) => handleChange("material", e.target.value)}
          className="border p-2"
        />

        <input
          placeholder="Packed By"
          onChange={(e) => handleChange("packedBy", e.target.value)}
          className="border p-2"
        />

        <input
          type="date"
          value={formData.date}
          onChange={(e) => handleChange("date", e.target.value)}
          className="border p-2"
        />

        <input
          placeholder="Quantity"
          onChange={(e) => handleChange("qty", e.target.value)}
          className="border p-2"
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