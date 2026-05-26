import { useState, useCallback } from "react";
import type { ProjectInfo } from "../types";

const DEFAULT_INFO: ProjectInfo = {
  customerName: "",
  projectName: "",
  panelName: "",
  location: "",
  date: new Date().toISOString().split("T")[0],
  mainBreakerAmp: "",
  mainBreakerType: 'מא"ז',
  mainBreakerCalibration: "",
  earthingSystem: "TN-C-S",
  mainRcd: "ללא",
  panelMaterial: "פח",
  panelInstallation: "פנימית",
  panelCabling: "מלמטה",
  panelLock: "ללא מפתח",
  logoChoice: "doryonix",
};

export const useProjectInfo = () => {
  const [info, setInfo] = useState<ProjectInfo>(DEFAULT_INFO);

  const updateInfo = useCallback(
    <K extends keyof ProjectInfo>(field: K, value: ProjectInfo[K]) => {
      setInfo((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  return { info, updateInfo };
};
