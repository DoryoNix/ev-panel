export type ExistingBreakerSize =
  | "3x16A" | "3x20A" | "3x25A" | "3x32A" | "3x40A" | "3x50A"
  | "3x63A" | "3x80A" | "3x100A" | "3x125A" | "3x160A" | "3x200A"
  | "3x250A" | "3x315A" | "3x400A" | "3x630A";

export type EarthingSystem = "TN-C-S" | "TN-S" | "TT";
export type BreakerType = 'מא"ז' | "ברייקר TMD" | "ברייקר LSI" | "מפסק משולב פחת";
export type CableType = "N2XY נחושת" | "NA2XY אלומיניום" | "גיד PVC נחושת";
export type CableCores = "4" | "5";
export type CableSize = "6" | "10" | "16" | "25" | "35" | "50" | "70" | "95" | "120" | "150" | "185" | "240";
export type FeedConnection = "מהדק פס דין" | "ישירות למפסק - חיבור מהיר" | "ישירות למפסק - נעל כבל";
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
  mainBreakerType: BreakerType;
  earthingSystem: EarthingSystem;
  panelPhoto: string | null;
};
