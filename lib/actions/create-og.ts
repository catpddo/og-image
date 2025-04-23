"use server";
import createOGSchema, { OGInfo } from "@/lib/actions/create-og-schema";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { nanoid } from "nanoid";
import { createServerAction } from "zsa";

export const createOGAction = createServerAction()
  .input(createOGSchema)
  .handler(async ({ input }) => {
    const { title, description, image, url, expiration } = input;
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

    if (info.image && !info.image.startsWith("http")) {
      const imageType = info.image.split(";")[0].split("/")[1];
      const imageName = `${id}.${imageType}`;
      const imageBuffer = base64ToBuffer(info.image);
      const r = await OG_IMAGE_STORE.put(imageName, imageBuffer, {
        httpMetadata: {
          contentType: `image/${imageType}`,
          contentEncoding: "base64",
          contentDisposition: `attachment; filename="${imageName}"`,
        },
      });

      info.image = R2_DOMAIN.startsWith("http")
        ? `${R2_DOMAIN}/${imageName}`
        : `https://${R2_DOMAIN}/${imageName}`;
    }

    await OG_IMAGE_CACHE.put(id, JSON.stringify(info), {
      expirationTtl: expiration ? expiration * 60 * 60 : undefined,
    });

    return {
      id,
    };
  });

function base64ToBuffer(base64: string): ArrayBuffer {
  const base64String = base64.split(",")[1];
  const binaryString = atob(base64String);
  const length = binaryString.length;
  const arrayBuffer = new ArrayBuffer(length);
  const view = new Uint8Array(arrayBuffer);
  for (let i = 0; i < length; i++) {
    view[i] = binaryString.charCodeAt(i);
  }

  return arrayBuffer;
}
