import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { AppState, Person, VacationPeriod } from '@/types';
import { generateRandomColor } from '@/utils/colorUtils';
import { getCurrentYear } from '@/utils/dateUtils';

/**
 * Главный store приложения
 * Использует Zustand с localStorage persistence
 */
export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial State
      people: [],
      vacations: [],
      selectedYear: getCurrentYear(),
      selectedPersonId: null,
      selectionStart: null,
      selectionEnd: null,

      // People Actions
      addPerson: (name: string, color?: string) => {
        const newPerson: Person = {
          id: uuidv4(),
          name,
          color: color || generateRandomColor(),
          createdAt: new Date().toISOString(),
        };

        set((state) => ({
          people: [...state.people, newPerson],
        }));
      },

      updatePerson: (id: string, updates: Partial<Omit<Person, 'id' | 'createdAt'>>) => {
        set((state) => ({
          people: state.people.map((person) =>
            person.id === id ? { ...person, ...updates } : person
          ),
        }));
      },

      deletePerson: (id: string) => {
        set((state) => ({
          people: state.people.filter((person) => person.id !== id),
          vacations: state.vacations.filter((vacation) => vacation.personId !== id),
          selectedPersonId: state.selectedPersonId === id ? null : state.selectedPersonId,
        }));
      },

      // Vacation Actions
      addVacation: (vacation: Omit<VacationPeriod, 'id' | 'createdAt'>) => {
        const newVacation: VacationPeriod = {
          id: uuidv4(),
          ...vacation,
          createdAt: new Date().toISOString(),
        };

        set((state) => ({
          vacations: [...state.vacations, newVacation],
        }));
      },

      updateVacation: (
        id: string,
        updates: Partial<Omit<VacationPeriod, 'id' | 'createdAt'>>
      ) => {
        set((state) => ({
          vacations: state.vacations.map((vacation) =>
            vacation.id === id ? { ...vacation, ...updates } : vacation
          ),
        }));
      },

      deleteVacation: (id: string) => {
        set((state) => ({
          vacations: state.vacations.filter((vacation) => vacation.id !== id),
        }));
      },

      deleteVacationsByPerson: (personId: string) => {
        set((state) => ({
          vacations: state.vacations.filter((vacation) => vacation.personId !== personId),
        }));
      },

      // UI Actions
      setSelectedYear: (year: number) => {
        set({ selectedYear: year });
      },

      setSelectedPerson: (id: string | null) => {
        set({ selectedPersonId: id });
      },

      setSelectionStart: (date: string | null) => {
        set({ selectionStart: date });
      },

      setSelectionEnd: (date: string | null) => {
        set({ selectionEnd: date });
      },

      clearSelection: () => {
        set({
          selectionStart: null,
          selectionEnd: null,
        });
      },

      // Helper Functions
      getPersonById: (id: string) => {
        return get().people.find((person) => person.id === id);
      },

      getVacationsByPerson: (personId: string) => {
        return get().vacations.filter((vacation) => vacation.personId === personId);
      },

      getVacationsByYear: (year: number) => {
        return get().vacations.filter((vacation) => {
          const startYear = new Date(vacation.startDate).getFullYear();
          const endYear = new Date(vacation.endDate).getFullYear();
          return startYear === year || endYear === year;
        });
      },
    }),
    {
      name: 'vacation-calendar-storage',
      storage: createJSONStorage(() => localStorage),
      // Можно добавить partialize для выборочного сохранения
      partialize: (state) => ({
        people: state.people,
        vacations: state.vacations,
        selectedYear: state.selectedYear,
        // Не сохраняем UI state (selection)
      }),
    }
  )
);

/**
 * Хук для получения выбранного человека
 */
export function useSelectedPerson() {
  const selectedPersonId = useStore((state) => state.selectedPersonId);
  const getPersonById = useStore((state) => state.getPersonById);
  return selectedPersonId ? getPersonById(selectedPersonId) : null;
}

/**
 * Хук для получения отпусков выбранного человека
 */
export function useSelectedPersonVacations() {
  const selectedPersonId = useStore((state) => state.selectedPersonId);
  const getVacationsByPerson = useStore((state) => state.getVacationsByPerson);
  return selectedPersonId ? getVacationsByPerson(selectedPersonId) : [];
}

/**
 * Хук для получения отпусков текущего года
 */
export function useCurrentYearVacations() {
  const selectedYear = useStore((state) => state.selectedYear);
  const getVacationsByYear = useStore((state) => state.getVacationsByYear);
  return getVacationsByYear(selectedYear);
}
