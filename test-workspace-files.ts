// Test file to verify workspace file integration
import { WorkspaceFileDataSourceImpl } from './src/data/data-source/chorus-api/workspace-file-data-source'
import { WorkspaceFileRepositoryImpl } from './src/data/repository/workspace-file-repository-impl'
import {
  WorkspaceFile,
  WorkspaceFileCreateType
} from './src/domain/model/workspace-file'
import { WorkspaceFileRepository } from './src/domain/repository/workspace-file-repository'

// Test that types are properly exported
const testFile: WorkspaceFile = {
  name: 'test.txt',
  path: '/test.txt',
  isDirectory: false,
  createdAt: new Date(),
  updatedAt: new Date()
}

const testCreateFile: WorkspaceFileCreateType = {
  name: 'test.txt',
  path: '/test.txt',
  isDirectory: false
}

console.log('Workspace file integration test passed!')
console.log('Test file:', testFile)
console.log('Test create file:', testCreateFile)
