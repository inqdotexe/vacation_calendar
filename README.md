# Vacation Calendar

Интерактивный календарь отпусков для команды.

## Технологический стек

- **React 18** - UI библиотека
- **Vite** - сборщик и dev сервер
- **TypeScript** - типизация
- **Tailwind CSS** - стилизация
- **shadcn/ui** - UI компоненты
- **date-fns** - работа с датами
- **zustand** - state management
- **react-colorful** - color picker

## Установка и запуск

### Предварительные требования

- Node.js 18+ и npm

### Установка зависимостей

```bash
npm install
```

### Запуск dev сервера

```bash
npm run dev
```

Приложение будет доступно по адресу: http://localhost:5173/

### Сборка для production

```bash
npm run build
```

### Просмотр production сборки

```bash
npm run preview
```

## Структура проекта

```
vacation_calendar/
├── src/
│   ├── components/
│   │   ├── ui/              # shadcn/ui компоненты
│   │   ├── Calendar/        # Компоненты календаря
│   │   ├── People/          # Управление людьми
│   │   ├── Vacations/       # Управление отпусками
│   │   └── Layout/          # Layout компоненты
│   ├── hooks/               # Custom hooks
│   ├── store/               # Zustand store
│   ├── types/               # TypeScript типы
│   ├── utils/               # Утилиты
│   ├── lib/                 # Вспомогательные библиотеки
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── CLAUDE.md                # Документация проекта
├── PLAN.md                  # План разработки
└── package.json
```

## Текущий статус

**Этап 1: Инициализация проекта** ✅

- [x] Настройка Vite + React + TypeScript
- [x] Конфигурация Tailwind CSS
- [x] Интеграция shadcn/ui компонентов
- [x] Установка зависимостей
- [x] Базовая структура папок

**Следующие этапы:**

- Этап 2: Базовая структура и типы
- Этап 3: UI компоненты
- Этап 4: Управление людьми
- Этап 5: Календарь - отображение

Подробный план в файле [PLAN.md](PLAN.md)

## Документация

- [CLAUDE.md](CLAUDE.md) - Полная документация проекта
- [PLAN.md](PLAN.md) - Детальный план разработки (12 этапов)

## Лицензия

MIT
