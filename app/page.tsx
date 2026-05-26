"use client";

import { useState, useRef } from "react";
import { useCircuits } from "./hooks/useCircuits";
import { useProjectInfo } from "./hooks/useProjectInfo";
import { useExistingPanel } from "./hooks/useExistingPanel";
import { usePdfExport } from "./hooks/usePdfExport";
import { ProjectInfoForm } from "./components/ProjectInfoForm";
import { CircuitCard } from "./components/CircuitCard";
import { SingleLineDiagramPage } from "./components/SingleLineDiagram";
import { EquipmentTablePage } from "./components/EquipmentTable";
import { ExistingPanelForm } from "./components/ExistingPanelForm";
import { ExistingLineDiagram } from "./components/ExistingLineDiagram";
import { ExistingEquipmentTable } from "./components/ExistingEquipmentTable";
import { PhotoPage } from "./components/PhotoPage";
import { splitToPages, getEquipmentItems } from "./lib/calculations";

type ProjectType = "new" | "existing" | "";

export default function Home() {
  const [projectType, setProjectType] = useState<ProjectType>("");

  // לוח חדש
  const { info, updateInfo } = useProjectInfo();
  const { circuits, addCircuit, removeCircuit, updateCircuit, duplicateCircuit } = useCircuits();
  const { pdfRef, exportPdf } = usePdfExport(info.panelName);

  // לוח קיים
  const {
    info: existingInfo,
    updateInfo: updateExistingInfo,
    circuits: existingCircuits,
    addExistingCircuit,
    addNewCircuit,
    removeCircuit: removeExistingCircuit,
    updateCircuit: updateExistingCircuit,
  } = useExistingPanel();
  const existingPdfRef = useRef<HTMLDivElement>(null);

  const exportExistingPdf = async () => {
    if (!existingPdfRef.current) return;
    const { default: jsPDF } = await import("jspdf");
    const { default: html2canvas } = await import("html2canvas");
    const pages = Array.from(existingPdfRef.current.querySelectorAll<HTMLElement>(".pdf-page"));
    if (!pages.length) return;
    const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
    for (let i = 0; i < pages.length; i++) {
      const canvas = await html2canvas(pages[i], { scale: 2, backgroundColor: "#ffffff", useCORS: true });
      if (i > 0) pdf.addPage("a4", "landscape");
      const w = 287;
      const h = (canvas.height * w) / canvas.width;
      pdf.addImage(canvas.toDataURL("image/png"), "PNG", 5, (210 - h) / 2, w, h);
    }
    pdf.save(`${existingInfo.panelName || "לוח-קיים"}.pdf`);
  };

  // לוח חדש — עמודים
  const drawingPages = splitToPages(circuits, 6);
  const equipmentItems = getEquipmentItems(info, circuits);
  const equipmentPages = splitToPages(equipmentItems, 18);
  const totalPages = drawingPages.length + equipmentPages.length;
  const canExport = circuits.length > 0 && !!info.mainBreakerAmp;

  // לוח קיים — עמודים
  const existingTotalPages = 3; // תמונות + חד-קווי + רשימת ציוד
  const canExportExisting = existingCircuits.length > 0;

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
                projectType === "existing" ? "border-slate-900 bg-slate-900 text-white" : "border-slate-300 bg-white"
              }`}
            >
              התחברות ללוח קיים
            </button>
            <button
              onClick={() => setProjectType("new")}
              className={`rounded-3xl border p-10 text-2xl font-semibold shadow-sm transition hover:shadow-lg ${
                projectType === "new" ? "border-slate-900 bg-slate-900 text-white" : "border-slate-300 bg-white"
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
                <button onClick={addCircuit} className="rounded-2xl bg-slate-900 px-8 py-3 text-white">
                  + הוסף מעגל
                </button>
              </div>
            </section>

            <section className="rounded-3xl bg-white p-8 shadow">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold">{info.panelName || "לוח חלוקה"}</h2>
                <div className="flex items-center gap-3">
                  {!canExport && <span className="text-sm text-slate-400">נדרש מפסק ראשי ומעגל אחד לפחות</span>}
                  <button onClick={exportPdf} disabled={!canExport}
                    className="rounded-2xl bg-slate-900 px-6 py-3 text-white disabled:cursor-not-allowed disabled:opacity-40">
                    יצוא PDF
                  </button>
                </div>
              </div>
              <div ref={pdfRef} style={{ backgroundColor: "#ffffff", color: "#000000", width: 1120, padding: 24 }}
                className="overflow-x-auto border bg-white">
                <div className="space-y-10">
                  {drawingPages.map((pageCircuits, pageIndex) => (
                    <SingleLineDiagramPage
                      key={`drawing-${pageIndex}`}
                      info={info}
                      pageCircuits={pageCircuits}
                      pageIndex={pageIndex}
                      totalPages={totalPages}
                    />
                  ))}
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
          <>
            <ExistingPanelForm
              info={existingInfo}
              circuits={existingCircuits}
              onInfoChange={updateExistingInfo}
              onAddExisting={addExistingCircuit}
              onAddNew={addNewCircuit}
              onRemove={removeExistingCircuit}
              onUpdate={updateExistingCircuit}
            />

            <section className="rounded-3xl bg-white p-8 shadow">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold">{existingInfo.panelName || "לוח קיים"}</h2>
                <div className="flex items-center gap-3">
                  {!canExportExisting && <span className="text-sm text-slate-400">נדרש לפחות מעגל אחד</span>}
                  <button onClick={exportExistingPdf} disabled={!canExportExisting}
                    className="rounded-2xl bg-slate-900 px-6 py-3 text-white disabled:cursor-not-allowed disabled:opacity-40">
                    יצוא PDF
                  </button>
                </div>
              </div>

              <div ref={existingPdfRef} style={{ backgroundColor: "#ffffff", color: "#000000", width: 1120, padding: 24 }}
                className="overflow-x-auto border bg-white">
                <div className="space-y-10">
                  <PhotoPage
                    info={existingInfo}
                    circuits={existingCircuits}
                    pageNum={1}
                    totalPages={existingTotalPages}
                  />
                  <ExistingLineDiagram
                    info={existingInfo}
                    circuits={existingCircuits}
                    pageNum={2}
                    totalPages={existingTotalPages}
                  />
                  <ExistingEquipmentTable
                    info={existingInfo}
                    circuits={existingCircuits}
                    pageNum={3}
                    totalPages={existingTotalPages}
                  />
                </div>
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  );
}