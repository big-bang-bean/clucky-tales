import * as Phaser from "phaser";
import { GAME_HEIGHT, GAME_WIDTH } from "@/game/config/constants";
import { BootScene } from "@/game/scenes/BootScene";
import { YardScene } from "@/game/scenes/YardScene";

export function createGameConfig(parent: HTMLElement | string): Phaser.Types.Core.GameConfig {
  return {
    type: Phaser.AUTO,
    parent,
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    backgroundColor: "#7EC850",
    // Avoid Web Audio `AudioContext` at boot (blocked by autoplay policy → console noise).
    // HTML5 Audio still works for loaded SFX/music; switch to Web Audio + `sound.unlock()` on first tap if needed.
    audio: {
      disableWebAudio: true,
    },
    banner: false,
    pixelArt: true,
    render: {
      antialias: false,
      roundPixels: true,
    },
    physics: {
      default: "arcade",
      arcade: {
        gravity: { x: 0, y: 0 },
        debug: false,
      },
    },
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    scene: [BootScene, YardScene],
  };
}
