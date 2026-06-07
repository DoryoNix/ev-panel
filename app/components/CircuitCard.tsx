"use client";

import type { Circuit, BreakerType, ChargerType, RcdOption, TerminalOption, WireSize, ConnectionType, NeutralConnection, CableType, CableCores, CableSize, FeedConnection } from "../types";
import { calcContinuousRating } from "../lib/calculations";

const CHARGERS: ChargerType[] = [
  "AC 11kW","AC 2X11kW","AC 22kW","AC 2X22kW",
  "DC 30kW","DC 60kW","DC 90kW","DC 120kW","DC 150kW","DC 180kW","DC 200kW",
];
const BREAKER_TYPES: BreakerType[] = ['מא"ז',"ברייקר TMD","ברייקר LSI","מפסק משולב פחת"];
const BREAKER_AMPS = [
  "3x16A","3x20A","3x25A","3x32A","3x40A","3x50A","3x63A","3x80A",
  "3x100A","3x125A","3x160A","3x200A","3x250A",
  "4x16A Type A 30mA","4x32A Type A 30mA",
];
const RCD_OPTIONS: RcdOption[] = [
  "ללא","4x40A Type A 30mA","4x40A Type A 300mA",
  "4x63A Type A 30mA","4x63A Type A 300mA",
];
const WIRE_SIZES: WireSize[] = ["2.5","4","6","10","16","25","35","50","70","95","120"];
const CONNECTION_TYPES: ConnectionType[] = ["חיבור ישיר","נעל כבל","חיבור מהיר"];
const NEUTRAL_CONNECTIONS: NeutralConnection[] = ["חיבור ישיר","נעל כבל","אומגה","מהדק פס דין"];
const CABLE_TYPES: CableType[] = ["N2XY נחושת","NA2XY אלומיניום","גיד PVC נחושת"];
const CABLE_CORES: CableCores[] = ["4","5"];
const CABLE_SIZES: CableSize[] = ["6","10","16","25","35","50","70","95","120","150","185","240"];
const PE_SIZES: (CableSize | "ללא")[] = ["ללא","6","10","16","25","35","50","70","95","120","150","185","240"];
const FEED_CONNECTIONS: FeedConnection[] = [
  "מהדק פס דין",
  "ישירות למפסק - חיבור מהיר",
  "ישירות למפסק - נעל כבל",
];

type Props = {
  circuit: Circuit;
  index: number;
  onUpdate: <K extends keyof Circuit>(id: number, field: K, value: Circuit[K]) => void;
  onRemove: (id: number) => void;
  onDuplicate: (id: number) => void;
};

const Label = ({ children }: { children: React.ReactNode }) => (
  <label className="flex flex-col gap-1.5 text-sm font-medium text-slate-700">
    {children}
  </label>
);

const Sel = ({
  value, onChange, options, readOnly,
}: {
  value: string;
  onChange?: (v: string) => void;
  options: string[];
  readOnly?: boolean;
}) => (
  <select
    className={`rounded-xl border border-slate-200 p-2.5 text-sm focus:border-slate-400 focus:outline-none ${
      readOnly ? "bg-slate-100 text-slate-500" : "bg-white"
    }`}
    value={value}
    onChange={(e) => onChange?.(e.target.value)}
    disabled={readOnly}
  >
    {options.map((o) => <option key={o}>{o}</option>)}
  </select>
);

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <div className="mb-2 mt-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
    {children}
  </div>
);

