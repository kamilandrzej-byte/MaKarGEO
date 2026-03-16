
import React from 'react';
import { SoilType } from './types';

export const SOIL_OPTIONS = [
  { value: SoilType.Topsoil, label: 'Gleba (Gb)', code: 'Gb', pl: 'humus', symbol: 'Gb' },
  { value: SoilType.Fill, label: 'Nasyp (Mg)', code: 'Mg', pl: 'nasyp', symbol: 'nN' },
  { value: SoilType.Sand, label: 'Piasek (Sa)', code: 'Sa', pl: 'piasek', symbol: 'P' },
  { value: SoilType.Gravel, label: 'Żwir (Gr)', code: 'Gr', pl: 'żwir', symbol: 'Ż' },
  { value: SoilType.Silt, label: 'Pył (Si)', code: 'Si', pl: 'pył', symbol: 'π' },
  { value: SoilType.Clay, label: 'Ił (Cl)', code: 'Cl', pl: 'ił', symbol: 'I' },
  { value: SoilType.Loam, label: 'Glina (saclSi)', code: 'saclSi', pl: 'glina', symbol: 'G' },
  { value: SoilType.Peat, label: 'Torf (Pt)', code: 'Pt', pl: 'torf', symbol: 'T' },
  { value: SoilType.Mud, label: 'Namuł (Mu)', code: 'Mu', pl: 'namuł', symbol: 'Nm' },
];

export const FRACTIONS = [
  { value: 'f', label: 'Drobny', pl: 'drobny', sym: 'd' },
  { value: 'm', label: 'Średni', pl: 'średni', sym: 's' },
  { value: 'c', label: 'Gruby', pl: 'gruby', sym: 'g' },
  { value: 'v', label: 'Bardzo gruby', pl: 'bardzo gruby', sym: 'bg' },
];

export const COLORS = [
  { value: 'yl', label: 'Żółty', pl: 'żółty' },
  { value: 'gr', label: 'Szary', pl: 'szary' },
  { value: 'dgr', label: 'Ciemnoszary', pl: 'ciemnoszary' },
  { value: 'br', label: 'Brązowy', pl: 'brązowy' },
  { value: 'dbr', label: 'Ciemnobrązowy', pl: 'ciemnobrązowy' },
  { value: 'bl', label: 'Czarny', pl: 'czarny' },
  { value: 'be', label: 'Beżowy', pl: 'beżowy' },
  { value: 'ol', label: 'Oliwkowy', pl: 'oliwkowy' },
  { value: 'rd', label: 'Rdzawy', pl: 'rdzawy' },
];

export const ADMIXTURE_OPTIONS = [
  { value: 'hum', label: 'Humus', pl: 'humusu' },
  { value: 'org', label: 'Subst. org.', pl: 'substancji organicznej' },
  { value: 'gr', label: 'Żwir', pl: 'żwiru' },
  { value: 'sa', label: 'Piasek', pl: 'piasku' },
  { value: 'si', label: 'Pył', pl: 'pyłu' },
  { value: 'cl', label: 'Ił', pl: 'iłu' },
  { value: 'sh', label: 'Muszle', pl: 'muszli' },
  { value: 'st', label: 'Kamienie', pl: 'kamieni' },
  { value: 'ro', label: 'Korzenie', pl: 'korzeni' },
];

export const INTERLAYER_OPTIONS = [
  { value: 'sa', label: 'Piasek', pl: 'piasku' },
  { value: 'si', label: 'Pył', pl: 'pyłu' },
  { value: 'cl', label: 'Ił', pl: 'iłu' },
  { value: 'org', label: 'Subst. org.', pl: 'substancji organicznej' },
  { value: 'hum', label: 'Humus', pl: 'humusu' },
];

export const STATE_OPTIONS = [
  { value: 'ln', label: 'Luźny', pl: 'luźny' },
  { value: 'szg', label: 'Średnio zagęszczony', pl: 'średnio zagęszczony' },
  { value: 'zg', label: 'Zagęszczony', pl: 'zagęszczony' },
  { value: 'bzg', label: 'Bardzo zagęszczony', pl: 'bardzo zagęszczony' },
  { value: 'pl', label: 'Plastyczny', pl: 'plastyczny' },
  { value: 'mpl', label: 'Miękkoplastyczny', pl: 'miękkoplastyczny' },
  { value: 'tpl', label: 'Twardoplastyczny', pl: 'twardoplastyczny' },
  { value: 'pzw', label: 'Półzwarty', pl: 'półzwarty' },
  { value: 'zw', label: 'Zwarty', pl: 'zwarty' },
];

