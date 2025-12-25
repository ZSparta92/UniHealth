import { Storage } from './asyncStorage';
import { STORAGE_KEYS } from '../constants/storageKeys';
import { CommunityGroup, GroupMessage, GroupMembership } from '../models/CommunityGroup';

/**
 * Mock data for prototype
 * In a real implementation, this would be stored on a backend
 */
const MOCK_GROUPS: CommunityGroup[] = [
  // My Groups (user is already a member)
  {
    id: 'group_1',
    code: 'ULY32',
    theme: 'Anxiety & Stress',
    supervisorId: 'therapist_1',
    supervisorName: 'Dr. Sarah Johnson',
    memberIds: ['user_1', 'user_2', 'user_3', 'user_4', 'user_5'],
    maxMembers: 6,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
    isActive: true,
    description: 'A safe space to discuss anxiety management techniques and share experiences.',
  },
  {
    id: 'group_2',
    code: 'KPM18',
    theme: 'First-Year Adjustment',
    supervisorId: 'therapist_3',
    supervisorName: 'Dr. Emily Rodriguez',
    memberIds: ['user_1', 'user_9', 'user_10', 'user_11'],
    maxMembers: 6,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    isActive: true,
    description: 'Support for first-year students adjusting to university life.',
  },
  {
    id: 'group_3',
    code: 'RXT09',
    theme: 'Exam Pressure',
    supervisorId: 'therapist_2',
    supervisorName: 'Dr. Michael Chen',
    memberIds: ['user_1', 'user_6', 'user_7', 'user_8'],
    maxMembers: 7,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    isActive: true,
    description: 'Support group for managing exam stress and finding balance during study periods.',
  },
  // Available Groups (user can join)
  {
    id: 'group_4',
    code: 'BNA41',
    theme: 'Loneliness',
    supervisorId: 'therapist_1',
    supervisorName: 'Dr. Sarah Johnson',
    memberIds: ['user_12', 'user_13', 'user_14'],
    maxMembers: 6,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    isActive: true,
    description: 'A supportive community for students experiencing loneliness and isolation.',
  },
  {
    id: 'group_5',
    code: 'MOT27',
    theme: 'Motivation & Burnout',
    supervisorId: 'therapist_2',
    supervisorName: 'Dr. Michael Chen',
    memberIds: ['user_15', 'user_16'],
    maxMembers: 7,
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days ago
    isActive: true,
    description: 'Share strategies for maintaining motivation and preventing academic burnout.',
  },
  {
    id: 'group_6',
    code: 'SOC52',
    theme: 'Social Anxiety',
    supervisorId: 'therapist_3',
    supervisorName: 'Dr. Emily Rodriguez',
    memberIds: ['user_17', 'user_18', 'user_19', 'user_20'],
    maxMembers: 6,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    isActive: true,
    description: 'A supportive environment to discuss social anxiety and build confidence.',
  },
  {
    id: 'group_7',
    code: 'SLP88',
    theme: 'Sleep Problems',
    supervisorId: 'therapist_1',
    supervisorName: 'Dr. Sarah Johnson',
    memberIds: ['user_21', 'user_22'],
    maxMembers: 7,
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(), // 6 days ago
    isActive: true,
    description: 'Tips and support for improving sleep quality and establishing healthy sleep routines.',
  },
];

