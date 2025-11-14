import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useStore } from '@/store/useStore'
import { formatDate, getCurrentYear } from '@/utils/dateUtils'
import { createStripedPattern } from '@/utils/colorUtils'

function App() {
  const [newPersonName, setNewPersonName] = useState('')
  const people = useStore((state) => state.people)
  const vacations = useStore((state) => state.vacations)
  const addPerson = useStore((state) => state.addPerson)
  const deletePerson = useStore((state) => state.deletePerson)
  const selectedYear = useStore((state) => state.selectedYear)

  const handleAddPerson = () => {
    if (newPersonName.trim()) {
      addPerson(newPersonName.trim())
      setNewPersonName('')
    }
  }

  const totalVacationDays = vacations.reduce((sum, v) => {
    const start = new Date(v.startDate)
    const end = new Date(v.endDate)
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1
    return sum + days
  }, 0)

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Vacation Calendar
          </h1>
          <p className="text-muted-foreground">
            Интерактивный календарь отпусков
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Этап 2 завершен ✅</CardTitle>
              <CardDescription>
                Типы, утилиты и Zustand store с localStorage
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-sm">TypeScript типы (Person, VacationPeriod, AppState)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-sm">dateUtils.ts - работа с датами (date-fns)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-sm">colorUtils.ts - генерация и смешивание цветов</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-sm">vacationUtils.ts - обнаружение пересечений</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-sm">Zustand store с persistence</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Статистика</CardTitle>
              <CardDescription>Текущий год: {selectedYear}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Людей добавлено:</span>
                <span className="text-2xl font-bold">{people.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Периодов отпусков:</span>
                <span className="text-2xl font-bold">{vacations.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Всего дней отпуска:</span>
                <span className="text-2xl font-bold">{totalVacationDays}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Тест Store - Управление людьми</CardTitle>
            <CardDescription>
              Добавьте человека, данные сохранятся в localStorage
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 mb-4">
              <Input
                placeholder="Имя человека"
                value={newPersonName}
                onChange={(e) => setNewPersonName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddPerson()}
              />
              <Button onClick={handleAddPerson}>Добавить</Button>
            </div>

            {people.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                Добавьте первого человека чтобы увидеть его здесь
              </p>
            ) : (
              <div className="space-y-2">
                {people.map((person) => (
                  <div
                    key={person.id}
                    className="flex items-center justify-between p-3 rounded-lg border bg-card"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-full"
                        style={{ backgroundColor: person.color }}
                      ></div>
                      <div>
                        <p className="font-medium">{person.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {person.color} • {formatDate(person.createdAt)}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deletePerson(person.id)}
                    >
                      Удалить
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Демо: Визуализация пересечений</CardTitle>
            <CardDescription>
              Примеры смешивания цветов для отображения пересекающихся отпусков
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <div
                  className="h-16 rounded-lg"
                  style={{ background: createStripedPattern(['#3B82F6', '#EF4444']) }}
                ></div>
                <p className="text-xs text-center text-muted-foreground">2 человека</p>
              </div>
              <div className="space-y-2">
                <div
                  className="h-16 rounded-lg"
                  style={{ background: createStripedPattern(['#10B981', '#F59E0B', '#8B5CF6']) }}
                ></div>
                <p className="text-xs text-center text-muted-foreground">3 человека</p>
              </div>
              <div className="space-y-2">
                <div
                  className="h-16 rounded-lg"
                  style={{ background: createStripedPattern(['#EC4899', '#14B8A6', '#F97316', '#6366F1']) }}
                ></div>
                <p className="text-xs text-center text-muted-foreground">4 человека</p>
              </div>
              <div className="space-y-2">
                <div
                  className="h-16 rounded-lg border-2 border-dashed border-muted-foreground/30 flex items-center justify-center"
                >
                  <span className="text-xs text-muted-foreground">Нет отпусков</span>
                </div>
                <p className="text-xs text-center text-muted-foreground">Пусто</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default App
