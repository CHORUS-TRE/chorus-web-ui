# Référentiel Projet: Workspace Assistant avec Création Basée sur Documents

**Date de création:** 2026-01-26  
**Statut:** Idées de brainstorming - Référentiel pour développement futur

## Vision
Intégrer un assistant workspace qui lit la documentation CHORUS, permet l'upload de documents, et propose la création de workspaces basés sur ces documents (steward/guide intelligent).

## Contexte
- Documentation CHORUS: https://docs.chorus-tre.ch/docs/user-guide/getting-started/
- Plateforme existante: Système de création de workspaces avec upload de fichiers
- Objectif: Créer un "steward" intelligent qui guide les utilisateurs vers la création de workspaces appropriés

## Questions Clés (Starbursting)

### WHO (Personnes, parties prenantes, utilisateurs, équipes)
1. Qui sont les utilisateurs cibles de cet assistant ? (chercheurs cliniques, administrateurs, nouveaux utilisateurs ?)
2. Qui doit avoir accès à l'assistant et qui peut gérer les documents uploadés ?

### WHAT (Fonctionnalités, composants, résultats, exigences)
3. Quels types de documents l'assistant doit-il analyser ? (PDFs de protocoles, documents de recherche, spécifications techniques, documentation CHORUS ?)
4. Quelles informations extraire des documents pour proposer un workspace ? (besoins en ressources, type de projet, données sensibles, collaborateurs ?)
5. Quelles fonctionnalités l'assistant doit-il avoir ? (chat conversationnel, analyse de documents, suggestions automatiques, création guidée ?)

