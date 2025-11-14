import { Trash2, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useStore } from '@/store/useStore'
import { VacationListItem } from '@/types'

interface VacationItemProps {
  vacation: VacationListItem
}

/**
 * Элемент списка отпусков
 * Формат: DD.MM.YYYY - DD.MM.YYYY (N) Имя
 */
export function VacationItem({ vacation }: VacationItemProps) {
  const deleteVacation = useStore((state) => state.deleteVacation)

  const handleDelete = () => {
    if (confirm(`Удалить отпуск ${vacation.personName}?`)) {
      deleteVacation(vacation.id)
    }
  }

  return (
    <div className="group flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {/* Color indicator */}
        <div
          className="w-1 h-12 rounded-full flex-shrink-0"
          style={{ backgroundColor: vacation.personColor }}
        />

        {/* Vacation info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
            <p className="text-sm font-mono">
              {vacation.formattedRange}
            </p>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            {vacation.personName} • {vacation.durationDays} {vacation.durationDays === 1 ? 'день' : vacation.durationDays < 5 ? 'дня' : 'дней'}
          </p>
        </div>
      </div>

      {/* Delete button */}
      <Button
        variant="ghost"
        size="icon"
        className="opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={handleDelete}
      >
        <Trash2 className="w-4 h-4 text-destructive" />
      </Button>
    </div>
  )
}
