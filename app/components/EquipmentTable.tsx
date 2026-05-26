import type { EquipmentItem, ProjectInfo } from "../types";

type Props = {
  info: ProjectInfo;
  pageItems: EquipmentItem[];
  pageNum: number;
  totalPages: number;
  totalItems: number;
  totalUnits: number;
};

// צבעי Doryonix
const BRAND_DARK = "#1a3a5c";   // כחול כהה
const BRAND_MID  = "#e8eff7";   // כחול בהיר — שורות זוגיות
const BRAND_HEAD = "#1a3a5c";   // כותרת טבלה

const cell: React.CSSProperties = { border: "1px solid #c5d0dc", padding: "6px 8px" };
const th: React.CSSProperties   = { ...cell, backgroundColor: BRAND_HEAD, color: "#fff", padding: "9px 10px", fontWeight: 600 };

export const EquipmentTablePage = ({
  info, pageItems, pageNum, totalPages, totalItems, totalUnits,
}: Props) => (
  <div
    className="pdf-page"
    style={{
      width: 1100, height: 700,
      border: "2.5px solid #000",
      backgroundColor: "#fff",
      position: "relative",
      boxSizing: "border-box",
      padding: 22,
      marginTop: 24,
      direction: "ltr",
      color: "#000",
    }}
  >
    {/* Header */}
    <div style={{
      display: "grid",
      gridTemplateColumns: "260px 1fr 260px",
      alignItems: "center",
      height: 100,
      borderBottom: `2px solid ${BRAND_DARK}`,
    }}>
      <div style={{ direction: "rtl", textAlign: "right", fontSize: 13, lineHeight: 2, paddingLeft: 18 }}>
        <div>לקוח: <strong>{info.customerName || "-"}</strong></div>
        <div>פרויקט: <strong>{info.projectName || "-"}</strong></div>
        <div>לוח: <strong>{info.panelName || "-"}</strong></div>
      </div>
      <div style={{ textAlign: "center", fontSize: 26, fontWeight: "bold", direction: "rtl", color: BRAND_DARK }}>
        רשימת ציוד ללוח
      </div>
      <div style={{ textAlign: "center" }}>
        <img src="/logo.svg" alt="Doryonix Logo" style={{ width: 175, height: "auto", display: "inline-block" }} />
      </div>
    </div>

    {/* Table */}
    <table style={{
      width: "92%", marginRight: "auto", marginLeft: "auto",
      borderCollapse: "collapse", marginTop: 18, fontSize: 14, direction: "rtl",
    }}>
      <thead>
        <tr>
          <th style={{ ...th, width: 50, textAlign: "center" }}>מס׳</th>
          <th style={th}>פריט</th>
          <th style={{ ...th, width: 80, textAlign: "center" }}>כמות</th>
          <th style={{ ...th, width: 250 }}>הערות</th>
        </tr>
      </thead>
      <tbody>
        {pageItems.map((item, i) => (
          <tr key={`${item.item}-${i}`}
            style={{ backgroundColor: i % 2 === 0 ? "#fff" : BRAND_MID }}>
            <td style={{ ...cell, textAlign: "center" }}>{i + 1}</td>
            <td style={cell}>{item.item}</td>
            <td style={{ ...cell, textAlign: "center", fontWeight: "bold" }}>{item.qty}</td>
            <td style={cell}>{item.notes}</td>
          </tr>
        ))}
      </tbody>
      <tfoot>
        <tr style={{ backgroundColor: BRAND_DARK, color: "#fff", fontWeight: "bold" }}>
          <td colSpan={2} style={{ ...cell, border: "1px solid #fff", textAlign: "center" }}>סה״כ סוגי פריטים</td>
          <td style={{ ...cell, border: "1px solid #fff", textAlign: "center" }}>{totalItems}</td>
          <td style={{ ...cell, border: "1px solid #fff" }} />
        </tr>
        <tr style={{ backgroundColor: BRAND_DARK, color: "#fff", fontWeight: "bold" }}>
          <td colSpan={2} style={{ ...cell, border: "1px solid #fff", textAlign: "center" }}>סה״כ יחידות</td>
          <td style={{ ...cell, border: "1px solid #fff", textAlign: "center" }}>{totalUnits}</td>
          <td style={{ ...cell, border: "1px solid #fff" }} />
        </tr>
      </tfoot>
    </table>

    {/* Footer — גובה קבוע 72px כדי שלא ייחתך */}
    <div style={{
      position: "absolute", left: 0, right: 0, bottom: 0, height: 82,
      borderTop: `2px solid ${BRAND_DARK}`,
      display: "grid",
      gridTemplateColumns: "160px 1fr 1fr 1fr 1fr 160px",
      direction: "rtl",
      backgroundColor: "#fff",
    }}>
      {/* לוגו */}
      <div style={{ borderLeft: `1.5px solid ${BRAND_DARK}`, display: "flex", alignItems: "center", justifyContent: "center", padding: 6 }}>
        <img src="/logo.svg" alt="Doryonix Logo" style={{ width: 120 }} />
      </div>

      {/* לקוח + פרויקט */}
      <FooterCell label1="שם לקוח" val1={info.customerName} label2="שם פרויקט" val2={info.projectName} />

      {/* לוח + שיטת הגנה */}
      <FooterCell label1="שם לוח" val1={info.panelName} label2="שיטת הגנה" val2={info.earthingSystem} />

      {/* ארון */}
      <FooterCell label1="חומר ארון" val1={info.panelMaterial} label2="התקנה" val2={info.panelInstallation} />

      {/* תאריך + עמוד */}
      <FooterCell
        label1="תאריך"
        val1={new Date(info.date).toLocaleDateString("he-IL")}
        label2="מס׳ עמוד"
        val2={`${pageNum} / ${totalPages}`}
      />

      {/* סוג מסמך */}
      <div style={{ textAlign: "center", display: "flex", flexDirection: "column", justifyContent: "center", gap: 2 }}>
        <div style={{ fontSize: 12, color: "#666" }}>סוג מסמך</div>
        <div style={{ fontSize: 12, fontWeight: "bold", color: BRAND_DARK }}>רשימת ציוד</div>
      </div>
    </div>
  </div>
);

const FooterCell = ({ label1, val1, label2, val2 }: { label1: string; val1: string; label2: string; val2: string }) => (
  <div style={{
    borderLeft: "1.5px solid #1a3a5c",
    textAlign: "center",
    display: "flex", flexDirection: "column", justifyContent: "center", gap: 2, padding: "4px 6px",
  }}>
    <div style={{ fontSize: 12, color: "#666" }}>{label1}</div>
    <div style={{ fontSize: 12, fontWeight: "bold", color: "#1a3a5c" }}>{val1 || "-"}</div>
    <div style={{ fontSize: 12, color: "#666" }}>{label2}</div>
    <div style={{ fontSize: 12, fontWeight: "bold", color: "#1a3a5c" }}>{val2 || "-"}</div>
  </div>
);
