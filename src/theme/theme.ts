import { colors } from './colors';

export const theme = {
  colors,

  // Spacing Scale
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
    xxxl: 64,
  },

  // Border Radius
  borderRadius: {
    none: 0,
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    xxl: 24,
    full: 9999,
  },

  // Typography
  typography: {
    // Font families
    // Display (headings, brand title) — Plus Jakarta Sans (Latin/UI only)
    // Body (content, labels) — Noto Sans (universal, supports 1000+ languages)
    fontFamily: {
      display: 'PlusJakartaSans_700Bold',
      displaySemibold: 'PlusJakartaSans_600SemiBold',
      body: 'NotoSans_400Regular',
      bodyMedium: 'NotoSans_500Medium',
      bodySemibold: 'NotoSans_600SemiBold',
      bodyBold: 'NotoSans_700Bold',
    },

    fontSize: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 18,
      xl: 20,
      xxl: 24,
      xxxl: 32,
      huge: 48,
    },

    fontWeight: {
      light: '300' as const,
      regular: '400' as const,
      medium: '500' as const,
      semibold: '600' as const,
      bold: '700' as const,
    },

    lineHeight: {
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.7,
    },
  },

  // Shadows (indigo-tinted)
  shadows: {
    sm: {
      shadowColor: colors.shadow.medium,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 2,
      elevation: 2,
    },
    md: {
      shadowColor: colors.shadow.medium,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 4,
    },
    lg: {
      shadowColor: colors.shadow.heavy,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8,
    },
  },

  // Semantic icon map (all Ionicons names)
  icons: {
    // Tab navigation
    tabHome: 'home-outline',
    tabHomeActive: 'home',
    tabJourney: 'leaf-outline',
    tabJourneyActive: 'leaf',
    tabGuide: 'compass-outline',
    tabGuideActive: 'compass',
    tabHelper: 'build-outline',
    tabHelperActive: 'build',
    tabCircles: 'people-outline',
    tabCirclesActive: 'people',

    // Navigation actions
    back: 'chevron-back',
    forward: 'chevron-forward',
    close: 'close',
    add: 'add',
    menu: 'menu-outline',
    search: 'search-outline',
    settings: 'settings-outline',

    // Content types
    calendar: 'calendar-outline',
    deadline: 'time-outline',
    quest: 'leaf-outline',
    document: 'document-text-outline',
    link: 'link-outline',
    ai: 'sparkles-outline',

    // Category icons (content IA)
    admin: 'shield-checkmark-outline',
    deals: 'pricetag-outline',
    culture: 'globe-outline',

    // Social / community
    people: 'people-outline',
    person: 'person-outline',
    circle: 'ellipse-outline',

    // Status / interaction
    saved: 'bookmark-outline',
    savedFill: 'bookmark',
    liked: 'heart-outline',
    likedFill: 'heart',
    star: 'star-outline',
    check: 'checkmark-circle-outline',
    verified: 'shield-checkmark',

    // Feedback / info
    info: 'information-circle-outline',
    warning: 'alert-circle-outline',
    error: 'close-circle-outline',
    success: 'checkmark-circle-outline',

    // Location / services
    location: 'location-outline',
    map: 'map-outline',

    // Contact
    phone: 'call-outline',
    email: 'mail-outline',
    website: 'globe-outline',

    // Healthcare
    clinic: 'medkit-outline',
    doctor: 'person-outline',
    hospital: 'business-outline',

    // Helper tools
    camera: 'camera-outline',
    translate: 'language-outline',
    notification: 'notifications-outline',
  },

  // Component specific styles
  components: {
    button: {
      height: 48,
      borderRadius: 12,
      paddingHorizontal: 24,
    },
    input: {
      height: 48,
      borderRadius: 8,
      paddingHorizontal: 16,
      borderWidth: 1,
    },
    card: {
      borderRadius: 12,
      padding: 16,
      marginVertical: 8,
    },
    tabBar: {
      height: 80,
      borderTopWidth: 0,
      backgroundColor: colors.background.primary,
    },
  },

  // Layout constants
  layout: {
    headerHeight: 56,
    tabBarHeight: 80,
    screenPadding: 16,
  },
} as const;

export type Theme = typeof theme;
