---
title: Boba Life 1.1 Release Notes
description: I'm going to aim to create a build every 4 weeks to establish a regular cadence for both myself and hopefully work on my ASO. Thanks for reading, hope you enjoy the app! I've been thrilled to see random people find the app, create accounts, and even post their boba drinks publicly. I haven't stopped getting excited when I see other people actually posting publicly or liking my posts.
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

It's been a long time since a formal Boba Life release! There's some reasons for that - the underlying platform I use to develop the app, Expo, uses React Native, so it's all just JavaScript that can be downloaded from a CDN. So there have been periodic updates and they've just been "over-the-air", meaning you don't actually update the app via the App Store to pick up the updated code (I actually used to have a friend who worked on Codepush, which was Microsoft's own solution for React Native over-the-air updates).

Since the inaugural 1.0 release of the app, there's been quite a few changes and I am finally releasing a new version! (I also bet that frequent, formal app store updates are probably rewarded by Apple's app ranking algorithm - did you know that App Store Optimization, or ASO, is a thing, analogous to Search Engine Optimization?)

Some of those updates:

- Responsive images! This was one thing that seemed to be causing bad network latency in the app. So I'm resizing the image when a post is created, and whenever you use GraphQL to query for an image from the app, you can include height and width dimensions and the server will send you the most appropriate size it has (rather than resizing on the fly, though I saw a few AWS Lambda articles about doing that instead).
- Learned and recognized my need for SafeAreaView.
- Asking for permission to send notifications so that I can send real push notifications for re-engagement (though I wasn't actually sending notifications because I needed to register for that permission in my app build with Apple). Also showing a badge on the tab bar icon to show when you have new notifications.
- Miscellaneous bug/UX fixes! Re-tapping the tab bar icon scrolls back to top when pertinent. Adding location to posts. Changing User and Shop accounts to have a grid view of posts.
- Developed search front and back end.

Technical tidbits:

- Upgraded Expo from v34 to v36. One thing this included was an upgrade to React-Native itself, and so I could use hooks and something new they've been calling "Fast Refresh." It allows significantly significantly faster iterative development! For example, if I was working on the Settings tab in the past, any change I made would have caused a full refresh of the app and I would've had to navigate back to Settings. With Fast Refresh, I typically maintain my place in the app.
- Upgraded to a new major version of react-navigation. This new version was much better and I really enjoyed working with it! It was more declarative (and so it fit React's paradigm a lot more) and it significantly improved my ability to test code. Some other side effects were that it was easier to hide the tab bar (for instance, it should be hidden when the Camera is up, but this wasn't the case in the current app for when you change your profile picture) and it solved some very frustrating log out bug where you log out and just end up staring at a blank page.
- Using Segment for logging, which can hook up into many different "sources" for viewing your data - I've hooked it up to Mixpanel but am just in the exploratory phases.

I'm going to aim to create a build every 4 weeks to establish a regular cadence for both myself and hopefully work on my ASO. Thanks for reading, hope you enjoy the app! I've been thrilled to see random people find the app, create accounts, and even post their boba drinks publicly. I haven't stopped getting excited when I see other people actually posting publicly or liking my posts. And I was pretty intrigued the first time I saw someone use the "Report Post" functionality I needed to implement due to Apple's app store requirements (specifically for apps revolving around user-generated content).