### WHERE (Emplacements, marchés, contextes, environnements)
6. Où l'assistant doit-il être accessible ? (dashboard principal, page de création de workspace, sidebar, modal flottant ?)
7. Où stocker les documents uploadés ? (dans un workspace temporaire, dans un espace dédié à l'assistant, dans le workspace créé ?)

### WHEN (Timing, planning, jalons, échéances)
8. Quand l'assistant doit-il intervenir ? (à la première connexion, lors de la création d'un workspace, à la demande, de manière proactive ?)
9. Quand analyser les documents ? (immédiatement après upload, en arrière-plan, à la demande de l'utilisateur ?)

### WHY (Objectif, motivation, bénéfices, justification)
10. Pourquoi créer cet assistant ? (réduire la courbe d'apprentissage, automatiser la configuration, guider les nouveaux utilisateurs, améliorer l'adoption ?)
11. Pourquoi baser la création de workspace sur des documents ? (extraction automatique de besoins, réduction d'erreurs, standardisation ?)

### HOW (Méthodes, processus, implémentation, mesure)
12. Comment l'assistant doit-il analyser les documents ? (LLM pour extraction, parsing structuré, recherche sémantique, templates prédéfinis ?)
13. Comment proposer des configurations de workspace ? (suggestions multiples, configuration unique optimale, questionnaire adaptatif basé sur les documents ?)
14. Comment intégrer l'assistant à l'architecture existante ? (nouveau composant React, extension du système d'assistants existant, service backend dédié ?)
15. Comment mesurer le succès de l'assistant ? (taux d'adoption, réduction du temps de création, satisfaction utilisateur, précision des suggestions ?)

## Solutions Créatives (SCAMPER)

### SUBSTITUTE (Remplacer)
1. **Remplacer l'upload manuel par une intégration avec des sources externes**: Au lieu de demander aux utilisateurs d'uploader des documents, l'assistant pourrait se connecter directement à des dépôts de documents (GitHub, Google Drive, SharePoint) ou scanner automatiquement les emails pour détecter des protocoles de recherche attachés. Cela élimine la friction de l'upload et permet une détection proactive de nouveaux projets.

2. **Remplacer les formulaires de création par une conversation naturelle**: Au lieu du formulaire traditionnel de création de workspace, l'assistant pourrait utiliser un chat conversationnel où l'utilisateur décrit son projet naturellement ("Je veux analyser des données génomiques pour une étude clinique") et l'assistant extrait les besoins et propose la configuration optimale, en s'appuyant sur les documents uploadés comme contexte supplémentaire.

### COMBINE (Combiner)
3. **Combiner l'assistant avec le système de documentation existant**: L'assistant pourrait être intégré directement dans la documentation CHORUS (comme un widget flottant) qui apparaît quand l'utilisateur lit les guides "Getting Started". Quand l'utilisateur arrive à la section "Create a Workspace", l'assistant propose automatiquement de l'aider en analysant ses documents ou en posant des questions guidées basées sur la documentation qu'il vient de lire.

4. **Combiner analyse de documents + historique utilisateur + templates communautaires**: L'assistant pourrait analyser non seulement les documents uploadés, mais aussi les workspaces précédents de l'utilisateur (ou de son organisation) et des templates populaires de la communauté CHORUS. Il propose alors une configuration qui combine ces trois sources d'intelligence, créant une suggestion personnalisée et éprouvée.

### ADAPT (Adapter)
5. **Adapter le concept de "wizard" multi-étapes avec intelligence contextuelle**: Créer un assistant qui fonctionne comme un wizard classique (étape 1: upload docs, étape 2: analyse, étape 3: suggestions), mais qui adapte dynamiquement les questions suivantes en fonction des réponses précédentes et du contenu des documents. Par exemple, si un document mentionne "GPU", l'assistant saute directement aux questions sur les ressources GPU au lieu de poser toutes les questions génériques.

6. **Adapter les assistants de code (GitHub Copilot) au contexte CHORUS**: S'inspirer de GitHub Copilot qui suggère du code en temps réel, l'assistant pourrait être un "CHORUS Copilot" qui suggère des configurations de workspace en temps réel pendant que l'utilisateur remplit le formulaire, en analysant les documents en arrière-plan et en proposant des auto-complétions intelligentes pour chaque champ.

### MODIFY/MAGNIFY (Modifier/Amplifier)
7. **Amplifier la proactivité de l'assistant avec des notifications intelligentes**: L'assistant ne se contente pas d'attendre que l'utilisateur vienne le chercher. Il analyse régulièrement les nouveaux documents uploadés dans les workspaces existants, détecte les patterns qui suggèrent qu'un nouveau workspace serait nécessaire (ex: un nouveau protocole de recherche dans un workspace de données), et envoie une notification proactive: "J'ai détecté un nouveau protocole. Voulez-vous que je crée un workspace dédié pour cette étude ?"

8. **Modifier l'interface pour rendre l'assistant omniprésent mais non-intrusif**: Au lieu d'un modal ou d'une page dédiée, l'assistant pourrait être une barre latérale collapsible qui apparaît sur toutes les pages pertinentes (dashboard, liste de workspaces, page de création). Il reste visible en arrière-plan, prêt à aider, mais ne prend pas le focus sauf si l'utilisateur l'active ou si une suggestion urgente est détectée.

### PUT TO OTHER USES (Autres utilisations)
9. **Utiliser l'assistant comme outil de migration et d'onboarding**: L'assistant pourrait analyser des documents de projets existants (hors CHORUS) pour aider à migrer des projets vers CHORUS. Par exemple, un chercheur upload un document de projet existant avec des spécifications d'infrastructure, et l'assistant propose non seulement la création d'un workspace, mais aussi un plan de migration étape par étape, en s'appuyant sur la documentation CHORUS pour guider le processus.

10. **Utiliser l'assistant comme système de recommandation de ressources**: Au-delà de la création de workspace, l'assistant pourrait analyser les documents pour recommander des sessions, des apps, ou des outils CHORUS pertinents. Par exemple, si un document mentionne "analyse statistique avec R", l'assistant suggère de lancer une session RStudio dans le workspace créé, ou de consulter la documentation sur les apps disponibles.

### ELIMINATE (Éliminer)
11. **Éliminer le besoin de comprendre la configuration technique**: L'assistant pourrait masquer complètement les détails techniques (CPU, mémoire, storage) et ne demander que des informations métier compréhensibles ("Combien de collaborateurs ?", "Type de données sensibles ?", "Besoin de calcul intensif ?"). Il traduit ensuite ces réponses en configuration technique optimale, en s'appuyant sur les documents pour inférer les besoins non exprimés.

12. **Éliminer l'étape de création manuelle avec génération automatique**: Au lieu de proposer des suggestions que l'utilisateur doit approuver et créer manuellement, l'assistant pourrait créer automatiquement un workspace "brouillon" basé sur l'analyse des documents, et permettre à l'utilisateur de le personnaliser ensuite. Cela inverse le flux: au lieu de "créer puis configurer", c'est "configurer automatiquement puis ajuster".

### REVERSE/REARRANGE (Inverser/Réorganiser)
13. **Inverser le flux: workspace d'abord, documents ensuite**: Au lieu d'uploader des documents puis créer un workspace, l'assistant pourrait d'abord guider la création d'un workspace minimal via une conversation rapide, puis analyser les documents uploadés dans ce workspace pour suggérer des optimisations et des ajustements de configuration. Cela permet de démarrer rapidement tout en bénéficiant de l'intelligence documentaire.

14. **Réorganiser l'assistant comme un "coach" plutôt qu'un "créateur"**: L'assistant ne crée pas directement les workspaces, mais guide l'utilisateur à travers le processus en posant des questions socrating et en expliquant pourquoi chaque configuration est importante. Il s'appuie sur la documentation CHORUS pour fournir des explications contextuelles, transformant la création de workspace en une expérience d'apprentissage plutôt qu'une simple tâche administrative.
