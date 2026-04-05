import * as Phaser from "phaser";
import { TILE_SIZE } from "@/game/config/constants";

/**
 * Generates placeholder textures and hands off to YardScene.
 */
export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: "BootScene" });
  }

  create(): void {
    this.createChickenTexture();
    this.createEggTexture();
    this.createGrassTextures();
    this.scene.start("YardScene");
  }

  private createChickenTexture(): void {
    const g = this.add.graphics();
    const cx = 16;
    const cy = 16;
    g.fillStyle(0xff8833, 1);
    g.fillCircle(cx, cy, 12);
    // Eyes
    g.fillStyle(0x222222, 1);
    g.fillCircle(cx - 4, cy - 3, 2);
    g.fillCircle(cx + 4, cy - 3, 2);
    // Beak
    g.fillStyle(0xdd2222, 1);
    g.fillTriangle(cx - 4, cy + 2, cx + 4, cy + 2, cx, cy + 8);
    g.generateTexture("chicken", TILE_SIZE, TILE_SIZE);
    g.destroy();
  }

  private createEggTexture(): void {
    const g = this.add.graphics();
    g.fillStyle(0xf5f5f5, 1);
    g.fillEllipse(8, 8, 12, 14);
    g.generateTexture("egg", TILE_SIZE / 2, TILE_SIZE / 2);
    g.destroy();
  }

  private createGrassTextures(): void {
    const g1 = this.add.graphics();
    g1.fillStyle(0x7ec850, 1);
    g1.fillRect(0, 0, TILE_SIZE, TILE_SIZE);
    g1.generateTexture("grass1", TILE_SIZE, TILE_SIZE);
    g1.destroy();

    const g2 = this.add.graphics();
    g2.fillStyle(0x6db840, 1);
    g2.fillRect(0, 0, TILE_SIZE, TILE_SIZE);
    g2.generateTexture("grass2", TILE_SIZE, TILE_SIZE);
    g2.destroy();

    const g3 = this.add.graphics();
    g3.fillStyle(0x6db840, 1);
    g3.fillRect(0, 0, TILE_SIZE, TILE_SIZE);
    g3.fillStyle(0xff88aa, 1);
    g3.fillCircle(10, 10, 3);
    g3.fillStyle(0xffff88, 1);
    g3.fillCircle(10, 10, 1);
    g3.generateTexture("grass3", TILE_SIZE, TILE_SIZE);
    g3.destroy();
  }
}
