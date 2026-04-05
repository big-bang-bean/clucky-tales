import * as Phaser from "phaser";
import i18n from "i18next";
import {
  CAMERA_PAN_SPEED,
  CAMERA_ZOOM_MAX,
  CAMERA_ZOOM_MIN,
  CAMERA_ZOOM_STEP,
  EGG_COLLECT_SCORE,
  HUD_DEPTH,
  HUD_OFFSET_X,
  HUD_OFFSET_Y,
  TILE_SIZE,
  YARD_HEIGHT,
  YARD_WIDTH,
} from "@/game/config/constants";
import { Chicken } from "@/game/entities/Chicken";
import { Egg } from "@/game/entities/Egg";

const GRASS_KEYS: string[] = ["grass1", "grass2", "grass3"];

/**
 * Playable yard: tiles, chicken, eggs, camera controls, HUD.
 */
export class YardScene extends Phaser.Scene {
  private chicken!: Chicken;
  private eggGroup!: Phaser.Physics.Arcade.Group;
  private hudText!: Phaser.GameObjects.Text;
  private eggScore = 0;

  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private keyW!: Phaser.Input.Keyboard.Key;
  private keyA!: Phaser.Input.Keyboard.Key;
  private keyS!: Phaser.Input.Keyboard.Key;
  private keyD!: Phaser.Input.Keyboard.Key;

  private cameraDragActive = false;
  /** When true, pan follows the primary (left) button; otherwise middle/right. */
  private cameraDragUsesLeftButton = false;
  private lastPointerX = 0;
  private lastPointerY = 0;

  constructor() {
    super({ key: "YardScene" });
  }

