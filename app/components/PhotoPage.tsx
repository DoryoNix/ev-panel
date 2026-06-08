import type { ExistingPanelInfo, PanelCircuit, ExistingCircuit, NewCircuit } from "../types/existingPanel";

type Props = { info: ExistingPanelInfo; circuits: PanelCircuit[]; pageNum: number; totalPages: number };

const B = "#1a3a5c";
const FONT = "'David', 'Arial Hebrew', 'Noto Sans Hebrew', Arial, sans-serif";

const FooterCell = ({ l1, v1, l2, v2 }: { l1: string; v1: string; l2: string; v2: string }) => (
  <div style={{ borderLeft: `1.5px solid ${B}`, textAlign: "center", display: "flex", flexDirection: "column", justifyContent: "center", gap: 2, padding: "4px 8px" }}>
    <div style={{ fontSize: 10, color: "#666" }}>{l1}</div><div style={{ fontSize: 12, fontWeight: "bold", color: B }}>{v1 || "-"}</div>
    <div style={{ fontSize: 10, color: "#666" }}>{l2}</div><div style={{ fontSize: 12, fontWeight: "bold", color: B }}>{v2 || "-"}</div>
  </div>
);

const Thumb = ({ src, height=220 }: { src: string; height?: number }) => (
  <div style={{ border: "1px solid #d6dde6", borderRadius: 8, padding: 6, background: "#fff", height, boxSizing: "border-box", display: "flex", flexDirection: "column" }}>
        <div style={{ flex: 1, height: height-20, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", backgroundColor: "#fff" }}>
      <img src={src} alt="תמונה" style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }} />
    </div>
  </div>
);

const Section = ({ title, photos }: { title: string; photos: { photo: string; label: string }[] }) => {
  if (!photos.length) return null;
  return (
    <div style={{ minHeight: 0 }}>
      <div style={{ fontSize: 13, fontWeight: "bold", color: B, marginBottom: 8 }}>{title}</div>
      {(() => {
        const count = photos.length;
        const cols = count === 1 ? "1fr" : count === 2 ? "1fr 1fr" : "1fr 1fr";
        const h = count === 1 ? 340 : count <= 4 ? 220 : 160;
        return (
          <div style={{ display: "grid", gridTemplateColumns: cols, gap: 8 }}>
            {photos.map((p, i) => <Thumb key={i} src={p.photo} height={h} />)}
          </div>
        );
      })()}
    </div>
  );
};

export const PhotoPage = ({ info, circuits, pageNum, totalPages }: Props) => {
  const panelPhotos = (info.panelPhotos?.length ? info.panelPhotos : (info.panelPhoto ? [info.panelPhoto] : [])).map((photo, i) => ({ photo, label: `לוח קיים ${i + 1}` }));
  const mainBreakerPhotos = (info.mainBreakerPhotos || []).map((photo, i) => ({ photo, label: `מפסק ראשי ${i + 1}` }));
  const breakerPhotos = circuits.flatMap(c => !c.isNew ? (((c as ExistingCircuit).breakerPhotos?.length ? (c as ExistingCircuit).breakerPhotos : ((c as ExistingCircuit).breakerPhoto ? [(c as ExistingCircuit).breakerPhoto!] : [])).map((photo, i) => ({ photo, label: `מפסק מעגל ${(c as ExistingCircuit).circuitNumber || c.id}${i ? ` (${i + 1})` : ""}` }))) : []);
  const installPhotos = circuits.flatMap(c => c.isNew && (c as NewCircuit).installPhoto ? [{ photo: (c as NewCircuit).installPhoto!, label: `מקום להשתלת מפסק ${(c as NewCircuit).circuitName || c.id}` }] : []);
  const sections = [
    { title: "תמונות הלוח הקיים", photos: panelPhotos },
    { title: "תמונות מפסק ראשי", photos: mainBreakerPhotos },
    { title: "תמונות מפסקים קיימים", photos: breakerPhotos },
    { title: "תמונות מקום להשתלה", photos: installPhotos },
  ].filter(s => s.photos.length);
  const dateStr = new Date(info.date).toLocaleDateString("he-IL");

  if (!sections.length) return null;

  return (
    <div className="pdf-page" style={{ width: 1100, height: 700, border: "2.5px solid #000", backgroundColor: "#fff", boxSizing: "border-box", display: "flex", flexDirection: "column", direction: "rtl", fontFamily: FONT }}>
      <div style={{ display: "grid", gridTemplateColumns: "280px 1fr 280px", height: 90, borderBottom: "1.5px solid #000", flexShrink: 0, backgroundColor: "#f5f7fa" }}>
        <div style={{ borderRight: "1px solid #000", fontSize: 12, lineHeight: 1.8, padding: "6px 10px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div><span style={{ color: "#666", fontSize: 10 }}>לקוח: </span><strong style={{ color: B }}>{info.customerName || "-"}</strong></div>
          <div><span style={{ color: "#666", fontSize: 10 }}>פרויקט: </span><strong style={{ color: B }}>{info.projectName || "-"}</strong></div>
          <div><span style={{ color: "#666", fontSize: 10 }}>לוח: </span><strong style={{ color: B }}>{info.panelName || "-"}</strong></div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", borderRight: "1px solid #000" }}>
          <div style={{ fontSize: 22, fontWeight: "bold", color: B }}>תמונות לוח ומיקום התקנה</div>
          <div style={{ fontSize: 11, color: "#555" }}>{info.panelName || "-"} | {info.location || "-"}</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}><img src="/logo.svg" alt="Doryonix" style={{ width: 150 }} /></div>
      </div>

      <div style={{ flex: 1, padding: "14px 18px", display: "grid", gridTemplateColumns: sections.length === 1 ? "1fr" : "1fr 1fr", gap: 16, overflow: "hidden" }}>
        {sections.slice(0, 4).map((s, i) => <Section key={i} title={s.title} photos={s.photos} />)}
      </div>

      <div style={{ height: 95, borderTop: `2px solid ${B}`, display: "grid", gridTemplateColumns: "160px 1fr 1fr 1fr 160px", direction: "rtl", backgroundColor: "#fff", flexShrink: 0, fontFamily: FONT }}>
        <div style={{ borderLeft: `1.5px solid ${B}`, display: "flex", alignItems: "center", justifyContent: "center", padding: 6 }}><img src="/logo.svg" alt="Doryonix" style={{ width: 120 }} /></div>
        <FooterCell l1="שם לקוח" v1={info.customerName} l2="שם פרויקט" v2={info.projectName} />
        <FooterCell l1="שם לוח" v1={info.panelName} l2="מיקום" v2={info.location} />
        <FooterCell l1="תאריך" v1={dateStr} l2="מס׳ עמוד" v2={`${pageNum} / ${totalPages}`} />
        <div style={{ textAlign: "center", display: "flex", flexDirection: "column", justifyContent: "center", gap: 2 }}><div style={{ fontSize: 10, color: "#666" }}>סוג מסמך</div><div style={{ fontSize: 12, fontWeight: "bold", color: B }}>תמונות</div></div>
      </div>
    </div>
  );
};
