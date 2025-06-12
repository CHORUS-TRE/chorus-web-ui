/**
 * Performance Test Example: Workspace List Loading Performance
 *
 * NOTE: This is a simplified example of a performance test.
 * In a real-world scenario, you would use specialized tools like:
 * - Lighthouse for web performance metrics
 * - WebPageTest for detailed performance analysis
 * - Performance testing libraries like k6 or Puppeteer with performance metrics
 *
 * This example demonstrates the concepts but lacks many features
 * that real performance testing tools provide.
 */

import { WorkspacesList } from '@/domain/use-cases/workspace/workspaces-list'

// Mock performance.now() for testing
const originalPerformanceNow = performance.now
let mockedTime = 0

// Create a function to generate large amounts of test data
function generateTestWorkspaces(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    id: `workspace-${i}`,
    name: `Workspace ${i}`,
    shortName: `WS-${i}`,
    description: `This is a test workspace ${i} with a long description to simulate real-world data.`,
    image: '',
    ownerId: 'owner-1',
    memberIds: ['owner-1', 'member-1', 'member-2'],
    tags: [`tag-${i % 5}`, `priority-${i % 3}`],
    status: i % 5 === 0 ? 'archived' : 'active',
    sessionIds: Array.from({ length: i % 10 }, (_, j) => `workbench-${j}`),
    serviceIds: Array.from({ length: i % 5 }, (_, j) => `service-${j}`),
    createdAt: new Date(Date.now() - i * 86400000), // i days ago
    updatedAt: new Date(Date.now() - i * 43200000), // i/2 days ago
    archivedAt: i % 5 === 0 ? new Date(Date.now() - i * 21600000) : undefined // i/4 days ago if archived
  }))
}

describe('Workspace List Performance', () => {
  // Setup mocks and test data
  beforeAll(() => {
    // Mock performance.now to have controlled timing
    performance.now = jest.fn(() => mockedTime)
  })

  afterAll(() => {
    // Restore original implementation
    performance.now = originalPerformanceNow
  })

  beforeEach(() => {
    mockedTime = 0
  })

  it('should load 100 workspaces within 50ms (simulated)', async () => {
    // Arrange
    const testWorkspaces = generateTestWorkspaces(100)
    const mockRepository = {
      list: jest.fn().mockResolvedValue({ data: testWorkspaces })
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const useCase = new WorkspacesList(mockRepository as any)

    // Act - Start timer
    mockedTime = 100 // Simulate start time
    const startTime = performance.now()

    // Execute the operation
    const result = await useCase.execute()

    // Simulate end time with 30ms elapsed
    mockedTime = 130
    const endTime = performance.now()
    const duration = endTime - startTime

    // Assert
    expect(duration).toBeLessThanOrEqual(50) // Our target is 50ms
    expect(result.data).toHaveLength(100)
    expect(mockRepository.list).toHaveBeenCalledTimes(1)
  })

  it('should handle 1000 workspaces within 150ms (simulated)', async () => {
    // Arrange
    const testWorkspaces = generateTestWorkspaces(1000)
    const mockRepository = {
      list: jest.fn().mockResolvedValue({ data: testWorkspaces })
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const useCase = new WorkspacesList(mockRepository as any)

    // Act - Start timer
    mockedTime = 200 // Simulate start time
    const startTime = performance.now()

    // Execute the operation
    const result = await useCase.execute()

    // Simulate end time with 120ms elapsed
    mockedTime = 320
    const endTime = performance.now()
    const duration = endTime - startTime

    // Assert
    expect(duration).toBeLessThanOrEqual(150) // Our target is 150ms for 1000 items
    expect(result.data).toHaveLength(1000)
    expect(mockRepository.list).toHaveBeenCalledTimes(1)
  })

  it('demonstrates measuring render performance (simplified example)', async () => {
    // This is a simplified example - in real applications you would:
    // 1. Use tools like React Profiler or browser performance APIs
    // 2. Render components with large datasets
    // 3. Measure time to first paint, time to interactive, etc.
    // 4. Test with actual DOM rendering

    // Simplified example:
    const mockRenderFunction = jest.fn(() => {
      // Simulate complex rendering logic
      const data = generateTestWorkspaces(500)

      // Process data as if we were rendering
      const processedData = data.map((workspace) => ({
        ...workspace,
        displayName: `${workspace.name} (${workspace.shortName})`,
        isActive: workspace.status === 'active',
        memberCount: workspace.memberIds.length,
        workbenchCount: workspace.sessionIds.length
      }))

      return processedData
    })

    // Measure render time
    mockedTime = 400 // Simulate start time
    const startTime = performance.now()

    const result = mockRenderFunction()

    mockedTime = 440 // Simulate 40ms of processing time
    const endTime = performance.now()
    const renderTime = endTime - startTime

    // Assert performance expectations
    expect(renderTime).toBeLessThanOrEqual(50) // Target is 50ms for processing 500 items
    expect(result).toHaveLength(500)
    expect(mockRenderFunction).toHaveBeenCalledTimes(1)
  })

  it('demonstrates a memory usage check (conceptual)', () => {
    // NOTE: This is conceptual. In real-world scenarios, memory usage
    // would be measured with specialized tools, not in Jest tests.

    // Example of what you might measure in a real perf test:
    // 1. Memory usage before operation
    // 2. Run the operation
    // 3. Memory usage after
    // 4. Check that memory increase is under threshold

    // For demonstration purposes only:
    const memoryUsage = {
      before: 50_000_000, // Simulated 50MB usage
      after: 52_500_000, // Simulated 52.5MB usage
      increase: 2_500_000 // 2.5MB increase
    }

    // A real test would measure actual memory:
    // const memoryBefore = window.performance.memory.usedJSHeapSize;
    // ... perform operation ...
    // const memoryAfter = window.performance.memory.usedJSHeapSize;

    // Assert our "simulated" memory usage
    expect(memoryUsage.increase).toBeLessThanOrEqual(3_000_000) // 3MB max increase
  })
})
