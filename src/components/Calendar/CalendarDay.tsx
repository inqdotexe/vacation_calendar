import { useMemo } from 'react'
import { useStore } from '@/store/useStore'
import { isWeekend, isSameDayCheck, getToday, formatISO } from '@/utils/dateUtils'
import { getPeopleOnVacationForDate } from '@/utils/vacationUtils'
import { createStripedPattern, addAlpha } from '@/utils/colorUtils'

interface CalendarDayProps {
  date: Date
}

/**
 * Компонент отдельного дня в календаре
 */
export function CalendarDay({ date }: CalendarDayProps) {
  const vacations = useStore((state) => state.vacations)
  const people = useStore((state) => state.people)

  const dayNumber = date.getDate()
  const isWeekendDay = isWeekend(date)
  const isToday = isSameDayCheck(date, getToday())

  // Находим людей в отпуске в этот день
  const peopleOnVacation = useMemo(
    () => getPeopleOnVacationForDate(date, vacations, people),
    [date, vacations, people]
  )

  const hasVacations = peopleOnVacation.length > 0
  const hasOverlap = peopleOnVacation.length > 1

  // Вычисляем стиль фона
  const backgroundStyle = useMemo(() => {
    if (!hasVacations) return {}

    const colors = peopleOnVacation.map((p) => p.color)

    if (hasOverlap) {
      // Пересечение - полосатый паттерн
      return {
        background: createStripedPattern(colors, 8),
      }
    } else {
      // Один человек - полупрозрачный цвет
      return {
        backgroundColor: addAlpha(colors[0], 0.3),
      }
    }
  }, [hasVacations, hasOverlap, peopleOnVacation])

  return (
    <div
      className={`
        relative aspect-square rounded-md flex items-center justify-center text-sm
        cursor-pointer transition-all
        ${isWeekendDay ? 'bg-muted/30' : 'bg-background'}
        ${isToday ? 'ring-2 ring-primary font-bold' : ''}
        ${hasVacations ? 'hover:opacity-80' : 'hover:bg-accent'}
      `}
      style={backgroundStyle}
      title={
        hasVacations
          ? `В отпуске: ${peopleOnVacation.map((p) => p.name).join(', ')}`
          : ''
      }
    >
      {/* Day number */}
      <span
        className={`
          relative z-10
          ${isToday ? 'text-primary' : ''}
          ${isWeekendDay && !hasVacations ? 'text-muted-foreground' : ''}
          ${hasVacations ? 'font-medium' : ''}
        `}
      >
        {dayNumber}
      </span>

      {/* Today indicator */}
      {isToday && (
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
      )}

      {/* Overlap indicator */}
      {hasOverlap && (
        <div className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-destructive ring-1 ring-background" />
      )}
    </div>
  )
}
