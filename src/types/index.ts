/**
 * Человек в системе
 */
export interface Person {
  id: string;              // UUID
  name: string;            // Имя
  color: string;           // HEX цвет (#FF5733)
  createdAt: string;       // ISO 8601 date string
}

/**
 * Период отпуска
 */
export interface VacationPeriod {
  id: string;              // UUID
  personId: string;        // ID человека
  startDate: string;       // ISO 8601 date string
  endDate: string;         // ISO 8601 date string
  createdAt: string;       // ISO 8601 date string
}

/**
 * Информация о дне в календаре с отпусками
 */
export interface DayInfo {
  date: Date;
  people: Person[];        // Люди в отпуске в этот день
  isOverlap: boolean;      // Есть ли пересечение (>1 человека)
}

/**
 * Данные для отображения пересечения
 */
export interface VacationOverlap {
  date: string;            // ISO date
  people: Person[];        // Люди, чьи отпуска пересекаются
  vacationIds: string[];   // ID периодов отпусков
}

/**
 * Состояние приложения
 */
export interface AppState {
  // Data
  people: Person[];
  vacations: VacationPeriod[];

  // UI State
  selectedYear: number;
  selectedPersonId: string | null;

  // Selection state для создания нового отпуска
  selectionStart: string | null;  // ISO date
  selectionEnd: string | null;    // ISO date

  // Actions - People
  addPerson: (name: string, color?: string) => void;
  updatePerson: (id: string, updates: Partial<Omit<Person, 'id' | 'createdAt'>>) => void;
  deletePerson: (id: string) => void;

  // Actions - Vacations
  addVacation: (vacation: Omit<VacationPeriod, 'id' | 'createdAt'>) => void;
  updateVacation: (id: string, updates: Partial<Omit<VacationPeriod, 'id' | 'createdAt'>>) => void;
  deleteVacation: (id: string) => void;
  deleteVacationsByPerson: (personId: string) => void;

  // Actions - UI
  setSelectedYear: (year: number) => void;
  setSelectedPerson: (id: string | null) => void;
  setSelectionStart: (date: string | null) => void;
  setSelectionEnd: (date: string | null) => void;
  clearSelection: () => void;

  // Helpers
  getPersonById: (id: string) => Person | undefined;
  getVacationsByPerson: (personId: string) => VacationPeriod[];
  getVacationsByYear: (year: number) => VacationPeriod[];
}

/**
 * Формат для отображения периода в списке
 */
export interface VacationListItem {
  id: string;
  personId: string;
  personName: string;
  personColor: string;
  startDate: Date;
  endDate: Date;
  durationDays: number;
  formattedRange: string;  // "07.02.2026 - 13.02.2026 (7) Маша"
}
