# Shapes Repository

Репозиторий для работы с геометрическими фигурами (Овал и Тетраэдр) с полной реализацией паттерна Factory Method, валидацией данных и комплексным тестированием.

## 📋 Описание

Приложение разработано для работы с двумя типами геометрических фигур:
- **Овал (Oval)** - определяется двумя точками описанного прямоугольника
- **Тетраэдр (Tetrahedron)** - определяется четырьмя вершинами в 3D пространстве

### Основные возможности

#### Для Овала:
- ✅ Вычисление площади
- ✅ Вычисление периметра (используя аппроксимацию Рамануджана)
- ✅ Проверка является ли фигура валидным овалом
- ✅ Проверка является ли овал кругом
- ✅ Проверка пересечения осей координат на заданное расстояние
- ✅ Вычисление эксцентриситета
- ✅ Вычисление фокального расстояния

#### Для Тетраэдра:
- ✅ Вычисление объема
- ✅ Вычисление площади поверхности
- ✅ Проверка является ли фигура валидным тетраэдром
- ✅ Проверка находится ли основание на координатной плоскости (XY, XZ, YZ)
- ✅ Вычисление соотношения объемов при рассечении координатной плоскостью
- ✅ Проверка является ли тетраэдр правильным
- ✅ Получение длин всех рёбер

## 🏗️ Архитектура

Проект следует принципам SOLID и использует следующие паттерны:

### Паттерн Factory Method
Используется для создания объектов фигур:
```
ShapeFactory
    ├── createShape(ShapeType, data)
    ├── createShapeFromLine(ShapeType, line)
    └── Создаёт: Oval | Tetrahedron
```

### Разделение ответственности
- **Entities** (`/src/entities`) - классы-сущности без бизнес-логики
- **Validators** (`/src/validators`) - валидация данных
- **Services** (`/src/services`) - бизнес-логика (вычисления)
- **Factories** (`/src/factories`) - создание объектов (Factory Method)
- **Readers** (`/src/readers`) - чтение данных из файлов
- **Exceptions** (`/src/exceptions`) - пользовательские исключения
- **Utils** (`/src/utils`) - утилиты (логирование)

## 📁 Структура проекта

```
js-patterns/
├── src/
│   ├── entities/              # Entity классы (без бизнес-логики)
│   │   ├── Point.ts           # Точка в 3D пространстве
│   │   ├── Shape.ts           # Абстрактный базовый класс
│   │   ├── Oval.ts            # Овал
│   │   └── Tetrahedron.ts     # Тетраэдр
│   ├── factories/             # Factory Method паттерн
│   │   ├── ShapeType.ts       # Enum типов фигур
│   │   └── ShapeFactory.ts    # Фабрика для создания фигур
│   ├── validators/            # Валидаторы
│   │   ├── OvalValidator.ts
│   │   └── TetrahedronValidator.ts
│   ├── services/              # Бизнес-логика
│   │   ├── OvalService.ts
│   │   └── TetrahedronService.ts
│   ├── readers/               # Чтение из файлов
│   │   └── FileReader.ts
│   ├── exceptions/            # Пользовательские исключения
│   │   ├── ValidationException.ts
│   │   ├── FileReadException.ts
│   │   └── ShapeCreationException.ts
│   ├── utils/                 # Утилиты
│   │   └── Logger.ts          # Логирование (Pino)
│   └── index.ts               # Главный файл
├── data/                      # Файлы с данными
│   ├── ovals.txt              # Тестовые данные для овалов
│   └── tetrahedrons.txt       # Тестовые данные для тетраэдров
├── tests/                     # Тесты (Jest)
│   ├── entities/
│   ├── validators/
│   └── services/
├── logs/                      # Логи приложения
├── package.json
├── tsconfig.json
├── .eslintrc.json
├── jest.config.js
└── README.md
```

## 🚀 Установка и запуск

### Установка зависимостей

```bash
npm install
```

### Компиляция TypeScript

```bash
npm run build
```

### Запуск приложения

