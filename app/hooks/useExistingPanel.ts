import { useState, useCallback } from "react";
import type { ExistingPanelInfo, PanelCircuit, ExistingCircuit, NewCircuit } from "../types/existingPanel";
const DEFAULT_INFO: ExistingPanelInfo = {
  customerName: "",
  projectName: "",
  panelName: "",
  location: "",
  date: new Date().toISOString().split("T")[0],
  mainBreakerSize: "",
  mainBreakerType: 'מא"ז',
  earthingSystem: "TN-C-S",
  panelPhoto: null,
};

const DEFAULT_EXISTING: Omit<ExistingCircuit, "id"> = {
  isNew: false,
  circuitNumber: "",
  existingBreakerSize: "3x32A",
  existingBreakerType: 'מא"ז',
  calibration: "",
  feedConnection: "ישירות למפסק - חיבור מהיר",
  addRcd: false,
  rcdSpec: "4x40A Type A 30mA",
  addTerminal: false,
  cableType: "N2XY נחושת",
  cableCores: "5",
  cableSize: "6",
  peCableSize: "ללא",
  breakerPhoto: null,
  charger: "AC 22kW",
};

const DEFAULT_NEW: Omit<NewCircuit, "id"> = {
  isNew: true,
  charger: "AC 22kW",
  breakerType: 'מא"ז',
  breaker: "3x32A",
  rcd: "ללא",
  terminal: "ישירות למפסק / פחת",
  wireSize: "6",
  connectionType: "חיבור ישיר",
  neutralConnection: "חיבור ישיר",
  peConnection: "חיבור ישיר",
  cableType: "N2XY נחושת",
  cableCores: "5",
  cableSize: "6",
  peCableSize: "ללא",
  feedConnection: "ישירות למפסק - חיבור מהיר",
  feedNLug: false,
  feedPELug: false,
  calibration: "",
  circuitName: "",
};

export const useExistingPanel = () => {
  const [info, setInfo] = useState<ExistingPanelInfo>(DEFAULT_INFO);
  const [circuits, setCircuits] = useState<PanelCircuit[]>([]);

  const updateInfo = useCallback(<K extends keyof ExistingPanelInfo>(
    field: K, value: ExistingPanelInfo[K]
  ) => {
    setInfo(prev => ({ ...prev, [field]: value }));
  }, []);

  const addExistingCircuit = useCallback(() => {
    setCircuits(prev => [...prev, { ...DEFAULT_EXISTING, id: Date.now() }]);
  }, []);

  const addNewCircuit = useCallback(() => {
    setCircuits(prev => [...prev, { ...DEFAULT_NEW, id: Date.now() }]);
  }, []);

  const removeCircuit = useCallback((id: number) => {
    setCircuits(prev => prev.filter(c => c.id !== id));
  }, []);

const updateCircuit = useCallback((
    id: number, field: string, value: any
  ) => {
    setCircuits(prev => prev.map(c => c.id === id ? { ...c, [field]: value } : c));
  }, []);

  return { info, updateInfo, circuits, addExistingCircuit, addNewCircuit, removeCircuit, updateCircuit };
};
