import { z } from 'zod'

import { Result } from '@/domain/model'
import {
  TermsOfUseAcceptance,
  TermsOfUseAcceptanceSchema,
  TermsOfUseVersion,
  TermsOfUseVersionSchema
} from '@/domain/model/terms-of-use'
import { TermsOfUseRepository } from '@/domain/repository/terms-of-use-repository'

import { TermsOfUseDataSource } from '../data-source'

export class TermsOfUseRepositoryImpl implements TermsOfUseRepository {
  constructor(private readonly dataSource: TermsOfUseDataSource) {}

  async getMyStatus(): Promise<Result<boolean>> {
    try {
      const response = await this.dataSource.getMyStatus()
      return { data: response.result?.status?.accepted ?? false }
    } catch (error) {
      return { error: error instanceof Error ? error.message : String(error) }
    }
  }

  async getCurrentVersion(): Promise<Result<TermsOfUseVersion | null>> {
    try {
      const response = await this.dataSource.getCurrentVersion()
      const raw = response.result?.termsOfUseVersion
      if (!raw) return { data: null }
      const parsed = TermsOfUseVersionSchema.safeParse(raw)
      if (!parsed.success)
        return {
          error: 'API response validation failed',
          issues: parsed.error.issues
        }
      return { data: parsed.data }
    } catch (error) {
      return { error: error instanceof Error ? error.message : String(error) }
    }
  }

  async accept(): Promise<Result<TermsOfUseAcceptance>> {
    try {
      const response = await this.dataSource.accept()
      const raw = response.result?.termsOfUseAcceptance
      if (!raw) return { error: 'API response missing acceptance record' }
      const parsed = TermsOfUseAcceptanceSchema.safeParse(raw)
      if (!parsed.success)
        return {
          error: 'API response validation failed',
          issues: parsed.error.issues
        }
      return { data: parsed.data }
    } catch (error) {
      return { error: error instanceof Error ? error.message : String(error) }
    }
  }

  async listVersions(): Promise<Result<TermsOfUseVersion[]>> {
    try {
      const response = await this.dataSource.listVersions()
      const raw = response.result?.termsOfUseVersions ?? []
      const parsed = z.array(TermsOfUseVersionSchema).safeParse(raw)
      if (!parsed.success)
        return {
          error: 'API response validation failed',
          issues: parsed.error.issues
        }
      return { data: parsed.data }
    } catch (error) {
      return { error: error instanceof Error ? error.message : String(error) }
    }
  }

  async getVersion(id: string): Promise<Result<TermsOfUseVersion>> {
    try {
      const response = await this.dataSource.getVersion(id)
      const raw = response.result?.termsOfUseVersion
      if (!raw) return { error: 'Version not found' }
      const parsed = TermsOfUseVersionSchema.safeParse(raw)
      if (!parsed.success)
        return {
          error: 'API response validation failed',
          issues: parsed.error.issues
        }
      return { data: parsed.data }
    } catch (error) {
      return { error: error instanceof Error ? error.message : String(error) }
    }
  }

  async createVersion(content: string): Promise<Result<TermsOfUseVersion>> {
    try {
      const response = await this.dataSource.createVersion(content)
      const raw = response.result?.termsOfUseVersion
      if (!raw) return { error: 'API response missing version' }
      const parsed = TermsOfUseVersionSchema.safeParse(raw)
      if (!parsed.success)
        return {
          error: 'API response validation failed',
          issues: parsed.error.issues
        }
      return { data: parsed.data }
    } catch (error) {
      return { error: error instanceof Error ? error.message : String(error) }
    }
  }

  async updateVersion(
    id: string,
    content: string
  ): Promise<Result<TermsOfUseVersion>> {
    try {
      const response = await this.dataSource.updateVersion(id, content)
      const raw = response.result?.termsOfUseVersion
      if (!raw) return { error: 'API response missing version' }
      const parsed = TermsOfUseVersionSchema.safeParse(raw)
      if (!parsed.success)
        return {
          error: 'API response validation failed',
          issues: parsed.error.issues
        }
      return { data: parsed.data }
    } catch (error) {
      return { error: error instanceof Error ? error.message : String(error) }
    }
  }

  async publishVersion(id: string): Promise<Result<TermsOfUseVersion>> {
    try {
      const response = await this.dataSource.publishVersion(id)
      const raw = response.result?.termsOfUseVersion
      if (!raw) return { error: 'API response missing version' }
      const parsed = TermsOfUseVersionSchema.safeParse(raw)
      if (!parsed.success)
        return {
          error: 'API response validation failed',
          issues: parsed.error.issues
        }
      return { data: parsed.data }
    } catch (error) {
      return { error: error instanceof Error ? error.message : String(error) }
    }
  }

  async listAcceptances(): Promise<Result<TermsOfUseAcceptance[]>> {
    try {
      const response = await this.dataSource.listAcceptances()
      const raw = response.result?.termsOfUseAcceptances ?? []
      const parsed = z.array(TermsOfUseAcceptanceSchema).safeParse(raw)
      if (!parsed.success)
        return {
          error: 'API response validation failed',
          issues: parsed.error.issues
        }
      return { data: parsed.data }
    } catch (error) {
      return { error: error instanceof Error ? error.message : String(error) }
    }
  }
}
