# Shapes Repository

Репозиторий для работы с геометрическими фигурами (Овал и Тетраэдр) с полной реализацией паттернов проектирования: Factory Method, Repository, Observer, Singleton, Specification и Comparator. Включает валидацию данных, автоматическое управление метриками и комплексное тестирование.

## 📋 Описание

Приложение разработано для работы с двумя типами геометрических фигур:
- **Овал (Oval)** - определяется двумя точками описанного прямоугольника
- **Тетраэдр (Tetrahedron)** - определяется четырьмя вершинами в 3D пространстве

### 🆕 Новые возможности

- ✅ **Repository Pattern** - централизованное хранение всех геометрических фигур
- ✅ **Specification Pattern** - гибкий поиск объектов по различным критериям:
  - По ID и имени
  - По координатам (квадранты)
  - По диапазонам значений (площади, объемы, периметры)
  - По расстоянию от начала координат
- ✅ **Comparator Pattern** - сортировка фигур по различным параметрам
- ✅ **Warehouse (Singleton)** - единое хранилище метрик фигур (площади, объемы, периметры)
- ✅ **Observer Pattern** - автоматический пересчет метрик при изменении параметров фигур

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

### Паттерн Repository
Используется для хранения и управления коллекцией геометрических фигур:
```
ShapeRepository
    ├── add(shape: Shape) - добавление фигуры
    ├── remove(id: string) - удаление по ID
    ├── findById(id: string) - поиск по ID
    ├── findByName(name: string) - поиск по имени
    ├── findAll() - получение всех фигур
    ├── findBySpecification(spec) - поиск по спецификации
    └── sort(comparator) - сортировка с использованием Comparator
```

### Паттерн Observer
Используется для автоматического пересчета значений в Warehouse при изменении параметров фигур:
```
Shape (Observable)
    └── notifyObservers() - уведомление наблюдателей
    
Warehouse (Observer)
    └── update(shape) - обновление значений при изменении фигуры
```

### Паттерн Singleton
Используется для Warehouse - единственный экземпляр хранилища метрик:
```
Warehouse.getInstance()
    ├── getArea(shapeId) - получение площади
    ├── getVolume(shapeId) - получение объема
    ├── getPerimeter(shapeId) - получение периметра
    └── getAllMetrics() - получение всех метрик
```

### Разделение ответственности
- **Entities** (`/src/entities`) - классы-сущности без бизнес-логики
- **Validators** (`/src/validators`) - валидация данных
- **Services** (`/src/services`) - бизнес-логика (вычисления)
- **Factories** (`/src/factories`) - создание объектов (Factory Method)
- **Repositories** (`/src/repositories`) - хранение и управление коллекциями фигур
- **Specifications** (`/src/specifications`) - спецификации для поиска объектов
- **Comparators** (`/src/comparators`) - компараторы для сортировки
- **Warehouse** (`/src/warehouse`) - хранение метрик фигур (Singleton)
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
│   ├── repositories/          # Repository паттерн
│   │   └── ShapeRepository.ts # Репозиторий для хранения фигур
│   ├── specifications/        # Спецификации поиска
│   │   ├── Specification.ts   # Базовый интерфейс спецификации
│   │   ├── IdSpecification.ts # Поиск по ID
│   │   ├── NameSpecification.ts # Поиск по имени
│   │   ├── QuadrantSpecification.ts # Поиск по квадранту
│   │   ├── RangeSpecification.ts # Поиск по диапазону значений
│   │   └── DistanceSpecification.ts # Поиск по расстоянию от начала координат
│   ├── comparators/           # Компараторы для сортировки
│   │   ├── ShapeComparator.ts # Базовый интерфейс компаратора
│   │   ├── IdComparator.ts    # Сортировка по ID
│   │   ├── NameComparator.ts  # Сортировка по имени
│   │   ├── XCoordinateComparator.ts # Сортировка по X координате
│   │   └── YCoordinateComparator.ts # Сортировка по Y координате
│   ├── warehouse/             # Warehouse (Singleton)
│   │   └── Warehouse.ts       # Хранение метрик фигур
│   ├── observers/             # Observer паттерн
│   │   ├── Observer.ts        # Интерфейс наблюдателя
│   │   └── Observable.ts      # Интерфейс наблюдаемого
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
│   ├── services/
│   ├── repositories/
│   ├── specifications/
│   ├── comparators/
│   └── warehouse/
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

### Работа с Repository

