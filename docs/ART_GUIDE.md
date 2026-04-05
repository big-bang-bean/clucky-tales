# 🎨 Clucky Tales — Art Guide: HD Pixel Art Pipeline

> Весь арт генерируется через PixelLab MCP прямо из Cursor / Claude Code.  
> Ты никуда не ходишь — смотришь результат и говоришь «да» или «нет».  
> Aseprite — опционально, на случай если нужно подправить пару пикселей.

---

## Как это работает

PixelLab MCP подключен к твоему Cursor / Claude Code (настроено в Спринте 1, шаг 0.5).
Ты пишешь промпт → AI-агент вызывает PixelLab API → спрайт сохраняется в проект.
Ты открываешь PNG, смотришь — нравится или нет. Если нет — просишь перегенерировать.

**Весь пайплайн = промпты в Cursor.**

---

## Стиль игры

**Формат:** HD Pixel-art  
**Размеры:** Персонажи 64×64, тайлы 32×32, здания 96×96–128×128  
**Палитра:** Тёплая, пастельная, 24–32 цвета  
**Вайб:** Eastward × Moonlighter × Stardew Valley  
**Почему 64×64:** Видны эмоции (глазки), аксессуары (шарфик), характер в позе

---

## ФАЗА 1: Style Bible (ты направляешь, MCP генерит)

Style Bible — 4–5 эталонных ассетов, которые определяют визуал всей игры.
Дальше все генерации будут ссылаться на эти ассеты как style reference.

Здесь **ты принимаешь решения** — AI генерирует варианты, ты выбираешь.

### Подготовка

Убедись что PixelLab MCP настроен (Спринт 1, шаг 0.5) и работает.
Создай папку для Style Bible:

```bash
mkdir -p style-bible
```

---

### Шаг 1: Эталонная курица — самый важный ассет (15–30 минут)

Эта курица = визуальный стандарт всей игры. Не торопись.

**Дай Cursor этот промпт:**

```
Read the PixelLab MCP docs: @https://api.pixellab.ai/mcp/docs

Generate a pixel art chicken character using PixelLab MCP:
- Size: 64×64
- Description: "Cute chicken character, top-down RPG view, round fluffy body, 
  small orange beak, happy black dot eyes, brown and white feathers, 
  warm pastel colors, cozy farm game style, single character centered"
- Background: transparent
- Save to: style-bible/reference_chicken.png

Generate 3–4 variants if possible. I want to pick the best one.
```

**Открой сгенерированные файлы и выбери по чеклисту:**

- ✅ Курица **милая** — круглая, пухлая, не реалистичная, не агрессивная
- ✅ Видны **глазки** — два чёрных дота или маленькие глазки
- ✅ Видна **мордочка** — клювик, может маленький гребешок
- ✅ **Чистые пиксели** — нет "грязи", размытых краёв
- ✅ **Прозрачный фон**
- ❌ Слишком детальная (как фото)
- ❌ Слишком примитивная (как эмодзи)
- ❌ Холодные цвета

**Если не нравится — скажи Cursor:**

- «Слишком реалистичная, сделай проще и милее»
- «Слишком детская, добавь деталей в оперении»
- «Цвета слишком холодные, нужны тёплые оранжево-кремовые тона»
- «Мне нравится вариант 2, но сделай глазки побольше»

**Когда нашёл THE ONE** — скажи Cursor:

```
This one is perfect. Copy it to public/sprites/reference_chicken.png — 
this is now our style reference for all future generations.
```

---

### Шаг 2: Анимации для эталонной курицы (10–20 минут)

```
Read the PixelLab MCP docs: @https://api.pixellab.ai/mcp/docs

Using the character from style-bible/reference_chicken.png:

1. Create 4-directional views (down, up, left, right) using create_character 
   with the same style
2. Create walk animation (4 frames) using animate_character
3. Create idle animation (2 frames) using animate_character
4. Create eating animation (3 frames, pecking at ground)
5. Create sleeping animation (2 frames, eyes closed)

Assemble everything into a sprite sheet:
- Layout: rows by animation, columns by frame
- Save sprite sheet to: style-bible/chicken_default.png
- Save JSON atlas to: style-bible/chicken_default.json (Phaser 3 format)
```

