# POC: Intégration Getting Started dans le Dashboard

**Date:** 2026-01-26
**Statut:** POC - En cours de définition
**Objectif:** Intégrer le contenu "getting-started" de la documentation CHORUS comme contenu de démarrage dans le dashboard

## Contexte

- Documentation source: https://docs.chorus-tre.ch/docs/user-guide/getting-started/
- Page cible: `src/app/(dashboard)/page.tsx`
- Objectif: Afficher le contenu "getting-started" quand l'utilisateur arrive sur le dashboard

## Approche POC

### Option 1: Section dédiée dans le dashboard

- Ajouter une section "Getting Started" en haut du dashboard
- Afficher le contenu de la documentation de manière intégrée
- Permettre de masquer/afficher cette section

### Option 2: Card/Modal avec contenu getting-started

- Afficher une card proéminente avec le contenu getting-started
- Visible surtout pour les nouveaux utilisateurs (première connexion)
- Bouton pour masquer,

### Option 3: Onglet ou section collapsible

- Ajouter un onglet "Getting Started" dans le dashboard
- Contenu accessible mais non-intrusif
- Permet de revenir consulter le guide à tout moment

## Questions techniques

1. Comment récupérer le contenu de la documentation ?

   - Scraper la page HTML ?
   - API de documentation si disponible ?
   - Contenu statique intégré ?
   - Iframe de la documentation ?
2. Où placer le composant dans le dashboard ?

   - En haut, avant "Activity Overview" ?
   - Dans une section dédiée à droite ?
   - Modal qui s'ouvre automatiquement pour nouveaux utilisateurs ?
3. Format du contenu

   - HTML brut de la documentation ?
   - Markdown rendu ?
   - Composants React personnalisés basés sur la structure ?

## Approche technique choisie

### Option retenue: Section dédiée en haut du dashboard

- Ajouter une section "Getting Started" juste après le titre "Dashboard" et le message de bienvenue
- Afficher le contenu de manière intégrée (pas d'iframe pour le POC)
- Section collapsible/dismissible pour ne pas encombrer le dashboard

### Structure proposée

```
Dashboard
├── Titre + Welcome message (existant)
├── [NOUVEAU] Getting Started Section
│   ├── Titre "Getting Started"
│   ├── Contenu de la documentation (4 étapes principales)
│   │   ├── Access the Dashboard
│   │   ├── Create a Workspace
│   │   ├── Open a Session
│   │   └── Launch an App
│   └── Bouton "Dismiss" / "Got it"
└── Activity Overview (existant)
    └── ... reste du dashboard
```

### Méthode de récupération du contenu

Pour le POC, deux options:

1. **Contenu statique intégré** (recommandé pour POC)

   - Extraire manuellement le contenu de la page getting-started
   - Créer un composant React avec le contenu structuré
   - Avantage: Pas de dépendance externe, rapide à implémenter
2. **Fetch dynamique** (si besoin)

   - Utiliser fetch() côté client pour récupérer le HTML
   - Parser et afficher le contenu
   - Avantage: Toujours à jour avec la documentation

### Composant à créer

- `components/getting-started-section.tsx`
  - Affiche les 4 étapes principales
  - Liens vers les actions correspondantes dans l'app
  - Bouton pour masquer la section (stockage dans localStorage)

## Prochaines étapes

1. ✅ Explorer la structure de la documentation CHORUS
2. ✅ Décider de la méthode de récupération du contenu (API avec fallback statique)
3. ✅ Créer le composant `GettingStartedSection`
4. ✅ Intégrer dans `src/app/(dashboard)/page.tsx`
5. ⏳ Tester avec différents scénarios utilisateur
6. ⏳ Implémenter le RAG local pour suggestions plus intelligentes

## Implémentation réalisée

### Composant créé: `src/components/getting-started-section.tsx`

**Fonctionnalités:**

- ✅ Récupération du contenu getting-started via API (avec fallback statique)
- ✅ Affichage des 4 étapes principales avec liens vers la documentation
- ✅ Système de suggestions AI personnalisées basé sur:
  - Rôle utilisateur (Researcher, WorkspaceMember, WorkspacePI, etc.)
  - Nombre de workspaces existants
  - Présence de sessions actives
- ✅ Suggestions contextuelles pour:
  - **Workspace**: Création de workspace pour chercheurs
  - **Data Policy**: Conformité avec les politiques de données
  - **Security**: Bonnes pratiques de sécurité pour données de recherche
  - **Resource**: Optimisation des ressources
  - **Best Practice**: Recommandations générales
- ✅ Section dismissible (stockage dans localStorage)
- ✅ Section collapsible pour réduire l'encombrement
- ✅ Badges de priorité (high, medium, low)
- ✅ Actions contextuelles (liens vers les pages pertinentes)

### Intégration dans le dashboard

- ✅ Composant intégré dans `src/app/(dashboard)/page.tsx`
- ✅ Positionné juste après le message de bienvenue
- ✅ Utilise les données réelles des workspaces et sessions depuis le store

### Mockup des suggestions AI

**Pour les chercheurs (Researcher/WorkspaceMember/WorkspacePI):**

1. **High Priority - Create First Workspace**

   - Affiché si workspaceCount === 0
   - Action: Lien vers `/workspaces`
2. **High Priority - Data Policy Compliance**

   - Toujours affiché pour les chercheurs
   - Focus sur: network policy "closed", encryption, data protection
   - Action: Lien vers documentation
3. **High Priority - Security Best Practices**

   - Toujours affiché pour les chercheurs
   - Recommandations: closed network, disable copy-paste, access controls
4. **Medium Priority - Start Session**

   - Affiché si workspaceCount > 0 && !hasActiveSessions
   - Action: Lien vers `/workspaces`
5. **Low Priority - Resource Optimization**

   - Affiché si workspaceCount > 2
   - Suggestion d'optimisation des ressources

### Architecture pour RAG local (prochaines étapes)

**Composants nécessaires:**

1. **Vector Store**: Stockage des embeddings de la documentation CHORUS

   - Utiliser un vecteur DB local (ex: Chroma, FAISS, ou simple in-memory)
   - Embeddings de la documentation getting-started et guides avancés
2. **Embedding Service**: Génération d'embeddings

   - Utiliser un modèle local (ex: sentence-transformers via Transformers.js)
   - Ou API externe (OpenAI, Cohere, etc.)
3. **RAG Pipeline**:

   ```
   User Context → Embedding → Similarity Search → Retrieve Relevant Docs → Generate Suggestions
   ```
4. **Context Enrichment**:

   - User roles & permissions
   - Workspace configurations existantes
   - Data policies applicables
   - Security requirements
   - Resource usage patterns
5. **Suggestion Engine**:

   - Combine retrieved docs + user context
   - Generate personalized suggestions
   - Rank by relevance and priority
   - Filter by user permissions

**Fichiers à créer:**

- `src/services/rag/vector-store.ts` - Gestion du vector store
- `src/services/rag/embedding-service.ts` - Génération d'embeddings
- `src/services/rag/retrieval-service.ts` - Recherche sémantique
- `src/services/rag/suggestion-generator.ts` - Génération de suggestions
- `src/hooks/use-rag-suggestions.ts` - Hook React pour utiliser le RAG
