import type { ProjectInfo } from "../types";

type Props = {
  info: ProjectInfo;
  pageNum: number;
  totalPages: number;
  docType: string;
};

const BRAND = "#1a3a5c";

export const DiagramFooter = ({ info, pageNum, totalPages, docType }: Props) => (
  <g>
    {/* מסגרת כותרת תחתית */}
    <rect x={8} y={610} width={1084} height={82} fill="white" stroke="black" strokeWidth={2} />

    {/* קווים מפרידים */}
    {[190, 380, 570, 760, 930].map((x) => (
      <line key={x} x1={x} y1={610} x2={x} y2={692} stroke="black" strokeWidth={1.5} />
    ))}

    {/* לוגו */}
    {info.logoChoice === "edgecontrol" ? (
      <>
        <text x={1010} y={624} textAnchor="middle" fontSize={7} fill="#888">Powered & built by DORYONIX</text>
        <image href="/edgecontrol_logo.svg" x={935} y={628} width={150} height={46} />
      </>
    ) : (
      <image href="/logo.svg" x={935} y={616} width={150} height={58} />
    )}

    {/* לקוח */}
    <text x={845} y={628} textAnchor="middle" fontSize={10} fill="#666">שם לקוח</text>
    <text x={845} y={644} textAnchor="middle" fontSize={12} fontWeight="bold" fill={BRAND}>{info.customerName || "-"}</text>
    <text x={845} y={660} textAnchor="middle" fontSize={10} fill="#666">שם פרויקט</text>
    <text x={845} y={676} textAnchor="middle" fontSize={12} fontWeight="bold" fill={BRAND}>{info.projectName || "-"}</text>

    {/* לוח + הגנה */}
    <text x={665} y={628} textAnchor="middle" fontSize={10} fill="#666">שם לוח</text>
    <text x={665} y={644} textAnchor="middle" fontSize={12} fontWeight="bold" fill={BRAND}>{info.panelName || "-"}</text>
    <text x={665} y={660} textAnchor="middle" fontSize={10} fill="#666">שיטת הגנה</text>
    <text x={665} y={676} textAnchor="middle" fontSize={12} fontWeight="bold" fill={BRAND}>{info.earthingSystem}</text>

    {/* ארון */}
    <text x={475} y={628} textAnchor="middle" fontSize={10} fill="#666">חומר ארון</text>
    <text x={475} y={644} textAnchor="middle" fontSize={12} fontWeight="bold" fill={BRAND}>{info.panelMaterial}</text>
    <text x={475} y={660} textAnchor="middle" fontSize={10} fill="#666">התקנה</text>
    <text x={475} y={676} textAnchor="middle" fontSize={12} fontWeight="bold" fill={BRAND}>{info.panelInstallation}</text>

    {/* כניסת כבילה + נעילה */}
    <text x={285} y={628} textAnchor="middle" fontSize={10} fill="#666">כניסת כבילה</text>
    <text x={285} y={644} textAnchor="middle" fontSize={12} fontWeight="bold" fill={BRAND}>{info.panelCabling}</text>
    <text x={285} y={660} textAnchor="middle" fontSize={10} fill="#666">נעילה</text>
    <text x={285} y={676} textAnchor="middle" fontSize={12} fontWeight="bold" fill={BRAND}>{info.panelLock}</text>

    {/* תאריך + עמוד + סוג */}
    <text x={100} y={622} textAnchor="middle" fontSize={10} fill="#666">תאריך</text>
    <text x={100} y={638} textAnchor="middle" fontSize={11} fontWeight="bold" fill={BRAND}>
      {new Date(info.date).toLocaleDateString("he-IL")}
    </text>
    <text x={100} y={655} textAnchor="middle" fontSize={10} fill="#666">מס׳ עמוד</text>
    <text x={100} y={671} textAnchor="middle" fontSize={11} fontWeight="bold" fill={BRAND}>
      {pageNum} / {totalPages}
    </text>
    <text x={100} y={685} textAnchor="middle" fontSize={9} fill="#666">{docType}</text>
  </g>
);