export const CircuitCard = ({ circuit, index, onUpdate, onRemove, onDuplicate }: Props) => {
  const u = <K extends keyof Circuit>(field: K, value: Circuit[K]) =>
    onUpdate(circuit.id, field, value);

  const isFeedToDin = circuit.feedConnection === "מהדק פס דין";
  const isFeedLug = circuit.feedConnection === "ישירות למפסק - נעל כבל";
  const has4Cores = circuit.cableCores === "4";

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 transition hover:shadow-sm">
      
      {/* כותרת */}
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white">
            {index + 1}
          </span>
          <h3 className="text-lg font-bold text-slate-900">FC{index + 1}</h3>
        </div>
        <div className="flex gap-2">
          <button onClick={() => onDuplicate(circuit.id)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100">
            שכפל
          </button>
          <button onClick={() => onRemove(circuit.id)}
            className="rounded-xl border border-red-100 bg-white px-3 py-1.5 text-sm text-red-600 hover:bg-red-50">
            מחק
          </button>
        </div>
      </div>

      {/* עמדה ומפסק */}
      <SectionTitle>עמדה ומפסק</SectionTitle>
      <div className="mb-2 grid gap-4 md:grid-cols-3">
        <Label>סוג עמדה
          <Sel value={circuit.charger} onChange={(v) => u("charger", v as ChargerType)} options={CHARGERS} />
        </Label>
        <Label>סוג מפסק
          <Sel value={circuit.breakerType} onChange={(v) => u("breakerType", v as BreakerType)} options={BREAKER_TYPES} />
        </Label>
        <Label>זרם מפסק
          <Sel value={circuit.breaker} onChange={(v) => u("breaker", v)} options={BREAKER_AMPS} />
        </Label>
      </div>

      <div className="mb-2 grid gap-4 md:grid-cols-3">
        <Label>פחת טורי למעגל
          <Sel value={circuit.rcd} onChange={(v) => u("rcd", v as RcdOption)} options={RCD_OPTIONS} />
        </Label>
        <Label>חיבור כבל יציאה פנימי
          <Sel value={circuit.terminal} onChange={(v) => u("terminal", v as TerminalOption)}
            options={["ישירות למפסק / פחת","דרך מהדקי פס דין"]} />
        </Label>
        <Label>זרם רציף מרבי (80%)
          <input className="rounded-xl border border-slate-200 bg-slate-100 p-2.5 text-sm text-slate-500"
            value={calcContinuousRating(circuit.breaker)} readOnly />
        </Label>
      </div>

      {/* גידים פנימיים */}
      <SectionTitle>גידים פנימיים בלוח</SectionTitle>
      <div className="mb-2 grid gap-4 md:grid-cols-4">
        <Label>גיד גמיש פנימי
          <Sel value={circuit.wireSize} onChange={(v) => u("wireSize", v as WireSize)} options={WIRE_SIZES} />
        </Label>
        <Label>חיבור למפסק / פחת
          <Sel value={circuit.connectionType} onChange={(v) => u("connectionType", v as ConnectionType)} options={CONNECTION_TYPES} />
        </Label>
        <Label>חיבור N
          <Sel value={circuit.neutralConnection} onChange={(v) => u("neutralConnection", v as NeutralConnection)} options={NEUTRAL_CONNECTIONS} />
        </Label>
        <Label>חיבור PE
          <Sel value={circuit.peConnection} onChange={(v) => u("peConnection", v as NeutralConnection)} options={NEUTRAL_CONNECTIONS} />
        </Label>
      </div>

      {/* כבל הזנה לעמדה */}
      <SectionTitle>כבל הזנה לעמדת טעינה</SectionTitle>
      <div className="mb-2 grid gap-4 md:grid-cols-4">
        <Label>סוג כבל
          <Sel value={circuit.cableType} onChange={(v) => u("cableType", v as CableType)} options={CABLE_TYPES} />
        </Label>
        <Label>מספר גידים
          <Sel value={circuit.cableCores} onChange={(v) => u("cableCores", v as CableCores)} options={CABLE_CORES} />
        </Label>
        <Label>חתך כבל (ממ"ר)
          <Sel value={circuit.cableSize} onChange={(v) => u("cableSize", v as CableSize)} options={CABLE_SIZES} />
        </Label>
        {has4Cores && (
          <Label>חתך PE נפרד (ממ"ר)
            <Sel value={circuit.peCableSize} onChange={(v) => u("peCableSize", v as CableSize | "ללא")} options={PE_SIZES} />
          </Label>
        )}
      </div>

      {/* חיבור כבל בלוח */}
      <div className="mb-2 grid gap-4 md:grid-cols-4">
        <Label>חיבור כבל בלוח
          <Sel value={circuit.feedConnection} onChange={(v) => u("feedConnection", v as FeedConnection)} options={FEED_CONNECTIONS} />
        </Label>

        {/* אם מהדק פס דין — האם N ו-PE עם נעל כבל */}
        {isFeedToDin && (
          <>
            <Label>נעל כבל ל-N
              <select
                className="rounded-xl border border-slate-200 bg-white p-2.5 text-sm"
                value={circuit.feedNLug ? "כן" : "לא"}
                onChange={(e) => u("feedNLug", e.target.value === "כן")}
              >
                <option>לא</option>
                <option>כן</option>
              </select>
            </Label>
            <Label>נעל כבל ל-PE
              <select
                className="rounded-xl border border-slate-200 bg-white p-2.5 text-sm"
                value={circuit.feedPELug ? "כן" : "לא"}
                onChange={(e) => u("feedPELug", e.target.value === "כן")}
              >
                <option>לא</option>
                <option>כן</option>
              </select>
            </Label>
          </>
        )}
      </div>

      {/* תקציר כבל */}
      <div className="mt-3 rounded-xl bg-white border border-slate-200 px-4 py-2 text-sm text-slate-600">
        כבל: <strong>{circuit.cableType} {circuit.cableCores}x{circuit.cableSize} ממ"ר</strong>
        {has4Cores && circuit.peCableSize !== "ללא" && (
          <span> + PE נחושת {circuit.peCableSize} ממ"ר</span>
        )}
        {" | "}
        חיבור: <strong>{circuit.feedConnection}</strong>
        {isFeedLug && <span> | נעלי כבל: <strong>{circuit.cableCores}</strong> יח׳</span>}
      </div>
    </div>
  );
};