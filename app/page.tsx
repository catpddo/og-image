import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import OGForm from "@/components/og-form";

interface HomeProps {
  searchParams: Promise<{
    secret: string;
  }>;
}

export default async function Home({ searchParams }: HomeProps) {
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
    <div className="w-full h-full min-w-svw min-h-svh flex justify-center items-center bg-muted">
      <Card className="w-full max-w-md min-h-1/3">
        <CardHeader>
          <CardTitle>OG卡片生成器</CardTitle>
          <CardDescription>生成 OG 卡片便于社交媒体分享</CardDescription>
        </CardHeader>
        <Separator />
        <CardContent>
          <OGForm />
        </CardContent>
      </Card>
    </div>
  );
}
