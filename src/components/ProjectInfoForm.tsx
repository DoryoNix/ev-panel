"use client";

import type { ProjectInfo, BreakerType, EarthingSystem, PanelMaterial, PanelInstallation, PanelCabling, PanelLock, LogoChoice } from "../types";
import { calcContinuousRating } from "../lib/calculations";

const BREAKER_TYPES: BreakerType[] = ['מא"ז',"ברייקר TMD","ברייקר LSI","מפסק משולב פחת"];
const BREAKER_AMPS = [
  "3x16A","3x20A","3x25A","3x32A","3x40A","3x50A","3x63A","3x80A",
  "3x100A","3x125A","3x160A","3x200A","3x250A","3x315A","3x400A","3x630A",
];
const EARTHING: EarthingSystem[] = ["TN-C-S","TN-S","TT"];
const MAIN_RCD_OPTIONS = [
  "ללא",
  "פחת במקביל 4x40A Type A 30mA",
  "פחת במקביל 4x40A Type A 300mA",
  "ברייקר משולב פחת",
  "ברייקר כולל ניתוק אפס בלבד",
];
const PANEL_MATERIALS: PanelMaterial[] = ["פח","פוליאסטר","CI"];
const PANEL_INSTALLATIONS: PanelInstallation[] = ["פנימית","חיצונית"];
const PANEL_CABLINGS: PanelCabling[] = ["מלמטה","מלמעלה","מהצדדים"];
const PANEL_LOCKS: PanelLock[] = ["ללא מפתח","עם מפתח"];

type Props = {
  info: ProjectInfo;
  onChange: <K extends keyof ProjectInfo>(field: K, value: ProjectInfo[K]) => void;
};

const inputCls = "rounded-xl border border-slate-200 p-2.5 text-sm focus:border-slate-400 focus:outline-none bg-white";
const readonlyCls = "rounded-xl border border-slate-200 bg-slate-100 p-2.5 text-sm text-slate-500";

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <label className="flex flex-col gap-1.5 text-sm font-medium text-slate-700">
    {label}
    {children}
  </label>
);

