import { WorkspaceCreateModel } from '~/domain/model'
import { WorkbenchCreateModel} from '~/domain/model'

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

export const apps: WorkbenchCreateModel[] = [
    {
    tenantId: 'tenant1',
    ownerId: 'owner1',
    appId: 'jupyter',
    workspaceId: 'workspace1',
    name: 'Jupyter',
    description: 'A powerful interactive notebook for data science and machine learning.',
    memberIds: ['member1', 'member2'],
    tags: ['data-science', 'notebook']
  },
  {
    tenantId: 'tenant2',
    ownerId: 'owner2',
    appId: 'rStudio',
    workspaceId: 'workspace2',
    name: 'RStudio',
    description: 'An integrated development environment for R, ideal for statistical computing and graphics.',
    memberIds: ['member3', 'member4'],
    tags: ['data-analysis', 'statistics']
  },
  {
    tenantId: 'tenant3',
    ownerId: 'owner3',
    appId: 'visualStudioCode',
    workspaceId: 'workspace3',
    name: 'Visual Studio Code',
    description: 'A versatile code editor with support for various programming languages and extensions.',
    memberIds: ['member5', 'member6'],
    tags: ['code-editor', 'development']
  },
  {
    tenantId: 'tenant4',
    ownerId: 'owner4',
    appId: 'strada',
    workspaceId: 'workspace4',
    name: 'Strada',
    description: 'A collaborative data visualization tool for creating interactive dashboards.',
    memberIds: ['member7', 'member8'],
    tags: ['data-visualization', 'collaboration']
  },
  {
    tenantId: 'tenant5',
    ownerId: 'owner5',
    appId: 'python',
    workspaceId: 'workspace5',
    name: 'Python',
    description: 'A high-level programming language known for its readability and versatility.',
    memberIds: ['member9', 'member10'],
    tags: ['programming', 'scripting']
  },
  {
    tenantId: 'tenant6',
    ownerId: 'owner6',
    appId: 'matlab',
    workspaceId: 'workspace6',
    name: 'MATLAB',
    description: 'A numerical computing environment and programming language for algorithm development and data visualization.',
    memberIds: ['member11', 'member12'],
    tags: ['numerical-computing', 'simulation']
  },
  {
    tenantId: 'tenant7',
    ownerId: 'owner7',
    appId: 'tableau',
    workspaceId: 'workspace7',
    name: 'Tableau',
    description: 'A leading data visualization tool for transforming data into interactive and shareable dashboards.',
    memberIds: ['member13', 'member14'],
    tags: ['data-visualization', 'business-intelligence']
  },
  {
    tenantId: 'tenant8',
    ownerId: 'owner8',
    appId: 'sas',
    workspaceId: 'workspace8',
    name: 'SAS',
    description: 'A software suite for advanced analytics, business intelligence, and data management.',
    memberIds: ['member15', 'member16'],
    tags: ['analytics', 'data-management']
  },
  {
    tenantId: 'tenant9',
    ownerId: 'owner9',
    appId: 'spss',
    workspaceId: 'workspace9',
    name: 'SPSS',
    description: 'A software package used for statistical analysis and data mining.',
    memberIds: ['member17', 'member18'],
    tags: ['statistical-analysis', 'data-mining']
  },
  {
    tenantId: 'tenant10',
    ownerId: 'owner10',
    appId: 'apacheZeppelin',
    workspaceId: 'workspace10',
    name: 'Apache Zeppelin',
    description: 'A web-based notebook that enables interactive data analytics with support for multiple languages.',
    memberIds: ['member19', 'member20'],
    tags: ['notebook', 'data-visualization']
  }
];


