"use client";

import { useState } from "react";
import { useCircuits } from "../hooks/useCircuits";
import { useProjectInfo } from "../hooks/useProjectInfo";
import { usePdfExport } from "../hooks/usePdfExport";
import { ProjectInfoForm } from "../components/ProjectInfoForm";
import { CircuitCard } from "../components/CircuitCard";
import { SingleLineDiagramPage } from "../components/SingleLineDiagram";
import { EquipmentTablePage } from "../components/EquipmentTable";
import { splitToPages, getEquipmentItems } from "../lib/calculations";

type ProjectType = "new" | "existing" | "";

export default function Home() {
  const [projectType, setProjectType] = useState<ProjectType>("");
  const { info, updateInfo } = useProjectInfo();
  const { circuits, addCircuit, removeCircuit, updateCircuit, duplicateCircuit } = useCircuits();
  const { pdfRef, exportPdf } = usePdfExport(info.panelName);

  // חישוב עמודים — פעם אחת בלבד
  const drawingPages = splitToPages(circuits, 6);
  const equipmentItems = getEquipmentItems(info, circuits);
  const equipmentPages = splitToPages(equipmentItems, 18);
  const totalPages = drawingPages.length + equipmentPages.length;

  const canExport = circuits.length > 0 && !!info.mainBreakerAmp;

  return (
    <main dir="rtl" className="min-h-screen bg-slate-50 p-8 text-slate-900">
      <div className="mx-auto max-w-6xl space-y-8">

        {/* Header */}
        <header className="rounded-3xl bg-white p-8 shadow">
          <div className="flex flex-col items-center gap-5">
            <img src="/logo.svg" alt="Doryonix Logo" className="h-24 w-auto" />
            <h1 className="text-4xl font-bold">מערכת תכנון לוחות טעינה</h1>
            <p className="text-lg text-slate-600">Doryonix | Power & Project Solution</p>
          </div>
        </header>

        {/* בחירת סוג פרויקט */}
        <section className="rounded-3xl bg-white p-8 shadow">
          <h2 className="mb-6 text-2xl font-bold">בחר סוג פרויקט</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <button
              onClick={() => setProjectType("existing")}
              className={`rounded-3xl border p-10 text-2xl font-semibold shadow-sm transition hover:shadow-lg ${
                projectType === "existing"
                  ? "border-slate-900 bg-slate-900 text-white"
                  : "border-slate-300 bg-white"
              }`}
            >
              התחברות ללוח קיים
            </button>
            <button
              onClick={() => setProjectType("new")}
              className={`rounded-3xl border p-10 text-2xl font-semibold shadow-sm transition hover:shadow-lg ${
                projectType === "new"
                  ? "border-slate-900 bg-slate-900 text-white"
                  : "border-slate-300 bg-white"
              }`}
            >
              לוח חלוקה חדש
            </button>
          </div>
        </section>

        {/* ===== לוח חדש ===== */}
        {projectType === "new" && (
          <>
            <ProjectInfoForm info={info} onChange={updateInfo} />

            {/* מעגלי טעינה */}
            <section className="rounded-3xl bg-white p-8 shadow">
              <h2 className="mb-6 text-2xl font-bold">מעגלי טעינה</h2>

              <div className="space-y-6">
                {circuits.map((circuit, index) => (
                  <CircuitCard
                    key={circuit.id}
                    circuit={circuit}
                    index={index}
                    onUpdate={updateCircuit}
                    onRemove={removeCircuit}
                    onDuplicate={duplicateCircuit}
                  />
                ))}
              </div>

              <div className="mt-6 flex justify-center">
                <button
                  onClick={addCircuit}
                  className="rounded-2xl bg-slate-900 px-8 py-3 text-white"
                >
                  + הוסף מעגל
                </button>
              </div>
            </section>

            {/* תצוגה מקדימה + PDF */}
            <section className="rounded-3xl bg-white p-8 shadow">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold">{info.panelName || "לוח חלוקה"}</h2>

                <div className="flex items-center gap-3">
                  {!canExport && (
                    <span className="text-sm text-slate-400">
                      נדרש מפסק ראשי ומעגל אחד לפחות
                    </span>
                  )}
                  <button
                    onClick={exportPdf}
                    disabled={!canExport}
                    className="rounded-2xl bg-slate-900 px-6 py-3 text-white disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    יצוא PDF
                  </button>
                </div>
              </div>

              <div
                ref={pdfRef}
                style={{ backgroundColor: "#ffffff", color: "#000000", width: 1120, padding: 24 }}
                className="overflow-x-auto border bg-white"
              >
                <div className="space-y-10">

                  {/* עמודי חד-קווי */}
                  {drawingPages.map((pageCircuits, pageIndex) => (
                    <div
                      key={`drawing-${pageIndex}`}
                      className="pdf-page"
                      style={{ width: 1100, height: 700 }}
                    >
                     <SingleLineDiagramPage
                        info={info}
                        pageCircuits={pageCircuits}
                        pageIndex={pageIndex}
                        totalPages={totalPages}
                      />
                    </div>
                  ))}

                  {/* עמודי רשימת ציוד */}
                  {equipmentPages.map((pageItems, equipIdx) => (
                    <EquipmentTablePage
                      key={`equipment-${equipIdx}`}
                      info={info}
                      pageItems={pageItems}
                      pageNum={drawingPages.length + equipIdx + 1}
                      totalPages={totalPages}
                      totalItems={equipmentItems.length}
                      totalUnits={equipmentItems.reduce((s, i) => s + i.qty, 0)}
                    />
                  ))}
                </div>
              </div>
            </section>
          </>
        )}

        {/* ===== לוח קיים ===== */}
        {projectType === "existing" && (
          <section className="rounded-3xl bg-white p-8 shadow">
            <h2 className="mb-6 text-2xl font-bold">חיבור ללוח קיים</h2>
            <p className="text-slate-600">
              בשלב הבא נבנה את מסך ההתחברות ללוח קיים — הגדרת לוח קיים, מסילות פנויות, ושתילת מעגלים.
            </p>
          </section>
        )}
      </div>
    </main>
  );
}
