"use client";
import { OGInfo } from "@/lib/actions/create-og-schema";
import { Button } from "./ui/button";
import { Trash2, CopyIcon, ImageIcon, Loader2, PencilIcon } from "lucide-react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { Badge } from "./ui/badge";
import AnimatedCount from "./animated-count";
import { useEffect, useState } from "react";
import { deleteOGAction } from "@/lib/actions/delete-og";
import { useServerAction } from "zsa-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { editOGAction } from "@/lib/actions/edit-og";
import { useRouter } from "next/navigation";
export default function OGItem({
  id,
  title,
  description,
  image,
  url,
  expiration,
}: OGInfo & { expiration?: number }) {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };
  // 添加倒计时状态
  const [remainingTime, setRemainingTime] = useState<number | undefined>(
    expiration
      ? Math.max(0, Math.floor(expiration - Date.now() / 1000))
      : undefined
  );

  // 实现倒计时逻辑
  useEffect(() => {
    if (!remainingTime && remainingTime !== 0) return;

    // 设置倒计时每秒更新一次
    const timer = setInterval(() => {
      if (expiration) {
        const newRemainingTime = Math.max(
          0,
          Math.floor(expiration - Date.now() / 1000)
        );
        setRemainingTime(newRemainingTime);

        // 如果时间到了，清除定时器
        if (newRemainingTime <= 0) {
          clearInterval(timer);
        }
      } else {
        clearInterval(timer);
      }
    }, 1000);

    // 组件卸载时清除定时器
    return () => clearInterval(timer);
  }, [expiration]);

  // 将秒数转换为时:分:秒格式
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return { hours, minutes, secs };
  };

  const router = useRouter();

  const { execute, isPending, isSuccess } = useServerAction(deleteOGAction);

  useEffect(() => {
    if (isSuccess) {
      toast.success("删除成功");
    }
  }, [isSuccess]);

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow duration-300">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold truncate max-w-[80%] overflow-hidden text-ellipsis">
            {title}
          </CardTitle>
          <Badge>{id}</Badge>
        </div>
        {description && (
          <CardDescription className="text-sm line-clamp-2 mt-1">
            {description}
          </CardDescription>
        )}
      </CardHeader>

      <CardContent className="pb-3 space-y-4">
        <div className="relative h-40 w-full overflow-hidden rounded-md bg-muted">
          {image ? (
            <img
              src={image}
              alt={title}
              className="object-cover w-full h-full transition-transform hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
              <div className="flex flex-col items-center text-gray-400">
                <ImageIcon className="h-16 w-16 mb-2 opacity-50" />
                <span className="text-xs">暂无图片</span>
              </div>
            </div>
          )}
        </div>

        {url && (
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="outline" className="text-xs px-2 py-0.5 bg-muted">
              URL
            </Badge>
            <div className="flex-1 overflow-hidden">
              <p className="text-xs text-muted-foreground truncate">
                <Link href={url} target="_blank" className="hover:underline">
                  {url}
                </Link>
              </p>
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-0 flex flex-col justify-between border-t gap-2">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs px-2 py-0.5 bg-muted">
            {remainingTime ? (
              remainingTime > 0 ? (
                <div className="flex items-center gap-1">
                  <span>有效期</span>
                  {remainingTime >= 3600 ? (
                    <>
                      <AnimatedCount
                        value={formatTime(remainingTime).hours}
                        padding={2}
                      />
                      <span>时</span>
                      <AnimatedCount
                        value={formatTime(remainingTime).minutes}
                        padding={2}
                      />
                      <span>分</span>
                      <AnimatedCount
                        value={formatTime(remainingTime).secs}
                        padding={2}
                      />
                      <span>秒</span>
                    </>
                  ) : remainingTime >= 60 ? (
                    <>
                      <AnimatedCount
                        value={formatTime(remainingTime).minutes}
                        padding={2}
                      />
                      <span>分</span>
                      <AnimatedCount
                        value={formatTime(remainingTime).secs}
                        padding={2}
                      />
                      <span>秒</span>
                    </>
                  ) : (
                    <>
                      <AnimatedCount value={remainingTime} padding={2} />
                      <span>秒</span>
                    </>
                  )}
                </div>
              ) : (
                <span className="text-red-500">已过期</span>
              )
            ) : (
              "长期有效"
            )}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={"destructive"}
                  size="icon"
                  className="h-8 w-8 opacity-80 hover:opacity-100"
                  onClick={() => execute(id)}
                  disabled={isPending}
                >
                  {isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>删除</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  className="h-8 w-8 opacity-80 hover:opacity-100"
                  onClick={() =>
                    copyToClipboard(window.location.origin + "/generated/" + id)
                  }
                >
                  <CopyIcon className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>复制链接</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <Dialog>
            <DialogTrigger asChild>
              <Button
                size="icon"
                className="h-8 w-8 opacity-80 hover:opacity-100"
              >
                <PencilIcon className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>编辑</DialogTitle>
                <DialogDescription>编辑跳转链接</DialogDescription>
              </DialogHeader>
              <form
                className="flex gap-2 flex-col md:flex-row"
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target as HTMLFormElement);
                  const url = formData.get("url");
                  if (!url) return;
                  editOGAction({ id, url: url as string })
                    .then(() => {
                      toast.success("更新成功");
                      router.refresh();
                    })
                    .catch((err) => {
                      toast.error(err.message);
                    });
                }}
              >
                <Input
                  type="text"
                  name="url"
                  placeholder="跳转链接"
                  defaultValue={url || ""}
                />

                <DialogFooter>
                  <DialogClose asChild>
                    <Button type="submit">更新</Button>
                  </DialogClose>
                  <DialogClose asChild>
                    <Button variant={"outline"}>取消</Button>
                  </DialogClose>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardFooter>
    </Card>
  );
}
