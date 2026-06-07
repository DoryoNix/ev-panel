export type BreakerType = 'מא"ז' | "ברייקר TMD" | "ברייקר LSI" | "מפסק משולב פחת";
export type EarthingSystem = "TN-C-S" | "TN-S" | "TT";
export type PanelMaterial = "פח" | "פוליאסטר" | "CI";
export type PanelInstallation = "פנימית" | "חיצונית";
export type PanelCabling = "מלמטה" | "מלמעלה" | "מהצדדים";
export type PanelLock = "ללא מפתח" | "עם מפתח";
export type RcdOption = "ללא" | "4x40A Type A 30mA" | "4x40A Type A 300mA" | "4x63A Type A 30mA" | "4x63A Type A 300mA";
export type TerminalOption = "ישירות למפסק / פחת" | "דרך מהדקי פס דין";
export type ChargerType = "AC 11kW" | "AC 2X11kW" | "AC 22kW" | "AC 2X22kW" | "DC 30kW" | "DC 60kW" | "DC 90kW" | "DC 120kW" | "DC 150kW" | "DC 180kW" | "DC 200kW";
export type WireSize = "2.5" | "4" | "6" | "10" | "16" | "25" | "35" | "50" | "70" | "95" | "120";
export type ConnectionType = "חיבור ישיר" | "נעל כבל" | "חיבור מהיר";
export type NeutralConnection = "חיבור ישיר" | "נעל כבל" | "אומגה" | "מהדק פס דין";
export type CableType = "N2XY נחושת" | "NA2XY אלומיניום" | "גיד PVC נחושת";
export type CableCores = "4" | "5";
export type CableSize = "6" | "10" | "16" | "25" | "35" | "50" | "70" | "95" | "120" | "150" | "185" | "240";
export type FeedConnection = "מהדק פס דין" | "ישירות למפסק - חיבור מהיר" | "ישירות למפסק - נעל כבל";
export type LogoChoice = "doryonix" | "edgecontrol";

export type Circuit = {
  id: number;
  charger: ChargerType;
  breakerType: BreakerType;
  breaker: string;
  rcd: RcdOption;
  terminal: TerminalOption;
  wireSize: WireSize;
  connectionType: ConnectionType;
  neutralConnection: NeutralConnection;
  peConnection: NeutralConnection;
  cableType: CableType;
  cableCores: CableCores;
  cableSize: CableSize;
  peCableSize: CableSize | "ללא";
  feedConnection: FeedConnection;
  feedNLug: boolean;
  feedPELug: boolean;
};

export type ProjectInfo = {
  customerName: string;
  projectName: string;
  panelName: string;
  location: string;
  date: string;
  mainBreakerAmp: string;
  mainBreakerType: BreakerType;
  mainBreakerCalibration: string;
  earthingSystem: EarthingSystem;
  mainRcd: string;
  panelMaterial: PanelMaterial;
  panelInstallation: PanelInstallation;
  panelCabling: PanelCabling;
  panelLock: PanelLock;
  logoChoice: LogoChoice;
};

export type EquipmentItem = {
  item: string;
  qty: number;
  notes: string;
};
