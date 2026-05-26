import type { ExistingPanelInfo, PanelCircuit, ExistingCircuit, NewCircuit } from "../types/existingPanel";

type Props = {
  info: ExistingPanelInfo;
  circuits: PanelCircuit[];
  pageNum: number;
  totalPages: number;
};

const B = "#1a3a5c";
const FONT = "'David', 'Arial Hebrew', 'Noto Sans Hebrew', Arial, sans-serif";
const cell: React.CSSProperties = { border: "1px solid #c5d0dc", padding: "6px 8px" };
const th: React.CSSProperties = { ...cell, backgroundColor: B, color: "#fff", padding: "9px 10px", fontWeight: 600 };

type Item = { item: string; qty: number; notes: string; isNew: boolean };

const getItems = (circuits: PanelCircuit[]): Item[] => {
  const items: Item[] = [];
  circuits.forEach((c, idx) => {
    const isAlu = c.cableType === "NA2XY אלומיניום";
    const lugMat = isAlu ? "אלומיניום" : "נחושת";

    if (!c.isNew) {
      const ec = c as ExistingCircuit;
      const label = `מעגל ${ec.circuitNumber || idx + 1}`;
      if (ec.addRcd) items.push({ item: `פחת ${ec.rcdSpec}`, qty: 1, notes: `הגנת זליגה — ${label}`, isNew: true });
      if (ec.addTerminal) items.push({ item: `מהדק פס דין ${ec.cableSize} ממ"ר`, qty: 1, notes: `חיבור יציאה — ${label}`, isNew: true });
      if (ec.calibration) items.push({ item: `כיול ${ec.existingBreakerType} ${ec.existingBreakerSize}`, qty: 1, notes: `${label} — כיול ל-${ec.calibration}`, isNew: false });
      if (ec.feedConnection === "ישירות למפסק - נעל כבל") {
        const cores = parseInt(ec.cableCores);
        items.push({ item: `נעל כבל ${lugMat} ${ec.cableSize} ממ"ר`, qty: cores, notes: `חיבור כבל הזנה — ${label}`, isNew: true });
        if (ec.peCableSize !== "ללא") items.push({ item: `נעל כבל נחושת ${ec.peCableSize} ממ"ר`, qty: 1, notes: `גיד PE — ${label}`, isNew: true });
      }
    } else {
      const nc = c as NewCircuit;
      const newIdx = circuits.filter((x, j) => x.isNew && j <= idx).length;
      const label = `FC${newIdx}`;
      items.push({ item: `${nc.breakerType} ${nc.breaker}`, qty: 1, notes: `${label} — מפסק חדש`, isNew: true });
      if (nc.rcd !== "ללא") items.push({ item: `פחת ${nc.rcd}`, qty: 1, notes: `${label} — הגנת זליגה`, isNew: true });
      if (nc.terminal === "דרך מהדקי פס דין") items.push({ item: `מהדק פס דין ${nc.wireSize} ממ"ר`, qty: 1, notes: `${label} — חיבור יציאה`, isNew: true });
      if (nc.calibration) items.push({ item: `כיול ${nc.breakerType} ${nc.breaker}`, qty: 1, notes: `${label} — כיול ל-${nc.calibration}`, isNew: true });
      if (nc.feedConnection === "ישירות למפסק - נעל כבל") {
        const cores = parseInt(nc.cableCores);
        items.push({ item: `נעל כבל ${lugMat} ${nc.cableSize} ממ"ר`, qty: cores, notes: `חיבור כבל הזנה — ${label}`, isNew: true });
        if (nc.peCableSize !== "ללא") items.push({ item: `נעל כבל נחושת ${nc.peCableSize} ממ"ר`, qty: 1, notes: `גיד PE — ${label}`, isNew: true });
      }
      items.push({ item: `גיד גמיש PVC נחושת ${nc.wireSize} ממ"ר`, qty: 1, notes: `${label} — הזנה פנימית`, isNew: true });
    }
  });
  return items;
};

const FooterCell = ({ l1, v1, l2, v2 }: { l1: string; v1: string; l2: string; v2: string }) => (
  <div style={{ borderLeft: `1.5px solid ${B}`, textAlign: "center", display: "flex", flexDirection: "column", justifyContent: "center", gap: 2, padding: "4px 8px" }}>
    <div style={{ fontSize: 10, color: "#666" }}>{l1}</div>
    <div style={{ fontSize: 12, fontWeight: "bold", color: B }}>{v1 || "-"}</div>
    <div style={{ fontSize: 10, color: "#666" }}>{l2}</div>
    <div style={{ fontSize: 12, fontWeight: "bold", color: B }}>{v2 || "-"}</div>
  </div>
);

