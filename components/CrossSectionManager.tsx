import React from 'react';
import { CrossSection, Borehole } from '../types';
import { Plus, Trash2, ChevronRight, Layers, MoveRight } from 'lucide-react';

interface Props {
  crossSections: CrossSection[];
  boreholes: Borehole[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onAdd: () => void;
  onUpdate: (cs: CrossSection) => void;
  onDelete: (id: string) => void;
}

const CrossSectionManager: React.FC<Props> = ({ crossSections, boreholes, activeId, onSelect, onAdd, onUpdate, onDelete }) => {
  const activeCS = crossSections.find(cs => cs.id === activeId);

  const toggleBorehole = (cs: CrossSection, boreholeId: string) => {
    const isSelected = cs.boreholeIds.includes(boreholeId);
    let newBoreholeIds: string[];
    let newDistances: number[];

    if (isSelected) {
      const index = cs.boreholeIds.indexOf(boreholeId);
      newBoreholeIds = cs.boreholeIds.filter(id => id !== boreholeId);
      newDistances = [...cs.distances];
      if (index > 0) {
        newDistances.splice(index - 1, 1);
      } else if (newDistances.length > 0) {
        newDistances.splice(0, 1);
      }
    } else {
      newBoreholeIds = [...cs.boreholeIds, boreholeId];
      newDistances = [...cs.distances, 10]; // Default 10m distance
    }

    onUpdate({ ...cs, boreholeIds: newBoreholeIds, distances: newDistances });
  };

  const updateDistance = (cs: CrossSection, index: number, distance: number) => {
    const newDistances = [...cs.distances];
    newDistances[index] = distance;
    onUpdate({ ...cs, distances: newDistances });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-black tracking-tight text-slate-800 uppercase">Przekroje</h2>
        <button 
          onClick={onAdd}
          className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg shadow-lg transition-all active:scale-95 flex items-center gap-2 text-xs font-bold"
        >
          <Plus size={16} /> NOWY PRZEKRÓJ
        </button>
      </div>

      <div className="space-y-2">
        {crossSections.map(cs => (
          <div key={cs.id} className="space-y-2">
            <div 
              onClick={() => onSelect(cs.id)}
              className={`group relative p-4 rounded-xl border-2 transition-all cursor-pointer ${activeId === cs.id ? 'border-blue-500 bg-blue-50/50 shadow-md' : 'border-slate-100 bg-white hover:border-slate-200 hover:shadow-sm'}`}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${activeId === cs.id ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
                    <Layers size={18} />
                  </div>
                  <input 
                    className="bg-transparent font-black text-sm text-slate-800 uppercase tracking-tight focus:outline-none border-b border-transparent focus:border-blue-300"
                    value={cs.name}
                    onChange={(e) => onUpdate({ ...cs, name: e.target.value })}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
                <button 
                  onClick={(e) => { e.stopPropagation(); onDelete(cs.id); }}
                  className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>

            {activeId === cs.id && (
              <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-inner space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Wybierz otwory do przekroju:</label>
                  <div className="grid grid-cols-2 gap-2">
                    {boreholes.map(b => (
                      <button
                        key={b.id}
                        onClick={() => toggleBorehole(cs, b.id)}
                        className={`p-2 rounded-lg border text-[10px] font-bold transition-all text-left flex items-center gap-2 ${cs.boreholeIds.includes(b.id) ? 'bg-blue-600 border-blue-600 text-white shadow-md' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'}`}
                      >
                        <div className={`w-2 h-2 rounded-full ${cs.boreholeIds.includes(b.id) ? 'bg-white' : 'bg-slate-300'}`}></div>
                        {b.header.boreholeId}
                      </button>
                    ))}
                  </div>
                </div>

                {cs.boreholeIds.length > 1 && (
                  <div className="space-y-3 pt-2 border-t border-slate-100">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Odległości między otworami [m]:</label>
                    <div className="space-y-3">
                      {cs.boreholeIds.map((id, idx) => {
                        const borehole = boreholes.find(b => b.id === id);
                        const nextId = cs.boreholeIds[idx + 1];
                        const nextBorehole = boreholes.find(b => b.id === nextId);
                        
                        if (!nextBorehole) return null;

                        return (
                          <div key={`${id}-${nextId}`} className="flex items-center gap-3">
                            <div className="flex-1 flex items-center justify-between bg-slate-50 p-2 rounded-lg border border-slate-100">
                              <span className="text-[10px] font-black text-slate-700">{borehole?.header.boreholeId}</span>
                              <div className="flex items-center gap-2 flex-1 px-4">
                                <div className="h-px bg-slate-300 flex-1 relative">
                                  <div className="absolute inset-0 flex items-center justify-center -top-4">
                                    <input 
                                      type="number"
                                      className="w-12 text-center text-[10px] font-bold bg-white border border-slate-200 rounded p-0.5 focus:border-blue-500 outline-none"
                                      value={cs.distances[idx]}
                                      onChange={(e) => updateDistance(cs, idx, parseFloat(e.target.value) || 0)}
                                    />
                                  </div>
                                  <MoveRight size={12} className="absolute right-0 -top-[5.5px] text-slate-400" />
                                </div>
                              </div>
                              <span className="text-[10px] font-black text-slate-700">{nextBorehole?.header.boreholeId}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CrossSectionManager;
