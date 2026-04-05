"use client";

import { createGameConfig } from "@/game/config/gameConfig";
import { initGameI18n } from "@/i18n/gameI18n";
import * as Phaser from "phaser";
import { useEffect, useRef } from "react";

export default function GameComponent() {
  const gameRef = useRef<Phaser.Game | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const parent = containerRef.current;
    if (!parent) {
      return;
    }

    initGameI18n();
    const config = createGameConfig(parent);
    const game = new Phaser.Game(config);
    gameRef.current = game;

    const refreshScale = (): void => {
      game.scale.refresh();
    };
    window.addEventListener("resize", refreshScale);
    requestAnimationFrame(() => {
      requestAnimationFrame(refreshScale);
    });

    const canvas = game.canvas;
    const onWheel = (e: WheelEvent): void => {
      e.preventDefault();
    };
    canvas.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      window.removeEventListener("resize", refreshScale);
      canvas.removeEventListener("wheel", onWheel);
      game.destroy(true);
      gameRef.current = null;
    };
  }, []);

  return (
    <div
      ref={containerRef}
      id="game-container"
      className="h-full min-h-0 w-full"
    />
  );
}
