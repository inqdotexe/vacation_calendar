import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useStore } from '@/store/useStore'
import { getCurrentYear } from '@/utils/dateUtils'

/**
 * Header с навигацией по годам
 */
export function Header() {
  const selectedYear = useStore((state) => state.selectedYear)
  const setSelectedYear = useStore((state) => state.setSelectedYear)
  const people = useStore((state) => state.people)
  const vacations = useStore((state) => state.vacations)

  const goToPreviousYear = () => setSelectedYear(selectedYear - 1)
  const goToNextYear = () => setSelectedYear(selectedYear + 1)
  const goToCurrentYear = () => setSelectedYear(getCurrentYear())

  const currentYear = getCurrentYear()
  const isCurrentYear = selectedYear === currentYear

  return (
    <div className="flex items-center justify-between px-6 py-4">
      {/* Logo and title */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Calendar className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-foreground">Vacation Calendar</h1>
          <p className="text-sm text-muted-foreground">
            {people.length} {people.length === 1 ? 'человек' : 'людей'} • {vacations.length} {vacations.length === 1 ? 'период' : 'периодов'}
          </p>
        </div>
      </div>

      {/* Year navigation */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={goToPreviousYear}
          title="Предыдущий год"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>

        <div className="flex items-center gap-2 min-w-[180px] justify-center">
          <span className="text-2xl font-bold">{selectedYear}</span>
          {!isCurrentYear && (
            <Button
              variant="ghost"
              size="sm"
              onClick={goToCurrentYear}
              className="text-xs"
            >
              Текущий год
            </Button>
          )}
        </div>

        <Button
          variant="outline"
          size="icon"
          onClick={goToNextYear}
          title="Следующий год"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Empty space for balance */}
      <div className="w-48"></div>
    </div>
  )
}
