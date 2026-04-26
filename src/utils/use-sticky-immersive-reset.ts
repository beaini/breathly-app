// See:
// https://github.com/expo/fyi/blob/main/android-navigation-bar-visible-deprecated.md
import * as NavigationBar from "expo-navigation-bar";
import { setStatusBarHidden, setStatusBarTranslucent } from "expo-status-bar";
import ms from "ms";
import { useEffect } from "react";
import { Platform } from "react-native";

export function initializeImmersiveMode() {
  if (Platform.OS === "ios") return;
  NavigationBar.setVisibilityAsync("hidden");
  setStatusBarHidden(true, "none");
  setStatusBarTranslucent(true);
}

// Hide the navigation bar after a certain duration
const HIDE_NAVIGATION_BAR_AFTER_MS = ms("3 sec");

export function useStickyImmersiveReset() {
  const visibility = NavigationBar.useVisibility();

  useEffect(() => {
    if (Platform.OS === "ios") return;
    if (visibility === "visible") {
      const interval = setTimeout(() => {
        NavigationBar.setVisibilityAsync("hidden");
        setStatusBarHidden(true, "none");
      }, HIDE_NAVIGATION_BAR_AFTER_MS);

      return () => {
        clearTimeout(interval);
      };
    }
  }, [visibility]);
}
