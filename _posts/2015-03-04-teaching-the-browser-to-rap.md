---
title: Teaching the Browser to Rap
description: If you know the timings of words in rap songs, the Speech Synthesis API (only supported in Chrome and Safari) can say words at derived speeds at calculated times to sound like it’s rapping.
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

## ;tldr

If you know the timings of words in rap songs, the Speech Synthesis API (only supported in Chrome and Safari) can say words at derived speeds at calculated times to sound like it’s rapping.

[Demo](http://davidchang.github.io/html5-rap-synthesis/#/-JjYb7jLwlD4YjZJPZK3) including recordings of Lose Yourself, The Fresh Prince of Bel-Air, and La Biblioteca

[Code](https://github.com/davidchang/html5-rap-synthesis) on Github

## Real Writeup

I’ve had this idea for just short of a year and just now implemented it :/ I originally came up with the idea for a CascadiaJS [talk proposal](https://github.com/cascadiajs/2014.cascadiajs.com/pull/140). I wanted to show a browser rapping. Since there’s a Speech Recognition API as well, I thought maybe, given the lyrics, I could get the browser to listen to a song, figure out the timings, then repeat it back. But the recognition API isn’t that good; I didn’t want to do some sort of programmatic analysis, so I just picked a manual method.

I used the Youtube API to play songs. Users could push keys on their keyboard when each word was said.

Once I had timing data, I could guess at how long each word should take; I could have the browser say the word at a default speed of 1, then estimate the real speed to get the desired duration.

I then wrote a sort of event loop that would actually figure out when each word should be said and say it.

## Some Setbacks

It took me a bit of time to realize that there is a small bit of time between invoking speechSynthesis.speak and the onstart event when the browser actually starts speaking. This averages out to about 30 milliseconds on my computer, but if it’s your first time saying something, it could be more than 2 seconds. So everything’s offset by 30 ms.

I also just had to artificially inflate all of the speeds. If a word should theoretically be said at speed x, I multiplied it by 2.25. Without it, words always ended up taking longer than they should have (based on earlier calibration).

I needed to use performance.now() instead of youtubePlayer.getCurrentTime(), because youtubePlayer.getCurrentTime doesn’t provide sufficient precision. But for this reason, the whole process is rigid - there’s no pausing or jumping to a certain part of the song.

And probably the worst setback is that my event loop interval was running on a fixed 100 milliseconds. That set me back like months. The stupid simple fix was running my interval on a random number between 10 and 20, and then everything worked fine.

It also helped to realize that Youtube supports songs being played at different speeds, like 0.5 (it also typically supports 0.25, but it’ll drop the audio at that speed). Before I realized that, manually triggering lyric timings was pretty hard.

When I first started, I was using React with my own Flux boilerplate and my own implementation of a router. It was terrible. I pulled in react-router and Reflux and was very happy with both of them. I also published songs to Firebase, which is delightful as always. And I wrote in ES6 and built with Webpack.

## Closing

Speech Synthesis is cool. Thanks for reading. Feedback/comments are more than welcome.