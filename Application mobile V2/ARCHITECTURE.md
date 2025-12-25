# Architecture de l'Application Mobile - Santé Mentale Étudiante

## 1. Structure de Navigation

### 1.1 Root Navigator (AppNavigator)
```
AppNavigator (Stack)
├── AuthStack (Stack Navigator)
│   ├── OnboardingScreen
│   ├── WelcomeScreen
│   ├── LoginScreen
│   └── RegisterScreen
│
└── MainStack (Stack Navigator)
    └── MainTabs (Bottom Tab Navigator)
        ├── HomeTab (Stack)
        │   ├── HomeScreen
        │   ├── MoodEntryScreen
        │   ├── MoodHistoryScreen
        │   └── MoodDetailScreen
        │
        ├── ActivitiesTab (Stack)
        │   ├── ActivitiesScreen
        │   ├── ActivityDetailScreen
        │   ├── ActivitySessionScreen
        │   └── CustomActivityScreen
        │
        ├── JournalTab (Stack)
        │   ├── JournalListScreen
        │   ├── JournalEntryScreen
        │   ├── JournalDetailScreen
        │   └── JournalSearchScreen
        │
        ├── ResourcesTab (Stack)
        │   ├── ResourcesScreen
        │   ├── ResourceDetailScreen
        │   ├── EmergencyContactsScreen
        │   └── BreathingExerciseScreen
        │
        └── ProfileTab (Stack)
            ├── ProfileScreen
            ├── SettingsScreen
            ├── PrivacyScreen
            ├── DataExportScreen
            └── AboutScreen
```

## 2. Liste des Screens avec Route Names

### 2.1 Authentication Flow
| Screen | Route Name | Description |
|--------|-----------|-------------|
| Onboarding | `Onboarding` | Introduction et présentation de l'app |
| Welcome | `Welcome` | Écran d'accueil pré-authentification |
| Login | `Login` | Connexion (avec PIN/biométrie) |
| Register | `Register` | Création de compte utilisateur |

### 2.2 Home Tab
| Screen | Route Name | Description |
|--------|-----------|-------------|
| Home | `Home` | Dashboard principal avec résumé |
| Mood Entry | `MoodEntry` | Saisie rapide de l'humeur |
| Mood History | `MoodHistory` | Historique des humeurs |
| Mood Detail | `MoodDetail` | Détails d'une entrée d'humeur |

### 2.3 Activities Tab
| Screen | Route Name | Description |
|--------|-----------|-------------|
| Activities | `Activities` | Liste des activités thérapeutiques |
| Activity Detail | `ActivityDetail` | Détails d'une activité |
| Activity Session | `ActivitySession` | Session active d'une activité |
| Custom Activity | `CustomActivity` | Création d'activité personnalisée |

### 2.4 Journal Tab
| Screen | Route Name | Description |
|--------|-----------|-------------|
| Journal List | `JournalList` | Liste des entrées de journal |
| Journal Entry | `JournalEntry` | Création/édition d'entrée |
| Journal Detail | `JournalDetail` | Affichage d'une entrée |
| Journal Search | `JournalSearch` | Recherche dans le journal |

### 2.5 Resources Tab
| Screen | Route Name | Description |
|--------|-----------|-------------|
| Resources | `Resources` | Ressources et guides |
| Resource Detail | `ResourceDetail` | Détails d'une ressource |
| Emergency Contacts | `EmergencyContacts` | Contacts d'urgence |
| Breathing Exercise | `BreathingExercise` | Exercice de respiration guidée |

### 2.6 Profile Tab
| Screen | Route Name | Description |
|--------|-----------|-------------|
| Profile | `Profile` | Profil utilisateur |
| Settings | `Settings` | Paramètres de l'application |
| Privacy | `Privacy` | Paramètres de confidentialité |
| Data Export | `DataExport` | Export des données |
| About | `About` | À propos de l'application |

## 3. Structure de Dossiers

