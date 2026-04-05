# 🐔 Clucky Tales — Sprint 1: Skeleton

## What you'll have at the end

A live web page on Vercel where:
- You see a green farm yard (tilemap) that you can scroll around with mouse/keyboard
- One chicken walks around randomly, stops, changes direction
- The chicken lays eggs every few seconds
- You click an egg → it disappears with a little animation → counter goes +1
- There's a minimal HUD at the top showing your egg count
- It works in Chrome, Firefox, Safari on desktop

**No real art yet** — the chicken is a colored sprite placeholder, the ground is simple colored tiles. This is intentional. We prove the mechanics first, then drop in real art.

---

## Step 0: Create the project (you do this manually, ~15 min)

### 0.1 Create the GitHub repo

1. Go to https://github.com/new
2. Name: `clucky-tales`
3. Check "Add a README file"
4. Click "Create repository"
5. Clone it to your computer:
   ```bash
   git clone https://github.com/YOUR_USERNAME/clucky-tales.git
   cd clucky-tales
   ```

### 0.2 Create Next.js project

Run this in the terminal inside the cloned folder:

```bash
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --no-import-alias
```

When it asks questions:
- Would you like to use TypeScript? → **Yes**
- Would you like to use ESLint? → **Yes**  
- Would you like to use Tailwind CSS? → **Yes**
- Would you like to use `src/` directory? → **Yes**
- Would you like to use App Router? → **Yes**
- Would you like to customize the default import alias? → **No**

### 0.3 Install Phaser

```bash
npm install phaser
```

### 0.4 Connect to Vercel

1. Go to https://vercel.com
2. Click "Add New Project"
3. Import your `clucky-tales` repo from GitHub
4. Click "Deploy"
5. Done! You now have a live URL like `clucky-tales.vercel.app`

Every time you `git push` to `main`, it auto-deploys.

### 0.5 Set up PixelLab MCP (for AI art generation)

PixelLab has an MCP server — this means Cursor and Claude Code can generate pixel-art sprites **by themselves**, without you going to the website manually.

**0.5.1 Get your PixelLab API token:**
1. Go to https://www.pixellab.ai/signin
2. Sign up / log in (Google or email)
3. Go to your account settings → API → copy your API token (looks like `pl_xxxxxxxxxxxx`)

**0.5.2 Add MCP to Claude Code (if using):**
```bash
claude mcp add pixellab https://api.pixellab.ai/mcp -t http -H "Authorization: Bearer YOUR_PIXELLAB_TOKEN"
```

**0.5.3 Add MCP to Cursor:**
1. Open Cursor Settings → MCP
2. Add new server:
   - Name: `pixellab`
   - URL: `https://api.pixellab.ai/mcp`
   - Headers: `Authorization: Bearer YOUR_PIXELLAB_TOKEN`
3. Save and restart Cursor

**0.5.4 Test it works:**
In Cursor or Claude Code, ask:
```
Using PixelLab MCP, generate a test sprite: a 32x32 pixel art chicken, top-down view.
Save the result to public/sprites/test_chicken.png
```
If it works — you'll see a sprite file appear. Delete it after testing.

> **Why now?** Sprint 1 uses placeholders, but from Sprint 2 onward the AI agent 
> will generate art as part of writing code. Setting this up now means it's ready.

### 0.6 Create folder structure

```bash
mkdir -p src/game/scenes
mkdir -p src/game/entities
mkdir -p src/game/systems
mkdir -p src/game/config
mkdir -p public/sprites
mkdir -p public/audio
mkdir -p public/data
mkdir -p docs
```

### 0.7 Copy this spec into the repo

Save this file as `docs/SPRINT_01.md` in your repo. This way Cursor can read it.

### 0.8 First commit

```bash
git add .
git commit -m "feat: initial project setup with Next.js + Phaser"
git push
```

**Checkpoint:** open your Vercel URL — you should see the default Next.js page.

---

## Step 1: Give this to Cursor (the main work)

Open Cursor, open the `clucky-tales` folder, and paste the following prompt into Cursor's Agent mode (Cmd+I or the composer). Cursor will create all the files.

### Cursor Prompt

