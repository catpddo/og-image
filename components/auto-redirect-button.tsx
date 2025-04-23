"use client";

import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Loader2, ExternalLink } from "lucide-react";
import { useRouter } from "next/navigation";
interface AutoRedirectButtonProps {
  url: string;
}

export default function AutoRedirectButton({ url }: AutoRedirectButtonProps) {
  const [countdown, setCountdown] = useState(5);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [isCancelled, setIsCancelled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!url || isCancelled) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsRedirecting(true);
          router.push(url, { scroll: false });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [url, isCancelled]);

  const handleManualRedirect = () => {
    setIsRedirecting(true);
    router.push(url, { scroll: false });
  };

  const handleCancelRedirect = () => {
    setIsCancelled(true);
    setCountdown(0);
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      {!isCancelled && countdown > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {`${countdown}秒后自动跳转到目标网站`}
          </p>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCancelRedirect}
            className="text-xs"
          >
            取消
          </Button>
        </div>
      )}

      <Button
        onClick={handleManualRedirect}
        disabled={isRedirecting}
        className="w-full"
      >
        {isRedirecting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            正在跳转...
          </>
        ) : (
          <>
            <ExternalLink className="mr-2 h-4 w-4" />
            立即前往
          </>
        )}
      </Button>
    </div>
  );
}
