import type { Circuit, ProjectInfo } from "../types";
import { DiagramBox } from "./DiagramBox";
import { calcIncLabel, chargerLabel } from "../lib/calculations";

type Props = {
  info: ProjectInfo;
  pageCircuits: Circuit[];
  pageIndex: number;
  totalPages: number;
};

const BREAKER_TOP_Y = 220;
const BREAKER_H = 80;
const RCD_GAP = 40;
const RCD_H = 65;
const TERMINAL_Y = 420;
const TERMINAL_H = 50;
const BOTTOM_LINE_Y = 478;
const B = "#1a3a5c";

const FONT = "'David', 'Arial Hebrew', 'Noto Sans Hebrew', Arial, sans-serif";

export const SingleLineDiagramPage = ({
  info, pageCircuits, pageIndex, totalPages,
}: Props) => {
  const count = Math.max(pageCircuits.length, 1);
  const spacing = count === 1 ? 0 : Math.min(180, 820 / (count - 1));
  const totalWidth = spacing * (count - 1);
  const firstX = 550 - totalWidth / 2;
  const busStart = firstX - 80;
  const busEnd = firstX + totalWidth + 80;
  const breakerEndY = BREAKER_TOP_Y + BREAKER_H;

  return (
    <div
      className="pdf-page"
      style={{
        width: 1100,
        height: 700,
        border: "2.5px solid #000",
        backgroundColor: "#fff",
        position: "relative",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        direction: "rtl",
        fontFamily: FONT,
      }}
    >
      {/* ===== כותרת AS MADE ===== */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "280px 1fr 300px",
        height: 75,
        borderBottom: "1.5px solid #000",
        flexShrink: 0,
        backgroundColor: "#f5f7fa",
      }}>
        {/* שמאל — פרטי תוכנית */}
        <div style={{
          borderLeft: "none",
          borderRight: "1px solid #000",
          fontSize: 11,
          lineHeight: 1.8,
          padding: "6px 10px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          fontFamily: FONT,
        }}>
          <div><span style={{ color: "#666", fontSize: 12 }}>לקוח: </span><strong style={{ color: B }}>{info.customerName || "-"}</strong></div>
          <div><span style={{ color: "#666", fontSize: 12 }}>פרויקט: </span><strong style={{ color: B }}>{info.projectName || "-"}</strong></div>
          <div><span style={{ color: "#666", fontSize: 12 }}>לוח: </span><strong style={{ color: B }}>{info.panelName || "-"}</strong></div>
        </div>

        {/* אמצע — AS MADE */}
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          borderRight: "1px solid #000",
          fontFamily: FONT,
        }}>
          <div style={{ fontSize: 25, fontWeight: "bold", color: B, letterSpacing: 1 }}>AS MADE</div>
          <div style={{ fontSize: 13, color: "#555" }}>תוכנית חד-קווית</div>
        </div>

        {/* ימין — מאפייני לוח */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "2px 12px",
          padding: "6px 12px",
          fontSize: 12,
          alignContent: "center",
          fontFamily: FONT,
        }}>
          <div><span style={{ color: "#666", fontSize: 12 }}>חומר: </span><strong style={{ color: B }}>{info.panelMaterial}</strong></div>
          <div><span style={{ color: "#666", fontSize: 12 }}>התקנה: </span><strong style={{ color: B }}>{info.panelInstallation}</strong></div>
          <div><span style={{ color: "#666", fontSize: 12 }}>כבילה: </span><strong style={{ color: B }}>{info.panelCabling}</strong></div>
          <div><span style={{ color: "#666", fontSize: 12 }}>נעילה: </span><strong style={{ color: B }}>{info.panelLock}</strong></div>
          <div><span style={{ color: "#666", fontSize: 12 }}>הגנה: </span><strong style={{ color: B }}>{info.earthingSystem}</strong></div>
        </div>
      </div>

      {/* ===== תרשים SVG ===== */}
      <div style={{ flex: 1, overflow: "hidden" }}>
        <svg width={1100} height={555} viewBox="0 0 1100 555" style={{ fontFamily: FONT }}>

          {/* מפסק ראשי */}
          {pageIndex === 0 ? (
            <>
              <line x1={550} y1={0} x2={550} y2={20} stroke="black" strokeWidth={3} />
              <DiagramBox
                cx={550} y={0} minWidth={145} height={110}
                title={info.mainBreakerType}
                line1="Q0"
                line2={`${info.mainBreakerAmp || "מפסק ראשי"}${info.mainBreakerCalibration ? ` | מכוייל ל-${info.mainBreakerCalibration}` : ""}`}
                line3={calcIncLabel(info.mainBreakerAmp)}
              />
              <line x1={550} y1={115} x2={550} y2={145} stroke="black" strokeWidth={3} />
            </>
          ) : (
            <text x={550} y={35} textAnchor="middle" fontSize={13} fontWeight="bold">
              {"המשך פס צבירה מהעמוד הקודם"}
            </text>
          )}

          {/* פס צבירה */}
          <rect x={468} y={145} width={164} height={22} fill="white" />
          <text x={550} y={160} textAnchor="middle" fontSize={13} fontWeight="bold">{"BUSBAR 3P+N+PE"}</text>
          <line x1={busStart} y1={170} x2={busEnd} y2={170} stroke="black" strokeWidth={5} />

          {/* מעגלים */}
          {pageCircuits.map((circuit, localIndex) => {
            const globalIndex = pageIndex * 6 + localIndex;
            const cx = firstX + localIndex * spacing;
            const hasIntegratedRcd = circuit.breakerType === "מפסק משולב פחת";
            const hasSeparateRcd = circuit.rcd !== "ללא";
            const hasRcd = hasSeparateRcd || hasIntegratedRcd;
            const hasTerminal = circuit.terminal === "דרך מהדקי פס דין";
            const rcdY = BREAKER_TOP_Y + BREAKER_H + RCD_GAP;
            const rcdEndY = hasSeparateRcd ? rcdY + RCD_H : BREAKER_TOP_Y + BREAKER_H;
            const terminalEndY = hasTerminal ? TERMINAL_Y + TERMINAL_H : rcdEndY;
            const lineFromY = hasTerminal ? terminalEndY : hasRcd ? rcdEndY : BREAKER_TOP_Y + BREAKER_H;
            const terminalLabel = hasIntegratedRcd
              ? `FC${globalIndex + 1}-L1/L2/L3/N`
              : hasSeparateRcd
              ? `FB${globalIndex + 1}-L1/L2/L3/N`
              : `FC${globalIndex + 1}-L1/L2/L3`;

            return (
              <g key={circuit.id}>
                <line x1={cx} y1={170} x2={cx} y2={BREAKER_TOP_Y} stroke="black" strokeWidth={2} />
                <DiagramBox
                  cx={cx} y={BREAKER_TOP_Y} minWidth={95} height={BREAKER_H}
                  title={circuit.breakerType}
                  line1={`FC${globalIndex + 1}`}
                  line2={`${circuit.breaker} | ${calcIncLabel(circuit.breaker)}`}
                />
                {hasSeparateRcd && (
                  <>
                    <line x1={cx} y1={BREAKER_TOP_Y + BREAKER_H} x2={cx} y2={rcdY} stroke="black" strokeWidth={2} />
                    <DiagramBox cx={cx} y={rcdY} minWidth={105} height={RCD_H}
                      title="פחת" line1={`FB${globalIndex + 1}`} line2={circuit.rcd} />
                  </>
                )}
                {hasTerminal && (
                  <>
                    <line x1={cx} y1={hasRcd ? rcdEndY : BREAKER_TOP_Y + BREAKER_H} x2={cx} y2={TERMINAL_Y} stroke="black" strokeWidth={2} />
                    <DiagramBox cx={cx} y={TERMINAL_Y} minWidth={hasRcd ? 135 : 115} height={TERMINAL_H}
                      title="מהדק לפס דין" line1={terminalLabel} />
                  </>
                )}
                <line x1={cx} y1={lineFromY} x2={cx} y2={BOTTOM_LINE_Y} stroke="black" strokeWidth={3} />
                <text x={cx} y={BOTTOM_LINE_Y + 13} textAnchor="middle" fontSize={12} fill="#444">
              {`${circuit.cableType} ${circuit.cableCores}x${circuit.cableSize}`}
            </text>
            <text x={cx} y={BOTTOM_LINE_Y + 22} textAnchor="middle" fontSize={13} fontWeight="bold">
              {chargerLabel(circuit.charger)}
            </text>
            <text x={cx} y={BOTTOM_LINE_Y + 35} textAnchor="middle" fontSize={12}>
              {circuit.charger}
            </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* ===== כותרת תחתית ===== */}
      <div style={{
        height: 82,
        borderTop: `2px solid ${B}`,
        display: "grid",
        gridTemplateColumns: "160px 1fr 1fr 1fr 160px",
        direction: "rtl",
        backgroundColor: "#fff",
        flexShrink: 0,
        fontFamily: FONT,
      }}>
        {/* לוגו */}
        <div style={{ borderLeft: `1.5px solid ${B}`, display: "flex", alignItems: "center", justifyContent: "center", padding: 6 }}>
          <img src="/logo.svg" alt="Doryonix" style={{ width: 120 }} />
        </div>

        {/* לקוח + פרויקט */}
        <div style={{ borderLeft: `1.5px solid ${B}`, textAlign: "center", display: "flex", flexDirection: "column", justifyContent: "center", gap: 2, padding: "4px 6px" }}>
          <div style={{ fontSize: 12, color: "#666" }}>שם לקוח</div>
          <div style={{ fontSize: 12, fontWeight: "bold", color: B }}>{info.customerName || "-"}</div>
          <div style={{ fontSize: 12, color: "#666" }}>שם פרויקט</div>
          <div style={{ fontSize: 12, fontWeight: "bold", color: B }}>{info.projectName || "-"}</div>
        </div>

        {/* לוח + הגנה */}
        <div style={{ borderLeft: `1.5px solid ${B}`, textAlign: "center", display: "flex", flexDirection: "column", justifyContent: "center", gap: 2, padding: "4px 6px" }}>
          <div style={{ fontSize: 12, color: "#666" }}>שם לוח</div>
          <div style={{ fontSize: 12, fontWeight: "bold", color: B }}>{info.panelName || "-"}</div>
          <div style={{ fontSize: 12, color: "#666" }}>שיטת הגנה</div>
          <div style={{ fontSize: 12, fontWeight: "bold", color: B }}>{info.earthingSystem}</div>
        </div>

        {/* תאריך + עמוד */}
        <div style={{ borderLeft: `1.5px solid ${B}`, textAlign: "center", display: "flex", flexDirection: "column", justifyContent: "center", gap: 2, padding: "4px 6px" }}>
          <div style={{ fontSize: 12, color: "#666" }}>תאריך</div>
          <div style={{ fontSize: 12, fontWeight: "bold", color: B }}>{new Date(info.date).toLocaleDateString("he-IL")}</div>
          <div style={{ fontSize: 12, color: "#666" }}>מס׳ עמוד</div>
          <div style={{ fontSize: 12, fontWeight: "bold", color: B }}>{pageIndex + 1} / {totalPages}</div>
        </div>

        {/* סוג מסמך */}
        <div style={{ textAlign: "center", display: "flex", flexDirection: "column", justifyContent: "center", gap: 2 }}>
          <div style={{ fontSize: 12, color: "#666" }}>סוג מסמך</div>
          <div style={{ fontSize: 12, fontWeight: "bold", color: B }}>חד־קווי</div>
        </div>
      </div>
    </div>
  );
};