```
Read docs/SPRINT_01.md for context.

I'm building a browser game called "Clucky Tales" using Next.js + Phaser 3 + TypeScript.

Create the following files to get a working Phaser game embedded in Next.js:

## 1. src/game/config/gameConfig.ts
- Phaser game config
- Canvas size: 960x640
- Physics: arcade
- Scale mode: FIT (scales to browser window, maintains aspect ratio)
- Pixel art rendering: roundPixels true, antialias false
- Scene list: [BootScene, YardScene]
- Background color: #7EC850 (grass green)
- Parent: 'game-container' div

## 2. src/game/config/constants.ts
- TILE_SIZE = 32
- YARD_WIDTH = 30 (tiles)
- YARD_HEIGHT = 20 (tiles)
- CHICKEN_SPEED = 40 (pixels per second)
- EGG_SPAWN_INTERVAL = 15000 (ms between eggs, 15 sec)
- EGG_COLLECT_SCORE = 1
- CHICKEN_DIRECTION_CHANGE_INTERVAL = 3000 (ms)

## 3. src/game/scenes/BootScene.ts
- Extends Phaser.Scene
- In create(): generate placeholder textures programmatically (no external files needed):
  - 'chicken': 32x32 orange circle with a red triangle beak and two dot eyes
  - 'egg': 16x16 white oval
  - 'grass1': 32x32 green square (#7EC850)
  - 'grass2': 32x32 slightly darker green (#6DB840)
  - 'grass3': 32x32 with a tiny flower dot
- After generating textures, start YardScene

## 4. src/game/scenes/YardScene.ts
- Extends Phaser.Scene
- In create():
  - Generate a simple tilemap from the grass textures (random grass1/grass2/grass3)
  - Place one chicken entity at center of yard
  - Set up camera: follows nothing initially, but player can scroll with:
    - Mouse drag (right-click or middle-click drag)
    - Arrow keys / WASD
    - Mouse wheel to zoom (clamp between 0.5x and 2x)
  - Set world bounds to YARD_WIDTH * TILE_SIZE x YARD_HEIGHT * TILE_SIZE
  - Create egg group (physics group for collectible eggs)
  - Create HUD (fixed to camera): egg counter text in top-left
  - Set up egg collection: when player clicks an egg, destroy it with a scale tween and increment counter
- In update():
  - Update chicken AI
  - Check for keyboard camera movement

## 5. src/game/entities/Chicken.ts
- Extends Phaser.Physics.Arcade.Sprite
- Simple state machine with states: IDLE, WALKING
- On create: start in IDLE state
- Every CHICKEN_DIRECTION_CHANGE_INTERVAL ms:
  - Random choice: 60% walk in random direction, 40% stop and idle
  - When walking: set velocity in random direction at CHICKEN_SPEED
  - When idle: set velocity to 0
- Stay within world bounds (collideWorldBounds = true)
- Every EGG_SPAWN_INTERVAL: spawn an egg at current position
  - Add egg to the egg group in YardScene
  - Small "pop" tween on the egg when it appears (scale from 0 to 1)
- Add a simple bobbing animation while walking (tween y offset +-2px)

## 6. src/game/entities/Egg.ts  
- Extends Phaser.Physics.Arcade.Sprite
- On click/tap: 
  - Play collect animation (scale to 1.5 then to 0, takes 200ms)
  - After animation: destroy self, emit 'egg-collected' event
- Has a subtle floating animation (gentle up-down tween, 1px, looping)

## 7. src/app/page.tsx
- Remove all default Next.js content
- Full-screen black background
- Centered div with id='game-container'
- Dynamically import Phaser (since it needs window/document):
  - Use next/dynamic with ssr: false
  - Create a GameComponent that initializes Phaser game on mount and destroys on unmount
- No other UI outside the canvas

## 8. src/game/GameComponent.tsx
- 'use client' component
- On mount: create new Phaser.Game(config)
- On unmount: game.destroy(true)
- Return div with id='game-container'

## Important rules:
- All code comments in English
- TypeScript strict mode
- No external sprite files — everything is generated programmatically in BootScene
- The game must work when deployed to Vercel (static export compatible)
- Test that `npm run build` succeeds without errors
```

### What Cursor will create

After Cursor finishes, you should have these files:

```
src/
├── app/
│   └── page.tsx              # Next.js page with game container
├── game/
│   ├── config/
│   │   ├── gameConfig.ts     # Phaser configuration
│   │   └── constants.ts      # Game balance numbers
│   ├── scenes/
│   │   ├── BootScene.ts      # Loads/generates placeholder assets
│   │   └── YardScene.ts      # Main yard scene
│   ├── entities/
│   │   ├── Chicken.ts        # Chicken with AI movement
│   │   └── Egg.ts            # Collectible egg
│   └── GameComponent.tsx     # React wrapper for Phaser
```

---

## Step 2: Test locally

```bash
npm run dev
```

Open http://localhost:3000. You should see:

1. A green yard (random grass tiles)
2. An orange circle (the chicken) walking around randomly
3. Every 15 seconds, a white oval (egg) appears where the chicken was
4. Click the egg → it pops and disappears → counter at top goes from 0 to 1
5. Scroll around with arrow keys or drag
6. Mouse wheel zooms in/out

### Common issues and fixes

