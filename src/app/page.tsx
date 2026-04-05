import GameClient from "@/app/GameClient";
import { GAME_HEIGHT, GAME_WIDTH } from "@/game/config/constants";

/** Matches Phaser game size so Scale.FIT does not letterbox with a mismatched aspect (sprite smearing). */
const GAME_ASPECT_STYLE = {
  width: `min(100vw, calc(100dvh * ${GAME_WIDTH} / ${GAME_HEIGHT}))`,
  aspectRatio: `${GAME_WIDTH} / ${GAME_HEIGHT}`,
} as const;

export default function Home() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black">
      <div className="mx-auto" style={GAME_ASPECT_STYLE}>
        <GameClient />
      </div>
    </div>
  );
}
