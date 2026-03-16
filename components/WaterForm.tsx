
import React, { useState } from 'react';
import { WaterLevel, WaterType } from '../types';
import { Plus, Trash2, Check, X, Droplets } from 'lucide-react';

interface Props {
  waterLevels: WaterLevel[];
  onUpdate: (waterLevels: WaterLevel[]) => void;
}

const WaterForm: React.FC<Props> = ({ waterLevels, onUpdate }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<WaterLevel>>({});

  const handleAdd = () => {
    const newId = Math.random().toString(36).substr(2, 9);
    const newWater: WaterLevel = {
      id: newId,
      depth: 1.0,
      type: WaterType.Stabilized,
    };
    setFormData(newWater);
    setEditingId(newId);
  };

  const handleSave = () => {
    if (!editingId) return;
    const isNew = !waterLevels.find(w => w.id === editingId);
    let newWaterLevels = isNew 
      ? [...waterLevels, formData as WaterLevel] 
      : waterLevels.map(w => w.id === editingId ? { ...w, ...formData } as WaterLevel : w);
    
    newWaterLevels.sort((a, b) => a.depth - b.depth);
    onUpdate(newWaterLevels);
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    onUpdate(waterLevels.filter(w => w.id !== id));
  };

  const handleEdit = (water: WaterLevel) => {
    setEditingId(water.id);
    setFormData({ ...water });
  };

  return (
    <div className="flex flex-col h-full overflow-hidden bg-white rounded-xl border border-gray-200 shadow-sm">
      <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
        <h2 className="font-bold flex items-center gap-2 text-gray-700">
          <Droplets size={18} className="text-blue-600" /> Woda Gruntowa
        </h2>
        <button onClick={handleAdd} className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full shadow-md transition-all">
          <Plus size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {waterLevels.length === 0 && !editingId && (
          <div className="text-center py-12 text-gray-400">
            <Droplets size={48} className="mx-auto mb-2 opacity-20" />
            <p>Brak informacji o wodzie.<br/>Kliknij +, aby dodać pomiar.</p>
          </div>
        )}

        {waterLevels.map((water) => (
          editingId === water.id ? (
            <div key={water.id} className="border-2 border-blue-500 rounded-xl p-4 bg-blue-50/30 space-y-4 shadow-sm">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Głębokość [m]</label>
                  <input 
                    type="number" step="0.1" 
                    className="w-full border rounded px-3 py-2"
                    value={formData.depth} 
                    onChange={(e) => setFormData({ ...formData, depth: parseFloat(e.target.value) })}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Typ</label>
                  <select 
                    className="w-full border rounded px-3 py-2 text-sm"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as WaterType })}
                  >
                    <option value={WaterType.Stabilized}>Zwierciadło ustabilizowane</option>
                    <option value={WaterType.Encountered}>Zwierciadło nawiercone</option>
                    <option value={WaterType.Seepage}>Sączenie</option>
                  </select>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase">Etykieta (opcjonalnie)</label>
                <input 
                  type="text"
                  className="w-full border rounded px-3 py-2 text-sm"
                  placeholder="np. 12.05.2025"
                  value={formData.label || ''}
                  onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                />
              </div>
              <div className="flex gap-2">
                <button onClick={handleSave} className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-bold text-sm flex items-center justify-center gap-2">
                  <Check size={16} /> Zapisz
                </button>
                <button onClick={() => setEditingId(null)} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100">
                  <X size={16} />
                </button>
              </div>
            </div>
          ) : (
            <div key={water.id} className="flex items-center justify-between p-3 border rounded-xl bg-gray-50 hover:bg-white transition-all group">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${water.type === WaterType.Stabilized ? 'bg-blue-600 text-white' : water.type === WaterType.Encountered ? 'border-2 border-blue-600 text-blue-600' : 'bg-blue-400 text-white'}`}>
                  <Droplets size={20} />
                </div>
                <div>
                  <div className="font-bold text-gray-800">{water.depth.toFixed(2)} m p.p.t.</div>
                  <div className="text-[10px] text-gray-500 uppercase font-bold">
                    {water.type === WaterType.Stabilized ? 'Ustabilizowane' : water.type === WaterType.Encountered ? 'Nawiercone' : 'Sączenie'}
                  </div>
                </div>
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => handleEdit(water)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Check size={16} /></button>
                <button onClick={() => handleDelete(water.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={16} /></button>
              </div>
            </div>
          )
        ))}

        {editingId && !waterLevels.find(w => w.id === editingId) && (
           <div className="border-2 border-blue-500 rounded-xl p-4 bg-blue-50/30 space-y-4 shadow-sm">
           <div className="grid grid-cols-2 gap-4">
             <div className="space-y-1">
               <label className="text-[10px] font-bold text-gray-500 uppercase">Głębokość [m]</label>
               <input 
                 type="number" step="0.1" 
                 className="w-full border rounded px-3 py-2"
                 value={formData.depth} 
                 onChange={(e) => setFormData({ ...formData, depth: parseFloat(e.target.value) })}
               />
             </div>
             <div className="space-y-1">
               <label className="text-[10px] font-bold text-gray-500 uppercase">Typ</label>
               <select 
                 className="w-full border rounded px-3 py-2 text-sm"
                 value={formData.type}
                 onChange={(e) => setFormData({ ...formData, type: e.target.value as WaterType })}
               >
                 <option value={WaterType.Stabilized}>Zwierciadło ustabilizowane</option>
                 <option value={WaterType.Encountered}>Zwierciadło nawiercone</option>
                 <option value={WaterType.Seepage}>Sączenie</option>
               </select>
             </div>
           </div>
           <div className="space-y-1">
             <label className="text-[10px] font-bold text-gray-500 uppercase">Etykieta (opcjonalnie)</label>
             <input 
               type="text"
               className="w-full border rounded px-3 py-2 text-sm"
               placeholder="np. 12.05.2025"
               value={formData.label || ''}
               onChange={(e) => setFormData({ ...formData, label: e.target.value })}
             />
           </div>
           <div className="flex gap-2">
             <button onClick={handleSave} className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-bold text-sm flex items-center justify-center gap-2">
               <Check size={16} /> Dodaj pomiar
             </button>
             <button onClick={() => setEditingId(null)} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100">
               <X size={16} />
             </button>
           </div>
         </div>
        )}
      </div>
    </div>
  );
};

export default WaterForm;
