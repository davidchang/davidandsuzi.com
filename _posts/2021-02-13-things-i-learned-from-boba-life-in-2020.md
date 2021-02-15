---
title: Things I learned from Boba Life in 2020
description: So I've still been working on an app on the side called Boba Life, built using React Native, Expo, ApolloGraphQL, and Postgres. I use AWS and have a DigitalOcean server running the code. It's like Twitter where you can have public/private accounts with followers, but instead of Tweets, people can only post their boba orders. You can search nearby shops on a map and see what other public accounts are drinking.
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

So I've still been working on an app on the side called [Boba Life](http://boba.life), built using React Native, Expo, ApolloGraphQL, and Postgres. I use AWS and have a DigitalOcean server running the code. It's like Twitter where you can have public/private accounts with followers, but instead of Tweets, people can only post their boba orders. You can search nearby shops on a map and see what other public accounts are drinking.

I'm both proud of it and embarrassed of how little progress I made on it over the course of the year - at some point, I calculated that I spent about 20 minutes a day on it (actually, I don't know if I should feel like that's a lot or a little). But it was still a relatively basic CRUD app. So it's out in the App Store, and I get a notification on my phone every few days when someone signs up for the app, but I also can't believe I spent 2 years working on this side project and this is all I have to show for it.

Working on the app, though, has afforded me the chance to learn some things that I wouldn't otherwise learn at work, and this post is to share some of those things that I learned this year.

20 minutes a day can show just how much you can accomplish by doing something small every day, but it also often prevents you from investing in bigger platform or tooling changes that will pay off in the long run. When you're only putting 20 minutes a day into something, I feel like you're much less invested in making infrastructure changes or taking on larger projects - you're just trying to finish a smaller task that you could wrap up nicely in that amount of time.

Tooling matters a lot, and I think my lack of sufficient investment in that area has prevented me from being more productive and having more to show. For example, on the server, I was writing raw SQL queries for 2 years! (And I don't even feel comfortable with the Postgres version of SQL!) I finally realized that I should have been using an ORM this whole time, so I started writing some Sequelize models and everything got immediately easier. I write fewer bugs, am no longer discouraged from touching the server, and iterate faster.

Another opportunity is getting a better database management UI. I'm running an old version of pgAdmin and it's just hard to use. It opens in my browser and I can't figure out how to use the right hotkeys or navigate quickly. I never spent the time learning how to save views or queries, so I end up re-doing that basically anytime I close the window. So that'd be 100% worth the time too, but it's not something I really want to do, so I never do.

Another big win would be properly setting up some GraphQL TypeScript generators to pull down types from my GraphQL server and use them automatically. After writing my code in JS and struggling with a bunch of stupid type errors that have also been responsible for no shortage of runtime bugs, I realize how nice it would be to have a 100% TypeScript codebase.

The one tooling decision I made that was right was in choosing Expo. Expo is the best developer experience I've ever had. The level of their documentation, their CLI tooling, the quality of their blog posts, simplifying the build, upload, and release processes with both iOS and Android (though that may have just recently changed to only be available if you pay), offering Over The Air updates, offering helpful APIs on top of React Native like interfacing with permissions, facilitating very easy version upgrades, local development on a Simulator or your own device, streamlining common flows like authentication, logging, and error reporting - these are all things that I've really enjoyed in using Expo. A long time ago, Expo even made it possible to publish and share native code with anyone else without going through the whole app release process (but then I think Apple shut it down).

I didn't spend enough time learning. That's one big disadvantage of working on this project alone, is that I don't go through any code reviews. I don't even end up reviewing my own code. So I'm sure there are certain ways that I use the React Native APIs that are suboptimal and unnecessarily clumsy, and I just don't know of better ways to do them. I'm sure there are React Native APIs I'm not aware of. But I never really stopped to read the React Native documentation or learn what new features went into React Native (except Fast Refresh, which really is an amazing developer experience).

Getting set up with a production ready Node environment is kinda hard, and I still don't have it down. It's hard to know what's out there or what is considered a best practice. For example, logging! Monitoring! Error reporting! Even modularizing my code wasn't the most straightforward, so there are more than a few files that are hundreds of lines long.

I send some logs to Segment, but also knowing what to do after that is kind of a black box to me (and so I just never set it up past that, and ended up rolling my own stuff to help me understand how someone uses the app).

In terms of design, I've spent my whole career implementing for web, so there are all sorts of UX conventions and patterns in iOS to which I'm oblivious to - and even more so for Android. I've had a hard time knowing how to display things or try to show that something is clickable, or how to handle asynchronous errors (are toasts a thing on native apps?).

Permissions have also been tricky - you might have the permission, or you might need to ask, or you might have already asked and the user said no so you're not allowed to ask anymore. I was fortunate that Expo improved some of their API ergonomics around Permissions, but it's still a pain since you can only ask for a permission once, so if you're trying to test out that path, you have to literally uninstall, then re-install, the app.

Originally, I wanted to have an optimized experience for certain regions. I was going to launch in Seattle first, and then expand to other regions. To do this, I wasted a lot of time trying to use Postgres for geospatial calculations - like saving all of the coordinates of boba shops so that I could tell you specifically how far away you were from any given one. In retrospect, this didn't provide very much value, and it also meant two very different code paths (one for a specific region and another for everything else) that increased the surface area for testing and for the possibility of bugs (and indeed, I eventually uncovered many bugs that I actually never hit because I only tested the case where I'm in Seattle!).

