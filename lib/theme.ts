import { ThemeConfig } from 'antd';
import { hexToRgb } from './colorUtils';

// Paleta de cores personalizada com verde #3a9c74 como cor primária
export const colors = {
  // Cores primárias (verde)
  primary: {
    light: '#4fb58c', // Versão mais clara
    main: '#3a9c74', // Cor principal
    dark: '#2b8361', // Versão mais escura
  },
  // Cores secundárias complementares
  secondary: {
    light: '#5c8edd',
    main: '#3e73cc',
    dark: '#2d5daf',
  },
  // Cores para sucessos, avisos, erros
  success: {
    light: '#73d13d',
    main: '#52c41a',
    dark: '#389e0d',
  },
  warning: {
    light: '#ffc53d',
    main: '#faad14',
    dark: '#d48806',
  },
  error: {
    light: '#ff7875',
    main: '#ff4d4f',
    dark: '#d9363e',
  },
  // Cores neutras para texto, fundos, etc.
  neutral: {
    100: '#ffffff',
    200: '#f5f5f5',
    300: '#f0f0f0',
    400: '#d9d9d9',
    500: '#bfbfbf',
    600: '#8c8c8c',
    700: '#595959',
    800: '#434343',
    900: '#262626',
    1000: '#000000',
  },
};

// CSS Variables para serem utilizadas em CSS Modules
export const cssVariables = {
  light: {
    '--primary-color': colors.primary.main,
    '--primary-color-light': colors.primary.light,
    '--primary-color-dark': colors.primary.dark,
    '--secondary-color': colors.secondary.main,
    '--secondary-color-light': colors.secondary.light,
    '--secondary-color-dark': colors.secondary.dark,
    '--success-color': colors.success.main,
    '--warning-color': colors.warning.main,
    '--error-color': colors.error.main,
    '--text-color': colors.neutral[900],
    '--text-color-secondary': colors.neutral[700],
    '--text-color-tertiary': colors.neutral[600],
    '--bg-color': colors.neutral[100],
    '--bg-color-secondary': colors.neutral[200],
    '--border-color': colors.neutral[300],
    '--border-color-dark': colors.neutral[400],
    '--shadow-color': 'rgba(0, 0, 0, 0.05)',
  },
  dark: {
    '--primary-color': colors.primary.light,
    '--primary-color-light': colors.primary.main,
    '--primary-color-dark': colors.primary.dark,
    '--secondary-color': colors.secondary.light,
    '--secondary-color-light': colors.secondary.main,
    '--secondary-color-dark': colors.secondary.dark,
    '--success-color': colors.success.light,
    '--warning-color': colors.warning.light,
    '--error-color': colors.error.light,
    '--text-color': colors.neutral[200],
    '--text-color-secondary': colors.neutral[300],
    '--text-color-tertiary': colors.neutral[400],
    '--bg-color': colors.neutral[900],
    '--bg-color-secondary': colors.neutral[800],
    '--border-color': colors.neutral[700],
    '--border-color-dark': colors.neutral[600],
    '--shadow-color': 'rgba(0, 0, 0, 0.2)',
  },
};

// Tema claro para Ant Design
export const lightTheme: ThemeConfig = {
  token: {
    colorPrimary: colors.primary.main,
    colorSuccess: colors.success.main,
    colorWarning: colors.warning.main,
    colorError: colors.error.main,
    colorInfo: colors.primary.main,
    colorTextBase: colors.neutral[900],
    colorBgBase: colors.neutral[100],
    borderRadius: 4,
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    colorLink: colors.primary.main,
    colorLinkHover: colors.primary.light,
    colorLinkActive: colors.primary.dark,
  },
  components: {
    Button: {
      colorPrimary: colors.primary.main,
      colorPrimaryHover: colors.primary.light,
      colorPrimaryActive: colors.primary.dark,
      controlOutline: colors.primary.light,
    },
    Menu: {
      itemSelectedBg: colors.primary.light,
      itemSelectedColor: colors.neutral[100],
    },
    Card: {
      colorBorderSecondary: colors.neutral[300],
      colorBgContainer: colors.neutral[100],
      boxShadowTertiary: `0 1px 2px -2px rgba(0, 0, 0, 0.08),
        0 3px 6px 0 rgba(0, 0, 0, 0.06),
        0 5px 12px 4px rgba(0, 0, 0, 0.04)`,
    },
    Table: {
      colorBgContainer: colors.neutral[100],
      headerBg: colors.neutral[200],
    },
    Tabs: {
      colorPrimary: colors.primary.main,
      colorPrimaryHover: colors.primary.light,
      colorPrimaryActive: colors.primary.dark,
    },
    Statistic: {
      colorTextHeading: colors.neutral[700],
    },
    Divider: {
      colorSplit: colors.neutral[300],
      colorTextHeading: colors.primary.main,
    },
    Typography: {
      colorTextHeading: colors.neutral[900],
      colorTextSecondary: colors.neutral[700],
      colorTextTertiary: colors.neutral[600],
    },
    Avatar: {
      colorBgContainer: colors.primary.light,
    },
    Tag: {
      colorPrimary: colors.primary.main,
      colorSuccess: colors.success.main,
      colorWarning: colors.warning.main,
      colorError: colors.error.main,
    },
    Badge: {
      colorPrimary: colors.primary.main,
    },
    List: {
      colorSplit: colors.neutral[300],
      colorTextHeading: colors.neutral[900],
      colorText: colors.neutral[900],
      colorPrimary: colors.primary.main,
      colorPrimaryHover: colors.primary.light,
      colorBgContainer: colors.neutral[100],
    },
    Form: {
      colorTextHeading: colors.neutral[900],
      colorTextLabel: colors.neutral[700],
      colorErrorBorder: colors.error.light,
      colorErrorOutline: `rgba(${hexToRgb(colors.error.main).r}, ${hexToRgb(colors.error.main).g}, ${hexToRgb(colors.error.main).b}, 0.2)`,
    },
    Input: {
      colorPrimary: colors.primary.main,
      colorPrimaryHover: colors.primary.light,
      colorBorder: colors.neutral[300],
      controlOutlineWidth: 2,
      controlOutline: `rgba(${hexToRgb(colors.primary.main).r}, ${hexToRgb(colors.primary.main).g}, ${hexToRgb(colors.primary.main).b}, 0.2)`,
    },
    Select: {
      colorPrimary: colors.primary.main,
      colorPrimaryHover: colors.primary.light,
      colorBorder: colors.neutral[300],
      controlOutlineWidth: 2,
      controlOutline: `rgba(${hexToRgb(colors.primary.main).r}, ${hexToRgb(colors.primary.main).g}, ${hexToRgb(colors.primary.main).b}, 0.2)`,
    },
    Checkbox: {
      colorPrimary: colors.primary.main,
      borderRadius: 2,
    },
    Radio: {
      colorPrimary: colors.primary.main,
    },
    Slider: {
      colorPrimary: colors.primary.main,
      colorPrimaryBorderHover: colors.primary.light,
    },
  },
};

