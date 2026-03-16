
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { Borehole, ProjectMetadata } from '../types';
import { FileText, Loader2, Download, RefreshCw } from 'lucide-react';

interface Props {
  boreholes: Borehole[];
  projectMetadata: ProjectMetadata;
}

const GeologicalReport: React.FC<Props> = ({ boreholes, projectMetadata }) => {
  const [report, setReport] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const generateReport = async () => {
    setLoading(true);
    setError(null);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
      const model = "gemini-3.1-pro-preview"; // Using pro for complex reasoning and long output

      const boreholeDataString = boreholes.map(b => {
        const layers = b.layers.map(l => `- ${l.depthBottom}m: ${l.soilType} (${l.description}), symbol: ${l.symbol}`).join('\n');
        const water = b.waterLevels.map(w => `- ${w.type}: ${w.depth}m`).join('\n');
        return `Otwór ${b.header.boreholeId}:\nRzędna: ${b.header.elevation}\nWarstwy:\n${layers}\nWoda:\n${water}`;
      }).join('\n\n');

      const prompt = `
        Jesteś profesjonalnym geologiem i inżynierem geotechnikiem. Na podstawie poniższych danych z otworów wiertniczych oraz informacji o projekcie, przygotuj obszerny, profesjonalny opis geologiczny badanego terenu.
        
        Dane projektu:
        - Obiekt: ${projectMetadata.objectName}
        - Lokalizacja: ${projectMetadata.location}, ${projectMetadata.commune}, ${projectMetadata.district}, ${projectMetadata.province}
        - Zleceniodawca: ${projectMetadata.client}
        - Nr projektu: ${projectMetadata.projectNumber}
        - Firma wykonawcza: ${projectMetadata.companyName}
        
        Dane z otworów:
        ${boreholeDataString}
        
        Opis musi zawierać następujące sekcje:
        1. Wstęp i lokalizacja badań (uwzględnij dane projektu).
        2. Warunki geologiczne i litologia (szczegółowy opis warstw).
        3. Warunki hydrogeologiczne (analiza występowania wody, poziomy stabilizacji).
        4. Warunki geotechniczne i budowlane (ocena przydatności gruntów pod budowę, parametry, nośność).
        5. Przepuszczalność gruntów (analiza filtracji dla poszczególnych rodzajów gruntów).
        6. Podsumowanie i wnioski końcowe.
        
        Wymagania techniczne:
        - Język: Polski, profesjonalna terminologia techniczna.
        - Długość: Około 1000 wyrazów (bądź bardzo szczegółowy).
        - Format: Markdown z obsługą LaTeX dla notacji matematycznej (np. używaj $10^{-3}$ dla notacji wykładniczej).
        - Styl: Oficjalny raport techniczny.
      `;

      const response = await ai.models.generateContent({
        model: model,
        contents: prompt,
      });

      setReport(response.text || 'Nie udało się wygenerować raportu.');
    } catch (err: any) {
      console.error(err);
      setError('Błąd podczas generowania raportu: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const downloadReport = () => {
    const element = document.createElement("a");
    const file = new Blob([report], {type: 'text/markdown'});
    element.href = URL.createObjectURL(file);
    element.download = "Raport_Geologiczny.md";
    document.body.appendChild(element);
    element.click();
  };

  return (
    <div className="bg-white rounded-xl shadow-xl p-8 max-w-4xl mx-auto min-h-[600px] flex flex-col">
      <div className="flex justify-between items-center mb-8 border-b pb-4">
        <div className="flex items-center gap-3">
          <div className="bg-blue-100 p-2 rounded-lg">
            <FileText className="text-blue-600" size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-black tracking-tight text-slate-800 uppercase">Opis Geologiczny</h2>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Automatyczna analiza terenu</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          {report && (
            <button 
              onClick={downloadReport}
              className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg text-xs font-bold transition-all"
            >
              <Download size={16} /> POBIERZ .MD
            </button>
          )}
          <button 
            onClick={generateReport}
            disabled={loading}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-xs font-bold transition-all disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" size={16} /> : <RefreshCw size={16} />}
            {report ? 'REGENERUJ OPIS' : 'GENERUJ OPIS'}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex-1 flex flex-col items-center justify-center text-slate-400 gap-4">
          <Loader2 className="animate-spin text-blue-600" size={48} />
          <div className="text-center">
            <p className="font-bold text-slate-600">Analizowanie danych geologicznych...</p>
            <p className="text-sm">To może potrwać do minuty ze względu na długość raportu.</p>
          </div>
        </div>
      ) : error ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="bg-red-50 border border-red-200 text-red-600 p-6 rounded-xl text-center max-w-md">
            <p className="font-bold mb-2">Wystąpił błąd</p>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      ) : report ? (
        <div className="flex-1 text-slate-700 leading-relaxed">
          <ReactMarkdown
            remarkPlugins={[remarkMath]}
            rehypePlugins={[rehypeKatex]}
            components={{
              h1: ({node, ...props}) => <h1 className="text-3xl font-black text-slate-900 mt-8 mb-4 uppercase tracking-tight border-b-2 border-slate-100 pb-2" {...props} />,
              h2: ({node, ...props}) => <h2 className="text-2xl font-black text-slate-900 mt-8 mb-4 uppercase tracking-tight" {...props} />,
              h3: ({node, ...props}) => <h3 className="text-xl font-bold text-slate-800 mt-6 mb-3" {...props} />,
              p: ({node, ...props}) => <p className="mb-4 text-justify" {...props} />,
              ul: ({node, ...props}) => <ul className="list-disc pl-6 mb-4 space-y-2" {...props} />,
              ol: ({node, ...props}) => <ol className="list-decimal pl-6 mb-4 space-y-2" {...props} />,
              li: ({node, ...props}) => <li className="pl-1" {...props} />,
              strong: ({node, ...props}) => <strong className="font-bold text-slate-900" {...props} />,
              blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-blue-200 pl-4 italic my-6 text-slate-600" {...props} />,
            }}
          >
            {report}
          </ReactMarkdown>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-slate-400 gap-4 py-20">
          <div className="bg-slate-50 p-8 rounded-full">
            <FileText size={64} className="text-slate-200" />
          </div>
          <div className="text-center max-w-sm">
            <p className="font-bold text-slate-600 mb-2">Brak wygenerowanego opisu</p>
            <p className="text-sm">Kliknij przycisk "Generuj Opis", aby stworzyć profesjonalny raport na podstawie wprowadzonych otworów.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default GeologicalReport;
