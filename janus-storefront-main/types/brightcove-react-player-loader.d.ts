declare module "@brightcove/react-player-loader" {
  import * as React from "react";

  type EmbedType = "in-page" | "iframe";

  type LegacyPlaylistEmbed = {
    legacy: boolean;
  };

  type ResponsiveEmbed = {
    aspectRatio?: string;
    iframeHorizontalPlaylist?: boolean;
    maxWidth?: string;
  };

  export type EmbedOptions = {
    pip?: boolean;
    playlist?: boolean | LegacyPlaylistEmbed;
    responsive?: boolean | ResponsiveEmbed;
  };

  export type Success = {
    type: EmbedType;
    ref: Player;
  };

  export type Player = {
    ready: (callback: () => void) => void;
    on: (event: string, callback: () => void) => void;
    reset: () => void;
    mediainfo?: {
      name?: string;
      duration?: number;
      thumbnail?: string;
    };
  };

  type PlayerLoaderProps = {
    accountId: string;
    playerId: string;
    videoId: string;
    embedType?: EmbedType;
    embedOptions?: EmbedOptions;
    attrs?: Record<string, string>;
    onSuccess?: (success: Success) => void;
  };

  const PlayerLoader: React.FC<PlayerLoaderProps>;

  export default PlayerLoader;
}
