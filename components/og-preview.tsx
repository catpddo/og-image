import { getCloudflareContext } from "@opennextjs/cloudflare";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "./ui/card";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import Link from "next/link";
interface OGPreviewProps {
  id: string;
}

export default async function OGPreview({ id }: OGPreviewProps) {
  const {
    env: { OG_IMAGE_CACHE },
  } = await getCloudflareContext({ async: true });
  const cache = await OG_IMAGE_CACHE.get(id);
  if (!cache) {
    return (
      <Card className="w-full max-w-md min-h-1/3">
        <CardHeader>
          <CardTitle>404</CardTitle>
          <CardDescription>OG Preview not found</CardDescription>
        </CardHeader>
        <Separator />
        <CardContent>
          <p className="text-center text-muted-foreground">
            您访问的页面不存在，请检查您输入的链接是否正确
          </p>
        </CardContent>
      </Card>
    );
  }
  const info = JSON.parse(cache);
  const { title, description, image, url } = info;

  return (
    <Card className="w-full max-w-md min-h-1/3">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <Separator />
      <CardContent>
        <img src={image} alt={title} className="w-full h-full object-cover" />
        <Link href={url} target="_blank">
          <Button>前往查看</Button>
        </Link>
      </CardContent>
    </Card>
  );
}
