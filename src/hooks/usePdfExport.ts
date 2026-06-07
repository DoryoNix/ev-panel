"use client";

import { useCallback, useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export const usePdfExport = (filename: string) => {
  const pdfRef = useRef<HTMLDivElement>(null);

  const exportPdf = useCallback(async () => {
    if (!pdfRef.current) return;

    const pages = Array.from(
      pdfRef.current.querySelectorAll<HTMLElement>(".pdf-page")
    );
    if (pages.length === 0) return;

    const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });

    for (let i = 0; i < pages.length; i++) {
      const canvas = await html2canvas(pages[i], {
        scale: 2,
        backgroundColor: "#ffffff",
        useCORS: true,
        scrollX: 0,
        scrollY: 0,
      });

      const imgData = canvas.toDataURL("image/png");
      if (i > 0) pdf.addPage("a4", "landscape");

      const pdfWidth = 287;
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      const y = (210 - pdfHeight) / 2;
      pdf.addImage(imgData, "PNG", 5, y, pdfWidth, pdfHeight);
    }

    pdf.save(`${filename || "לוח-חלוקה"}.pdf`);
  }, [filename]);

  return { pdfRef, exportPdf };
};