```typescript
import { ShapeRepository } from './repositories/ShapeRepository';
import { ShapeFactory } from './factories/ShapeFactory';
import { ShapeType } from './factories/ShapeType';

const repository = new ShapeRepository();
const factory = new ShapeFactory();

// Добавление фигур в репозиторий
const oval = factory.createShape(ShapeType.OVAL, [0, 0, 10, 6], 'Oval1');
const tetrahedron = factory.createShape(
  ShapeType.TETRAHEDRON,
  [0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1],
  'Tetra1'
);

repository.add(oval);
repository.add(tetrahedron);

// Поиск по ID
const found = repository.findById(oval.getId());

// Поиск по имени
const byName = repository.findByName('Oval1');

// Получение всех фигур
const allShapes = repository.findAll();
```

### Поиск с использованием спецификаций

```typescript
import { ShapeRepository } from './repositories/ShapeRepository';
import { QuadrantSpecification } from './specifications/QuadrantSpecification';
import { RangeSpecification } from './specifications/RangeSpecification';
import { DistanceSpecification } from './specifications/DistanceSpecification';
import { OvalService } from './services/OvalService';
import { TetrahedronService } from './services/TetrahedronService';

const repository = new ShapeRepository();
const ovalService = new OvalService();
const tetrahedronService = new TetrahedronService();

// Поиск всех объектов в первом квадранте (x > 0, y > 0)
const firstQuadrantSpec = new QuadrantSpecification(1);
const firstQuadrantShapes = repository.findBySpecification(firstQuadrantSpec);

// Поиск объектов с площадью в диапазоне [10, 100]
const areaRangeSpec = new RangeSpecification(
  (shape) => {
    if (shape instanceof Oval) {
      return ovalService.calculateArea(shape);
    }
    return 0;
  },
  10,
  100
);
const shapesInAreaRange = repository.findBySpecification(areaRangeSpec);

// Поиск объектов с объемом в диапазоне [5, 50]
const volumeRangeSpec = new RangeSpecification(
  (shape) => {
    if (shape instanceof Tetrahedron) {
      return tetrahedronService.calculateVolume(shape);
    }
    return 0;
  },
  5,
  50
);
const shapesInVolumeRange = repository.findBySpecification(volumeRangeSpec);

// Поиск объектов на расстоянии от начала координат в диапазоне [0, 10]
const distanceSpec = new DistanceSpecification(0, 10);
const shapesInDistanceRange = repository.findBySpecification(distanceSpec);
```

### Сортировка с использованием Comparator

```typescript
import { ShapeRepository } from './repositories/ShapeRepository';
import { IdComparator } from './comparators/IdComparator';
import { NameComparator } from './comparators/NameComparator';
import { XCoordinateComparator } from './comparators/XCoordinateComparator';
import { YCoordinateComparator } from './comparators/YCoordinateComparator';

const repository = new ShapeRepository();

// Сортировка по ID
const sortedById = repository.sort(new IdComparator());

// Сортировка по имени
const sortedByName = repository.sort(new NameComparator());

// Сортировка по X координате первой точки
const sortedByX = repository.sort(new XCoordinateComparator());

// Сортировка по Y координате первой точки
const sortedByY = repository.sort(new YCoordinateComparator());
```

### Работа с Warehouse (Singleton + Observer)

```typescript
import { Warehouse } from './warehouse/Warehouse';
import { ShapeFactory } from './factories/ShapeFactory';
import { ShapeType } from './factories/ShapeType';

const warehouse = Warehouse.getInstance();
const factory = new ShapeFactory();

// Создание фигуры (автоматически регистрируется в Warehouse)
const oval = factory.createShape(ShapeType.OVAL, [0, 0, 10, 6], 'Oval1');

// Warehouse автоматически вычисляет и сохраняет метрики
// При изменении параметров фигуры Warehouse автоматически пересчитывает значения

// Получение метрик
const area = warehouse.getArea(oval.getId());
const perimeter = warehouse.getPerimeter(oval.getId());

// Для тетраэдра
const tetrahedron = factory.createShape(
  ShapeType.TETRAHEDRON,
  [0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1],
  'Tetra1'
);

const volume = warehouse.getVolume(tetrahedron.getId());
const surfaceArea = warehouse.getSurfaceArea(tetrahedron.getId());

// Получение всех метрик
const allMetrics = warehouse.getAllMetrics();
```

## 🎯 Особенности реализации

### Entity классы
- Содержат только данные
- Не содержат бизнес-логику
- Предоставляют геттеры для доступа к полям
- Иммутабельны (readonly поля)
- Реализуют интерфейс Observable для уведомления Warehouse об изменениях

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

