import { useEditorStore } from "../store/editorStore";
import { temperatureColor } from "../core/simulation/visualization/colormaps";
import * as THREE from "three";
import "./ThermalLegend.css";

const ThermalLegend = () => {
  const thermalRange = useEditorStore((s) => s.thermalRange);

  if (!thermalRange) {
    return null;
  }

  const VISUAL_MIN = 293.15;
  const VISUAL_MAX = 373.15;

  // Generate gradient stops
  const gradientStops = Array.from({ length: 100 }, (_, i) => {
    const t = i / 99;
    const Tnorm = THREE.MathUtils.clamp(t, 0, 1);
    const color = temperatureColor(Tnorm);
    return `rgb(${Math.round(color.r * 255)}, ${Math.round(color.g * 255)}, ${Math.round(
      color.b * 255
    )}) ${t * 100}%`;
  }).join(", ");

  const minRounded = thermalRange.min.toFixed(2);
  const maxRounded = thermalRange.max.toFixed(2);

  return (
    <div className="thermal-legend">
      <div className="legend-title">Temperature Range (K)</div>
      <div className="legend-gradient" style={{
        background: `linear-gradient(to right, ${gradientStops})`
      }}></div>
      <div className="legend-labels">
        <span className="legend-label">{minRounded}</span>
        <span className="legend-label">{maxRounded}</span>
      </div>
      <div className="legend-scale-info">
        Scale: {VISUAL_MIN.toFixed(2)}K - {VISUAL_MAX.toFixed(2)}K
      </div>
    </div>
  );
};

export default ThermalLegend;
