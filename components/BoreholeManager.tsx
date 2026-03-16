import React from 'react';
import { Borehole } from '../types';
import { Plus, Trash2, ChevronRight, MapPin } from 'lucide-react';

interface Props {
  boreholes: Borehole[];
  projectLocation: string;
  activeId: string | null;
  onSelect: (id: string) => void;
  onAdd: () => void;
  onDelete: (id: string) => void;
}

const BoreholeManager: React.FC<Props> = ({ boreholes, projectLocation, activeId, onSelect, onAdd, onDelete }) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-black tracking-tight text-slate-800">LISTA OTWORÓW</h2>
        <button 
          onClick={onAdd}
          className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg shadow-lg transition-all active:scale-95 flex items-center gap-2 text-xs font-bold"
        >
          <Plus size={16} /> DODAJ OTWÓR
        </button>
      </div>

      <div className="space-y-2">
        {boreholes.map(b => (
          <div 
            key={b.id}
            onClick={() => onSelect(b.id)}
            className={`group relative p-4 rounded-xl border-2 transition-all cursor-pointer ${activeId === b.id ? 'border-blue-500 bg-blue-50/50 shadow-md' : 'border-slate-100 bg-white hover:border-slate-200 hover:shadow-sm'}`}
          >
            <div className="flex justify-between items-start">
              <div className="flex gap-3">
                <div className={`p-2 rounded-lg ${activeId === b.id ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
                  <MapPin size={18} />
                </div>
                <div>
                  <div className="font-black text-sm text-slate-800 uppercase tracking-tight">
                    OTWÓR {b.header.boreholeId}
                  </div>
                  <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">
                    {projectLocation || 'Brak lokalizacji'}
                  </div>
                  <div className="flex gap-2 mt-2">
                    <span className="text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-bold">
                      {b.layers.length} WARSTW
                    </span>
                    <span className="text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-bold">
                      {b.layers.length > 0 ? b.layers[b.layers.length - 1].depthBottom.toFixed(2) : 0}m GŁĘB.
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col gap-2">
                <button 
                  onClick={(e) => { e.stopPropagation(); onDelete(b.id); }}
                  className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                >
                  <Trash2 size={14} />
                </button>
                <ChevronRight size={18} className={`transition-transform ${activeId === b.id ? 'text-blue-500 translate-x-1' : 'text-slate-200'}`} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BoreholeManager;