I got to play around with ApolloGraphQL, which was also a very pleasant developer experience. (Also worth noting that I had no need for Redux - though there were a few cases where I used React context, like for storing the logged in user's information, but Apollo was mostly sufficient for anything I needed to do.) From using their APIs, I discovered some patterns/practices in their React hooks that I enjoyed and wanted to bring to my own work at Airbnb. It took me a bit of time too to understand their normalized caching layer and how to modify it manually. It also took me a while to learn how to write my GraphQL queries/mutations in such a way that I wouldn't have to modify it manually and would be able to avoid subsequent data requests. In my create or delete post flows, I was literally just refetching everything because I couldn't figure out how to do it (the most major recent version of Apollo handles this pretty elegantly). In my "like post" and "follow user" flows, I also caused myself some headaches by only returning a single Post or User type from the mutation. I could've created a type that had many different members, which could then be used to update all of the affected entities in the in-memory cache, but I just didn't realize it until seeing some code at Airbnb.

So I learned in designing a GraphQL schema that you really want both your inputs and outputs to be shapes or types that you can eventually augment, because they will likely need to flex in the future to support other use cases. If you can only return a type (like a User type) from a mutation, then you may eventually want to add other fields, but find yourself unable to (just like with Follow User: I actually would want to return 2 different Users - the person doing the following and the person being followed).

Mobile is hard because users may end up on really old versions, it's hard to know exactly what they're on or how long it will take them to get your new code. That makes it hard to fix your mistakes and near impossible to deprecate your obsolete APIs. It requires greater testing rigor than I'm really used to as a web developer (I'm used to just expecting that everyone is running my newest code instantaneously, so even if I were to ship with a bug, it's not that big of a deal to fix).

One last thing I learned is that the term "Server Driven UI" or "Config Driven UI" is really powerful, but if you make a mistake, it's really easy to end up with backwards incompatible changes or with APIs that are impossible to deprecate. With both the Explore page and the Notifications table, there are a few different concepts of what can be shown in each, but they all follow the basic structure. In Explore, you have cards that can represent entities, like users, shops, or posts - but they all follow the same structure - these cards feature an image, a heading, a subheading, and a link. Notifications are similar - a notification has an image, text content, and a link. When I originally implemented the Explore and Notification UIs, I didn't do it the way I just described, and it ended up becoming a huge pain. I needed to keep the client in sync with the backend, but it was actually impossible, so I got into a weird state where I could only conditionally send notifications if the user was on the right supported version. It was a mess.

These were the big learnings. It's been fun, and I'm sure I'm still gonna keep working on it off and on, but I'm also realizing that maybe I've done almost as much as I wanted to with this idea. I think I'm paying $18 in AWS bills a month and $6 for the DigitalOcean server, so I guess it truly was a hobby. It was pretty rewarding, though, to get users who immediately started creating content on the platform and even inviting and following their friends, even without me telling anyone about it or doing any marketing or advertising. I even got some users in Australia!