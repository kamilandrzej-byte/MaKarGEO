
import React from 'react';
import { Borehole, WaterType, ProjectMetadata } from '../types';
import { getPatternDataUri, SoilPatternsDefs, getBackgroundColor } from '../constants';

interface Props {
  data: Borehole;
  projectMetadata: ProjectMetadata;
}

const PX_PER_METER = 75;

const WaterSymbol: React.FC<{ type: WaterType; depth: number; side?: 'left' | 'right' }> = ({ type, depth, side }) => {
  const size = 10;
  const isRight = side === 'right';
  
  return (
    <div 
      className="absolute flex flex-col items-center" 
      style={{ 
        top: depth * PX_PER_METER - size - 12, // Move up to accommodate text above
        left: isRight ? '50px' : '10px',
        transform: 'translateX(-50%)',
        width: '30px'
      }}
    >
      <span className="text-[8px] font-bold text-blue-600 mb-0.5 leading-none bg-white/90 px-0.5 rounded z-10">{depth.toFixed(2)}</span>
      <div className="relative flex flex-col items-center">
        {type === WaterType.Stabilized && (
          <svg width={size} height={size} viewBox="0 0 24 24" className="text-blue-600 fill-current">
            <path d="M12 21l-12-18h24z" />
          </svg>
        )}
        {type === WaterType.Encountered && (
          <svg width={size} height={size} viewBox="0 0 24 24" className="text-blue-600 fill-none stroke-current stroke-[3]">
            <path d="M12 21l-12-18h24z" />
          </svg>
        )}
        {type === WaterType.Seepage && (
          <div className="flex flex-col items-center">
            <svg width={size} height={size} viewBox="0 0 24 24" className="text-blue-600 fill-current">
              <path d="M12 21l-12-18h24z" />
            </svg>
            <svg width={size/2} height={size} viewBox="0 0 12 24" className="text-blue-600 fill-none stroke-current stroke-[2] -mt-0.5">
              <path d="M6 0c-3 3-3 6 0 9s3 6 0 9-3 6-3 6" />
            </svg>
          </div>
        )}
        {/* Horizontal line under triangle */}
        {type !== WaterType.Seepage && (
          <div className="w-[16px] h-px bg-blue-600 -mt-px"></div>
        )}
      </div>
    </div>
  );
};

