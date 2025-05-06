import { z } from 'zod'

export const AppCreateSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  iconURL: z.string().optional(),
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
  kioskConfigURL: z.string().optional(),
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
  ownerId: z.string().min(1, 'Owner ID is required'),
  preset: z.string().optional()
})
