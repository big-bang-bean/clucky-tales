# 🧪 Clucky Tales — Balance Testing Guide

> Этот документ описывает три уровня тестирования игры.
> Положи в `docs/BALANCE_TESTING.md` в репо.

---

## Зачем тестировать баланс

Без тестирования баланса ты узнаешь о проблемах только когда подруга скажет 
«мне скучно» (слишком легко) или «я не понимаю что делать» (слишком сложно).

Три уровня тестирования, от простого к сложному:

| Уровень | Что проверяет | Кто делает | Когда |
|---|---|---|---|
| **Симуляция** | Экономика: темп прогрессии, баланс ресурсов | Скрипт (Node.js) | После каждого изменения constants.ts |
| **Автотесты** | Механики: формулы не ломаются, стейт консистентен | Jest тесты | При каждом коммите |
| **Плейтест** | Ощущения: весело ли, понятно ли, хочется ли вернуться | Ты руками | После каждого спринта |

---

## Уровень 1: Симуляция экономики

Это Node.js скрипт, который прогоняет экономику игры **без UI**. 
Показывает: через сколько минут игрок накопит на каждое здание, 
когда откроет каждую главу, где «мёртвые зоны» (нечего делать).

### Как создать

Дай Cursor этот промпт:

```
Create a balance simulation script at tests/balance/simulate.ts

The script should:
1. Import constants from src/game/config/constants.ts
2. Import building costs from public/data/buildings.json
3. Import story chapter requirements from the GDD

Simulate 1000 game cycles (1 cycle = 10 minutes game time). 
At each cycle, calculate:
- Eggs produced (chickens × egg_rate × cycle_duration)
- Materials produced (if couriers exist: couriers × material_rate)
- Happiness stars produced (if any chicken has all needs > 70)
- Gold eggs (5% chance per egg)

Track:
- When can the player afford each building? (cycle number → real-time minutes)
- When does each story chapter unlock? (happiness stars threshold)
- Total resources at each milestone

Output a formatted table like:

| Milestone | Cycle | Real Time | Chickens | Eggs Total | Notes |
|---|---|---|---|---|---|
| Feeder built | 3 | 30 min | 1 | 18 | First building after tutorial |
| Nest built | 5 | 50 min | 1 | 30 | Unlocks Egg Layer profession |
| 2nd chicken arrives | 8 | 80 min | 2 | 48 | Automatic event |
| Kitchen built | 15 | 150 min | 3 | 120 | Unlocks Cook profession |
| Chapter 2 unlocks | 20 | 200 min | 5 | 180 | Needs 20 happiness stars |
| ... | ... | ... | ... | ... | ... |

Also flag problems:
- ⚠️ DEAD ZONE: If >5 cycles pass with nothing new to build/unlock
- ⚠️ TOO FAST: If a building is affordable in <2 cycles after previous
- ⚠️ TOO SLOW: If >20 cycles needed for a single building
- ⚠️ RESOURCE SINK: If a resource accumulates >500 with nothing to spend on

Run with: npx ts-node tests/balance/simulate.ts
```

### Когда запускать

- После любого изменения в `constants.ts`
- После добавления/удаления зданий
- Перед каждым деплоем

### Как читать результат

**Идеальная кривая прогрессии:**
- Первые 30 минут: новая разблокировка каждые 5–10 минут (hook!)
- 30 мин – 2 часа: каждые 15–20 минут что-то новое
- 2–8 часов: каждые 30–40 минут новое здание или сюжетная глава
- 8+ часов: пост-гейм, ежедневные события

**Если видишь Dead Zone** → снизь стоимость следующего здания или добавь мини-событие.
**Если Too Fast** → подними стоимость или добавь промежуточное здание.

---

## Уровень 2: Автотесты (Jest)

Юнит-тесты для критических систем. Дай Cursor этот промпт 
когда системы будут реализованы (Спринт 3+):

```
Create Jest tests for the game systems:

tests/systems/EconomySystem.test.ts:
- Test: 1 chicken produces ~6 eggs per hour (±10% for randomness)
- Test: 10 chickens produce ~60 eggs per hour
- Test: Gold egg drop rate is approximately 5% over 1000 eggs
- Test: Offline progress caps at 200 eggs
- Test: Offline needs don't drop below 30

tests/systems/NeedsSystem.test.ts:
- Test: Hunger degrades by 5 per cycle
- Test: Feeder restores hunger by 40
- Test: Auto-feeder keeps hunger above 60
- Test: No need drops below 0 or above 100

tests/systems/RelationshipSystem.test.ts:
- Test: Two chickens on a bench gain +15 relationship
- Test: Relationship clamps between -50 and +100
- Test: Romance only possible with rooster (chicken-chicken stays at friendship)

tests/systems/BuildingSystem.test.ts:
- Test: Building requires exact resources
- Test: Building with insufficient resources fails gracefully
- Test: Builder chicken reduces cost by 30%

tests/systems/SaveSystem.test.ts:
- Test: Save and load preserves all game state
- Test: Save format includes version number
- Test: Loading corrupted save doesn't crash (falls back to new game)

Run with: npm test
Add to package.json scripts: "test": "jest --config jest.config.ts"
```

---

## Уровень 3: Плейтест (ты руками)

После каждого спринта — играй 15 минут и заполни шаблон.

### Шаблон: `docs/PLAYTEST_SXX.md`

```markdown
# Playtest Report — Sprint [XX]
Date: [дата]
Duration: [сколько играл]
Build: [Vercel URL или localhost]

## First Impression (первые 30 секунд)
- Что я увидел первым:
- Понятно ли что делать:
- Чувствует ли "мило":

## Fun Moments (что понравилось)
1. 
2. 
3. 

## Friction (что бесило / было непонятно)
1. 
2. 
3. 

## Bugs Found
1. 
2. 

## Balance Feel
- Яйца копятся: слишком быстро / нормально / слишком медленно
- Первое здание: построил через ___ минут (ожидание: 5–10 мин)
- Было ли скучно в какой-то момент? Когда?
- Хотелось ли вернуться на следующий день?

## Ideas That Came Up
1. 
2. 

## Priority Fix for Next Sprint
Самое важное что нужно исправить:
```

### Правила плейтеста

1. **Играй как подруга, не как разработчик.** Не смотри в код, не открывай консоль. 
   Просто играй и замечай что чувствуешь.
2. **Записывай сразу.** Не после — во время. Открой шаблон рядом с игрой.
3. **Первое впечатление невозвратно.** Первый раз ты видишь игру «свежими глазами». 
   Это единственный шанс поймать UX-проблемы. Цени этот момент.
4. **Если можешь — дай поиграть кому-то ещё.** Другу, коллеге. 
   Не объясняй ничего, просто смотри как они играют.

---

## Когда что запускать

| Спринт | Симуляция | Автотесты | Плейтест |
|---|---|---|---|
| 1 (скелет) | Нет (нет экономики) | Нет (нет систем) | ✅ Feel + UX |
| 2 (жизнь кур) | Нет | Нет | ✅ Chicken behavior |
| 3 (строительство) | ✅ Первый запуск | Нет | ✅ Build flow |
| 4 (экономика) | ✅ Полный прогон | ✅ Economy + Needs | ✅ Progression |
| 5 (отношения) | ✅ | ✅ + Relationships | ✅ Social feels |
| 6 (сюжет) | ✅ | ✅ + Quests | ✅ Story pacing |
| 7 (polish) | ✅ Final tune | ✅ All systems | ✅ Full playthrough |
| 8 (финал) | ✅ Final tune | ✅ All + Save | ✅ "Is this a gift I'm proud of?" |
