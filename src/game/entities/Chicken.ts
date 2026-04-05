import * as Phaser from "phaser";
import {
  CHICKEN_BOB_AMPLITUDE,
  CHICKEN_BOB_PHASE_SPEED,
  CHICKEN_DIRECTION_CHANGE_INTERVAL,
  CHICKEN_IDLE_PROBABILITY,
  CHICKEN_SPEED,
  EGG_APPEAR_TWEEN_MS,
  EGG_SPAWN_INTERVAL,
} from "@/game/config/constants";
import { Egg } from "@/game/entities/Egg";

type WalkState = "IDLE" | "WALKING";

/**
 * Simple wandering chicken that lays eggs on a timer.
 */
export class Chicken extends Phaser.Physics.Arcade.Sprite {
  private walkState: WalkState = "IDLE";
  private directionTimer = 0;
  private eggTimer = 0;
  private eggGroup: Phaser.Physics.Arcade.Group;
  private bobPhase = 0;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    eggGroup: Phaser.Physics.Arcade.Group,
  ) {
    super(scene, x, y, "chicken");
    this.eggGroup = eggGroup;
    scene.add.existing(this);
    scene.physics.add.existing(this);

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setCollideWorldBounds(true);
    body.setDrag(0);

    this.setDepth(10);

    scene.events.on(Phaser.Scenes.Events.POST_UPDATE, this.applyBob, this);
  }

  override destroy(fromScene?: boolean): void {
    this.scene.events.off(Phaser.Scenes.Events.POST_UPDATE, this.applyBob, this);
    super.destroy(fromScene);
  }

  preUpdate(time: number, delta: number): void {
    super.preUpdate(time, delta);
    this.directionTimer += delta;
    this.eggTimer += delta;

    if (this.directionTimer >= CHICKEN_DIRECTION_CHANGE_INTERVAL) {
      this.directionTimer = 0;
      this.pickNewDirection();
    }

    if (this.eggTimer >= EGG_SPAWN_INTERVAL) {
      this.eggTimer = 0;
      this.spawnEgg();
    }
  }

  private applyBob(): void {
    const body = this.body as Phaser.Physics.Arcade.Body;
    if (this.walkState === "WALKING") {
      this.bobPhase += this.scene.game.loop.delta * CHICKEN_BOB_PHASE_SPEED;
      const bob = Math.sin(this.bobPhase) * CHICKEN_BOB_AMPLITUDE;
      this.y = body.y + bob;
    } else {
      this.y = body.y;
    }
  }

  private pickNewDirection(): void {
    const body = this.body as Phaser.Physics.Arcade.Body;
    if (Math.random() < CHICKEN_IDLE_PROBABILITY) {
      this.walkState = "IDLE";
      body.setVelocity(0, 0);
      return;
    }
    this.walkState = "WALKING";
    const angle = Math.random() * Math.PI * 2;
    body.setVelocity(
      Math.cos(angle) * CHICKEN_SPEED,
      Math.sin(angle) * CHICKEN_SPEED,
    );
  }

  private spawnEgg(): void {
    const body = this.body as Phaser.Physics.Arcade.Body;
    const egg = new Egg(this.scene, body.x, body.y);
    egg.setScale(0);
    this.eggGroup.add(egg);
    this.scene.tweens.add({
      targets: egg,
      scaleX: 1,
      scaleY: 1,
      duration: EGG_APPEAR_TWEEN_MS,
      ease: "Back.easeOut",
    });
  }
}