```bash
npm start
```

Или для разработки:

```bash
npm run dev
```

## 🧪 Тестирование

### Запуск всех тестов

```bash
npm test
```

### Запуск тестов с отслеживанием изменений

```bash
npm run test:watch
```

### Генерация coverage отчёта

```bash
npm run test:coverage
```

## 🔍 Линтинг

Проект использует ESLint с конфигурацией Airbnb:

### Проверка кода

```bash
npm run lint
```

### Автоматическое исправление

```bash
npm run lint:fix
```

## 📝 Формат данных

### Овалы (ovals.txt)

Формат: `x1 y1 x2 y2`

Где `(x1, y1)` и `(x2, y2)` - две точки описанного прямоугольника.

Пример валидных данных:
```
0 0 4 2
-5 -3 5 3
1.5 2.5 6.5 8.5
```

Примеры невалидных данных (будут пропущены):
```
2a.0 3.0 4.0 5.0        # содержит букву
1.0 2.0                  # недостаточно данных
3.0 1.0 3.0 5.0          # точки на одной вертикальной линии
1.0 4.0 5.0 4.0          # точки на одной горизонтальной линии
2.0 2.0 2.0 2.0          # идентичные точки
```

### Тетраэдры (tetrahedrons.txt)

Формат: `x1 y1 z1 x2 y2 z2 x3 y3 z3 x4 y4 z4`

Где каждая тройка чисел - координаты одной из четырёх вершин.

Пример валидных данных:
```
0 0 0 1 0 0 0 1 0 0 0 1
1 2 3 4 5 6 7 8 9 10 11 12
-5 -5 -5 5 -5 -5 0 5 -5 0 0 5
```

Примеры невалидных данных (будут пропущены):
```
1.0 2.0 3.0 4a.0 5.0 6.0 7.0 8.0 9.0 10.0 11.0 12.0  # содержит букву
0 0 0 1 1 1 2 2 2                                      # недостаточно данных
0 0 0 1 0 0 0 1 0 1 1 0                                # точки компланарны
1 1 1 1 1 1 2 2 2 3 3 3                                # дублирующиеся вершины
```

### Комментарии в файлах

Строки, начинающиеся с `#`, считаются комментариями и игнорируются.

## 🔧 Технологии

- **TypeScript 5.3+** - строгая типизация
- **Node.js** - среда выполнения
- **Pino** - структурированное логирование
- **Jest** - тестирование
- **ESLint** - линтинг (конфигурация Airbnb)

## 📊 Примеры использования

### Создание овала через фабрику

```typescript
import { ShapeFactory } from './factories/ShapeFactory';
import { ShapeType } from './factories/ShapeType';
import { OvalService } from './services/OvalService';
import { Oval } from './entities/Oval';

const factory = new ShapeFactory();
const ovalService = new OvalService();

// Создание овала
const oval = factory.createShape(
  ShapeType.OVAL,
  [0, 0, 10, 6],
  'MyOval'
) as Oval;

// Вычисления
const area = ovalService.calculateArea(oval);
const perimeter = ovalService.calculatePerimeter(oval);
const isCircle = ovalService.isCircle(oval);

console.log(`Area: ${area}`);
console.log(`Perimeter: ${perimeter}`);
console.log(`Is circle: ${isCircle}`);
```

### Создание тетраэдра через фабрику

```typescript
import { ShapeFactory } from './factories/ShapeFactory';
import { ShapeType } from './factories/ShapeType';
import { TetrahedronService } from './services/TetrahedronService';
import { Tetrahedron } from './entities/Tetrahedron';

const factory = new ShapeFactory();
const tetrahedronService = new TetrahedronService();

// Создание тетраэдра
const tetrahedron = factory.createShape(
  ShapeType.TETRAHEDRON,
  [0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1],
  'MyTetrahedron'
) as Tetrahedron;

// Вычисления
const volume = tetrahedronService.calculateVolume(tetrahedron);
const surfaceArea = tetrahedronService.calculateSurfaceArea(tetrahedron);
const isBaseOnXY = tetrahedronService.isBaseOnXYPlane(tetrahedron);
const isRegular = tetrahedronService.isRegularTetrahedron(tetrahedron);

console.log(`Volume: ${volume}`);
console.log(`Surface Area: ${surfaceArea}`);
console.log(`Base on XY plane: ${isBaseOnXY}`);
console.log(`Is regular: ${isRegular}`);
```

