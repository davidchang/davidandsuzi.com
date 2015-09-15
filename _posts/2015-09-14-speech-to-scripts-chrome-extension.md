---
title: Speech to Scripts Chrome Extension
description: The Chrome extension utilizes the speech recognition API and matches regular expressions with arbitrary scripts that you specify on the options page. jQuery gets loaded into the execution context, as well as captured parameters from the regular expression, then your functions are eval-ed with the captured parameters injected into the closure. I’ve seen a few other speech recognition Chrome extensions that come with preconfigured actions that can be triggered by your voice, but I haven’t seen any that allow you to configure arbitrary scripts.
tags:
- david
meta:
  _edit_last: "1"
status: publish
layout: post
type: post
published: true
category: David
---

I wrote a Chrome extension. I feel good about it, but also pretty bad, because looking at my git log, I actually started on this a year ago. I picked it back up a few weeks ago when Suzi and I were traveling back to Oklahoma and rewrote it using Redux and the latest version of React.

Demo: [https://www.youtube.com/watch?v=P_c5yJxEyqI](https://www.youtube.com/watch?v=P_c5yJxEyqI)

Code: [https://github.com/davidchang/speech-to-scripts](https://github.com/davidchang/speech-to-scripts)

The Chrome extension utilizes the speech recognition API and matches regular expressions with arbitrary scripts that you specify on the options page. jQuery gets loaded into the execution context, as well as captured parameters from the regular expression, then your functions are eval-ed with the captured parameters injected into the closure. I’ve seen a few other speech recognition Chrome extensions that come with preconfigured actions that can be triggered by your voice, but I haven’t seen any that allow you to configure arbitrary scripts.

react-ace is used for the code editor when you’re putting in your scripts (so you get some familiar indentation and parentheses matching), but was a little difficult because elements of it are both controlled and uncontrolled at the same time, so some changes wouldn’t propagate back up correctly and then end up overriding other changes. I eventually had to implement a shouldComponentUpdate that was always false (except for the moment when you removed a command, or reverted to defaults), while letting a stream of changes propagate up through Redux action creators.

I thought the Chrome extension environment would be a lot of domain specific APIs, but it actually wasn’t a very bad experience at all.

Redux is enjoyable and easy to track how changes happen in the application while mostly staying out of the way. Only passing data down from a single point avoids having state management boilerplate scattered throughout your app (and adding new properties into reducer state means they’re probably already going to be propagated down and you can just start consuming it where you need it).

I think it’s pretty sufficient as a platform for other people to take it where they want, if they want. The code is on [Github](https://github.com/davidchang/speech-to-scripts) with instructions, feel free to pull it down and use/hack it.