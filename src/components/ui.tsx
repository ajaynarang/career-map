"use client";

interface InfoCardProps {
  label: string;
  value: string;
  color?: string;
}

export function InfoCard({ label, value, color }: InfoCardProps) {
  return (
    <div className="p-3 bg-white/[0.025] border border-white/[0.05] rounded-lg flex-1 min-w-[200px]">
      <div className="text-[10px] text-gray-500 mb-1 uppercase tracking-wider">{label}</div>
      <div className="text-[13px] leading-relaxed" style={{ color: color || "#ccc" }}>{value}</div>
    </div>
  );
}

interface SectionProps {
  title: string;
  color?: string;
  children: React.ReactNode;
}

export function Section({ title, color, children }: SectionProps) {
  return (
    <div className="mb-6">
      <h3
        className="text-[13px] font-semibold mb-2.5 uppercase tracking-wider"
        style={{ color: color || "#fff" }}
      >
        {title}
      </h3>
      {children}
    </div>
  );
}

export function TextBlock({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[13px] text-gray-400 leading-7 p-3 bg-white/[0.025] rounded-lg">
      {children}
    </p>
  );
}
