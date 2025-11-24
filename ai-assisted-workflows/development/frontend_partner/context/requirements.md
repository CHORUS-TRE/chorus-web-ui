# Requirements for Frontend Application

## 1. Objective

This document outlines the user requirements for the development of the Chorus frontend application. The goal is to enhance performance, improve user experience through customization and clear workflows, and provide robust administrative features for security and monitoring.

## 3. User Requirements

| ID    | User Story                                                                                                                                                    | Priority | Success Criteria                                                                                              |
| :---- | :------------------------------------------------------------------------------------------------------------------------------------------------------------ | :------- | :------------------------------------------------------------------------------------------------------------ |
| UR.1  | En tant qu'utilisateur, je souhaite que l'application se charge rapidement lorsque je démarre une session, afin de pouvoir commencer mon travail sans délai.         | high     | Temps de chargement initial de l'application inférieur à 5 secondes.                                               |
| UR.2  | En tant qu'utilisateur, je souhaite pouvoir téléverser des fichiers volumineux (plus de 50 Go), afin de pouvoir travailler avec de grands ensembles de données.     | high     | Téléversement de fichiers jusqu'à 100 Go réussi sans interruption et avec un retour visuel sur la progression. |
| UR.3  | En tant qu'utilisateur, lorsque je rencontre une erreur, je souhaite voir un message clair et compréhensible, afin de savoir ce qui s'est passé.                  | normal   | Les messages d'erreur expliquent la nature du problème et suggèrent une action à l'utilisateur.              |
| UR.4  | En tant qu'administrateur, je souhaite disposer d'un assistant pour créer un workspace, me permettant de configurer des options (stockage, sécurité).             | high     | L'assistant de création permet de configurer le type de stockage et les permissions (presse-papiers).      |
| UR.5  | En tant qu'administrateur, je souhaite pouvoir personnaliser le logo et le thème de l'application, afin de correspondre à l'identité de mon organisation.        | normal   | L'interface d'administration permet de téléverser un logo et de sélectionner des couleurs primaires/secondaires. |
| UR.6  | En tant qu'utilisateur, je souhaite voir un tableau de bord personnel (workspaces, activité récente, notifications), afin de reprendre rapidement mon travail.    | high     | Le tableau de bord affiche les 5 workspaces les plus récents et les 10 dernières notifications.            |
| UR.7  | En tant qu'utilisateur, je souhaite consulter un répertoire de tous les workspaces publics, afin de découvrir d'autres projets et d'avoir une vue d'ensemble. | normal   | La page de répertoire des workspaces permet de filtrer par tags (projet, centre).                          |
| UR.8  | En tant qu'utilisateur, je souhaite pouvoir transférer des fichiers de manière sécurisée entre mes workspaces, afin de gérer mes données efficacement.          | high     | Le transfert de fichiers entre workspaces s'effectue sans avoir à les télécharger localement.                |
| UR.9  | En tant qu'utilisateur, je souhaite pouvoir demander une autorisation pour télécharger des fichiers spécifiques sur mon ordinateur local.                           | high     | Le système envoie une notification à l'approbateur désigné avec les détails de la demande.                  |
| UR.10 | En tant qu'approbateur, je souhaite recevoir, examiner et valider (ou refuser) les demandes de téléchargement de données.                                        | high     | L'interface d'approbation permet de visualiser les fichiers demandés et de valider/refuser en un clic.       |
| UR.11 | En tant qu'administrateur, je souhaite pouvoir consulter et interroger un journal d'audit de toutes les actions sensibles, afin de surveiller la plateforme.   | high     | L'interface d'audit permet de filtrer les événements par utilisateur, type d'action et période.          |
| UR.12 | En tant qu'utilisateur, je souhaite que les applications ouvertes conservent leur état lorsque je navigue, afin de ne pas perdre mon travail.                | high     | Les composants contenant les iframes des applications ne sont pas retirés du DOM lors de la navigation.   |
| UR.13 | En tant qu'administrateur, je souhaite disposer d'une interface pour gérer les rôles et permissions des utilisateurs, afin de contrôler les accès.           | high     | L'interface permet de créer, modifier et assigner des rôles avec des permissions granulaires.           |
| UR.14 | En tant qu'utilisateur, je souhaite accéder à une page dédiée listant tous les workspaces auxquels j'ai accès, afin de naviguer facilement.                   | normal   | La page "Mes Données" liste tous les workspaces de l'utilisateur avec des options de tri et de recherche. |
| UR.15 | En tant qu'utilisateur, je souhaite une navigation claire pour basculer entre les applications ouvertes, afin que seule l'application active soit visible.      | high     | Un système d'onglets ou de fenêtrage permet de gérer les applications ouvertes sans qu'elles se superposent. |
| UR.16 | En tant qu'utilisateur, je souhaite que l'interface soit responsive, afin de pouvoir utiliser l'application sur des appareils mobiles.                       | normal   | L'application est utilisable sur des écrans d'une largeur minimale de 360px.                               |
| UR.17 | En tant qu'administrateur, je souhaite une interface dédiée pour gérer les workspaces (éditer, supprimer), afin d'administrer les projets.                     | high     | Une interface d'administration permet d'éditer les propriétés d'un workspace et de le supprimer.          |

## 4. Assumptions

- Les utilisateurs ont une compréhension de base de la gestion de fichiers et des workspaces.
- L'infrastructure backend est capable de supporter les opérations de transfert et de gestion de fichiers volumineux.
- Un système d'authentification et de gestion des rôles est déjà en place pour distinguer les utilisateurs, administrateurs et approbateurs.

## 5. Out of Scope

- La mise en place de l'infrastructure backend pour le stockage et la gestion des permissions.
- La définition détaillée des politiques de sécurité et de gouvernance des données.
- Le développement de l'intégralité du système de notifications (seules les notifications liées aux demandes de téléchargement sont concernées).

## 6. Approvals

| Role                | Name | Date | Sign-off Criteria                                       |
| :------------------ | :--- | :--- | :------------------------------------------------------ |
| Product Owner       |      |      | Les exigences sont alignées avec les besoins des utilisateurs. |
| Tech Lead           |      |      | Les exigences sont techniquement réalisables.           |
