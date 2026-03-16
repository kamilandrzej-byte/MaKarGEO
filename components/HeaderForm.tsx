import React from 'react';
import { ProjectMetadata, BoreholeHeader } from '../types';

interface Props {
  projectMetadata: ProjectMetadata;
  onProjectMetadataChange: (data: ProjectMetadata) => void;
  boreholeHeader: BoreholeHeader;
  onBoreholeHeaderChange: (data: BoreholeHeader) => void;
}

const HeaderForm: React.FC<Props> = ({ 
  projectMetadata, 
  onProjectMetadataChange, 
  boreholeHeader, 
  onBoreholeHeaderChange 
}) => {
  const handleProjectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onProjectMetadataChange({ ...projectMetadata, [name]: value });
  };

  const handleBoreholeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onBoreholeHeaderChange({ ...boreholeHeader, [name]: value });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <h2 className="text-xl font-bold mb-4 text-blue-800 border-b pb-2 flex items-center gap-2">
          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded uppercase tracking-widest">Globalne</span>
          Dane Projektu i Firmy
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-3">
            <h3 className="font-semibold text-sm text-gray-500 uppercase">Firma</h3>
            <Input label="Nazwa Firmy" name="companyName" value={projectMetadata.companyName} onChange={handleProjectChange} />
            <Input label="Adres Firmy" name="companyAddress" value={projectMetadata.companyAddress} onChange={handleProjectChange} />
          </div>
          <div className="space-y-3">
            <h3 className="font-semibold text-sm text-gray-500 uppercase">Projekt</h3>
            <Input label="Nr Projektu / Załącznika" name="projectNumber" value={projectMetadata.projectNumber} onChange={handleProjectChange} />
            <Input label="Zleceniodawca" name="client" value={projectMetadata.client} onChange={handleProjectChange} />
            <Input label="Obiekt / Działka" name="objectName" value={projectMetadata.objectName} onChange={handleProjectChange} />
          </div>
          <div className="space-y-3">
            <h3 className="font-semibold text-sm text-gray-500 uppercase">Lokalizacja Ogólna</h3>
            <Input label="Miejscowość" name="location" value={projectMetadata.location} onChange={handleProjectChange} />
            <Input label="Gmina" name="commune" value={projectMetadata.commune} onChange={handleProjectChange} />
            <Input label="Powiat" name="district" value={projectMetadata.district} onChange={handleProjectChange} />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <h2 className="text-xl font-bold mb-4 text-emerald-800 border-b pb-2 flex items-center gap-2">
          <span className="bg-emerald-100 text-emerald-800 text-xs px-2 py-1 rounded uppercase tracking-widest">Lokalne</span>
          Dane Otworu
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-3">
            <h3 className="font-semibold text-sm text-gray-500 uppercase">Identyfikacja</h3>
            <Input label="Nr Otworu" name="boreholeId" value={boreholeHeader.boreholeId} onChange={handleBoreholeChange} />
            <Input label="Wiertnica" name="drillingRig" value={boreholeHeader.drillingRig} onChange={handleBoreholeChange} />
          </div>
          <div className="space-y-3">
            <h3 className="font-semibold text-sm text-gray-500 uppercase">Współrzędne & Rzędna</h3>
            <div className="grid grid-cols-2 gap-2">
              <Input label="X" name="coordinatesX" value={boreholeHeader.coordinatesX} onChange={handleBoreholeChange} />
              <Input label="Y" name="coordinatesY" value={boreholeHeader.coordinatesY} onChange={handleBoreholeChange} />
            </div>
            <Input label="Rzędna (m n.p.m.)" name="elevation" value={boreholeHeader.elevation} onChange={handleBoreholeChange} />
          </div>
          <div className="space-y-3">
            <h3 className="font-semibold text-sm text-gray-500 uppercase">Technikalia</h3>
            <Input label="System wiercenia" name="drillingSystem" value={boreholeHeader.drillingSystem} onChange={handleBoreholeChange} />
            <div className="grid grid-cols-2 gap-2">
              <Input label="Skala" name="scale" value={boreholeHeader.scale} onChange={handleBoreholeChange} />
              <Input label="Data" name="date" value={boreholeHeader.date} onChange={handleBoreholeChange} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Input = ({ label, name, value, onChange }: { label: string, name: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) => (
  <div>
    <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
    <input
      type="text"
      name={name}
      value={value}
      onChange={onChange}
      className="w-full p-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
    />
  </div>
);

export default HeaderForm;
