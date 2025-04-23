"use client";

import { useState, useRef, useEffect } from "react";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "./ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useServerAction } from "zsa-react";
import { createOGAction } from "@/lib/actions/create-og";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import createOGSchema, {
  type CreateOGSchema,
} from "@/lib/actions/create-og-schema";
import { Button } from "./ui/button";
import { Loader2, UploadCloud, X, AlertCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function OGForm() {
  const [imageTab, setImageTab] = useState<"url" | "upload">("url");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const form = useForm<CreateOGSchema>({
    resolver: zodResolver(createOGSchema),
    defaultValues: {
      title: "",
      description: "",
      image: "",
      url: "",
      expiration: 24 * 30,
    },
    mode: "onBlur",
  });
  const {
    execute,
    isPending,
    error,
    data: result,
  } = useServerAction(createOGAction);

  // 创建重置表单和图片状态的函数
  const resetForm = () => {
    form.reset();
    setImagePreview(null);
    setImageError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  useEffect(() => {
    if (result && result.id) {
      resetForm();
      window.navigator.clipboard.writeText(
        window.location.origin + "/generated/" + result.id
      );
      toast.success("生成成功,访问链接已经复制到剪贴板,前往查看", {
        action: {
          label: "前往查看",
          onClick: () => {
            router.push(`/generated/${result.id}`);
          },
        },
      });
    }
  }, [result]);
  useEffect(() => {
    if (error) {
      if (error.code !== "INPUT_PARSE_ERROR") {
        toast.error("生成失败", {
          description: error.message,
        });
      }
    }
    resetForm();
  }, [error]);

  // 检查图片URL是否有效
  const checkImageUrl = (url: string): Promise<boolean> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = url;
    });
  };

  const handleUrlChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    form.setValue("image", url);

    if (!url) {
      setImagePreview(null);
      setImageError(null);
      return;
    }

    try {
      const httpsRegex = /^(https:\/\/)/i;
      if (!httpsRegex.test(url)) {
        setImageError("请输入有效的HTTPS地址（以https://开头）");
        setImagePreview(null);
        return;
      }

      setIsImageLoading(true);
      setImageError(null);

      const isValid = await checkImageUrl(url);

      if (isValid) {
        setImagePreview(url);
        setImageError(null);
      } else {
        setImagePreview(null);
        setImageError("无法加载此图片，请检查链接是否正确");
      }
    } catch (error) {
      setImageError("图片链接验证出错");
      setImagePreview(null);
    } finally {
      setIsImageLoading(false);
    }
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  const handleImageUpload = async (file: File) => {
    if (!file) return;

    try {
      const base64 = await convertToBase64(file);
      form.setValue("image", base64);
      setImagePreview(base64);
      setImageError(null);
    } catch (error) {
      console.error("转换图片失败", error);
      setImageError("图片处理失败，请重试");
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type.startsWith("image/")) {
        handleImageUpload(file);
      }
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setImageError(null);
    form.setValue("image", "");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const openFileSelector = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => execute(data))}
        className="flex flex-col gap-4"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                标题
                <FormDescription>页面标题</FormDescription>
              </FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                描述
                <FormDescription>页面描述,更加详细的页面介绍</FormDescription>
              </FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>图片</FormLabel>
              <Tabs
                defaultValue="url"
                onValueChange={(value: string) => {
                  setImageTab(value as "url" | "upload");
                  setImageError(null);
                }}
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="url">图片URL</TabsTrigger>
                  <TabsTrigger value="upload">上传图片</TabsTrigger>
                </TabsList>
                <TabsContent value="url">
                  <FormControl>
                    <div className="space-y-2">
                      <Input
                        placeholder="输入图片URL"
                        {...field}
                        onChange={handleUrlChange}
                        className={cn(
                          imageError &&
                            "border-destructive focus-visible:ring-destructive/50"
                        )}
                      />
                      {imageError && (
                        <div className="flex items-center gap-1 text-destructive text-sm">
                          <AlertCircle className="h-4 w-4" />
                          <span>{imageError}</span>
                        </div>
                      )}
                      {isImageLoading && (
                        <div className="flex items-center gap-2 text-muted-foreground text-sm">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>正在验证图片...</span>
                        </div>
                      )}
                    </div>
                  </FormControl>
                  {imagePreview && imageTab === "url" && (
                    <div className="mt-2">
                      <p className="text-sm text-muted-foreground mb-1">
                        预览：
                      </p>
                      <div className="relative p-4 w-full h-32 bg-muted/20 rounded-md overflow-hidden border border-input">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-full object-contain"
                        />
                        <Button
                          type="button"
                          onClick={handleRemoveImage}
                          className="absolute top-1 right-1 p-1 bg-background/80 rounded-full hover:bg-background"
                          variant="ghost"
                          size="icon"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </TabsContent>
                <TabsContent value="upload">
                  <FormControl>
                    <div className="flex flex-col gap-2">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileInputChange}
                      />

                      {!imagePreview && (
                        <div
                          onClick={openFileSelector}
                          onDragEnter={handleDragEnter}
                          onDragLeave={handleDragLeave}
                          onDragOver={handleDragOver}
                          onDrop={handleDrop}
                          className={cn(
                            "w-full h-32 border-2 border-dashed rounded-md flex flex-col items-center justify-center cursor-pointer transition-colors",
                            isDragging
                              ? "border-primary bg-primary/5"
                              : "border-input hover:border-primary/50 hover:bg-muted/50"
                          )}
                        >
                          <UploadCloud className="w-10 h-10 text-muted-foreground mb-2" />
                          <p className="text-sm text-muted-foreground">
                            点击上传或拖拽图片到此处
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            支持 JPG, PNG, GIF 等格式
                          </p>
                        </div>
                      )}

                      {imageTab === "upload" && imagePreview && (
                        <div className="relative p-4 w-full h-32 bg-muted/20 rounded-md overflow-hidden border border-input">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-full h-full object-contain"
                          />
                          <Button
                            type="button"
                            onClick={handleRemoveImage}
                            className="absolute top-1 right-1 p-1 bg-background/80 rounded-full hover:bg-background"
                            variant="ghost"
                            size="icon"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </FormControl>
                </TabsContent>
              </Tabs>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="expiration"
          render={({ field }) => (
            <FormItem>
              <FormLabel>有效期</FormLabel>
              <FormDescription>
                选填，如果需要设置有效期，请填写有效期（单位：小时）
              </FormDescription>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>跳转链接</FormLabel>
              <FormDescription>
                选填，如果需要跳转，请填写跳转链接
              </FormDescription>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isPending || !!imageError}>
          {isPending ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              生成中...
            </>
          ) : (
            "生成"
          )}
        </Button>
      </form>
    </Form>
  );
}
