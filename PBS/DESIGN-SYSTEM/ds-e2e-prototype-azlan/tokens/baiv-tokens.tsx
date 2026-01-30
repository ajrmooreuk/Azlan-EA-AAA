/**
 * BAIV Design Token System
 * ========================
 * 
 * Version: 1.0.0
 * Platform: BAIV Agentic Platform - Platform Foundation Core
 * Architecture: Figma → shadcn/ui Token Bridge
 * 
 * This module provides the core token provider and hooks for
 * integrating Figma design tokens with shadcn/ui components.
 * 
 * @context Ontology-centric design-to-development automation
 * @compliance OAA Registry v3.0 | Schema.org Grounded
 */

'use client';

import * as React from 'react';
import { createContext, useContext, useCallback, useMemo, useEffect, useState } from 'react';

// ============================================
// TYPE DEFINITIONS
// ============================================

/**
 * Theme mode for the design system
 */
export type ThemeMode = 'light' | 'dark' | 'system';

/**
 * Primitive token definitions (raw design values)
 */
export interface PrimitiveTokens {
  colors: {
    blue: Record<string, string>;
    gray: Record<string, string>;
    red: Record<string, string>;
    green: Record<string, string>;
    brand: Record<string, string>;
  };
  spacing: Record<string, string>;
  radius: Record<string, string>;
  typography: {
    fontFamily: Record<string, string>;
    fontSize: Record<string, string>;
    fontWeight: Record<string, string | number>;
    lineHeight: Record<string, string>;
    letterSpacing: Record<string, string>;
  };
}

/**
 * Semantic token definitions (intent-based)
 */
export interface SemanticTokens {
  surface: {
    default: string;
    elevated: string;
    field: string;
    interactive: string;
    subtle: string;
    overlay: string;
  };
  text: {
    primary: string;
    secondary: string;
    muted: string;
    onAccent: string;
    error: string;
    success: string;
    warning: string;
    link: string;
  };
  border: {
    default: string;
    focus: string;
    error: string;
    subtle: string;
    interactive: string;
  };
  accent: {
    primary: string;
    primaryHover: string;
    secondary: string;
    secondaryHover: string;
  };
  feedback: {
    error: string;
    errorBg: string;
    success: string;
    successBg: string;
    warning: string;
    warningBg: string;
    info: string;
    infoBg: string;
  };
}

/**
 * Component-specific token definitions
 */
export interface ComponentTokens {
  // Form Controls
  checkbox: CheckboxTokens;
  input: InputTokens;
  inputGroup: InputGroupTokens;
  select: SelectTokens;
  textarea: TextareaTokens;
  radio: RadioTokens;
  switch: SwitchTokens;
  
  // Buttons & Actions
  button: ButtonTokens;
  
  // Feedback & Status
  alert: AlertTokens;
  badge: BadgeTokens;
  toast: ToastTokens;
  
  // Layout & Containers
  card: CardTokens;
  dialog: DialogTokens;
  dropdown: DropdownTokens;
  
  // Navigation
  tabs: TabsTokens;
  sidebar: SidebarTokens;
  
  // Data Display
  table: TableTokens;
  avatar: AvatarTokens;
}

// Individual component token interfaces
export interface CheckboxTokens {
  bg: string;
  border: string;
  borderFocus: string;
  checkedBg: string;
  checkmark: string;
  radius: string;
  size: string;
  disabledBg: string;
  disabledBorder: string;
}

export interface InputTokens {
  bg: string;
  border: string;
  borderFocus: string;
  borderError: string;
  text: string;
  placeholder: string;
  radius: string;
  height: string;
  paddingX: string;
  paddingY: string;
  disabledBg: string;
  disabledText: string;
}

export interface InputGroupTokens {
  containerBg: string;
  containerBorder: string;
  containerBorderFocus: string;
  containerRadius: string;
  addonBg: string;
  addonText: string;
  addonIcon: string;
  addonBorder: string;
  dividerColor: string;
}

export interface SelectTokens {
  bg: string;
  border: string;
  borderFocus: string;
  text: string;
  placeholder: string;
  icon: string;
  radius: string;
  height: string;
  optionBg: string;
  optionBgHover: string;
  optionText: string;
  optionTextSelected: string;
}

