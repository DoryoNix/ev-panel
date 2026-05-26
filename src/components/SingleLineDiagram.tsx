import type { Circuit, ProjectInfo } from "../types";
import { DiagramBox } from "./DiagramBox";
import { DiagramFooter } from "./DiagramFooter";
import { calcIncLabel, chargerLabel } from "../lib/calculations";

type Props = {
  info: ProjectInfo;
  pageCircuits: Circuit[];
  pageIndex: number;
  totalPages: number;
};

const BREAKER_TOP_Y = 290;
const BREAKER_H = 80;
const RCD_GAP = 45;
const RCD_H = 65;
const TERMINAL_Y = 500;
const TERMINAL_H = 55;
const BOTTOM_LINE_Y = 560;
const B = "#1a3a5c";

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
    <svg width={1100} height={700} viewBox="0 0 1100 700" className="border">
      <rect x={8} y={8} width={1084} height={684} fill="white" stroke="black" strokeWidth={2.5} />

      {/* כותרת עליונה */}
      <rect x={8} y={8} width={1084} height={50} fill="#f5f7fa" stroke="black" strokeWidth={1} />
      <line x1={370} y1={8} x2={370} y2={58} stroke="black" strokeWidth={1} />
      <line x1={730} y1={8} x2={730} y2={58} stroke="black" strokeWidth={1} />

      {/* שמאל */}
      <text x={20} y={24} fontSize={9} fill="#666">{"לקוח:"}</text>
      <text x={55} y={24} fontSize={10} fontWeight="bold" fill={B}>{info.customerName || "-"}</text>
      <text x={20} y={39} fontSize={9} fill="#666">{"פרויקט:"}</text>
      <text x={62} y={39} fontSize={10} fontWeight="bold" fill={B}>{info.projectName || "-"}</text>
      <text x={20} y={54} fontSize={9} fill="#666">{"לוח:"}</text>
      <text x={45} y={54} fontSize={10} fontWeight="bold" fill={B}>{info.panelName || "-"}</text>

      {/* אמצע */}
      <text x={550} y={30} textAnchor="middle" fontSize={18} fontWeight="bold" fill={B}>{"AS MADE"}</text>
      <text x={550} y={50} textAnchor="middle" fontSize={10} fill="#555">{"תוכנית חד-קווית"}</text>

      {/* ימין */}
      <text x={740} y={22} fontSize={9} fill="#666">{"חומר:"}</text>
      <text x={775} y={22} fontSize={10} fontWeight="bold" fill={B}>{info.panelMaterial}</text>
      <text x={840} y={22} fontSize={9} fill="#666">{"התקנה:"}</text>
      <text x={882} y={22} fontSize={10} fontWeight="bold" fill={B}>{info.panelInstallation}</text>
      <text x={940} y={22} fontSize={9} fill="#666">{"הגנה:"}</text>
      <text x={973} y={22} fontSize={10} fontWeight="bold" fill={B}>{info.earthingSystem}</text>
      <text x={740} y={44} fontSize={9} fill="#666">{"כבילה:"}</text>
      <text x={778} y={44} fontSize={10} fontWeight="bold" fill={B}>{info.panelCabling}</text>
      <text x={840} y={44} fontSize={9} fill="#666">{"נעילה:"}</text>
      <text x={877} y={44} fontSize={10} fontWeight="bold" fill={B}>{info.panelLock}</text>

      {/* מפסק ראשי */}
      {pageIndex === 0 ? (
        <>
          <line x1={550} y1={68} x2={550} y2={110} stroke="black" strokeWidth={3} />
          <DiagramBox
            cx={550} y={68} minWidth={145} height={115}
            title={info.mainBreakerType}
            line1="Q0"
            line2={`${info.mainBreakerAmp || "מפסק ראשי"}${info.mainBreakerCalibration ? ` | מכוייל ל-${info.mainBreakerCalibration}` : ""}`}
            line3={calcIncLabel(info.mainBreakerAmp)}
          />
          <line x1={550} y1={183} x2={550} y2={220} stroke="black" strokeWidth={3} />
        </>
      ) : (
        <text x={550} y={110} textAnchor="middle" fontSize={13} fontWeight="bold">
          {"המשך פס צבירה מהעמוד הקודם"}
        </text>
      )}

      {/* פס צבירה */}
      <rect x={470} y={198} width={160} height={22} fill="white" />
      <text x={550} y={214} textAnchor="middle" fontSize={14} fontWeight="bold">{"BUSBAR 3P+N+PE"}</text>
      <line x1={busStart} y1={228} x2={busEnd} y2={228} stroke="black" strokeWidth={5} />

      {/* מעגלים */}
      {pageCircuits.map((circuit, localIndex) => {
        const globalIndex = pageIndex * 6 + localIndex;
        const cx = firstX + localIndex * spacing;
        const hasIntegratedRcd = circuit.breakerType === "מפסק משולב פחת";
        const hasSeparateRcd = circuit.rcd !== "ללא";
        const hasRcd = hasSeparateRcd || hasIntegratedRcd;
        const hasTerminal = circuit.terminal === "דרך מהדקי פס דין";
        const rcdY = breakerEndY + RCD_GAP;
        const rcdEndY = hasSeparateRcd ? rcdY + RCD_H : breakerEndY;
        const terminalEndY = hasTerminal ? TERMINAL_Y + TERMINAL_H : rcdEndY;
        const lineFromY = hasTerminal ? terminalEndY : hasRcd ? rcdEndY : breakerEndY;
        const terminalLabel = hasIntegratedRcd
          ? `FC${globalIndex + 1}-L1/L2/L3/N`
          : hasSeparateRcd
          ? `FB${globalIndex + 1}-L1/L2/L3/N`
          : `FC${globalIndex + 1}-L1/L2/L3`;

        return (
          <g key={circuit.id}>
            <line x1={cx} y1={228} x2={cx} y2={BREAKER_TOP_Y} stroke="black" strokeWidth={2} />
            <DiagramBox cx={cx} y={BREAKER_TOP_Y} minWidth={95} height={BREAKER_H}
              title={circuit.breakerType}
              line1={`FC${globalIndex + 1}`}
              line2={`${circuit.breaker} | ${calcIncLabel(circuit.breaker)}`} />
            {hasSeparateRcd && (
              <>
                <line x1={cx} y1={breakerEndY} x2={cx} y2={rcdY} stroke="black" strokeWidth={2} />
                <DiagramBox cx={cx} y={rcdY} minWidth={105} height={RCD_H}
                  title="פחת" line1={`FB${globalIndex + 1}`} line2={circuit.rcd} />
              </>
            )}
            {hasTerminal && (
              <>
                <line x1={cx} y1={hasRcd ? rcdEndY : breakerEndY} x2={cx} y2={TERMINAL_Y} stroke="black" strokeWidth={2} />
                <DiagramBox cx={cx} y={TERMINAL_Y} minWidth={hasRcd ? 135 : 115} height={TERMINAL_H}
                  title="מהדק לפס דין" line1={terminalLabel} />
              </>
            )}
            <line x1={cx} y1={lineFromY} x2={cx} y2={BOTTOM_LINE_Y} stroke="black" strokeWidth={3} />
            <text x={cx} y={BOTTOM_LINE_Y + 14} textAnchor="middle" fontSize={9} fill="#444">
              {`${circuit.cableType} ${circuit.cableCores}x${circuit.cableSize}`}
            </text>
            <text x={cx} y={BOTTOM_LINE_Y + 28} textAnchor="middle" fontSize={13} fontWeight="bold">
              {chargerLabel(circuit.charger)}
            </text>
            <text x={cx} y={BOTTOM_LINE_Y + 42} textAnchor="middle" fontSize={12}>
              {circuit.charger}
            </text>
          </g>
        );
      })}

      <DiagramFooter info={info} pageNum={pageIndex + 1} totalPages={totalPages} docType="חד־קווי" />
    </svg>
  );
};
