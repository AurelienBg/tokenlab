export type Lang = 'fr' | 'en'

export const translations = {
  fr: {
    // Sidebar
    newProject: '+ Nouveau projet',
    recentProjects: 'Projets récents',
    noProjects: 'Aucun projet pour l\'instant.',
    createFirst: 'Créez votre premier projet !',
    allProjects: 'Tous les projets',
    lightMode: 'Mode jour',
    darkMode: 'Mode nuit',

    // Projects list page
    projectsTitle: 'Mes projets',
    projectsSubtitle: 'Structurez votre tokenomics post-workshop',
    createProject: 'Créer un projet',

    // New project form
    newProjectTitle: 'Nouveau projet',
    projectName: 'Nom du projet',
    projectNamePlaceholder: 'ex. MyProtocol',
    tokenTicker: 'Ticker du token',
    tokenTickerPlaceholder: 'ex. MYP',
    description: 'Description',
    descriptionPlaceholder: 'Décrivez votre projet en quelques mots…',
    blockchain: 'Blockchain cible',
    projectType: 'Type de projet',
    projectStage: 'Stade',
    create: 'Créer',
    cancel: 'Annuler',

    // ModuleShell
    save: 'Sauvegarder',
    markComplete: 'Marquer comme complet ✓',
    saved: '✓ Sauvegardé',
    backDashboard: '← Dashboard',

    // ModuleNav
    dashboard: 'Dashboard',
    coachIA: 'Coach IA',

    // Dashboard
    healthScore: 'Score de santé',
    globalProgress: 'Progression globale',
    modules: 'modules',
    moreAlerts: 'autres alertes — voir le Coach IA',
    modulesSection: 'Modules',
    complete: 'Complet',
    inProgress: 'En cours',
    empty: 'Vide',
    optional: 'optionnel',

    // Coach page
    coachTitle: 'Coach IA',
    coachSubtitle: 'Posez vos questions sur votre tokenomics',
    coachPlaceholder: 'Posez votre question…',
    coachSend: 'Envoyer',
    coachThinking: 'Le Coach réfléchit…',

    // Module labels
    modules_labels: {
      step0: { label: 'Token Decision Tree', shortLabel: 'Étape 0', description: 'Avez-vous vraiment besoin d\'un token ?' },
      m1: { label: 'Token Topology & Utility', shortLabel: 'Module 1', description: 'Type de token, utilité, standard technique' },
      m2: { label: 'Agents & Policies', shortLabel: 'Module 2', description: 'Qui interagit et selon quelles règles ?' },
      m3: { label: 'Value Flow (Sinks & Faucets)', shortLabel: 'Module 3', description: 'Sources et destructions de tokens' },
      m4: { label: 'Supply-Side & Emission', shortLabel: 'Module 4', description: 'Supply totale, modèle d\'émission' },
      m5: { label: 'Distribution & Allocation', shortLabel: 'Module 5', description: 'Répartition des tokens par catégorie' },
      m6: { label: 'Vesting & Sell Pressure', shortLabel: 'Module 6', description: 'Calendrier de déblocage, analyse de pression vendeuse' },
      m7: { label: 'TGE & Liquidity Strategy', shortLabel: 'Module 7', description: 'Lancement, pools DEX, market makers' },
      m8: { label: 'Governance', shortLabel: 'Module 8', description: 'Modèle de gouvernance, droits de vote' },
      m9: { label: 'Compliance', shortLabel: 'Module 9', description: 'MiCA, SEC, VARA — réglementation' },
    },
  },

  en: {
    // Sidebar
    newProject: '+ New project',
    recentProjects: 'Recent projects',
    noProjects: 'No projects yet.',
    createFirst: 'Create your first project!',
    allProjects: 'All projects',
    lightMode: 'Light mode',
    darkMode: 'Dark mode',

    // Projects list page
    projectsTitle: 'My projects',
    projectsSubtitle: 'Structure your post-workshop tokenomics',
    createProject: 'Create a project',

    // New project form
    newProjectTitle: 'New project',
    projectName: 'Project name',
    projectNamePlaceholder: 'e.g. MyProtocol',
    tokenTicker: 'Token ticker',
    tokenTickerPlaceholder: 'e.g. MYP',
    description: 'Description',
    descriptionPlaceholder: 'Describe your project in a few words…',
    blockchain: 'Target blockchain',
    projectType: 'Project type',
    projectStage: 'Stage',
    create: 'Create',
    cancel: 'Cancel',

    // ModuleShell
    save: 'Save',
    markComplete: 'Mark as complete ✓',
    saved: '✓ Saved',
    backDashboard: '← Dashboard',

    // ModuleNav
    dashboard: 'Dashboard',
    coachIA: 'AI Coach',

    // Dashboard
    healthScore: 'Health score',
    globalProgress: 'Overall progress',
    modules: 'modules',
    moreAlerts: 'more alerts — see AI Coach',
    modulesSection: 'Modules',
    complete: 'Complete',
    inProgress: 'In progress',
    empty: 'Empty',
    optional: 'optional',

    // Coach page
    coachTitle: 'AI Coach',
    coachSubtitle: 'Ask any questions about your tokenomics',
    coachPlaceholder: 'Ask your question…',
    coachSend: 'Send',
    coachThinking: 'The Coach is thinking…',

    // Module labels
    modules_labels: {
      step0: { label: 'Token Decision Tree', shortLabel: 'Step 0', description: 'Do you really need a token?' },
      m1: { label: 'Token Topology & Utility', shortLabel: 'Module 1', description: 'Token type, utility, technical standard' },
      m2: { label: 'Agents & Policies', shortLabel: 'Module 2', description: 'Who interacts and under what rules?' },
      m3: { label: 'Value Flow (Sinks & Faucets)', shortLabel: 'Module 3', description: 'Token sources and sinks' },
      m4: { label: 'Supply-Side & Emission', shortLabel: 'Module 4', description: 'Total supply, emission model' },
      m5: { label: 'Distribution & Allocation', shortLabel: 'Module 5', description: 'Token allocation by category' },
      m6: { label: 'Vesting & Sell Pressure', shortLabel: 'Module 6', description: 'Unlock schedule, sell pressure analysis' },
      m7: { label: 'TGE & Liquidity Strategy', shortLabel: 'Module 7', description: 'Launch, DEX pools, market makers' },
      m8: { label: 'Governance', shortLabel: 'Module 8', description: 'Governance model, voting rights' },
      m9: { label: 'Compliance', shortLabel: 'Module 9', description: 'MiCA, SEC, VARA — regulations' },
    },
  },
} as const

export type Translations = typeof translations['fr'] | typeof translations['en']
