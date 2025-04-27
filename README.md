This is a new [**React Native**](https://reactnative.dev) project, bootstrapped using [`@react-native-community/cli`](https://github.com/react-native-community/cli).

# Getting Started
MYSENSORAPP:

Objective
Develop a mobile application that uses the phone’s built-in sensors to track and display user activity and environmental data.

Features and Requirements
1. Activity Tracking
    • Use the accelerometer and gyroscope to detect and track the user’s activity (e.g., walking, running, stationary).
    • Display the activity type (e.g., “Walking”) and duration in real-time.

2. Medicine reminder
    • log medicine with time
    • alert user with notification offline if app is killed before 15 min

3. Location-Based Features
    • Use GPS to track the user’s location and plot their path on a map.
    • Calculate the total distance traveled during the session.

4. Dashboard
    • Create a dashboard to display:
    • Current activity type and duration.
    • Total distance traveled.
    • Ambient light level and atmospheric pressure.

5. Data Logging
    • Log the data (activity, light level, pressure, and location) locally using SQLite or AsyncStorage.
    • Display a history screen where users can view previous sessions.

6. Native Android Integration
    • Implement a native Android feature (e.g., background service) to continue activity tracking even when the app is minimized.
    • manage medicine reminder

7. Optional (Bonus)
    • Implement real-time data visualization using charts (e.g., D3.js or React Native charts).
    • Allow users to export the session data as a CSV file.

Technical Specifications
1. Sensors to Use:
    • Accelerometer
    • Gyroscope
    • Light sensor
    • Barometer (optional, depending on device availability)
    • GPS

2. Development Tools:
    • React Native for cross-platform development.
    • Native Android integration using Kotlin for sensor data in the background.

3. Design:
      • Follow Material Design principles for a clean and intuitive UI.



> **Note**: Make sure you have completed the [Set Up Your Environment](https://reactnative.dev/docs/set-up-your-environment) guide before proceeding.

## Step 1: Start Metro

First, you will need to run **Metro**, the JavaScript build tool for React Native.

To start the Metro dev server, run the following command from the root of your React Native project:

```sh
# Using npm
npm start

# OR using Yarn
yarn start
```

## Step 2: Build and run your app

With Metro running, open a new terminal window/pane from the root of your React Native project, and use one of the following commands to build and run your Android or iOS app:

### Android

```sh
# Using npm
npm run android

# OR using Yarn
yarn android
```

### iOS

For iOS, remember to install CocoaPods dependencies (this only needs to be run on first clone or after updating native deps).

The first time you create a new project, run the Ruby bundler to install CocoaPods itself:

```sh
bundle install
```

Then, and every time you update your native dependencies, run:

```sh
bundle exec pod install
```

For more information, please visit [CocoaPods Getting Started guide](https://guides.cocoapods.org/using/getting-started.html).

```sh
# Using npm
npm run ios

# OR using Yarn
yarn ios
```

If everything is set up correctly, you should see your new app running in the Android Emulator, iOS Simulator, or your connected device.

This is one way to run your app — you can also build it directly from Android Studio or Xcode.

## Step 3: Modify your app

Now that you have successfully run the app, let's make changes!

Open `App.tsx` in your text editor of choice and make some changes. When you save, your app will automatically update and reflect these changes — this is powered by [Fast Refresh](https://reactnative.dev/docs/fast-refresh).

When you want to forcefully reload, for example to reset the state of your app, you can perform a full reload:

- **Android**: Press the <kbd>R</kbd> key twice or select **"Reload"** from the **Dev Menu**, accessed via <kbd>Ctrl</kbd> + <kbd>M</kbd> (Windows/Linux) or <kbd>Cmd ⌘</kbd> + <kbd>M</kbd> (macOS).
- **iOS**: Press <kbd>R</kbd> in iOS Simulator.

## Congratulations! :tada:

You've successfully run and modified your React Native App. :partying_face:

### Now what?

- If you want to add this new React Native code to an existing application, check out the [Integration guide](https://reactnative.dev/docs/integration-with-existing-apps).
- If you're curious to learn more about React Native, check out the [docs](https://reactnative.dev/docs/getting-started).

# Troubleshooting

If you're having issues getting the above steps to work, see the [Troubleshooting](https://reactnative.dev/docs/troubleshooting) page.

# Learn More

To learn more about React Native, take a look at the following resources:

- [React Native Website](https://reactnative.dev) - learn more about React Native.
- [Getting Started](https://reactnative.dev/docs/environment-setup) - an **overview** of React Native and how setup your environment.
- [Learn the Basics](https://reactnative.dev/docs/getting-started) - a **guided tour** of the React Native **basics**.
- [Blog](https://reactnative.dev/blog) - read the latest official React Native **Blog** posts.
- [`@facebook/react-native`](https://github.com/facebook/react-native) - the Open Source; GitHub **repository** for React Native.
