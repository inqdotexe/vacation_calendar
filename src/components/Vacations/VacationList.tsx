import { useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useStore } from '@/store/useStore'
import { formatVacationsForList, sortVacationsByDate } from '@/utils/vacationUtils'
import { VacationItem } from './VacationItem'

/**
 * Список всех периодов отпусков
 */
export function VacationList() {
  const vacations = useStore((state) => state.vacations)
  const people = useStore((state) => state.people)
  const selectedYear = useStore((state) => state.selectedYear)

  // Форматируем и сортируем отпуска
  const formattedVacations = useMemo(() => {
    const formatted = formatVacationsForList(vacations, people)
    return sortVacationsByDate(formatted, true)
  }, [vacations, people])

  // Фильтруем по текущему году
  const vacationsThisYear = useMemo(
    () => formattedVacations.filter((v) => v.startDate.getFullYear() === selectedYear),
    [formattedVacations, selectedYear]
  )

  if (vacations.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Периоды отпусков</CardTitle>
          <CardDescription>Список всех запланированных отпусков</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-8">
            Отпусков пока нет. Выберите человека и период на календаре.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Периоды отпусков ({vacationsThisYear.length} в {selectedYear})
        </CardTitle>
        <CardDescription>
          Всего периодов: {vacations.length}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {vacationsThisYear.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            Нет отпусков в {selectedYear} году
          </p>
        ) : (
          <div className="space-y-2">
            {vacationsThisYear.map((vacation) => (
              <VacationItem key={vacation.id} vacation={vacation} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
