import { useState, useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function ProductReport() {
  const [search, setSearch] = useState("");
  const [report, setReport] = useState(null);
  const reportRef = useRef();   // ✅ ADD THIS

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

      phosphating: pre.find(
        (p) => p["Product ID"] === product.productId
      )?.phosphating,

      powdering: pre.find(
        (p) => p["Product ID"] === product.productId
      )?.powdering,

      quality: qc.find(
        (q) =>
          q.productId === product.productId ||
          q.product === product.productName
      ),

      functional: ft.find(
        (p) =>
          p.productId === product.productId ||
          p.product === product.productName ||
          p.batch === reportData?.quality?.batch
      ),

      rework: rework.find(
        (r) => r.productId === product.productId
      ),

      packaging: packaging.find(
        (p) =>
          p.productId === product.productId ||
          p.batch === product.batch ||
          p.product === product.productName
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



 const downloadPDF = async () => {
  const input = reportRef.current;

  if (!input) return;

  const canvas = await html2canvas(input, { scale: 2 });
  const imgData = canvas.toDataURL("image/png");

  const pdf = new jsPDF("p", "mm", "a4");

  const imgWidth = 210;
  const pageHeight = 295;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  let heightLeft = imgHeight;
  let position = 0;

  pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
  heightLeft -= pageHeight;

  while (heightLeft > 0) {
    position = heightLeft - imgHeight;
    pdf.addPage();
    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
  }

  pdf.save("Product_Report.pdf");
};



  const DetailBlock = ({ children }) => (
  <div className="text-sm space-y-1 leading-relaxed">
    {children}
  </div>
);

const StatusBadge = ({ text, type = "default" }) => {
  const styles = {
    success: "bg-green-100 text-green-700",
    danger: "bg-red-100 text-red-700",
    warning: "bg-yellow-100 text-yellow-700",
    default: "bg-gray-100 text-gray-600",
  };

  return (
    <span className={`px-2 py-1 rounded text-xs ${styles[type]}`}>
      {text}
    </span>
  );
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
  <div ref={reportRef} className="bg-white p-6 rounded shadow">

          <div className="flex justify-between items-center mb-4">
  <h3 className="text-lg font-semibold">
    Product: {report.product.productName}
  </h3>

  <button
    onClick={downloadPDF}
    className="bg-green-600 text-white px-4 py-2 rounded"
  >
    Download PDF
  </button>
</div>
          <table className="w-full border text-sm border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-3 bg-gray-100">Stage</th>
<th className="border p-3 bg-gray-100">Details</th>
<th className="border p-3 bg-gray-100">Status</th>
              </tr>
            </thead>

            <tbody>

              {/* PRE-ASSEMBLING */}
              {/* PRE-ASSEMBLING */}
              <tr>
                <td className="border p-2 font-semibold">
                  Pre-Assembling
                </td>

                <td className="border p-2">
                  {report.preAssembling ? (
                    <div>

                      {/* WIP INFO */}
                      <div className="mb-2 text-sm">
                        <strong>WIP ID:</strong> {report.preAssembling["WIP ID"]}
                      </div>

                      {/* MATERIAL TABLE */}
                      <table className="w-full border text-xs">
                        <thead className="bg-gray-100">
                          <tr>
                            <th className="border p-1">Material</th>
                            <th className="border p-1">Input</th>
                            <th className="border p-1">Usable Scrap</th>
                            <th className="border p-1">Unusable Scrap</th>
                            <th className="border p-1">Output</th>
                          </tr>
                        </thead>

                        <tbody>
                          {report.preAssembling.materials.map((m, i) => (
                            <tr key={i}>
                              <td className="border p-1">{m.material}</td>

                              <td className="border p-1">{m.qty}</td>

                              {/* ✅ Usable */}
                              <td className="border p-1 text-green-600">
                                {m.usableQty
                                  ? `${m.usableQty} (${m.usableReason === "Other"
                                    ? m.usableCustomReason
                                    : m.usableReason})`
                                  : "-"}
                              </td>

                              {/* ❌ Unusable */}
                              <td className="border p-1 text-red-600">
                                {m.unusableQty
                                  ? `${m.unusableQty} (${m.unusableReason === "Other"
                                    ? m.unusableCustomReason
                                    : m.unusableReason})`
                                  : "-"}
                              </td>

                              <td className="border p-1">
                                {m.outputQty ?? m.qty}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>

                      {/* QC DETAILS */}
                      {report.preAssembling.qc && (
                        <div className="mt-3 text-xs border p-2 bg-gray-50">
                          <strong>QC:</strong><br />
                          Status: {report.preAssembling.qc.qcStatus} <br />
                          Checked By: {report.preAssembling.qc.qcCheckedBy} <br />
                          Date: {report.preAssembling.qc.qcDate} <br />
                          Remarks: {report.preAssembling.qc.qcRemarks}
                        </div>
                      )}

                    </div>
                  ) : (
                    "Not Done"
                  )}
                </td>

                <td className="border p-2">
                  {report.preAssembling
                    ? report.preAssembling["Current Status"]
                    : "-"}
                </td>
              </tr>

              {/* PHOSPHATING */}
              {/* PHOSPHATING */}
              <tr>
                <td className="border p-2 font-semibold">
                  Phosphating
                </td>

                <td className="border p-2">
                  {report.phosphating ? (
                    <div>

                      {/* BASIC INFO */}
                      <div className="mb-2 text-sm">
                        <strong>ID:</strong> {report.phosphating["Phosphating ID"]} <br />
                        <strong>Date:</strong> {report.phosphating.Date} <br />
                        <strong>Type:</strong> {report.phosphating["Phosphating Type"] || "-"}
                      </div>

                      {/* MATERIAL TABLE */}
                      <table className="w-full border text-xs">
                        <thead className="bg-gray-100">
                          <tr>
                            <th className="border p-1">Material</th>
                            <th className="border p-1">Input</th>
                            <th className="border p-1">Usable Scrap</th>
                            <th className="border p-1">Unusable Scrap</th>
                            <th className="border p-1">Output</th>
                          </tr>
                        </thead>

                        <tbody>
                          {report.phosphating.materials.map((m, i) => (
                            <tr key={i}>
                              <td className="border p-1">{m.material}</td>

                              <td className="border p-1">{m.qty}</td>

                              {/* ✅ Usable */}
                              <td className="border p-1 text-green-600">
                                {m.usableQty
                                  ? `${m.usableQty} (${m.usableReason === "Other"
                                    ? m.usableCustomReason
                                    : m.usableReason})`
                                  : "-"}
                              </td>

                              {/* ❌ Unusable */}
                              <td className="border p-1 text-red-600">
                                {m.unusableQty
                                  ? `${m.unusableQty} (${m.unusableReason === "Other"
                                    ? m.unusableCustomReason
                                    : m.unusableReason})`
                                  : "-"}
                              </td>

                              <td className="border p-1">
                                {m.outputQty ?? m.qty}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>

                      {/* QC DETAILS */}
                      {report.phosphating.qc && (
                        <div className="mt-3 text-xs border p-2 bg-gray-50">
                          <strong>QC:</strong><br />
                          Status: {report.phosphating.qc.qcStatus} <br />
                          Checked By: {report.phosphating.qc.qcCheckedBy} <br />
                          Date: {report.phosphating.qc.qcDate} <br />
                          Remarks: {report.phosphating.qc.qcRemarks}
                        </div>
                      )}

                    </div>
                  ) : (
                    "Not Done"
                  )}
                </td>

                <td className="border p-2">
                  {report.phosphating
                    ? report.phosphating["Current Status"]
                    : "-"}
                </td>
              </tr>

              {/* POWDERING */}
              {/* POWDERING */}
              <tr>
                <td className="border p-2">Powdering</td>

                <td className="border p-2">
                  {report.powdering ? (
                    <div className="text-xs space-y-1">

                      <div><b>ID:</b> {report.powdering.powderingId}</div>
                      <div><b>Date:</b> {report.powdering.date}</div>

                      <div><b>Powder Type:</b> {report.powdering.powderType}</div>
                      <div><b>Color Code:</b> {report.powdering.colorCode}</div>

                      <div><b>Coating Thickness:</b> {report.powdering.coatingThickness}</div>
                      <div><b>Oven Temp:</b> {report.powdering.ovenTemperature}</div>
                      <div><b>Curing Time:</b> {report.powdering.curingTime}</div>

                      <div><b>Powder Used:</b> {report.powdering.powderUsedQty}</div>

                      <div><b>Incoming Qty:</b> {report.powdering.incomingQty}</div>
                      <div><b>Finished Qty:</b> {report.powdering.finishedQty}</div>

                      {/* 🔥 SCRAP DETAILS */}
                      <div className="mt-2">
                        <b>Scrap:</b>

                        {report.powdering.usableQty ? (
                          <div className="text-green-600">
                            Usable: {report.powdering.usableQty} (
                            {report.powdering.usableReason === "Other"
                              ? report.powdering.usableCustomReason
                              : report.powdering.usableReason}
                            )
                          </div>
                        ) : null}

                        {report.powdering.unusableQty ? (
                          <div className="text-red-600">
                            Unusable: {report.powdering.unusableQty} (
                            {report.powdering.unusableReason === "Other"
                              ? report.powdering.unusableCustomReason
                              : report.powdering.unusableReason}
                            )
                          </div>
                        ) : null}

                        {!report.powdering.usableQty &&
                          !report.powdering.unusableQty && (
                            <div>No Scrap</div>
                          )}
                      </div>

                    </div>
                  ) : (
                    "Not Done"
                  )}
                  {report.powdering?.qc && (
                    <div className="mt-2 text-xs border-t pt-1">
                      <b>QC Details:</b>
                      <div>Status: {report.powdering.qc.qcStatus}</div>
                      <div>Checked By: {report.powdering.qc.qcCheckedBy}</div>
                      <div>Date: {report.powdering.qc.qcDate}</div>
                      <div>Remarks: {report.powdering.qc.qcRemarks}</div>
                    </div>
                  )}
                </td>


                {/* STATUS COLUMN */}
                <td className="border p-2">
                  {report.powdering?.qc
                    ? report.powdering.qc.qcStatus
                    : report.powdering?.status || "-"}
                </td>

              </tr>

              {/* QUALITY */}
              {/* QUALITY INSPECTION */}
              <tr>
                <td className="border p-2">Quality Inspection</td>

                <td className="border p-2">
                  {report.quality ? (
                    <div className="text-xs space-y-1">

                      <div><b>QC ID:</b> {report.quality.qcId}</div>
                      <div><b>Date:</b> {report.quality.date}</div>
                      <div><b>Inspector:</b> {report.quality.inspector}</div>

                      <div className="mt-2"><b>Checks:</b></div>

                      <div>Surface: {report.quality.surface || "-"}</div>
                      <div>Scratch: {report.quality.scratch || "-"}</div>
                      <div>Paint: {report.quality.paint || "-"}</div>
                      <div>Color: {report.quality.color || "-"}</div>
                      <div>Alignment: {report.quality.alignment || "-"}</div>

                      <div className="mt-2">
                        <b>Remarks:</b> {report.quality.remarks || "-"}
                      </div>

                    </div>
                  ) : (
                    "Not Done"
                  )}
                </td>

                {/* STATUS */}
                <td className="border p-2">
                  {report.quality ? (
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${report.quality.status === "Pass"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                        }`}
                    >
                      {report.quality.status}
                    </span>
                  ) : (
                    "-"
                  )}
                </td>
              </tr>
              {/* FUNCTIONAL */}
              <tr>
                <td className="border p-2 font-semibold">
                  Functional Testing
                </td>



                {/* FULL DETAILS */}
                <td className="border p-2 text-sm">
                  {report.functional ? (
                    <div className="space-y-1">

                      <div><b>Test ID:</b> {report.functional.testId}</div>
                      <div><b>Tested By:</b> {report.functional.testedBy || "-"}</div>
                      <div><b>Date:</b> {report.functional.date || "-"}</div>

                      <div><b>Functionality:</b> {report.functional.functionality || "-"}</div>
                      <div><b>Performance:</b> {report.functional.performance || "-"}</div>
                      <div><b>Safety:</b> {report.functional.safety || "-"}</div>

                      <div>
                        <b>Result:</b>{" "}
                        <span
                          className={`px-2 py-1 rounded text-xs ${report.functional.result === "Pass"
                              ? "bg-green-100 text-green-700"
                              : report.functional.result === "Fail"
                                ? "bg-red-100 text-red-700"
                                : "bg-gray-100 text-gray-500"
                            }`}
                        >
                          {report.functional.result || "Pending"}
                        </span>
                      </div>

                      <div><b>Remarks:</b> {report.functional.remarks || "-"}</div>

                    </div>
                  ) : (
                    <span className="text-gray-400">No Functional Testing Data</span>
                  )}
                </td>

                {/* STATUS */}
                <td className="border p-2">
                  {report.functional ? "Completed" : "Not Done"}
                </td>
              </tr>

              {/* REWORK */}
              {/* REWORK */}
              <tr>
                <td className="border p-2 font-semibold">
                  Rework
                </td>

                {/* STATUS */}
                <td className="border p-2">
                  {report.rework ? "Required" : "No Rework"}
                </td>

                {/* DETAILS */}
                <td className="border p-2 text-sm">
                  {report.rework ? (
                    <div className="space-y-1">

                      <div><b>Rework ID:</b> {report.rework.reworkId}</div>
                      <div><b>Batch:</b> {report.rework.batch}</div>

                      <div>
                        <b>Source:</b>{" "}
                        <span className="text-blue-600">
                          {report.rework.source || "Quality Inspection"}
                        </span>
                      </div>

                      <div><b>Reason:</b> {report.rework.reason || "-"}</div>

                      <div><b>Type:</b> {report.rework.reworkType || "-"}</div>
                      <div><b>Description:</b> {report.rework.description || "-"}</div>

                      <div><b>Done By:</b> {report.rework.doneBy || "-"}</div>
                      <div><b>Date:</b> {report.rework.date || "-"}</div>

                      <div>
                        <b>Status:</b>{" "}
                        <span
                          className={`px-2 py-1 rounded text-xs ${report.rework.reworkStatus === "Completed"
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                            }`}
                        >
                          {report.rework.reworkStatus || "Pending"}
                        </span>
                      </div>

                    </div>
                  ) : (
                    <span className="text-gray-400">
                      No Rework Data
                    </span>
                  )}
                </td>
              </tr>

              {/* PACKAGING */}
              {/* PACKAGING */}
              <tr>
                <td className="border p-2 font-semibold">
                  Packaging
                </td>



                {/* DETAILS */}
                <td className="border p-2 text-sm">
                  {report.packaging ? (
                    <div className="space-y-1">

                      <div><b>Pack ID:</b> {report.packaging.packId}</div>
                      <div><b>Batch:</b> {report.packaging.batch}</div>

                      <div><b>Packing Type:</b> {report.packaging.packingType || "-"}</div>
                      <div><b>Material:</b> {report.packaging.material || "-"}</div>

                      <div><b>Packed By:</b> {report.packaging.packedBy || "-"}</div>
                      <div><b>Date:</b> {report.packaging.date || "-"}</div>

                      <div><b>Quantity:</b> {report.packaging.qty || "-"}</div>

                      <div>
                        <b>Status:</b>{" "}
                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">
                          {report.packaging.status || "Packed"}
                        </span>
                      </div>

                    </div>
                  ) : (
                    <span className="text-gray-400">
                      No Packaging Data
                    </span>
                  )}
                </td>

                {/* STATUS */}
                <td className="border p-2">
                  {report.packaging ? "Completed" : "Not Done"}
                </td>
              </tr>


              {/* FINISHED GOODS */}
              {/* FINISHED GOODS */}
              <tr>
                <td className="border p-2 font-medium">
                  Finished Goods
                </td>

                {/* DETAILS */}
                <td className="border p-2 text-sm">
                  {report.finished ? (
                    <div className="space-y-1">

                      <div><b>FG ID:</b> {report.finished.fgId}</div>
                      <div><b>Batch:</b> {report.finished.batch}</div>

                      <div><b>Product:</b> {report.finished.product}</div>

                      <div><b>Quantity:</b> {report.finished.qty || "-"}</div>

                      <div><b>Packed By:</b> {report.finished.packedBy || "-"}</div>

                      <div><b>Date:</b> {report.finished.date || "-"}</div>

                      <div><b>Remarks:</b> {report.finished.remarks || "-"}</div>

                      <div>
                        <b>Status:</b>{" "}
                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">
                          {report.finished.status || "Finished"}
                        </span>
                      </div>

                    </div>
                  ) : (
                    <span className="text-gray-400">
                      No Finished Goods Data
                    </span>
                  )}
                </td>

                {/* STATUS */}
                <td className="border p-2">
                  {report.finished ? "Completed" : "Not Done"}
                </td>
              </tr>

              {/* DISPATCH */}
              {/* DISPATCH */}
              <tr>
  <td className="border p-3 font-semibold">Dispatch</td>

  {/* DETAILS */}
  <td className="border p-3">
    {report.dispatch ? (
      <DetailBlock>

        <div><b>Dispatch ID:</b> {report.dispatch.dispatchId}</div>
        <div><b>Batch:</b> {report.dispatch.batch}</div>
        <div><b>Product:</b> {report.dispatch.product}</div>

        <div><b>Destination:</b> {report.dispatch.destination || "-"}</div>
        <div><b>Transport:</b> {report.dispatch.transport || "-"}</div>

        <div><b>Dispatched By:</b> {report.dispatch.dispatchedBy || "-"}</div>
        <div><b>Date:</b> {report.dispatch.date || "-"}</div>

        <div><b>Remarks:</b> {report.dispatch.remarks || "-"}</div>

        <div>
          <b>Status:</b>{" "}
          <StatusBadge text={report.dispatch.status || "Dispatched"} type="success" />
        </div>

      </DetailBlock>
    ) : (
      <span className="text-gray-400">No Dispatch Data</span>
    )}
  </td>

  {/* STATUS */}
  <td className="border p-3 text-center">
    {report.dispatch ? (
      <StatusBadge text="Completed" type="success" />
    ) : (
      <StatusBadge text="Not Done" />
    )}
  </td>
</tr>


            </tbody>
          </table>

        </div>
      )}
    </div>
  );
}