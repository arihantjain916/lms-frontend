import { Skeleton } from "@/components/ui/skeleton";

export default function WebinarsLoading() {
  return (
    <div className="min-h-screen bg-background">
      {/* Page Header Skeleton */}
      <section className="bg-blue-50 py-8 md:py-12 border-b">
        <div className="container">
          <Skeleton className="h-4 w-32 mb-4" />
          <Skeleton className="h-10 w-64 mb-2" />
          <Skeleton className="h-5 w-96" />
        </div>
      </section>

      {/* Search Bar Skeleton */}
      <section className="py-6 border-b">
        <div className="container">
          <div className="flex flex-col md:flex-row gap-4">
            <Skeleton className="h-10 flex-1" />
            <Skeleton className="h-10 w-48" />
          </div>
        </div>
      </section>

      {/* Featured Webinars Skeleton */}
      <section className="py-8 md:py-12">
        <div className="container">
          <Skeleton className="h-8 w-48 mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {Array(2)
              .fill(0)
              .map((_, index) => (
                <div key={index} className="border rounded-lg overflow-hidden">
                  <div className="flex flex-col md:flex-row">
                    <Skeleton className="h-[200px] md:w-2/5" />
                    <div className="p-6 flex-1">
                      <Skeleton className="h-6 w-24 mb-2" />
                      <Skeleton className="h-8 w-full mb-2" />
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-3/4 mb-4" />
                      <div className="flex flex-col gap-2 mb-4">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-4 w-40" />
                        <Skeleton className="h-4 w-36" />
                      </div>
                      <div className="flex gap-2 mb-4">
                        <div className="flex items-center gap-2">
                          <Skeleton className="h-8 w-8 rounded-full" />
                          <div>
                            <Skeleton className="h-4 w-32 mb-1" />
                            <Skeleton className="h-3 w-24" />
                          </div>
                        </div>
                      </div>
                      <Skeleton className="h-10 w-full" />
                    </div>
                  </div>
                </div>
              ))}
          </div>

          {/* All Webinars Skeleton */}
          <Skeleton className="h-8 w-48 mb-6" />
          <div className="grid grid-cols-1 gap-6">
            {Array(4)
              .fill(0)
              .map((_, index) => (
                <div key={index} className="border rounded-lg overflow-hidden">
                  <div className="flex flex-col md:flex-row">
                    <Skeleton className="h-[200px] md:w-1/4" />
                    <div className="p-6 flex-1">
                      <div className="flex gap-2 mb-2">
                        <Skeleton className="h-6 w-24" />
                        <Skeleton className="h-6 w-24" />
                      </div>
                      <Skeleton className="h-8 w-full mb-2" />
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-3/4 mb-4" />
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                      </div>
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex gap-2">
                          <Skeleton className="h-8 w-8 rounded-full" />
                          <div>
                            <Skeleton className="h-4 w-32 mb-1" />
                            <Skeleton className="h-3 w-24" />
                          </div>
                        </div>
                        <Skeleton className="h-10 w-32" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>

          {/* Pagination Skeleton */}
          <div className="flex justify-center mt-12">
            <div className="flex items-center gap-2">
              <Skeleton className="h-10 w-10 rounded-md" />
              <Skeleton className="h-10 w-10 rounded-md" />
              <Skeleton className="h-10 w-10 rounded-md" />
              <Skeleton className="h-10 w-10 rounded-md" />
              <Skeleton className="h-10 w-10 rounded-md" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
