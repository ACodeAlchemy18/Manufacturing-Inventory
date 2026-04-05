import { useState, useEffect } from "react";

export default function ProductMaster() {
  const [products, setProducts] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  const [product, setProduct] = useState({
    productId: "",
    productName: "",
    status: "Pending",
  });

  /* ================= LOAD DATA ================= */
  useEffect(() => {
    const savedProducts = JSON.parse(localStorage.getItem("products")) || [];
    setProducts(savedProducts);
  }, []);

  /* ================= SAVE PRODUCT ================= */
  const saveProduct = () => {
    let updated;

    if (!product.productId || !product.productName) {
      alert("Please fill all fields");
      return;
    }

    if (editIndex !== null) {
      updated = [...products];
      updated[editIndex] = product;
    } else {
      updated = [...products, { ...product, status: "Pending" }];
    }

    setProducts(updated);
    localStorage.setItem("products", JSON.stringify(updated));

    alert("Product Saved ✅");
    resetForm();
  };

  /* ================= EDIT ================= */
  const editProduct = (index) => {
    setProduct(products[index]);
    setEditIndex(index);
    setIsAdding(true);
  };

  /* ================= DELETE ================= */
  const deleteProduct = (index) => {
    const updated = products.filter((_, i) => i !== index);
    setProducts(updated);
    localStorage.setItem("products", JSON.stringify(updated));
  };

  /* ================= MOVE TO WIP ================= */
  const moveToWIP = (index) => {
    let updatedProducts = [...products];

    const prod = updatedProducts[index];

    // prevent duplicate move
    if (prod.status === "Moved") {
      alert("Already moved to WIP");
      return;
    }

    const existingWIP =
      JSON.parse(localStorage.getItem("preAssembling")) || [];

    const newItem = {
      wipId: Date.now(),
      productId: prod.productId,
      productName: prod.productName,
      quantity: 1,
      status: "In Progress",
    };

    // update WIP
    const updatedWIP = [...existingWIP, newItem];
    localStorage.setItem("preAssembling", JSON.stringify(updatedWIP));

    // update product status
    updatedProducts[index].status = "Moved";

    setProducts(updatedProducts);
    localStorage.setItem("products", JSON.stringify(updatedProducts));

    alert("Moved to WIP 🚀");
  };

  /* ================= RESET ================= */
  const resetForm = () => {
    setProduct({
      productId: "",
      productName: "",
      status: "Pending",
    });
    setEditIndex(null);
    setIsAdding(false);
  };

  /* ================= VIEW MODE ================= */
  if (!isAdding) {
    return (
      <div className="p-8 bg-gray-100 rounded-2xl">
        <div className="flex justify-between mb-6">
          <h2 className="text-2xl font-semibold">Product Master</h2>

          <button
            onClick={() => setIsAdding(true)}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg"
          >
            + Add Product
          </button>
        </div>

        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
          <table className="w-full text-sm text-center">
            <thead className="bg-gray-50">
              <tr>
                <th className="border px-3 py-2">Product ID</th>
                <th className="border px-3 py-2">Product Name</th>
                <th className="border px-3 py-2">Status</th>
                <th className="border px-3 py-2">Action</th>
              </tr>
            </thead>

            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-4">
                    No Products Found
                  </td>
                </tr>
              ) : (
                products.map((p, i) => (
                  <tr key={i}>
                    <td className="border px-3 py-2">{p.productId}</td>
                    <td className="border px-3 py-2">{p.productName}</td>

                    {/* STATUS */}
                    <td className="border px-3 py-2">
                      {p.status === "Moved" ? (
                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">
                          Moved to WIP
                        </span>
                      ) : (
                        <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs">
                          Pending
                        </span>
                      )}
                    </td>

                    {/* ACTIONS */}
                    <td className="border px-3 py-2 space-x-2">
                      <button
                        onClick={() => moveToWIP(i)}
                        disabled={p.status === "Moved"}
                        className={`px-2 py-1 rounded text-white ${
                          p.status === "Moved"
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-green-600"
                        }`}
                      >
                        {p.status === "Moved"
                          ? "Moved"
                          : "Move to WIP"}
                      </button>

                      <button
                        onClick={() => editProduct(i)}
                        className="text-blue-600"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => deleteProduct(i)}
                        className="text-red-600"
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

  /* ================= FORM ================= */

  return (
    <div className="p-8 bg-gray-100 rounded-2xl">
      <h2 className="text-2xl font-semibold mb-6">
        {editIndex !== null ? "Edit Product" : "Add Product"}
      </h2>

      <div className="bg-white p-6 rounded-xl shadow border max-w-3xl">
        
        {/* ROW 1 */}
        <div className="grid grid-cols-3 gap-4 items-center mb-4">
          <label>Product ID</label>
          <input
            type="text"
            value={product.productId}
            onChange={(e) =>
              setProduct({ ...product, productId: e.target.value })
            }
            className="col-span-2 border px-3 py-2 rounded"
          />
        </div>

        {/* ROW 2 */}
        <div className="grid grid-cols-3 gap-4 items-center mb-4">
          <label>Product Name</label>
          <input
            type="text"
            value={product.productName}
            onChange={(e) =>
              setProduct({ ...product, productName: e.target.value })
            }
            className="col-span-2 border px-3 py-2 rounded"
          />
        </div>

        {/* BUTTONS */}
        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={saveProduct}
            className="bg-blue-600 text-white px-5 py-2 rounded"
          >
            Save
          </button>

          <button
            onClick={resetForm}
            className="bg-gray-400 text-white px-5 py-2 rounded"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}