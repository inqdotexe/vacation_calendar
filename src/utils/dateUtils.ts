import {
  format,
  parse,
  isValid,
  differenceInDays,
  eachDayOfInterval,
  startOfYear,
  endOfYear,
  startOfMonth,
  endOfMonth,
  getMonth,
  getYear,
  getDay,
  isSameDay,
  isWithinInterval,
  addDays,
} from 'date-fns';
import { ru } from 'date-fns/locale';

/**
 * Форматы дат
 */
export const DATE_FORMAT = 'dd.MM.yyyy'; // 07.02.2026
export const ISO_FORMAT = 'yyyy-MM-dd'; // 2026-02-07

/**
 * Форматирует дату в читаемый формат DD.MM.YYYY
 */
export function formatDate(date: Date | string): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, DATE_FORMAT);
}

/**
 * Форматирует дату в ISO формат YYYY-MM-DD
 */
export function formatISO(date: Date): string {
  return format(date, ISO_FORMAT);
}

/**
 * Парсит ISO строку в Date
 */
export function parseISO(isoString: string): Date {
  return parse(isoString, ISO_FORMAT, new Date());
}

/**
 * Парсит строку формата DD.MM.YYYY в Date
 */
export function parseDate(dateString: string): Date {
  return parse(dateString, DATE_FORMAT, new Date());
}

/**
 * Проверяет валидность даты
 */
export function isValidDate(date: Date | string): boolean {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return isValid(dateObj);
}

/**
 * Вычисляет количество дней между датами (включительно)
 */
export function getDaysBetween(startDate: Date | string, endDate: Date | string): number {
  const start = typeof startDate === 'string' ? parseISO(startDate) : startDate;
  const end = typeof endDate === 'string' ? parseISO(endDate) : endDate;
  return differenceInDays(end, start) + 1; // +1 чтобы включить оба дня
}

/**
 * Возвращает массив всех дат в интервале
 */
export function getDatesInRange(startDate: Date | string, endDate: Date | string): Date[] {
  const start = typeof startDate === 'string' ? parseISO(startDate) : startDate;
  const end = typeof endDate === 'string' ? parseISO(endDate) : endDate;
  return eachDayOfInterval({ start, end });
}

/**
 * Возвращает все даты в году
 */
export function getDatesInYear(year: number): Date[] {
  const start = startOfYear(new Date(year, 0, 1));
  const end = endOfYear(new Date(year, 0, 1));
  return eachDayOfInterval({ start, end });
}

/**
 * Возвращает все даты в месяце
 */
export function getDatesInMonth(year: number, month: number): Date[] {
  const start = startOfMonth(new Date(year, month, 1));
  const end = endOfMonth(new Date(year, month, 1));
  return eachDayOfInterval({ start, end });
}

/**
 * Получить номер месяца (0-11)
 */
export function getMonthNumber(date: Date): number {
  return getMonth(date);
}

/**
 * Получить год
 */
export function getYearNumber(date: Date): number {
  return getYear(date);
}

/**
 * Получить день недели (0 = воскресенье, 6 = суббота)
 */
export function getDayOfWeek(date: Date): number {
  return getDay(date);
}

/**
 * Проверяет, является ли день выходным
 */
export function isWeekend(date: Date): boolean {
  const day = getDayOfWeek(date);
  return day === 0 || day === 6; // Воскресенье или суббота
}

/**
 * Проверяет, совпадают ли две даты
 */
export function isSameDayCheck(date1: Date | string, date2: Date | string): boolean {
  const d1 = typeof date1 === 'string' ? parseISO(date1) : date1;
  const d2 = typeof date2 === 'string' ? parseISO(date2) : date2;
  return isSameDay(d1, d2);
}

/**
 * Проверяет, находится ли дата в интервале (включительно)
 */
export function isDateInRange(
  date: Date | string,
  startDate: Date | string,
  endDate: Date | string
): boolean {
  const d = typeof date === 'string' ? parseISO(date) : date;
  const start = typeof startDate === 'string' ? parseISO(startDate) : startDate;
  const end = typeof endDate === 'string' ? parseISO(endDate) : endDate;
  return isWithinInterval(d, { start, end });
}

/**
 * Форматирует период в формат: "07.02.2026 - 13.02.2026 (7) Имя"
 */
export function formatVacationPeriod(
  startDate: Date | string,
  endDate: Date | string,
  personName: string
): string {
  const start = typeof startDate === 'string' ? parseISO(startDate) : startDate;
  const end = typeof endDate === 'string' ? parseISO(endDate) : endDate;
  const days = getDaysBetween(start, end);
  const startFormatted = formatDate(start);
  const endFormatted = formatDate(end);
  return `${startFormatted} - ${endFormatted} (${days}) ${personName}`;
}

/**
 * Получить текущую дату
 */
export function getToday(): Date {
  return new Date();
}

/**
 * Получить текущий год
 */
export function getCurrentYear(): number {
  return getYearNumber(getToday());
}

/**
 * Названия месяцев на русском
 */
export const MONTH_NAMES = [
  'Январь',
  'Февраль',
  'Март',
  'Апрель',
  'Май',
  'Июнь',
  'Июль',
  'Август',
  'Сентябрь',
  'Октябрь',
  'Ноябрь',
  'Декабрь',
];

/**
 * Короткие названия дней недели
 */
export const DAY_NAMES_SHORT = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];

/**
 * Получить название месяца
 */
export function getMonthName(monthIndex: number): string {
  return MONTH_NAMES[monthIndex] || '';
}

/**
 * Добавляет дни к дате
 */
export function addDaysToDate(date: Date | string, days: number): Date {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return addDays(d, days);
}
