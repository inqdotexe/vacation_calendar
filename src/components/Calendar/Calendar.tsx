import { useStore } from '@/store/useStore'
import { CalendarMonth } from './CalendarMonth'

/**
 * Главный компонент календаря
 * Отображает 12 месяцев в grid layout
 */
export function Calendar() {
  const selectedYear = useStore((state) => state.selectedYear)

  // Массив месяцев (0-11)
  const months = Array.from({ length: 12 }, (_, i) => i)

  return (
    <div className="space-y-4">
      {/* Calendar grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {months.map((monthIndex) => (
          <CalendarMonth
            key={monthIndex}
            year={selectedYear}
            month={monthIndex}
          />
        ))}
      </div>
    </div>
  )
}
