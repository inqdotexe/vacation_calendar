# Vacation Calendar - Интерактивный календарь отпусков

## Описание проекта

Веб-приложение для планирования и визуализации отпусков команды. Позволяет добавлять людей с персональными цветами, отмечать периоды отпусков и видеть пересечения между сотрудниками.

## Функциональные требования

### MVP (Этап 1 - Локальная версия)

#### Основной функционал:
1. **Календарь**
   - Отображение календаря на выбранный год
   - Навигация между годами
   - Визуализация дней, месяцев, недель

2. **Управление людьми**
   - Добавление человека с именем
   - Автоматическое присвоение случайного цвета (hex)
   - Редактирование цвета через color picker
   - Удаление людей
   - Список всех добавленных людей

3. **Управление периодами отпусков**
   - Выбор человека
   - Интерактивное выделение периода на календаре (drag-select или click-range)
   - Добавление нескольких периодов для одного человека
   - Редактирование существующих периодов
   - Удаление периодов
   - Визуализация периодов цветом человека

4. **Визуализация пересечений**
   - Автоматическое обнаружение пересекающихся периодов
   - Отображение пересечений комбинацией цветов (градиент/паттерн)

5. **Список периодов**
   - Вывод всех периодов с форматом:
     ```
     07.02.2026 - 13.02.2026 (7) Маша
     14.06.2026 - 27.06.2026 (14) Саша
     15.06.2026 - 21.06.2026 (7) Дима
     ```
   - Сортировка по датам
   - Группировка по людям (опционально)

6. **Сохранение данных**
   - Автосохранение в localStorage
   - Восстановление состояния при перезагрузке страницы

### Бэклог (Будущие улучшения)

#### Этап 2 - Многопользовательский режим:
- Backend (Supabase/FastAPI)
- Синхронизация между устройствами
- Реалтайм обновления
- Авторизация пользователей

#### Этап 3 - Дополнительные функции:
- Экспорт данных (JSON, CSV, iCal)
- Импорт данных
- Печать календаря
- Уведомления о пересечениях
- Статистика (общее количество дней отпуска)
- Мобильная версия (адаптивный дизайн)
- Темная тема

## Технологический стек

### Frontend
- **React 18** - UI библиотека
- **Vite** - сборщик и dev сервер
- **TypeScript** - типизация
- **Tailwind CSS** - стилизация
- **shadcn/ui** - готовые UI компоненты
- **date-fns** - работа с датами
- **react-colorful** - color picker
- **zustand** - state management (легковесная альтернатива Redux)

### Хранение данных
- **localStorage** - клиентское хранилище данных

### Инструменты разработки
- **ESLint** - линтер
- **Prettier** - форматирование кода

## Архитектура приложения

### Структура файлов

```
vacation_calendar/
├── public/
├── src/
│   ├── components/
│   │   ├── ui/              # shadcn/ui компоненты
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── dialog.tsx
│   │   │   └── ...
│   │   ├── Calendar/
│   │   │   ├── Calendar.tsx           # Главный компонент календаря
│   │   │   ├── CalendarHeader.tsx     # Навигация по годам
│   │   │   ├── CalendarGrid.tsx       # Сетка календаря
│   │   │   ├── CalendarDay.tsx        # Отдельный день
│   │   │   └── CalendarMonth.tsx      # Месяц
│   │   ├── People/
│   │   │   ├── PeopleList.tsx         # Список людей
│   │   │   ├── PersonItem.tsx         # Элемент списка
│   │   │   ├── AddPersonDialog.tsx    # Диалог добавления
│   │   │   └── ColorPicker.tsx        # Выбор цвета
│   │   ├── Vacations/
│   │   │   ├── VacationList.tsx       # Список периодов
│   │   │   ├── VacationItem.tsx       # Элемент периода
│   │   │   └── VacationStats.tsx      # Статистика
│   │   └── Layout/
│   │       ├── Header.tsx
│   │       ├── Sidebar.tsx
│   │       └── Layout.tsx
│   ├── hooks/
│   │   ├── useCalendar.ts             # Логика календаря
│   │   ├── useVacations.ts            # Логика отпусков
│   │   └── useLocalStorage.ts         # Работа с localStorage
│   ├── store/
│   │   └── useStore.ts                # Zustand store
│   ├── types/
│   │   └── index.ts                   # TypeScript типы
│   ├── utils/
│   │   ├── dateUtils.ts               # Утилиты для дат
│   │   ├── colorUtils.ts              # Генерация цветов, смешивание
│   │   └── vacationUtils.ts           # Логика пересечений
│   ├── lib/
│   │   └── utils.ts                   # shadcn utils
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── vite.config.ts
├── CLAUDE.md
└── PLAN.md
```

