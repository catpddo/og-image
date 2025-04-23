import { Card, CardContent, CardHeader } from "./ui/card";
import { Separator } from "./ui/separator";
import { Skeleton } from "./ui/skeleton";

export default function OGPreviewSkeleton() {
  return (
    <Card className="w-full max-w-md min-h-1/3">
      <CardHeader>
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3 mt-1" />
      </CardHeader>
      <Separator />
      <CardContent>
        <Skeleton className="h-[300px] w-full mb-4" />
        <Skeleton className="h-9 w-24" />
      </CardContent>
    </Card>
  );
}
