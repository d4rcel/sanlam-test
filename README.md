Ce projet intègre un système d'authentification utilisateur. Il comprend la connexion, l'inscription et un tableau de bord protégé, utilisant TypeScript, Vuetify, Pinia, et le routage automatique. Les fonctionnalités clés incluent la validation des formulaires, la gestion de sessions, et des éléments d'interface dynamiques selon l'état d'authentification.


## Fonctionnalités

    - Connexion : Connexion par email/mot de passe avec fonction "Se souvenir de moi".
    - Inscription : Inscription utilisateur avec validation email, mot de passe et termes.
    - Tableau de Bord : Page protégée accessible après authentification.
    - Boutons Auth : Boutons dynamiques "Login/Sign Up" ou "Logout".
    - Gestion de Session : email "Se souvenir de moi" persistant.


## Prérequis

    - Node.js (v16+ recommandé)
    - npm (v8+ recommandé)


## Cloner le projet

```sh
git clone https://github.com/d4rcel/sanlam-test.git ou git clone git@github.com:d4rcel/sanlam-test.git si vous utiliser ssh
```

## Installer les dépendances

```sh
npm install
```

### Lancer le serveur de développement

```sh
npm run dev
```

## Utilisation

    - Accéder à l'application sur http://localhost:5173 (port Vite par défaut).
    - Inscrire un nouvel utilisateur à /register.
    - Se connecter à /login.
    - Voir le tableau de bord protégé à /dashboard.
    - Utiliser le bouton "Logout" pour se déconnecter.

## Structure du Projet

    - src/pages/ : login.vue, register.vue, dashboard.vue (pages à routage automatique).
    - src/@core/stores/auth.ts : Magasin Pinia pour l'état d'authentification.
    - src/layouts/components/ActionsButtons.vue : Boutons d'authentification dynamiques.
    - src/router/index.ts : Routeur avec gardes de navigation.

