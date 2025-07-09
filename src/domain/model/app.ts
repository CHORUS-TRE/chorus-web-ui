import { z } from 'zod'

import { parseCPU, parseMemory } from '../utils/resource-parser'

export enum AppState {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  DELETED = 'deleted'
}

const baseAppSchema = z.object({
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

export const AppSchema = baseAppSchema.superRefine((data, ctx) => {
  // CPU Validation
  if (
    data.minCPU &&
    data.maxCPU &&
    parseCPU(data.minCPU) > parseCPU(data.maxCPU)
  ) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Min CPU cannot be greater than Max CPU',
      path: ['minCPU']
    })
  }

  // Memory Validation
  if (
    data.minMemory &&
    data.maxMemory &&
    parseMemory(data.minMemory) > parseMemory(data.maxMemory)
  ) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Min Memory cannot be greater than Max Memory',
      path: ['minMemory']
    })
  }

  // Ephemeral Storage Validation
  if (
    data.minEphemeralStorage &&
    data.maxEphemeralStorage &&
    parseMemory(data.minEphemeralStorage) >
      parseMemory(data.maxEphemeralStorage)
  ) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message:
        'Min Ephemeral Storage cannot be greater than Max Ephemeral Storage',
      path: ['minEphemeralStorage']
    })
  }
})

export const AppCreateSchema = baseAppSchema
  .omit({ id: true })
  .superRefine((data, ctx) => {
    // CPU Validation
    if (
      data.minCPU &&
      data.maxCPU &&
      parseCPU(data.minCPU) > parseCPU(data.maxCPU)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Min CPU cannot be greater than Max CPU',
        path: ['minCPU']
      })
    }

    // Memory Validation
    if (
      data.minMemory &&
      data.maxMemory &&
      parseMemory(data.minMemory) > parseMemory(data.maxMemory)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Min Memory cannot be greater than Max Memory',
        path: ['minMemory']
      })
    }

    // Ephemeral Storage Validation
    if (
      data.minEphemeralStorage &&
      data.maxEphemeralStorage &&
      parseMemory(data.minEphemeralStorage) >
        parseMemory(data.maxEphemeralStorage)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          'Min Ephemeral Storage cannot be greater than Max Ephemeral Storage',
        path: ['minEphemeralStorage']
      })
    }
  })

export const AppUpdateSchema = AppSchema

export type AppCreateType = z.infer<typeof AppCreateSchema>
export type AppUpdateType = z.infer<typeof AppUpdateSchema>

export type App = z.infer<typeof AppSchema>
