import type { FileSystemItem } from '~/types/file-system'

export const mockFileSystem: Record<string, FileSystemItem> = {
  root: {
    id: 'root',
    name: 'Biomedical Data Lab',
    type: 'folder',
    parentId: null,
    path: '',
    modifiedAt: new Date('2024-01-15'),
    owner: 'Dr. Smith'
  },
  datasets: {
    id: 'datasets',
    name: 'Datasets',
    type: 'folder',
    parentId: 'root',
    path: 'Datasets',
    modifiedAt: new Date('2024-01-10'),
    owner: 'Dr. Smith'
  },
  genomics: {
    id: 'genomics',
    name: 'Genomics',
    type: 'folder',
    parentId: 'datasets',
    path: 'Datasets/Genomics',
    modifiedAt: new Date('2024-01-08'),
    owner: 'Dr. Smith'
  },
  proteomics: {
    id: 'proteomics',
    name: 'Proteomics',
    type: 'folder',
    parentId: 'datasets',
    path: 'Datasets/Proteomics',
    modifiedAt: new Date('2024-01-05'),
    owner: 'Dr. Smith'
  },
  imaging: {
    id: 'imaging',
    name: 'Medical Imaging',
    type: 'folder',
    parentId: 'datasets',
    path: 'Datasets/Medical Imaging',
    modifiedAt: new Date('2024-01-03'),
    owner: 'Dr. Smith'
  },
  clinical: {
    id: 'clinical',
    name: 'Clinical Data',
    type: 'folder',
    parentId: 'datasets',
    path: 'Datasets/Clinical Data',
    modifiedAt: new Date('2024-01-01'),
    owner: 'Dr. Smith'
  },
  analysis: {
    id: 'analysis',
    name: 'Analysis Scripts',
    type: 'folder',
    parentId: 'root',
    path: 'Analysis Scripts',
    modifiedAt: new Date('2023-12-28'),
    owner: 'Dr. Smith'
  },
  python: {
    id: 'python',
    name: 'Python',
    type: 'folder',
    parentId: 'analysis',
    path: 'Analysis Scripts/Python',
    modifiedAt: new Date('2023-12-25'),
    owner: 'Dr. Smith'
  },
  r: {
    id: 'r',
    name: 'R',
    type: 'folder',
    parentId: 'analysis',
    path: 'Analysis Scripts/R',
    modifiedAt: new Date('2023-12-20'),
    owner: 'Dr. Smith'
  },
  jupyter: {
    id: 'jupyter',
    name: 'Jupyter Notebooks',
    type: 'folder',
    parentId: 'analysis',
    path: 'Analysis Scripts/Jupyter Notebooks',
    modifiedAt: new Date('2023-12-18'),
    owner: 'Dr. Smith'
  },
  models: {
    id: 'models',
    name: 'ML Models',
    type: 'folder',
    parentId: 'root',
    path: 'ML Models',
    modifiedAt: new Date('2023-12-15'),
    owner: 'Dr. Smith'
  },
  deep_learning: {
    id: 'deep_learning',
    name: 'Deep Learning',
    type: 'folder',
    parentId: 'models',
    path: 'ML Models/Deep Learning',
    modifiedAt: new Date('2023-12-10'),
    owner: 'Dr. Smith'
  },
  traditional_ml: {
    id: 'traditional_ml',
    name: 'Traditional ML',
    type: 'folder',
    parentId: 'models',
    path: 'ML Models/Traditional ML',
    modifiedAt: new Date('2023-12-05'),
    owner: 'Dr. Smith'
  },
  results: {
    id: 'results',
    name: 'Research Results',
    type: 'folder',
    parentId: 'root',
    path: 'Research Results',
    modifiedAt: new Date('2023-12-01'),
    owner: 'Dr. Smith'
  },
  publications: {
    id: 'publications',
    name: 'Publications',
    type: 'folder',
    parentId: 'results',
    path: 'Research Results/Publications',
    modifiedAt: new Date('2023-11-28'),
    owner: 'Dr. Smith'
  },
  presentations: {
    id: 'presentations',
    name: 'Presentations',
    type: 'folder',
    parentId: 'results',
    path: 'Research Results/Presentations',
    modifiedAt: new Date('2023-11-25'),
    owner: 'Dr. Smith'
  },
  // Files in Genomics folder
  genome_sequence: {
    id: 'genome_sequence',
    name: 'human_genome_v38.fasta',
    type: 'file',
    parentId: 'genomics',
    path: 'Datasets/Genomics/human_genome_v38.fasta',
    size: 3200000000, // 3.2 GB
    modifiedAt: new Date('2024-01-08'),
    owner: 'Dr. Smith',
    extension: 'fasta'
  },
  variant_calls: {
    id: 'variant_calls',
    name: 'cancer_variants.vcf',
    type: 'file',
    parentId: 'genomics',
    path: 'Datasets/Genomics/cancer_variants.vcf',
    size: 450000000, // 450 MB
    modifiedAt: new Date('2024-01-05'),
    owner: 'Dr. Smith',
    extension: 'vcf'
  },
  expression_matrix: {
    id: 'expression_matrix',
    name: 'rna_seq_expression.csv',
    type: 'file',
    parentId: 'genomics',
    path: 'Datasets/Genomics/rna_seq_expression.csv',
    size: 120000000, // 120 MB
    modifiedAt: new Date('2024-01-03'),
    owner: 'Dr. Smith',
    extension: 'csv'
  },
  // Files in Medical Imaging folder
  mri_scan: {
    id: 'mri_scan',
    name: 'brain_mri_001.nii.gz',
    type: 'file',
    parentId: 'imaging',
    path: 'Datasets/Medical Imaging/brain_mri_001.nii.gz',
    size: 15000000, // 15 MB
    modifiedAt: new Date('2024-01-01'),
    owner: 'Dr. Smith',
    extension: 'nii.gz'
  },
  ct_scan: {
    id: 'ct_scan',
    name: 'chest_ct_series.dcm',
    type: 'file',
    parentId: 'imaging',
    path: 'Datasets/Medical Imaging/chest_ct_series.dcm',
    size: 85000000, // 85 MB
    modifiedAt: new Date('2023-12-28'),
    owner: 'Dr. Smith',
    extension: 'dcm'
  },
  // Files in Python folder
  dna_analysis: {
    id: 'dna_analysis',
    name: 'dna_sequence_analysis.py',
    type: 'file',
    parentId: 'python',
    path: 'Analysis Scripts/Python/dna_sequence_analysis.py',
    size: 45000, // 45 KB
    modifiedAt: new Date('2024-01-10'),
    owner: 'Dr. Smith',
    extension: 'py'
  },
  ml_pipeline: {
    id: 'ml_pipeline',
    name: 'cancer_classification_pipeline.py',
    type: 'file',
    parentId: 'python',
    path: 'Analysis Scripts/Python/cancer_classification_pipeline.py',
    size: 78000, // 78 KB
    modifiedAt: new Date('2024-01-08'),
    owner: 'Dr. Smith',
    extension: 'py'
  },
  // Files in Jupyter Notebooks folder
  genomics_notebook: {
    id: 'genomics_notebook',
    name: 'genomics_data_exploration.ipynb',
    type: 'file',
    parentId: 'jupyter',
    path: 'Analysis Scripts/Jupyter Notebooks/genomics_data_exploration.ipynb',
    size: 125000, // 125 KB
    modifiedAt: new Date('2024-01-05'),
    owner: 'Dr. Smith',
    extension: 'ipynb'
  },
  imaging_analysis: {
    id: 'imaging_analysis',
    name: 'medical_imaging_analysis.ipynb',
    type: 'file',
    parentId: 'jupyter',
    path: 'Analysis Scripts/Jupyter Notebooks/medical_imaging_analysis.ipynb',
    size: 95000, // 95 KB
    modifiedAt: new Date('2024-01-03'),
    owner: 'Dr. Smith',
    extension: 'ipynb'
  },
  // Files in Publications folder
  research_paper: {
    id: 'research_paper',
    name: 'AI_in_Biomedicine_2024.pdf',
    type: 'file',
    parentId: 'publications',
    path: 'Research Results/Publications/AI_in_Biomedicine_2024.pdf',
    size: 2500000, // 2.5 MB
    modifiedAt: new Date('2024-01-15'),
    owner: 'Dr. Smith',
    extension: 'pdf'
  },
  conference_paper: {
    id: 'conference_paper',
    name: 'Genomics_ML_Conference_2023.pdf',
    type: 'file',
    parentId: 'publications',
    path: 'Research Results/Publications/Genomics_ML_Conference_2023.pdf',
    size: 1800000, // 1.8 MB
    modifiedAt: new Date('2023-12-20'),
    owner: 'Dr. Smith',
    extension: 'pdf'
  }
}
