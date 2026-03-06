import { useEffect, useState } from "react";

export default function ProductionOverview() {

  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [stageData, setStageData] = useState(null);

  const [scrapSummary, setScrapSummary] = useState({
    usable: 0,
    unusable: 0,
    total: 0,
  });

  const [scrapData, setScrapData] = useState([]);

  const [visibleScrapStage, setVisibleScrapStage] = useState(null);

  const [showScrap, setShowScrap] = useState(false);
  const [scrapStage, setScrapStage] = useState("");

  const [scrapId,setScrapId] = useState("");
  const [material, setMaterial] = useState("");
  const [machine, setMachine] = useState("");
  const [dimension,setDimension] = useState("");
  const [scrapQty, setScrapQty] = useState("");
  const [scrapType, setScrapType] = useState("");
  const [reason, setReason] = useState("");

  useEffect(() => {
    loadProducts();
  }, []);

  /* ================= LOAD PRODUCTS ================= */

  const loadProducts = () => {
    const pre = JSON.parse(localStorage.getItem("preAssembling")) || [];
    const phos = JSON.parse(localStorage.getItem("phosphating_data")) || [];
    const powder = JSON.parse(localStorage.getItem("powderingData")) || [];

    const all = [...pre,...phos,...powder];

    const map = new Map();
    const unique = [];

    all.forEach((item)=>{
      const id = item["Product Name"] || item["WIP ID"];

      if(id && !map.has(id)){
        map.set(id,true);

        unique.push({
          productId:item["WIP ID"],
          productName:item["Product Name"]
        });
      }
    });

    setProducts(unique);
  };

  /* ================= VIEW PRODUCT ================= */

  const viewProduct = (product)=>{

    const pre = JSON.parse(localStorage.getItem("preAssembling")) || [];
    const phos = JSON.parse(localStorage.getItem("phosphating_data")) || [];
    const powder = JSON.parse(localStorage.getItem("powderingData")) || [];
    const scrap = JSON.parse(localStorage.getItem("scrapData")) || [];

    const preData = pre.filter(p=>p["WIP ID"]==product.productId);
    const phosData = phos.filter(p=>p["WIP ID"]==product.productId);
    const powderData = powder.filter(p=>p["WIP ID"]==product.productId);

    let usable=0;
    let unusable=0;

    scrap.forEach((s)=>{
      if(s.productId==product.productId){
        if(s.type==="Usable") usable+=Number(s.quantity);
        if(s.type==="Unusable") unusable+=Number(s.quantity);
      }
    });

    setScrapSummary({
      usable,
      unusable,
      total:usable+unusable
    });

    setScrapData(scrap.filter(
      s=>s.productId==product.productId
    ));

    setStageData({
      pre:preData,
      phos:phosData,
      powder:powderData
    });

    setSelectedProduct(product);
  };

  /* ================= OPEN SCRAP ================= */

  const openScrap=(stage)=>{
    setScrapStage(stage);
    setShowScrap(true);
  };

  /* ================= SAVE SCRAP ================= */

  const saveScrap=()=>{

    if(!scrapId || !material || !scrapQty || !scrapType)
      return alert("Fill required fields");

    const scrap=JSON.parse(localStorage.getItem("scrapData"))||[];

    scrap.push({
      scrapId,
      productId:selectedProduct.productId,
      stage:scrapStage,
      material,
      machine,
      dimension,
      quantity:Number(scrapQty),
      type:scrapType,
      reason,
      date:new Date().toLocaleDateString()
    });

    localStorage.setItem("scrapData",JSON.stringify(scrap));

    alert("Scrap Added");

    setScrapId("");
    setMaterial("");
    setMachine("");
    setDimension("");
    setScrapQty("");
    setScrapType("");
    setReason("");

    setShowScrap(false);

    viewProduct(selectedProduct);
  };

  /* ================= DELETE SCRAP ================= */

  const deleteScrap=(index)=>{

    const scrap=JSON.parse(localStorage.getItem("scrapData"))||[];

    const updated=scrap.filter((_,i)=>i!==index);

    localStorage.setItem("scrapData",JSON.stringify(updated));

    viewProduct(selectedProduct);
  };

  return(

    <div className="p-8 bg-gray-100 rounded-2xl">

      <h2 className="text-2xl font-semibold mb-6">
        Production Overview
      </h2>

      {!selectedProduct && (

        <div className="bg-white p-6 rounded-xl shadow">

          {products.map((prod,i)=>(
            <div key={i}
            className="flex justify-between border p-4 mb-3 rounded">

              <div>
                <p className="font-semibold">{prod.productId}</p>
                <p className="text-sm text-gray-500">{prod.productName}</p>
              </div>

              <button
              onClick={()=>viewProduct(prod)}
              className="bg-blue-600 text-white px-4 py-2 rounded">
                View Details
              </button>

            </div>
          ))}

        </div>

      )}

      {selectedProduct && stageData &&(

        <div className="bg-white p-6 rounded-xl shadow">

          <button
          onClick={()=>setSelectedProduct(null)}
          className="mb-4 text-blue-600">
            ← Back
          </button>

          <h3 className="text-xl font-semibold mb-6">
            {selectedProduct.productName}
          </h3>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <Card title="Usable Scrap" value={scrapSummary.usable}/>
            <Card title="Unusable Scrap" value={scrapSummary.unusable}/>
            <Card title="Total Scrap" value={scrapSummary.total}/>
          </div>

          {["Pre-Assembling","Phosphating","Powdering"].map(stage=>(
            <div key={stage}>

              <Stage
                title={stage}
                data={
                  stage==="Pre-Assembling"
                  ?stageData.pre
                  :stage==="Phosphating"
                  ?stageData.phos
                  :stageData.powder
                }
                onScrap={()=>openScrap(stage)}
                onViewScrap={()=>setVisibleScrapStage(
                  visibleScrapStage===stage?null:stage
                )}
                stage={stage}
              />

              {visibleScrapStage===stage &&(

                <ScrapTable
                  stage={stage}
                  scrap={scrapData}
                  deleteScrap={deleteScrap}
                />

              )}

            </div>
          ))}

        </div>

      )}

      {showScrap &&(

        <div className="fixed inset-0 bg-black/40 flex justify-center items-center">

          <div className="bg-white p-6 rounded-xl w-96">

            <h3 className="font-semibold mb-4">
              Add Scrap ({scrapStage})
            </h3>

            <input
            placeholder="Scrap ID"
            value={scrapId}
            onChange={(e)=>setScrapId(e.target.value)}
            className="border w-full p-2 mb-2"/>

            <input
            placeholder="Material"
            value={material}
            onChange={(e)=>setMaterial(e.target.value)}
            className="border w-full p-2 mb-2"/>

            <input
            placeholder="Machine"
            value={machine}
            onChange={(e)=>setMachine(e.target.value)}
            className="border w-full p-2 mb-2"/>

            <input
            placeholder="Dimension"
            value={dimension}
            onChange={(e)=>setDimension(e.target.value)}
            className="border w-full p-2 mb-2"/>

            <input
            type="number"
            placeholder="Scrap Quantity"
            value={scrapQty}
            onChange={(e)=>setScrapQty(e.target.value)}
            className="border w-full p-2 mb-2"/>

            <select
            value={scrapType}
            onChange={(e)=>setScrapType(e.target.value)}
            className="border w-full p-2 mb-2">

              <option value="">Select Scrap Type</option>
              <option value="Usable">Usable</option>
              <option value="Unusable">Unusable</option>

            </select>

            <select
            value={reason}
            onChange={(e)=>setReason(e.target.value)}
            className="border w-full p-2 mb-4">

              <option value="">Select Reason</option>
              <option>Cutting Loss</option>
              <option>Damage</option>
              <option>Rejection</option>
              <option>Process Loss</option>

            </select>

            <div className="flex gap-2">

              <button
              onClick={saveScrap}
              className="bg-blue-600 text-white px-4 py-2 rounded w-full">
                Save
              </button>

              <button
              onClick={()=>setShowScrap(false)}
              className="bg-gray-400 text-white px-4 py-2 rounded w-full">
                Cancel
              </button>

            </div>

          </div>

        </div>

      )}

    </div>

  );

}