---

### Шаг 3: Тайлы травы (5–10 минут)

```
Read the PixelLab MCP docs: @https://api.pixellab.ai/mcp/docs

Generate a top-down grass tileset using PixelLab MCP:
- Tile size: 32×32
- Style: warm pastel pixel art, cozy farm game, matching the style of 
  public/sprites/reference_chicken.png
- Generate 3 tile variants:
  1. Plain grass (save to style-bible/grass_plain.png)
  2. Grass with small flowers (save to style-bible/grass_flowers.png)
  3. Taller/darker grass (save to style-bible/grass_tall.png)
- All tiles must be seamless (tileable without visible seams)
- Background: opaque (these are floor tiles)

If PixelLab has a tileset generation tool (create_topdown_tileset), 
use that for best seamless results.
```

**Открой файлы, проверь:** тайлы стыкуются? Цвета тёплые? 
Стиль совпадает с курицей? Если нет — просишь перегенерить.

---

### Шаг 4: Курятник (5–10 минут)

```
Read the PixelLab MCP docs: @https://api.pixellab.ai/mcp/docs

Generate a chicken coop building using PixelLab MCP:
- Size: 96×96
- Style: matching public/sprites/reference_chicken.png palette and style
- Top-down/slight angle view
- Warm wood and hay materials
- Background: transparent

Generate 2 versions:
1. Complete building (save to style-bible/coop_complete.png)
2. Under construction — scaffolding, unfinished roof 
   (save to style-bible/coop_construction.png)
```

---

### Шаг 5: UI-кнопка (5 минут)

```
Read the PixelLab MCP docs: @https://api.pixellab.ai/mcp/docs

Generate a pixel art UI button using PixelLab MCP:
- Style: wooden frame, warm brown, rounded corners, matching game palette
- Background: transparent
- Generate 3 states:
  1. Normal (save to style-bible/btn_normal.png)
  2. Hover — slightly brighter (save to style-bible/btn_hover.png)
  3. Pressed — slightly darker, 1px down offset (save to style-bible/btn_pressed.png)
```

---

### ✅ Чеклист Style Bible

Скажи Cursor:
```
List all files in style-bible/ folder and verify we have:
- reference_chicken.png (64×64, transparent bg)
- chicken_default.png (sprite sheet with animations)
- chicken_default.json (Phaser atlas)
- grass_plain.png (32×32)
- grass_flowers.png (32×32)
- grass_tall.png (32×32)
- coop_complete.png (96×96)
- coop_construction.png (96×96)
- btn_normal.png, btn_hover.png, btn_pressed.png

Copy reference_chicken.png to public/sprites/reference_chicken.png 
(this is the style reference for all future MCP generations).
```

**Style Bible готова.** Заняло 30–60 минут, ничего не устанавливал, никуда не ходил.

---

## ФАЗА 2: Массовая генерация (AI делает сам)

Теперь AI-агент генерирует ассеты как часть обычных задач.
Ты даёшь промпт типа «добавь породу Силки» — он сам вызовет MCP, 
сгенерит спрайт, сохранит, напишет код.

### Промпт-шаблон (копируй и адаптируй)

```
Read the PixelLab MCP docs: @https://api.pixellab.ai/mcp/docs
Use public/sprites/reference_chicken.png as the style reference.

Task: [ОПИСАНИЕ ЗАДАЧИ]

Requirements:
- Size: [64×64 / 32×32 / 96×96]
- Style: HD pixel art, warm pastel palette, cozy farm game
- Match the style of reference_chicken.png
- Background: transparent
- Save to: public/sprites/[category]/[filename].png
- If animated: sprite sheet + JSON atlas for Phaser 3

After generating, update code to load and use the new asset.
```

### Что генерируется через MCP (по спринтам)