export const PLASTICITY_OPTIONS = [
  { value: 'low', label: 'Niska', pl: 'niska' },
  { value: 'med', label: 'Średnia', pl: 'średnia' },
  { value: 'high', label: 'Wysoka', pl: 'wysoka' },
];

export const ORGANIC_OPTIONS = [
  { value: 'none', label: 'Brak', pl: 'brak' },
  { value: 'low', label: 'Niska', pl: 'niska' },
  { value: 'med', label: 'Średnia', pl: 'średnia' },
  { value: 'high', label: 'Wysoka', pl: 'wysoka' },
];

export const CARBONATE_OPTIONS = [
  { value: 'none', label: 'Brak', pl: 'brak' },
  { value: 'weak', label: 'Słaba', pl: 'słaba' },
  { value: 'strong', label: 'Silna', pl: 'silna' },
];

export const MOISTURE = [
  { value: 's', label: 'Suchy (s)' },
  { value: 'mw', label: 'Małowilgotny (mw)' },
  { value: 'w', label: 'Wilgotny (w)' },
  { value: 'nw', label: 'Nawodniony (nw)' },
];

export const INITIAL_PROJECT_METADATA = {
  companyName: 'Zakład Usług Geotechnicznych',
  companyAddress: 'ul. Geologiczna 1, 00-001 Warszawa',
  projectNumber: '1/2025',
  location: 'Warszawa',
  commune: 'Centrum',
  district: 'Warszawski',
  province: 'Mazowieckie',
  objectName: 'Budowa biurowca',
  client: 'Inwestor Sp. z o.o.',
};

export const INITIAL_BOREHOLE_METADATA = {
  boreholeId: '1',
  drillingRig: 'H15S',
  coordinatesX: '000000.00',
  coordinatesY: '000000.00',
  drillingSystem: 'Udarowy',
  elevation: '105.50 m n.p.m.',
  scale: '1 : 50',
  date: new Date().toLocaleDateString('pl-PL'),
};

export const SoilPatternsDefs = () => (
  <svg style={{ position: 'absolute', width: 0, height: 0, visibility: 'hidden' }} aria-hidden="true">
    <defs>
      <pattern id="pattern-Sa" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
        <circle cx="2" cy="2" r="0.5" fill="#000" />
        <circle cx="7" cy="6" r="0.5" fill="#000" />
        <circle cx="4" cy="8" r="0.5" fill="#000" />
      </pattern>
      <pattern id="pattern-Gr" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
        <circle cx="5" cy="5" r="2.5" fill="none" stroke="#000" strokeWidth="0.8" />
        <circle cx="15" cy="15" r="3.5" fill="none" stroke="#000" strokeWidth="0.8" />
      </pattern>
      <pattern id="pattern-Cl" x="0" y="0" width="10" height="6" patternUnits="userSpaceOnUse">
        <line x1="0" y1="3" x2="10" y2="3" stroke="#000" strokeWidth="0.8" />
      </pattern>
      <pattern id="pattern-Si" x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse">
        <line x1="1" y1="1" x2="1" y2="7" stroke="#000" strokeWidth="0.6" strokeDasharray="1 2" />
        <line x1="5" y1="1" x2="5" y2="7" stroke="#000" strokeWidth="0.6" strokeDasharray="1 2" />
      </pattern>
      <pattern id="pattern-Gb" x="0" y="0" width="12" height="12" patternUnits="userSpaceOnUse">
         <line x1="0" y1="12" x2="12" y2="0" stroke="#000" strokeWidth="1.2" />
         <line x1="0" y1="0" x2="12" y2="12" stroke="#000" strokeWidth="1.2" />
      </pattern>
      <pattern id="pattern-Mg" x="0" y="0" width="15" height="15" patternUnits="userSpaceOnUse">
         <rect width="15" height="15" fill="none" stroke="#000" strokeWidth="0.6" />
         <line x1="0" y1="0" x2="15" y2="15" stroke="#000" strokeWidth="0.6" />
      </pattern>
      <pattern id="pattern-Pt" x="0" y="0" width="12" height="12" patternUnits="userSpaceOnUse">
         <rect width="12" height="12" fill="#5d4037" />
         <line x1="3" y1="0" x2="3" y2="12" stroke="#3e2723" strokeWidth="2.5" />
         <line x1="9" y1="0" x2="9" y2="12" stroke="#3e2723" strokeWidth="2.5" />
      </pattern>
      <pattern id="pattern-Mu" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
        <circle cx="5" cy="5" r="2" fill="none" stroke="#000" strokeWidth="0.6" />
        <line x1="0" y1="5" x2="10" y2="5" stroke="#000" strokeWidth="0.4" />
      </pattern>
      <pattern id="pattern-SaSiCl" x="0" y="0" width="15" height="15" patternUnits="userSpaceOnUse">
        <line x1="0" y1="15" x2="15" y2="0" stroke="#000" strokeWidth="0.8" />
        <line x1="0" y1="7.5" x2="15" y2="7.5" stroke="#000" strokeWidth="0.5" strokeDasharray="2 2" />
      </pattern>
      <pattern id="pattern-Ti" x="0" y="0" width="12" height="12" patternUnits="userSpaceOnUse">
        <rect width="12" height="12" fill="none" stroke="#000" strokeWidth="0.6" />
        <circle cx="6" cy="6" r="1.5" fill="#000" />
      </pattern>
    </defs>
  </svg>
);

