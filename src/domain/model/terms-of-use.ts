import { z } from 'zod'

export const TermsOfUseVersionStatusSchema = z
  .enum([
    'TERMS_OF_USE_VERSION_STATUS_DRAFT',
    'TERMS_OF_USE_VERSION_STATUS_PUBLISHED',
    'TERMS_OF_USE_VERSION_STATUS_ARCHIVED'
  ])
  .catch('TERMS_OF_USE_VERSION_STATUS_DRAFT')

export type TermsOfUseVersionStatus = z.infer<
  typeof TermsOfUseVersionStatusSchema
>

export const TermsOfUseVersionSchema = z.object({
  id: z.string().optional(),
  tenantId: z.string().optional(),
  content: z.string().optional(),
  status: TermsOfUseVersionStatusSchema.optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional()
})

export type TermsOfUseVersion = z.infer<typeof TermsOfUseVersionSchema>

export const TermsOfUseAcceptanceSchema = z.object({
  id: z.string().optional(),
  tenantId: z.string().optional(),
  userId: z.string().optional(),
  termsOfUseVersionId: z.string().optional(),
  acceptedAt: z.date().optional()
})

export type TermsOfUseAcceptance = z.infer<typeof TermsOfUseAcceptanceSchema>
