/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ScriptScene {
  sceneNumber: number;
  duration: string; // e.g. "0-3s"
  visualPrompt: string; // B-roll or camera action
  voiceover: string; // spoken script audio
  screenText: string; // caption or text overlay
  pacingTip?: string; // tone delivery hint
}

export interface ScriptResponse {
  title: string;
  topic: string;
  tone: string;
  hookStrength: number; // 1 - 10
  totalDuration: number; // seconds
  estimatedEngagementRate: string; // e.g. "87%"
  targetPlatform: string; // "YouTube Shorts" | "Instagram Reels" | "TikTok"
  loopStrategy: string; // dynamic loop formulation
  viralHookReason: string; // psychological driver
  scenes: ScriptScene[];
}

export interface UserSession {
  user: {
    id: string;
    email: string;
  } | null;
  isMock: boolean;
}
