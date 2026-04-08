interface SkeletonProps {
  className?: string;
  count?: number;
}

export function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`animate-pulse rounded bg-black/10 dark:bg-white/10 ${className}`} />
  );
}

export function CardSkeleton() {
  return (
    <div className="space-y-3 overflow-hidden rounded-xl border border-subtle bg-card p-4">
      <Skeleton className="h-48 w-full rounded-lg" />
      <Skeleton className="h-5 w-2/3" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-4/5" />
    </div>
  );
}

export function CardGridSkeleton({ count = 6 }: SkeletonProps) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => <CardSkeleton key={i} />)}
    </div>
  );
}

export function MenuGridSkeleton({ count = 8 }: SkeletonProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-2xl overflow-hidden border border-subtle bg-card p-4 space-y-4">
          <Skeleton className="h-64 w-full rounded-xl" />
          <div className="space-y-3">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-11 w-full rounded-xl" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function TestimonialGridSkeleton({ count = 3 }: SkeletonProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-3xl border border-subtle bg-card p-8 space-y-5">
          <div className="flex gap-2">
            {Array.from({ length: 5 }).map((__, star) => (
              <Skeleton key={star} className="h-4 w-4 rounded-full" />
            ))}
          </div>
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-11/12" />
          <Skeleton className="h-5 w-4/5" />
          <div className="flex items-center gap-4 pt-3">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-3 w-1/3" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function GalleryGridSkeleton({ count = 6 }: SkeletonProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className="aspect-square w-full rounded-3xl" />
      ))}
    </div>
  );
}
