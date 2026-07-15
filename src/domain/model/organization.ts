import { z } from 'zod'

export const OrganizationLogoSchema = z.object({
  data: z.string().optional(),
  contentType: z.string().optional()
})

export const OrganizationSchema = z.object({
  id: z.string(),
  tenantId: z.string(),
  name: z.string(),
  description: z.string().optional(),
  logo: OrganizationLogoSchema.optional(),
  country: z.string().optional(),
  city: z.string().optional(),
  contactUserId: z.string().optional(),
  websiteUrl: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date()
})

export const OrganizationCreateSchema = z.object({
  tenantId: z.string(),
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  logo: OrganizationLogoSchema.optional(),
  country: z.string().optional(),
  city: z.string().optional(),
  contactUserId: z.string().optional(),
  websiteUrl: z.string().optional()
})

export const OrganizationEditFormSchema = OrganizationCreateSchema // For form validation

export const OrganizationUpdateSchema = OrganizationCreateSchema.extend({
  id: z.string()
})

export type OrganizationLogo = z.infer<typeof OrganizationLogoSchema>
export type Organization = z.infer<typeof OrganizationSchema>
export type OrganizationCreateType = z.infer<typeof OrganizationCreateSchema>
export type OrganizationUpdateType = z.infer<typeof OrganizationUpdateSchema>
