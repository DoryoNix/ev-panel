export type ExistingBreakerSize = string;

export type EarthingSystem = "TN-C-S" | "TN-S" | "TT";
export type BreakerType = 'מא"ז' | "ברייקר TMD" | "ברייקר LSI" | "מפסק משולב פחת";
export type CableType = "N2XY נחושת" | "NA2XY אלומיניום" | "גיד PVC נחושת";
export type CableCores = "4" | "5";
export type CableSize = "6" | "10" | "16" | "25" | "35" | "50" | "70" | "95" | "120" | "150" | "185" | "240";
export type FeedConnection = "מהדק פס דין" | "ישירות למפסק - חיבור מהיר" | "ישירות למפסק - נעל כבל";
export type InternalFeedType = "גיד גמיש" | "פס נחושת גמישה";
export type RcdOption = "ללא" | "4x40A Type A 30mA" | "4x40A Type A 300mA" | "4x63A Type A 30mA" | "4x63A Type A 300mA";

export type ExistingCircuit = {
  id: number;
  isNew: false;
  circuitNumber: string;
  existingBreakerSize: ExistingBreakerSize;
  existingBreakerType: BreakerType;
  calibration: string;
  feedConnection: FeedConnection;
  addRcd: boolean;
  rcdSpec: RcdOption;
  addTerminal: boolean;
  cableType: CableType;
  cableCores: CableCores;
  cableSize: CableSize;
  peCableSize: CableSize | "ללא";
  breakerPhoto: string | null;
  breakerPhotos: string[];
  charger: string;
};

export type NewCircuit = {
  id: number;
  isNew: true;
  charger: string;
  breakerType: BreakerType;
  breaker: string;
  rcd: RcdOption;
  terminal: string;
  wireSize: string;
  connectionType: string;
  neutralConnection: string;
  peConnection: string;
  cableType: CableType;
  cableCores: CableCores;
  cableSize: CableSize;
  peCableSize: CableSize | "ללא";
  feedConnection: FeedConnection;
  feedNLug: boolean;
  feedPELug: boolean;
  calibration: string;
  installPhoto: string | null;
  internalFeedType: InternalFeedType;
  internalFeedSize: string;
  circuitName: string;
};

export type PanelCircuit = ExistingCircuit | NewCircuit;

export type ExistingPanelInfo = {
  customerName: string;
  projectName: string;
  panelName: string;
  location: string;
  date: string;
  mainBreakerSize: string;
  mainBreakerCustomSize: string;
  mainBreakerType: BreakerType;
  earthingSystem: EarthingSystem;
  panelPhoto: string | null;
  panelPhotos: string[];
};