```
src/
├── navigation/
│   ├── AppNavigator.tsx           # Root navigator
│   ├── AuthNavigator.tsx          # Stack d'authentification
│   ├── MainNavigator.tsx          # Stack principal
│   ├── TabNavigator.tsx           # Bottom tab navigator
│   ├── HomeStack.tsx              # Stack pour l'onglet Home
│   ├── ActivitiesStack.tsx        # Stack pour l'onglet Activities
│   ├── JournalStack.tsx           # Stack pour l'onglet Journal
│   ├── ResourcesStack.tsx         # Stack pour l'onglet Resources
│   ├── ProfileStack.tsx           # Stack pour l'onglet Profile
│   └── types.ts                   # Types TypeScript pour navigation
│
├── screens/
│   ├── auth/
│   │   ├── OnboardingScreen.tsx
│   │   ├── WelcomeScreen.tsx
│   │   ├── LoginScreen.tsx
│   │   └── RegisterScreen.tsx
│   │
│   ├── home/
│   │   ├── HomeScreen.tsx
│   │   ├── MoodEntryScreen.tsx
│   │   ├── MoodHistoryScreen.tsx
│   │   └── MoodDetailScreen.tsx
│   │
│   ├── activities/
│   │   ├── ActivitiesScreen.tsx
│   │   ├── ActivityDetailScreen.tsx
│   │   ├── ActivitySessionScreen.tsx
│   │   └── CustomActivityScreen.tsx
│   │
│   ├── journal/
│   │   ├── JournalListScreen.tsx
│   │   ├── JournalEntryScreen.tsx
│   │   ├── JournalDetailScreen.tsx
│   │   └── JournalSearchScreen.tsx
│   │
│   ├── resources/
│   │   ├── ResourcesScreen.tsx
│   │   ├── ResourceDetailScreen.tsx
│   │   ├── EmergencyContactsScreen.tsx
│   │   └── BreathingExerciseScreen.tsx
│   │
│   └── profile/
│       ├── ProfileScreen.tsx
│       ├── SettingsScreen.tsx
│       ├── PrivacyScreen.tsx
│       ├── DataExportScreen.tsx
│       └── AboutScreen.tsx
│
├── components/
│   ├── common/
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   ├── Modal.tsx
│   │   ├── LoadingSpinner.tsx
│   │   ├── EmptyState.tsx
│   │   └── ErrorBoundary.tsx
│   │
│   ├── mood/
│   │   ├── MoodPicker.tsx
│   │   ├── MoodCard.tsx
│   │   ├── MoodChart.tsx
│   │   └── MoodScale.tsx
│   │
│   ├── journal/
│   │   ├── JournalCard.tsx
│   │   ├── JournalEditor.tsx
│   │   └── JournalTagInput.tsx
│   │
│   ├── activities/
│   │   ├── ActivityCard.tsx
│   │   ├── ActivityProgress.tsx
│   │   └── ActivityTimer.tsx
│   │
│   └── resources/
│       ├── ResourceCard.tsx
│       └── EmergencyContactCard.tsx
│
├── storage/
│   ├── asyncStorage.ts            # Wrapper pour AsyncStorage
│   ├── userStorage.ts             # Gestion des données utilisateur
│   ├── moodStorage.ts             # Gestion des entrées d'humeur
│   ├── journalStorage.ts          # Gestion du journal
│   ├── activityStorage.ts         # Gestion des activités
│   └── settingsStorage.ts         # Gestion des paramètres
│
├── models/
│   ├── User.ts                    # Modèle utilisateur
│   ├── Mood.ts                    # Modèle humeur
│   ├── Journal.ts                 # Modèle journal
│   ├── Activity.ts                # Modèle activité
│   ├── Resource.ts                # Modèle ressource
│   └── Settings.ts                # Modèle paramètres
│
├── theme/
│   ├── colors.ts                  # Palette de couleurs
│   ├── typography.ts              # Styles de texte
│   ├── spacing.ts                 # Espacements
│   ├── shadows.ts                 # Ombres
│   └── index.ts                   # Export du thème
│
├── utils/
│   ├── dateHelpers.ts             # Helpers pour les dates
│   ├── validation.ts              # Fonctions de validation
│   ├── encryption.ts              # Chiffrement des données sensibles
│   └── export.ts                  # Export de données
│
├── hooks/
│   ├── useAuth.ts                 # Hook d'authentification
│   ├── useMood.ts                 # Hook pour les humeurs
│   ├── useJournal.ts              # Hook pour le journal
│   ├── useActivities.ts           # Hook pour les activités
│   ├── useTheme.ts                # Hook pour le thème
│   └── useStorage.ts              # Hook pour le stockage
│
├── constants/
│   ├── routes.ts                  # Constantes de routes
│   ├── storageKeys.ts             # Clés AsyncStorage
│   └── config.ts                  # Configuration générale
│
└── types/
    └── index.ts                   # Types TypeScript globaux
```

