import {
  serializeUploadComplianceStatement,
  UPLOAD_COMPLIANCE_STATEMENT
} from '@/domain/model/upload-compliance'

describe('upload compliance statement', () => {
  it('serializes the displayed statements verbatim as a JSON array', () => {
    expect(serializeUploadComplianceStatement()).toBe(
      JSON.stringify(UPLOAD_COMPLIANCE_STATEMENT.items)
    )
    expect(JSON.parse(serializeUploadComplianceStatement())).toEqual(
      UPLOAD_COMPLIANCE_STATEMENT.items
    )
  })
})