export const ProjectInfoForm = ({ info, onChange }: Props) => (
  <section className="rounded-3xl bg-white p-8 shadow">
    <h2 className="mb-6 text-2xl font-bold">פרטי לוח חלוקה חדש</h2>

    {/* פרטי פרויקט */}
    <h3 className="mb-3 text-base font-semibold text-slate-500">פרטי פרויקט</h3>
    <div className="mb-6 grid gap-4 md:grid-cols-3">
      <Field label="שם לקוח">
        <input className={inputCls} placeholder="שם לקוח" value={info.customerName}
          onChange={(e) => onChange("customerName", e.target.value)} />
      </Field>
      <Field label="שם פרויקט">
        <input className={inputCls} placeholder="שם פרויקט" value={info.projectName}
          onChange={(e) => onChange("projectName", e.target.value)} />
      </Field>
      <Field label="תאריך">
        <input type="date" className={inputCls} value={info.date}
          onChange={(e) => onChange("date", e.target.value)} />
      </Field>
      <Field label="שם הלוח">
        <input className={inputCls} placeholder="שם הלוח" value={info.panelName}
          onChange={(e) => onChange("panelName", e.target.value)} />
      </Field>
      <Field label="מיקום">
        <input className={inputCls} placeholder="מיקום" value={info.location}
          onChange={(e) => onChange("location", e.target.value)} />
      </Field>
      <Field label="שיטת הגנה">
        <select className={inputCls} value={info.earthingSystem}
          onChange={(e) => onChange("earthingSystem", e.target.value as EarthingSystem)}>
          {EARTHING.map((o) => <option key={o}>{o}</option>)}
        </select>
      </Field>
    </div>

    {/* בחירת לוגו */}
    <h3 className="mb-3 text-base font-semibold text-slate-500">לוגו בתוכניות</h3>
    <div className="mb-6 grid gap-4 md:grid-cols-2">
      <button
        type="button"
        onClick={() => onChange("logoChoice", "doryonix")}
        className={`flex flex-col items-center gap-3 rounded-2xl border-2 p-4 transition ${
          info.logoChoice === "doryonix"
            ? "border-slate-900 bg-slate-900"
            : "border-slate-200 bg-white hover:border-slate-400"
        }`}
      >
        <img src="/logo.svg" alt="Doryonix" className="h-12 w-auto" />
        <span className={`text-sm font-medium ${info.logoChoice === "doryonix" ? "text-white" : "text-slate-700"}`}>
          לוגו Doryonix
        </span>
      </button>
      <button
        type="button"
        onClick={() => onChange("logoChoice", "edgecontrol")}
        className={`flex flex-col items-center gap-3 rounded-2xl border-2 p-4 transition ${
          info.logoChoice === "edgecontrol"
            ? "border-slate-900 bg-slate-900"
            : "border-slate-200 bg-white hover:border-slate-400"
        }`}
      >
        <img src="/edgecontrol_logo.svg" alt="Edge Control" className="h-12 w-auto" />
        <span className={`text-sm font-medium ${info.logoChoice === "edgecontrol" ? "text-white" : "text-slate-700"}`}>
          לוגו Edge Control
        </span>
        <span className={`text-xs ${info.logoChoice === "edgecontrol" ? "text-slate-300" : "text-slate-400"}`}>
          כולל: Powered &amp; built by DORYONIX
        </span>
      </button>
    </div>

    {/* נתוני ארון */}
    <h3 className="mb-3 text-base font-semibold text-slate-500">נתוני ארון</h3>
    <div className="mb-6 grid gap-4 md:grid-cols-4">
      <Field label="חומר הארון">
        <select className={inputCls} value={info.panelMaterial}
          onChange={(e) => onChange("panelMaterial", e.target.value as PanelMaterial)}>
          {PANEL_MATERIALS.map((o) => <option key={o}>{o}</option>)}
        </select>
      </Field>
      <Field label="התקנה">
        <select className={inputCls} value={info.panelInstallation}
          onChange={(e) => onChange("panelInstallation", e.target.value as PanelInstallation)}>
          {PANEL_INSTALLATIONS.map((o) => <option key={o}>{o}</option>)}
        </select>
      </Field>
      <Field label="כניסת כבילה">
        <select className={inputCls} value={info.panelCabling}
          onChange={(e) => onChange("panelCabling", e.target.value as PanelCabling)}>
          {PANEL_CABLINGS.map((o) => <option key={o}>{o}</option>)}
        </select>
      </Field>
      <Field label="נעילה">
        <select className={inputCls} value={info.panelLock}
          onChange={(e) => onChange("panelLock", e.target.value as PanelLock)}>
          {PANEL_LOCKS.map((o) => <option key={o}>{o}</option>)}
        </select>
      </Field>
    </div>

    {/* מפסק ראשי */}
    <h3 className="mb-3 text-base font-semibold text-slate-500">מפסק ראשי</h3>
    <div className="grid gap-4 md:grid-cols-3">
      <Field label="סוג מפסק ראשי">
        <select className={inputCls} value={info.mainBreakerType}
          onChange={(e) => onChange("mainBreakerType", e.target.value as BreakerType)}>
          {BREAKER_TYPES.map((o) => <option key={o}>{o}</option>)}
        </select>
      </Field>
      <Field label="זרם מפסק ראשי">
        <select className={inputCls} value={info.mainBreakerAmp}
          onChange={(e) => onChange("mainBreakerAmp", e.target.value)}>
          <option value="">בחר</option>
          {BREAKER_AMPS.map((o) => <option key={o}>{o}</option>)}
        </select>
      </Field>
      <Field label="זרם רציף מרבי (80%)">
        <input className={readonlyCls} value={calcContinuousRating(info.mainBreakerAmp)} readOnly />
      </Field>
      <Field label="כיול מפסק ראשי (אם נדרש)">
        <input className={inputCls} placeholder="לדוגמה: 3x160A" value={info.mainBreakerCalibration}
          onChange={(e) => onChange("mainBreakerCalibration", e.target.value)} />
      </Field>
      <Field label="הגנת פחת / ניתוק אפס">
        <select className={inputCls} value={info.mainRcd}
          onChange={(e) => onChange("mainRcd", e.target.value)}>
          {MAIN_RCD_OPTIONS.map((o) => <option key={o}>{o}</option>)}
        </select>
      </Field>
    </div>
  </section>
);
