'use client'

import {
  AlertTriangle,
  BarChart3,
  BookOpen,
  CheckCircle,
  Clock,
  Database,
  FileText,
  FlaskConical,
  Heart,
  Microscope,
  Settings,
  Shield,
  Target,
  Users
} from 'lucide-react'
import React, { useState } from 'react'

import { Link } from '@/components/link'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const ProtocolDashboard = () => {
  const [completedSections, setCompletedSections] = useState(new Set())

  const protocolSections = [
    {
      id: 'title',
      title: 'Titre',
      description: 'Il doit être descriptif et concis',
      icon: FileText,
      category: 'structure',
      required: true,
      tips: [
        'Utilisez un langage clair',
        'Maximum 20 mots',
        'Évitez les abréviations'
      ]
    },
    {
      id: 'general-info',
      title: 'Informations Générales',
      description: 'En-tête, promoteur, directeur de projet',
      icon: Settings,
      category: 'structure',
      required: true,
      tips: [
        'Logo de votre institution',
        'CHUV comme promoteur',
        'Signature manuscrite requise'
      ]
    },
    {
      id: 'context',
      title: 'Contexte',
      description: 'Littérature et justification de la recherche',
      icon: BookOpen,
      category: 'scientific',
      required: true,
      tips: [
        'Résumez la littérature existante',
        'Identifiez les lacunes',
        "Justifiez l'impact potentiel"
      ]
    },
    {
      id: 'objectives',
      title: 'Design, objectifs et critères',
      description: 'Objectifs primaire, secondaires et exploratoires',
      icon: Target,
      category: 'scientific',
      required: true,
      tips: [
        'Un seul objectif primaire recommandé',
        "Critères d'évaluation alignés",
        'Design approprié'
      ]
    },
    {
      id: 'statistics',
      title: "Taille d'échantillon et analyses",
      description: "Calculs statistiques et méthodes d'analyse",
      icon: BarChart3,
      category: 'methodology',
      required: true,
      tips: [
        "Justifiez la taille d'échantillon",
        'Précisez les méthodes statistiques',
        'Analyses pour chaque critère'
      ]
    },
    {
      id: 'procedures',
      title: "Procédures de l'étude",
      description: 'Durée, séquence des procédures, visites',
      icon: Clock,
      category: 'methodology',
      required: true,
      tips: [
        'Tableau résumant les visites',
        'Fenêtres acceptables entre visites',
        'Temps estimé par visite'
      ]
    },
    {
      id: 'recruitment',
      title: 'Recrutement et consentement',
      description: 'Processus de recrutement et formulaires',
      icon: Users,
      category: 'ethics',
      required: true,
      tips: [
        'Délai minimum 24h de réflexion',
        'Signature en présence du patient',
        'Copie signée pour le patient'
      ]
    },
    {
      id: 'data-management',
      title: 'Format et collecte des données',
      description: 'Sources, bases de données, protection',
      icon: Database,
      category: 'data',
      required: true,
      tips: [
        'Données codées',
        'Serveur sécurisé CHUV',
        "Conservation jusqu'à 10 ans"
      ]
    },
    {
      id: 'biosamples',
      title: 'Échantillons biologiques',
      description: 'Stockage et conservation des échantillons',
      icon: Microscope,
      category: 'data',
      required: false,
      tips: [
        'Conditions de stockage',
        'Durée de conservation',
        'Transfert en biobanque'
      ]
    }
  ]

  const studyTypes = {
    Ch2: {
      name: 'Collecte prospective',
      description: 'Données/échantillons collectés de manière prospective',
      color: 'bg-blue-50 border-blue-200',
      requirements: [
        'Période de recrutement définie',
        'Durée par participant',
        'Consentement spécifique'
      ]
    },
    Ch3: {
      name: 'Collecte rétrospective',
      description: 'Utilisation de données existantes',
      color: 'bg-green-50 border-green-200',
      requirements: [
        'Date de début de collecte',
        'Consentement général possible',
        'Évaluation des patients éligibles'
      ]
    }
  }

  const ethicsChecklist = [
    { item: 'Protocole signé manuscritement', required: true },
    { item: 'Synopsis si > 20 pages', required: true },
    { item: 'Contact COB si registre mentionné', required: false },
    { item: 'DTA/MTA si échange de données', required: false },
    { item: 'Consentement général validé (Ch3)', required: false },
    { item: 'Information spécifique projet', required: true }
  ]

  const toggleSection = (sectionId: number) => {
    const newCompleted = new Set(completedSections)
    if (newCompleted.has(sectionId)) {
      newCompleted.delete(sectionId)
    } else {
      newCompleted.add(sectionId)
    }
    setCompletedSections(newCompleted)
  }

  const progress = (completedSections.size / protocolSections.length) * 100
  const requiredSections = protocolSections.filter((s) => s.required)
  const completedRequired = requiredSections.filter((s) =>
    completedSections.has(s.id)
  ).length

  const StatCard = ({
    title,
    value,
    subtitle,
    bgColor = 'card-glass'
  }: {
    title: string
    value: string
    subtitle: string
    bgColor: string
  }) => (
    <Card
      className={`relative overflow-hidden ${bgColor} transition-all hover:border-accent/50 hover:bg-background/80`}
    >
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm font-medium">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {subtitle && (
          <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>
        )}
      </CardContent>
    </Card>
  )

  return (
    <div className="m-16">
      <div className="w-full">
        <Breadcrumb className="mb-4">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/" variant="nav">
                  CHORUS
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/lab" variant="nav">
                  Sandbox
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>CHORUS Protocol Builder</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex items-center justify-between gap-3">
          <h2 className="mb-8 mt-5 flex w-full flex-row items-center gap-3 text-start">
            <FlaskConical className="h-9 w-9" />
            Guide de Rédaction de Protocole de Recherche
          </h2>
        </div>
      </div>

      <div className="w-full space-y-6">
        {/* Header */}
        <div className="mb-8 space-y-3">
          <p className="max-w-2xl text-muted">
            Dashboard interactif pour créer un protocole de recherche conforme
            aux standards CHUV et CER-VD
          </p>
        </div>

        {/* Progress Overview */}
        <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
          <StatCard
            title="Progression globale"
            value={`${Math.round(progress)}%`}
            subtitle={`${completedSections.size}/${protocolSections.length} sections`}
            bgColor="card-glass"
          />
          <StatCard
            title="Sections obligatoires"
            value={`${completedRequired}/${requiredSections.length}`}
            subtitle="sections critiques"
            bgColor="card-glass"
          />
          <StatCard
            title="Temps estimé"
            value="2-4h"
            subtitle="pour un protocole complet"
            bgColor="card-glass"
          />
          <StatCard
            title="Conformité CER"
            value={
              completedRequired === requiredSections.length ? '✓' : 'En cours'
            }
            subtitle="validation éthique"
            bgColor="card-glass"
          />
        </div>

        {/* Progress Bar */}
        <Card className="card-glass mb-6">
          <CardContent className="p-6">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium">
                Avancement du protocole
              </span>
              <span className="text-sm text-muted-foreground">
                {Math.round(progress)}% terminé
              </span>
            </div>
            <Progress value={progress} className="h-3" />
          </CardContent>
        </Card>

        <Tabs defaultValue="workflow" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="workflow">Workflow</TabsTrigger>
            <TabsTrigger value="sections">Sections</TabsTrigger>
            <TabsTrigger value="types">Types d&apos;études</TabsTrigger>
            <TabsTrigger value="ethics">Éthique</TabsTrigger>
            <TabsTrigger value="tips">Conseils</TabsTrigger>
          </TabsList>

          <TabsContent value="workflow" className="space-y-6">
            <div className="grid gap-4">
              {protocolSections.map((section, idx) => (
                <Card
                  key={section.id}
                  className={`card-glass transition-all duration-200 ${
                    completedSections.has(section.id)
                      ? 'border-accent hover:border-accent/70'
                      : 'hover:border-accent/50 hover:bg-background/80'
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="mt-1 flex-shrink-0">
                        <div className="flex items-center gap-3">
                          <span className="w-6 text-sm font-bold text-muted-foreground">
                            {idx + 1}
                          </span>
                          <section.icon className="h-5 w-5 text-accent" />
                        </div>
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="mb-1 flex items-center gap-2 font-semibold">
                              {section.title}
                              {section.required && (
                                <Badge
                                  variant="destructive"
                                  className="text-xs"
                                >
                                  Obligatoire
                                </Badge>
                              )}
                            </h3>
                            <p className="mb-3 text-sm text-muted-foreground">
                              {section.description}
                            </p>

                            {section.tips && (
                              <div className="space-y-1">
                                <p className="text-xs font-medium">
                                  💡 Conseils:
                                </p>
                                {section.tips.map((tip, tipIdx) => (
                                  <p
                                    key={tipIdx}
                                    className="pl-4 text-xs text-muted-foreground"
                                  >
                                    • {tip}
                                  </p>
                                ))}
                              </div>
                            )}
                          </div>

                          <div className="ml-4 flex items-center gap-2">
                            <Checkbox
                              checked={completedSections.has(section.id)}
                              onCheckedChange={() =>
                                toggleSection(Number(section.id))
                              }
                            />
                            {completedSections.has(section.id) && (
                              <CheckCircle className="h-5 w-5 text-green-600" />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="sections" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {['structure', 'scientific', 'methodology', 'ethics', 'data'].map(
                (category) => {
                  const sectionsInCategory = protocolSections.filter(
                    (s) => s.category === category
                  )
                  const categoryNames = {
                    structure: 'Structure du document',
                    scientific: 'Fondements scientifiques',
                    methodology: 'Méthodologie',
                    ethics: 'Aspects éthiques',
                    data: 'Gestion des données'
                  }

                  return (
                    <Card
                      key={category}
                      className="card-glass transition-all hover:border-accent/50 hover:bg-background/80"
                    >
                      <CardHeader>
                        <CardTitle className="text-sm">
                          {
                            categoryNames[
                              category as keyof typeof categoryNames
                            ]
                          }
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        {sectionsInCategory.map((section) => (
                          <div
                            key={section.id}
                            className={`flex items-center gap-2 rounded p-2 text-sm ${
                              completedSections.has(section.id)
                                ? 'bg-accent/20 text-accent'
                                : 'bg-muted/20 text-muted-foreground'
                            }`}
                          >
                            <section.icon className="h-4 w-4" />
                            <span className="flex-1">{section.title}</span>
                            {completedSections.has(section.id) && (
                              <CheckCircle className="h-4 w-4" />
                            )}
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  )
                }
              )}
            </div>
          </TabsContent>

          <TabsContent value="types" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {Object.entries(studyTypes).map(([code, type]) => (
                <Card
                  key={code}
                  className="card-glass transition-all hover:border-accent/50 hover:bg-background/80"
                >
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className="border-accent text-accent"
                      >
                        {code}
                      </Badge>
                      {type.name}
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">
                      {type.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="mb-2 text-sm font-medium">
                        Exigences spécifiques:
                      </p>
                      {type.requirements.map((req, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 text-sm text-muted-foreground"
                        >
                          <CheckCircle className="h-4 w-4 text-accent" />
                          {req}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="ethics" className="space-y-6">
            <Card className="card-glass transition-all hover:border-accent/50 hover:bg-background/80">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-accent" />
                  Checklist Éthique et Réglementaire
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Vérifications obligatoires avant soumission à la CER-VD
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {ethicsChecklist.map((check, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 rounded-lg bg-muted/20 p-3"
                    >
                      <Checkbox />
                      <span className="flex-1 text-sm">{check.item}</span>
                      {check.required && (
                        <Badge variant="destructive" className="text-xs">
                          Obligatoire
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>

                <Alert className="card-glass mt-6">
                  <AlertTriangle className="h-4 w-4 text-accent" />
                  <AlertDescription className="">
                    <strong>Important:</strong> Le protocole doit comporter une
                    signature originale manuscrite. Pour les mineurs, vérifiez
                    les tranches d&apos;âge et utilisez les modèles appropriés
                    selon&apos; swissethics.&quot;
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-2">
              <Card className="card-glass transition-all hover:border-accent/50 hover:bg-background/80">
                <CardHeader>
                  <CardTitle className="">Contacts Importants</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="text-muted-foreground">
                    <strong className="">Promoteur CHUV:</strong> bpr@chuv.ch
                  </div>
                  <div className="text-muted-foreground">
                    <strong className="">Affaires juridiques:</strong>{' '}
                    contrats.afi@chuv.ch
                  </div>
                  <div className="text-muted-foreground">
                    <strong className="">COB (registres):</strong>{' '}
                    Info.cob@chuv.ch
                  </div>
                  <div className="text-muted-foreground">
                    <strong className="">Data Science:</strong> Évaluation
                    patients éligibles
                  </div>
                  <div className="text-muted-foreground">
                    <strong className="">UCR:</strong> Unité du consentement à
                    la recherche
                  </div>
                </CardContent>
              </Card>

              <Card className="card-glass transition-all hover:border-accent/50 hover:bg-background/80">
                <CardHeader>
                  <CardTitle className="">Versions et Numérotation</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Badge
                      variant="outline"
                      className="border-accent text-accent"
                    >
                      v0.1
                    </Badge>
                    Rédaction initiale
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Badge
                      variant="outline"
                      className="border-accent text-accent"
                    >
                      v1.0
                    </Badge>
                    Première soumission CER
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Badge
                      variant="outline"
                      className="border-accent text-accent"
                    >
                      v1.1+
                    </Badge>
                    Révisions post-évaluation
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="tips" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="card-glass transition-all hover:border-accent/50 hover:bg-background/80">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5 text-accent" />
                    Bonnes Pratiques
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="text-muted-foreground">
                    📝 <strong className="">Langage:</strong> Simple, clair,
                    direct - évitez le jargon
                  </div>
                  <div className="text-muted-foreground">
                    🎯 <strong className="">Objectifs:</strong> Un seul objectif
                    primaire recommandé
                  </div>
                  <div className="text-muted-foreground">
                    ⏱️ <strong className="">Délais:</strong> 24h minimum de
                    réflexion pour les patients
                  </div>
                  <div className="text-muted-foreground">
                    💾 <strong className="">Données:</strong> Toujours sur
                    serveur sécurisé CHUV
                  </div>
                  <div className="text-muted-foreground">
                    📋 <strong className="">Visites:</strong> Tableaux
                    récapitulatifs + fenêtres temporelles
                  </div>
                  <div className="text-muted-foreground">
                    🔒 <strong className="">Sécurité:</strong> Données codées,
                    accès limité à l&apos;équipe
                  </div>
                </CardContent>
              </Card>

              <Card className="card-glass transition-all hover:border-accent/50 hover:bg-background/80">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-accent" />
                    Pièges à Éviter
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-muted-foreground">
                  <div>❌ Signature avant présence du patient</div>
                  <div>❌ Sauvegarde sur clé USB/disque personnel</div>
                  <div>❌ Multiplier les objectifs primaires</div>
                  <div>
                    ❌ Oublier la justification de taille d&apos;échantillon
                  </div>
                  <div>❌ Incohérences protocole &harr; consentement</div>
                  <div>❌ Version finale sans signature manuscrite</div>
                </CardContent>
              </Card>
            </div>

            <Card className="card-glass transition-all hover:border-accent/50 hover:bg-background/80">
              <CardHeader>
                <CardTitle className="">Phrase d&apos;or</CardTitle>
              </CardHeader>
              <CardContent>
                <Alert className="card-glass">
                  <BookOpen className="h-4 w-4 text-accent" />
                  <AlertDescription className="text-base italic">
                    &quot;Utilisez un langage simple facile à comprendre. Vous
                    êtes les experts, simplifiez pour que le protocole soit
                    compréhensible ; Favorisez une formulation claire et directe
                    ; GET TO THE POINT ! Ne surchargez pas le texte...&quot;
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default ProtocolDashboard