  create(): void {
    const worldW = YARD_WIDTH * TILE_SIZE;
    const worldH = YARD_HEIGHT * TILE_SIZE;

    this.buildGrassTiles(worldW, worldH);

    this.eggGroup = this.physics.add.group();

    const midX = worldW / 2;
    const midY = worldH / 2;
    this.chicken = new Chicken(this, midX, midY, this.eggGroup);

    const cam = this.cameras.main;
    cam.setRoundPixels(true);
    cam.setBounds(0, 0, worldW, worldH);
    // Defer follow: in create() camera size can still be 0, which breaks centerOn/scroll.
    // Following the chicken keeps it centered while it wanders.
    this.events.once(Phaser.Scenes.Events.POST_UPDATE, () => {
      this.cameras.main.startFollow(this.chicken, true, 1, 1);
    });

    this.hudText = this.add.text(HUD_OFFSET_X, HUD_OFFSET_Y, this.hudLabel(), {
      fontFamily: "monospace",
      fontSize: "18px",
      color: "#ffffff",
      stroke: "#000000",
      strokeThickness: 4,
    });
    this.hudText.setScrollFactor(0);
    this.hudText.setDepth(HUD_DEPTH);

    this.events.on("egg-collected", this.onEggCollected, this);

    this.setupInput();
    this.game.canvas.addEventListener("contextmenu", this.preventContextMenu);

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.events.off("egg-collected", this.onEggCollected, this);
      this.game.canvas.removeEventListener("contextmenu", this.preventContextMenu);
    });
  }

  update(_time: number, delta: number): void {
    this.updateKeyboardCamera(delta);
  }

  private hudLabel(): string {
    return i18n.t("hud.eggCount", { count: this.eggScore });
  }

  private onEggCollected(): void {
    this.eggScore += EGG_COLLECT_SCORE;
    this.hudText.setText(this.hudLabel());
  }

  private buildGrassTiles(worldW: number, worldH: number): void {
    for (let ty = 0; ty < YARD_HEIGHT; ty++) {
      for (let tx = 0; tx < YARD_WIDTH; tx++) {
        const key = Phaser.Utils.Array.GetRandom(GRASS_KEYS);
        const x = tx * TILE_SIZE + TILE_SIZE / 2;
        const y = ty * TILE_SIZE + TILE_SIZE / 2;
        this.add.image(x, y, key).setOrigin(0.5, 0.5);
      }
    }
    this.physics.world.setBounds(0, 0, worldW, worldH);
  }

  private setupInput(): void {
    const kb = this.input.keyboard;
    if (!kb) {
      return;
    }
    this.cursors = kb.createCursorKeys();
    this.keyW = kb.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this.keyA = kb.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.keyS = kb.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    this.keyD = kb.addKey(Phaser.Input.Keyboard.KeyCodes.D);

    this.input.on(
      "pointerdown",
      (pointer: Phaser.Input.Pointer) => {
        if (pointer.middleButtonDown() || pointer.rightButtonDown()) {
          this.cameras.main.stopFollow();
          this.cameraDragActive = true;
          this.cameraDragUsesLeftButton = false;
          this.lastPointerX = pointer.x;
          this.lastPointerY = pointer.y;
          return;
        }
        if (pointer.leftButtonDown()) {
          const hit = this.input.hitTestPointer(pointer);
          if (hit.some((go) => go instanceof Egg)) {
            return;
          }
          this.cameras.main.stopFollow();
          this.cameraDragActive = true;
          this.cameraDragUsesLeftButton = true;
          this.lastPointerX = pointer.x;
          this.lastPointerY = pointer.y;
        }
      },
    );

    this.input.on("pointermove", (pointer: Phaser.Input.Pointer) => {
      if (!this.cameraDragActive) {
        return;
      }
      if (this.cameraDragUsesLeftButton) {
        if (!pointer.leftButtonDown()) {
          this.cameraDragActive = false;
          return;
        }
      } else if (!pointer.middleButtonDown() && !pointer.rightButtonDown()) {
        this.cameraDragActive = false;
        return;
      }
      const dx = pointer.x - this.lastPointerX;
      const dy = pointer.y - this.lastPointerY;
      const cam = this.cameras.main;
      cam.scrollX -= dx / cam.zoom;
      cam.scrollY -= dy / cam.zoom;
      this.lastPointerX = pointer.x;
      this.lastPointerY = pointer.y;
    });

    this.input.on("pointerup", () => {
      this.cameraDragActive = false;
      this.cameraDragUsesLeftButton = false;
    });

    this.input.on(
      "wheel",
      (
        _pointer: Phaser.Input.Pointer,
        _gameObjects: Phaser.GameObjects.GameObject[],
        _deltaX: number,
        deltaY: number,
      ) => {
        const cam = this.cameras.main;
        const dir = deltaY > 0 ? 1 : deltaY < 0 ? -1 : 0;
        const next = Phaser.Math.Clamp(
          cam.zoom - dir * CAMERA_ZOOM_STEP,
          CAMERA_ZOOM_MIN,
          CAMERA_ZOOM_MAX,
        );
        cam.setZoom(next);
      },
    );
  }

  private updateKeyboardCamera(delta: number): void {
    const cam = this.cameras.main;
    const step = (CAMERA_PAN_SPEED * delta) / 1000 / cam.zoom;

    const panning =
      this.cursors.left.isDown ||
      this.cursors.right.isDown ||
      this.cursors.up.isDown ||
      this.cursors.down.isDown ||
      this.keyA.isDown ||
      this.keyD.isDown ||
      this.keyW.isDown ||
      this.keyS.isDown;

    if (panning) {
      cam.stopFollow();
    }

    if (this.cursors.left.isDown || this.keyA.isDown) {
      cam.scrollX -= step;
    }
    if (this.cursors.right.isDown || this.keyD.isDown) {
      cam.scrollX += step;
    }
    if (this.cursors.up.isDown || this.keyW.isDown) {
      cam.scrollY -= step;
    }
    if (this.cursors.down.isDown || this.keyS.isDown) {
      cam.scrollY += step;
    }
  }

  private preventContextMenu = (e: Event): void => {
    e.preventDefault();
  };
}
