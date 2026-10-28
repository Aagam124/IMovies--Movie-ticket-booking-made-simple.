export default function SkeletonCard() {
  return (
    <div className="im-card im-skeleton-card" aria-hidden="true">
      <div className="im-poster-wrap im-skeleton-box" />
      <div className="im-card-body">
        <div className="im-skeleton-line im-skeleton-title" />
        <div className="im-skeleton-line im-skeleton-sub" />
        <div className="im-skeleton-line im-skeleton-meta" />
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 8 }) {
  return (
    <div className="im-grid" aria-label="Loading movies…">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
