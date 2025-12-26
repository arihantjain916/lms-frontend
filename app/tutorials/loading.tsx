import { Skeleton } from "@/components/ui/skeleton"

export default function TutorialsLoading() {
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
            <div className="flex gap-2">
              <Skeleton className="h-10 w-20" />
              <Skeleton className="h-10 w-24" />
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Skeleton */}
      <section className="py-8 md:py-12">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Filters Skeleton */}
            <div className="hidden lg:block">
              <div className="border rounded-lg overflow-hidden">
                <Skeleton className="h-12 w-full" />
                <div className="p-4 space-y-6">
                  <div>
                    <Skeleton className="h-5 w-32 mb-3" />
                    <div className="space-y-2">
                      <Skeleton className="h-6 w-full" />
                      <Skeleton className="h-6 w-full" />
                      <Skeleton className="h-6 w-full" />
                    </div>
                  </div>
                  <div>
                    <Skeleton className="h-5 w-32 mb-3" />
                    <div className="space-y-2">
                      <Skeleton className="h-6 w-full" />
                      <Skeleton className="h-6 w-full" />
                      <Skeleton className="h-6 w-full" />
                      <Skeleton className="h-6 w-full" />
                    </div>
                  </div>
                  <Skeleton className="h-10 w-full mt-4" />
                </div>
              </div>
            </div>

            {/* Tutorials Grid Skeleton */}
            <div className="lg:col-span-3">
              <Skeleton className="h-8 w-48 mb-6" />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                {Array(3)
                  .fill(0)
                  .map((_, index) => (
                    <div key={index}>
                      <Skeleton className="h-[180px] w-full rounded-t-lg" />
                      <div className="p-5 border border-t-0 rounded-b-lg">
                        <div className="flex justify-between mb-2">
                          <Skeleton className="h-6 w-24" />
                          <Skeleton className="h-6 w-16" />
                        </div>
                        <Skeleton className="h-6 w-full mb-2" />
                        <Skeleton className="h-6 w-3/4 mb-2" />
                        <Skeleton className="h-4 w-full mb-3" />
                        <div className="flex justify-between mb-4">
                          <Skeleton className="h-4 w-20" />
                          <Skeleton className="h-4 w-24" />
                        </div>
                        <Skeleton className="h-px w-full mb-4" />
                        <div className="flex justify-between">
                          <div className="flex items-center gap-2">
                            <Skeleton className="h-8 w-8 rounded-full" />
                            <Skeleton className="h-4 w-24" />
                          </div>
                          <Skeleton className="h-8 w-16" />
                        </div>
                      </div>
                    </div>
                  ))}
              </div>

              <Skeleton className="h-8 w-32 mb-6" />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array(6)
                  .fill(0)
                  .map((_, index) => (
                    <div key={index}>
                      <Skeleton className="h-[180px] w-full rounded-t-lg" />
                      <div className="p-5 border border-t-0 rounded-b-lg">
                        <div className="flex justify-between mb-2">
                          <Skeleton className="h-6 w-24" />
                          <Skeleton className="h-6 w-16" />
                        </div>
                        <Skeleton className="h-6 w-full mb-2" />
                        <Skeleton className="h-6 w-3/4 mb-2" />
                        <Skeleton className="h-4 w-full mb-3" />
                        <div className="flex justify-between mb-4">
                          <Skeleton className="h-4 w-20" />
                          <Skeleton className="h-4 w-24" />
                        </div>
                        <Skeleton className="h-px w-full mb-4" />
                        <div className="flex justify-between">
                          <div className="flex items-center gap-2">
                            <Skeleton className="h-8 w-8 rounded-full" />
                            <Skeleton className="h-4 w-24" />
                          </div>
                          <Skeleton className="h-8 w-16" />
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
