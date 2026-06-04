interface CourseBadgeRowProps {
  badges: string[];
}

export default function CourseBadgeRow({ badges }: CourseBadgeRowProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {badges.map(badge => (
        <span key={badge} className="badge-accent">{badge}</span>
      ))}
    </div>
  );
}
