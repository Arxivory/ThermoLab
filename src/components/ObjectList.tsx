import { useEditorStore } from "../store/editorStore";
import TreeView from "./TreeView";

const sampleData = [
  {
    id: "engine",
    name: "Engine",
    children: [
      {
        id: "block",
        name: "Engine Block",
        children: [
          { id: "cylinders", name: "Cylinders" },
          { id: "pistons", name: "Pistons" },
          { id: "crankshaft", name: "Crankshaft" },
        ],
      },
      {
        id: "fuel-system",
        name: "Fuel System",
        children: [
          { id: "fuel-pump", name: "Fuel Pump" },
          { id: "fuel-injectors", name: "Fuel Injectors" },
          { id: "carburetor", name: "Carburetor" },
        ],
      },
      {
        id: "cooling-system",
        name: "Cooling System",
        children: [
          { id: "radiator", name: "Radiator" },
          { id: "water-pump", name: "Water Pump" },
          { id: "thermostat", name: "Thermostat" },
        ],
      },
      {
        id: "lubrication-system",
        name: "Lubrication System",
        children: [
          { id: "oil-pump", name: "Oil Pump" },
          { id: "oil-filter", name: "Oil Filter" },
          { id: "oil-pan", name: "Oil Pan" },
        ],
      },
      {
        id: "exhaust-system",
        name: "Exhaust System",
        children: [
          { id: "manifold", name: "Exhaust Manifold" },
          { id: "catalytic-converter", name: "Catalytic Converter" },
          { id: "muffler", name: "Muffler" },
        ],
      },
      {
        id: "ignition-system",
        name: "Ignition System",
        children: [
          { id: "spark-plugs", name: "Spark Plugs" },
          { id: "distributor", name: "Distributor" },
          { id: "ignition-coil", name: "Ignition Coil" },
        ],
      },
    ],
  },
];

const ObjectList = () => {
  const objects = useEditorStore((s) => s.objects);

  const data = Object.entries(objects).map(([key, obj]) => ({
    id: obj.id,
    name: obj.name,
    children: []
  }))

  return (
    <div className="object-list panel">
      <div className="panel-header">  
        <span className="panel-title">
          Objects
        </span>  
        <input type="text" placeholder="Search..." className="object-search"/>
      </div>
      <div className="panel-horizontal-separator"></div>
      <div className="panel-container">
        <TreeView data={data}/>
      </div>
    </div>
  )
}

export default ObjectList