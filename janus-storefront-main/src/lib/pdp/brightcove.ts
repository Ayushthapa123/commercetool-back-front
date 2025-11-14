"use server";

import { logger } from "@/lib/logger";
import axios, { AxiosRequestConfig } from "axios";

type Source = {
  avg_bitrate?: number;
  codec?: string;
  codecs?: string[];
  container?: string;
  duration?: number;
  height?: number;
  size?: number;
  ext_x_version?: string;
  src: string;
  type?: string;
  width?: number;
};

type TextTrack = {
  id: string | null;
  account_id: string;
  src: string;
  srclang: string | null;
  label: string;
  kind: string;
  mime_type: string;
  asset_id: string | null;
  sources: string | null;
  default: boolean;
  width: number;
  height: number;
  bandwidth: number;
};

type VideoData = {
  poster: string;
  thumbnail: string;
  poster_sources: Source[];
  thumbnail_sources: Source[];
  description: string | null;
  tags: string[];
  cue_points: string[];
  custom_fields: unknown;
  account_id: string;
  sources: Source[];
  video_preview: Source[];
  name: string;
  reference_id: string;
  long_description: string | null;
  duration: number;
  economics: string;
  text_tracks: TextTrack[];
  published_at: string;
  created_at: string;
  updated_at: string;
  offline_enabled: boolean;
  link: string | null;
  id: string;
  ad_keys: string | null;
};

export async function getVideoById(
  videoId: string,
): Promise<VideoData | undefined> {
  try {
    const { BRIGHTCOVE_ACCOUNT_ID: brightcoveID } = process.env;
    const baseUrl = "https://edge.api.brightcove.com/playback/v1/accounts";
    const policyKey =
      "BCpkADawqM3W0p-2TU4Z5MoOWbHU0j6jlfRx--jUQ7Wt7N5XqyCowMoVLGFibhFWVJ__8_849IigeMgLnMLAx5x4HQhlu4N5hbHf1SDvYid6ud9J1jqDyy0AQK8";

    const options: AxiosRequestConfig = {
      method: "GET",
      url: `${baseUrl}/${brightcoveID}/videos/${videoId}`,
      headers: {
        Accept: `application/json;pk=${policyKey}`,
      },
    };

    const { data } = await axios.request<VideoData>(options);
    return data;
  } catch (error) {
    logger.error(error);
  }
}