## Модель данных

### Person (Человек)
```typescript
interface Person {
  id: string;              // UUID
  name: string;            // Имя
  color: string;           // HEX цвет (#FF5733)
  createdAt: Date;         // Дата создания
}
```

### VacationPeriod (Период отпуска)
```typescript
interface VacationPeriod {
  id: string;              // UUID
  personId: string;        // ID человека
  startDate: Date;         // Дата начала
  endDate: Date;           // Дата окончания
  createdAt: Date;         // Дата создания
}
```

### Store State
```typescript
interface AppState {
  people: Person[];
  vacations: VacationPeriod[];
  selectedYear: number;
  selectedPersonId: string | null;

  // Actions
  addPerson: (name: string, color?: string) => void;
  updatePerson: (id: string, updates: Partial<Person>) => void;
  deletePerson: (id: string) => void;

  addVacation: (vacation: Omit<VacationPeriod, 'id' | 'createdAt'>) => void;
  updateVacation: (id: string, updates: Partial<VacationPeriod>) => void;
  deleteVacation: (id: string) => void;

  setSelectedYear: (year: number) => void;
  setSelectedPerson: (id: string | null) => void;
}
```

## Ключевые алгоритмы

### 1. Обнаружение пересечений периодов
```typescript
function findOverlaps(vacations: VacationPeriod[]): Overlap[] {
  // Для каждого дня находим все периоды, которые его покрывают
  // Если > 1 периода - это пересечение
}
```

### 2. Смешивание цветов для пересечений
```typescript
function blendColors(colors: string[]): string {
  // Создание градиента или паттерна из нескольких цветов
  // Возможны варианты:
  // - Linear gradient
  // - Полосатый паттерн
  // - Усреднение RGB
}
```

### 3. Генерация случайного цвета
```typescript
function generateRandomColor(): string {
  // Генерация приятного цвета из предустановленной палитры
  // или HSL с фиксированной яркостью/насыщенностью
}
```

## UI/UX Концепция

### Минималистичный дизайн:
- Чистая цветовая схема (белый фон, серые акценты)
- Акцент на календарь (занимает основную часть экрана)
- Боковая панель для управления людьми
- Нижняя панель для списка периодов
- Мягкие тени и скругления (shadcn/ui стиль)

### Интерактивность:
- Hover эффекты на днях календаря
- Drag-to-select для выбора периода
- Анимации при добавлении/удалении
- Toast уведомления для действий

### Цветовая система:
- Яркие, различимые цвета для людей
- Полупрозрачность для лучшей видимости пересечений
- Градиенты для отображения multiple overlaps

## Форматы дат

- **Отображение:** DD.MM.YYYY (07.02.2026)
- **Хранение:** ISO 8601 (2026-02-07T00:00:00.000Z)
- **Библиотека:** date-fns для парсинга и форматирования

## Браузерная совместимость

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Производительность

- Виртуализация календаря для больших периодов (если потребуется)
- Мемоизация вычислений пересечений
- Debounce для операций с localStorage

## Доступность (a11y)

- Keyboard navigation
- ARIA labels
- Семантический HTML
- Контрастность цветов (WCAG AA)

---

**Версия:** 1.0.0
**Статус:** В разработке
**Последнее обновление:** 2025-11-14
