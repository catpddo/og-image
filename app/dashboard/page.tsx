import OGListContent from "@/components/og-list";
import OGListSkeleton from "@/components/og-list-skeleton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { Suspense } from "react";

interface DashboardPageProps {
  searchParams: Promise<{
    secret: string;
  }>;
}
export default async function DashboardPage({
  searchParams,
}: DashboardPageProps) {
  const {
    env: { ACCESS_SECRET },
  } = await getCloudflareContext({ async: true });
  const { secret } = await searchParams;
  if (secret !== ACCESS_SECRET) {
    return (
      <div className="w-full h-full min-w-svw min-h-svh flex justify-center items-center bg-muted">
        <Card className="w-full max-w-md min-h-1/3">
          <CardHeader>
            <CardTitle>401</CardTitle>
            <CardDescription>很抱歉，您没有权限访问此页面</CardDescription>
          </CardHeader>
          <Separator />
          <CardContent>
            <p className="text-center text-muted-foreground">
              很抱歉，您没有权限访问此页面
            </p>
            <p className="text-center text-muted-foreground">
              请确认您的密钥是否正确
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full h-full min-w-svw min-h-svh max-h-svh flex justify-center items-center bg-muted p-5">
      <Suspense fallback={<OGListSkeleton />}>
        <OGListContent />
      </Suspense>
    </div>
  );
}
