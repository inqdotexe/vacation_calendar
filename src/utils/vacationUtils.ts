import { Person, VacationPeriod, VacationOverlap, DayInfo, VacationListItem } from '@/types';
import {
  isDateInRange,
  getDatesInRange,
  parseISO,
  getDaysBetween,
  formatVacationPeriod,
} from './dateUtils';

/**
 * Проверяет, пересекаются ли два периода отпусков
 */
export function doPeriodsOverlap(
  period1: VacationPeriod,
  period2: VacationPeriod
): boolean {
  const start1 = parseISO(period1.startDate);
  const end1 = parseISO(period1.endDate);
  const start2 = parseISO(period2.startDate);
  const end2 = parseISO(period2.endDate);

  // Периоды пересекаются если:
  // start1 <= end2 AND end1 >= start2
  return start1 <= end2 && end1 >= start2;
}

/**
 * Находит все периоды, которые покрывают указанную дату
 */
export function getVacationsForDate(
  date: Date | string,
  vacations: VacationPeriod[]
): VacationPeriod[] {
  const dateStr = typeof date === 'string' ? date : date.toISOString().split('T')[0];

  return vacations.filter((vacation) => {
    return isDateInRange(dateStr, vacation.startDate, vacation.endDate);
  });
}

/**
 * Находит людей, находящихся в отпуске в указанную дату
 */
export function getPeopleOnVacationForDate(
  date: Date | string,
  vacations: VacationPeriod[],
  people: Person[]
): Person[] {
  const vacationsOnDate = getVacationsForDate(date, vacations);
  const personIds = new Set(vacationsOnDate.map((v) => v.personId));

  return people.filter((person) => personIds.has(person.id));
}

/**
 * Создает информацию о дне с отпусками
 */
export function getDayInfo(
  date: Date,
  vacations: VacationPeriod[],
  people: Person[]
): DayInfo {
  const peopleOnVacation = getPeopleOnVacationForDate(date, vacations, people);

  return {
    date,
    people: peopleOnVacation,
    isOverlap: peopleOnVacation.length > 1,
  };
}

/**
 * Находит все пересечения отпусков в указанном году
 */
export function findOverlaps(
  vacations: VacationPeriod[],
  people: Person[],
  year?: number
): VacationOverlap[] {
  const overlaps: VacationOverlap[] = [];
  const processedDates = new Set<string>();

  // Фильтруем по году если указан
  let filteredVacations = vacations;
  if (year !== undefined) {
    filteredVacations = vacations.filter((v) => {
      const startYear = new Date(v.startDate).getFullYear();
      const endYear = new Date(v.endDate).getFullYear();
      return startYear === year || endYear === year;
    });
  }

  // Для каждого отпуска получаем все даты
  filteredVacations.forEach((vacation) => {
    const dates = getDatesInRange(vacation.startDate, vacation.endDate);

    dates.forEach((date) => {
      const dateStr = date.toISOString().split('T')[0];

      // Если уже обработали эту дату, пропускаем
      if (processedDates.has(dateStr)) return;

      // Находим все отпуска на эту дату
      const vacationsOnDate = getVacationsForDate(date, filteredVacations);

      // Если больше одного отпуска - это пересечение
      if (vacationsOnDate.length > 1) {
        const peopleOnVacation = people.filter((p) =>
          vacationsOnDate.some((v) => v.personId === p.id)
        );

        overlaps.push({
          date: dateStr,
          people: peopleOnVacation,
          vacationIds: vacationsOnDate.map((v) => v.id),
        });

        processedDates.add(dateStr);
      }
    });
  });

  return overlaps;
}

/**
 * Проверяет, есть ли пересечение у конкретного человека с другими
 */
export function hasOverlapForPerson(
  personId: string,
  vacations: VacationPeriod[]
): boolean {
  const personVacations = vacations.filter((v) => v.personId === personId);
  const otherVacations = vacations.filter((v) => v.personId !== personId);

  for (const personVacation of personVacations) {
    for (const otherVacation of otherVacations) {
      if (doPeriodsOverlap(personVacation, otherVacation)) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Валидация периода отпуска
 */
export function validateVacationPeriod(
  startDate: string,
  endDate: string
): { valid: boolean; error?: string } {
  const start = parseISO(startDate);
  const end = parseISO(endDate);

  if (!start || !end) {
    return { valid: false, error: 'Неверный формат даты' };
  }

  if (start > end) {
    return { valid: false, error: 'Дата начала должна быть раньше даты окончания' };
  }

  return { valid: true };
}

/**
 * Преобразует периоды отпусков в список для отображения
 */
export function formatVacationsForList(
  vacations: VacationPeriod[],
  people: Person[]
): VacationListItem[] {
  return vacations.map((vacation) => {
    const person = people.find((p) => p.id === vacation.personId);
    const startDate = parseISO(vacation.startDate);
    const endDate = parseISO(vacation.endDate);
    const durationDays = getDaysBetween(startDate, endDate);

    return {
      id: vacation.id,
      personId: vacation.personId,
      personName: person?.name || 'Unknown',
      personColor: person?.color || '#000000',
      startDate,
      endDate,
      durationDays,
      formattedRange: formatVacationPeriod(
        startDate,
        endDate,
        person?.name || 'Unknown'
      ),
    };
  });
}

/**
 * Сортирует список отпусков по дате начала
 */
export function sortVacationsByDate(
  items: VacationListItem[],
  ascending: boolean = true
): VacationListItem[] {
  return [...items].sort((a, b) => {
    const diff = a.startDate.getTime() - b.startDate.getTime();
    return ascending ? diff : -diff;
  });
}

/**
 * Группирует отпуска по людям
 */
export function groupVacationsByPerson(
  items: VacationListItem[]
): Map<string, VacationListItem[]> {
  const grouped = new Map<string, VacationListItem[]>();

  items.forEach((item) => {
    const existing = grouped.get(item.personId) || [];
    grouped.set(item.personId, [...existing, item]);
  });

  return grouped;
}

/**
 * Вычисляет общее количество дней отпуска для человека
 */
export function getTotalVacationDays(
  personId: string,
  vacations: VacationPeriod[]
): number {
  return vacations
    .filter((v) => v.personId === personId)
    .reduce((total, vacation) => {
      return total + getDaysBetween(vacation.startDate, vacation.endDate);
    }, 0);
}

/**
 * Фильтрует отпуска по году
 */
export function filterVacationsByYear(
  vacations: VacationPeriod[],
  year: number
): VacationPeriod[] {
  return vacations.filter((vacation) => {
    const startYear = parseISO(vacation.startDate).getFullYear();
    const endYear = parseISO(vacation.endDate).getFullYear();
    return startYear === year || endYear === year;
  });
}

/**
 * Проверяет, есть ли конфликт с существующими отпусками одного человека
 */
export function hasConflictWithOwnVacations(
  personId: string,
  startDate: string,
  endDate: string,
  vacations: VacationPeriod[],
  excludeVacationId?: string
): boolean {
  const personVacations = vacations.filter(
    (v) => v.personId === personId && v.id !== excludeVacationId
  );

  const newPeriod: VacationPeriod = {
    id: 'temp',
    personId,
    startDate,
    endDate,
    createdAt: new Date().toISOString(),
  };

  return personVacations.some((vacation) => doPeriodsOverlap(newPeriod, vacation));
}
