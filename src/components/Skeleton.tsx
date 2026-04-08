interface SkeletonProps {
  className?: string;
  count?: number;
}

export function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-stone-700/50 rounded ${className}`} />
  );
}

export function CardSkeleton() {
  return (
    <div className="rounded-xl overflow-hidden bg-stone-800/50 p-4 space-y-3">
      <Skeleton className="h-48 w-full rounded-lg" />
      <Skeleton className="h-5 w-2/3" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-4/5" />
    </div>
  );
}

export function CardGridSkeleton({ count = 6 }: SkeletonProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => <CardSkeleton key={i} />)}
    </div>
  );
}
