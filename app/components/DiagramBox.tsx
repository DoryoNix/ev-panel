type Props = {
  cx: number;
  y: number;
  minWidth: number;
  height: number;
  title: string;
  line1?: string;
  line2?: string;
  line3?: string;
};

/** תיבה גנרית בתרשים החד-קווי */
export const DiagramBox = ({ cx, y, minWidth, height, title, line1 = "", line2 = "", line3 = "" }: Props) => {
  const longest = [title, line1, line2, line3].reduce(
    (a, b) => (b.length > a.length ? b : a),
    ""
  );
  const w = Math.max(minWidth, longest.length * 7 + 24);
  const x = cx - w / 2;

  return (
    <g>
      <rect x={x} y={y} width={w} height={height} rx={6} fill="#fff" stroke="#000" strokeWidth={1.8} />
      <line x1={x} y1={y + 24} x2={x + w} y2={y + 24} stroke="#000" strokeWidth={1} />
      <text x={cx} y={y + 16} textAnchor="middle" fontSize={10} fontWeight="bold">{title}</text>
      {line1 && <text x={cx} y={y + 42} textAnchor="middle" fontSize={12}>{line1}</text>}
      {line2 && <text x={cx} y={y + 58} textAnchor="middle" fontSize={12}>{line2}</text>}
      {line3 && <text x={cx} y={y + 74} textAnchor="middle" fontSize={12}>{line3}</text>}
    </g>
  );
};
