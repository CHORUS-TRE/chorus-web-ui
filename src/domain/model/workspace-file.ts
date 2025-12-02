import { z } from 'zod'

export const WorkspaceFileSchema = z.object({
  name: z.string(),
  path: z.string(),
  isDirectory: z.boolean(),
  size: z.string().optional(),
  mimeType: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  content: z.string().optional()
})

export const WorkspaceFileCreateSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  path: z.string().min(1, 'Path is required'),
  isDirectory: z.boolean().default(false),
  size: z.string().optional(),
  mimeType: z.string().optional(),
  content: z.string().optional()
})

export const WorkspaceFileUpdateSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  path: z.string().min(1, 'Path is required'),
  isDirectory: z.boolean().default(false),
  size: z.string().optional(),
  mimeType: z.string().optional(),
  content: z.string().optional()
})

export const WorkspaceFileEditFormSchema = WorkspaceFileCreateSchema

export type WorkspaceFile = z.infer<typeof WorkspaceFileSchema>
export type WorkspaceFileCreateType = z.infer<typeof WorkspaceFileCreateSchema>
export type WorkspaceFileUpdateType = z.infer<typeof WorkspaceFileUpdateSchema>

export const WorkspaceFilePartSchema = z.object({
  partNumber: z.string().min(1, 'Part number is required'),
  etag: z.string().optional(),
  data: z.string().optional()
})

export type WorkspaceFilePart = z.infer<typeof WorkspaceFilePartSchema>
