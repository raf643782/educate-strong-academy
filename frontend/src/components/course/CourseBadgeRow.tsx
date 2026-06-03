interface CourseBadgeRowProps {
  badges: string[];
}

export default function CourseBadgeRow({ badges }: CourseBadgeRowProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {badges.map((badge) => (
        <span
          key={badge}
          className="inline-block border border-amber-400/40 bg-amber-500/10 text-amber-300 text-xs font-semibold uppercase tracking-wide px-3 py-1 rounded"
        >
          {badge}
        </span>
      ))}
    </div>
  );
}
