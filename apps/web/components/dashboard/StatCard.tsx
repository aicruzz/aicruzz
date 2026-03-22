interface StatCardProps {
  label: string;
  value: string | number;
  sub?: string;
  fillPercent?: number;
  fillStyle?: React.CSSProperties;
}

export default function StatCard({ label, value, sub, fillPercent = 0, fillStyle }: StatCardProps) {
  return (
    <div className="db-stat-card">
      <div className="db-stat-lbl">{label}</div>
      <div className="db-stat-val">{value}</div>
      <div className="db-stat-bar">
        <div
          className="db-stat-fill"
          style={{ width: `${Math.min(fillPercent, 100)}%`, ...(fillStyle || {}) }}
        />
      </div>
      {sub && <div className="db-stat-sub">{sub}</div>}
    </div>
  );
}
