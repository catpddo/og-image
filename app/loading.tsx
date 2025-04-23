import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="w-full h-full min-w-svw min-h-svh flex justify-center items-center bg-muted">
      <Card className="w-full max-w-md min-h-1/3">
        <CardHeader>
          <CardTitle>加载中...</CardTitle>
          <CardDescription>请稍候，正在处理您的请求</CardDescription>
        </CardHeader>
        <Separator />
        <CardContent className="flex flex-col items-center justify-center gap-6 py-6">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <div className="space-y-4 w-full">
            <Skeleton className="h-8 w-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/6" />
            </div>
            <div className="pt-4 flex justify-end">
              <Skeleton className="h-9 w-24" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
