---
title: Things I do when working with React Native
description:
tags:
  - david
  - code
meta:
  _edit_last: "1"
status: publish
layout: post
type: post
published: true
category: David
---

- This [article](https://expo.dev/blog/from-web-to-native-with-react) from the Expo blog does a great job of capturing what web developers would need to know to transfer their skills to React Native
- If you’re having problems with the `StatusBar` showing up (that is, the time, battery, network signal, etc on the top of your phone) (I don’t know why, but I run into this problem on every app I’ve tried), this solution worked for me: [github issue link](https://github.com/expo/router/issues/754#issuecomment-2220037302)
- Sometimes you’ll have a device with notches and sometimes you won’t, and you may or may not want your screen going all the way into the notch. You’ll have to use `SafeAreaView` and `useSafeAreaInsets` from `react-native-safe-area-context` to tweak things along the edges, and you’ll have to just test on multiple devices
- For using the keyboard, instead of only using the [Keyboard](https://reactnative.dev/docs/keyboard) and [KeyboardAvoidingView](https://reactnative.dev/docs/keyboardavoidingview) modules from react-native, I used [react-native-keyboard-controller](https://kirillzyusko.github.io/react-native-keyboard-controller/) and found this [video](https://www.youtube.com/watch?v=Y51mDfAhd4E) to be really helpful
- This lib also looks really helpful (I would've used it for the Boba Life map view if I had known about it): [react-native-bottom-sheet](https://github.com/gorhom/react-native-bottom-sheet)
- Account deletion and account reporting (as required by iOS if you’ve got social features), as well as Support, can just be “email us” - you don’t have to build an automatic solution yourself
- Solicit feedback via Google form
- Solicit feedback via `expo-quick-actions` (which shows up when a user is about to delete your app), per this [expo blog post](https://expo.dev/blog/expo-quick-actions)
- If you’ve already requested a permission and it’s been denied, you won’t be able to ask again. But you can send the user to the Settings page for your respective app to flip it themselves by using `Linking.openSettings();`
- Wrap your code in an [ErrorBoundary](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary) and have a Restart button that could also fetch `expo-updates` - something like in this [gist link](https://gist.github.com/davidchang/70bc0a4d185522a9f62edcb158ee1a8f)
- Use Sentry for errors
- Mixpanel for analytics, but log important, specific events, rather than really generic things like every page view or button press
- Use Unsplash for creative assets
- You can create development builds and run them on the Device simulator on your computer
- If you’re at home, you could run a development build on your phone that is able to hit the server running on your computer. Just have it hit [your computer’s IP address](https://stackoverflow.com/questions/47417766/calling-locally-hosted-server-from-expo-app/47418058#47418058)
- Screenshots for the app store can be generated using [https://studio.app-mockup.com/](https://studio.app-mockup.com/) - you’ll have to load a Template first (not loading template will just crash the single page app, but it’s actually a great app). Progress isn’t saved automatically so you may want to explicitly save your work. You can download all your assets without having to sign up for anything or give your email away
