import { z } from 'zod'

export enum AppState {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  DELETED = 'deleted'
}

export const AppSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  status: z
    .enum([AppState.ACTIVE, AppState.INACTIVE, AppState.DELETED])
    .optional(),
  dockerImageName: z.string().min(1, 'Docker image name is required'),
  dockerImageTag: z.string().min(1, 'Docker image tag is required'),
  dockerImageRegistry: z.string().optional(),
  shmSize: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^\d+(\.\d+)?(Mi|Gi|M|G)$/.test(val),
      'Must be a number followed by Mi, Gi, M, or G (e.g., 128Mi, 1Gi)'
    ),
  minEphemeralStorage: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^\d+(\.\d+)?(Gi|M|G)$/.test(val),
      'Must be a number followed by Gi, M, or G (e.g., 1Gi, 1M, 1G)'
    ),
  maxEphemeralStorage: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^\d+(\.\d+)?(Gi|M|G)$/.test(val),
      'Must be a number followed by Gi, M, or G (e.g., 1Gi, 1M, 1G)'
    ),
  kioskConfigURL: z
    .string()
    .refine(
      (val) => !val || val === '' || /^https?:\/\/.+/.test(val),
      'Must be a valid URL'
    )
    .optional(),
  maxCPU: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^\d+(\.\d+)?(m)?$/.test(val),
      'Must be a number followed by m (e.g., 500m) or no unit (e.g., 1)'
    ),
  minCPU: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^\d+(\.\d+)?(m)?$/.test(val),
      'Must be a number followed by m (e.g., 500m) or no unit (e.g., 1)'
    ),
  maxMemory: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^\d+(\.\d+)?(Mi|Gi|M|G)$/.test(val),
      'Must be a number followed by Mi, Gi, M, or G (e.g., 128Mi, 1Gi)'
    ),
  minMemory: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^\d+(\.\d+)?(Mi|Gi|M|G)$/.test(val),
      'Must be a number followed by Mi, Gi, M, or G (e.g., 128Mi, 1Gi)'
    ),
  tenantId: z.string().min(1, 'Tenant ID is required'),
  userId: z.string().min(1, 'Owner ID is required'),
  preset: z.string().optional(),
  iconURL: z
    .string()
    .refine(
      (val) =>
        !val ||
        val === '' ||
        /^https?:\/\/.+/.test(val) ||
        /^data:image\/[a-zA-Z]+;base64,/.test(val),
      'Must be a valid URL or base64 image'
    )
    .optional()
})

export const AppCreateSchema = AppSchema.omit({ id: true })
export const AppUpdateSchema = AppSchema

export type AppCreateType = z.infer<typeof AppCreateSchema>
export type AppUpdateType = z.infer<typeof AppUpdateSchema>

export type App = z.infer<typeof AppSchema>
