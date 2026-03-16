
import React, { useState } from 'react';
import { AppState, Layer, SoilType, WaterLevel, WaterType, Borehole, CrossSection, ProjectMetadata, BoreholeHeader } from './types';
import { INITIAL_PROJECT_METADATA, INITIAL_BOREHOLE_METADATA, SoilPatternsDefs } from './constants';
import HeaderForm from './components/HeaderForm';
import LayerForm from './components/LayerForm';
import WaterForm from './components/WaterForm';
import ReportPreview from './components/ReportPreview';
import BoreholeManager from './components/BoreholeManager';
import CrossSectionManager from './components/CrossSectionManager';
import CrossSectionPreview from './components/CrossSectionPreview';
import GeologicalReport from './components/GeologicalReport';
import { Printer, Settings, Layers as LayersIcon, Download, Droplets, FileText, Save, Upload } from 'lucide-react';
// @ts-ignore
import html2pdf from 'html2pdf.js';

type Tab = 'header' | 'layers' | 'water' | 'boreholes' | 'cross-sections' | 'report';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab | 'boreholes' | 'cross-sections'>('boreholes');
  const reportRef = React.useRef<HTMLDivElement>(null);
  const [state, setState] = useState<AppState>(() => {
    const initialBorehole: Borehole = {
      id: 'b1',
      header: { ...INITIAL_BOREHOLE_METADATA, boreholeId: '1' },
      layers: [
        {
          id: '1',
          depthBottom: 0.5,
          soilType: SoilType.Topsoil,
          description: 'humus, czarny',
          stratigraphy: 'Czwartorzęd',
          symbol: 'Gb',
          moisture: 'm',
        },
        {
          id: '2',
          depthBottom: 2.3,
          soilType: SoilType.Sand,
          description: 'piasek drobny, żółty',
          stratigraphy: 'Czwartorzęd',
          symbol: 'Pd',
          moisture: 'w',
          geoLayerNumber: 'I'
        }
      ],
      waterLevels: [
        { id: 'w1', depth: 1.8, type: WaterType.Encountered },
        { id: 'w2', depth: 1.5, type: WaterType.Stabilized }
      ]
    };

    return {
      projectMetadata: { ...INITIAL_PROJECT_METADATA },
      boreholes: [initialBorehole],
      crossSections: [],
      activeBoreholeId: 'b1',
      activeCrossSectionId: null
    };
  });

  const activeBorehole = state.boreholes.find(b => b.id === state.activeBoreholeId);
  const activeCrossSection = state.crossSections.find(cs => cs.id === state.activeCrossSectionId);

  const updateActiveBorehole = (update: Partial<Borehole>) => {
    setState(prev => ({
      ...prev,
      boreholes: prev.boreholes.map(b => b.id === prev.activeBoreholeId ? { ...b, ...update } : b)
    }));
  };

  const updateProjectMetadata = (projectMetadata: ProjectMetadata) => {
    setState(prev => ({ ...prev, projectMetadata }));
  };

  const handleHeaderChange = (header: BoreholeHeader) => updateActiveBorehole({ header });
  const handleLayersUpdate = (layers: Layer[]) => updateActiveBorehole({ layers });
  const handleWaterUpdate = (waterLevels: WaterLevel[]) => updateActiveBorehole({ waterLevels });
  
  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    if (!reportRef.current) return;
    
    const element = reportRef.current;
    const filename = state.activeCrossSectionId 
      ? `Przekroj_${activeCrossSection?.name}.pdf`
      : `Otwor_${activeBorehole?.header.boreholeId}_${state.projectMetadata.location}.pdf`;

    const opt = {
      margin: 0,
      filename,
      image: { type: 'jpeg' as const, quality: 0.98 },
      html2canvas: { 
        scale: 2, 
        useCORS: true,
        logging: false,
        letterRendering: true,
        allowTaint: true
      },
      jsPDF: { unit: 'mm' as const, format: 'a4' as const, orientation: state.activeCrossSectionId ? 'landscape' as const : 'portrait' as const }
    };

    // Add a small delay to ensure all SVG patterns and images are fully loaded/rendered
    setTimeout(() => {
      html2pdf().set(opt).from(element).save();
    }, 500);
  };

  const handleSaveProject = () => {
    const projectData = JSON.stringify(state, null, 2);
    const blob = new Blob([projectData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Projekt_Geologiczny_${new Date().toISOString().split('T')[0]}.geoproj`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleLoadProject = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const loadedState = JSON.parse(content) as AppState;
        
        // Basic validation
        if (loadedState.boreholes && Array.isArray(loadedState.boreholes)) {
          setState(loadedState);
          // Set active tab to boreholes to show something is loaded
          setActiveTab('boreholes');
        } else {
          alert('Nieprawidłowy format pliku projektu.');
        }
      } catch (err) {
        console.error('Error loading project:', err);
        alert('Błąd podczas wczytywania projektu.');
      }
    };
    reader.readAsText(file);
    // Reset input value to allow loading the same file again if needed
    event.target.value = '';
  };

  const addBorehole = () => {
    const newId = `b${Date.now()}`;
    const newBorehole: Borehole = {
      id: newId,
      header: { ...INITIAL_BOREHOLE_METADATA, boreholeId: `Nowy-${state.boreholes.length + 1}` },
      layers: [],
      waterLevels: []
    };
    setState(prev => ({
      ...prev,
      boreholes: [...prev.boreholes, newBorehole],
      activeBoreholeId: newId,
      activeCrossSectionId: null
    }));
    setActiveTab('header');
  };

  const deleteBorehole = (id: string) => {
    setState(prev => {
      const newBoreholes = prev.boreholes.filter(b => b.id !== id);
      const nextActiveId = newBoreholes.length > 0 ? newBoreholes[0].id : null;
      return {
        ...prev,
        boreholes: newBoreholes,
        activeBoreholeId: nextActiveId,
        activeCrossSectionId: null
      };
    });
  };

  const addCrossSection = () => {
    const newId = `cs${Date.now()}`;
    const newCS: CrossSection = {
      id: newId,
      name: `Przekrój ${state.crossSections.length + 1}`,
      boreholeIds: [],
      distances: []
    };
    setState(prev => ({
      ...prev,
      crossSections: [...prev.crossSections, newCS],
      activeCrossSectionId: newId,
      activeBoreholeId: null
    }));
    setActiveTab('cross-sections');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 font-sans text-slate-900 overflow-hidden h-screen">
      {/* Navbar - ukryty w druku */}
      <nav className="bg-slate-900 text-white px-6 py-3 flex justify-between items-center shadow-lg z-20 print:hidden shrink-0">
        <div className="flex items-center gap-4">
            <div className="bg-blue-600 p-2 rounded-lg shadow-inner">
                <LayersIcon size={24} className="text-white" />
            </div>
            <div>
               <h1 className="text-xl font-black tracking-tighter leading-none">GEOLOG<span className="text-blue-400">PRO</span></h1>
               <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">System dokumentacji geotechnicznej</p>
            </div>
        </div>
        
        <div className="flex gap-3">
          <div className="flex bg-slate-800 rounded-lg p-1 border border-slate-700">
            <button 
              onClick={handleSaveProject} 
              className="flex items-center gap-2 hover:bg-slate-700 px-3 py-1.5 rounded-md text-[10px] font-black transition-all"
              title="Zapisz projekt do pliku"
            >
              <Save size={14} /> ZAPISZ PROJEKT
            </button>
            <div className="w-px bg-slate-700 mx-1 self-stretch"></div>
            <label className="flex items-center gap-2 hover:bg-slate-700 px-3 py-1.5 rounded-md text-[10px] font-black transition-all cursor-pointer" title="Wczytaj projekt z pliku">
              <Upload size={14} /> WCZYTAJ PROJEKT
              <input 
                type="file" 
                accept=".geoproj,application/json" 
                className="hidden" 
                onChange={handleLoadProject}
              />
            </label>
          </div>

          <button 
            onClick={handleDownloadPDF} 
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 px-4 py-2 rounded-lg text-xs font-bold transition-all active:scale-95"
          >
            <Download size={16} /> POBIERZ PDF
          </button>
          <button 
            onClick={handlePrint} 
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 px-6 py-2.5 rounded-lg text-sm font-black transition-all shadow-lg active:scale-95"
          >
            <Printer size={18} /> DRUKUJ
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Sidebar - ukryty w druku */}
        <div className="w-1/3 min-w-[420px] bg-white border-r border-slate-200 flex flex-col z-10 print:hidden shadow-xl">
           <div className="flex p-2 gap-1 bg-slate-50 border-b overflow-x-auto no-scrollbar">
              <button 
                onClick={() => setActiveTab('boreholes')}
                className={`flex-1 min-w-[80px] flex flex-col items-center justify-center gap-1 py-2 rounded-lg text-[10px] font-black transition-all ${activeTab === 'boreholes' ? 'bg-white text-blue-600 shadow-sm border border-slate-200' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <Settings size={14} /> OTWORY
              </button>
              <button 
                onClick={() => setActiveTab('cross-sections')}
                className={`flex-1 min-w-[80px] flex flex-col items-center justify-center gap-1 py-2 rounded-lg text-[10px] font-black transition-all ${activeTab === 'cross-sections' ? 'bg-white text-blue-600 shadow-sm border border-slate-200' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <LayersIcon size={14} /> PRZEKROJE
              </button>
              <button 
                onClick={() => setActiveTab('report')}
                className={`flex-1 min-w-[80px] flex flex-col items-center justify-center gap-1 py-2 rounded-lg text-[10px] font-black transition-all ${activeTab === 'report' ? 'bg-white text-blue-600 shadow-sm border border-slate-200' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <FileText size={14} /> OPIS
              </button>
              <div className="w-px bg-slate-200 mx-1 self-stretch my-2"></div>
              <button 
                disabled={!state.activeBoreholeId}
                onClick={() => setActiveTab('header')}
                className={`flex-1 min-w-[80px] flex flex-col items-center justify-center gap-1 py-2 rounded-lg text-[10px] font-black transition-all ${activeTab === 'header' ? 'bg-white text-blue-600 shadow-sm border border-slate-200' : 'text-slate-400 hover:text-slate-600'} disabled:opacity-30`}
              >
                <Settings size={14} /> METADANE
              </button>
              <button 
                disabled={!state.activeBoreholeId}
                onClick={() => setActiveTab('layers')}
                className={`flex-1 min-w-[80px] flex flex-col items-center justify-center gap-1 py-2 rounded-lg text-[10px] font-black transition-all ${activeTab === 'layers' ? 'bg-white text-blue-600 shadow-sm border border-slate-200' : 'text-slate-400 hover:text-slate-600'} disabled:opacity-30`}
              >
                <LayersIcon size={14} /> WARSTWY
              </button>
              <button 
                disabled={!state.activeBoreholeId}
                onClick={() => setActiveTab('water')}
                className={`flex-1 min-w-[80px] flex flex-col items-center justify-center gap-1 py-2 rounded-lg text-[10px] font-black transition-all ${activeTab === 'water' ? 'bg-white text-blue-600 shadow-sm border border-slate-200' : 'text-slate-400 hover:text-slate-600'} disabled:opacity-30`}
              >
                <Droplets size={14} /> WODA
              </button>
           </div>

           <div className="flex-1 overflow-y-auto p-4 bg-slate-50/50">
              {activeTab === 'boreholes' && (
                <BoreholeManager 
                  boreholes={state.boreholes} 
                  projectLocation={state.projectMetadata.location}
                  activeId={state.activeBoreholeId} 
                  onSelect={(id) => setState(prev => ({ ...prev, activeBoreholeId: id, activeCrossSectionId: null }))}
                  onAdd={addBorehole}
                  onDelete={deleteBorehole}
                />
              )}
              {activeTab === 'cross-sections' && (
                <CrossSectionManager 
                  crossSections={state.crossSections}
                  boreholes={state.boreholes}
                  activeId={state.activeCrossSectionId}
                  onSelect={(id) => setState(prev => ({ ...prev, activeCrossSectionId: id, activeBoreholeId: null }))}
                  onAdd={addCrossSection}
                  onUpdate={(cs) => setState(prev => ({ ...prev, crossSections: prev.crossSections.map(c => c.id === cs.id ? cs : c) }))}
                  onDelete={(id) => setState(prev => ({ ...prev, crossSections: prev.crossSections.filter(c => c.id !== id), activeCrossSectionId: null }))}
                />
              )}
              {activeTab === 'header' && activeBorehole && (
                <div className="animate-in fade-in slide-in-from-left-4 duration-300">
                  <HeaderForm 
                    projectMetadata={state.projectMetadata}
                    onProjectMetadataChange={updateProjectMetadata}
                    boreholeHeader={activeBorehole.header} 
                    onBoreholeHeaderChange={handleHeaderChange} 
                  />
                </div>
              )}
              {activeTab === 'layers' && activeBorehole && (
                <div className="h-full animate-in fade-in slide-in-from-left-4 duration-300">
                  <LayerForm layers={activeBorehole.layers} onUpdate={handleLayersUpdate} />
                </div>
              )}
              {activeTab === 'water' && activeBorehole && (
                <div className="h-full animate-in fade-in slide-in-from-left-4 duration-300">
                  <WaterForm waterLevels={activeBorehole.waterLevels} onUpdate={handleWaterUpdate} />
                </div>
              )}
              {activeTab === 'report' && (
                <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-4 p-6 text-center">
                  <FileText size={48} className="text-slate-200" />
                  <div>
                    <p className="font-bold text-slate-600">Raport Geologiczny</p>
                    <p className="text-xs">Wygeneruj obszerny opis geologiczny na podstawie wszystkich wprowadzonych danych.</p>
                  </div>
                  <button 
                    onClick={() => setActiveTab('report')}
                    className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg text-xs font-bold"
                  >
                    PRZEJDŹ DO RAPORTU
                  </button>
                </div>
              )}
           </div>
        </div>

        {/* Dynamic Preview Area */}
        <div className="flex-1 bg-slate-200/50 p-10 overflow-auto flex justify-center items-start print:p-0 print:m-0 print:bg-white print:block print:overflow-visible">
           {/* Kontener podglądu, który traci transformacje i skalowanie podczas druku */}
           <div className={`scale-90 lg:scale-100 origin-top shadow-2xl transition-transform duration-500 print-container ${state.activeCrossSectionId || activeTab === 'report' ? 'max-w-none w-full' : ''}`}>
              <div ref={reportRef}>
                {activeTab === 'report' ? (
                  <GeologicalReport 
                    boreholes={state.boreholes} 
                    projectMetadata={state.projectMetadata}
                  />
                ) : state.activeCrossSectionId && activeCrossSection ? (
                  <CrossSectionPreview 
                    crossSection={activeCrossSection} 
                    boreholes={state.boreholes} 
                    projectMetadata={state.projectMetadata}
                  />
                ) : activeBorehole ? (
                  <ReportPreview 
                    data={activeBorehole} 
                    projectMetadata={state.projectMetadata}
                  />
                ) : (
                  <div className="bg-white p-20 rounded-xl shadow-inner text-center">
                    <LayersIcon size={48} className="mx-auto text-slate-300 mb-4" />
                    <p className="text-slate-500 font-bold">Wybierz lub dodaj otwór, aby zobaczyć podgląd</p>
                  </div>
                )}
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};

export default App;