### Repository
- Хранит все созданные геометрические фигуры
- Предоставляет методы добавления и удаления объектов
- Поддерживает поиск по спецификациям (Specification pattern)
- Поддерживает сортировку с использованием Comparator интерфейса
- Интегрирован с Warehouse для автоматического отслеживания метрик

### Спецификации (Specification Pattern)
- **IdSpecification** - поиск фигур по уникальному идентификатору
- **NameSpecification** - поиск фигур по имени (точное совпадение или частичное)
- **QuadrantSpecification** - поиск фигур, точки которых находятся в заданном квадранте
  - Квадрант 1: x > 0, y > 0
  - Квадрант 2: x < 0, y > 0
  - Квадрант 3: x < 0, y < 0
  - Квадрант 4: x > 0, y < 0
- **RangeSpecification** - поиск фигур, у которых метрики (площадь, объем, периметр) находятся в заданном диапазоне
- **DistanceSpecification** - поиск фигур, находящихся на расстоянии от начала координат в заданном диапазоне
- Спецификации можно комбинировать (AND, OR, NOT операции)

### Компараторы (Comparator Pattern)
- **IdComparator** - сортировка по ID (лексикографическая или числовая)
- **NameComparator** - сортировка по имени (алфавитная)
- **XCoordinateComparator** - сортировка по X координате первой точки фигуры
- **YCoordinateComparator** - сортировка по Y координате первой точки фигуры
- Все компараторы реализуют интерфейс `Comparator<Shape>`
- Поддержка обратной сортировки (ascending/descending)

### Warehouse (Singleton + Observer)
- **Singleton паттерн** - единственный экземпляр Warehouse в приложении
- **Observer паттерн** - автоматически получает уведомления об изменениях фигур
- Хранит метрики для каждой фигуры:
  - Площадь (для Oval)
  - Периметр (для Oval)
  - Объем (для Tetrahedron)
  - Площадь поверхности (для Tetrahedron)
- Автоматический пересчет метрик при изменении параметров фигуры
- Предоставляет методы для получения метрик по ID фигуры
- Метод `getAllMetrics()` возвращает все сохраненные метрики

### Observer Pattern
- Фигуры (Shape) реализуют интерфейс Observable
- Warehouse реализует интерфейс Observer
- При создании фигуры она автоматически регистрируется в Warehouse
- При изменении параметров фигуры вызывается `notifyObservers()`
- Warehouse получает уведомление и пересчитывает метрики

### Логирование
- Логирование в консоль и файл
- Структурированные логи (JSON)
- Разные уровни: info, warn, error, debug, trace, fatal
- Автоматическое форматирование с pino-pretty
- Логирование операций с Repository и Warehouse

### Обработка ошибок
- Только пользовательские исключения
- Все исключения обрабатываются try/catch
- Логирование всех ошибок
- Информативные сообщения об ошибках
- Обработка ошибок при работе с Repository и Warehouse

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

### Базовые требования
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

### Новые требования (Repository, Warehouse, Observer, Singleton)
- ✅ **Паттерн Repository** - все созданные объекты геометрических фигур сохраняются в объекте-репозитории
- ✅ **Спецификации поиска** - разработаны спецификации для поиска объектов:
  - По ID
  - По имени
  - По координатам (квадранты)
  - По диапазонам значений (площади, объемы, периметры)
  - По расстоянию от начала координат
- ✅ **Методы управления репозиторием**:
  - Добавление объектов (`add`)
  - Удаление объектов (`remove`)
- ✅ **Методы сортировки** с использованием интерфейса Comparator:
  - По ID
  - По имени
  - По координатам X первой точки
  - По координатам Y первой точки
- ✅ **Warehouse класс** - хранит площади, объемы, периметры фигур
- ✅ **Паттерн Observer** - любое изменение параметра фигуры вызывает пересчет соответствующих значений в Warehouse
- ✅ **Паттерн Singleton** - Warehouse реализован как Singleton

## 🔍 Детали реализации новых паттернов

### Repository Pattern

Репозиторий предоставляет абстракцию для работы с коллекцией фигур:

```typescript
class ShapeRepository {
  private shapes: Map<string, Shape>;
  
  add(shape: Shape): void;
  remove(id: string): boolean;
  findById(id: string): Shape | undefined;
  findByName(name: string): Shape[];
  findAll(): Shape[];
  findBySpecification(spec: Specification<Shape>): Shape[];
  sort(comparator: Comparator<Shape>): Shape[];
}
```

