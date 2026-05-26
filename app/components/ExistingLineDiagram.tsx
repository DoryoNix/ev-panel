import type { ExistingPanelInfo, PanelCircuit, ExistingCircuit, NewCircuit } from "../types/existingPanel";
import { DiagramBox } from "./DiagramBox";
import { calcIncLabel, chargerLabel } from "../lib/calculations";

type Props = {
  info: ExistingPanelInfo;
  circuits: PanelCircuit[];
  pageNum: number;
  totalPages: number;
};

const B = "#1a3a5c";
const NC = "#1d4ed8";
const FONT = "'David', 'Arial Hebrew', 'Noto Sans Hebrew', Arial, sans-serif";
const BREAKER_TOP_Y = 190;
const BREAKER_H = 80;
const RCD_GAP = 35;
const RCD_H = 58;
const TERMINAL_Y = 375;
const TERMINAL_H = 46;
const BOTTOM_LINE_Y = 428;

const FooterCell = ({ l1, v1, l2, v2 }: { l1: string; v1: string; l2: string; v2: string }) => (
  <div style={{ borderLeft: `1.5px solid ${B}`, textAlign: "center", display: "flex", flexDirection: "column", justifyContent: "center", gap: 2, padding: "4px 8px" }}>
    <div style={{ fontSize: 10, color: "#666" }}>{l1}</div>
    <div style={{ fontSize: 12, fontWeight: "bold", color: B }}>{v1 || "-"}</div>
    <div style={{ fontSize: 10, color: "#666" }}>{l2}</div>
    <div style={{ fontSize: 12, fontWeight: "bold", color: B }}>{v2 || "-"}</div>
  </div>
);

