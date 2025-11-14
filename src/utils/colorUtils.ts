/**
 * Предустановленная палитра ярких, различимых цветов
 * Подобраны так, чтобы хорошо различались и выглядели приятно
 */
const COLOR_PALETTE = [
  '#3B82F6', // Blue
  '#EF4444', // Red
  '#10B981', // Green
  '#F59E0B', // Amber
  '#8B5CF6', // Violet
  '#EC4899', // Pink
  '#14B8A6', // Teal
  '#F97316', // Orange
  '#6366F1', // Indigo
  '#84CC16', // Lime
  '#06B6D4', // Cyan
  '#F43F5E', // Rose
  '#8B5A3C', // Brown
  '#6B7280', // Gray
  '#A855F7', // Purple
  '#22D3EE', // Sky
  '#FB923C', // Orange-light
  '#4ADE80', // Green-light
];

// Счетчик для циклического выбора цветов
let colorIndex = 0;

/**
 * Генерирует случайный цвет из палитры
 * Использует циклический выбор для лучшего распределения
 */
export function generateRandomColor(): string {
  const color = COLOR_PALETTE[colorIndex % COLOR_PALETTE.length];
  colorIndex++;
  return color;
}

/**
 * Генерирует полностью случайный цвет (не из палитры)
 */
export function generateTrulyRandomColor(): string {
  return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
}

/**
 * Конвертирует HEX цвет в RGB
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

/**
 * Конвертирует RGB в HEX
 */
export function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map((x) => {
    const hex = Math.round(x).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
}

/**
 * Смешивает два цвета (усреднение RGB)
 */
export function blendTwoColors(color1: string, color2: string): string {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);

  if (!rgb1 || !rgb2) {
    return color1;
  }

  const r = (rgb1.r + rgb2.r) / 2;
  const g = (rgb1.g + rgb2.g) / 2;
  const b = (rgb1.b + rgb2.b) / 2;

  return rgbToHex(r, g, b);
}

/**
 * Смешивает несколько цветов (усреднение RGB)
 */
export function blendColors(colors: string[]): string {
  if (colors.length === 0) return '#000000';
  if (colors.length === 1) return colors[0];

  const rgbColors = colors.map(hexToRgb).filter((c) => c !== null) as Array<{
    r: number;
    g: number;
    b: number;
  }>;

  if (rgbColors.length === 0) return '#000000';

  const r = rgbColors.reduce((sum, c) => sum + c.r, 0) / rgbColors.length;
  const g = rgbColors.reduce((sum, c) => sum + c.g, 0) / rgbColors.length;
  const b = rgbColors.reduce((sum, c) => sum + c.b, 0) / rgbColors.length;

  return rgbToHex(r, g, b);
}

/**
 * Создает CSS linear gradient из массива цветов
 * Используется для визуализации пересечений
 */
export function createGradient(colors: string[], angle: number = 90): string {
  if (colors.length === 0) return 'transparent';
  if (colors.length === 1) return colors[0];

  const stops = colors.map((color, index) => {
    const position = (index / (colors.length - 1)) * 100;
    return `${color} ${position}%`;
  }).join(', ');

  return `linear-gradient(${angle}deg, ${stops})`;
}

/**
 * Создает CSS repeating-linear-gradient для полосатого паттерна
 * Лучший вариант для визуализации пересечений - хорошо видно все цвета
 */
export function createStripedPattern(colors: string[], stripeWidth: number = 20): string {
  if (colors.length === 0) return 'transparent';
  if (colors.length === 1) return colors[0];

  const stops: string[] = [];
  colors.forEach((color, index) => {
    const start = index * stripeWidth;
    const end = (index + 1) * stripeWidth;
    stops.push(`${color} ${start}px`);
    stops.push(`${color} ${end}px`);
  });

  return `repeating-linear-gradient(45deg, ${stops.join(', ')})`;
}

/**
 * Добавляет прозрачность к HEX цвету
 * @param hex - HEX цвет (#FF5733)
 * @param alpha - прозрачность (0-1)
 */
export function addAlpha(hex: string, alpha: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;

  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
}

/**
 * Проверяет контрастность цвета и возвращает черный или белый текст
 * для лучшей читаемости
 */
export function getContrastText(hex: string): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return '#000000';

  // Формула относительной яркости
  const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;

  return luminance > 0.5 ? '#000000' : '#FFFFFF';
}

/**
 * Затемняет цвет на указанный процент
 */
export function darkenColor(hex: string, percent: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;

  const factor = 1 - percent / 100;
  const r = Math.max(0, rgb.r * factor);
  const g = Math.max(0, rgb.g * factor);
  const b = Math.max(0, rgb.b * factor);

  return rgbToHex(r, g, b);
}

/**
 * Осветляет цвет на указанный процент
 */
export function lightenColor(hex: string, percent: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;

  const factor = percent / 100;
  const r = Math.min(255, rgb.r + (255 - rgb.r) * factor);
  const g = Math.min(255, rgb.g + (255 - rgb.g) * factor);
  const b = Math.min(255, rgb.b + (255 - rgb.b) * factor);

  return rgbToHex(r, g, b);
}

/**
 * Валидация HEX цвета
 */
export function isValidHex(hex: string): boolean {
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex);
}

/**
 * Сбрасывает счетчик цветов (для тестов)
 */
export function resetColorIndex(): void {
  colorIndex = 0;
}
