import { useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getDatesInMonth, getMonthName, getDayOfWeek, DAY_NAMES_SHORT } from '@/utils/dateUtils'
import { CalendarDay } from './CalendarDay'

interface CalendarMonthProps {
  year: number
  month: number // 0-11
}

/**
 * Компонент месяца календаря
 * Отображает название и сетку дней
 */
export function CalendarMonth({ year, month }: CalendarMonthProps) {
  // Получаем все даты месяца
  const dates = useMemo(() => getDatesInMonth(year, month), [year, month])

  // Вычисляем количество пустых клеток в начале (для выравнивания по дням недели)
  const firstDayOfWeek = getDayOfWeek(dates[0])
  const emptyDays = Array.from({ length: firstDayOfWeek }, (_, i) => i)

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2 pt-3 px-3">
        <CardTitle className="text-sm font-semibold">
          {getMonthName(month)}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-2 pt-0">
        {/* Days of week header */}
        <div className="grid grid-cols-7 gap-0.5 mb-0.5">
          {DAY_NAMES_SHORT.map((day) => (
            <div
              key={day}
              className="text-center text-[10px] font-medium text-muted-foreground py-0.5"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Days grid */}
        <div className="grid grid-cols-7 gap-0.5">
          {/* Empty cells for alignment */}
          {emptyDays.map((i) => (
            <div key={`empty-${i}`} className="aspect-square" />
          ))}

          {/* Actual days */}
          {dates.map((date) => (
            <CalendarDay key={date.toISOString()} date={date} />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
