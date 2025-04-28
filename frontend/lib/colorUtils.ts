/**
 * Converte uma cor hexadecimal para RGB
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  // Remove o # se existir
  const cleanHex = hex.charAt(0) === '#' ? hex.substring(1) : hex;
  
  // Parseia os valores
  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);
  
  return { r, g, b };
}

/**
 * Converte RGB para hexadecimal
 */
export function rgbToHex(r: number, g: number, b: number): string {
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

/**
 * Ajusta a luminosidade de uma cor (percentual de -100 a 100)
 * Valores negativos escurecem, valores positivos clareiam
 */
export function adjustBrightness(hex: string, percent: number): string {
  const { r, g, b } = hexToRgb(hex);
  
  // Limita o percentual entre -100 e 100
  const p = Math.min(100, Math.max(-100, percent));
  
  // Ajusta cada canal de cor
  const adjustValue = (value: number) => {
    if (p > 0) {
      // Clarear: interpolar em direção ao branco (255)
      return Math.round(value + ((255 - value) * (p / 100)));
    } else {
      // Escurecer: interpolar em direção ao preto (0)
      return Math.round(value * (1 + p / 100));
    }
  };
  
  // Retorna a nova cor hex
  return rgbToHex(
    adjustValue(r),
    adjustValue(g),
    adjustValue(b)
  );
}

/**
 * Gera uma paleta de cores a partir de uma cor base
 * @param baseColor A cor base em formato hexadecimal (ex: '#3a9c74')
 * @param steps Número de passos para cada lado (claro e escuro)
 * @param step Intensidade do passo em percentual
 */
export function generateColorPalette(baseColor: string, steps: number = 5, step: number = 10): string[] {
  const palette: string[] = [baseColor];
  
  // Gera tons mais claros
  for (let i = 1; i <= steps; i++) {
    palette.push(adjustBrightness(baseColor, i * step));
  }
  
  // Gera tons mais escuros
  for (let i = 1; i <= steps; i++) {
    palette.unshift(adjustBrightness(baseColor, -i * step));
  }
  
  return palette;
}

/**
 * Gera uma cor complementar (oposta no círculo cromático)
 */
export function getComplementaryColor(hex: string): string {
  const { r, g, b } = hexToRgb(hex);
  
  // Encontra a cor complementar invertendo cada canal
  return rgbToHex(255 - r, 255 - g, 255 - b);
}

/**
 * Converte um valor hexadecimal para uma string CSS RGBA
 */
export function hexToRgba(hex: string, alpha: number = 1): string {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}