import { z } from "zod"

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const taskSchema = z.object({
  id: z.string(),
  date: z.string(),
  chan_page: z.string(),
  platform: z.string(),
  title: z.string(),
  status: z.string(),
  thumb_path: z.string(),
})

export type Task = z.infer<typeof taskSchema>