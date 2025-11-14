import { useMemo } from 'react'
import { useStore } from '@/store/useStore'
import { isWeekend, isSameDayCheck, getToday, formatISO, isDateInRange } from '@/utils/dateUtils'
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
  const selectedPersonId = useStore((state) => state.selectedPersonId)
  const selectionStart = useStore((state) => state.selectionStart)
  const selectionEnd = useStore((state) => state.selectionEnd)
  const setSelectionStart = useStore((state) => state.setSelectionStart)
  const setSelectionEnd = useStore((state) => state.setSelectionEnd)
  const clearSelection = useStore((state) => state.clearSelection)
  const addVacation = useStore((state) => state.addVacation)
  const getPersonById = useStore((state) => state.getPersonById)

  const dayNumber = date.getDate()
  const isWeekendDay = isWeekend(date)
  const isToday = isSameDayCheck(date, getToday())
  const dateISO = formatISO(date)

  // Находим людей в отпуске в этот день
  const peopleOnVacation = useMemo(
    () => getPeopleOnVacationForDate(date, vacations, people),
    [date, vacations, people]
  )

  const hasVacations = peopleOnVacation.length > 0
  const hasOverlap = peopleOnVacation.length > 1

  // Проверяем, находится ли день в текущем выделении
  const isInSelection = useMemo(() => {
    if (!selectionStart) return false
    if (!selectionEnd) return dateISO === selectionStart

    const start = selectionStart < selectionEnd ? selectionStart : selectionEnd
    const end = selectionStart < selectionEnd ? selectionEnd : selectionStart

    return isDateInRange(dateISO, start, end)
  }, [selectionStart, selectionEnd, dateISO])

  const isSelectionStart = dateISO === selectionStart
  const isSelectionEnd = dateISO === selectionEnd

  // Обработчик клика на день
  const handleDayClick = () => {
    // Проверяем что выбран человек
    if (!selectedPersonId) {
      alert('Пожалуйста, выберите человека в боковой панели')
      return
    }

    // Если нет начала выделения - устанавливаем его
    if (!selectionStart) {
      setSelectionStart(dateISO)
      return
    }

    // Если есть начало, но нет конца - устанавливаем конец и создаем отпуск
    if (selectionStart && !selectionEnd) {
      // Определяем правильный порядок дат
      const start = selectionStart < dateISO ? selectionStart : dateISO
      const end = selectionStart < dateISO ? dateISO : selectionStart

      // Создаем период отпуска
      addVacation({
        personId: selectedPersonId,
        startDate: start,
        endDate: end,
      })

      // Очищаем выделение
      clearSelection()
      return
    }

    // Если оба уже выделены - начинаем новое выделение
    if (selectionStart && selectionEnd) {
      clearSelection()
      setSelectionStart(dateISO)
    }
  }

  // Вычисляем стиль фона
  const backgroundStyle = useMemo(() => {
    // Если день в выделении - показываем цвет выбранного человека
    if (isInSelection && selectedPersonId) {
      const selectedPerson = getPersonById(selectedPersonId)
      if (selectedPerson) {
        return {
          backgroundColor: addAlpha(selectedPerson.color, 0.4),
          border: `2px dashed ${selectedPerson.color}`,
        }
      }
    }

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
  }, [hasVacations, hasOverlap, peopleOnVacation, isInSelection, selectedPersonId, getPersonById])

  return (
    <div
      onClick={handleDayClick}
      className={`
        relative aspect-square rounded-md flex items-center justify-center text-sm
        cursor-pointer transition-all
        ${isWeekendDay && !isInSelection ? 'bg-muted/30' : 'bg-background'}
        ${isToday ? 'ring-2 ring-primary font-bold' : ''}
        ${hasVacations && !isInSelection ? 'hover:opacity-80' : 'hover:bg-accent'}
        ${isInSelection ? 'ring-2 ring-offset-2' : ''}
        ${isSelectionStart || isSelectionEnd ? 'scale-105' : ''}
      `}
      style={backgroundStyle}
      title={
        hasVacations
          ? `В отпуске: ${peopleOnVacation.map((p) => p.name).join(', ')}`
          : isInSelection
          ? 'Выделенный период'
          : 'Нажмите, чтобы выбрать'
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