## 4. Modèles de Données (TypeScript Interfaces)

### 4.1 User (Utilisateur)
```typescript
interface User {
  id: string;
  username: string;
  email?: string;
  createdAt: Date;
  lastLoginAt: Date;
  preferences: UserPreferences;
  profileCompleted: boolean;
}

interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  notificationsEnabled: boolean;
  biometricEnabled: boolean;
  reminderTime?: string; // HH:mm format
  reminderEnabled: boolean;
}
```

### 4.2 Mood (Humeur)
```typescript
interface MoodEntry {
  id: string;
  userId: string;
  mood: MoodType;
  intensity: number; // 1-10
  date: Date;
  notes?: string;
  tags: string[];
  location?: string;
  weather?: WeatherType;
  activities?: string[]; // IDs d'activités associées
  createdAt: Date;
  updatedAt: Date;
}

type MoodType = 
  | 'very_happy'
  | 'happy'
  | 'neutral'
  | 'sad'
  | 'very_sad'
  | 'anxious'
  | 'angry'
  | 'tired'
  | 'excited'
  | 'calm';

type WeatherType = 'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'stormy' | 'unknown';

interface MoodStatistics {
  averageMood: number;
  moodDistribution: Record<MoodType, number>;
  weeklyTrend: MoodEntry[];
  monthlyTrend: MoodEntry[];
}
```

### 4.3 Journal (Journal)
```typescript
interface JournalEntry {
  id: string;
  userId: string;
  title: string;
  content: string;
  date: Date;
  tags: string[];
  mood?: MoodType; // Humeur associée
  isFavorite: boolean;
  wordCount: number;
  createdAt: Date;
  updatedAt: Date;
}

interface JournalSearchFilters {
  tags?: string[];
  dateFrom?: Date;
  dateTo?: Date;
  mood?: MoodType;
  searchText?: string;
  favoritesOnly?: boolean;
}
```

### 4.4 Activity (Activité)
```typescript
interface Activity {
  id: string;
  title: string;
  description: string;
  category: ActivityCategory;
  duration?: number; // en minutes
  instructions: string[];
  benefits: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  icon?: string;
  color?: string;
  isCustom: boolean;
  createdBy?: string; // userId si activité personnalisée
  createdAt: Date;
}

type ActivityCategory =
  | 'meditation'
  | 'breathing'
  | 'exercise'
  | 'gratitude'
  | 'mindfulness'
  | 'creative'
  | 'social'
  | 'self_care'
  | 'other';

interface ActivitySession {
  id: string;
  activityId: string;
  userId: string;
  startTime: Date;
  endTime?: Date;
  duration?: number; // en minutes
  notes?: string;
  completed: boolean;
  rating?: number; // 1-5
  moodBefore?: MoodType;
  moodAfter?: MoodType;
  createdAt: Date;
}

interface ActivityProgress {
  activityId: string;
  totalSessions: number;
  totalDuration: number; // en minutes
  lastCompleted?: Date;
  averageRating?: number;
  streak: number; // jours consécutifs
}
```

### 4.5 Resource (Ressource)
```typescript
interface Resource {
  id: string;
  title: string;
  description: string;
  content: string;
  type: ResourceType;
  category: ResourceCategory;
  tags: string[];
  author?: string;
  publishedAt: Date;
  isFavorite: boolean;
  readTime?: number; // en minutes
}

type ResourceType = 'article' | 'video' | 'audio' | 'guide' | 'tip' | 'link';

type ResourceCategory =
  | 'anxiety'
  | 'depression'
  | 'stress'
  | 'sleep'
  | 'relationships'
  | 'academic'
  | 'self_care'
  | 'emergency'
  | 'general';

interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  type: 'emergency' | 'support' | 'crisis' | 'healthcare';
  isPrimary: boolean;
  notes?: string;
}
```

### 4.6 Settings (Paramètres)
```typescript
interface AppSettings {
  userId: string;
  privacy: PrivacySettings;
  dataRetention: DataRetentionSettings;
  exportFormat: 'json' | 'csv' | 'pdf';
  lastBackup?: Date;
  lastExport?: Date;
}

interface PrivacySettings {
  lockOnBackground: boolean;
  lockTimeout: number; // en minutes
  hideContentInNotifications: boolean;
  analyticsEnabled: boolean;
  crashReportingEnabled: boolean;
}

interface DataRetentionSettings {
  autoDeleteAfterDays?: number;
  keepForever: boolean;
}
```