export const ExistingEquipmentTable = ({ info, circuits, pageNum, totalPages }: Props) => {
  const items = getItems(circuits);
  const dateStr = new Date(info.date).toLocaleDateString("he-IL");
  const totalUnits = items.reduce((s, i) => s + i.qty, 0);

  return (
    <div className="pdf-page" style={{
      width: 1100, height: 700,
      border: "2.5px solid #000",
      backgroundColor: "#fff",
      position: "relative",
      boxSizing: "border-box",
      padding: 22,
      direction: "ltr",
      display: "flex",
      flexDirection: "column",
      fontFamily: FONT,
    }}>
      {/* כותרת */}
      <div style={{ display: "grid", gridTemplateColumns: "260px 1fr 260px", alignItems: "center", height: 90, borderBottom: `2px solid ${B}` }}>
        <div style={{ direction: "rtl", textAlign: "right", fontSize: 12, lineHeight: 1.9, paddingLeft: 18 }}>
          <div>לקוח: <strong style={{ color: B }}>{info.customerName || "-"}</strong></div>
          <div>פרויקט: <strong style={{ color: B }}>{info.projectName || "-"}</strong></div>
          <div>לוח: <strong style={{ color: B }}>{info.panelName || "-"}</strong></div>
        </div>
        <div style={{ textAlign: "center", fontSize: 24, fontWeight: "bold", direction: "rtl", color: B }}>רשימת ציוד לביצוע</div>
        <div style={{ textAlign: "center" }}>
          <img src="/logo.svg" alt="Doryonix" style={{ width: 160, height: "auto", display: "inline-block" }} />
        </div>
      </div>

      {/* טבלה */}
      <div style={{ flex: 1 }}>
      <table style={{ width: "94%", marginRight: "auto", marginLeft: "auto", borderCollapse: "collapse", marginTop: 14, fontSize: 12, direction: "rtl" }}>
        <thead>
          <tr>
            <th style={{ ...th, width: 50, textAlign: "center" }}>מס׳</th>
            <th style={th}>פריט</th>
            <th style={{ ...th, width: 75, textAlign: "center" }}>כמות</th>
            <th style={{ ...th, width: 65, textAlign: "center" }}>סטטוס</th>
            <th style={{ ...th, width: 230 }}>הערות</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, i) => (
            <tr key={i} style={{ backgroundColor: i % 2 === 0 ? "#fff" : "#e8eff7" }}>
              <td style={{ ...cell, textAlign: "center" }}>{i + 1}</td>
              <td style={cell}>{item.item}</td>
              <td style={{ ...cell, textAlign: "center", fontWeight: "bold" }}>{item.qty}</td>
              <td style={{ ...cell, textAlign: "center" }}>
                <span style={{ fontSize: 10, fontWeight: "bold", padding: "2px 6px", borderRadius: 4, backgroundColor: item.isNew ? "#dbeafe" : "#f1f5f9", color: item.isNew ? "#1d4ed8" : "#475569" }}>
                  {item.isNew ? "חדש" : "קיים"}
                </span>
              </td>
              <td style={cell}>{item.notes}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr style={{ backgroundColor: B, color: "#fff", fontWeight: "bold" }}>
            <td colSpan={2} style={{ ...cell, border: "1px solid #fff", textAlign: "center" }}>סה״כ סוגי פריטים</td>
            <td style={{ ...cell, border: "1px solid #fff", textAlign: "center" }}>{items.length}</td>
            <td style={{ ...cell, border: "1px solid #fff" }} /><td style={{ ...cell, border: "1px solid #fff" }} />
          </tr>
          <tr style={{ backgroundColor: B, color: "#fff", fontWeight: "bold" }}>
            <td colSpan={2} style={{ ...cell, border: "1px solid #fff", textAlign: "center" }}>סה״כ יחידות</td>
            <td style={{ ...cell, border: "1px solid #fff", textAlign: "center" }}>{totalUnits}</td>
            <td style={{ ...cell, border: "1px solid #fff" }} /><td style={{ ...cell, border: "1px solid #fff" }} />
          </tr>
        </tfoot>
      </table>
      </div>

      {/* כותרת תחתית */}
      <div style={{
        height: 75 , flexShrink: 0,
        borderTop: `2px solid ${B}`,
        display: "grid", gridTemplateColumns: "160px 1fr 1fr 1fr 160px",
        direction: "rtl", backgroundColor: "#fff", fontFamily: FONT,
      }}>
        <div style={{ borderLeft: `1.5px solid ${B}`, display: "flex", alignItems: "center", justifyContent: "center", padding: 6 }}>
          <img src="/logo.svg" alt="Doryonix" style={{ width: 120 }} />
        </div>
        <FooterCell l1="שם לקוח" v1={info.customerName} l2="שם פרויקט" v2={info.projectName} />
        <FooterCell l1="שם לוח" v1={info.panelName} l2="שיטת הגנה" v2={info.earthingSystem} />
        <FooterCell l1="תאריך" v1={dateStr} l2="מס׳ עמוד" v2={`${pageNum} / ${totalPages}`} />
        <div style={{ textAlign: "center", display: "flex", flexDirection: "column", justifyContent: "center", gap: 2 }}>
          <div style={{ fontSize: 10, color: "#666" }}>סוג מסמך</div>
          <div style={{ fontSize: 12, fontWeight: "bold", color: B }}>רשימת ציוד</div>
        </div>
      </div>
    </div>
  );
};
