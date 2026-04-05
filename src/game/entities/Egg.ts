import * as Phaser from "phaser";
import {
  EGG_COLLECT_DURATION_MS,
  EGG_FLOAT_DURATION_MS,
  EGG_FLOAT_OFFSET_PX,
} from "@/game/config/constants";

/**
 * Collectible egg: float animation and pointer collection.
 */
export class Egg extends Phaser.Physics.Arcade.Sprite {
  private collecting = false;
  private floatTween?: Phaser.Tweens.Tween;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, "egg");
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setDepth(10);

    this.setInteractive({ useHandCursor: true });
    this.on("pointerdown", () => {
      this.tryCollect();
    });

    this.floatTween = scene.tweens.add({
      targets: this,
      y: this.y - EGG_FLOAT_OFFSET_PX,
      duration: EGG_FLOAT_DURATION_MS,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });
  }

  override destroy(fromScene?: boolean): void {
    this.floatTween?.stop();
    this.floatTween = undefined;
    this.scene?.tweens.killTweensOf(this);
    super.destroy(fromScene);
  }

  private tryCollect(): void {
    if (this.collecting || !this.active) {
      return;
    }
    this.collecting = true;
    this.floatTween?.stop();
    this.disableInteractive();

    const half = EGG_COLLECT_DURATION_MS / 2;
    this.scene.tweens.add({
      targets: this,
      scaleX: 1.5,
      scaleY: 1.5,
      duration: half,
      ease: "Quad.easeOut",
      onComplete: () => {
        this.scene.tweens.add({
          targets: this,
          scaleX: 0,
          scaleY: 0,
          duration: half,
          ease: "Quad.easeIn",
          onComplete: () => {
            this.scene.events.emit("egg-collected");
            this.destroy();
          },
        });
      },
    });
  }
}
