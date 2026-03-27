import { useState, useEffect } from "react";

export default function ProductMaster() {
  const [products, setProducts] = useState([]);
  const [rawMaterials, setRawMaterials] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  const [product, setProduct] = useState({
    productId: "",
    productName: "",
    bom: [],
  });

  /* ================= LOAD DATA ================= */
  useEffect(() => {
    const savedProducts = JSON.parse(localStorage.getItem("products")) || [];
    const materials = JSON.parse(localStorage.getItem("rawMaterials")) || [];

    setProducts(savedProducts);
    setRawMaterials(materials);
  }, []);

  /* ================= ADD MATERIAL ================= */
  const addMaterial = () => {
    setProduct({
      ...product,
      bom: [...product.bom, { material: "", qty: "" }],
    });
  };

  /* ================= HANDLE CHANGE ================= */
  const handleChange = (index, field, value) => {
    const updated = [...product.bom];
    updated[index][field] = value;
    setProduct({ ...product, bom: updated });
  };

  /* ================= SAVE PRODUCT ================= */
  const saveProduct = () => {
    let updated;

    if (editIndex !== null) {
      updated = [...products];
      updated[editIndex] = product;
    } else {
      updated = [...products, product];
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

  /* ================= RESET ================= */
  const resetForm = () => {
    setProduct({
      productId: "",
      productName: "",
      bom: [],
    });
    setEditIndex(null);
    setIsAdding(false);
  };

  /* ================= START PRODUCTION ================= */
  const startProduction = (prod) => {
    let materials = [...rawMaterials];

    prod.bom.forEach((item) => {
      const index = materials.findIndex(
        (m) => m["Material Name"] === item.material
      );

      if (index !== -1) {
        const available = Number(materials[index]["Available Quantity"]);
        const required = Number(item.qty);

        materials[index]["Available Quantity"] =
          available - required;
      }
    });

    localStorage.setItem("rawMaterials", JSON.stringify(materials));
    setRawMaterials(materials);

    alert("Production Started & Stock Updated 🔥");
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

        <div className="bg-white rounded-xl border shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="border px-3 py-2">Product ID</th>
                <th className="border px-3 py-2">Product Name</th>
                <th className="border px-3 py-2">Materials</th>
                <th className="border px-3 py-2">Action</th>
              </tr>
            </thead>

            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center p-4">
                    No Products Found
                  </td>
                </tr>
              ) : (
                products.map((p, i) => (
                  <tr key={i}>
                    <td className="border px-3 py-2">{p.productId}</td>
                    <td className="border px-3 py-2">{p.productName}</td>

                    <td className="border px-3 py-2">
                      {p.bom.map((b, j) => (
                        <div key={j}>
                          {b.material} - {b.qty}
                        </div>
                      ))}
                    </td>

                    <td className="border px-3 py-2 space-x-2">
                      <button
                        onClick={() => startProduction(p)}
                        className="bg-green-600 text-white px-2 py-1 rounded"
                      >
                        Start
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

  /* ================= ADD / EDIT FORM ================= */

  return (
    <div className="p-8 bg-gray-100 rounded-2xl">
      <h2 className="text-2xl font-semibold mb-4">
        {editIndex !== null ? "Edit Product" : "Add Product"}
      </h2>

      {/* Product ID */}
      <input
        type="text"
        placeholder="Product ID"
        value={product.productId}
        onChange={(e) =>
          setProduct({ ...product, productId: e.target.value })
        }
        className="border px-3 py-2 rounded w-full mb-3"
      />

      {/* Product Name */}
      <input
        type="text"
        placeholder="Product Name"
        value={product.productName}
        onChange={(e) =>
          setProduct({ ...product, productName: e.target.value })
        }
        className="border px-3 py-2 rounded w-full mb-4"
      />

      {/* BOM TABLE */}
      <table className="w-full bg-white border rounded">
        <thead>
          <tr className="bg-gray-50">
            <th className="border px-3 py-2">Material</th>
            <th className="border px-3 py-2">Qty</th>
            <th className="border px-3 py-2">Action</th>
          </tr>
        </thead>

        <tbody>
          {product.bom.map((row, index) => (
            <tr key={index}>
              <td className="border px-3 py-2">
                <select
                  value={row.material}
                  onChange={(e) =>
                    handleChange(index, "material", e.target.value)
                  }
                  className="w-full border rounded px-2 py-1"
                >
                  <option value="">Select Material</option>

                  {rawMaterials.map((rm, i) => (
                    <option key={i} value={rm["Material Name"]}>
                      {rm["Material Name"]} (
                      {rm["Available Quantity"]})
                    </option>
                  ))}
                </select>
              </td>

              <td className="border px-3 py-2">
                <input
                  type="number"
                  value={row.qty}
                  onChange={(e) =>
                    handleChange(index, "qty", e.target.value)
                  }
                  className="w-full border rounded px-2 py-1"
                />
              </td>

              <td className="border text-center">
                <button
                  onClick={() => {
                    const updated = product.bom.filter(
                      (_, i) => i !== index
                    );
                    setProduct({ ...product, bom: updated });
                  }}
                  className="text-red-600"
                >
                  ❌
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* BUTTONS */}
      <div className="flex gap-3 mt-4">
        <button
          onClick={addMaterial}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          + Add Material
        </button>

        <button
          onClick={saveProduct}
          className="bg-black text-white px-4 py-2 rounded"
        >
          Save
        </button>

        <button
          onClick={resetForm}
          className="bg-gray-400 text-white px-4 py-2 rounded"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}