import { Result } from '../model'
import {
  TermsOfUseAcceptance,
  TermsOfUseVersion
} from '../model/terms-of-use'

export interface TermsOfUseRepository {
  getMyStatus(): Promise<Result<boolean>>
  getCurrentVersion(): Promise<Result<TermsOfUseVersion | null>>
  accept(): Promise<Result<TermsOfUseAcceptance>>
  listVersions(): Promise<Result<TermsOfUseVersion[]>>
  getVersion(id: string): Promise<Result<TermsOfUseVersion>>
  createVersion(content: string): Promise<Result<TermsOfUseVersion>>
  updateVersion(id: string, content: string): Promise<Result<TermsOfUseVersion>>
  publishVersion(id: string): Promise<Result<TermsOfUseVersion>>
  listAcceptances(): Promise<Result<TermsOfUseAcceptance[]>>
}