export interface TextareaTokens {
  bg: string;
  border: string;
  borderFocus: string;
  borderError: string;
  text: string;
  placeholder: string;
  radius: string;
  paddingX: string;
  paddingY: string;
}

export interface RadioTokens {
  bg: string;
  border: string;
  borderFocus: string;
  checkedBg: string;
  checkedInner: string;
  size: string;
}

export interface SwitchTokens {
  trackBg: string;
  trackBgChecked: string;
  thumbBg: string;
  thumbBgChecked: string;
  borderFocus: string;
  width: string;
  height: string;
}

export interface ButtonTokens {
  // Primary variant
  primaryBg: string;
  primaryBgHover: string;
  primaryText: string;
  primaryBorder: string;
  // Secondary variant
  secondaryBg: string;
  secondaryBgHover: string;
  secondaryText: string;
  secondaryBorder: string;
  // Ghost variant
  ghostBg: string;
  ghostBgHover: string;
  ghostText: string;
  // Destructive variant
  destructiveBg: string;
  destructiveBgHover: string;
  destructiveText: string;
  // Outline variant
  outlineBg: string;
  outlineBgHover: string;
  outlineText: string;
  outlineBorder: string;
  // Common
  radius: string;
  height: string;
  paddingX: string;
  disabledBg: string;
  disabledText: string;
  focusRing: string;
}

export interface AlertTokens {
  defaultBg: string;
  defaultBorder: string;
  defaultText: string;
  defaultIcon: string;
  errorBg: string;
  errorBorder: string;
  errorText: string;
  errorIcon: string;
  successBg: string;
  successBorder: string;
  successText: string;
  successIcon: string;
  warningBg: string;
  warningBorder: string;
  warningText: string;
  warningIcon: string;
  infoBg: string;
  infoBorder: string;
  infoText: string;
  infoIcon: string;
  radius: string;
  paddingX: string;
  paddingY: string;
}

export interface BadgeTokens {
  defaultBg: string;
  defaultText: string;
  primaryBg: string;
  primaryText: string;
  secondaryBg: string;
  secondaryText: string;
  destructiveBg: string;
  destructiveText: string;
  outlineBg: string;
  outlineText: string;
  outlineBorder: string;
  radius: string;
  paddingX: string;
  paddingY: string;
}

export interface ToastTokens {
  bg: string;
  border: string;
  text: string;
  description: string;
  successBg: string;
  successBorder: string;
  successText: string;
  errorBg: string;
  errorBorder: string;
  errorText: string;
  radius: string;
  shadow: string;
}

export interface CardTokens {
  bg: string;
  border: string;
  radius: string;
  shadow: string;
  headerBg: string;
  headerBorder: string;
  footerBg: string;
  footerBorder: string;
  padding: string;
}

export interface DialogTokens {
  overlayBg: string;
  bg: string;
  border: string;
  radius: string;
  shadow: string;
  headerBorder: string;
  footerBorder: string;
  padding: string;
}

export interface DropdownTokens {
  bg: string;
  border: string;
  radius: string;
  shadow: string;
  itemBg: string;
  itemBgHover: string;
  itemText: string;
  itemTextHover: string;
  separatorColor: string;
  padding: string;
}

export interface TabsTokens {
  listBg: string;
  listBorder: string;
  triggerBg: string;
  triggerBgActive: string;
  triggerText: string;
  triggerTextActive: string;
  contentBg: string;
  contentBorder: string;
  indicator: string;
}

export interface SidebarTokens {
  bg: string;
  border: string;
  itemBg: string;
  itemBgHover: string;
  itemBgActive: string;
  itemText: string;
  itemTextHover: string;
  itemTextActive: string;
  groupText: string;
  divider: string;
}

export interface TableTokens {
  bg: string;
  headerBg: string;
  headerText: string;
  rowBg: string;
  rowBgHover: string;
  rowBgStriped: string;
  cellText: string;
  border: string;
  radius: string;
}

export interface AvatarTokens {
  bg: string;
  text: string;
  border: string;
  fallbackBg: string;
  fallbackText: string;
  radius: string;
}