**Особенности:**
- Использует `Map<string, Shape>` для быстрого доступа по ID
- Поддерживает множественные фигуры с одинаковым именем
- Спецификации позволяют гибко комбинировать условия поиска
- Компараторы обеспечивают различные способы сортировки

### Specification Pattern

Спецификации инкапсулируют условия поиска:

```typescript
interface Specification<T> {
  isSatisfiedBy(item: T): boolean;
  and(other: Specification<T>): Specification<T>;
  or(other: Specification<T>): Specification<T>;
  not(): Specification<T>;
}
```

**Примеры спецификаций:**

1. **Поиск в первом квадранте:**
```typescript
const spec = new QuadrantSpecification(1);
// Находит все фигуры, у которых точки имеют x > 0 и y > 0
```

2. **Поиск по диапазону площади:**
```typescript
const spec = new RangeSpecification(
  (shape) => ovalService.calculateArea(shape as Oval),
  10,
  100
);
// Находит все овалы с площадью от 10 до 100
```

3. **Комбинирование спецификаций:**
```typescript
const firstQuadrant = new QuadrantSpecification(1);
const areaRange = new RangeSpecification(areaCalculator, 10, 100);
const combined = firstQuadrant.and(areaRange);
// Находит фигуры в первом квадранте И с площадью в диапазоне
```

### Comparator Pattern

Компараторы определяют порядок сортировки:

```typescript
interface Comparator<T> {
  compare(a: T, b: T): number;
  // Возвращает: отрицательное число если a < b,
  //             положительное если a > b,
  //             0 если a === b
}
```

**Примеры использования:**

```typescript
// Сортировка по ID
repository.sort(new IdComparator());

// Сортировка по имени (обратная)
const nameComparator = new NameComparator();
nameComparator.setReversed(true);
repository.sort(nameComparator);
```

### Warehouse (Singleton + Observer)

Warehouse - единственный экземпляр хранилища метрик:

```typescript
class Warehouse {
  private static instance: Warehouse;
  private metrics: Map<string, ShapeMetrics>;
  
  static getInstance(): Warehouse;
  
  getArea(shapeId: string): number | undefined;
  getVolume(shapeId: string): number | undefined;
  getPerimeter(shapeId: string): number | undefined;
  getSurfaceArea(shapeId: string): number | undefined;
  getAllMetrics(): Map<string, ShapeMetrics>;
}
```

**Механизм Observer:**

1. При создании фигуры через Factory она автоматически регистрируется в Warehouse
2. Warehouse подписывается на изменения фигуры (через Observable интерфейс)
3. При изменении параметров фигуры вызывается `notifyObservers()`
4. Warehouse получает уведомление и пересчитывает метрики:
   - Для Oval: площадь и периметр
   - Для Tetrahedron: объем и площадь поверхности

**Пример автоматического пересчета:**

```typescript
const warehouse = Warehouse.getInstance();
const oval = factory.createShape(ShapeType.OVAL, [0, 0, 10, 6], 'Oval1');

// Метрики автоматически вычислены и сохранены
const initialArea = warehouse.getArea(oval.getId()); // ~47.12

// При изменении параметров (если фигура поддерживает изменения)
// Warehouse автоматически пересчитает метрики
```

**Структура метрик:**

```typescript
interface ShapeMetrics {
  shapeId: string;
  shapeType: ShapeType;
  area?: number;           // Для Oval
  perimeter?: number;      // Для Oval
  volume?: number;         // Для Tetrahedron
  surfaceArea?: number;    // Для Tetrahedron
  lastUpdated: Date;
}
```

## 🎬 Полный пример использования всех паттернов

Пример демонстрирует совместное использование Repository, Warehouse, Specifications и Comparators:

