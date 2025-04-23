import createOGSchema from "@/lib/actions/create-og-schema";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { nanoid } from "nanoid";
import { createServerAction } from "zsa";

interface OGInfo {
  id: string;
  title: string;
  description?: string;
  image?: string;
  url?: string;
}

export const createOGAction = createServerAction()
  .input(createOGSchema)
  .handler(async ({ input }) => {
    const { title, description, image, url } = input;
    let id = nanoid(6); //用于查询
    const info: OGInfo = {
      id: "",
      title,
      description,
      image,
      url,
    };

    const {
      env: { OG_IMAGE_CACHE, OG_IMAGE_STORE, R2_DOMAIN },
    } = await getCloudflareContext({ async: true });

    // 检查kv中是否存在，如果存在则id需要重新生成
    const cache = await OG_IMAGE_CACHE.get(id);
    if (cache) {
      id = nanoid(6);
    }

    // 如果图片是url则直接保存，如果图片是base64则需要先保存到r2
    if (info.image && !info.image.startsWith("http")) {
      // 检查图片类型，用于生成文件名和metadata
      const imageType = info.image.split(";")[0].split("/")[1];
      const imageName = `${id}.${imageType}`;

      // 保存图片到r2
      const imageBuffer = Buffer.from(info.image.split(",")[1], "base64");
      await OG_IMAGE_STORE.put(imageName, imageBuffer, {
        httpMetadata: {
          contentType: `image/${imageType}`,
          contentEncoding: "base64",
          contentDisposition: `attachment; filename="${imageName}"`,
        },
      });

      // 更新info
      info.image = R2_DOMAIN.startsWith("http")
        ? `${R2_DOMAIN}/${imageName}`
        : `https://${R2_DOMAIN}/${imageName}`;
    }

    // 保存info到kv
    await OG_IMAGE_CACHE.put(id, JSON.stringify(info));

    return {
      id,
    };
  });