// ============================================
// COMPLETE TOKEN SYSTEM
// ============================================

export interface BAIVTokenSystem {
  primitives: PrimitiveTokens;
  semantic: SemanticTokens;
  components: ComponentTokens;
}

// ============================================
// DEFAULT TOKENS (BAIV Brand)
// ============================================

export const defaultPrimitives: PrimitiveTokens = {
  colors: {
    blue: {
      '50': 'hsl(214 100% 97%)',
      '100': 'hsl(214 95% 93%)',
      '200': 'hsl(213 97% 87%)',
      '300': 'hsl(212 96% 78%)',
      '400': 'hsl(213 94% 68%)',
      '500': 'hsl(217 91% 60%)',
      '600': 'hsl(221 83% 53%)',
      '700': 'hsl(224 76% 48%)',
      '800': 'hsl(226 71% 40%)',
      '900': 'hsl(224 64% 33%)',
    },
    gray: {
      '50': 'hsl(210 40% 98%)',
      '100': 'hsl(210 40% 96%)',
      '200': 'hsl(214 32% 91%)',
      '300': 'hsl(213 27% 84%)',
      '400': 'hsl(215 20% 65%)',
      '500': 'hsl(215 16% 47%)',
      '600': 'hsl(215 19% 35%)',
      '700': 'hsl(215 25% 27%)',
      '800': 'hsl(217 33% 17%)',
      '900': 'hsl(222 47% 11%)',
    },
    red: {
      '50': 'hsl(0 86% 97%)',
      '100': 'hsl(0 93% 94%)',
      '500': 'hsl(0 84% 60%)',
      '600': 'hsl(0 72% 51%)',
      '700': 'hsl(0 74% 42%)',
    },
    green: {
      '50': 'hsl(138 76% 97%)',
      '100': 'hsl(141 84% 93%)',
      '500': 'hsl(142 71% 45%)',
      '600': 'hsl(142 76% 36%)',
      '700': 'hsl(142 72% 29%)',
    },
    brand: {
      '50': 'hsl(214 100% 97%)',
      '100': 'hsl(214 95% 93%)',
      '500': 'hsl(217 91% 60%)',
      '600': 'hsl(221 83% 53%)',
      '700': 'hsl(224 76% 48%)',
    },
  },
  spacing: {
    'xs': '4px',
    'sm': '8px',
    'md': '16px',
    'lg': '24px',
    'xl': '32px',
    '2xl': '48px',
    '3xl': '64px',
  },
  radius: {
    'none': '0',
    'sm': '4px',
    'md': '8px',
    'lg': '12px',
    'xl': '16px',
    'full': '9999px',
  },
  typography: {
    fontFamily: {
      'sans': 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      'mono': 'JetBrains Mono, "Fira Code", monospace',
    },
    fontSize: {
      'xs': '0.75rem',
      'sm': '0.875rem',
      'base': '1rem',
      'lg': '1.125rem',
      'xl': '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
    },
    fontWeight: {
      'normal': '400',
      'medium': '500',
      'semibold': '600',
      'bold': '700',
    },
    lineHeight: {
      'tight': '1.25',
      'normal': '1.5',
      'relaxed': '1.75',
    },
    letterSpacing: {
      'tight': '-0.025em',
      'normal': '0',
      'wide': '0.025em',
    },
  },
};

