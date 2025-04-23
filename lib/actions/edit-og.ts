"use server";
import { z } from "zod";
import { createServerAction, ZSAError } from "zsa";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { OGInfo } from "./create-og-schema";
import { revalidatePath } from "next/cache";

export const editOGAction = createServerAction()
  .input(
    z.object({
      id: z.string(),
      url: z.string().url("请输入有效的跳转链接"),
    })
  )
  .handler(async ({ input }) => {
    const { id, url } = input;
    const {
      env: { OG_IMAGE_CACHE, ACCESS_SECRET },
    } = await getCloudflareContext({ async: true });
    const info = await OG_IMAGE_CACHE.get<OGInfo>(id, "json");
    if (!info) {
      throw new ZSAError("NOT_FOUND", "找不到该链接");
    }
    await OG_IMAGE_CACHE.put(
      id,
      JSON.stringify({
        ...info,
        url,
      })
    );
    revalidatePath("/dashboard?secret=" + ACCESS_SECRET);
  });
