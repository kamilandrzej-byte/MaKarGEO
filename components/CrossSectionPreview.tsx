import React from 'react';
import { CrossSection, Borehole, SoilType, WaterType, ProjectMetadata } from '../types';
import { getBackgroundColor, SoilPatternsDefs, SOIL_OPTIONS, getPatternDataUri } from '../constants';

interface Props {
  crossSection: CrossSection;
  boreholes: Borehole[];
  projectMetadata: ProjectMetadata;
}

const PX_PER_METER_Y = 40;
const PX_PER_METER_X = 5;
const BOREHOLE_WIDTH = 40;
const OFFSET_Y = 100; // Top offset for header info

const CrossSectionPreview: React.FC<Props> = ({ crossSection, boreholes, projectMetadata }) => {
  const selectedBoreholes = crossSection.boreholeIds
    .map(id => boreholes.find(b => b.id === id))
    .filter((b): b is Borehole => !!b);

  if (selectedBoreholes.length === 0) {
    return (
      <div className="bg-white p-20 rounded-xl shadow-inner text-center w-[297mm]">
        <p className="text-slate-500 font-bold">Wybierz co najmniej jeden otwór, aby zobaczyć przekrój</p>
      </div>
    );
  }

  // Parse elevations and find max/min for scaling
  const elevations = selectedBoreholes.map(b => parseFloat(b.header.elevation.replace(',', '.')) || 0);
  const maxElevation = Math.max(...elevations);
  const minElevation = Math.min(...elevations);
  
  const maxDepth = Math.max(...selectedBoreholes.map(b => 
    b.layers.length > 0 ? b.layers[b.layers.length - 1].depthBottom : 0
  ));

  // Calculate cumulative distances
  let currentX = 120; // Initial offset for scale
  const boreholePositions = selectedBoreholes.map((b, i) => {
    const pos = currentX;
    const elev = elevations[i];
    const elevDiff = maxElevation - elev;
    if (i < crossSection.distances.length) {
      currentX += crossSection.distances[i] * PX_PER_METER_X + 100;
    }
    return { borehole: b, x: pos, elevation: elev, yOffset: elevDiff * PX_PER_METER_Y };
  });

  const totalWidth = currentX + 120;
  const totalHeight = (maxElevation - minElevation + maxDepth) * PX_PER_METER_Y + OFFSET_Y + 250;

  // Helper to find stabilized water level
  const getStabilizedWater = (b: Borehole) => b.waterLevels.find(w => w.type === WaterType.Stabilized);

  return (
    <div className="bg-white p-8 shadow-2xl rounded-xl overflow-auto max-w-full font-serif">
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-bold uppercase text-black">Przekrój geologiczny</h2>
        <div className="flex justify-center gap-8 mt-4 text-xs font-bold text-black uppercase">
          <span>Skala pionowa: 1:100</span>
          <span>Skala pozioma: 1:{Math.round(100 / (PX_PER_METER_X / 5 * 100) * 100)}</span>
        </div>
      </div>

      <SoilPatternsDefs />

      <svg width={totalWidth} height={totalHeight} className="bg-white">
        {/* Vertical Scale (m n.p.m.) - LEFT */}
        <g transform={`translate(60, ${OFFSET_Y})`}>
          <line x1="0" y1="0" x2="0" y2={(maxElevation - minElevation + maxDepth) * PX_PER_METER_Y} stroke="#000" strokeWidth="1.5" />
          {Array.from({ length: Math.ceil(maxElevation - minElevation + maxDepth) + 2 }).map((_, i) => {
            const elevLabel = (maxElevation - i).toFixed(1);
            const y = i * PX_PER_METER_Y;
            return (
              <g key={i}>
                <line x1="-5" y1={y} x2="0" y2={y} stroke="#000" strokeWidth="1" />
                <text x="-10" y={y + 4} textAnchor="end" className="text-[10px] font-bold fill-black">{elevLabel}</text>
              </g>
            );
          })}
          <text x="-10" y="-15" textAnchor="end" className="text-[11px] font-bold fill-black uppercase">m n.p.m.</text>
        </g>

        {/* Vertical Scale (m n.p.m.) - RIGHT */}
        <g transform={`translate(${totalWidth - 60}, ${OFFSET_Y})`}>
          <line x1="0" y1="0" x2="0" y2={(maxElevation - minElevation + maxDepth) * PX_PER_METER_Y} stroke="#000" strokeWidth="1.5" />
          {Array.from({ length: Math.ceil(maxElevation - minElevation + maxDepth) + 2 }).map((_, i) => {
            const elevLabel = (maxElevation - i).toFixed(1);
            const y = i * PX_PER_METER_Y;
            return (
              <g key={i}>
                <line x1="0" y1={y} x2="5" y2={y} stroke="#000" strokeWidth="1" />
                <text x="10" y={y + 4} textAnchor="start" className="text-[10px] font-bold fill-black">{elevLabel}</text>
              </g>
            );
          })}
          <text x="10" y="-15" textAnchor="start" className="text-[11px] font-bold fill-black uppercase">m n.p.m.</text>
        </g>

        {/* Interpolated Layers */}
        {boreholePositions.map((pos, i) => {
          if (i === boreholePositions.length - 1) return null;
          const nextPos = boreholePositions[i + 1];
          
          const layers1 = pos.borehole.layers;
          const layers2 = nextPos.borehole.layers;
          const maxLayerCount = Math.max(layers1.length, layers2.length);

          return Array.from({ length: maxLayerCount }).map((_, lIdx) => {
            const l1 = layers1[lIdx];
            const l2 = layers2[lIdx];
            
            const prevL1 = lIdx === 0 ? { depthBottom: 0 } : layers1[lIdx - 1];
            const prevL2 = lIdx === 0 ? { depthBottom: 0 } : layers2[lIdx - 1];

            const yTop1 = (prevL1?.depthBottom || 0) * PX_PER_METER_Y + OFFSET_Y + pos.yOffset;
            const yBottom1 = (l1?.depthBottom || layers1[layers1.length-1]?.depthBottom || 0) * PX_PER_METER_Y + OFFSET_Y + pos.yOffset;
            
            const yTop2 = (prevL2?.depthBottom || 0) * PX_PER_METER_Y + OFFSET_Y + nextPos.yOffset;
            const yBottom2 = (l2?.depthBottom || layers2[layers2.length-1]?.depthBottom || 0) * PX_PER_METER_Y + OFFSET_Y + nextPos.yOffset;

            const soilType = l1?.soilType || l2?.soilType || SoilType.Fill;

            return (
              <g key={`${pos.borehole.id}-${lIdx}`}>
                <path 
                  d={`M ${pos.x + BOREHOLE_WIDTH/2} ${yTop1} 
                     L ${nextPos.x + BOREHOLE_WIDTH/2} ${yTop2} 
                     L ${nextPos.x + BOREHOLE_WIDTH/2} ${yBottom2} 
                     L ${pos.x + BOREHOLE_WIDTH/2} ${yBottom1} Z`}
                  fill={getBackgroundColor(soilType)}
                />
                <path 
                  d={`M ${pos.x + BOREHOLE_WIDTH/2} ${yTop1} 
                     L ${nextPos.x + BOREHOLE_WIDTH/2} ${yTop2} 
                     L ${nextPos.x + BOREHOLE_WIDTH/2} ${yBottom2} 
                     L ${pos.x + BOREHOLE_WIDTH/2} ${yBottom1} Z`}
                  fill={`url(#pattern-${soilType})`}
                  fillOpacity="0.8"
                  stroke="#000"
                  strokeWidth="0.5"
                />
              </g>
            );
          });
        })}

        {/* Water Level Line (Stabilized) */}
        {boreholePositions.map((pos, i) => {
          if (i === boreholePositions.length - 1) return null;
          const nextPos = boreholePositions[i + 1];
          const w1 = getStabilizedWater(pos.borehole);
          const w2 = getStabilizedWater(nextPos.borehole);

          if (w1 && w2) {
            const y1 = w1.depth * PX_PER_METER_Y + OFFSET_Y + pos.yOffset;
            const y2 = w2.depth * PX_PER_METER_Y + OFFSET_Y + nextPos.yOffset;
            return (
              <line 
                key={`water-line-${pos.borehole.id}`}
                x1={pos.x + BOREHOLE_WIDTH/2} y1={y1} 
                x2={nextPos.x + BOREHOLE_WIDTH/2} y2={y2} 
                stroke="#2563eb" strokeWidth="2" strokeDasharray="8,4" 
              />
            );
          }
          return null;
        })}

        {/* Boreholes and Info */}
        {boreholePositions.map((pos) => (
          <g key={pos.borehole.id} transform={`translate(${pos.x}, ${pos.yOffset + OFFSET_Y})`}>
            {/* Borehole Label (Fraction style) */}
            <g transform={`translate(${BOREHOLE_WIDTH/2}, -40)`}>
              <text textAnchor="middle" className="text-[14px] font-bold fill-black">{pos.borehole.header.boreholeId}</text>
              <line x1="-25" y1="4" x2="25" y2="4" stroke="#000" strokeWidth="1.5" />
              <text y="20" textAnchor="middle" className="text-[12px] font-bold fill-black">{pos.elevation.toFixed(2)}</text>
            </g>

            {/* Borehole Column Line */}
            <line 
              x1={BOREHOLE_WIDTH/2} y1="0" 
              x2={BOREHOLE_WIDTH/2} y2={pos.borehole.layers.length > 0 ? pos.borehole.layers[pos.borehole.layers.length - 1].depthBottom * PX_PER_METER_Y : 0} 
              stroke="#000" strokeWidth="2" 
            />

            {/* Layers in Borehole */}
            {pos.borehole.layers.map((layer, idx) => {
              const prevDepth = idx === 0 ? 0 : pos.borehole.layers[idx - 1].depthBottom;
              const height = (layer.depthBottom - prevDepth) * PX_PER_METER_Y;
              const y = prevDepth * PX_PER_METER_Y;
              const elev = pos.elevation - layer.depthBottom;

              return (
                <g key={layer.id}>
                  {/* Horizontal boundary tick */}
                  <line x1={BOREHOLE_WIDTH/2 - 5} y1={y + height} x2={BOREHOLE_WIDTH/2 + 5} y2={y + height} stroke="#000" strokeWidth="1" />
                  
                  {/* Elevation Label next to borehole */}
                  <text x={BOREHOLE_WIDTH/2 + 8} y={y + height + 4} className="text-[10px] font-bold fill-black">
                    {elev.toFixed(2)}
                  </text>
                  
                  {/* Layer Number */}
                  {layer.geoLayerNumber && (
                    <text x={BOREHOLE_WIDTH/2 - 15} y={y + height/2 + 4} textAnchor="middle" className="text-[10px] font-black fill-black italic">
                      {layer.geoLayerNumber}
                    </text>
                  )}
                </g>
              );
            })}

            {/* Water Symbols on Borehole (Only Stabilized) */}
            {pos.borehole.waterLevels.filter(w => w.type === WaterType.Stabilized).map(w => {
              const y = w.depth * PX_PER_METER_Y;
              return (
                <g key={w.id} transform={`translate(${BOREHOLE_WIDTH/2}, ${y})`}>
                  <path d="M-5 -10 L5 -10 L0 0 Z" fill="#2563eb" stroke="#2563eb" strokeWidth="1" />
                  <text x="8" y="-2" className="text-[9px] font-bold fill-blue-600">{w.depth.toFixed(2)}</text>
                </g>
              );
            })}
          </g>
        ))}

        {/* Bottom Distance Table */}
        <g transform={`translate(0, ${totalHeight - 120})`}>
          <line x1="60" y1="0" x2={totalWidth - 60} y2="0" stroke="#000" strokeWidth="1.5" />
          <line x1="60" y1="40" x2={totalWidth - 60} y2="40" stroke="#000" strokeWidth="1.5" />
          <line x1="60" y1="80" x2={totalWidth - 60} y2="80" stroke="#000" strokeWidth="1.5" />
          
          {boreholePositions.map((pos, i) => {
            const nextPos = boreholePositions[i + 1];
            return (
              <g key={pos.borehole.id}>
                {/* Vertical lines for boreholes in table */}
                <line x1={pos.x + BOREHOLE_WIDTH/2} y1="0" x2={pos.x + BOREHOLE_WIDTH/2} y2="80" stroke="#000" strokeWidth="1" />
                
                {/* Borehole ID in table */}
                <text x={pos.x + BOREHOLE_WIDTH/2} y="65" textAnchor="middle" className="text-[12px] font-bold fill-black">{pos.borehole.header.boreholeId}</text>
                
                {/* Distance between boreholes */}
                {nextPos && (
                  <text x={(pos.x + nextPos.x + BOREHOLE_WIDTH) / 2} y="25" textAnchor="middle" className="text-[11px] font-bold fill-black">
                    {crossSection.distances[i].toFixed(1)}m
                  </text>
                )}
              </g>
            );
          })}
          {/* Last vertical line */}
          <line x1={boreholePositions[boreholePositions.length-1].x + BOREHOLE_WIDTH/2} y1="0" x2={boreholePositions[boreholePositions.length-1].x + BOREHOLE_WIDTH/2} y2="80" stroke="#000" strokeWidth="1" />
        </g>
      </svg>

      {/* Legend at the bottom */}
      <div className="mt-10 border-t pt-6">
        <h3 className="text-sm font-bold uppercase mb-4 text-center">Legenda</h3>
        <div className="flex flex-wrap justify-center gap-6">
          {Object.values(SoilType).map(type => {
            const soilOption = SOIL_OPTIONS.find(o => o.value === type);
            if (!soilOption) return null;
            return (
              <div key={type} className="flex items-center gap-2">
                <div 
                  className="w-10 h-6 border border-black" 
                  style={{ 
                    backgroundColor: getBackgroundColor(type),
                    backgroundImage: `url(${getPatternDataUri(type)})`,
                    backgroundRepeat: 'repeat'
                  }}
                />
                <span className="text-[10px] font-bold uppercase">{soilOption.pl}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CrossSectionPreview;
