export interface UploadComplianceStatement {
  intro: string
  items: readonly [string, ...string[]]
}

export const UPLOAD_COMPLIANCE_STATEMENT = {
  intro: 'By uploading data to this workspace, you confirm the following:',
  items: [
    'The data is de-identified or pseudonymized (or is publicly available data)',
    'The upload has been approved by the relevant ethics committee / data access committee (or is exempt)',
    'I confirm this upload is intentional'
  ]
} as const satisfies UploadComplianceStatement

export function serializeUploadComplianceStatement(
  statement: UploadComplianceStatement = UPLOAD_COMPLIANCE_STATEMENT
): string {
  return JSON.stringify(statement.items)
}
