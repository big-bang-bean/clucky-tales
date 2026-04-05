"use client";

import dynamic from "next/dynamic";

const Game = dynamic(() => import("@/game/GameComponent"), { ssr: false });

export default function GameClient() {
  return <Game />;
}
