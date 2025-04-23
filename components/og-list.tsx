import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import OGItem from "./og-item";
import { OGInfo } from "@/lib/actions/create-og-schema";
import { Button } from "./ui/button";
import Link from "next/link";

// 将OGList组件改为异步函数
async function OGListContent() {
  const {
    env: { OG_IMAGE_CACHE, ACCESS_SECRET },
  } = await getCloudflareContext({ async: true });

  const list = await OG_IMAGE_CACHE.list({
    limit: 100,
  });

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>链接列表</CardTitle>
        <CardDescription>
          您可以在这里查看您生成的所有链接,并进行删除
        </CardDescription>
      </CardHeader>
      <CardContent
        className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-scroll max-h-[calc(100vh-10rem)] p-5 ${
          list.keys.length === 0 ? "flex justify-center items-center" : ""
        }`}
      >
        {list.keys.length === 0 && (
          <div className="flex justify-center items-center h-full w-full flex-col gap-4">
            <p className="text-muted-foreground">您还没有生成任何链接</p>
            <Link href={`/?secret=${ACCESS_SECRET}`}>
              <Button>去生成</Button>
            </Link>
          </div>
        )}
        {list.keys.map(async (item) => {
          const info = await OG_IMAGE_CACHE.get<OGInfo>(item.name, "json");
          if (!info) return null;
          const completeInfo: OGInfo = {
            ...info,
          };
          if (!completeInfo.id) {
            completeInfo.id = item.name;
          }
          return (
            <OGItem
              key={item.name}
              {...completeInfo}
              expiration={item.expiration}
            />
          );
        })}
      </CardContent>
    </Card>
  );
}

export default OGListContent;