export const ExistingLineDiagram = ({ info, circuits, pageNum, totalPages }: Props) => {
  const count = Math.max(circuits.length, 1);
  const spacing = count === 1 ? 0 : Math.min(160, 720 / (count - 1));
  const totalWidth = spacing * (count - 1);
  const firstX = 550 - totalWidth / 2;
  const busStart = firstX - 80;
  const busEnd = firstX + totalWidth + 80;
  const dateStr = new Date(info.date).toLocaleDateString("he-IL");

  // סיכום שינויים — פריט לכל שורה
  const summaryItems: { text: string; isNew: boolean }[] = [];
  circuits.forEach((c, i) => {
    if (!c.isNew) {
      const ec = c as ExistingCircuit;
      const label = `מעגל ${ec.circuitNumber || i + 1} (${ec.existingBreakerSize})`;
      if (ec.addRcd) summaryItems.push({ text: `${label} — הוספת פחת ${ec.rcdSpec}`, isNew: true });
      if (ec.addTerminal) summaryItems.push({ text: `${label} — הוספת מהדק פס דין ${ec.cableSize} ממ"ר`, isNew: true });
      if (ec.calibration) summaryItems.push({ text: `${label} — כיול ל-${ec.calibration}`, isNew: false });
      if (!ec.addRcd && !ec.addTerminal && !ec.calibration) {
        summaryItems.push({ text: `${label} — ללא שינוי`, isNew: false });
      }
    } else {
      const nc = c as NewCircuit;
      const newIdx = circuits.filter((x, j) => x.isNew && j <= i).length;
      summaryItems.push({ text: `FC${newIdx} — מפסק חדש ${nc.breaker}${nc.calibration ? ` | כיול ל-${nc.calibration}` : ""}`, isNew: true });
      if (nc.rcd !== "ללא") summaryItems.push({ text: `FC${newIdx} — פחת חדש ${nc.rcd}`, isNew: true });
      if (nc.terminal === "דרך מהדקי פס דין") summaryItems.push({ text: `FC${newIdx} — מהדק פס דין חדש`, isNew: true });
    }
  });

  const summaryBoxH = summaryItems.length * 17 + 26;
  const svgH = 700 - 90 - 95;

  return (
    <div className="pdf-page" style={{
      width: 1100, height: 700,
      border: "2.5px solid #000",
      backgroundColor: "#fff",
      boxSizing: "border-box",
      display: "flex",
      flexDirection: "column",
      direction: "rtl",
      fontFamily: FONT,
    }}>
      {/* כותרת עליונה */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "280px 1fr 300px",
        height: 90,
        borderBottom: "1.5px solid #000",
        flexShrink: 0,
        backgroundColor: "#f5f7fa",
      }}>
        <div style={{ borderRight: "1px solid #000", fontSize: 12, lineHeight: 1.8, padding: "6px 10px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div><span style={{ color: "#666", fontSize: 10 }}>לקוח: </span><strong style={{ color: B }}>{info.customerName || "-"}</strong></div>
          <div><span style={{ color: "#666", fontSize: 10 }}>פרויקט: </span><strong style={{ color: B }}>{info.projectName || "-"}</strong></div>
          <div><span style={{ color: "#666", fontSize: 10 }}>לוח: </span><strong style={{ color: B }}>{info.panelName || "-"}</strong></div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", borderRight: "1px solid #000" }}>
          <div style={{ fontSize: 22, fontWeight: "bold", color: B }}>AS MADE</div>
          <div style={{ fontSize: 11, color: "#555" }}>תוכנית חד-קווית — לוח קיים</div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2px 8px", padding: "6px 10px", fontSize: 11, alignContent: "center" }}>
          <div><span style={{ color: "#666", fontSize: 10 }}>הגנה: </span><strong style={{ color: B }}>{info.earthingSystem}</strong></div>
          <div><span style={{ color: "#666", fontSize: 10 }}>מפסק: </span><strong style={{ color: B }}>{info.mainBreakerSize || "-"}</strong></div>
          <div><span style={{ color: "#666", fontSize: 10 }}>מיקום: </span><strong style={{ color: B }}>{info.location || "-"}</strong></div>
        </div>
      </div>

      {/* תרשים SVG */}
      <div style={{ flex: 1, overflow: "hidden", position: "relative" }}>
        {/* מקרא — HTML מחוץ ל-SVG */}
        <div style={{
          position: "absolute", top: 10, right: 20,
          border: "1px solid #ccc", borderRadius: 5,
          backgroundColor: "white", padding: "6px 10px",
          fontSize: 10, zIndex: 10, direction: "rtl",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
            <div style={{ width: 28, height: 2, backgroundColor: "#000" }} />
            <span style={{ color: "#333" }}>קיים בלוח</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 28, height: 2, background: `repeating-linear-gradient(90deg, ${NC} 0, ${NC} 5px, transparent 5px, transparent 8px)` }} />
            <span style={{ color: NC }}>חדש / תוספת</span>
          </div>
        </div>

        {/* סיכום שינויים — פינה ימין תחתית, מחוץ ל-SVG */}
        <div style={{
          position: "absolute",
          bottom: 10,
          right: 20,
          backgroundColor: "#dbeafe",
          border: "1px solid #bfdbfe",
          borderRadius: 6,
          padding: "5px 10px",
          direction: "rtl",
          zIndex: 10,
        }}>
          <div style={{ fontSize: 11, color: B, fontWeight: "bold", marginBottom: 3 }}>סיכום שינויים:</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {summaryItems.map((item, i) => (
              <div key={i} style={{ fontSize: 10, color: item.isNew ? NC : "#555", display: "flex", alignItems: "flex-start", gap: 5, whiteSpace: "nowrap" }}>
                <span style={{ flexShrink: 0 }}>{item.isNew ? "✦" : "●"}</span>
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        <svg width={1100} height={svgH} viewBox={`0 0 1100 ${svgH}`} style={{ fontFamily: FONT }}>
          {/* מפסק ראשי */}
          <line x1={550} y1={0} x2={550} y2={15} stroke="black" strokeWidth={3} />
          <DiagramBox cx={550} y={0} minWidth={165} height={90}
            title={`${info.mainBreakerType} — קיים`}
            line1="Q0 — מפסק ראשי קיים"
            line2={info.mainBreakerSize || "לא צוין"}
            line3={calcIncLabel(info.mainBreakerSize)} />
          <line x1={550} y1={90} x2={550} y2={118} stroke="black" strokeWidth={3} />

          {/* פס צבירה */}
          <rect x={466} y={118} width={168} height={20} fill="white" />
          <text x={550} y={132} textAnchor="middle" fontSize={12} fontWeight="bold">{"BUSBAR 3P+N+PE — קיים"}</text>
          <line x1={busStart} y1={142} x2={busEnd} y2={142} stroke="black" strokeWidth={5} />

          {/* מעגלים */}
          {circuits.map((circuit, localIndex) => {
            const cx = firstX + localIndex * spacing;

            if (!circuit.isNew) {
              const c = circuit as ExistingCircuit;
              const hasRcd = c.addRcd;
              const hasTerminal = c.addTerminal;
              const rcdY = BREAKER_TOP_Y + BREAKER_H + RCD_GAP;
              const rcdEndY = hasRcd ? rcdY + RCD_H : BREAKER_TOP_Y + BREAKER_H;
              const lineFromY = hasTerminal ? TERMINAL_Y + TERMINAL_H : hasRcd ? rcdEndY : BREAKER_TOP_Y + BREAKER_H;

              return (
                <g key={circuit.id}>
                  <line x1={cx} y1={142} x2={cx} y2={BREAKER_TOP_Y} stroke="black" strokeWidth={2} />
                  <DiagramBox cx={cx} y={BREAKER_TOP_Y} minWidth={105} height={BREAKER_H}
                    title={c.existingBreakerType}
                    line1={`מעגל ${c.circuitNumber || "?"} — קיים`}
                    line2={c.existingBreakerSize} />

                  {hasRcd && (
                    <>
                      <line x1={cx} y1={BREAKER_TOP_Y + BREAKER_H} x2={cx} y2={rcdY} stroke={NC} strokeWidth={2} strokeDasharray="5,3" />
                      <rect x={cx - 60} y={rcdY} width={120} height={RCD_H} rx={5} fill="white" stroke={NC} strokeWidth={2} />
                      <line x1={cx - 60} y1={rcdY + 22} x2={cx + 60} y2={rcdY + 22} stroke={NC} strokeWidth={1} />
                     <text x={cx} y={rcdY + 15} textAnchor="middle" fontSize={10} fontWeight="bold" fill={NC}>פחת — חדש</text>
                      <text x={cx} y={rcdY + 30} textAnchor="middle" fontSize={10} fill={NC}>{c.circuitNumber ? `FB${c.circuitNumber}` : "FB"}</text>
                      <text x={cx} y={rcdY + 44} textAnchor="middle" fontSize={10} fill={NC}>{c.rcdSpec}</text>
                    </>
                  )}

                  {hasTerminal && (
                    <>
                      <line x1={cx} y1={hasRcd ? rcdEndY : BREAKER_TOP_Y + BREAKER_H} x2={cx} y2={TERMINAL_Y} stroke={NC} strokeWidth={2} strokeDasharray="5,3" />
                      <rect x={cx - 65} y={TERMINAL_Y} width={130} height={TERMINAL_H} rx={5} fill="white" stroke={NC} strokeWidth={2} />
                      <line x1={cx - 65} y1={TERMINAL_Y + 22} x2={cx + 65} y2={TERMINAL_Y + 22} stroke={NC} strokeWidth={1} />
                      <text x={cx} y={TERMINAL_Y + 15} textAnchor="middle" fontSize={10} fontWeight="bold" fill={NC}>מהדק פס דין — חדש</text>
                      <text x={cx} y={TERMINAL_Y + 30} textAnchor="middle" fontSize={9} fill={NC}>{`${c.circuitNumber ? `מעגל ${c.circuitNumber}` : "מעגל חדש"} | ${(c.addRcd || c.existingBreakerType === "מפסק משולב פחת") ? "L1/L2/L3/N" : "L1/L2/L3"}`}</text>
                    </>
                  )}

                  <line x1={cx} y1={lineFromY} x2={cx} y2={BOTTOM_LINE_Y} stroke="black" strokeWidth={2.5} />
                  <text x={cx} y={BOTTOM_LINE_Y + 12} textAnchor="middle" fontSize={9} fill="#444">{`${c.cableType} ${c.cableCores}x${c.cableSize}`}</text>
                  <text x={cx} y={BOTTOM_LINE_Y + 24} textAnchor="middle" fontSize={12} fontWeight="bold">{chargerLabel(c.charger)}</text>
                  <text x={cx} y={BOTTOM_LINE_Y + 36} textAnchor="middle" fontSize={11}>{c.charger}</text>
                </g>
              );
            } else {
              const c = circuit as NewCircuit;
              const newIdx = circuits.filter((x, j) => x.isNew && j <= localIndex).length;
              const hasRcd = c.rcd !== "ללא";
              const hasTerminal = c.feedConnection === "מהדק פס דין";
              const rcdY = BREAKER_TOP_Y + BREAKER_H + RCD_GAP;
              const rcdEndY = hasRcd ? rcdY + RCD_H : BREAKER_TOP_Y + BREAKER_H;
              const lineFromY = hasTerminal ? TERMINAL_Y + TERMINAL_H : hasRcd ? rcdEndY : BREAKER_TOP_Y + BREAKER_H;

              return (
                <g key={circuit.id}>
                  <line x1={cx} y1={142} x2={cx} y2={BREAKER_TOP_Y} stroke={NC} strokeWidth={2} strokeDasharray="5,3" />
                  <rect x={cx - 58} y={BREAKER_TOP_Y} width={116} height={BREAKER_H} rx={5} fill="white" stroke={NC} strokeWidth={2.5} />
                  <line x1={cx - 58} y1={BREAKER_TOP_Y + 22} x2={cx + 58} y2={BREAKER_TOP_Y + 22} stroke={NC} strokeWidth={1} />
                  <text x={cx} y={BREAKER_TOP_Y + 15} textAnchor="middle" fontSize={10} fontWeight="bold" fill={NC}>{`${c.breakerType} — חדש`}</text>
                  <text x={cx} y={BREAKER_TOP_Y + 34} textAnchor="middle" fontSize={9} fill={NC}>{`${c.circuitName || `FC${newIdx}`} | ${c.breaker}`}</text>
                  <text x={cx} y={BREAKER_TOP_Y + 48} textAnchor="middle" fontSize={8} fill={NC}>{calcIncLabel(c.breaker)}</text>

                  {hasRcd && (
                    <>
                      <line x1={cx} y1={BREAKER_TOP_Y + BREAKER_H} x2={cx} y2={rcdY} stroke={NC} strokeWidth={2} strokeDasharray="5,3" />
                      <rect x={cx - 60} y={rcdY} width={120} height={RCD_H} rx={5} fill="white" stroke={NC} strokeWidth={2} />
                      <line x1={cx - 60} y1={rcdY + 22} x2={cx + 60} y2={rcdY + 22} stroke={NC} strokeWidth={1} />
                      <text x={cx} y={rcdY + 15} textAnchor="middle" fontSize={10} fontWeight="bold" fill={NC}>פחת — חדש</text>
                      <text x={cx} y={rcdY + 30} textAnchor="middle" fontSize={10} fill={NC}>{`FB${newIdx}`}</text>
                      <text x={cx} y={rcdY + 44} textAnchor="middle" fontSize={10} fill={NC}>{c.rcd}</text>
                    </>
                  )}

                  {hasTerminal && (
                    <>
                      <line x1={cx} y1={hasRcd ? rcdEndY : BREAKER_TOP_Y + BREAKER_H} x2={cx} y2={TERMINAL_Y} stroke={NC} strokeWidth={2} strokeDasharray="5,3" />
                      <rect x={cx - 65} y={TERMINAL_Y} width={130} height={TERMINAL_H} rx={5} fill="white" stroke={NC} strokeWidth={2} />
                      <line x1={cx - 65} y1={TERMINAL_Y + 22} x2={cx + 65} y2={TERMINAL_Y + 22} stroke={NC} strokeWidth={1} />
                      <text x={cx} y={TERMINAL_Y + 15} textAnchor="middle" fontSize={10} fontWeight="bold" fill={NC}>מהדק פס דין — חדש</text>
                      <text x={cx} y={TERMINAL_Y + 30} textAnchor="middle" fontSize={9} fill={NC}>{`${c.circuitName || `FC${newIdx}`} | ${(hasRcd || c.breakerType === "מפסק משולב פחת") ? "L1/L2/L3/N" : "L1/L2/L3"}`}</text>
                    </>
                  )}

                  <line x1={cx} y1={lineFromY} x2={cx} y2={BOTTOM_LINE_Y} stroke={NC} strokeWidth={2.5} strokeDasharray="5,3" />
                  <text x={cx} y={BOTTOM_LINE_Y + 12} textAnchor="middle" fontSize={9} fill={NC}>{`${c.cableType} ${c.cableCores}x${c.cableSize}`}</text>
                  <text x={cx} y={BOTTOM_LINE_Y + 24} textAnchor="middle" fontSize={12} fontWeight="bold" fill={NC}>{chargerLabel(c.charger)}</text>
                  <text x={cx} y={BOTTOM_LINE_Y + 36} textAnchor="middle" fontSize={11} fill={NC}>{c.charger}</text>
                </g>
              );
            }
          })}
        </svg>
      </div>

      {/* כותרת תחתית */}
      <div style={{
        height: 95,
        borderTop: `2px solid ${B}`,
        display: "grid",
        gridTemplateColumns: "160px 1fr 1fr 1fr 160px",
        direction: "rtl",
        backgroundColor: "#fff",
        flexShrink: 0,
        fontFamily: FONT,
      }}>
        <div style={{ borderLeft: `1.5px solid ${B}`, display: "flex", alignItems: "center", justifyContent: "center", padding: 6 }}>
          <img src="/logo.svg" alt="Doryonix" style={{ width: 120 }} />
        </div>
        <FooterCell l1="שם לקוח" v1={info.customerName} l2="שם פרויקט" v2={info.projectName} />
        <FooterCell l1="שם לוח" v1={info.panelName} l2="שיטת הגנה" v2={info.earthingSystem} />
        <FooterCell l1="תאריך" v1={dateStr} l2="מס׳ עמוד" v2={`${pageNum} / ${totalPages}`} />
        <div style={{ textAlign: "center", display: "flex", flexDirection: "column", justifyContent: "center", gap: 2 }}>
          <div style={{ fontSize: 10, color: "#666" }}>סוג מסמך</div>
          <div style={{ fontSize: 12, fontWeight: "bold", color: B }}>חד־קווי</div>
        </div>
      </div>
    </div>
  );
};
