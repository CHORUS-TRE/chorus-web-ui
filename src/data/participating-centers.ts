export interface ParticipatingCenter {
  id: string
  label: string
  pi: string
  country: string
  city: string
  logo: string
  description: string
  website: string
  socialnetwork: {
    youtube?: string
    twitter?: string
    facebook?: string
    linkedin?: string
    instagram?: string
    researchgate?: string
  }
  community: {
    url: string
  }
}

export const participatingCenters: ParticipatingCenter[] = [
  {
    id: 'tudelft',
    label: 'TUDelft',
    pi: 'Arman Sharifi',
    country: 'Netherlands',
    city: 'Delft',
    logo: '/participating-centers/256x256-tudelft__logo.png',
    description: 'Delft University of Technology',
    website: 'https://www.tudelft.nl/',
    socialnetwork: {
      youtube: 'https://www.youtube.com/@tudelft'
    },
    community: {
      url: '/call/o6npmdzu'
    }
  },
  {
    id: 'epfl-esl',
    label: 'EPFL-ESL',
    pi: 'David Atienza',
    country: 'Switzerland',
    city: 'Lausanne',
    logo: '/participating-centers/256x256-epfl-esl__logo.png',
    description: 'Embedded Systems Laboratory at EPFL',
    website: 'https://www.epfl.ch/labs/esl/',
    socialnetwork: {
      youtube: 'https://www.youtube.com/@eslepfl'
    },
    community: {
      url: '/call/7a8b3m37'
    }
  },
  {
    id: 'uka',
    label: 'Uniklinikum Aachen',
    pi: 'Stefan Wolking',
    country: 'Germany',
    city: 'Aachen',
    logo: '/participating-centers/256x256-uka__logo.png',
    description: 'University Hospital RWTH Aachen',
    website: 'https://www.ukaachen.de/en/',
    socialnetwork: {
      twitter: 'https://twitter.com/UniklinikAachen'
    },
    community: {
      url: '/call/dtp62mkp'
    }
  },
  {
    id: 'vr-vis',
    label: 'VR-VIS',
    pi: 'Katja Bühler',
    country: 'Austria',
    city: 'Wien',
    logo: '/participating-centers/256x256-vrvis__logo.png',
    description:
      'VRVis Zentrum für Virtual Reality und Visualisierung Forschungs-GmbH',
    website: 'https://www.vrvis.at/',
    socialnetwork: {
      twitter: 'https://twitter.com/vrvis',
      youtube: 'https://www.youtube.com/user/VRVis',
      facebook: 'https://www.facebook.com/vrvisvienna',
      linkedin:
        'https://www.linkedin.com/company/vrvis-zentrum-f%C3%BCr-virtual-reality-und-visualisierung-forschungs-gmbh/'
    },
    community: {
      url: '/call/fcad5mb5'
    }
  },
  {
    id: 'ucl',
    label: 'UCL',
    pi: 'Susana Ferrao Santos',
    country: 'Belgium',
    city: 'Brussel',
    logo: '/participating-centers/256x256-ucllouvain__logo.png',
    description: 'Cliniques Universitaires St-Luc (BRACE)',
    website: 'https://www.saintluc.be/',
    socialnetwork: {
      twitter: 'https://twitter.com/ClinUnivStLuc',
      youtube: 'https://www.youtube.com/user/cliniquesuclsaintluc',
      facebook: 'https://www.facebook.com/CliniquesUniversitairesSaintLuc',
      instagram: 'https://www.instagram.com/cliniques_saint_luc/',
      linkedin:
        'https://www.linkedin.com/company/cliniques-universitaires-saint-luc/'
    },
    community: {
      url: '/call/wcrcmohh'
    }
  },
  {
    id: 'chuc',
    label: 'CHUC',
    pi: 'Francisco Sales',
    country: 'Portugal',
    city: 'Coimbra',
    logo: '/participating-centers/256x256-chuc__logo.png',
    description: 'Centro Hospitalar e Universitario de Coimbra',
    website: 'https://www.chuc.min-saude.pt/',
    socialnetwork: {},
    community: {
      url: '/call/rwq6t7jc'
    }
  },
  {
    id: 'amu-ns',
    label: 'AMU-NS',
    pi: 'Olivier David',
    country: 'France',
    city: 'Marseille',
    logo: '/participating-centers/256x256-amu__logo.png',
    description: 'Aix-Marseille University',
    website: 'https://www.univ-amu.fr/',
    socialnetwork: {
      twitter: 'https://twitter.com/univamu',
      youtube: 'https://www.youtube.com/channel/UCqAJ4nmwJdjEweR1cNYPbmA',
      facebook: 'https://www.facebook.com/aixmarseilleuniversite/',
      linkedin: 'https://www.linkedin.com/school/aix-marseille-university/',
      researchgate:
        'https://www.researchgate.net/institution/Aix-Marseille-University'
    },
    community: {
      url: '/call/syqenpjc'
    }
  },
  {
    id: 'chuv',
    label: 'CHUV',
    pi: 'Philippe Ryvlin',
    country: 'Switzerland',
    city: 'Lausanne',
    logo: '/participating-centers/chuv__logo.png',
    description: 'Centre Hospitalier Universitaire de Lausanne (CHUV)',
    website: 'https://www.chuv.ch/',
    socialnetwork: {
      twitter: 'https://twitter.com/CHUVLausanne',
      instagram: 'https://www.instagram.com/chuvlausanne/',
      facebook: 'https://www.facebook.com/CHUVLausanne',
      linkedin: 'https://www.linkedin.com/company/chuv/'
    },
    community: {
      url: '/call/zwk3g4ra'
    }
  },
  {
    id: 'amu-tng',
    label: 'AMU-TNG',
    pi: 'Viktor Jirsa',
    country: 'France',
    city: 'Marseille',
    logo: '/participating-centers/amu-tng__logo.jpeg',
    description: 'Aix-Marseille University',
    website: 'https://www.univ-amu.fr/',
    socialnetwork: {
      twitter: 'https://twitter.com/univamu',
      youtube: 'https://www.youtube.com/channel/UCqAJ4nmwJdjEweR1cNYPbmA',
      facebook: 'https://www.facebook.com/aixmarseilleuniversite/',
      linkedin: 'https://www.linkedin.com/school/aix-marseille-university/',
      researchgate:
        'https://www.researchgate.net/institution/Aix-Marseille-University'
    },
    community: {
      url: '/call/ptn4xq7v'
    }
  },
  {
    id: 'aphm',
    label: 'APHM',
    pi: 'Fabrice Bartolomei',
    country: 'France',
    city: 'Marseille',
    logo: '/participating-centers/amu-tng__logo.jpeg',
    description: 'University Hospitals of Marseille, Epilepsy Dpt.',
    website: 'https://www.univ-amu.fr/',
    socialnetwork: {
      twitter: 'https://twitter.com/univamu',
      youtube: 'https://www.youtube.com/channel/UCqAJ4nmwJdjEweR1cNYPbmA',
      facebook: 'https://www.facebook.com/aixmarseilleuniversite/',
      linkedin: 'https://www.linkedin.com/school/aix-marseille-university/',
      researchgate:
        'https://www.researchgate.net/institution/Aix-Marseille-University'
    },
    community: {
      url: '/call/wb8zmpx8'
    }
  },
  {
    id: 'chru-lille',
    label: 'CHRU-LILLE',
    pi: 'Philippe Derambure',
    country: 'France',
    city: 'Lille',
    logo: '/participating-centers/chru-lille__logo.png',
    description: 'CHRU LILLE, Epilepsy Unit',
    website: 'https://www.chu-lille.fr/',
    socialnetwork: {
      youtube: 'https://www.youtube.com/channel/UCvB81CdUUKNpaGCTaJFkNVQ',
      instagram: 'https://www.instagram.com/chulille/',
      twitter: 'https://twitter.com/CHU_Lille',
      facebook: 'https://www.facebook.com/chulille'
    },
    community: {
      url: '/call/aprczohz'
    }
  },
  {
    id: 'chm',
    label: 'CHM',
    pi: 'Carmen Barba',
    country: 'Italy',
    city: 'Florence',
    logo: '/participating-centers/chm__logo.png',
    description: "Children's Hospital Meyer",
    website: 'https://www.meyer.it/index.php/en/',
    socialnetwork: {
      twitter: 'https://twitter.com/fondazionemeyer',
      youtube: '',
      facebook: 'https://www.facebook.com/fondazione.meyer',
      instagram: 'https://www.instagram.com/fondazionemeyer/'
    },
    community: {
      url: '/call/gosbe3ix'
    }
  },
  {
    id: 'chuga',
    label: 'CHUGA',
    pi: 'Philippe Kahane',
    country: 'France',
    city: 'Grenoble',
    logo: '/participating-centers/chuga__logo.png',
    description: 'Le CHU Grenoble Alpes',
    website: 'https://www.chu-grenoble.fr/',
    socialnetwork: {
      twitter: 'https://twitter.com/chu_grenoble',
      youtube: 'https://www.youtube.com/user/CHUGrenoble'
    },
    community: {
      url: '/call/ifp8s389'
    }
  },
  {
    id: 'chu-lyon',
    label: 'CHU-LYON',
    pi: 'Alexis Arzimanoglou',
    country: 'France',
    city: 'Lyon',
    logo: '/participating-centers/chu-lyon__logo.png',
    description: 'Hospices Civils de Lyon (GHE-HCL)',
    website: 'https://www.chu-lyon.fr/',
    socialnetwork: {
      youtube: 'https://www.youtube.com/ChudeLyon',
      instagram: 'https://www.instagram.com/hospicescivilslyon/',
      twitter: 'https://twitter.com/chudelyon',
      facebook: 'https://www.facebook.com/CHUdeLyon/',
      linkedin: 'https://www.linkedin.com/company/hospices-civils-de-lyon/'
    },
    community: {
      url: '/call/9kdsiosv'
    }
  },
  {
    id: 'fnusa',
    label: 'FNUSA',
    pi: 'Milan Brazdil',
    country: 'Czech Republic',
    city: 'BRNO',
    logo: '/participating-centers/fnusa__logo.png',
    description: "St. Anne's University Hospital Czech Republic",
    website: 'https://www.fnusa.cz/en/hp/',
    socialnetwork: {},
    community: {
      url: '/call/kkj5uxdr'
    }
  },
  {
    id: 'hus',
    label: 'HUS',
    pi: 'Eeva-Liisa Metsähonkala',
    country: 'Finland',
    city: 'Helsinki',
    logo: '/participating-centers/hus__logo.png',
    description: 'Helsinki University Hospital (HUS)',
    website: 'https://www.hus.fi/en',
    socialnetwork: {
      youtube: 'https://www.youtube.com/channel/UChHLhcahbu3iv-2rN7Rg6Sw',
      instagram: 'https://www.instagram.com/hus_sairaala/',
      twitter: 'https://twitter.com/HUS_fi',
      facebook: 'https://www.facebook.com/HUS.fi',
      linkedin: 'https://www.linkedin.com/company/huslinkedin/'
    },
    community: {
      url: '/call/y88bty7s'
    }
  },
  {
    id: 'chru-s',
    label: 'CHRU-S',
    pi: 'Edouard Hirsch',
    country: 'France',
    city: 'Strasbourg',
    logo: '/participating-centers/chru-s__logo.png',
    description: 'Les Hôpitaux Universitaires de Strasbourg',
    website: 'https://www.chru-strasbourg.fr/',
    socialnetwork: {
      twitter: 'https://twitter.com/CHRUStrasbourg',
      instagram: 'https://www.instagram.com/chrustrasbourg/',
      facebook: 'https://www.facebook.com/CHRUStrasbourg/',
      linkedin:
        'https://www.linkedin.com/company/hopitaux-universitaires-de-strasbourg/',
      youtube: 'https://www.youtube.com/channel/UCmi2NODbFOehHubjQamZtAQ'
    },
    community: {
      url: '/call/krryfvt4'
    }
  },
  {
    id: 'ou-sse',
    label: 'OU-SSE',
    pi: 'Morten Lossius',
    country: 'Norway',
    city: 'Oslo',
    logo: '/participating-centers/ou-sse__logo.png',
    description:
      'The Norwegian National Unit for Epilepsy, Oslo universitetssykehus',
    website: 'https://oslo-universitetssykehus.no/',
    socialnetwork: {
      youtube: 'https://www.youtube.com/channel/UCRkdLJ014TTOXh8r8k6SciA',
      instagram: 'https://www.instagram.com/oushf/',
      twitter: 'https://twitter.com/oslounivsykehus',
      facebook: 'https://www.facebook.com/oslouniversitetssykehus',
      linkedin: 'https://www.linkedin.com/company/oslo-universitetssykehus/'
    },
    community: {
      url: '/call/avkmkup8'
    }
  },
  {
    id: 'psmar',
    label: 'PSMAR',
    pi: 'Rodrigo Rocamora Zuniga',
    country: 'Spain',
    city: 'Barcelona',
    logo: '/participating-centers/psmar__logo.png',
    description: 'Hospital del Mar-Parc de Salut Mar',
    website: 'https://www.parcdesalutmar.cat/en/',
    socialnetwork: {
      youtube: 'https://www.youtube.com/HospitaldelMarIMAS',
      instagram: 'https://www.instagram.com/hospitaldelmar/?hl=es',
      twitter: 'https://twitter.com/hospitaldelmar',
      linkedin:
        'https://www.linkedin.com/company/hospital-del-mar--parc-de-salut-mar/?originalSubdomain=es'
    },
    community: {
      url: '/call/8wccb3ye'
    }
  },
  {
    id: 'ucbl',
    label: 'UCBL',
    pi: 'Jean-Philippe Lachaux',
    country: 'France',
    city: 'Lyon',
    logo: '/participating-centers/lyon1__logo.png',
    description: 'Université Claude Bernard Lyon 1',
    website: 'https://www.univ-lyon1.fr/',
    socialnetwork: {
      youtube: 'https://www.youtube.com/UnivLyon1',
      instagram: 'https://www.instagram.com/univlyon1/',
      twitter: 'https://twitter.com/UnivLyon1',
      facebook: 'https://www.facebook.com/UnivLyon1'
    },
    community: {
      url: '/call/fkzbc29m'
    }
  },
  {
    id: 'umcu',
    label: 'UMCU',
    pi: 'Kees Braun',
    country: 'Netherlands',
    city: 'Utrecht',
    logo: '/participating-centers/umcu__logo.png',
    description:
      'University Medical Center Utrecht (Brain Center Rudolf Magnus)',
    website: 'https://www.umcutrecht.nl/en/',
    socialnetwork: {},
    community: {
      url: '/call/hph8xdzp'
    }
  },
  {
    id: 'abt',
    label: 'ABT',
    pi: 'Mehrdad Seirafi',
    country: 'Netherlands',
    city: 'Maastricht',
    logo: '/participating-centers/abt__logo.png',
    description: 'Alpha Brain Technologies',
    website: 'https://alphabrain.tech/',
    socialnetwork: {
      linkedin: 'https://www.linkedin.com/company/alphabraintech/'
    },
    community: {
      url: ''
    }
  },
  {
    id: 'unipd',
    label: 'UNIPD',
    pi: 'Maurizio Corbetta',
    country: 'Italy',
    city: 'Padova',
    logo: '/participating-centers/unipd__logo.png',
    description: 'University of Padova',
    website: 'https://www.unipd.it/en/',
    socialnetwork: {
      facebook: 'https://www.facebook.com/universitapadova/',
      instagram: 'https://www.instagram.com/unipd/',
      linkedin: 'https://www.linkedin.com/school/university-of-padova/',
      twitter: 'https://x.com/UniPadova',
      youtube: 'https://www.youtube.com/channel/UCxzGb4RIi935BkRG1KFjcfA'
    },
    community: {
      url: ''
    }
  },
  {
    id: 'dm',
    label: 'DM',
    pi: 'Faiçal Isbaine',
    country: 'France',
    city: 'Marchaux-Chaudefontaine',
    logo: '/participating-centers/dixi-medical__logo.png',
    description: 'DIXI Medical',
    website: 'https://diximedical.com/en/home',
    socialnetwork: {
      linkedin: 'https://fr.linkedin.com/company/dixi-medical'
    },
    community: {
      url: ''
    }
  },
  {
    id: 'cea',
    label: 'CEA',
    pi: 'Jean-François Mangin',
    country: 'France',
    city: 'Saclay',
    logo: '/participating-centers/cea__logo.png',
    description:
      "Commissariat à l'Énergie Atomique et aux Énergies Alternatives",
    website: 'https://www.cea.fr/',
    socialnetwork: {
      instagram: 'https://www.instagram.com/cea_officiel/',
      linkedin: 'https://www.linkedin.com/company/cea/',
      twitter: 'https://x.com/cea_officiel',
      youtube: 'https://www.youtube.com/@CEA'
    },
    community: {
      url: ''
    }
  },
  {
    id: 'hug',
    label: 'HUG',
    pi: 'Philippe Bijlenga',
    country: 'Switzerland',
    city: 'Genève',
    logo: '/participating-centers/hug__logo.png',
    description: 'Hôpitaux Universitaires Genève.',
    website: 'https://www.hug.ch/',
    socialnetwork: {
      instagram: 'https://www.instagram.com/hug_ge/',
      facebook: 'https://www.facebook.com/hopitaux.universitaires.geneve',
      linkedin:
        'https://www.linkedin.com/company/hopitaux-universitaires-de-geneve/posts/?feedView=all',
      twitter: 'https://x.com/hug_ge',
      youtube: 'https://www.youtube.com/user/KIOSKVIDEOHUG'
    },
    community: {
      url: ''
    }
  },
  {
    id: 'crer',
    label: 'CRER',
    pi: 'Carla Bentes',
    country: 'Portugal',
    city: 'Lisbon',
    logo: '/participating-centers/crer__logo.jpg',
    description: 'Centro de Referência de Epilepsias Refratárias',
    website: 'https://www.ulssm.min-saude.pt/',
    socialnetwork: {},
    community: {
      url: ''
    }
  },
  {
    id: 'ucf',
    label: 'UCF',
    pi: 'Refaat El-Said',
    country: 'USA',
    city: 'Orlando',
    logo: '/participating-centers/ucf__logo.png',
    description: 'University of Central Florida',
    website: 'https://www.ucf.edu/',
    socialnetwork: {
      facebook: 'https://www.facebook.com/UCF',
      twitter: 'https://x.com/UCF',
      youtube: 'https://www.youtube.com/user/UCF',
      instagram: 'https://www.instagram.com/ucf.edu/'
    },
    community: {
      url: ''
    }
  },
  {
    id: 'nr',
    label: 'NR',
    pi: 'Henri Lorach',
    country: 'Switzerland',
    city: 'Lausanne',
    logo: '/participating-centers/nr__logo.png',
    description: 'NeuroRestore at EPFL',
    website: 'https://www.neurorestore.swiss/',
    socialnetwork: {
      twitter: 'https://x.com/_NeuroRestore',
      linkedin: 'https://www.linkedin.com/company/neurorestore'
    },
    community: {
      url: ''
    }
  },
  {
    id: 'dukemed',
    label: 'DukeMed',
    pi: 'Birgit Frauscher',
    country: 'USA',
    city: 'Durham',
    logo: '/participating-centers/dukemed__logo.png',
    description: 'Duke University School of Medicine',
    website: 'https://medschool.duke.edu/',
    socialnetwork: {
      youtube: 'https://www.youtube.com/user/DukeMedSchool',
      twitter: 'https://x.com/DukeMedSchool',
      linkedin: 'https://www.linkedin.com/school/duke-med-school/'
    },
    community: {
      url: ''
    }
  },
  {
    id: 'kli',
    label: 'KLI',
    pi: 'Christoph Baumgartner',
    country: 'Austria',
    city: 'Vienna',
    logo: '/participating-centers/kli__logo.png',
    description:
      'The Karl Landsteiner Institute for Clinical Epilepsy Research and Cognitive Neurology',
    website:
      'https://www.karl-landsteiner.at/institute-epilepsieforschung.html',
    socialnetwork: {},
    community: {
      url: ''
    }
  },
  {
    id: 'upm',
    label: 'UPM',
    pi: 'Guillermo Velasco',
    country: 'Spain',
    city: 'Madrid',
    logo: '/participating-centers/upm__logo.png',
    description: 'Universidad Politécnica de Madrid',
    website: 'https://www.upm.es/',
    socialnetwork: {
      youtube: 'https://www.youtube.com/user/UPM',
      linkedin:
        'https://www.linkedin.com/school/universidad-politecnica-de-madrid/?originalSubdomain=es',
      instagram: 'https://www.instagram.com/somosupm/',
      facebook: 'https://www.facebook.com/universidadpolitecnicademadrid'
    },
    community: {
      url: ''
    }
  },
  {
    id: 'ceitec',
    label: 'CEITEC',
    pi: 'Milan Brázdil',
    country: 'Czech Republic',
    city: 'Brno',
    logo: '/participating-centers/ceitec__logo.png',
    description: 'Central European Institute of Technology, Masaryk University',
    website: 'https://www.ceitec.muni.cz',
    socialnetwork: {
      facebook: 'https://www.facebook.com/CEITEC',
      twitter: 'https://twitter.com/CEITEC',
      linkedin:
        'https://www.linkedin.com/company/ceitec---central-european-institute-of-technology'
    },
    community: {
      url: ''
    }
  },
  {
    id: 'unicatt',
    label: 'UNICATT',
    pi: 'Marco Perulli',
    country: 'Italy',
    city: 'Rome',
    logo: '/participating-centers/unicatt__logo.png',
    description: 'Università Cattolica del Sacro Cuore',
    website: 'https://www.unicatt.it/en.html',
    socialnetwork: {
      youtube: 'https://www.youtube.com/user/younicatt',
      linkedin: 'https://www.linkedin.com/school/unicatt/',
      instagram: 'https://www.instagram.com/unicatt/',
      facebook: 'https://www.facebook.com/unicatt',
      twitter: 'https://x.com/unicatt'
    },
    community: {
      url: ''
    }
  },
  {
    id: 'umfcd',
    label: 'UMFCD',
    pi: 'Ioana Mindruta',
    country: 'Romania',
    city: 'Bucharest',
    logo: '/participating-centers/umfcd__logo.png',
    description: 'University of Medicine and Pharmacy Carol Davila',
    website: 'https://umfcd.ro/',
    socialnetwork: {
      facebook: 'https://www.facebook.com/UMFCD'
    },
    community: {
      url: ''
    }
  },
  {
    id: 'umbal',
    label: 'UMBAL',
    pi: 'Krasimir Minkin',
    country: 'Bulgaria',
    city: 'Sofia',
    logo: '/participating-centers/umbal__logo.png',
    description: 'St. Ivan Rilski University Hospital',
    website: 'https://www.rilski.com',
    socialnetwork: {
      facebook: 'https://www.facebook.com/UMBALSvetiIvanRilski/'
    },
    community: {
      url: ''
    }
  },
  {
    id: 'su',
    label: 'SU',
    pi: 'Tatjana Liakina',
    country: 'Sweden',
    city: 'Gothenburg',
    logo: '/participating-centers/su__logo.png',
    description: 'Sahlgrenska University Hospital',
    website: 'https://www.sahlgrenska.se',
    socialnetwork: {},
    community: {
      url: ''
    }
  }
]
