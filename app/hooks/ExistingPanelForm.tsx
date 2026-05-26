"use client";

import { useRef } from "react";
import type { ExistingPanelInfo, PanelCircuit, ExistingCircuit, NewCircuit, BreakerType, EarthingSystem, CableType, CableCores, CableSize, FeedConnection, RcdOption } from "../types/existingPanel";
import { calcContinuousRating } from "../lib/calculations";

const BREAKER_TYPES: BreakerType[] = ['מא"ז', "ברייקר TMD", "ברייקר LSI", "מפסק משולב פחת"];
const BREAKER_AMPS = ["3x16A","3x20A","3x25A","3x32A","3x40A","3x50A","3x63A","3x80A","3x100A","3x125A","3x160A","3x200A","3x250A","3x315A","3x400A","3x630A"];
const EARTHING: EarthingSystem[] = ["TN-C-S","TN-S","TT"];
const CHARGERS = ["AC 11kW","AC 2X11kW","AC 22kW","AC 2X22kW","DC 30kW","DC 60kW","DC 90kW","DC 120kW","DC 150kW","DC 180kW","DC 200kW"];
const CABLE_TYPES: CableType[] = ["N2XY נחושת","NA2XY אלומיניום","גיד PVC נחושת"];
const CABLE_CORES: CableCores[] = ["4","5"];
const CABLE_SIZES: CableSize[] = ["6","10","16","25","35","50","70","95","120","150","185","240"];
const PE_SIZES = ["ללא","6","10","16","25","35","50","70","95","120","150","185","240"];
const FEED_CONNECTIONS: FeedConnection[] = ["מהדק פס דין","ישירות למפסק - חיבור מהיר","ישירות למפסק - נעל כבל"];
const RCD_OPTIONS: RcdOption[] = ["ללא","4x40A Type A 30mA","4x40A Type A 300mA","4x63A Type A 30mA","4x63A Type A 300mA"];

const inputCls = "rounded-xl border border-slate-200 p-2.5 text-sm focus:border-slate-400 focus:outline-none bg-white";
const readonlyCls = "rounded-xl border border-slate-200 bg-slate-100 p-2.5 text-sm text-slate-500";

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <label className="flex flex-col gap-1.5 text-sm font-medium text-slate-700">{label}{children}</label>
);

const Sel = ({ value, onChange, options, readOnly }: { value: string; onChange?: (v: string) => void; options: string[]; readOnly?: boolean }) => (
  <select className={`rounded-xl border border-slate-200 p-2.5 text-sm focus:border-slate-400 focus:outline-none ${readOnly ? "bg-slate-100 text-slate-500" : "bg-white"}`}
    value={value} onChange={e => onChange?.(e.target.value)} disabled={readOnly}>
    {options.map(o => <option key={o}>{o}</option>)}
  </select>
);

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <div className="mb-2 mt-4 text-xs font-semibold uppercase tracking-wider text-slate-400">{children}</div>
);

type Props = {
  info: ExistingPanelInfo;
  circuits: PanelCircuit[];
  onInfoChange: <K extends keyof ExistingPanelInfo>(field: K, value: ExistingPanelInfo[K]) => void;
  onAddExisting: () => void;
  onAddNew: () => void;
  onRemove: (id: number) => void;
  onUpdate: (id: number, field: string, value: any) => void;
};

