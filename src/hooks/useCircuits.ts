import { useState, useCallback } from "react";
import type { Circuit, ChargerType, BreakerType, RcdOption, TerminalOption, WireSize, ConnectionType, NeutralConnection, CableType, CableCores, CableSize, FeedConnection } from "../types";

const DEFAULT_CIRCUIT: Omit<Circuit, "id"> = {
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
};

export const useCircuits = () => {
  const [circuits, setCircuits] = useState<Circuit[]>([]);

  const addCircuit = useCallback(() => {
    setCircuits((prev) => [...prev, { ...DEFAULT_CIRCUIT, id: Date.now() }]);
  }, []);

  const removeCircuit = useCallback((id: number) => {
    setCircuits((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const updateCircuit = useCallback(
    <K extends keyof Circuit>(id: number, field: K, value: Circuit[K]) => {
      setCircuits((prev) =>
        prev.map((c) => (c.id === id ? { ...c, [field]: value } : c))
      );
    },
    []
  );

  const duplicateCircuit = useCallback((id: number) => {
    setCircuits((prev) => {
      const src = prev.find((c) => c.id === id);
      if (!src) return prev;
      const idx = prev.indexOf(src);
      const copy = { ...src, id: Date.now() };
      const next = [...prev];
      next.splice(idx + 1, 0, copy);
      return next;
    });
  }, []);

  return { circuits, addCircuit, removeCircuit, updateCircuit, duplicateCircuit };
};