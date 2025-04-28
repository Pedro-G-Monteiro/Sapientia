import { hexToRgba } from './colorUtils';
import { colors, cssVariables } from './theme';

/**
 * Função para obter uma variável CSS
 */
export function getCssVar(varName: string): string {
  if (typeof window === 'undefined') {
    return '';
  }
  return getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
}

/**
 * Função para definir uma variável CSS
 */
export function setCssVar(varName: string, value: string): void {
  if (typeof window === 'undefined') {
    return;
  }
  document.documentElement.style.setProperty(varName, value);
}

/**
 * Aplica todas as variáveis CSS para o modo especificado
 */
export function applyThemeVariables(mode: 'light' | 'dark'): void {
  const variables = mode === 'light' ? cssVariables.light : cssVariables.dark;
  
  Object.entries(variables).forEach(([key, value]) => {
    setCssVar(key, value);
  });
}

/**
 * Gera um objeto com classes CSS para sombras baseadas na cor primária
 */
export function generateShadows(primaryColor: string = colors.primary.main): Record<string, string> {
  return {
    sm: `0 1px 2px ${hexToRgba(primaryColor, 0.05)}`,
    md: `0 4px 6px ${hexToRgba(primaryColor, 0.08)}`,
    lg: `0 10px 15px ${hexToRgba(primaryColor, 0.1)}`,
    xl: `0 20px 25px ${hexToRgba(primaryColor, 0.15)}`,
  };
}

/**
 * Atualiza a cor primária do tema
 */
export function updatePrimaryColor(newColor: string): void {
  // Atualiza a cor no objeto de cores
  colors.primary.main = newColor;
  
  // Recalcula as variações da cor
  colors.primary.light = adjustBrightness(newColor, 15);
  colors.primary.dark = adjustBrightness(newColor, -15);
  
  // Atualiza as variáveis CSS
  setCssVar('--primary-color', newColor);
  setCssVar('--primary-color-light', colors.primary.light);
  setCssVar('--primary-color-dark', colors.primary.dark);
}

/**
 * Ajusta o brilho de uma cor
 */
function adjustBrightness(hex: string, percent: number): string {
  // Se a função colorUtils estiver disponível, use-a
  if (typeof hexToRgba === 'function') {
    const rgb = hexToRgb(hex);
    const factor = 1 + percent / 100;
    
    const r = Math.min(255, Math.round(rgb.r * factor));
    const g = Math.min(255, Math.round(rgb.g * factor));
    const b = Math.min(255, Math.round(rgb.b * factor));
    
    return rgbToHex(r, g, b);
  }
  
  // Implementação simplificada se colorUtils não estiver disponível
  return hex;
}

/**
 * Converte uma cor hex para RGB
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const cleanHex = hex.charAt(0) === '#' ? hex.substring(1) : hex;
  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);
  return { r, g, b };
}

/**
 * Converte RGB para hexadecimal
 */
function rgbToHex(r: number, g: number, b: number): string {
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}