import { z } from "zod";

const createOGSchema = z.object({
  title: z.string({ message: "标题不能为空" }),
  description: z.string().optional(),
  image: z.string().optional(),
  url: z.string().optional(),
  expiration: z.coerce.number().optional(),
});

export type CreateOGSchema = z.infer<typeof createOGSchema>;

export default createOGSchema;
export interface OGInfo {
  id: string;
  title: string;
  description?: string;
  image?: string;
  url?: string;
}
