import OGPreview from "@/components/og-preview";
import { Suspense } from "react";
import OGPreviewSkeleton from "@/components/og-preview-skeleton";
import { Metadata } from "next";
import { getCloudflareContext } from "@opennextjs/cloudflare";

interface GeneratedPageProps {
  params: Promise<{
    uid: string;
  }>;
}

export async function generateMetadata({
  params,
}: GeneratedPageProps): Promise<Metadata> {
  const { uid } = await params;
  const {
    env: { OG_IMAGE_CACHE },
  } = await getCloudflareContext({ async: true });
  const cache = await OG_IMAGE_CACHE.get(uid);
  if (!cache) {
    return {
      title: "404",
      description: "OG Preview not found",
    };
  }
  const info = JSON.parse(cache);
  const { title, description, image, url } = info;

  return {
    title,
    description,
    openGraph: {
      type: "website",
      url,
      title,
      description,
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export default async function GeneratedPage({ params }: GeneratedPageProps) {
  const { uid } = await params;
  return (
    <div className="w-full h-svh flex justify-center items-center bg-muted p-4">
      <div className="container max-w-md mx-auto max-h-[80svh]">
        <Suspense fallback={<OGPreviewSkeleton />}>
          <OGPreview id={uid} />
        </Suspense>
      </div>
    </div>
  );
}