const MOCK_MESSAGES: Record<string, GroupMessage[]> = {
  'group_1': [
    {
      id: 'msg_1_1',
      groupId: 'group_1',
      userId: 'therapist_1',
      userDisplayName: 'Dr. Sarah Johnson',
      message: 'Bienvenue dans le groupe Anxiété & Stress ! C\'est un espace sûr pour partager vos expériences et techniques de gestion de l\'anxiété.',
      timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
      isOwn: false,
      isSupervisor: true,
    },
    {
      id: 'msg_1_2',
      groupId: 'group_1',
      userId: 'user_2',
      userDisplayName: 'Student A',
      message: 'Salut tout le monde ! J\'ai commencé les exercices de respiration cette semaine, c\'est vraiment utile.',
      timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(), // 6 days ago
      isOwn: false,
      isSupervisor: false,
    },
    {
      id: 'msg_1_3',
      groupId: 'group_1',
      userId: 'user_3',
      userDisplayName: 'Student B',
      message: 'Moi aussi ! J\'ai essayé pendant mes révisions et ça m\'aide beaucoup à me concentrer.',
      timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
      isOwn: false,
      isSupervisor: false,
    },
    {
      id: 'msg_1_4',
      groupId: 'group_1',
      userId: 'therapist_1',
      userDisplayName: 'Dr. Sarah Johnson',
      message: 'Excellent ! La régularité est la clé. N\'hésitez pas à partager vos techniques qui fonctionnent.',
      timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days ago
      isOwn: false,
      isSupervisor: true,
    },
    {
      id: 'msg_1_5',
      groupId: 'group_1',
      userId: 'user_4',
      userDisplayName: 'Student C',
      message: 'J\'ai des crises d\'angoisse avant les examens. Des conseils ?',
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
      isOwn: false,
      isSupervisor: false,
    },
    {
      id: 'msg_1_6',
      groupId: 'group_1',
      userId: 'user_2',
      userDisplayName: 'Student A',
      message: 'Moi je fais 5 minutes de méditation le matin, ça m\'aide à partir du bon pied.',
      timestamp: new Date(Date.now() - 2.5 * 24 * 60 * 60 * 1000).toISOString(), // 2.5 days ago
      isOwn: false,
      isSupervisor: false,
    },
    {
      id: 'msg_1_7',
      groupId: 'group_1',
      userId: 'user_5',
      userDisplayName: 'Student D',
      message: 'J\'utilise une app de cohérence cardiaque, c\'est super efficace pour moi !',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
      isOwn: false,
      isSupervisor: false,
    },
    {
      id: 'msg_1_8',
      groupId: 'group_1',
      userId: 'therapist_1',
      userDisplayName: 'Dr. Sarah Johnson',
      message: 'Tous ces conseils sont excellents ! N\'oubliez pas que chaque personne est différente, testez ce qui vous convient le mieux.',
      timestamp: new Date(Date.now() - 1.5 * 24 * 60 * 60 * 1000).toISOString(), // 1.5 days ago
      isOwn: false,
      isSupervisor: true,
    },
    {
      id: 'msg_1_9',
      groupId: 'group_1',
      userId: 'user_3',
      userDisplayName: 'Student B',
      message: 'Merci pour tous ces partages, ça me rassure de savoir que je ne suis pas seul(e) !',
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
      isOwn: false,
      isSupervisor: false,
    },
    {
      id: 'msg_1_10',
      groupId: 'group_1',
      userId: 'user_2',
      userDisplayName: 'Student A',
      message: 'Hello tout le monde ! J\'ai trouvé les exercices de respiration vraiment utiles cette semaine.',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
      isOwn: false,
      isSupervisor: false,
    },
    {
      id: 'msg_1_11',
      groupId: 'group_1',
      userId: 'therapist_1',
      userDisplayName: 'Dr. Sarah Johnson',
      message: 'C\'est merveilleux à entendre ! N\'oubliez pas, la régularité est la clé. Comment les autres ont-ils trouvé les exercices ?',
      timestamp: new Date(Date.now() - 1.5 * 60 * 60 * 1000).toISOString(), // 1.5 hours ago
      isOwn: false,
      isSupervisor: true,
    },
    {
      id: 'msg_1_12',
      groupId: 'group_1',
      userId: 'user_3',
      userDisplayName: 'Student B',
      message: 'Je les ai essayés pendant mon examen et je me suis senti(e) beaucoup plus calme. Merci pour la suggestion !',
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1 hour ago
      isOwn: false,
      isSupervisor: false,
    },
  ],
  'group_2': [
    {
      id: 'msg_2_1',
      groupId: 'group_2',
      userId: 'therapist_3',
      userDisplayName: 'Dr. Emily Rodriguez',
      message: 'Bienvenue dans le groupe Adaptation Première Année ! C\'est un espace sûr pour partager vos expériences et vous soutenir mutuellement.',
      timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
      isOwn: false,
      isSupervisor: true,
    },
    {
      id: 'msg_2_2',
      groupId: 'group_2',
      userId: 'user_9',
      userDisplayName: 'Student C',
      message: 'Salut ! Je lutte contre le mal du pays. Ça fait du bien de savoir que je ne suis pas seul(e).',
      timestamp: new Date(Date.now() - 4.5 * 24 * 60 * 60 * 1000).toISOString(), // 4.5 days ago
      isOwn: false,
      isSupervisor: false,
    },
    {
      id: 'msg_2_3',
      groupId: 'group_2',
      userId: 'user_10',
      userDisplayName: 'Student D',
      message: 'Moi aussi ! Trouver une routine m\'a vraiment aidé à m\'adapter.',
      timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days ago
      isOwn: false,
      isSupervisor: false,
    },
    {
      id: 'msg_2_4',
      groupId: 'group_2',
      userId: 'user_11',
      userDisplayName: 'Student E',
      message: 'Première année ici aussi ! Les cours sont intenses mais je commence à m\'habituer.',
      timestamp: new Date(Date.now() - 3.5 * 24 * 60 * 60 * 1000).toISOString(), // 3.5 days ago
      isOwn: false,
      isSupervisor: false,
    },
    {
      id: 'msg_2_5',
      groupId: 'group_2',
      userId: 'therapist_3',
      userDisplayName: 'Dr. Emily Rodriguez',
      message: 'C\'est normal de se sentir dépassé(e) au début. N\'hésitez pas à partager vos difficultés et vos réussites !',
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
      isOwn: false,
      isSupervisor: true,
    },
    {
      id: 'msg_2_6',
      groupId: 'group_2',
      userId: 'user_9',
      userDisplayName: 'Student C',
      message: 'J\'ai appelé ma famille hier, ça m\'a fait beaucoup de bien.',
      timestamp: new Date(Date.now() - 2.5 * 24 * 60 * 60 * 1000).toISOString(), // 2.5 days ago
      isOwn: false,
      isSupervisor: false,
    },
    {
      id: 'msg_2_7',
      groupId: 'group_2',
      userId: 'user_10',
      userDisplayName: 'Student D',
      message: 'Moi je fais du sport le matin, ça m\'aide à commencer la journée du bon pied !',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
      isOwn: false,
      isSupervisor: false,
    },
    {
      id: 'msg_2_8',
      groupId: 'group_2',
      userId: 'user_11',
      userDisplayName: 'Student E',
      message: 'Bonne idée ! Je vais essayer ça aussi.',
      timestamp: new Date(Date.now() - 1.5 * 24 * 60 * 60 * 1000).toISOString(), // 1.5 days ago
      isOwn: false,
      isSupervisor: false,
    },
  ],
  'group_3': [
    {
      id: 'msg_3_1',
      groupId: 'group_3',
      userId: 'therapist_2',
      userDisplayName: 'Dr. Michael Chen',
      message: 'Bienvenue dans le groupe Pression des Examens. Discutons de moyens sains de gérer le stress pendant les périodes d\'examen.',
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
      isOwn: false,
      isSupervisor: true,
    },
    {
      id: 'msg_3_2',
      groupId: 'group_3',
      userId: 'user_6',
      userDisplayName: 'Student E',
      message: 'Je trouve que la méditation avant d\'étudier m\'aide vraiment à me concentrer.',
      timestamp: new Date(Date.now() - 2.5 * 24 * 60 * 60 * 1000).toISOString(), // 2.5 days ago
      isOwn: false,
      isSupervisor: false,
    },
    {
      id: 'msg_3_3',
      groupId: 'group_3',
      userId: 'user_7',
      userDisplayName: 'Student F',
      message: 'Moi j\'ai du mal à gérer mon temps de révision. Des conseils ?',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
      isOwn: false,
      isSupervisor: false,
    },
    {
      id: 'msg_3_4',
      groupId: 'group_3',
      userId: 'user_8',
      userDisplayName: 'Student G',
      message: 'Je fais des sessions de 25 min avec des pauses de 5 min (technique Pomodoro), ça marche super bien !',
      timestamp: new Date(Date.now() - 1.5 * 24 * 60 * 60 * 1000).toISOString(), // 1.5 days ago
      isOwn: false,
      isSupervisor: false,
    },
    {
      id: 'msg_3_5',
      groupId: 'group_3',
      userId: 'therapist_2',
      userDisplayName: 'Dr. Michael Chen',
      message: 'Excellente technique ! N\'oubliez pas aussi de bien dormir et de manger équilibré pendant les révisions.',
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
      isOwn: false,
      isSupervisor: true,
    },
    {
      id: 'msg_3_6',
      groupId: 'group_3',
      userId: 'user_6',
      userDisplayName: 'Student E',
      message: 'Je stresse beaucoup la veille des examens. Comment vous gérez ça ?',
      timestamp: new Date(Date.now() - 0.5 * 24 * 60 * 60 * 1000).toISOString(), // 12 hours ago
      isOwn: false,
      isSupervisor: false,
    },
    {
      id: 'msg_3_7',
      groupId: 'group_3',
      userId: 'user_7',
      userDisplayName: 'Student F',
      message: 'Moi je fais une activité relaxante le soir : lecture, musique, ou juste me détendre.',
      timestamp: new Date(Date.now() - 0.25 * 24 * 60 * 60 * 1000).toISOString(), // 6 hours ago
      isOwn: false,
      isSupervisor: false,
    },
  ],
  'group_4': [
    {
      id: 'msg_4_1',
      groupId: 'group_4',
      userId: 'therapist_1',
      userDisplayName: 'Dr. Sarah Johnson',
      message: 'Bienvenue dans le groupe Solitude. Vous n\'êtes pas seul(e), et nous sommes là pour nous soutenir mutuellement.',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
      isOwn: false,
      isSupervisor: true,
    },
    {
      id: 'msg_4_2',
      groupId: 'group_4',
      userId: 'user_12',
      userDisplayName: 'Student H',
      message: 'Merci pour ce groupe. Parfois je me sens vraiment isolé(e) à la fac.',
      timestamp: new Date(Date.now() - 1.5 * 24 * 60 * 60 * 1000).toISOString(), // 1.5 days ago
      isOwn: false,
      isSupervisor: false,
    },
    {
      id: 'msg_4_3',
      groupId: 'group_4',
      userId: 'user_13',
      userDisplayName: 'Student I',
      message: 'Je comprends. Moi aussi. C\'est dur de se faire des amis parfois.',
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
      isOwn: false,
      isSupervisor: false,
    },
    {
      id: 'msg_4_4',
      groupId: 'group_4',
      userId: 'user_14',
      userDisplayName: 'Student J',
      message: 'J\'ai rejoint un club cette semaine, ça m\'a aidé à rencontrer des gens !',
      timestamp: new Date(Date.now() - 0.5 * 24 * 60 * 60 * 1000).toISOString(), // 12 hours ago
      isOwn: false,
      isSupervisor: false,
    },
    {
      id: 'msg_4_5',
      groupId: 'group_4',
      userId: 'therapist_1',
      userDisplayName: 'Dr. Sarah Johnson',
      message: 'Excellente initiative ! Les activités de groupe sont un excellent moyen de créer des liens.',
      timestamp: new Date(Date.now() - 0.25 * 24 * 60 * 60 * 1000).toISOString(), // 6 hours ago
      isOwn: false,
      isSupervisor: true,
    },
  ],
  'group_5': [
    {
      id: 'msg_5_1',
      groupId: 'group_5',
      userId: 'therapist_2',
      userDisplayName: 'Dr. Michael Chen',
      message: 'Bienvenue dans le groupe Motivation & Épuisement. Partageons des stratégies pour maintenir l\'équilibre et prévenir l\'épuisement.',
      timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days ago
      isOwn: false,
      isSupervisor: true,
    },
    {
      id: 'msg_5_2',
      groupId: 'group_5',
      userId: 'user_15',
      userDisplayName: 'Student K',
      message: 'Je me sens complètement épuisé(e) en ce moment. J\'ai l\'impression de ne plus avoir d\'énergie.',
      timestamp: new Date(Date.now() - 3.5 * 24 * 60 * 60 * 1000).toISOString(), // 3.5 days ago
      isOwn: false,
      isSupervisor: false,
    },
    {
      id: 'msg_5_3',
      groupId: 'group_5',
      userId: 'user_16',
      userDisplayName: 'Student L',
      message: 'Je comprends. Moi j\'essaie de prendre au moins un jour de repos par semaine, ça m\'aide.',
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
      isOwn: false,
      isSupervisor: false,
    },
    {
      id: 'msg_5_4',
      groupId: 'group_5',
      userId: 'therapist_2',
      userDisplayName: 'Dr. Michael Chen',
      message: 'C\'est important de se reposer. N\'oubliez pas que votre santé mentale est aussi importante que vos études.',
      timestamp: new Date(Date.now() - 2.5 * 24 * 60 * 60 * 1000).toISOString(), // 2.5 days ago
      isOwn: false,
      isSupervisor: true,
    },
    {
      id: 'msg_5_5',
      groupId: 'group_5',
      userId: 'user_15',
      userDisplayName: 'Student K',
      message: 'Merci, je vais essayer de mieux équilibrer mon temps.',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
      isOwn: false,
      isSupervisor: false,
    },
  ],
  'group_6': [
    {
      id: 'msg_6_1',
      groupId: 'group_6',
      userId: 'therapist_3',
      userDisplayName: 'Dr. Emily Rodriguez',
      message: 'Bienvenue dans le groupe Anxiété Sociale. C\'est un espace sûr, sans jugement, pour partager et apprendre ensemble.',
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
      isOwn: false,
      isSupervisor: true,
    },
    {
      id: 'msg_6_2',
      groupId: 'group_6',
      userId: 'user_17',
      userDisplayName: 'Student M',
      message: 'J\'ai du mal à parler en public. Même lever la main en cours me stresse.',
      timestamp: new Date(Date.now() - 0.75 * 24 * 60 * 60 * 1000).toISOString(), // 18 hours ago
      isOwn: false,
      isSupervisor: false,
    },
    {
      id: 'msg_6_3',
      groupId: 'group_6',
      userId: 'user_18',
      userDisplayName: 'Student N',
      message: 'Moi aussi ! J\'ai commencé à pratiquer devant un miroir, ça m\'aide un peu.',
      timestamp: new Date(Date.now() - 0.5 * 24 * 60 * 60 * 1000).toISOString(), // 12 hours ago
      isOwn: false,
      isSupervisor: false,
    },
    {
      id: 'msg_6_4',
      groupId: 'group_6',
      userId: 'user_19',
      userDisplayName: 'Student O',
      message: 'Bonne idée ! Moi je commence petit : d\'abord avec des amis proches, puis j\'élargis progressivement.',
      timestamp: new Date(Date.now() - 0.25 * 24 * 60 * 60 * 1000).toISOString(), // 6 hours ago
      isOwn: false,
      isSupervisor: false,
    },
    {
      id: 'msg_6_5',
      groupId: 'group_6',
      userId: 'therapist_3',
      userDisplayName: 'Dr. Emily Rodriguez',
      message: 'Excellentes stratégies ! L\'exposition progressive est une technique très efficace.',
      timestamp: new Date(Date.now() - 0.1 * 24 * 60 * 60 * 1000).toISOString(), // 2.4 hours ago
      isOwn: false,
      isSupervisor: true,
    },
  ],
  'group_7': [
    {
      id: 'msg_7_1',
      groupId: 'group_7',
      userId: 'therapist_1',
      userDisplayName: 'Dr. Sarah Johnson',
      message: 'Bienvenue dans le groupe Problèmes de Sommeil. Discutons d\'habitudes et de routines de sommeil saines.',
      timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(), // 6 days ago
      isOwn: false,
      isSupervisor: true,
    },
    {
      id: 'msg_7_2',
      groupId: 'group_7',
      userId: 'user_21',
      userDisplayName: 'Student P',
      message: 'J\'ai du mal à m\'endormir le soir. Mon cerveau ne s\'arrête jamais de penser.',
      timestamp: new Date(Date.now() - 5.5 * 24 * 60 * 60 * 1000).toISOString(), // 5.5 days ago
      isOwn: false,
      isSupervisor: false,
    },
    {
      id: 'msg_7_3',
      groupId: 'group_7',
      userId: 'user_22',
      userDisplayName: 'Student Q',
      message: 'Moi aussi ! J\'ai commencé à écrire mes pensées dans un journal avant de dormir, ça m\'aide.',
      timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
      isOwn: false,
      isSupervisor: false,
    },
    {
      id: 'msg_7_4',
      groupId: 'group_7',
      userId: 'therapist_1',
      userDisplayName: 'Dr. Sarah Johnson',
      message: 'Excellente technique ! Éviter les écrans une heure avant le coucher aide aussi beaucoup.',
      timestamp: new Date(Date.now() - 4.5 * 24 * 60 * 60 * 1000).toISOString(), // 4.5 days ago
      isOwn: false,
      isSupervisor: true,
    },
    {
      id: 'msg_7_5',
      groupId: 'group_7',
      userId: 'user_21',
      userDisplayName: 'Student P',
      message: 'Je vais essayer ça. Merci pour les conseils !',
      timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days ago
      isOwn: false,
      isSupervisor: false,
    },
  ],
};

