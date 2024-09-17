---
title: Words Behind Me
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

tl;dr I recently launched a new iOS app called Words Behind Me (landing page: [http://words-app.davidandsuzi.com/](http://words-app.davidandsuzi.com/), iOS app store: [https://apps.apple.com/us/app/words-behind-me/id6553972754](https://apps.apple.com/us/app/words-behind-me/id6553972754))

Longer:

I’ve officially passed a year of unemployment! I was looking for a side project, and an idea I’ve had in my head for a while has been “how can I inject text into the background of an image or video?” I know you can do this in Photoshop, but Photoshop requires an Adobe Creative Cloud subscription and has a bit of a learning curve.

I looked on the app store and I could only find one app that did this - it hadn’t been updated in 5 years and it had a bunch of paywalled features, some of them "a la carte" (you'd pay for something and then realize later that you had to pay for another thing). The worst thing about it was that it required using your finger to manually “scrub” the foreground of the picture. You had to tell the tool where to cover up the text.

So I at least thought that I could do this better - at least I could determine the foreground of the image automatically. It wasn’t a million dollar idea, but I could do it better, and the project would, at the very least, be technically interesting to me (I’ve never worked on a photo editor). I also thought it was narrowly defined enough that I'd actually be able to complete it (rather than something more ambitious, which would be difficult or frustrating for me to do right now).

At a high level, here were the things I had to figure out:

- Select the photo (Expo ImagePicker)
- Isolate the foreground from the background (Photoroom API)
- Allow text editing, positioning, color, and font configuration (I'd never done this before)
- Save the edited photo to library (Expo MediaLibrary and FileSystem)

I created the repository on June 4 and launched September 7, so the whole thing took roughly 3 months (and that was mostly spending nights while taking an occasional week or two off). I did a proof of concept of the photo editor in one night, and so comically thought I could finish the app in 2 weeks.

There were some places where I got stuck in the code and it took me some time to figure out how to move forward, but the technical stuff was still way easier for me than everything else like thinking through the product, doing competitive analysis, writing a privacy policy, filling everything out for the app store like app description and screenshots, and thinking about marketing. All of the non-technical stuff took way more time. I put it off as long as I could, but building more features was generally more interesting than actually launching or getting users.

Here is the high level overview of tech I used:

- Expo
  - now the recommended framework for React Native development, I’ve been a happy Expo user for a long time now
  - also Expo Router (for the first time, though it’s sort of just a layer over react-navigation) and TypeScript
- RevenueCat for in-app subscriptions
  - you set up subscriptions/purchases in App Store Connect first and then sync it back to RevenueCat, and then RevenueCat lets you dynamically set up paywalls and A/B test them without additional releases
  - The library is called `react-native-purchases`, and displaying the dynamic paywall is via `react-native-purchases-ui` (the docs weren’t great for that, but there was an example app I referenced)
- Sentry for error reporting
- Mixpanel for analytics
  - I integrated directly with Mixpanel instead of Segment as I did in Boba Life
  - I’m only tracking a few high level events rather than tracking basically everything. In Boba Life, I logged basically everything, and then I had a hard time making sense of any of it
- Photoroom to remove the background from photos (ie isolating the foreground)
  - I checked a few other paid options and this was the cheapest at $20/month. I did have some trouble figuring out how to call it correctly with a file (eventually figured it out by looking at their Slack channel for support). My use case is pretty basic, I think the Photoroom API is capable of doing significantly more interesting things
  - I expect that I’ll eventually look for my own solution to remove backgrounds - I think there may be some open source options out there that you can self host, though it’s unclear how the quality will compare to Photoroom
- I put up a small Node Express server to hit up the Photoroom API. Run on DigitalOcean, set up HTTPS via LetsEncrypt, and accessed via a new subdomain on davidandsuzi.com
- `react-native-canvas` to implement the photo editor
- Gesture handling was done via these handlers on the react-native View component: `onStartShouldSetResponder`, `onResponderMove`, and `onResponderRelease`
- `react-native-keyboard-controller` used to handle interactions involving the keyboard
- `expo-file-system` and `expo-media-library` to save the image to the user’s photo library
  - `FileSystem.writeAsStringAsync` and `MediaLibrary.saveToLibraryAsync` respectively
- Notion to create the landing page
- Linear for work tracking (though I spent the first 30 days with Asana)
- [AppMockUp Studio](https://studio.app-mockup.com/) for generating screenshots for the app store - highly recommend!
- Google Form to solicit feedback, and a Google Doc for a Changelog
- Github Copilot, as an extension in VS Code
- Unsplash for some corgi pics, which make up the bulk of my assets

The biggest problems I ran into were:

- How to implement the photo editor
- How to support different fonts
- What to do when the keyboard is opened (ie how to handle limited screen real estate, which is exposed/exacerbated by really portrait photos)

Things that I learned:

- HTML Canvas
- Working with files (uploading to Photoroom, getting something back, saving something to photo library)
- Gesture handling
- Handling the keyboard

The most satisfying things I did/most excited problems to solve were:

- Snap to center gridlines
- “Scale to fit”
- Noticeable performance problems when changing font size
- Using the app itself to make the app icon

### Implementing the photo editor

My original proof of concept for the photo editor was composed of 4 different layers:

- The original photo
- Text nodes
- The foreground photo
- Barely visible text nodes that could be dragged and dropped

I was really happy with the above solution and the performance seemed really nice! I originally used `react-native-gesture-handler` on the barely visible text nodes to control the underlying text nodes (I couldn’t attach gestures to the ones underneath the foreground photo because they were essentially blocked and couldn’t register anything). Text nodes were wrapped with the React Native Text component, which conveniently had a prop called `adjustsFontSizeToFit` which scales the font to a particular width (which seemed like a primary use case for this app).

I then naively thought that when you wanted to save the picture, I would just re-create the edited photo on a server!? I tried using Jimp for about a day before realizing that I couldn’t easily control font size or other fonts, and that it would be really tough to ensure that the expected photo and the actual downloaded photo matched.

Given that last concern, the most obvious answer was to jump over to using canvas because I could take exactly what the user was looking at and call `canvas.toDataURL()` to get a base 64 string that I could save to a file. Only thing was that I didn’t know how to use canvas! And I was unsure about the performance (though I later found out that was completely unfounded, and performance problems were more the result of unoptimized React components).

After getting this canvas working for a single text node (which was pretty exciting), the next step was getting the full end to end working - integrating with the Expo Image Picker, sending the file to the Photoroom API, and then eventually downloading the image. Sending the file to the Photoroom API honestly took me a long time - I have not done much work actually handling files.

Then I created support for multiple text nodes. And then realized that I could do `measureText` without actually writing the text onto the canvas - this realization paved the way to implementing scale to fit, showing vertical center gridlines, and snapping to those gridlines. There was some fun math involved, more math than I've done in a while.

One hiccup in all of this was trying to figure out how to support different fonts. That’s one thing that the other app on the app store does really well - they have like a hundred fonts to choose from. I was originally fixated on using some Google Fonts and loading them through `expo-font`. That made sense in my original photo editor implementation, where I was just rendering my text nodes via the Text component. But with `react-native-canvas`, I couldn’t figure out how to make that canvas aware of my custom fonts. There was a Github issue several years old for adding that support. I tried forking the library and making my own changes, but I didn’t get anywhere after maybe a week and almost gave up on it. Eventually, I realized that I could make use of Apple system fonts - and fortunately for me, Apple has a whole lot of available [system fonts](https://github.com/react-native-training/react-native-fonts)!

### Perf

One thing I noticed on device (curiously not on the Simulator) was completely terrible performance when using the Font Size slider. If you slid the control, it was visually laggy and you could see the slider slowly work its way back from the old value up to the new value. I thought this was due to the canvas being slow and blocking the thread. But eventually in debugging, I realized that my canvas draw method only took 7-8 milliseconds (comfortably less than the 16ms needed to achieve 60fps).

After scratching my head for an hour or two and rewriting a bunch of methods to make use of `useCallback` (React Forget compiler when?), I realized that the problem was my Controls component (which contains the font size Slider) re-rendering on every new font size value. I just needed to use `React.memo` on that component to ignore changes to font size - I didn’t need to be re-rendering the Slider as it is meant to be an uncontrolled component and only really needs the initial value. So this was a very simple change, but it took me a while to track it down, and it was disproportionately exciting when I could verify that the fix worked. "Buttery smooth" were the exact words that came to mind when I saw the memoization working properly for the first time.

# Next

This was a pretty fun project and served to re-introduce me to the process of starting a new app in Expo (with decent TypeScript support too!) and taking it all the way to release/launch in App Store Connect. I may be making some small tweaks to it here and there, but I'm first gonna clean up some code in Boba Life (my last update pretty much broke everything!) and then maybe work on an e-commerce site for Suzi instead of paying Shopify as much as we are paying them.

I'm sure I'll eventually come back to this and try to run my own foreground isolation API since the current rate to use Photoroom is $20 / month.

But please still try out the app and let me know what you think about it!
