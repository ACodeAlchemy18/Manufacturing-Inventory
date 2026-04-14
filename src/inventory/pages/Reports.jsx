import { useState } from "react";

export default function ProductReport() {
  const [search, setSearch] = useState("");
  const [report, setReport] = useState(null);

  const generateReport = () => {
    const products = JSON.parse(localStorage.getItem("products")) || [];
    const pre = JSON.parse(localStorage.getItem("preAssembling")) || [];
    const phosphating = JSON.parse(localStorage.getItem("phosphating")) || [];
    const powdering = JSON.parse(localStorage.getItem("powdering")) || [];
    const qc = JSON.parse(localStorage.getItem("qualityInspection")) || [];
    const ft = JSON.parse(localStorage.getItem("functionalTesting")) || [];
    const rework = JSON.parse(localStorage.getItem("rework")) || [];
    const packaging = JSON.parse(localStorage.getItem("packagingData")) || [];
    const dispatch = JSON.parse(localStorage.getItem("dispatchData")) || [];
    const fg = JSON.parse(localStorage.getItem("finishedGoods")) || [];

    // 🔍 find product
    const product = products.find(
      (p) =>
        p.productId === search ||
        p.productName.toLowerCase() === search.toLowerCase()
    );

    if (!product) {
      alert("Product not found ❌");
      return;
    }

    // 🔥 collect all stage data
    const reportData = {
      product,

      preAssembling: pre.find(
        (p) => p["Product ID"] === product.productId
      ),

      phosphating: phosphating.find(
        (p) => p.productId === product.productId
      ),

      powdering: powdering.find(
        (p) => p.productId === product.productId
      ),

      quality: qc.find(
        (p) => p.productId === product.productId
      ),

      functional: ft.find(
        (p) => p.productId === product.productId
      ),

      rework: rework.find(
        (p) => p.product === product.productName
      ),

      packaging: packaging.find(
        (p) => p.productId === product.productId
      ),

      dispatch: dispatch.find(
        (p) => p.product === product.productName
      ),

      finished: fg.find(
        (p) => p.product === product.productName
      ),
    };

    setReport(reportData);
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">

      {/* SEARCH */}
      <div className="bg-white p-6 rounded shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">
          Product Report
        </h2>

        <div className="flex gap-3">
          <input
            placeholder="Enter Product ID or Name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border p-2 flex-1"
          />

          <button
            onClick={generateReport}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Generate Report
          </button>
        </div>
      </div>

      {/* REPORT */}
      {report && (
        <div className="bg-white p-6 rounded shadow">

          <h3 className="text-lg font-semibold mb-4">
            Product: {report.product.productName}
          </h3>

          <table className="w-full border text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-2">Stage</th>
                <th className="border p-2">Details</th>
                <th className="border p-2">Status</th>
              </tr>
            </thead>

            <tbody>

              {/* PRE-ASSEMBLING */}
              <tr>
                <td className="border p-2">Pre-Assembling</td>
                <td className="border p-2">
                  {report.preAssembling
                    ? `WIP ID: ${report.preAssembling["WIP ID"]}`
                    : "Not Done"}
                </td>
                <td className="border p-2">
                  {report.preAssembling
                    ? report.preAssembling["Current Status"]
                    : "-"}
                </td>
              </tr>

              {/* PHOSPHATING */}
              <tr>
                <td className="border p-2">Phosphating</td>
                <td className="border p-2">
                  {report.phosphating
                    ? report.phosphating.material || "-"
                    : "Not Done"}
                </td>
                <td className="border p-2">
                  {report.phosphating?.status || "-"}
                </td>
              </tr>

              {/* POWDERING */}
              <tr>
                <td className="border p-2">Powdering</td>
                <td className="border p-2">
                  {report.powdering
                    ? report.powdering.color || "-"
                    : "Not Done"}
                </td>
                <td className="border p-2">
                  {report.powdering?.status || "-"}
                </td>
              </tr>

              {/* QUALITY */}
              <tr>
                <td className="border p-2">Quality Inspection</td>
                <td className="border p-2">
                  {report.quality
                    ? report.quality.inspectionBy || "-"
                    : "Not Done"}
                </td>
                <td className="border p-2">
                  {report.quality?.status || "-"}
                </td>
              </tr>

              {/* FUNCTIONAL */}
              <tr>
                <td className="border p-2">Functional Testing</td>
                <td className="border p-2">
                  {report.functional
                    ? report.functional.result
                    : "Not Done"}
                </td>
                <td className="border p-2">
                  {report.functional?.result || "-"}
                </td>
              </tr>

              {/* REWORK */}
              <tr>
                <td className="border p-2">Rework</td>
                <td className="border p-2">
                  {report.rework
                    ? report.rework.reason
                    : "No Rework"}
                </td>
                <td className="border p-2">
                  {report.rework?.status || "-"}
                </td>
              </tr>

              {/* PACKAGING */}
              <tr>
                <td className="border p-2">Packaging</td>
                <td className="border p-2">
                  {report.packaging
                    ? report.packaging.packingType
                    : "Not Done"}
                </td>
                <td className="border p-2">
                  {report.packaging?.status || "-"}
                </td>
              </tr>

              {/* DISPATCH */}
              <tr>
                <td className="border p-2">Dispatch</td>
                <td className="border p-2">
                  {report.dispatch
                    ? report.dispatch.dispatchId
                    : "Not Done"}
                </td>
                <td className="border p-2">
                  {report.dispatch?.status || "-"}
                </td>
              </tr>

              {/* FINISHED GOODS */}
              <tr>
                <td className="border p-2">Finished Goods</td>
                <td className="border p-2">
                  {report.finished
                    ? `Qty: ${report.finished.qty}`
                    : "Not Available"}
                </td>
                <td className="border p-2">
                  {report.finished?.status || "-"}
                </td>
              </tr>

            </tbody>
          </table>

        </div>
      )}
    </div>
  );
}