import { Skeleton } from "@/components/ui/skeleton";
import { Search } from "lucide-react";

export default function SearchLoading() {
  return (
    <div className="container py-8">
      <Skeleton className="h-10 w-48 mb-6" />

      {/* Search form skeleton */}
      <div className="relative mb-8">
        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <Skeleton className="h-14 w-full" />
      </div>

      {/* Results summary skeleton */}
      <div className="flex justify-between items-center mb-6">
        <Skeleton className="h-5 w-48" />
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-[180px]" />
          <Skeleton className="h-10 w-24" />
        </div>
      </div>

      <div className="space-y-8">
        {/* Courses section skeleton */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <Skeleton className="h-7 w-32" />
            <Skeleton className="h-5 w-20" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2].map((i) => (
              <div key={i} className="border rounded-lg overflow-hidden">
                <Skeleton className="w-full aspect-video" />
                <div className="p-4">
                  <Skeleton className="h-6 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-3" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tutorials section skeleton */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <Skeleton className="h-7 w-32" />
            <Skeleton className="h-5 w-20" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2].map((i) => (
              <div key={i} className="border rounded-lg overflow-hidden">
                <Skeleton className="w-full aspect-video" />
                <div className="p-4">
                  <Skeleton className="h-6 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-3" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
