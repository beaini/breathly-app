import {
  createAudioPlayer,
  preload,
  setAudioModeAsync,
  type AudioPlayer,
  type AudioSource,
} from "expo-audio";
import { sounds } from "@breathly/assets/sounds";
import { GuidedBreathingMode } from "@breathly/types/guided-breathing-mode";

(async function () {
  setAudioModeAsync({ playsInSilentMode: true });
})();

export type GuidedBreathingStep = "breatheIn" | "breatheOut" | "hold";

type GuidedBreathingAudioSounds = {
  [key in GuidedBreathingMode]: {
    [key in GuidedBreathingStep]: AudioSource | null;
  };
};

const guidedBreathingAudioAssets: GuidedBreathingAudioSounds = {
  laura: {
    breatheIn: sounds.lauraBreatheIn,
    breatheOut: sounds.lauraBreatheOut,
    hold: sounds.lauraHold,
  },
  paul: {
    breatheIn: sounds.paulBreatheIn,
    breatheOut: sounds.paulBreatheOut,
    hold: sounds.paulHold,
  },
  bell: {
    breatheIn: sounds.cueBell1,
    breatheOut: sounds.cueBell1,
    hold: sounds.cueBell2,
  },
  disabled: {
    breatheIn: null,
    breatheOut: null,
    hold: null,
  },
};

type CurrentGuidedBreathingSounds = {
  [key in GuidedBreathingStep]?: AudioPlayer;
};

let currentGuidedBreathingSounds: CurrentGuidedBreathingSounds | undefined;
let endingBellSound: AudioPlayer | undefined;

async function createPreloadedPlayer(source: AudioSource | null) {
  if (source == null) return undefined;
  await preload(source);
  return createAudioPlayer(source, { keepAudioSessionActive: true });
}

export async function setupGuidedBreathingAudio(guidedBreathingMode: GuidedBreathingMode) {
  const [endingBell, breatheIn, breatheOut, hold] = await Promise.all([
    createPreloadedPlayer(sounds.endingBell),
    createPreloadedPlayer(guidedBreathingAudioAssets[guidedBreathingMode].breatheIn),
    createPreloadedPlayer(guidedBreathingAudioAssets[guidedBreathingMode].breatheOut),
    createPreloadedPlayer(guidedBreathingAudioAssets[guidedBreathingMode].hold),
  ]);
  endingBellSound = endingBell;
  currentGuidedBreathingSounds = {
    breatheIn,
    breatheOut,
    hold,
  };
}

export const releaseGuidedBreathingAudio = async () => {
  endingBellSound?.remove();
  currentGuidedBreathingSounds?.breatheIn?.remove();
  currentGuidedBreathingSounds?.breatheOut?.remove();
  currentGuidedBreathingSounds?.hold?.remove();
  endingBellSound = undefined;
  currentGuidedBreathingSounds = undefined;
};

export const playGuidedBreathingSound = async (guidedBreathingStep: GuidedBreathingStep) => {
  const sound = currentGuidedBreathingSounds?.[guidedBreathingStep];
  if (!sound) return;
  await sound.seekTo(0);
  sound.play();
};

export const playEndingBellSound = async () => {
  if (!endingBellSound) return;
  await endingBellSound.seekTo(0);
  endingBellSound.play();
};
