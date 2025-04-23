"use server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createServerAction } from "zsa";

export const deleteOGAction = createServerAction()
  .input(z.string().length(6))
  .handler(async ({ input }) => {
    const {
      env: { OG_IMAGE_CACHE },
    } = await getCloudflareContext({ async: true });
    await OG_IMAGE_CACHE.delete(input);
    revalidatePath("/dashboard");
  });