export const defaultSemanticLight: SemanticTokens = {
  surface: {
    default: 'hsl(0 0% 100%)',
    elevated: 'hsl(0 0% 100%)',
    field: 'hsl(0 0% 100%)',
    interactive: 'hsl(0 0% 100%)',
    subtle: 'hsl(210 40% 96%)',
    overlay: 'hsla(0 0% 0% / 0.5)',
  },
  text: {
    primary: 'hsl(222 47% 11%)',
    secondary: 'hsl(215 16% 47%)',
    muted: 'hsl(215 20% 65%)',
    onAccent: 'hsl(0 0% 100%)',
    error: 'hsl(0 72% 51%)',
    success: 'hsl(142 76% 36%)',
    warning: 'hsl(38 92% 50%)',
    link: 'hsl(221 83% 53%)',
  },
  border: {
    default: 'hsl(214 32% 91%)',
    focus: 'hsl(221 83% 53%)',
    error: 'hsl(0 72% 51%)',
    subtle: 'hsl(213 27% 84%)',
    interactive: 'hsl(214 32% 91%)',
  },
  accent: {
    primary: 'hsl(221 83% 53%)',
    primaryHover: 'hsl(224 76% 48%)',
    secondary: 'hsl(217 91% 60%)',
    secondaryHover: 'hsl(213 94% 68%)',
  },
  feedback: {
    error: 'hsl(0 72% 51%)',
    errorBg: 'hsl(0 86% 97%)',
    success: 'hsl(142 76% 36%)',
    successBg: 'hsl(138 76% 97%)',
    warning: 'hsl(38 92% 50%)',
    warningBg: 'hsl(48 96% 89%)',
    info: 'hsl(221 83% 53%)',
    infoBg: 'hsl(214 100% 97%)',
  },
};

export const defaultSemanticDark: SemanticTokens = {
  surface: {
    default: 'hsl(222 47% 11%)',
    elevated: 'hsl(217 33% 17%)',
    field: 'hsl(215 25% 27%)',
    interactive: 'hsl(215 25% 27%)',
    subtle: 'hsl(217 33% 17%)',
    overlay: 'hsla(0 0% 0% / 0.7)',
  },
  text: {
    primary: 'hsl(210 40% 98%)',
    secondary: 'hsl(215 20% 65%)',
    muted: 'hsl(215 16% 47%)',
    onAccent: 'hsl(0 0% 100%)',
    error: 'hsl(0 84% 60%)',
    success: 'hsl(142 71% 45%)',
    warning: 'hsl(38 92% 50%)',
    link: 'hsl(217 91% 60%)',
  },
  border: {
    default: 'hsl(215 19% 35%)',
    focus: 'hsl(217 91% 60%)',
    error: 'hsl(0 84% 60%)',
    subtle: 'hsl(215 25% 27%)',
    interactive: 'hsl(215 19% 35%)',
  },
  accent: {
    primary: 'hsl(217 91% 60%)',
    primaryHover: 'hsl(213 94% 68%)',
    secondary: 'hsl(221 83% 53%)',
    secondaryHover: 'hsl(217 91% 60%)',
  },
  feedback: {
    error: 'hsl(0 84% 60%)',
    errorBg: 'hsl(0 62% 30%)',
    success: 'hsl(142 71% 45%)',
    successBg: 'hsl(142 61% 20%)',
    warning: 'hsl(38 92% 50%)',
    warningBg: 'hsl(38 72% 25%)',
    info: 'hsl(217 91% 60%)',
    infoBg: 'hsl(221 63% 25%)',
  },
};