export const getPatternDataUri = (type: SoilType) => {
  let svg = '';
  switch (type) {
    case SoilType.Sand:
      svg = `<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10"><circle cx="2" cy="2" r="0.5" fill="#000" /><circle cx="7" cy="6" r="0.5" fill="#000" /><circle cx="4" cy="8" r="0.5" fill="#000" /></svg>`;
      break;
    case SoilType.Gravel:
      svg = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"><circle cx="5" cy="5" r="2.5" fill="none" stroke="#000" stroke-width="0.8" /><circle cx="15" cy="15" r="3.5" fill="none" stroke="#000" stroke-width="0.8" /></svg>`;
      break;
    case SoilType.Clay:
      svg = `<svg xmlns="http://www.w3.org/2000/svg" width="10" height="6"><line x1="0" y1="3" x2="10" y2="3" stroke="#000" stroke-width="0.8" /></svg>`;
      break;
    case SoilType.Silt:
      svg = `<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8"><line x1="1" y1="1" x2="1" y2="7" stroke="#000" stroke-width="0.6" stroke-dasharray="1 2" /><line x1="5" y1="1" x2="5" y2="7" stroke="#000" stroke-width="0.6" stroke-dasharray="1 2" /></svg>`;
      break;
    case SoilType.Topsoil:
      svg = `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12"><line x1="0" y1="12" x2="12" y2="0" stroke="#000" stroke-width="1.2" /><line x1="0" y1="0" x2="12" y2="12" stroke="#000" stroke-width="1.2" /></svg>`;
      break;
    case SoilType.Fill:
      svg = `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15"><rect width="15" height="15" fill="none" stroke="#000" stroke-width="0.6" /><line x1="0" y1="0" x2="15" y2="15" stroke="#000" stroke-width="0.6" /></svg>`;
      break;
    case SoilType.Peat:
      svg = `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12"><rect width="12" height="12" fill="#5d4037" /><line x1="3" y1="0" x2="3" y2="12" stroke="#3e2723" stroke-width="2.5" /><line x1="9" y1="0" x2="9" y2="12" stroke="#3e2723" stroke-width="2.5" /></svg>`;
      break;
    case SoilType.Mud:
      svg = `<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10"><circle cx="5" cy="5" r="2" fill="none" stroke="#000" stroke-width="0.6" /><line x1="0" y1="5" x2="10" y2="5" stroke="#000" stroke-width="0.4" /></svg>`;
      break;
    case SoilType.Loam:
      svg = `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15"><line x1="0" y1="15" x2="15" y2="0" stroke="#000" stroke-width="0.8" /><line x1="0" y1="7.5" x2="15" y2="7.5" stroke="#000" stroke-width="0.5" stroke-dasharray="2 2" /></svg>`;
      break;
    case SoilType.Till:
      svg = `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12"><rect width="12" height="12" fill="none" stroke="#000" stroke-width="0.6" /><circle cx="6" cy="6" r="1.5" fill="#000" /></svg>`;
      break;
    default:
      return '';
  }
  return `data:image/svg+xml;base64,${btoa(svg)}`;
};

export const getBackgroundColor = (type: SoilType) => {
    switch (type) {
      case SoilType.Sand: return '#fff9c4'; // Light yellow
      case SoilType.Gravel: return '#ffe0b2'; // Orange-yellow
      case SoilType.Clay: return '#e1f5fe'; // Light blue
      case SoilType.Silt: return '#f5f5f5'; // Light gray
      case SoilType.Topsoil: return '#bdbdbd'; // Gray
      case SoilType.Fill: return '#eeeeee'; // Very light gray
      case SoilType.Peat: return '#d7ccc8'; // Brownish gray
      case SoilType.Mud: return '#b2dfdb'; // Teal-gray
      case SoilType.Loam: return '#fff59d'; // Yellow
      case SoilType.Till: return '#cfd8dc'; // Blue-gray
      default: return '#ffffff';
    }
};
