import {
  createAudioPlayer,
  setAudioModeAsync,
  type AudioPlayer,
  type AudioSource,
} from "expo-audio";
import { sounds } from "@breathly/assets/sounds";
import { GuidedBreathingMode } from "@breathly/types/guided-breathing-mode";

const audioModePromise = setAudioModeAsync({ playsInSilentMode: true });

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
let audioSetupPromise: Promise<void> | undefined;

function createPlayer(source: AudioSource | null) {
  if (source == null) return undefined;
  return createAudioPlayer(source, { keepAudioSessionActive: true });
}

async function playFromStart(sound: AudioPlayer) {
  try {
    await sound.seekTo(0);
  } catch {
    // Playback can still start if the player is not ready to seek yet.
  }
  sound.play();
}

export async function setupGuidedBreathingAudio(guidedBreathingMode: GuidedBreathingMode) {
  audioSetupPromise = (async () => {
    await audioModePromise;
    endingBellSound = createPlayer(sounds.endingBell);
    currentGuidedBreathingSounds = {
      breatheIn: createPlayer(guidedBreathingAudioAssets[guidedBreathingMode].breatheIn),
      breatheOut: createPlayer(guidedBreathingAudioAssets[guidedBreathingMode].breatheOut),
      hold: createPlayer(guidedBreathingAudioAssets[guidedBreathingMode].hold),
    };
  })();

  return audioSetupPromise;
}

export const releaseGuidedBreathingAudio = async () => {
  await audioSetupPromise;
  endingBellSound?.remove();
  currentGuidedBreathingSounds?.breatheIn?.remove();
  currentGuidedBreathingSounds?.breatheOut?.remove();
  currentGuidedBreathingSounds?.hold?.remove();
  endingBellSound = undefined;
  currentGuidedBreathingSounds = undefined;
  audioSetupPromise = undefined;
};

export const playGuidedBreathingSound = async (guidedBreathingStep: GuidedBreathingStep) => {
  await audioSetupPromise;
  const sound = currentGuidedBreathingSounds?.[guidedBreathingStep];
  if (!sound) return;
  await playFromStart(sound);
};

export const playEndingBellSound = async () => {
  await audioSetupPromise;
  if (!endingBellSound) return;
  await playFromStart(endingBellSound);
};
