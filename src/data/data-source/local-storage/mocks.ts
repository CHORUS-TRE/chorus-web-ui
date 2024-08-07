import { WorkspaceCreateModel } from '~/domain/model'

export const workspaces: WorkspaceCreateModel[] = [
  {
    name: 'Design Hub',
    shortName: 'DH',
    description: 'A workspace for all design projects.',
    ownerId: 'user123',
    memberIds: ['user124', 'user125', 'user126'],
    tags: ['design', 'creativity', 'projects'],
    tenantId: 'tenant1'
  },
  {
    name: 'Marketing Team',
    shortName: 'MT',
    description: 'Marketing strategies and campaigns workspace.',
    ownerId: 'user234',
    memberIds: ['user235', 'user236', 'user237'],
    tags: ['marketing', 'campaigns', 'strategy'],
    tenantId: 'tenant2'
  },
  {
    name: 'Development Squad',
    shortName: 'DS',
    description: 'Development and engineering projects workspace.',
    ownerId: 'user345',
    memberIds: ['user346', 'user347', 'user348'],
    tags: ['development', 'engineering', 'projects'],
    tenantId: 'tenant3'
  },
  {
    name: 'HR Corner',
    shortName: 'HRC',
    description: 'Human resources and employee engagement workspace.',
    ownerId: 'user456',
    memberIds: ['user457', 'user458', 'user459'],
    tags: ['HR', 'employee', 'engagement'],
    tenantId: 'tenant4'
  },
  {
    name: 'Finance Hub',
    shortName: 'FH',
    description: 'Financial planning and reporting workspace.',
    ownerId: 'user567',
    memberIds: ['user568', 'user569', 'user570'],
    tags: ['finance', 'planning', 'reporting'],
    tenantId: 'tenant5'
  },
  {
    name: 'Product Innovation',
    shortName: 'PI',
    description: 'Workspace for new product ideas and development.',
    ownerId: 'user678',
    memberIds: ['user679', 'user680', 'user681'],
    tags: ['innovation', 'products', 'development'],
    tenantId: 'tenant6'
  },
  {
    name: 'Customer Success',
    shortName: 'CS',
    description: 'Ensuring customer satisfaction and success.',
    ownerId: 'user789',
    memberIds: ['user790', 'user791', 'user792'],
    tags: ['customer', 'success', 'satisfaction'],
    tenantId: 'tenant7'
  },
  {
    name: 'Legal Affairs',
    shortName: 'LA',
    description: 'Workspace for all legal matters and documentation.',
    ownerId: 'user890',
    memberIds: ['user891', 'user892', 'user893'],
    tags: ['legal', 'documentation', 'affairs'],
    tenantId: 'tenant8'
  },
  {
    name: 'Operations Team',
    shortName: 'OT',
    description: 'Operations management and logistics workspace.',
    ownerId: 'user901',
    memberIds: ['user902', 'user903', 'user904'],
    tags: ['operations', 'management', 'logistics'],
    tenantId: 'tenant9'
  },
  {
    name: 'R&D Lab',
    shortName: 'RDL',
    description: 'Research and development workspace.',
    ownerId: 'user012',
    memberIds: ['user013', 'user014', 'user015'],
    tags: ['research', 'development', 'innovation'],
    tenantId: 'tenant10'
  }
]
