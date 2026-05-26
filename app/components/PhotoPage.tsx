import type { ExistingPanelInfo, PanelCircuit, ExistingCircuit } from "../types/existingPanel";

type Props = {
  info: ExistingPanelInfo;
  circuits: PanelCircuit[];
  pageNum: number;
  totalPages: number;
};

const B = "#1a3a5c";
const FONT = "'David', 'Arial Hebrew', 'Noto Sans Hebrew', Arial, sans-serif";

const FooterCell = ({ l1, v1, l2, v2 }: { l1: string; v1: string; l2: string; v2: string }) => (
  <div style={{ borderLeft: `1.5px solid ${B}`, textAlign: "center", display: "flex", flexDirection: "column", justifyContent: "center", gap: 2, padding: "4px 8px" }}>
    <div style={{ fontSize: 10, color: "#666" }}>{l1}</div>
    <div style={{ fontSize: 12, fontWeight: "bold", color: B }}>{v1 || "-"}</div>
    <div style={{ fontSize: 10, color: "#666" }}>{l2}</div>
    <div style={{ fontSize: 12, fontWeight: "bold", color: B }}>{v2 || "-"}</div>
  </div>
);

export const PhotoPage = ({ info, circuits, pageNum, totalPages }: Props) => {
  const existingWithPhotos = circuits.filter(c => !c.isNew && (c as ExistingCircuit).breakerPhoto) as ExistingCircuit[];
  const dateStr = new Date(info.date).toLocaleDateString("he-IL");

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
        gridTemplateColumns: "280px 1fr 280px",
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
          <div style={{ fontSize: 22, fontWeight: "bold", color: B }}>תמונות לוח</div>
          <div style={{ fontSize: 11, color: "#555" }}>{info.panelName || "-"} | {info.location || "-"}</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          <img src="/logo.svg" alt="Doryonix" style={{ width: 150 }} />
        </div>
      </div>

      {/* תמונות */}
      <div style={{ flex: 1, padding: "16px 20px", display: "flex", gap: 20, alignItems: "flex-start", overflow: "hidden", minHeight: 0 }}>
        {/* תמונת לוח */}
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: "bold", color: B, marginBottom: 8 }}>תמונת הלוח הקיים</div>
          {info.panelPhoto ? (
           <img src={info.panelPhoto} alt="לוח קיים" style={{ maxWidth: "100%", maxHeight: 440, objectFit: "scale-down", borderRadius: 8, border: "1px solid #ddd", display: "block" }} />
          ) : (
            <div style={{ width: "100%", height: 460, border: "2px dashed #ccc", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", color: "#999", fontSize: 13 }}>
              לא הועלתה תמונה
            </div>
          )}
        </div>

        {/* תמונות מפסקים */}
        {existingWithPhotos.length > 0 && (
          <div style={{ width: 280, flexShrink: 0 }}>
            <div style={{ fontSize: 13, fontWeight: "bold", color: B, marginBottom: 8 }}>תמונות מפסקים קיימים</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {existingWithPhotos.map(c => (
                <div key={c.id}>
                  <div style={{ fontSize: 11, color: "#666", marginBottom: 4 }}>מעגל {c.circuitNumber} — {c.existingBreakerSize}</div>
                  <img src={c.breakerPhoto!} alt={`מפסק ${c.circuitNumber}`} style={{ maxWidth: "100%", maxHeight: 180, objectFit: "scale-down", borderRadius: 6, border: "1px solid #ddd", display: "block" }} />
                </div>
              ))}
            </div>
          </div>
        )}
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
        <FooterCell l1="שם לוח" v1={info.panelName} l2="מיקום" v2={info.location} />
        <FooterCell l1="תאריך" v1={dateStr} l2="מס׳ עמוד" v2={`${pageNum} / ${totalPages}`} />
        <div style={{ textAlign: "center", display: "flex", flexDirection: "column", justifyContent: "center", gap: 2 }}>
          <div style={{ fontSize: 10, color: "#666" }}>סוג מסמך</div>
          <div style={{ fontSize: 12, fontWeight: "bold", color: B }}>תמונות</div>
        </div>
      </div>
    </div>
  );
};