export const ExistingPanelForm = ({ info, circuits, onInfoChange, onAddExisting, onAddNew, onRemove, onUpdate }: Props) => {
  const panelPhotoRef = useRef<HTMLInputElement>(null);

  const handlePanelPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onInfoChange("panelPhoto", reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleBreakerPhoto = (id: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onUpdate(id, "breakerPhoto", reader.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6">
      {/* פרטי פרויקט */}
      <section className="rounded-3xl bg-white p-8 shadow">
        <h2 className="mb-6 text-2xl font-bold">פרטי הפרויקט</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <Field label="שם לקוח"><input className={inputCls} value={info.customerName} onChange={e => onInfoChange("customerName", e.target.value)} placeholder="שם לקוח" /></Field>
          <Field label="שם פרויקט"><input className={inputCls} value={info.projectName} onChange={e => onInfoChange("projectName", e.target.value)} placeholder="שם פרויקט" /></Field>
          <Field label="תאריך"><input type="date" className={inputCls} value={info.date} onChange={e => onInfoChange("date", e.target.value)} /></Field>
        </div>
      </section>

      {/* פרטי לוח קיים */}
      <section className="rounded-3xl bg-white p-8 shadow">
        <h2 className="mb-6 text-2xl font-bold">פרטי הלוח הקיים</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <Field label="שם הלוח"><input className={inputCls} value={info.panelName} onChange={e => onInfoChange("panelName", e.target.value)} placeholder="שם הלוח" /></Field>
          <Field label="מיקום הלוח"><input className={inputCls} value={info.location} onChange={e => onInfoChange("location", e.target.value)} placeholder="מיקום" /></Field>
          <Field label="שיטת הגנה"><Sel value={info.earthingSystem} onChange={v => onInfoChange("earthingSystem", v as EarthingSystem)} options={EARTHING} /></Field>
          <Field label="סוג מפסק ראשי קיים"><Sel value={info.mainBreakerType} onChange={v => onInfoChange("mainBreakerType", v as BreakerType)} options={BREAKER_TYPES} /></Field>
          <Field label="זרם מפסק ראשי קיים">
            <select className={inputCls} value={info.mainBreakerSize} onChange={e => onInfoChange("mainBreakerSize", e.target.value)}>
              <option value="">בחר</option>
              {BREAKER_AMPS.map(o => <option key={o}>{o}</option>)}
            </select>
          </Field>
          <Field label="זרם רציף מרבי (80%)"><input className={readonlyCls} value={calcContinuousRating(info.mainBreakerSize)} readOnly /></Field>
        </div>

        <div className="mt-6">
          <div className="text-sm font-medium text-slate-700 mb-2">תמונת הלוח הקיים</div>
          <div className="flex items-center gap-4">
            <button onClick={() => panelPhotoRef.current?.click()}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50">
              {info.panelPhoto ? "החלף תמונה" : "העלה תמונה"}
            </button>
            {info.panelPhoto && (
              <img src={info.panelPhoto} alt="לוח קיים" className="h-20 w-auto rounded-xl border border-slate-200 object-cover" />
            )}
          </div>
          <input ref={panelPhotoRef} type="file" accept="image/*" className="hidden" onChange={handlePanelPhoto} />
        </div>
      </section>

      {/* מעגלים */}
      <section className="rounded-3xl bg-white p-8 shadow">
        <h2 className="mb-6 text-2xl font-bold">מעגלי טעינה</h2>

        <div className="space-y-6">
          {circuits.map((circuit, index) => {
            const newIdx = circuits.filter((x, i) => x.isNew && i <= index).length;
            return (
              <div key={circuit.id} className={`rounded-2xl border-2 p-6 ${circuit.isNew ? "border-blue-200 bg-blue-50" : "border-slate-200 bg-slate-50"}`}>

                {/* כותרת */}
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold text-white ${circuit.isNew ? "bg-blue-600" : "bg-slate-700"}`}>
                      {index + 1}
                    </span>
                    <div>
                      <h3 className="text-lg font-bold">
                        {circuit.isNew
                          ? `${(circuit as NewCircuit).circuitName || `FC${newIdx}`} — מעגל חדש`
                          : `מעגל קיים ${(circuit as ExistingCircuit).circuitNumber ? `מס׳ ${(circuit as ExistingCircuit).circuitNumber}` : ""}`}
                      </h3>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${circuit.isNew ? "bg-blue-100 text-blue-700" : "bg-slate-200 text-slate-600"}`}>
                        {circuit.isNew ? "תוספת חדשה" : "קיים בלוח"}
                      </span>
                    </div>
                  </div>
                  <button onClick={() => onRemove(circuit.id)} className="rounded-xl border border-red-100 bg-white px-3 py-1.5 text-sm text-red-600 hover:bg-red-50">מחק</button>
                </div>

                {/* מעגל קיים */}
                {!circuit.isNew && (() => {
                  const c = circuit as ExistingCircuit;
                  return (
                    <>
                      <SectionTitle>פרטי המפסק הקיים</SectionTitle>
                      <div className="grid gap-4 md:grid-cols-3 mb-4">
                        <Field label="מספר מעגל בלוח">
                          <input className={inputCls} value={c.circuitNumber} onChange={e => onUpdate(c.id, "circuitNumber", e.target.value)} placeholder="לדוגמה: 7" />
                        </Field>
                        <Field label="סוג עמדה"><Sel value={c.charger} onChange={v => onUpdate(c.id, "charger", v)} options={CHARGERS} /></Field>
                        <Field label="סוג מפסק קיים"><Sel value={c.existingBreakerType} onChange={v => onUpdate(c.id, "existingBreakerType", v as BreakerType)} options={BREAKER_TYPES} /></Field>
                        <Field label="זרם מפסק קיים"><Sel value={c.existingBreakerSize} onChange={v => onUpdate(c.id, "existingBreakerSize", v)} options={BREAKER_AMPS} /></Field>
                        <Field label="זרם רציף מרבי (80%)"><input className={readonlyCls} value={calcContinuousRating(c.existingBreakerSize)} readOnly /></Field>
                        <Field label="כיול מפסק (אם נדרש)"><input className={inputCls} value={c.calibration} onChange={e => onUpdate(c.id, "calibration", e.target.value)} placeholder="לדוגמה: 3x25A" /></Field>
                      </div>

                      <SectionTitle>תוספות למעגל הקיים</SectionTitle>
                      <div className="grid gap-4 md:grid-cols-3 mb-4">
                        <Field label="שיטת חיבור קיימת"><Sel value={c.feedConnection} onChange={v => onUpdate(c.id, "feedConnection", v as FeedConnection)} options={FEED_CONNECTIONS} /></Field>
                        <Field label="הוספת פחת בטור">
                          <select className={inputCls} value={c.addRcd ? "כן" : "לא"} onChange={e => onUpdate(c.id, "addRcd", e.target.value === "כן")}>
                            <option>לא</option><option>כן</option>
                          </select>
                        </Field>
                        {c.addRcd && (
                          <Field label="מפרט פחת"><Sel value={c.rcdSpec} onChange={v => onUpdate(c.id, "rcdSpec", v as RcdOption)} options={RCD_OPTIONS.filter(o => o !== "ללא")} /></Field>
                        )}
                        <Field label="הוספת מהדק פס דין">
                          <select className={inputCls} value={c.addTerminal ? "כן" : "לא"} onChange={e => onUpdate(c.id, "addTerminal", e.target.value === "כן")}>
                            <option>לא</option><option>כן</option>
                          </select>
                        </Field>
                      </div>

                      <SectionTitle>כבל הזנה לעמדה</SectionTitle>
                      <div className="grid gap-4 md:grid-cols-4 mb-4">
                        <Field label="סוג כבל"><Sel value={c.cableType} onChange={v => onUpdate(c.id, "cableType", v as CableType)} options={CABLE_TYPES} /></Field>
                        <Field label="מספר גידים"><Sel value={c.cableCores} onChange={v => onUpdate(c.id, "cableCores", v as CableCores)} options={CABLE_CORES} /></Field>
                        <Field label="חתך (ממ״ר)"><Sel value={c.cableSize} onChange={v => onUpdate(c.id, "cableSize", v as CableSize)} options={CABLE_SIZES} /></Field>
                        {c.cableCores === "4" && (
                          <Field label="חתך PE נפרד"><Sel value={c.peCableSize} onChange={v => onUpdate(c.id, "peCableSize", v)} options={PE_SIZES} /></Field>
                        )}
                      </div>

                      <SectionTitle>תמונת המפסק הקיים</SectionTitle>
                      <div className="flex items-center gap-4">
                        <button onClick={() => document.getElementById(`photo-${c.id}`)?.click()}
                          className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50">
                          {c.breakerPhoto ? "החלף תמונה" : "העלה תמונה"}
                        </button>
                        {c.breakerPhoto && (
                          <img src={c.breakerPhoto} alt="מפסק" className="h-16 w-auto rounded-xl border border-slate-200 object-cover" />
                        )}
                        <input id={`photo-${c.id}`} type="file" accept="image/*" className="hidden" onChange={e => handleBreakerPhoto(c.id, e)} />
                      </div>
                    </>
                  );
                })()}

                {/* מעגל חדש */}
                {circuit.isNew && (() => {
                  const c = circuit as NewCircuit;
                  return (
                    <>
                      <SectionTitle>עמדה ומפסק חדש</SectionTitle>
                      <div className="grid gap-4 md:grid-cols-3 mb-4">
                        <Field label="שם מעגל">
                          <input className={inputCls} value={c.circuitName} onChange={e => onUpdate(c.id, "circuitName", e.target.value)} placeholder={`FC${newIdx}`} />
                        </Field>
                        <Field label="סוג עמדה"><Sel value={c.charger} onChange={v => onUpdate(c.id, "charger", v)} options={CHARGERS} /></Field>
                        <Field label="סוג מפסק"><Sel value={c.breakerType} onChange={v => onUpdate(c.id, "breakerType", v as BreakerType)} options={BREAKER_TYPES} /></Field>
                        <Field label="זרם מפסק"><Sel value={c.breaker} onChange={v => onUpdate(c.id, "breaker", v)} options={BREAKER_AMPS} /></Field>
                        <Field label="פחת טורי"><Sel value={c.rcd} onChange={v => onUpdate(c.id, "rcd", v as RcdOption)} options={RCD_OPTIONS} /></Field>
                        <Field label="זרם רציף (80%)"><input className={readonlyCls} value={calcContinuousRating(c.breaker)} readOnly /></Field>
                        <Field label="כיול מפסק (אם נדרש)"><input className={inputCls} value={c.calibration} onChange={e => onUpdate(c.id, "calibration", e.target.value)} placeholder="לדוגמה: 3x25A" /></Field>
                      </div>

                      <SectionTitle>כבל הזנה לעמדה</SectionTitle>
                      <div className="grid gap-4 md:grid-cols-4">
                        <Field label="סוג כבל"><Sel value={c.cableType} onChange={v => onUpdate(c.id, "cableType", v as CableType)} options={CABLE_TYPES} /></Field>
                        <Field label="מספר גידים"><Sel value={c.cableCores} onChange={v => onUpdate(c.id, "cableCores", v as CableCores)} options={CABLE_CORES} /></Field>
                        <Field label="חתך (ממ״ר)"><Sel value={c.cableSize} onChange={v => onUpdate(c.id, "cableSize", v as CableSize)} options={CABLE_SIZES} /></Field>
                        {c.cableCores === "4" && (
                          <Field label="חתך PE נפרד"><Sel value={c.peCableSize} onChange={v => onUpdate(c.id, "peCableSize", v)} options={PE_SIZES} /></Field>
                        )}
                        <Field label="חיבור כבל בלוח"><Sel value={c.feedConnection} onChange={v => onUpdate(c.id, "feedConnection", v as FeedConnection)} options={FEED_CONNECTIONS} /></Field>
                      </div>
                    </>
                  );
                })()}

                {/* תקציר */}
                <div className={`mt-4 rounded-xl px-4 py-2 text-sm ${circuit.isNew ? "bg-blue-100 text-blue-800" : "bg-white border border-slate-200 text-slate-600"}`}>
                  {circuit.isNew ? "✦ מעגל חדש" : "● מעגל קיים"} | כבל: <strong>{circuit.cableType} {circuit.cableCores}x{circuit.cableSize}</strong>
                  {!circuit.isNew && (circuit as ExistingCircuit).addRcd && " | + פחת חדש"}
                  {!circuit.isNew && (circuit as ExistingCircuit).addTerminal && " | + מהדק פס דין"}
                  {(circuit as any).calibration && ` | כיול: ${(circuit as any).calibration}`}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 flex justify-center gap-4">
          <button onClick={onAddExisting} className="rounded-2xl border-2 border-slate-700 bg-white px-6 py-3 text-slate-700 font-medium hover:bg-slate-50">
            + מעגל קיים בלוח
          </button>
          <button onClick={onAddNew} className="rounded-2xl bg-blue-600 px-6 py-3 text-white font-medium hover:bg-blue-700">
            + מעגל חדש לשתילה
          </button>
        </div>
      </section>
    </div>
  );
};
