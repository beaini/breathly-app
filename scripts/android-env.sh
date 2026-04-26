#!/usr/bin/env bash

# Source this file before running native Android commands from this repo.
export JAVA_HOME="${JAVA_HOME:-/opt/homebrew/opt/openjdk@17/libexec/openjdk.jdk/Contents/Home}"
export ANDROID_HOME="${ANDROID_HOME:-/opt/homebrew/share/android-commandlinetools}"
export ANDROID_SDK_ROOT="${ANDROID_SDK_ROOT:-$ANDROID_HOME}"
export NODE_ENV="${NODE_ENV:-development}"
export ORG_GRADLE_PROJECT_reactNativeArchitectures="${ORG_GRADLE_PROJECT_reactNativeArchitectures:-arm64-v8a}"

export PATH="$JAVA_HOME/bin:$ANDROID_HOME/emulator:$ANDROID_HOME/platform-tools:$ANDROID_HOME/cmdline-tools/latest/bin:/opt/homebrew/bin:$PATH"
