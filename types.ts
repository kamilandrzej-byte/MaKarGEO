
export enum SoilType {
  Fill = 'Mg',
  Topsoil = 'Gb',
  Clay = 'Cl',
  Silt = 'Si',
  Sand = 'Sa',
  Gravel = 'Gr',
  Peat = 'Pt',
  Till = 'Ti',
  Mud = 'Mu',
  Loam = 'SaSiCl',
}

export interface Layer {
  id: string;
  depthBottom: number;
  soilType: SoilType;
  secondarySoilType?: SoilType;
  fraction?: string;
  color?: string;
  admixture?: string;
  admixtureType?: string;
  interlayer?: string;
  interlayerType?: string;
  description: string;
  stratigraphy: string;
  symbol: string;
  moisture: string;
  consistencyIndex?: string;
  densityIndex?: string;
  state?: string;
  plasticity?: string;
  organicContent?: string;
  carbonateContent?: string;
  geoLayerNumber?: string;
}

export interface ProjectMetadata {
  companyName: string;
  companyAddress: string;
  projectNumber: string;
  location: string;
  commune: string;
  district: string;
  province: string;
  objectName: string;
  client: string;
}

export interface BoreholeHeader {
  boreholeId: string;
  drillingRig: string;
  coordinatesX: string;
  coordinatesY: string;
  drillingSystem: string;
  elevation: string;
  scale: string;
  date: string;
}

export interface Borehole {
  id: string;
  header: BoreholeHeader;
  layers: Layer[];
  waterLevels: WaterLevel[];
  distanceFromStart?: number; // Distance in meters from the start of the cross-section
}

export interface CrossSection {
  id: string;
  name: string;
  boreholeIds: string[]; // IDs of boreholes in order
  distances: number[]; // Distances between consecutive boreholes
}

export enum WaterType {
  Stabilized = 'stabilized',
  Encountered = 'encountered',
  Seepage = 'seepage',
}

export interface WaterLevel {
  id: string;
  depth: number;
  type: WaterType;
  label?: string;
}

export interface AppState {
  projectMetadata: ProjectMetadata;
  boreholes: Borehole[];
  crossSections: CrossSection[];
  activeBoreholeId: string | null;
  activeCrossSectionId: string | null;
}