// Tema escuro para Ant Design
export const darkTheme: ThemeConfig = {
  token: {
    colorPrimary: colors.primary.light,
    colorSuccess: colors.success.light,
    colorWarning: colors.warning.light,
    colorError: colors.error.light,
    colorInfo: colors.primary.light,
    colorTextBase: colors.neutral[200],
    colorBgBase: colors.neutral[900],
    borderRadius: 4,
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    colorLink: colors.primary.light,
    colorLinkHover: colors.primary.main,
    colorLinkActive: colors.primary.dark,
  },
  components: {
    Button: {
      colorPrimary: colors.primary.light,
      colorPrimaryHover: colors.primary.main,
      colorPrimaryActive: colors.primary.dark,
      controlOutline: colors.primary.main,
    },
    Menu: {
      itemSelectedBg: colors.primary.dark,
      itemSelectedColor: colors.neutral[300],
    },
    Card: {
      colorBorderSecondary: colors.neutral[700],
      colorBgContainer: colors.neutral[800],
      boxShadowTertiary: `0 1px 2px -2px rgba(0, 0, 0, 0.24),
        0 3px 6px 0 rgba(0, 0, 0, 0.20),
        0 5px 12px 4px rgba(0, 0, 0, 0.16)`,
    },
    Table: {
      colorBgContainer: colors.neutral[800],
      headerBg: colors.neutral[700],
    },
    Tabs: {
      colorPrimary: colors.primary.light,
      colorPrimaryHover: colors.primary.main,
      colorPrimaryActive: colors.primary.light,
    },
    Statistic: {
      colorTextHeading: colors.neutral[300],
    },
    Divider: {
      colorSplit: colors.neutral[700],
      colorTextHeading: colors.primary.light,
    },
    Typography: {
      colorTextHeading: colors.neutral[200],
      colorTextSecondary: colors.neutral[400],
      colorTextTertiary: colors.neutral[500],
    },
    Avatar: {
      colorBgContainer: colors.primary.dark,
    },
    Tag: {
      colorPrimary: colors.primary.light,
      colorSuccess: colors.success.light,
      colorWarning: colors.warning.light,
      colorError: colors.error.light,
    },
    Badge: {
      colorPrimary: colors.primary.light,
    },
    List: {
      colorSplit: colors.neutral[700],
      colorTextHeading: colors.neutral[200],
      colorText: colors.neutral[300],
      colorPrimary: colors.primary.light,
      colorPrimaryHover: colors.primary.main,
      colorBgContainer: colors.neutral[800],
    },
    Form: {
      colorTextHeading: colors.neutral[200],
      colorTextLabel: colors.neutral[300],
      colorErrorBorder: colors.error.light,
      colorErrorOutline: `rgba(${hexToRgb(colors.error.light).r}, ${hexToRgb(colors.error.light).g}, ${hexToRgb(colors.error.light).b}, 0.2)`,
    },
    Input: {
      colorPrimary: colors.primary.light,
      colorPrimaryHover: colors.primary.main,
      colorBorder: colors.neutral[600],
      controlOutlineWidth: 2,
      controlOutline: `rgba(${hexToRgb(colors.primary.light).r}, ${hexToRgb(colors.primary.light).g}, ${hexToRgb(colors.primary.light).b}, 0.2)`,
      colorBgContainer: colors.neutral[800],
      colorText: colors.neutral[200],
    },
    Select: {
      colorPrimary: colors.primary.light,
      colorPrimaryHover: colors.primary.main,
      colorBorder: colors.neutral[600],
      controlOutlineWidth: 2,
      controlOutline: `rgba(${hexToRgb(colors.primary.light).r}, ${hexToRgb(colors.primary.light).g}, ${hexToRgb(colors.primary.light).b}, 0.2)`,
      colorTextPlaceholder: colors.neutral[500],
      colorBgContainer: colors.neutral[800],
      colorText: colors.neutral[200],
    },
    Checkbox: {
      colorPrimary: colors.primary.light,
      borderRadius: 2,
    },
    Radio: {
      colorPrimary: colors.primary.light,
    },
    Slider: {
      colorPrimary: colors.primary.light,
      colorPrimaryBorderHover: colors.primary.main,
    },
  },
};

// Função auxiliar para obter o tema baseado no modo atual
export const getTheme = (mode: 'light' | 'dark'): ThemeConfig => {
  return mode === 'light' ? lightTheme : darkTheme;
};