| Что | MCP-инструмент | Спринт |
|---|---|---|
| Новые породы кур (15–20 шт) | `create_character` + `animate_character` | 2, 4, 6 |
| Тайлсеты окружения | `create_topdown_tileset` | 3 |
| Здания (12 × 2 состояния) | `create_map_object` | 3 |
| Объекты карты (деревья, кусты) | `create_map_object` | 3 |
| Сезонные варианты тайлов | `create_topdown_tileset` | 7 |
| Аксессуары и предметы | `create_map_object` | 5, 7 |

### Контроль качества

После каждой пачки генераций:
1. `npm run dev` → смотри в браузере
2. Стиль совпадает с reference? Размер правильный?
3. Нет → «перегенерируй, [что не так]»
4. Мелкий артефакт → проще перегенерировать, чем чинить руками

---

## Замена placeholders (после Style Bible + Sprint 1 greybox)

Когда оба трека готовы — скажи Cursor:

```
Replace the programmatically generated placeholder textures in BootScene.ts 
with real sprite files from style-bible/:

1. Copy style-bible/chicken_default.png to public/sprites/chicken_default.png
2. Copy style-bible/chicken_default.json to public/sprites/chicken_default.json
3. Copy style-bible/grass_*.png to public/sprites/
4. Update BootScene.ts to load real sprites instead of generated textures:
   - Load 'chicken' from atlas (chicken_default.png + .json)
   - Load grass textures from files
5. Update Chicken.ts to use atlas animations (idle, walk, eat, sleep)
6. Update YardScene.ts tilemap to use real grass textures
7. Test that `npm run build` still succeeds
```

---

## Pixel-art редактор (ОПЦИОНАЛЬНО)

Если нужно вручную подправить спрайт — нужен pixel-art редактор.
**Не нужен для старта.** Решишь по ходу.

### LibreSprite (бесплатный, рекомендую)

- Скачай: https://libresprite.github.io
- Бесплатный, open source
- Форк Aseprite — похожий интерфейс, базовые фичи на месте
- Есть: слои, анимация, палитры, экспорт sprite sheet, tiled mode
- Нет: плагин PixelLab (нам не нужен — у нас MCP)

### Aseprite ($20, если захочешь больше)

- Купить: Steam или aseprite.org, $19.99
- Более полированный UI, чаще обновляется
- Есть плагин PixelLab (но нам он не нужен при MCP-пайплайне)
- Покупай только если LibreSprite не устроит

### Когда реально пригодится редактор

- AI сгенерил курицу, но один пиксель клюва торчит → подправить руками
- Нужно собрать кастомный sprite sheet из нескольких генераций
- Применить единую палитру ко всем ассетам (Color Mode → Indexed)
- Нарисовать что-то кастомное (UI-иконку, особый эффект)

### Когда НЕ нужен

- MCP-генерация устраивает по качеству
- Мелкие артефакты проще перегенерировать чем чинить

---

## FAQ

**Q: Сколько стоит весь арт-пайплайн?**  
A: PixelLab подписка ~$15–30/мес (нужна для API/MCP). На всю игру — 1–2 месяца. 
Итого $15–60. Pixel-art редактор: LibreSprite бесплатно, Aseprite $20 опционально.

**Q: Сколько MCP-генераций уйдёт?**  
A: Style Bible: ~10–15. Вся игра: ~100–200. Зависит от плана PixelLab.

**Q: Что если MCP не работает?**  
A: Fallback: открой https://www.pixellab.ai в браузере и генерируй вручную. 
Скачивай PNG, клади в public/sprites/. Код тот же.

**Q: Могу я начать без подписки PixelLab?**  
A: Бесплатный триал даёт ~40 генераций — хватит на Style Bible. 
Для MCP API нужна подписка. Можно начать с триала, 
а подписку оформить когда дойдёшь до Фазы 2.

**Q: Что если стиль между генерациями не совпадает?**  
A: Всегда указывай `reference_chicken.png` как style reference в промптах. 
Это якорь консистентности. Если всё равно не совпадает — 
опиши в промпте конкретнее: «same warm palette, same pixel density, 
same level of detail as reference».