// Component token factory functions
export function createComponentTokens(semantic: SemanticTokens, primitives: PrimitiveTokens): ComponentTokens {
  return {
    checkbox: {
      bg: semantic.surface.interactive,
      border: semantic.border.default,
      borderFocus: semantic.border.focus,
      checkedBg: semantic.accent.primary,
      checkmark: semantic.text.onAccent,
      radius: primitives.radius.sm,
      size: '20px',
      disabledBg: semantic.surface.subtle,
      disabledBorder: semantic.border.subtle,
    },
    input: {
      bg: semantic.surface.field,
      border: semantic.border.default,
      borderFocus: semantic.border.focus,
      borderError: semantic.border.error,
      text: semantic.text.primary,
      placeholder: semantic.text.muted,
      radius: primitives.radius.md,
      height: '40px',
      paddingX: primitives.spacing.md,
      paddingY: primitives.spacing.sm,
      disabledBg: semantic.surface.subtle,
      disabledText: semantic.text.muted,
    },
    inputGroup: {
      containerBg: semantic.surface.field,
      containerBorder: semantic.border.default,
      containerBorderFocus: semantic.border.focus,
      containerRadius: primitives.radius.md,
      addonBg: semantic.surface.subtle,
      addonText: semantic.text.secondary,
      addonIcon: semantic.text.muted,
      addonBorder: semantic.border.default,
      dividerColor: semantic.border.subtle,
    },
    select: {
      bg: semantic.surface.field,
      border: semantic.border.default,
      borderFocus: semantic.border.focus,
      text: semantic.text.primary,
      placeholder: semantic.text.muted,
      icon: semantic.text.secondary,
      radius: primitives.radius.md,
      height: '40px',
      optionBg: semantic.surface.elevated,
      optionBgHover: semantic.surface.subtle,
      optionText: semantic.text.primary,
      optionTextSelected: semantic.accent.primary,
    },
    textarea: {
      bg: semantic.surface.field,
      border: semantic.border.default,
      borderFocus: semantic.border.focus,
      borderError: semantic.border.error,
      text: semantic.text.primary,
      placeholder: semantic.text.muted,
      radius: primitives.radius.md,
      paddingX: primitives.spacing.md,
      paddingY: primitives.spacing.sm,
    },
    radio: {
      bg: semantic.surface.interactive,
      border: semantic.border.default,
      borderFocus: semantic.border.focus,
      checkedBg: semantic.accent.primary,
      checkedInner: semantic.text.onAccent,
      size: '20px',
    },
    switch: {
      trackBg: semantic.surface.subtle,
      trackBgChecked: semantic.accent.primary,
      thumbBg: semantic.surface.default,
      thumbBgChecked: semantic.text.onAccent,
      borderFocus: semantic.border.focus,
      width: '44px',
      height: '24px',
    },
    button: {
      primaryBg: semantic.accent.primary,
      primaryBgHover: semantic.accent.primaryHover,
      primaryText: semantic.text.onAccent,
      primaryBorder: 'transparent',
      secondaryBg: semantic.surface.subtle,
      secondaryBgHover: semantic.border.default,
      secondaryText: semantic.text.primary,
      secondaryBorder: semantic.border.default,
      ghostBg: 'transparent',
      ghostBgHover: semantic.surface.subtle,
      ghostText: semantic.text.primary,
      destructiveBg: semantic.feedback.error,
      destructiveBgHover: primitives.colors.red['700'],
      destructiveText: semantic.text.onAccent,
      outlineBg: 'transparent',
      outlineBgHover: semantic.surface.subtle,
      outlineText: semantic.text.primary,
      outlineBorder: semantic.border.default,
      radius: primitives.radius.md,
      height: '40px',
      paddingX: primitives.spacing.md,
      disabledBg: semantic.surface.subtle,
      disabledText: semantic.text.muted,
      focusRing: semantic.border.focus,
    },
    alert: {
      defaultBg: semantic.surface.subtle,
      defaultBorder: semantic.border.default,
      defaultText: semantic.text.primary,
      defaultIcon: semantic.text.secondary,
      errorBg: semantic.feedback.errorBg,
      errorBorder: semantic.feedback.error,
      errorText: semantic.feedback.error,
      errorIcon: semantic.feedback.error,
      successBg: semantic.feedback.successBg,
      successBorder: semantic.feedback.success,
      successText: semantic.feedback.success,
      successIcon: semantic.feedback.success,
      warningBg: semantic.feedback.warningBg,
      warningBorder: semantic.feedback.warning,
      warningText: semantic.text.primary,
      warningIcon: semantic.feedback.warning,
      infoBg: semantic.feedback.infoBg,
      infoBorder: semantic.feedback.info,
      infoText: semantic.feedback.info,
      infoIcon: semantic.feedback.info,
      radius: primitives.radius.md,
      paddingX: primitives.spacing.md,
      paddingY: primitives.spacing.md,
    },
    badge: {
      defaultBg: semantic.surface.subtle,
      defaultText: semantic.text.primary,
      primaryBg: semantic.accent.primary,
      primaryText: semantic.text.onAccent,
      secondaryBg: semantic.surface.subtle,
      secondaryText: semantic.text.secondary,
      destructiveBg: semantic.feedback.error,
      destructiveText: semantic.text.onAccent,
      outlineBg: 'transparent',
      outlineText: semantic.text.primary,
      outlineBorder: semantic.border.default,
      radius: primitives.radius.full,
      paddingX: primitives.spacing.sm,
      paddingY: '2px',
    },
    toast: {
      bg: semantic.surface.elevated,
      border: semantic.border.default,
      text: semantic.text.primary,
      description: semantic.text.secondary,
      successBg: semantic.feedback.successBg,
      successBorder: semantic.feedback.success,
      successText: semantic.feedback.success,
      errorBg: semantic.feedback.errorBg,
      errorBorder: semantic.feedback.error,
      errorText: semantic.feedback.error,
      radius: primitives.radius.lg,
      shadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    },
    card: {
      bg: semantic.surface.elevated,
      border: semantic.border.default,
      radius: primitives.radius.lg,
      shadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      headerBg: 'transparent',
      headerBorder: semantic.border.subtle,
      footerBg: semantic.surface.subtle,
      footerBorder: semantic.border.subtle,
      padding: primitives.spacing.lg,
    },
    dialog: {
      overlayBg: semantic.surface.overlay,
      bg: semantic.surface.elevated,
      border: semantic.border.default,
      radius: primitives.radius.xl,
      shadow: '0 8px 30px rgba(0, 0, 0, 0.2)',
      headerBorder: semantic.border.subtle,
      footerBorder: semantic.border.subtle,
      padding: primitives.spacing.lg,
    },
    dropdown: {
      bg: semantic.surface.elevated,
      border: semantic.border.default,
      radius: primitives.radius.md,
      shadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
      itemBg: 'transparent',
      itemBgHover: semantic.surface.subtle,
      itemText: semantic.text.primary,
      itemTextHover: semantic.text.primary,
      separatorColor: semantic.border.subtle,
      padding: primitives.spacing.xs,
    },
    tabs: {
      listBg: semantic.surface.subtle,
      listBorder: semantic.border.default,
      triggerBg: 'transparent',
      triggerBgActive: semantic.surface.default,
      triggerText: semantic.text.secondary,
      triggerTextActive: semantic.text.primary,
      contentBg: semantic.surface.default,
      contentBorder: semantic.border.default,
      indicator: semantic.accent.primary,
    },
    sidebar: {
      bg: semantic.surface.default,
      border: semantic.border.default,
      itemBg: 'transparent',
      itemBgHover: semantic.surface.subtle,
      itemBgActive: semantic.accent.primary,
      itemText: semantic.text.secondary,
      itemTextHover: semantic.text.primary,
      itemTextActive: semantic.text.onAccent,
      groupText: semantic.text.muted,
      divider: semantic.border.subtle,
    },
    table: {
      bg: semantic.surface.default,
      headerBg: semantic.surface.subtle,
      headerText: semantic.text.primary,
      rowBg: semantic.surface.default,
      rowBgHover: semantic.surface.subtle,
      rowBgStriped: semantic.surface.subtle,
      cellText: semantic.text.primary,
      border: semantic.border.default,
      radius: primitives.radius.md,
    },
    avatar: {
      bg: semantic.surface.subtle,
      text: semantic.text.primary,
      border: semantic.border.default,
      fallbackBg: semantic.accent.primary,
      fallbackText: semantic.text.onAccent,
      radius: primitives.radius.full,
    },
  };
}