const MOCK_MEMBERSHIPS: GroupMembership[] = [
  { userId: 'user_1', groupId: 'group_1', joinedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), displayName: 'Student D' },
  { userId: 'user_1', groupId: 'group_2', joinedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), displayName: 'Student E' },
];

/**
 * Generate an anonymized group code
 * Format: 3 uppercase letters + 2 digits (e.g., ULY32)
 */
function generateGroupCode(): string {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  
  let code = '';
  // 3 random letters
  for (let i = 0; i < 3; i++) {
    code += letters.charAt(Math.floor(Math.random() * letters.length));
  }
  // 2 random digits
  for (let i = 0; i < 2; i++) {
    code += numbers.charAt(Math.floor(Math.random() * numbers.length));
  }
  
  return code;
}

/**
 * Generate an anonymized display name for a user in a group
 * Format: "Student" + letter (A, B, C, etc.)
 */
function generateDisplayName(groupId: string, userId: string, existingMembers: string[]): string {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const usedLetters = existingMembers.map(m => m.replace('Student ', ''));
  let letterIndex = 0;
  
  // Find first available letter
  while (usedLetters.includes(letters[letterIndex]) && letterIndex < letters.length) {
    letterIndex++;
  }
  
  return `Student ${letters[letterIndex]}`;
}

