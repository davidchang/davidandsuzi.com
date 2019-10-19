---
title: Something that's my own
description: I published an app. It's my own and I had fun doing it, thinking about it, and talking about it.
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

tl;dr: I published an [app](https://apps.apple.com/us/app/boba-life/id1461674190?ls=1).

---

You can get famous for anything nowadays thanks to the Internet and mechanisms for virality. You can learn anything too with this new wealth of resources. And you can broadcast yourself as a brand, where you're the product you're trying to sell!
I'm sure it's done a lot of good in a lot of ways, which I feel no need to defend. I think it comes at a few costs, though, too (as any change does). Sometimes we are so concerned with capturing a moment that we are unable to experience it fully. And sometimes we are so concerned with publishing or broadcasting something that isn't very good that we can neither share it nor enjoy it (this is a loose quote I actually got some James Freeman, the creator of Blue Bottle Coffee). Can you truly enjoy something if you're not very good at it? I think it's becoming harder and harder to do so.

---

A related thought is the realization that I don't do much creating of my own anymore . In some sense, I create a lot of code for Airbnb. I don't produce a lot of content, like on this blog anymore. I don't post on Facebook or Instagram and I stopped using Twitter (the one place where I did post) 4 months ago. I've simultaneously consumed more Youtube and listened to more podcasts, which is more or less people doing a great deal of planning and scripting to appear like they have real, spontaneous interactions and experiences.

---

Anyways, all of this is ultimately to say that I've been creating an app that I can call my own. It's not a great idea and it's not even well made or great tech. But it's my own and I had fun doing it, thinking about it, and talking about it.

I had the idea for a bubble tea-related social network several years ago and joked that it was my million dollar idea. It would basically just be everything for bubble tea. The Yelp, the Twitter, the Instagram, the Tinder, and the Instacart. It was cool because it was bubble tea, which has a growing following along with a fairly standardized menu, which lends itself to relatively normalized data which could lead to some interesting (and far-fetched) applications (the far-fetched being using drink data to arrange dates over boba, based on flavor "compatibility", which is why Tinder is in the list above).

I finally thought about it for so long (ie multiple years) that I decided I just needed to do it. I messed around in this area right before joining Facebook and getting too busy and promptly rewrote everything once I left Facebook. The idea just feels like something I need to do, just to get it over with, so I could think about other things. I think I was paralyzed by all the stuff I talked about in these first few paragraphs.

I bought the domain boba.life one day because it was super cheap. I hadn't written a real mobile app before - I had tried a while ago when React Native was in its infancy, but the ecosystem and tooling were pretty immature and I had to do a bunch of iOS stuff I wasn't comfortable with. Eventually I chipped away and made progress, and enlisted the help of one of my colleagues, Tiffany, for design help (thanks Tiffany, wow, you did so much more work than I ever thought you would have for me).

Here's a bunch of the stuff I used, some of the wins I enjoyed, and some of the stuff I learned:

- I used Expo with React Native. Expo is an absolute game changer. They're a YCombinator company. They make cross-platform development itself easy and prescriptive in a single codebase, they expose a bunch of device APIs that make common tasks like using the camera or social authentication a lot easier. They have a command line and extensive docs that make running, testing, and publishing your app easy, and then they offer over-the-air updates out of the box so you usually don't have to re-submit your app through the app store for changes to become available.
- I used Apollo client and server so that I could use GraphQL. I was so happy when I got the server running properly and found out how to support derived and nested fields. I was also so happy when I finally started to understand how to leverage/manipulate the Apollo client cache to refetch on command, use optimistic results, and manually update normalized entities.
- I spun up a Postgres database on AWS (yo, this was the first time I ever worked with Postgres or AWS RDS) so that I could do distance-based searches for nearest boba shops using PostGIS. (Midway through, I learned that you should use underscore casing because Postgres doesn't respect camel casing, which led to a bunch of weird GraphQL resolvers.) I also used AWS S3 to store media (the next big win will be figuring out how to save and serve responsive assets properly).
- I set up authentication and did stuff to ensure security (that was more of a win - for the longest time, I was honestly just storing a userID on the device and trusting it on the API, and you had permission to do anything as long as it fit the API contract).
- I implemented what can be called "API driven design" for the app's explore page. So this is where the client makes an API request and says "this is what I know how to render", and the API returns all of the sections and the data to fill in. This is incredibly useful for developing in mobile environments where it's unclear what kind of code the client is running and what it knows to do. It's pretty exhilarating to be able to make client changes from touching the server alone.
- I started with PrismaGraphQL, which let me do a bunch of prototyping early on. It does a ton of scaffolding for you out of the box (it creates and deploys a server and database for you - you just give it a basic schema and it automatically generates CRUD APIs for you). I just couldn't figure out how to do some more complicated queries and joins and it was starting to become a source of a lot of debt, so I later rolled my own GraphQL Node API (the migration took me nearly 3 weeks over a trip back to Oklahoma).
- I integrated with Sentry to get error logging and event tracking. It was pretty cool to be able to be using the app, accidentally invoke a runtime error, then get an email seconds later with the error details.
- I still don't have a great way of organizing my GraphQL queries and fragments. I used to have them all in a single file called queries.js, but I eventually got lazy and started using the same fragments for everything everywhere. I was basically fetching everything for the entire app upfront and the latency was noticeable.
- I eventually realized that my Expo App, when run on the iOS Simulator, could hit a local server instead of my production server. Up until that point, I had been ssh-ing to my server and updating code every time I needed to see a change (really slow process). So now I hit my local server and use nodemon to restart the server on changes.
- I didn't use Redux. React Context API was enough for some very small local state, and Apollo was enough for data fetching. I wrote some HOCs when they made sense and got to try out React hooks (I was waiting on Expo to support them for a little bit of time). So… modern React things. I'm not ready for Suspense though..
- I integrated with the Yelp API (they also have a GraphQL API which I called into from my own GraphQL API, since theirs isn't accessible from the client) to pull nearby shops based on latitude/longitude coordinates.
- I figured out the app store and TestFlight and onboarded a handful of test users. That probably shouldn't have been such a win, but I actually wasted considerable time figuring that out. Expo documentation did help a bit, but once you have your .ipa file, you're still a bit on your own to figure out how to get it through to the app store.

---

I originally wrote all of the above two months ago and finally made time to polish and publish it. In the time since, I finally managed to launch the app (there was a little bit of back and forth regarding establishing terms of service and safety related to user generated content - who knew, but if you have user generated content, you need to provide functionality around reporting content and blocking other users).

Here's the app if you're interested: [https://apps.apple.com/us/app/boba-life/id1461674190?ls=1](https://apps.apple.com/us/app/boba-life/id1461674190?ls=1)

I am still cleaning up a bunch of bugs/oddities. But I wanted to get it out in hopes that I could understand some usage patterns and optimize it. Besides some friends I told who subsequently downloaded the app, it's amazing to me to see complete strangers find and download the app and even like my posts. Who knows if this will become anything, but it's been a fun process. Gonna be back in Oklahoma for a week and a half soon and been thinking about putting up some goals around bug fixes, feature implementation, and promotion (like ProductHunt/HackerNews, that sort of thing).
