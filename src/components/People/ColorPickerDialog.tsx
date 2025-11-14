import { useState } from 'react'
import { HexColorPicker } from 'react-colorful'
import { Palette } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Person } from '@/types'
import { useStore } from '@/store/useStore'

interface ColorPickerDialogProps {
  person: Person
}

/**
 * Простой color picker для изменения цвета человека
 */
export function ColorPickerDialog({ person }: ColorPickerDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [tempColor, setTempColor] = useState(person.color)
  const updatePerson = useStore((state) => state.updatePerson)

  const handleSave = () => {
    updatePerson(person.id, { color: tempColor })
    setIsOpen(false)
  }

  const handleCancel = () => {
    setTempColor(person.color)
    setIsOpen(false)
  }

  if (!isOpen) {
    return (
      <Button
        variant="ghost"
        size="icon"
        onClick={(e) => {
          e.stopPropagation()
          setIsOpen(true)
        }}
        title="Изменить цвет"
      >
        <Palette className="w-4 h-4" />
      </Button>
    )
  }

  return (
    <div
      className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center"
      onClick={handleCancel}
    >
      <div
        className="bg-card p-6 rounded-lg border shadow-lg space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div>
          <h3 className="font-semibold mb-1">Выбор цвета</h3>
          <p className="text-sm text-muted-foreground">{person.name}</p>
        </div>

        <HexColorPicker color={tempColor} onChange={setTempColor} />

        <div className="flex items-center gap-2">
          <div
            className="w-12 h-12 rounded-md border"
            style={{ backgroundColor: tempColor }}
          />
          <div className="flex-1 font-mono text-sm">{tempColor}</div>
        </div>

        <div className="flex gap-2">
          <Button onClick={handleSave} className="flex-1">
            Сохранить
          </Button>
          <Button variant="outline" onClick={handleCancel} className="flex-1">
            Отмена
          </Button>
        </div>
      </div>
    </div>
  )
}
