import { getCloudflareContext } from "@opennextjs/cloudflare";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "./ui/card";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import AutoRedirectButton from "./auto-redirect-button";

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
      <Card className="w-full max-w-md h-full overflow-auto max-h-[80svh]">
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
    <Card className="w-full max-w-md h-full flex flex-col max-h-[80svh] overflow-hidden">
      <CardHeader className="pb-3 shrink-0">
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription className="line-clamp-4 mt-1">
          {description}
        </CardDescription>
      </CardHeader>
      <Separator className="shrink-0" />
      <CardContent className="flex flex-col gap-3 pt-3 overflow-auto">
        <img
          src={image}
          alt={title}
          className="w-full h-auto object-cover rounded-md"
        />
      </CardContent>
      <CardFooter>
        <div className="shrink-0 mt-auto">
          {url ? (
            <AutoRedirectButton url={url} />
          ) : (
            <Button disabled>无跳转链接</Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
