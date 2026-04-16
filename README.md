# Rewire: Privacy-First Habit Control 🧠⚡

Rewire is a hardcore, privacy-focused application designed to help you regain control over compulsive habits through science-backed behavioral interventions. Built with **React Native (Expo)** and **SQLite**, it ensures all your deeply personal data remains strictly on your device.

## ✨ Core Features

### 1. Hardcore Intervention Suite
- **Rescue Mode**: A 120-second physiological grounding session featuring rhythmic breathing exercises and physical activity deflections to help you survive intense urges.
- **Emergency Lock**: An aggressive focus mode that locks the app interface. If you leave while locked, Rewire initiates high-priority alerts to pull you back into focus.

### 2. Behavioral Awareness
- **5-Hour Check-Ins**: Periodic prompts requiring a MANDATORY 100-word reflection to foster high self-awareness and intentionality.
- **Forensic Relapse Analysis**: A guided introspection questionnaire that deconstructs "resets" to identify triggers, thought patterns, and prevention strategies.

### 3. Progressive Analytics
- **Live Streak Tracking**: Highly accurate real-time timers with cross-lifecycle synchronization.
- **Risk Pattern Prediction**: Analyzes your data to predict high-risk "vulnerability windows" and alert you before the urge hits.
- **Trigger Distribution**: Visual breakdown of your most common triggers (Stress, Boredom, etc.) mapped through elegant SVG charts.

## 🛠️ Technology Stack
- **Framework**: React Native (Expo SDK 52+)
- **Storage**: SQLite via `expo-sqlite` (Offline-First)
- **State**: Zustand (Atomic & Synchronous)
- **Animations**: React Native Reanimated 3
- **Navigation**: Expo Router (File-based)
- **Charts**: Victory Native

## 🚀 Getting Started

### Prerequisites
- [Bun](https://bun.sh) (Recommended) or Node.js
- Expo Go (for physical device testing) or Android Emulator/iOS Simulator

### Setup
1. **Clone and Install**
   ```bash
   git clone <repo-url>
   cd rewire
   bun install
   ```

2. **Start Development Server**
   ```bash
   bun dev
   ```

3. **Open the App**
   - Press `a` for Android Emulator
   - Press `i` for iOS Simulator
   - Scan the QR code with **Expo Go** on your device.

## 🔒 Privacy & Data
- **Zero Cloud**: Rewire has no backend. 100% of your data is stored in a local SQLite file.
- **Encryption**: Data remains on-device and is never shared or sold.

---
*Built with discipline for the disciplined.*