const ReportPreview: React.FC<Props> = ({ data, projectMetadata }) => {
  const { header, layers, waterLevels = [] } = data;

  const totalDepth = layers.length > 0 ? layers[layers.length - 1].depthBottom : 0;
  
  // Logic to pair Encountered and Stabilized water levels
  const renderWaterLevels = () => {
    const encountered = waterLevels.filter(w => w.type === WaterType.Encountered);
    const stabilized = waterLevels.filter(w => w.type === WaterType.Stabilized);
    const seepages = waterLevels.filter(w => w.type === WaterType.Seepage);

    const elements: React.ReactNode[] = [];
    const pairedEncIds = new Set<string>();
    const pairedStabIds = new Set<string>();

    // Try to pair them (simple heuristic: order of appearance)
    const pairCount = Math.min(encountered.length, stabilized.length);
    for (let i = 0; i < pairCount; i++) {
      const enc = encountered[i];
      const stab = stabilized[i];
      pairedEncIds.add(enc.id);
      pairedStabIds.add(stab.id);

      const diff = Math.abs(enc.depth - stab.depth);
      const isSameLevel = diff < 0.01;

      if (!isSameLevel) {
        // Draw connection line
        elements.push(
          <svg key={`line-${enc.id}`} className="absolute w-full h-full overflow-visible pointer-events-none">
            <line 
              x1="10" y1={stab.depth * PX_PER_METER} 
              x2="50" y2={enc.depth * PX_PER_METER} 
              stroke="#2563eb" strokeWidth="1" 
            />
          </svg>
        );
        elements.push(<WaterSymbol key={stab.id} type={WaterType.Stabilized} depth={stab.depth} side="left" />);
        elements.push(<WaterSymbol key={enc.id} type={WaterType.Encountered} depth={enc.depth} side="right" />);
      } else {
        // Side by side
        elements.push(
          <div key={`pair-${enc.id}`} className="absolute w-full flex flex-col items-center" style={{ top: enc.depth * PX_PER_METER - 22, left: '30px', transform: 'translateX(-50%)' }}>
            <span className="text-[8px] font-bold text-blue-600 mb-0.5 leading-none bg-white/90 px-0.5 rounded">{enc.depth.toFixed(2)}</span>
            <div className="relative flex flex-col items-center">
              <div className="flex items-center gap-1">
                <svg width="10" height="10" viewBox="0 0 24 24" className="text-blue-600 fill-current">
                  <path d="M12 21l-12-18h24z" />
                </svg>
                <svg width="10" height="10" viewBox="0 0 24 24" className="text-blue-600 fill-none stroke-current stroke-[3]">
                  <path d="M12 21l-12-18h24z" />
                </svg>
              </div>
              <div className="w-[24px] h-px bg-blue-600 -mt-px"></div>
            </div>
          </div>
        );
      }
    }

    // Render remaining unpaired levels
    encountered.filter(w => !pairedEncIds.has(w.id)).forEach(w => {
      elements.push(<WaterSymbol key={w.id} type={w.type} depth={w.depth} side="right" />);
    });
    stabilized.filter(w => !pairedStabIds.has(w.id)).forEach(w => {
      elements.push(<WaterSymbol key={w.id} type={w.type} depth={w.depth} side="left" />);
    });

    // Render seepages
    seepages.forEach(w => {
      elements.push(<WaterSymbol key={w.id} type={w.type} depth={w.depth} side="left" />);
    });

    return elements;
  };

  return (
    <div className="bg-white shadow-2xl print:shadow-none mx-auto w-[210mm] min-h-[297mm] flex flex-col print:m-0 print:w-[210mm] print:min-h-0">
      <div className="p-10 print:p-[15mm] flex-1 flex flex-col text-[11px] font-sans text-black overflow-visible">
        
        <SoilPatternsDefs />

        {/* HEADER BLOCK */}
        <div className="border-[1.5px] border-black mb-0 divide-y-[1.5px] divide-black print:border-black">
            <div className="grid grid-cols-[1.5fr_2fr_1.2fr] divide-x-[1.5px] divide-black">
                <div className="p-3">
                    <div className="font-bold text-lg leading-tight mb-1 uppercase tracking-tight">{projectMetadata.companyName}</div>
                    <div className="text-[10px] text-gray-700">{projectMetadata.companyAddress}</div>
                </div>
                <div className="text-center p-3 flex flex-col justify-center bg-gray-50 print:bg-white">
                    <div className="font-black text-2xl tracking-tighter uppercase">Karta Otworu</div>
                    <div className="font-bold text-sm text-gray-600">NR {header.boreholeId}</div>
                </div>
                <div className="divide-y divide-black text-[10px]">
                     <div className="p-2 flex justify-between"><span>Zał. Nr:</span> <span className="font-bold">{projectMetadata.projectNumber}</span></div>
                     <div className="p-2 flex justify-between"><span>Wiertnica:</span> <span className="font-bold">{header.drillingRig}</span></div>
                     <div className="p-2 space-y-0.5">
                        <div className="flex justify-between"><span>X:</span> <span>{header.coordinatesX}</span></div>
                        <div className="flex justify-between"><span>Y:</span> <span>{header.coordinatesY}</span></div>
                     </div>
                </div>
            </div>
            
            <div className="grid grid-cols-2 divide-x-[1.5px] divide-black">
                <div className="p-2 grid grid-cols-2 gap-x-4">
                    <div className="font-bold">Miejscowość:</div> <div>{projectMetadata.location}</div>
                    <div className="font-bold">Gmina:</div> <div>{projectMetadata.commune}</div>
                    <div className="font-bold">Powiat:</div> <div>{projectMetadata.district}</div>
                    <div className="font-bold">Obiekt:</div> <div className="col-span-1 truncate">{projectMetadata.objectName}</div>
                </div>
                <div className="p-2 space-y-1">
                   <div className="flex justify-between"><span>System:</span> <span>{header.drillingSystem}</span></div>
                   <div className="flex justify-between"><span>Rzędna:</span> <span className="font-bold">{header.elevation}</span></div>
                   <div className="flex justify-between border-t border-black pt-1">
                       <span className="font-bold italic">Skala {header.scale}</span>
                       <span>Data: {header.date}</span>
                   </div>
                </div>
            </div>
        </div>

        {/* MAIN DATA TABLE */}
        <div className="flex-1 flex flex-col mt-4 border-[1.5px] border-black border-t-0 overflow-visible">
            {/* Table Header Labels */}
            <div className="flex divide-x divide-black border-y-[1.5px] border-black bg-gray-50 print:bg-white font-bold text-[9px] text-center uppercase tracking-tighter min-h-[80px]">
                <div className="w-[30px] flex items-center justify-center p-1"><span className="-rotate-90 whitespace-nowrap">Głębokość [m]</span></div>
                <div className="w-[60px] flex flex-col divide-y divide-black">
                   <div className="flex-1 flex items-center justify-center p-1 leading-none">Woda [m]</div>
                   <div className="h-1/3 flex items-center justify-center">p.p.t.</div>
                </div>
                <div className="w-[80px] flex flex-col divide-y divide-black">
                   <div className="flex-1 flex items-center justify-center p-1 leading-none">Profil<br/>litologiczny</div>
                   <div className="h-1/3 flex items-center justify-center">Grafika</div>
                </div>
                <div className="w-[50px] flex items-center justify-center p-1 leading-none"><span className="-rotate-90">Spąg [m]</span></div>
                <div className="flex-1 flex items-center justify-center p-1">Opis litologiczny (rodzaj gruntu, barwa, domieszki)</div>
                <div className="w-[45px] flex items-center justify-center p-1 leading-none">Symbol<br/>gruntu</div>
                <div className="w-[45px] flex items-center justify-center p-1 leading-none">Wilg.</div>
                <div className="w-[40px] flex items-center justify-center p-1 leading-none">ID/IL</div>
                <div className="w-[40px] flex items-center justify-center p-1 leading-none">Warstwa</div>
            </div>

            {/* Table Rows */}
            <div className="relative flex-1 flex flex-row divide-x divide-black min-h-[500px] overflow-visible">
                {/* Scale column */}
                <div className="w-[30px] relative">
                   {Array.from({ length: Math.ceil(totalDepth * 10) + 1 }).map((_, i) => {
                       const depth = i / 10;
                       const isFullMeter = i % 10 === 0;
                       const isHalfMeter = i % 5 === 0;
                       
                       return (
                           <div key={i} className="absolute w-full flex items-start justify-end" style={{ top: depth * PX_PER_METER }}>
                               <div className={`h-px ${isFullMeter ? 'w-full bg-black' : isHalfMeter ? 'w-2/3 bg-gray-600' : 'w-1/3 bg-gray-400'}`}></div>
                               {isFullMeter && depth > 0 && (
                                   <span className="absolute -top-1.5 right-full pr-1 text-[8px] font-bold">{depth}</span>
                               )}
                           </div>
                       );
                   })}
                </div>

                {/* Water column */}
                <div className="w-[60px] relative">
                    {renderWaterLevels()}
                </div>

                {/* Lithology & Description rows */}
                <div className="flex-1 flex flex-col overflow-visible">
                   {layers.map((layer, idx) => {
                       const prevDepth = idx === 0 ? 0 : layers[idx - 1].depthBottom;
                       const height = (layer.depthBottom - prevDepth) * PX_PER_METER;
                       return (
                           <div key={layer.id} className="flex divide-x divide-black border-b border-black last:border-0 overflow-visible" style={{ height: `${height}px`, minHeight: '30px' }}>
                               <div 
                                 className="w-[80px] shrink-0 relative" 
                                 style={{ 
                                   backgroundColor: getBackgroundColor(layer.soilType), 
                                   backgroundImage: `url(${getPatternDataUri(layer.soilType)})`,
                                   backgroundRepeat: 'repeat',
                                   printColorAdjust: 'exact', 
                                   WebkitPrintColorAdjust: 'exact' 
                                 }}
                               >
                               </div>
                               <div className="w-[50px] shrink-0 flex items-end justify-center pb-1 font-bold text-[10px]">{layer.depthBottom.toFixed(2)}</div>
                               <div className="flex-1 p-2 flex items-center leading-tight font-medium text-[10px] italic">
                                   {layer.description}
                               </div>
                               <div className="w-[45px] shrink-0 flex items-center justify-center font-bold">{layer.symbol}</div>
                               <div className="w-[45px] shrink-0 flex items-center justify-center">{layer.moisture}</div>
                               <div className="w-[40px] shrink-0 flex flex-col items-center justify-center text-[9px] leading-tight">
                                   {layer.densityIndex && <div>ID:{layer.densityIndex}</div>}
                                   {layer.consistencyIndex && <div>IL:{layer.consistencyIndex}</div>}
                                   {!layer.densityIndex && !layer.consistencyIndex && '-'}
                               </div>
                               <div className="w-[40px] shrink-0 flex items-center justify-center font-black text-xs">{layer.geoLayerNumber}</div>
                           </div>
                       );
                   })}
                   <div className="flex-1 bg-gray-50/20 print:bg-white"></div>
                </div>
            </div>
        </div>

        <div className="mt-4 flex justify-between items-end border-t border-black pt-2 opacity-50 text-[9px] uppercase font-bold tracking-widest print:opacity-100">
            <div>GeoLog Pro - Dokumentacja Geotechniczna</div>
            <div>Wydruk wygenerowany automatycznie</div>
        </div>
      </div>
    </div>
  );
};

export default ReportPreview;