// ============================================
// CONTEXT & PROVIDER
// ============================================

export interface BAIVTokenContextValue {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  resolvedMode: 'light' | 'dark';
  primitives: PrimitiveTokens;
  semantic: SemanticTokens;
  components: ComponentTokens;
  getComponentTokens: <K extends keyof ComponentTokens>(component: K) => ComponentTokens[K];
  getCSSVariable: (token: string) => string;
}

const BAIVTokenContext = createContext<BAIVTokenContextValue | null>(null);

export interface BAIVTokenProviderProps {
  children: React.ReactNode;
  initialMode?: ThemeMode;
  primitives?: PrimitiveTokens;
  semanticLight?: SemanticTokens;
  semanticDark?: SemanticTokens;
  onModeChange?: (mode: 'light' | 'dark') => void;
}

/**
 * BAIV Design Token Provider
 * 
 * Wraps the application and provides design tokens to all
 * branded components via context.
 */
export function BAIVTokenProvider({
  children,
  initialMode = 'light',
  primitives = defaultPrimitives,
  semanticLight = defaultSemanticLight,
  semanticDark = defaultSemanticDark,
  onModeChange,
}: BAIVTokenProviderProps) {
  const [mode, setModeState] = useState<ThemeMode>(initialMode);
  const [systemMode, setSystemMode] = useState<'light' | 'dark'>('light');

  // Detect system preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setSystemMode(mediaQuery.matches ? 'dark' : 'light');

    const handler = (e: MediaQueryListEvent) => {
      setSystemMode(e.matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const resolvedMode = mode === 'system' ? systemMode : mode;

  const semantic = resolvedMode === 'dark' ? semanticDark : semanticLight;
  const components = useMemo(
    () => createComponentTokens(semantic, primitives),
    [semantic, primitives]
  );

  // Inject CSS custom properties
  useEffect(() => {
    const root = document.documentElement;
    
    // Toggle dark class
    root.classList.toggle('dark', resolvedMode === 'dark');

    // Inject semantic tokens
    Object.entries(semantic).forEach(([category, tokens]) => {
      Object.entries(tokens).forEach(([key, value]) => {
        root.style.setProperty(`--${category}-${toKebab(key)}`, value as string);
      });
    });

    // Inject component tokens
    Object.entries(components).forEach(([component, tokens]) => {
      Object.entries(tokens).forEach(([key, value]) => {
        root.style.setProperty(`--${component}-${toKebab(key)}`, value as string);
      });
    });

    onModeChange?.(resolvedMode);
  }, [semantic, components, resolvedMode, onModeChange]);

  const setMode = useCallback((newMode: ThemeMode) => {
    setModeState(newMode);
    // Persist preference
    if (typeof window !== 'undefined') {
      localStorage.setItem('baiv-theme-mode', newMode);
    }
  }, []);

  const getComponentTokens = useCallback(
    <K extends keyof ComponentTokens>(component: K): ComponentTokens[K] => {
      return components[component];
    },
    [components]
  );

  const getCSSVariable = useCallback((token: string): string => {
    return `var(--${toKebab(token)})`;
  }, []);

  const contextValue: BAIVTokenContextValue = {
    mode,
    setMode,
    resolvedMode,
    primitives,
    semantic,
    components,
    getComponentTokens,
    getCSSVariable,
  };

  return (
    <BAIVTokenContext.Provider value={contextValue}>
      {children}
    </BAIVTokenContext.Provider>
  );
}

// ============================================
// HOOKS
// ============================================

/**
 * Hook to access the full BAIV token system
 */
export function useBAIVTokens(): BAIVTokenContextValue {
  const context = useContext(BAIVTokenContext);
  if (!context) {
    throw new Error('useBAIVTokens must be used within BAIVTokenProvider');
  }
  return context;
}

/**
 * Hook to access tokens for a specific component
 */
export function useComponentTokens<K extends keyof ComponentTokens>(
  component: K
): ComponentTokens[K] {
  const { components } = useBAIVTokens();
  return components[component];
}

/**
 * Hook for theme mode control
 */
export function useThemeMode() {
  const { mode, setMode, resolvedMode } = useBAIVTokens();
  return { mode, setMode, resolvedMode };
}

/**
 * Hook for semantic tokens
 */
export function useSemanticTokens(): SemanticTokens {
  const { semantic } = useBAIVTokens();
  return semantic;
}

/**
 * Hook for primitive tokens
 */
export function usePrimitiveTokens(): PrimitiveTokens {
  const { primitives } = useBAIVTokens();
  return primitives;
}

// ============================================
// UTILITIES
// ============================================

function toKebab(str: string): string {
  return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

/**
 * Utility to merge token overrides
 */
export function mergeTokenOverrides<T>(
  baseTokens: T,
  overrides?: Partial<T>
): T {
  if (!overrides) return baseTokens;
  return { ...baseTokens, ...overrides };
}

/**
 * Convert tokens object to CSS style object
 */
export function tokensToStyleVars<T extends Record<string, string>>(
  prefix: string,
  tokens: T
): React.CSSProperties {
  const styles: Record<string, string> = {};
  Object.entries(tokens).forEach(([key, value]) => {
    styles[`--${prefix}-${toKebab(key)}`] = value;
  });
  return styles as React.CSSProperties;
}