```typescript
import { ShapeFactory } from './factories/ShapeFactory';
import { ShapeType } from './factories/ShapeType';
import { ShapeRepository } from './repositories/ShapeRepository';
import { Warehouse } from './warehouse/Warehouse';
import { QuadrantSpecification } from './specifications/QuadrantSpecification';
import { RangeSpecification } from './specifications/RangeSpecification';
import { IdComparator } from './comparators/IdComparator';
import { NameComparator } from './comparators/NameComparator';
import { OvalService } from './services/OvalService';
import { TetrahedronService } from './services/TetrahedronService';
import { Oval } from './entities/Oval';
import { Tetrahedron } from './entities/Tetrahedron';

// Инициализация
const factory = new ShapeFactory();
const repository = new ShapeRepository();
const warehouse = Warehouse.getInstance();
const ovalService = new OvalService();
const tetrahedronService = new TetrahedronService();

// 1. Создание фигур через Factory
const oval1 = factory.createShape(
  ShapeType.OVAL,
  [0, 0, 10, 6],
  'Oval1'
) as Oval;

const oval2 = factory.createShape(
  ShapeType.OVAL,
  [5, 5, 15, 11],
  'Oval2'
) as Oval;

const tetrahedron1 = factory.createShape(
  ShapeType.TETRAHEDRON,
  [0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1],
  'Tetra1'
) as Tetrahedron;

// 2. Добавление в Repository
repository.add(oval1);
repository.add(oval2);
repository.add(tetrahedron1);

// 3. Warehouse автоматически сохранил метрики
console.log('Oval1 area:', warehouse.getArea(oval1.getId()));
console.log('Tetra1 volume:', warehouse.getVolume(tetrahedron1.getId()));

// 4. Поиск с использованием спецификаций
// Найти все фигуры в первом квадранте
const firstQuadrantSpec = new QuadrantSpecification(1);
const firstQuadrantShapes = repository.findBySpecification(firstQuadrantSpec);
console.log(`Found ${firstQuadrantShapes.length} shapes in first quadrant`);

// Найти овалы с площадью от 20 до 100
const areaRangeSpec = new RangeSpecification(
  (shape) => {
    if (shape instanceof Oval) {
      return ovalService.calculateArea(shape);
    }
    return 0;
  },
  20,
  100
);
const ovalsInRange = repository.findBySpecification(areaRangeSpec);
console.log(`Found ${ovalsInRange.length} ovals with area in range`);

// 5. Сортировка
// Сортировка по ID
const sortedById = repository.sort(new IdComparator());
console.log('Shapes sorted by ID:', sortedById.map(s => s.getId()));

// Сортировка по имени
const sortedByName = repository.sort(new NameComparator());
console.log('Shapes sorted by name:', sortedByName.map(s => s.getName()));

// 6. Удаление из репозитория
repository.remove(oval1.getId());
console.log(`Repository now contains ${repository.findAll().length} shapes`);

// 7. Получение всех метрик из Warehouse
const allMetrics = warehouse.getAllMetrics();
console.log('All metrics:', Array.from(allMetrics.entries()));
```

## 📋 План реализации новых требований

### Этап 1: Repository Pattern ✅
- [x] Создать интерфейс `IShapeRepository`
- [x] Реализовать класс `ShapeRepository`
- [x] Методы `add()`, `remove()`, `findById()`, `findByName()`, `findAll()`
- [x] Интеграция с существующими классами

### Этап 2: Specification Pattern ✅
- [x] Создать интерфейс `Specification<T>`
- [x] Реализовать базовые спецификации:
  - [x] `IdSpecification`
  - [x] `NameSpecification`
  - [x] `QuadrantSpecification`
  - [x] `RangeSpecification`
  - [x] `DistanceSpecification`
- [x] Поддержка комбинирования спецификаций (AND, OR, NOT)
- [x] Интеграция с Repository

### Этап 3: Comparator Pattern ✅
- [x] Создать интерфейс `Comparator<T>`
- [x] Реализовать компараторы:
  - [x] `IdComparator`
  - [x] `NameComparator`
  - [x] `XCoordinateComparator`
  - [x] `YCoordinateComparator`
- [x] Поддержка обратной сортировки
- [x] Интеграция с Repository

### Этап 4: Warehouse (Singleton) ✅
- [x] Реализовать Singleton паттерн для Warehouse
- [x] Структура данных для хранения метрик
- [x] Методы получения метрик:
  - [x] `getArea()`
  - [x] `getVolume()`
  - [x] `getPerimeter()`
  - [x] `getSurfaceArea()`
  - [x] `getAllMetrics()`

### Этап 5: Observer Pattern ✅
- [x] Создать интерфейсы `Observer` и `Observable`
- [x] Реализовать Observer в Warehouse
- [x] Реализовать Observable в Shape
- [x] Автоматическая регистрация фигур в Warehouse
- [x] Автоматический пересчет метрик при изменениях

### Этап 6: Интеграция и тестирование ✅
- [x] Интеграция всех компонентов
- [x] Unit-тесты для Repository
- [x] Unit-тесты для Specifications
- [x] Unit-тесты для Comparators
- [x] Unit-тесты для Warehouse
- [x] Unit-тесты для Observer механизма
- [x] Интеграционные тесты

## 📚 Документация кода

Весь код содержит JSDoc комментарии с описанием:
- Назначения классов и методов
- Параметров методов
- Возвращаемых значений
- Выбрасываемых исключений
- Примеров использования паттернов