export const CommunityGroupStorage = {
  /**
   * Get all groups that a user is a member of or supervises
   */
  async getUserGroups(userId: string, isPsychologist: boolean = false): Promise<CommunityGroup[]> {
    try {
      const stored = await Storage.getItem(STORAGE_KEYS.COMMUNITY_GROUPS);
      const groups: CommunityGroup[] = stored ? JSON.parse(stored) : MOCK_GROUPS;
      
      // Filter groups based on user role
      if (isPsychologist) {
        // Psychologists see groups they supervise
        return groups.filter(g => g.supervisorId === userId);
      } else {
        // Students see groups they are members of
        return groups.filter(g => g.memberIds.includes(userId));
      }
    } catch (error) {
      console.error('Error getting user groups:', error);
      // Return mock data for prototype
      if (isPsychologist) {
        return MOCK_GROUPS.filter(g => g.supervisorId === userId);
      } else {
        return MOCK_GROUPS.filter(g => g.memberIds.includes(userId));
      }
    }
  },

  /**
   * Get a specific group by ID
   */
  async getGroupById(groupId: string): Promise<CommunityGroup | null> {
    try {
      const stored = await Storage.getItem(STORAGE_KEYS.COMMUNITY_GROUPS);
      const groups: CommunityGroup[] = stored ? JSON.parse(stored) : MOCK_GROUPS;
      return groups.find(g => g.id === groupId) || null;
    } catch (error) {
      console.error('Error getting group:', error);
      return MOCK_GROUPS.find(g => g.id === groupId) || null;
    }
  },

  /**
   * Create a new group (only for psychologists)
   */
  async createGroup(
    supervisorId: string,
    supervisorName: string,
    theme: string,
    description?: string,
    maxMembers: number = 6
  ): Promise<CommunityGroup> {
    const code = generateGroupCode();
    const newGroup: CommunityGroup = {
      id: `group_${Date.now()}`,
      code,
      theme,
      supervisorId,
      supervisorName,
      memberIds: [],
      maxMembers: Math.min(Math.max(maxMembers, 6), 7), // Between 6 and 7
      createdAt: new Date().toISOString(),
      isActive: true,
      description,
    };

    try {
      const stored = await Storage.getItem(STORAGE_KEYS.COMMUNITY_GROUPS);
      const groups: CommunityGroup[] = stored ? JSON.parse(stored) : MOCK_GROUPS;
      groups.push(newGroup);
      await Storage.setItem(STORAGE_KEYS.COMMUNITY_GROUPS, JSON.stringify(groups));
    } catch (error) {
      console.error('Error creating group:', error);
    }

    return newGroup;
  },

  /**
   * Get messages for a specific group
   */
  async getGroupMessages(groupId: string, userId: string): Promise<GroupMessage[]> {
    try {
      const stored = await Storage.getItem(`${STORAGE_KEYS.COMMUNITY_GROUP_MESSAGES}_${groupId}`);
      const mockMessages = MOCK_MESSAGES[groupId] || [];
      
      if (stored) {
        const storedMessages = JSON.parse(stored) as GroupMessage[];
        // Merge stored messages with mock messages (avoid duplicates by ID)
        const storedMessageIds = new Set(storedMessages.map(m => m.id));
        const uniqueMockMessages = mockMessages.filter(m => !storedMessageIds.has(m.id));
        
        // Combine: mock messages first (chronological), then stored messages
        const allMessages = [...uniqueMockMessages, ...storedMessages].sort((a, b) => 
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );
        
        // Mark messages as own if they match the current user
        return allMessages.map(msg => ({
          ...msg,
          isOwn: msg.userId === userId,
        }));
      }
      
      // Initialize storage with mock messages if no stored messages exist
      if (mockMessages.length > 0) {
        await Storage.setItem(`${STORAGE_KEYS.COMMUNITY_GROUP_MESSAGES}_${groupId}`, JSON.stringify(mockMessages));
      }
      
      // Return mock data
      return mockMessages.map(msg => ({
        ...msg,
        isOwn: msg.userId === userId,
      }));
    } catch (error) {
      console.error('Error getting group messages:', error);
      const mockMessages = MOCK_MESSAGES[groupId] || [];
      return mockMessages.map(msg => ({
        ...msg,
        isOwn: msg.userId === userId,
      }));
    }
  },

  /**
   * Send a message to a group
   */
  async sendGroupMessage(
    groupId: string,
    userId: string,
    userDisplayName: string,
    message: string,
    isSupervisor: boolean = false
  ): Promise<GroupMessage> {
    const groupMessage: GroupMessage = {
      id: `group_msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      groupId,
      userId,
      userDisplayName,
      message,
      timestamp: new Date().toISOString(),
      isOwn: true,
      isSupervisor,
    };

    try {
      const stored = await Storage.getItem(`${STORAGE_KEYS.COMMUNITY_GROUP_MESSAGES}_${groupId}`);
      const mockMessages = MOCK_MESSAGES[groupId] || [];
      
      let messages: GroupMessage[] = [];
      
      if (stored) {
        // Get stored messages
        const storedMessages = JSON.parse(stored) as GroupMessage[];
        // Merge with mock messages (avoid duplicates by ID)
        const storedMessageIds = new Set(storedMessages.map(m => m.id));
        const uniqueMockMessages = mockMessages.filter(m => !storedMessageIds.has(m.id));
        messages = [...uniqueMockMessages, ...storedMessages];
      } else {
        // Initialize with mock messages if no stored messages
        messages = [...mockMessages];
        await Storage.setItem(`${STORAGE_KEYS.COMMUNITY_GROUP_MESSAGES}_${groupId}`, JSON.stringify(mockMessages));
      }
      
      // Add new message
      messages.push(groupMessage);
      
      // Save all messages (mock + stored + new)
      await Storage.setItem(`${STORAGE_KEYS.COMMUNITY_GROUP_MESSAGES}_${groupId}`, JSON.stringify(messages));
    } catch (error) {
      console.error('Error sending group message:', error);
    }

    return groupMessage;
  },

  /**
   * Get user's display name in a group
   */
  async getUserDisplayName(groupId: string, userId: string): Promise<string> {
    try {
      const stored = await Storage.getItem(`${STORAGE_KEYS.COMMUNITY_GROUP_MEMBERSHIPS}_${groupId}`);
      const memberships: GroupMembership[] = stored ? JSON.parse(stored) : [];
      const membership = memberships.find(m => m.userId === userId);
      if (membership) {
        return membership.displayName;
      }

      // Generate new display name if not found
      const group = await this.getGroupById(groupId);
      if (!group) return 'Student A';
      
      const existingNames = memberships.map(m => m.displayName);
      const newName = generateDisplayName(groupId, userId, existingNames);
      
      // Save membership
      memberships.push({
        userId,
        groupId,
        joinedAt: new Date().toISOString(),
        displayName: newName,
      });
      await Storage.setItem(`${STORAGE_KEYS.COMMUNITY_GROUP_MEMBERSHIPS}_${groupId}`, JSON.stringify(memberships));
      
      return newName;
    } catch (error) {
      console.error('Error getting user display name:', error);
      return 'Student A';
    }
  },

  /**
   * Get all available groups that a user can join (not already a member)
   */
  async getAllAvailableGroups(userId: string, isPsychologist: boolean = false): Promise<CommunityGroup[]> {
    try {
      const stored = await Storage.getItem(STORAGE_KEYS.COMMUNITY_GROUPS);
      const groups: CommunityGroup[] = stored ? JSON.parse(stored) : MOCK_GROUPS;
      
      // Filter: active groups, not full, user is not a member, and not supervised by user (if psychologist)
      return groups.filter(g => {
        if (!g.isActive) return false;
        if (g.memberIds.length >= g.maxMembers) return false;
        if (g.memberIds.includes(userId)) return false;
        if (isPsychologist && g.supervisorId === userId) return false;
        return true;
      });
    } catch (error) {
      console.error('Error getting available groups:', error);
      // Return mock data for prototype
      return MOCK_GROUPS.filter(g => {
        if (!g.isActive) return false;
        if (g.memberIds.length >= g.maxMembers) return false;
        if (g.memberIds.includes(userId)) return false;
        if (isPsychologist && g.supervisorId === userId) return false;
        return true;
      });
    }
  },

  /**
   * Join a group (add user to group and create membership)
   */
  async joinGroup(groupId: string, userId: string): Promise<CommunityGroup | null> {
    try {
      const stored = await Storage.getItem(STORAGE_KEYS.COMMUNITY_GROUPS);
      const groups: CommunityGroup[] = stored ? JSON.parse(stored) : MOCK_GROUPS;
      
      const group = groups.find(g => g.id === groupId);
      if (!group) {
        console.error('Group not found:', groupId);
        return null;
      }

      // Check if group is full
      if (group.memberIds.length >= group.maxMembers) {
        console.error('Group is full:', groupId);
        return null;
      }

      // Check if user is already a member
      if (group.memberIds.includes(userId)) {
        console.log('User already a member of group:', groupId);
        return group;
      }

      // Add user to group
      group.memberIds.push(userId);
      
      // Save updated groups
      await Storage.setItem(STORAGE_KEYS.COMMUNITY_GROUPS, JSON.stringify(groups));

      // Create membership with display name
      const membershipStored = await Storage.getItem(`${STORAGE_KEYS.COMMUNITY_GROUP_MEMBERSHIPS}_${groupId}`);
      const memberships: GroupMembership[] = membershipStored ? JSON.parse(membershipStored) : [];
      
      // Check if membership already exists
      if (!memberships.find(m => m.userId === userId)) {
        const existingNames = memberships.map(m => m.displayName);
        const displayName = generateDisplayName(groupId, userId, existingNames);
        
        memberships.push({
          userId,
          groupId,
          joinedAt: new Date().toISOString(),
          displayName,
        });
        
        await Storage.setItem(`${STORAGE_KEYS.COMMUNITY_GROUP_MEMBERSHIPS}_${groupId}`, JSON.stringify(memberships));
      }

      return group;
    } catch (error) {
      console.error('Error joining group:', error);
      return null;
    }
  },

  /**
   * Leave a group (remove user from group and membership)
   */
  async leaveGroup(groupId: string, userId: string): Promise<boolean> {
    try {
      console.log('[CommunityGroupStorage] leaveGroup: Starting for groupId:', groupId, 'userId:', userId);
      const stored = await Storage.getItem(STORAGE_KEYS.COMMUNITY_GROUPS);
      const groups: CommunityGroup[] = stored ? JSON.parse(stored) : MOCK_GROUPS;
      
      const group = groups.find(g => g.id === groupId);
      if (!group) {
        console.error('[CommunityGroupStorage] leaveGroup: Group not found:', groupId);
        return false;
      }

      // Check if user is a member
      if (!group.memberIds.includes(userId)) {
        console.log('[CommunityGroupStorage] leaveGroup: User is not a member of group:', groupId);
        return false;
      }

      // Remove user from group
      group.memberIds = group.memberIds.filter(id => id !== userId);
      console.log('[CommunityGroupStorage] leaveGroup: Removed user from group. New memberIds:', group.memberIds);
      
      // Save updated groups
      await Storage.setItem(STORAGE_KEYS.COMMUNITY_GROUPS, JSON.stringify(groups));
      console.log('[CommunityGroupStorage] leaveGroup: Saved updated groups to storage');

      // Remove membership (optional - we keep it for history, but mark as inactive)
      // Actually, let's remove it so they can rejoin with a fresh display name
      try {
        const membershipStored = await Storage.getItem(`${STORAGE_KEYS.COMMUNITY_GROUP_MEMBERSHIPS}_${groupId}`);
        if (membershipStored) {
          const memberships: GroupMembership[] = JSON.parse(membershipStored);
          const updatedMemberships = memberships.filter(m => m.userId !== userId);
          await Storage.setItem(`${STORAGE_KEYS.COMMUNITY_GROUP_MEMBERSHIPS}_${groupId}`, JSON.stringify(updatedMemberships));
          console.log('[CommunityGroupStorage] leaveGroup: Removed membership');
        }
      } catch (membershipError) {
        // Non-critical error, log but don't fail
        console.warn('[CommunityGroupStorage] leaveGroup: Error removing membership:', membershipError);
      }

      console.log('[CommunityGroupStorage] leaveGroup: Successfully left group');
      return true;
    } catch (error) {
      console.error('[CommunityGroupStorage] leaveGroup: Error leaving group:', error);
      return false;
    }
  },
};