**"window is not defined"** — Phaser uses browser APIs. Make sure GameComponent is loaded with `dynamic()` and `ssr: false`.

**Game doesn't appear** — Check browser console (F12). Look for errors. Most common: the `game-container` div isn't rendered yet when Phaser initializes. Fix: use useEffect with proper cleanup.

**Chicken walks through edges** — Check that `collideWorldBounds` is true and world bounds are set in YardScene.

**Build fails on Vercel** — Run `npm run build` locally first. Fix TypeScript errors. Make sure no `require()` calls in game files (use import).

---

## Step 3: Polish & commit

Once it works:

1. Play with the numbers in `constants.ts`:
   - Is the chicken too fast/slow? Change CHICKEN_SPEED
   - Eggs spawn too often/rarely? Change EGG_SPAWN_INTERVAL
   - Chicken changes direction too often? Change CHICKEN_DIRECTION_CHANGE_INTERVAL

2. Commit and push:
```bash
git add .
git commit -m "feat: Sprint 1 — greybox yard with chicken and egg collection"
git push
```

3. Check your Vercel URL — it should auto-deploy in ~1 minute.

---

## Acceptance Criteria (Sprint 1 is DONE when)

- [ ] Live on Vercel URL
- [ ] Green tilemap yard visible
- [ ] One chicken moves randomly (walk/idle cycle)
- [ ] Chicken stays within yard bounds
- [ ] Eggs spawn periodically at chicken's position
- [ ] Clicking egg → animation → egg disappears → counter increments
- [ ] Camera scrolls with keyboard (WASD/arrows) and mouse drag
- [ ] Mouse wheel zoom works (0.5x to 2x)
- [ ] HUD shows egg count (fixed to camera, doesn't scroll)
- [ ] No console errors
- [ ] `npm run build` succeeds
- [ ] Works in Chrome and Firefox

---

## Step 4: Self-Check (give this to Cursor after Step 3)

Paste this prompt into Cursor after everything seems to work. 
It will audit the code and fix issues:

```
Run a full self-check on the Clucky Tales Sprint 1 implementation.

## Build Check
1. Run `npm run build` — fix any TypeScript errors or warnings
2. Run `npm run lint` — fix any linting issues
3. Verify that the build output is static-export compatible (no server-side code)

## Structure Check
4. Verify all files exist:
   - src/game/config/gameConfig.ts
   - src/game/config/constants.ts
   - src/game/scenes/BootScene.ts
   - src/game/scenes/YardScene.ts
   - src/game/entities/Chicken.ts
   - src/game/entities/Egg.ts
   - src/game/GameComponent.tsx
   - src/app/page.tsx
5. Verify no hardcoded numbers in game logic (all should reference constants.ts)
6. Verify Phaser is loaded with dynamic import (ssr: false)

## Runtime Check
7. Open browser console — are there any errors or warnings?
8. Does the game container fill the viewport properly?
9. Does the chicken stay within world bounds?
10. Do eggs spawn at the chicken's position (not at 0,0)?
11. Does clicking an egg increment the counter AND destroy the egg?
12. Does camera scrolling work with WASD, arrow keys, and mouse drag?
13. Does mouse wheel zoom work and clamp between 0.5x and 2x?
14. Is the HUD (egg counter) fixed to camera (doesn't scroll with the map)?

## Code Quality Check
15. All code comments are in English
16. No `console.log` statements (use conditional debug logging)
17. No `any` types in TypeScript
18. Chicken state machine has clean transitions (no stuck states)
19. Egg click handler has proper cleanup (no memory leaks from tweens)
20. Game properly destroys on component unmount (no orphaned Phaser instances)

## Fix any issues found. Report what was fixed.
```

---

## Step 5: Playtest (you do this, 10 minutes)

Play the game yourself for 10 minutes. Answer these questions honestly:

**Feel:**
- Is it satisfying to click eggs? If not — what feels off? (delay? animation? sound placeholder needed?)
- Is the chicken movement natural or robotic? 
- Is the yard too big / too small / about right?

**Bugs:**
- Does anything break if you click really fast?
- Does anything break if you zoom all the way in/out?
- Does anything break if you resize the browser window?

**Notes:**
Write your answers in `docs/PLAYTEST_S01.md`. 
You'll give this to Cursor at the start of Sprint 2 to fix issues.

---

## What's next (Sprint 2 preview)

Sprint 2 will add:
- Multiple chickens with different colors
- Needs system (hunger bar visible on hover)
- Feeder building (click to place, chickens walk to it)
- Day/night tinting (simple color overlay)
- Placeholder speech bubbles
- **Real art replacement** — by this point your Style Bible is ready (see ART_GUIDE.md), 
  and Cursor will use PixelLab MCP to generate breed variants automatically

But first — let's get Sprint 1 solid!
