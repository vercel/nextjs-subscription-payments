import { z } from "zod"

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const bConfigSchema = z.object({
  id: z.string(),
  name: z.string(),
  list: z.string(),
  channel: z.string(),
  channel_id: z.string(),
  channel_platform: z.string(),
  video_name: z.string(),
  endscreen: z.string(),
  endscreen_model: z.number(),
  thumb_algo: z.string(),
  video_caption: z.string(),
  cores: z.number(),
  vc: z.string(),
  status: z.string(),
})

export type BConfig = z.infer<typeof bConfigSchema>