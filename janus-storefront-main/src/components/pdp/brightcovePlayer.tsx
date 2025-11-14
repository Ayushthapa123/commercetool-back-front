"use client";

import PlayerLoader, { EmbedOptions } from "@brightcove/react-player-loader";

type BrightcovePlayerProps = {
  videoId: string;
  brightcoveID: string;
};

export default function BrightcovePlayer({
  videoId,
  brightcoveID,
}: Readonly<BrightcovePlayerProps>) {
  const embedOptions: EmbedOptions = {
    responsive: true,
  };

  return (
    <PlayerLoader
      accountId={brightcoveID}
      playerId="BkhQKcpdM"
      videoId={videoId}
      embedType="in-page"
      embedOptions={embedOptions}
    />
  );
}
