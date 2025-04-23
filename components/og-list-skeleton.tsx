import { Skeleton } from "./ui/skeleton";
import { Card, CardContent, CardHeader } from "./ui/card";

export default function OGListSkeleton() {
  return (
    <Card className="w-full">
      <CardHeader>
        <Skeleton className="h-6 w-44 mb-2" />
        <Skeleton className="h-4 w-full max-w-md" />
      </CardHeader>
      <CardContent
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-scroll max-h-[calc(100vh-10rem)] p-5"
      >
        {Array.from({ length: 6 }).map((_, index) => (
          <Card key={index} className="overflow-hidden">
            <CardHeader className="pb-2">
              <Skeleton className="h-5 w-4/5 mb-1" />
              <Skeleton className="h-3 w-2/3" />
            </CardHeader>
            <CardContent className="pb-3 space-y-4">
              <Skeleton className="h-40 w-full rounded-md" />
              <div className="flex items-center gap-2 mt-2">
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-3 w-full" />
              </div>
            </CardContent>
            <div className="p-3 pt-0 flex justify-between border-t gap-2">
              <Skeleton className="h-4 w-24" />
              <div className="flex gap-2">
                <Skeleton className="h-8 w-8 rounded-md" />
                <Skeleton className="h-8 w-8 rounded-md" />
              </div>
            </div>
          </Card>
        ))}
      </CardContent>
    </Card>
  );
} 