/* ================= COMPONENTS ================= */

function Card({title,value}){
  return(
    <div className="bg-gray-100 p-4 rounded-lg">
      <p>{title}</p>
      <p className="text-xl font-bold">{value}</p>
    </div>
  );
}

function Stage({title,data,onScrap,onViewScrap,stage}){

  if(data.length===0)
    return(
      <div className="mb-6">
        <h4 className="font-semibold">{title}</h4>
        <p className="text-gray-500">No Data</p>
      </div>
    );

  let columns=Object.keys(data[0]);

  if(stage==="Pre-Assembling" || stage==="Phosphating"){
    columns=columns.filter(c=>c!=="Completed Qty");
  }

  return(

    <div className="mb-6">

      <div className="flex justify-between mb-2">

        <h4 className="font-semibold">{title}</h4>

        <div className="flex gap-2">

          <button
          onClick={onScrap}
          className="bg-red-500 text-white px-3 py-1 rounded">
            Add Scrap
          </button>

          <button
          onClick={onViewScrap}
          className="bg-blue-600 text-white px-3 py-1 rounded">
            View Scrap
          </button>

        </div>

      </div>

      <table className="min-w-full border text-sm">

        <thead className="bg-gray-50">

          <tr>
            {columns.map((c,i)=>(
              <th key={i} className="border px-3 py-2">{c}</th>
            ))}
          </tr>

        </thead>

        <tbody>

          {data.map((row,r)=>(
            <tr key={r}>
              {columns.map((col,i)=>(
                <td key={i} className="border px-3 py-2">
                  {row[col]}
                </td>
              ))}
            </tr>
          ))}

        </tbody>

      </table>

    </div>

  );

}

function ScrapTable({stage,scrap,deleteScrap}){

  const stageScrap=scrap
  .map((s,i)=>({...s,index:i}))
  .filter(s=>s.stage===stage);

  if(stageScrap.length===0)
    return <p className="text-gray-400 mb-4">No Scrap Added</p>;

  return(

    <table className="min-w-full border mb-6 text-sm">

      <thead className="bg-red-50">

        <tr>

          <th className="border px-2">Scrap ID</th>
          <th className="border px-2">Date</th>
          <th className="border px-2">Material</th>
          <th className="border px-2">Machine</th>
          <th className="border px-2">Dimension</th>
          <th className="border px-2">Type</th>
          <th className="border px-2">Quantity</th>
          <th className="border px-2">Reason</th>
          <th className="border px-2">Delete</th>

        </tr>

      </thead>

      <tbody>

        {stageScrap.map((s,i)=>(
          <tr key={i}>

            <td className="border px-2">{s.scrapId}</td>
            <td className="border px-2">{s.date}</td>
            <td className="border px-2">{s.material}</td>
            <td className="border px-2">{s.machine}</td>
            <td className="border px-2">{s.dimension}</td>
            <td className="border px-2">{s.type}</td>
            <td className="border px-2">{s.quantity}</td>
            <td className="border px-2">{s.reason}</td>

            <td className="border px-2 text-center">

              <button
              onClick={()=>deleteScrap(s.index)}
              className="text-red-600 font-bold">
                ✖
              </button>

            </td>

          </tr>
        ))}

      </tbody>

    </table>

  );

}