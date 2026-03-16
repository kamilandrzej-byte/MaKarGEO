
import React, { useState, useEffect } from 'react';
import { Layer, SoilType } from '../types';
import { 
  SOIL_OPTIONS, 
  FRACTIONS, 
  COLORS, 
  MOISTURE, 
  ADMIXTURE_OPTIONS, 
  INTERLAYER_OPTIONS, 
  STATE_OPTIONS, 
  PLASTICITY_OPTIONS, 
  ORGANIC_OPTIONS, 
  CARBONATE_OPTIONS, 
  getBackgroundColor 
} from '../constants';
import { Plus, Trash2, Edit, Check, X, ChevronRight, Layers, Droplets } from 'lucide-react';

interface Props {
  layers: Layer[];
  onUpdate: (layers: Layer[]) => void;
}

const LayerForm: React.FC<Props> = ({ layers, onUpdate }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Layer>>({});

  const handleAdd = () => {
    const lastLayer = layers[layers.length > 0 ? layers.length - 1 : 0];
    const startDepth = lastLayer ? lastLayer.depthBottom : 0;
    
    const newId = Math.random().toString(36).substr(2, 9);
    const newLayer: Layer = {
      id: newId,
      depthBottom: parseFloat((startDepth + 1.0).toFixed(2)),
      soilType: SoilType.Sand,
      fraction: 'm',
      color: 'yl',
      description: 'piasek średni, żółty',
      stratigraphy: lastLayer?.stratigraphy || 'Czwartorzęd',
      symbol: 'Ps',
      moisture: 'w',
    };
    
    setFormData(newLayer);
    setEditingId(newId);
  };

  const handleSave = () => {
    if (!editingId) return;
    const isNew = !layers.find(l => l.id === editingId);
    let newLayers = isNew ? [...layers, formData as Layer] : layers.map(l => l.id === editingId ? { ...l, ...formData } as Layer : l);
    newLayers.sort((a, b) => a.depthBottom - b.depthBottom);
    onUpdate(newLayers);
    setEditingId(null);
  };

  const handleEdit = (layer: Layer) => {
    setEditingId(layer.id);
    setFormData({ ...layer });
  };

  const handleDelete = (id: string) => {
    // Usuwamy confirm dla testu lub uproszczenia, jeśli blokuje działanie w niektórych środowiskach
    const filteredLayers = layers.filter(l => l.id !== id);
    onUpdate(filteredLayers);
    
    if (editingId === id) {
      setEditingId(null);
      setFormData({});
    }
  };

  const handleChange = (field: keyof Layer, value: any) => {
    setFormData(prev => {
        const updated = { ...prev, [field]: value };
        
        // Auto-generate description and symbol if specific fields change
        const triggerFields = [
          'soilType', 'secondarySoilType', 'fraction', 'color', 
          'admixture', 'admixtureType', 'interlayer', 'interlayerType',
          'state', 'plasticity', 'organicContent', 'carbonateContent',
          'densityIndex', 'consistencyIndex'
        ];

        if (triggerFields.includes(field)) {
            const soil = SOIL_OPTIONS.find(s => s.value === updated.soilType);
            const secondarySoil = SOIL_OPTIONS.find(s => s.value === updated.secondarySoilType);
            const frac = FRACTIONS.find(f => f.value === updated.fraction);
            const col = COLORS.find(c => c.value === updated.color);
            const admType = ADMIXTURE_OPTIONS.find(a => a.value === updated.admixtureType);
            const intType = INTERLAYER_OPTIONS.find(i => i.value === updated.interlayerType);
            const state = STATE_OPTIONS.find(s => s.value === updated.state);
            
            let desc = '';
            
            // Soil type
            if (secondarySoil) {
              // e.g. "glina piaszczysta"
              const adjMap: Record<string, string> = {
                [SoilType.Sand]: 'piaszczysta',
                [SoilType.Silt]: 'pylasta',
                [SoilType.Clay]: 'ilasta',
                [SoilType.Gravel]: 'żwirowa',
              };
              const adj = adjMap[updated.secondarySoilType as string] || updated.secondarySoilType;
              desc = `${soil?.pl} ${adj}`;
            } else {
              desc = soil?.pl || '';
            }

            // Fraction for sands/gravels
            if (frac && (updated.soilType === SoilType.Sand || updated.soilType === SoilType.Gravel)) {
              desc += ` ${frac.pl}`;
            }

            // Color
            if (col) desc += `, ${col.pl}`;

            // Admixtures
            if (admType) {
              const intensity = updated.admixture || 'z domieszką';
              desc += `, ${intensity} ${admType.pl}`;
            }

            // Interlayers
            if (intType) {
              const freq = updated.interlayer || 'z przewarstwieniami';
              desc += `, ${freq} ${intType.pl}`;
            }

            // State
            if (state) desc += `, ${state.pl}`;

            // ID / IL
            if (updated.densityIndex) desc += ` (ID=${updated.densityIndex})`;
            if (updated.consistencyIndex) desc += ` (IL=${updated.consistencyIndex})`;

            // Carbonates
            if (updated.carbonateContent && updated.carbonateContent !== 'none') {
              const carb = CARBONATE_OPTIONS.find(c => c.value === updated.carbonateContent);
              desc += `, reakcja z HCl ${carb?.pl}`;
            }
            
            let sym = soil?.symbol || '';
            if (frac && (soil?.symbol === 'P' || soil?.symbol === 'Ż')) {
              sym = soil.symbol + frac.sym;
            }
            if (secondarySoil) {
              const secSymMap: Record<string, string> = {
                [SoilType.Sand]: 'p',
                [SoilType.Silt]: 'π',
                [SoilType.Clay]: 'i',
                [SoilType.Gravel]: 'ż',
              };
              sym += secSymMap[updated.secondarySoilType as string] || '';
            }

            updated.description = desc;
            updated.symbol = sym;
        }
        return updated;
    });
  };

  return (
    <div className="flex flex-col h-full overflow-hidden bg-white rounded-xl border border-gray-200 shadow-sm">
      <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
        <h2 className="font-bold flex items-center gap-2 text-gray-700">
          <Layers size={18} className="text-blue-600" /> Profil Litologiczny
        </h2>
        <button onClick={handleAdd} className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full shadow-md transition-all">
          <Plus size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {layers.length === 0 && !editingId && (
          <div className="text-center py-12 text-gray-400">
            <Layers size={48} className="mx-auto mb-2 opacity-20" />
            <p>Brak zdefiniowanych warstw.<br/>Kliknij +, aby dodać pierwszą.</p>
          </div>
        )}

        {layers.map((layer) => (
          editingId === layer.id ? (
            <div key={layer.id} className="border-2 border-blue-500 rounded-xl p-4 bg-blue-50/30 space-y-4 shadow-sm">
                <div className="flex justify-between items-center">
                   <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Edycja Warstwy</span>
                   <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">Głębokość spągu:</span>
                      <input 
                        type="number" step="0.1" 
                        className="w-20 font-bold border rounded px-2 py-1 text-center"
                        value={formData.depthBottom} 
                        onChange={(e) => handleChange('depthBottom', parseFloat(e.target.value))}
                      />
                   </div>
                </div>

                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-500 uppercase">Grunt Główny</label>
                      <select className="w-full text-sm border rounded p-1.5" value={formData.soilType} onChange={e => handleChange('soilType', e.target.value)}>
                        {SOIL_OPTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-500 uppercase">Grunt Dodatkowy</label>
                      <select className="w-full text-sm border rounded p-1.5" value={formData.secondarySoilType || ''} onChange={e => handleChange('secondarySoilType', e.target.value || undefined)}>
                        <option value="">- brak -</option>
                        {SOIL_OPTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-500 uppercase">Frakcja (dla P/Ż)</label>
                        <select className="w-full text-sm border rounded p-1.5" value={formData.fraction} onChange={e => handleChange('fraction', e.target.value)}>
                          <option value="">- brak -</option>
                          {FRACTIONS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
                        </select>
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-500 uppercase">Kolor</label>
                        <select className="w-full text-sm border rounded p-1.5" value={formData.color} onChange={e => handleChange('color', e.target.value)}>
                          <option value="">- brak -</option>
                          {COLORS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                        </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-500 uppercase">Domieszka</label>
                      <div className="flex gap-1">
                        <select className="flex-1 text-xs border rounded p-1" value={formData.admixtureType || ''} onChange={e => handleChange('admixtureType', e.target.value || undefined)}>
                          <option value="">- brak -</option>
                          {ADMIXTURE_OPTIONS.map(a => <option key={a.value} value={a.value}>{a.label}</option>)}
                        </select>
                        <input 
                          className="w-16 text-xs border rounded p-1" 
                          placeholder="ilość" 
                          value={formData.admixture || ''} 
                          onChange={e => handleChange('admixture', e.target.value)} 
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-500 uppercase">Przewarstwienie</label>
                      <div className="flex gap-1">
                        <select className="flex-1 text-xs border rounded p-1" value={formData.interlayerType || ''} onChange={e => handleChange('interlayerType', e.target.value || undefined)}>
                          <option value="">- brak -</option>
                          {INTERLAYER_OPTIONS.map(i => <option key={i.value} value={i.value}>{i.label}</option>)}
                        </select>
                        <input 
                          className="w-16 text-xs border rounded p-1" 
                          placeholder="częst." 
                          value={formData.interlayer || ''} 
                          onChange={e => handleChange('interlayer', e.target.value)} 
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-500 uppercase">Stan / Konsystencja</label>
                      <select className="w-full text-xs border rounded p-1" value={formData.state || ''} onChange={e => handleChange('state', e.target.value || undefined)}>
                        <option value="">- brak -</option>
                        {STATE_OPTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-500 uppercase">Węglany (HCl)</label>
                      <select className="w-full text-xs border rounded p-1" value={formData.carbonateContent || ''} onChange={e => handleChange('carbonateContent', e.target.value || undefined)}>
                        <option value="">- brak -</option>
                        {CARBONATE_OPTIONS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-500 uppercase">Plastyczność</label>
                      <select className="w-full text-xs border rounded p-1" value={formData.plasticity || ''} onChange={e => handleChange('plasticity', e.target.value || undefined)}>
                        <option value="">- brak -</option>
                        {PLASTICITY_OPTIONS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-500 uppercase">Zaw. organiczna</label>
                      <select className="w-full text-xs border rounded p-1" value={formData.organicContent || ''} onChange={e => handleChange('organicContent', e.target.value || undefined)}>
                        <option value="">- brak -</option>
                        {ORGANIC_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                   <label className="text-[10px] font-bold text-gray-500 uppercase">Opis Gruntu (Auto)</label>
                   <textarea 
                    className="w-full text-sm font-medium border rounded p-2 bg-white"
                    rows={2}
                    value={formData.description}
                    onChange={e => handleChange('description', e.target.value)}
                   />
                </div>

                <div className="grid grid-cols-2 gap-2">
                   <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-500 uppercase">Stopień zagęszczenia (ID)</label>
                      <input 
                        className="w-full text-xs border rounded p-1.5" 
                        placeholder="np. 0.50" 
                        value={formData.densityIndex || ''} 
                        onChange={e => handleChange('densityIndex', e.target.value)} 
                      />
                   </div>
                   <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-500 uppercase">Stopień plastyczności (IL)</label>
                      <input 
                        className="w-full text-xs border rounded p-1.5" 
                        placeholder="np. 0.20" 
                        value={formData.consistencyIndex || ''} 
                        onChange={e => handleChange('consistencyIndex', e.target.value)} 
                      />
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                   <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-500 uppercase">Wilgotność</label>
                      <select className="w-full text-xs border rounded p-1.5" value={formData.moisture} onChange={e => handleChange('moisture', e.target.value)}>
                        {MOISTURE.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                      </select>
                   </div>
                   <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-500 uppercase">Nr Warstwy</label>
                      <input className="w-full text-xs border rounded p-1.5 font-bold" value={formData.geoLayerNumber || ''} onChange={e => handleChange('geoLayerNumber', e.target.value)} />
                   </div>
                </div>

                <div className="flex gap-2 pt-2">
                   <button onClick={handleSave} className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-bold text-sm flex items-center justify-center gap-2">
                      <Check size={16} /> Zapisz
                   </button>
                   <button onClick={() => setEditingId(null)} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 text-gray-600">
                      <X size={16} />
                   </button>
                </div>
            </div>
          ) : (
            <div key={layer.id} className="group relative border border-gray-100 rounded-xl p-3 bg-gray-50 hover:bg-white hover:shadow-md hover:border-blue-200 transition-all cursor-default">
               <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-lg border border-gray-200 shrink-0 flex items-center justify-center font-bold text-gray-400" style={{ backgroundColor: getBackgroundColor(layer.soilType) }}>
                     {layer.symbol}
                  </div>
                  <div className="flex-1 min-w-0">
                     <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-gray-800 text-sm">{layer.depthBottom.toFixed(2)} m p.p.t.</span>
                        <div className="flex gap-1">
                           <button 
                             type="button"
                             title="Edytuj warstwę"
                             onClick={(e) => { 
                               e.preventDefault();
                               e.stopPropagation(); 
                               handleEdit(layer); 
                             }} 
                             className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                           >
                             <Edit size={16} />
                           </button>
                           <button 
                             type="button"
                             title="Usuń warstwę"
                             onClick={(e) => { 
                               e.preventDefault();
                               e.stopPropagation(); 
                               handleDelete(layer.id); 
                             }} 
                             className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                           >
                             <Trash2 size={16} />
                           </button>
                        </div>
                     </div>
                     <p className="text-xs text-gray-600 line-clamp-2 italic leading-relaxed">"{layer.description}"</p>
                  </div>
               </div>
            </div>
          )
        ))}

        {/* Formularz dla nowej warstwy (jeśli nie ma jej jeszcze na liście) */}
        {editingId && !layers.find(l => l.id === editingId) && (
            <div key="new-layer" className="border-2 border-blue-500 rounded-xl p-4 bg-blue-50/30 space-y-4 shadow-sm animate-in fade-in slide-in-from-bottom-2">
                <div className="flex justify-between items-center">
                   <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Nowa Warstwa</span>
                   <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">Głębokość spągu:</span>
                      <input 
                        type="number" step="0.1" 
                        className="w-20 font-bold border rounded px-2 py-1 text-center"
                        value={formData.depthBottom} 
                        onChange={(e) => handleChange('depthBottom', parseFloat(e.target.value))}
                      />
                   </div>
                </div>

                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-500 uppercase">Grunt Główny</label>
                      <select className="w-full text-sm border rounded p-1.5" value={formData.soilType} onChange={e => handleChange('soilType', e.target.value)}>
                        {SOIL_OPTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-500 uppercase">Grunt Dodatkowy</label>
                      <select className="w-full text-sm border rounded p-1.5" value={formData.secondarySoilType || ''} onChange={e => handleChange('secondarySoilType', e.target.value || undefined)}>
                        <option value="">- brak -</option>
                        {SOIL_OPTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-500 uppercase">Frakcja (dla P/Ż)</label>
                        <select className="w-full text-sm border rounded p-1.5" value={formData.fraction} onChange={e => handleChange('fraction', e.target.value)}>
                          <option value="">- brak -</option>
                          {FRACTIONS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
                        </select>
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-500 uppercase">Kolor</label>
                        <select className="w-full text-sm border rounded p-1.5" value={formData.color} onChange={e => handleChange('color', e.target.value)}>
                          <option value="">- brak -</option>
                          {COLORS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                        </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-500 uppercase">Domieszka</label>
                      <div className="flex gap-1">
                        <select className="flex-1 text-xs border rounded p-1" value={formData.admixtureType || ''} onChange={e => handleChange('admixtureType', e.target.value || undefined)}>
                          <option value="">- brak -</option>
                          {ADMIXTURE_OPTIONS.map(a => <option key={a.value} value={a.value}>{a.label}</option>)}
                        </select>
                        <input 
                          className="w-16 text-xs border rounded p-1" 
                          placeholder="ilość" 
                          value={formData.admixture || ''} 
                          onChange={e => handleChange('admixture', e.target.value)} 
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-500 uppercase">Przewarstwienie</label>
                      <div className="flex gap-1">
                        <select className="flex-1 text-xs border rounded p-1" value={formData.interlayerType || ''} onChange={e => handleChange('interlayerType', e.target.value || undefined)}>
                          <option value="">- brak -</option>
                          {INTERLAYER_OPTIONS.map(i => <option key={i.value} value={i.value}>{i.label}</option>)}
                        </select>
                        <input 
                          className="w-16 text-xs border rounded p-1" 
                          placeholder="częst." 
                          value={formData.interlayer || ''} 
                          onChange={e => handleChange('interlayer', e.target.value)} 
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-500 uppercase">Stan / Konsystencja</label>
                      <select className="w-full text-xs border rounded p-1" value={formData.state || ''} onChange={e => handleChange('state', e.target.value || undefined)}>
                        <option value="">- brak -</option>
                        {STATE_OPTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-500 uppercase">Węglany (HCl)</label>
                      <select className="w-full text-xs border rounded p-1" value={formData.carbonateContent || ''} onChange={e => handleChange('carbonateContent', e.target.value || undefined)}>
                        <option value="">- brak -</option>
                        {CARBONATE_OPTIONS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-500 uppercase">Plastyczność</label>
                      <select className="w-full text-xs border rounded p-1" value={formData.plasticity || ''} onChange={e => handleChange('plasticity', e.target.value || undefined)}>
                        <option value="">- brak -</option>
                        {PLASTICITY_OPTIONS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-500 uppercase">Zaw. organiczna</label>
                      <select className="w-full text-xs border rounded p-1" value={formData.organicContent || ''} onChange={e => handleChange('organicContent', e.target.value || undefined)}>
                        <option value="">- brak -</option>
                        {ORGANIC_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                   <label className="text-[10px] font-bold text-gray-500 uppercase">Opis Gruntu (Auto)</label>
                   <textarea 
                    className="w-full text-sm font-medium border rounded p-2 bg-white"
                    rows={2}
                    value={formData.description}
                    onChange={e => handleChange('description', e.target.value)}
                   />
                </div>

                <div className="grid grid-cols-2 gap-2">
                   <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-500 uppercase">Stopień zagęszczenia (ID)</label>
                      <input 
                        className="w-full text-xs border rounded p-1.5" 
                        placeholder="np. 0.50" 
                        value={formData.densityIndex || ''} 
                        onChange={e => handleChange('densityIndex', e.target.value)} 
                      />
                   </div>
                   <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-500 uppercase">Stopień plastyczności (IL)</label>
                      <input 
                        className="w-full text-xs border rounded p-1.5" 
                        placeholder="np. 0.20" 
                        value={formData.consistencyIndex || ''} 
                        onChange={e => handleChange('consistencyIndex', e.target.value)} 
                      />
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                   <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-500 uppercase">Wilgotność</label>
                      <select className="w-full text-xs border rounded p-1.5" value={formData.moisture} onChange={e => handleChange('moisture', e.target.value)}>
                        {MOISTURE.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                      </select>
                   </div>
                   <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-500 uppercase">Nr Warstwy</label>
                      <input className="w-full text-xs border rounded p-1.5 font-bold" value={formData.geoLayerNumber || ''} onChange={e => handleChange('geoLayerNumber', e.target.value)} />
                   </div>
                </div>

                <div className="flex gap-2 pt-2">
                   <button onClick={handleSave} className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-bold text-sm flex items-center justify-center gap-2">
                      <Check size={16} /> Dodaj warstwę
                   </button>
                   <button onClick={() => setEditingId(null)} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 text-gray-600">
                      <X size={16} />
                   </button>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default LayerForm;