### 4.7 Navigation Types
```typescript
export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};

export type AuthStackParamList = {
  Onboarding: undefined;
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
};

export type MainStackParamList = {
  MainTabs: undefined;
};

export type HomeStackParamList = {
  Home: undefined;
  MoodEntry: undefined;
  MoodHistory: undefined;
  MoodDetail: { moodId: string };
};

export type ActivitiesStackParamList = {
  Activities: undefined;
  ActivityDetail: { activityId: string };
  ActivitySession: { activityId: string };
  CustomActivity: { activityId?: string };
};

export type JournalStackParamList = {
  JournalList: undefined;
  JournalEntry: { entryId?: string };
  JournalDetail: { entryId: string };
  JournalSearch: undefined;
};

export type ResourcesStackParamList = {
  Resources: undefined;
  ResourceDetail: { resourceId: string };
  EmergencyContacts: undefined;
  BreathingExercise: undefined;
};

export type ProfileStackParamList = {
  Profile: undefined;
  Settings: undefined;
  Privacy: undefined;
  DataExport: undefined;
  About: undefined;
};
```

## 5. Clés AsyncStorage

### 5.1 Authentification
```typescript
const STORAGE_KEYS = {
  // Authentification
  AUTH_TOKEN: '@app:auth_token',
  USER_ID: '@app:user_id',
  USER_DATA: '@app:user_data',
  IS_FIRST_LAUNCH: '@app:is_first_launch',
  BIOMETRIC_ENABLED: '@app:biometric_enabled',
  
  // Données utilisateur
  USER_PREFERENCES: '@app:user_preferences',
  ONBOARDING_COMPLETED: '@app:onboarding_completed',
  
  // Humeurs
  MOOD_ENTRIES: '@app:mood_entries',
  MOOD_STATISTICS: '@app:mood_statistics',
  
  // Journal
  JOURNAL_ENTRIES: '@app:journal_entries',
  JOURNAL_TAGS: '@app:journal_tags',
  
  // Activités
  ACTIVITIES: '@app:activities',
  ACTIVITY_SESSIONS: '@app:activity_sessions',
  ACTIVITY_PROGRESS: '@app:activity_progress',
  
  // Ressources
  RESOURCES: '@app:resources',
  RESOURCE_FAVORITES: '@app:resource_favorites',
  EMERGENCY_CONTACTS: '@app:emergency_contacts',
  
  // Paramètres
  APP_SETTINGS: '@app:app_settings',
  PRIVACY_SETTINGS: '@app:privacy_settings',
  
  // Cache et métadonnées
  LAST_SYNC: '@app:last_sync',
  DATA_VERSION: '@app:data_version',
  BACKUP_METADATA: '@app:backup_metadata',
} as const;
```

### 5.2 Structure de Stockage

**Format de stockage recommandé:**
- Toutes les données stockées en JSON stringifié
- Données chiffrées pour les informations sensibles (notes de journal, contacts)
- Versioning pour la migration future des données
- Métadonnées séparées pour le cache et la synchronisation

**Exemple de structure:**
```typescript
// Stockage par collection avec préfixe utilisateur
// Format: @app:{userId}:{collection}:{key}

// Exemples:
// @app:user123:moods:all
// @app:user123:journal:entries
// @app:user123:settings:privacy
```

## 6. Considérations Architecture

### 6.1 Offline-First
- Toutes les opérations sont locales par défaut
- Pas de dépendance réseau
- Cache intelligent pour les ressources statiques

### 6.2 Confidentialité
- Chiffrement des données sensibles
- Stockage local uniquement
- Pas de tracking ou analytics externes
- Option d'export complet des données

### 6.3 Performance
- Lazy loading des screens
- Mémoization des composants lourds
- Optimisation des requêtes AsyncStorage
- Pagination pour les listes longues

### 6.4 Accessibilité
- Support du mode sombre
- Tailles de police ajustables
- Contrastes respectant WCAG
- Navigation au clavier

---

**Note:** Cette architecture est prête à être implémentée. Tous les types, routes et structures de dossiers sont définis pour faciliter le développement de l'application.
