import { Card, CardContent, CardHeader } from "./ui/card";
import { Separator } from "./ui/separator";
import { Skeleton } from "./ui/skeleton";

export default function OGPreviewSkeleton() {
  return (
    <Card className="w-full max-w-md h-full flex flex-col overflow-hidden">
      <CardHeader className="pb-3 shrink-0">
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-4 w-full mt-1" />
        <Skeleton className="h-4 w-2/3 mt-1" />
      </CardHeader>
      <Separator className="shrink-0" />
      <CardContent className="flex flex-col gap-3 pt-3 overflow-auto">
        <div className="rounded-md">
          <Skeleton className="h-[200px] w-full" />
        </div>
        <div className="shrink-0 mt-auto">
          <Skeleton className="h-9 w-full" />
        </div>
      </CardContent>
    </Card>
  );
}
