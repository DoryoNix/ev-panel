import type { Circuit, EquipmentItem, ProjectInfo } from "../types";

export const getBreakerAmp = (value: string): number | null => {
  const match = value.match(/(\d+(?:\.\d+)?)(?=A)/);
  if (!match) return null;
  return Number(match[1]);
};

export const formatAmp = (amp: number): string =>
  amp % 1 === 0 ? String(amp) : amp.toFixed(1);

export const calcContinuousRating = (breakerValue: string): string => {
  const amp = getBreakerAmp(breakerValue);
  if (amp === null) return "";
  return `3x${formatAmp(amp * 0.8)}A`;
};

export const calcIncLabel = (breakerValue: string): string => {
  const amp = getBreakerAmp(breakerValue);
  if (amp === null) return "";
  return `Inc=3x${formatAmp(amp * 0.8)}A`;
};

export const chargerLabel = (charger: string): string =>
  charger.startsWith("DC") ? "עמדת טעינה DC" : "עמדת טעינה AC";

export const splitToPages = <T>(items: T[], perPage = 6): T[][] => {
  if (items.length === 0) return [[]];
  const pages: T[][] = [];
  for (let i = 0; i < items.length; i += perPage) {
    pages.push(items.slice(i, i + perPage));
  }
  return pages;
};

export const getEquipmentItems = (
  info: ProjectInfo,
  circuits: Circuit[]
): EquipmentItem[] => {
  const items: EquipmentItem[] = [];

  // מפסק ראשי
  if (info.mainBreakerAmp) {
    items.push({
      item: `${info.mainBreakerType} ראשי ${info.mainBreakerAmp}`,
      qty: 1,
      notes: info.mainBreakerType === "מפסק משולב פחת"
        ? "מותקן בלוח הראשי + הגנת זליגה ללוח"
        : "מותקן בלוח הראשי",
    });
  }

  // פחת כללי
  if (info.mainRcd && info.mainRcd !== "ללא") {
    items.push({
      item: `פחת כללי ${info.mainRcd}`,
      qty: 1,
      notes: "הגנת זליגה כללית ללוח",
    });
  }

  // מפסקי מעגלים
  const breakers = circuits.reduce((acc: Record<string, number>, c) => {
    const key = `${c.breakerType} ${c.breaker}`;
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
  Object.entries(breakers).forEach(([breaker, qty]) => {
    items.push({
      item: breaker,
      qty,
      notes: breaker.includes("מפסק משולב פחת")
        ? "להזנת מעגלי טעינה + הגנת זליגה למעגל"
        : "להזנת מעגלי טעינה",
    });
  });

  // פחתים נפרדים
  const rcds = circuits
    .filter((c) => c.rcd !== "ללא")
    .reduce((acc: Record<string, number>, c) => {
      acc[c.rcd] = (acc[c.rcd] || 0) + 1;
      return acc;
    }, {});
  Object.entries(rcds).forEach(([rcd, qty]) => {
    items.push({ item: `פחת ${rcd}`, qty, notes: "הגנת זליגה למעגל טעינה" });
  });

  // מהדקי פס דין לפי גודל גיד
  const terminalsBySize = circuits
    .filter((c) => c.terminal === "דרך מהדקי פס דין")
    .reduce((acc: Record<string, number>, c) => {
      const key = `מהדק פס דין ${c.wireSize} ממ"ר`;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
  Object.entries(terminalsBySize).forEach(([label, qty]) => {
    items.push({ item: label, qty, notes: "חיבור יציאה לעמדות טעינה" });
  });

  // נעלי כבל — גיד פנימי למפסק
  const lugsBreaker = circuits
    .filter((c) => c.connectionType === "נעל כבל")
    .reduce((acc: Record<string, number>, c) => {
      const key = `נעל כבל נחושת ${c.wireSize} ממ"ר`;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
  Object.entries(lugsBreaker).forEach(([label, qty]) => {
    items.push({ item: label, qty, notes: "חיבור גיד פנימי למפסק / פחת" });
  });

  // נעלי כבל — גיד N פנימי
  const lugsN = circuits
    .filter((c) => c.neutralConnection === "נעל כבל")
    .reduce((acc: Record<string, number>, c) => {
      const key = `נעל כבל נחושת ${c.wireSize} ממ"ר`;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
  Object.entries(lugsN).forEach(([label, qty]) => {
    items.push({ item: label, qty, notes: "חיבור גיד N" });
  });

  // נעלי כבל — גיד PE פנימי
  const lugsPE = circuits
    .filter((c) => c.peConnection === "נעל כבל")
    .reduce((acc: Record<string, number>, c) => {
      const key = `נעל כבל נחושת ${c.wireSize} ממ"ר`;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
  Object.entries(lugsPE).forEach(([label, qty]) => {
    items.push({ item: label, qty, notes: "חיבור גיד PE" });
  });

  // גידים גמישים פנימיים
  const wires = circuits.reduce((acc: Record<string, number>, c) => {
    const key = `גיד גמיש PVC נחושת ${c.wireSize} ממ"ר`;
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
  Object.entries(wires).forEach(([wire, qty]) => {
    items.push({ item: wire, qty, notes: "הזנות פנימיות בלוח" });
  });

  // ===== כבל הזנה לעמדה =====
  const isAluminum = (c: Circuit) => c.cableType === "NA2XY אלומיניום";
  const lugMaterial = (c: Circuit) => isAluminum(c) ? "אלומיניום" : "נחושת";

  circuits.forEach((c) => {
    // נעלי כבל — חיבור ישיר למפסק עם נעל כבל
    if (c.feedConnection === "ישירות למפסק - נעל כבל") {
      const numCores = parseInt(c.cableCores);
      const mat = lugMaterial(c);
      const key = `נעל כבל ${mat} ${c.cableSize} ממ"ר`;

      items.push({
        item: key,
        qty: numCores,
        notes: `חיבור כבל הזנה ${c.cableType} ${c.cableCores}x${c.cableSize} למפסק`,
      });

      // PE נפרד
      if (c.peCableSize !== "ללא") {
        items.push({
          item: `נעל כבל נחושת ${c.peCableSize} ממ"ר`,
          qty: 1,
          notes: "חיבור גיד PE נפרד",
        });
      }
    }

    // נעלי כבל N ו-PE כשמתחבר למהדק פס דין
    if (c.feedConnection === "מהדק פס דין") {
      if (c.feedNLug) {
        items.push({
          item: `נעל כבל נחושת ${c.cableSize} ממ"ר`,
          qty: 1,
          notes: "חיבור גיד N למהדק",
        });
      }
      if (c.feedPELug) {
        const peSize = c.peCableSize !== "ללא" ? c.peCableSize : c.cableSize;
        items.push({
          item: `נעל כבל נחושת ${peSize} ממ"ר`,
          qty: 1,
          notes: "חיבור גיד PE למהדק",
        });
      }
    }
  });

  return items;
};