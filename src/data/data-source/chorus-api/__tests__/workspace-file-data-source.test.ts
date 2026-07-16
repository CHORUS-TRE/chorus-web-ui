import { WorkspaceFileDataSourceImpl } from '../workspace-file-data-source'

const file = {
  name: 'research.csv',
  path: 'store/research.csv',
  isDirectory: false,
  size: '10'
}

describe('WorkspaceFileDataSourceImpl upload compliance', () => {
  it('attaches the compliance message to direct file creation', async () => {
    const source = new WorkspaceFileDataSourceImpl('http://api.test')
    const create = jest.fn().mockResolvedValue({})
    Object.assign(source, {
      service: { workspaceFileServiceCreateWorkspaceFile: create }
    })

    await source.create('workspace-1', file, '["accepted"]')

    expect(create).toHaveBeenCalledWith(
      expect.objectContaining({
        workspaceId: 'workspace-1',
        complianceMessage: '["accepted"]'
      })
    )
  })

  it('attaches the compliance message when initiating multipart upload', async () => {
    const source = new WorkspaceFileDataSourceImpl('http://api.test')
    const initiate = jest.fn().mockResolvedValue({})
    Object.assign(source, {
      service: { workspaceFileServiceInitiateWorkspaceFileUpload: initiate }
    })

    await source.initUpload('workspace-1', file.path, file, '["accepted"]')

    expect(initiate).toHaveBeenCalledWith(
      expect.objectContaining({
        workspaceId: 'workspace-1',
        path: file.path,
        complianceMessage: '["accepted"]'
      })
    )
  })
})
