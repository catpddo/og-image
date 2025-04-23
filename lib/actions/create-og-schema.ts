import { z } from "zod";

const createOGSchema = z.object({
  title: z.string().min(1, "标题不能为空"),
  description: z.string().optional(),
  image: z.string().optional(),
  url: z.string().url("请输入正确的URL").optional(),
});

export type CreateOGSchema = z.infer<typeof createOGSchema>;

export default createOGSchema;