### Чтение фигур из файла

```typescript
import { FileReader } from './readers/FileReader';
import { ShapeType } from './factories/ShapeType';

const fileReader = new FileReader();

// Чтение овалов
const ovals = await fileReader.readShapesFromFile('ovals.txt', ShapeType.OVAL);
console.log(`Loaded ${ovals.length} ovals`);

// Чтение тетраэдров
const tetrahedrons = await fileReader.readShapesFromFile(
  'tetrahedrons.txt',
  ShapeType.TETRAHEDRON
);
console.log(`Loaded ${tetrahedrons.length} tetrahedrons`);
```

## 🎯 Особенности реализации

### Entity классы
- Содержат только данные
- Не содержат бизнес-логику
- Предоставляют геттеры для доступа к полям
- Иммутабельны (readonly поля)

### Валидаторы
- Валидируют сырые данные перед созданием объектов
- Валидируют результаты вычислений
- Используют регулярные выражения (хранятся в константах)
- Выбрасывают пользовательские исключения

### Сервисы
- Содержат всю бизнес-логику
- Используют валидаторы
- Не изменяют entity объекты
- Обрабатывают исключения

### Логирование
- Логирование в консоль и файл
- Структурированные логи (JSON)
- Разные уровни: info, warn, error, debug, trace, fatal
- Автоматическое форматирование с pino-pretty

### Обработка ошибок
- Только пользовательские исключения
- Все исключения обрабатываются try/catch
- Логирование всех ошибок
- Информативные сообщения об ошибках

## 📐 Математические формулы

### Овал (Эллипс)

**Площадь:**
```
A = π × a × b
где a - большая полуось, b - малая полуось
```

**Периметр (Аппроксимация Рамануджана):**
```
P ≈ π(a + b)(1 + 3h/(10 + √(4 - 3h)))
где h = (a - b)² / (a + b)²
```

**Эксцентриситет:**
```
e = √(1 - b²/a²)  для a ≥ b
```

### Тетраэдр

**Объём:**
```
V = |det(v1, v2, v3)| / 6
где v1, v2, v3 - векторы от первой вершины к остальным
```

**Площадь поверхности:**
```
S = S₁ + S₂ + S₃ + S₄
где Sᵢ - площадь i-й треугольной грани
```

**Площадь треугольника:**
```
S = ||(p2 - p1) × (p3 - p1)|| / 2
где × - векторное произведение
```

## ✅ Соответствие требованиям

- ✅ TypeScript с строгой типизацией
- ✅ Паттерн Factory Method
- ✅ Entity классы без бизнес-логики
- ✅ Фигуры содержат ID и Name
- ✅ Чтение данных из файлов (.txt)
- ✅ Обработка некорректных данных
- ✅ Файлы в каталогах проекта (относительные пути)
- ✅ Классы-валидаторы
- ✅ Пользовательские исключения
- ✅ Логирование с Pino (консоль + файл)
- ✅ Unit-тесты с Jest (множественные expect)
- ✅ ESLint с Airbnb конфигурацией
- ✅ ES6 модули
- ✅ Константы в UPPER_CASE (неизменяемые) и camelCase (изменяемые)
- ✅ Регулярные выражения в константах
- ✅ Обязательные фигурные скобки для if/for/while
- ✅ Try/catch для обработки исключений
- ✅ Фигуры параллельны осям координат

## 📚 Документация кода

Весь код содержит JSDoc комментарии с описанием:
- Назначения классов и методов
- Параметров методов
- Возвращаемых значений
- Выбрасываемых исключений