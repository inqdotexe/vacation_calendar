import { useState } from 'react'
import { Plus, Trash2, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useStore } from '@/store/useStore'
import { ColorPickerDialog } from '@/components/People/ColorPickerDialog'

/**
 * Sidebar для управления людьми
 */
export function Sidebar() {
  const [newPersonName, setNewPersonName] = useState('')
  const people = useStore((state) => state.people)
  const addPerson = useStore((state) => state.addPerson)
  const deletePerson = useStore((state) => state.deletePerson)
  const selectedPersonId = useStore((state) => state.selectedPersonId)
  const setSelectedPerson = useStore((state) => state.setSelectedPerson)
  const getVacationsByPerson = useStore((state) => state.getVacationsByPerson)

  const handleAddPerson = () => {
    if (newPersonName.trim()) {
      addPerson(newPersonName.trim())
      setNewPersonName('')
    }
  }

  const handleSelectPerson = (personId: string) => {
    // Toggle selection
    if (selectedPersonId === personId) {
      setSelectedPerson(null)
    } else {
      setSelectedPerson(personId)
    }
  }

  return (
    <div className="space-y-4">
      {/* Add Person Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <User className="w-5 h-5" />
            Добавить человека
          </CardTitle>
          <CardDescription>
            Введите имя для добавления в календарь
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="Имя"
              value={newPersonName}
              onChange={(e) => setNewPersonName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddPerson()}
            />
            <Button onClick={handleAddPerson} size="icon">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* People List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Люди ({people.length})</CardTitle>
          <CardDescription>
            Нажмите, чтобы выбрать для добавления отпуска
          </CardDescription>
        </CardHeader>
        <CardContent>
          {people.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              Добавьте первого человека
            </p>
          ) : (
            <div className="space-y-2">
              {people.map((person) => {
                const vacationCount = getVacationsByPerson(person.id).length
                const isSelected = selectedPersonId === person.id

                return (
                  <div
                    key={person.id}
                    className={`
                      group relative p-3 rounded-lg border cursor-pointer transition-all
                      ${isSelected
                        ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                        : 'border-border hover:border-primary/50 hover:bg-accent/50'
                      }
                    `}
                    onClick={() => handleSelectPerson(person.id)}
                  >
                    <div className="flex items-center gap-3">
                      {/* Color indicator */}
                      <div
                        className="w-10 h-10 rounded-full flex-shrink-0"
                        style={{ backgroundColor: person.color }}
                      />

                      {/* Person info */}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{person.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {vacationCount} {vacationCount === 1 ? 'отпуск' : 'отпусков'}
                        </p>
                      </div>

                      {/* Action buttons */}
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {/* Color picker */}
                        <ColorPickerDialog person={person} />

                        {/* Delete button */}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation()
                            deletePerson(person.id)
                          }}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </div>

                    {isSelected && (
                      <div className="mt-2 pt-2 border-t text-xs text-primary">
                        ✓ Выбран для добавления отпуска
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card className="bg-muted/50">
        <CardContent className="pt-6">
          <div className="space-y-2 text-xs text-muted-foreground">
            <p className="font-medium text-foreground">Как пользоваться:</p>
            <ol className="space-y-1 list-decimal list-inside">
              <li>Добавьте людей</li>
              <li>Выберите человека</li>
              <li>Выделите период на календаре</li>
              <li>Отпуск будет отмечен его цветом</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
