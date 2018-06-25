---
title: How I'd Start a New Project, June 2018
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

It really depends on what I'm building, but if we're pretending one size fits all, this is what I would do. I expect this will be different in even just a few months (though honestly I don't think it'll be *that* different, as a lot of the libraries/ideologies represented here have been around for a few years).

I'd use `create-react-app` for my client side app. That handles all of the build stuff so I can write modern ECMAScript, get optimized production builds, and have a nice local environment with hot module reloading (plus a bunch of other things like service workers, which I haven't used yet, but it's still cool).

```
yarn global add create-react-app
create-react-app new-project
cd new-project && yarn start
```

Server-side rendering does wonders for perceived latency and is nice for search engines, maybe I'd think about ejecting my create-react-app and trying to fit it into `Next.js` if I needed that perf boost later.

I'd add `react-native-web`, which has a Webpack alias in create-react-app to react-native. I'd do this in anticipation of sharing code across other RN platforms and to be able to use the StyleSheet API, which is a sufficient CSS-in-JS solution. (create-react-app does not ship with a CSS in JS solution, I'm not sure if integrating with other CSS-in-JS libraries requires changes to the build config or not.)

```
yarn add react-native-web
```

I'd use Expo to build React Native Android and iOS versions of the app, because Expo's developer experience and cross-platform abstractions are unparalleled. Things feel and look pretty good out of the box, which is great for me, since I don't want to get stuck designing/styling a bunch of things early on. I wouldn't know how to reuse the code that I was writing for web, but from what I've heard, a very large percentage of the code should be able to be shared without much platform specific logic. I'd try to figure a good way to do this on the fly.

I'd use atomic design to break my UI into smaller composable parts that are more easily managed. Since it's just me, I wouldn't stop to try something like Storybook or Styleguidist (I'm also totally going to neglect anything to do with PropTypes or unit tests). Whenever I neglect atomic design, I typically end up with a bunch of UI inconsistency.

I probably need a few other client side things with React. redux and redux-thunk (though maybe Context API is enough), maybe reselect, react-router, and react-helmet (some of that stuff may be overkill too, I wouldn't bring reselect in until code was mostly complete and I wanted to work on perf specifically).

I'd want to go the GraphQL route, so I'd use Apollo on the front end and follow the steps [here](https://www.apollographql.com/docs/react/essentials/get-started.html):

```
yarn add apollo-boost react-apollo graphql-tag graphql
```

I'd then need a complementary GraphQL server - I'd use Node - and so I'd follow the steps [here](https://www.howtographql.com/graphql-js/1-getting-started/) and put it up on my DigitalOcean server. I'd put the frontend up on Github Pages - create-react-app already has some nice deploy scripts for a handful of static site providers like Github. Unless I was doing some sort of server side rendering, in which case I'd need to put my frontend on the server. I probably wouldn't use a container platform like Docker because I've got all that Node stuff already set up, but something like that is still probably the right way to go long term so I don't have to set up Node along with everything else every time I get a new server.

I'm digging Prisma as a database abstraction, so I'd use that (though a month ago, I was using MongoDB for everything to avoid having to set anything up myself. I was specifically using a third party service called MongoLab).

I'll probably need authentication of some sort, so I'd use Passport and probably just offer Facebook/Twitter login as I wouldn't want to mess with real people's credentials.

I'd use Git to version control my code from the beginning - Github if public, Bitbucket if private.

I would probably think about observability (errors, metrics, logging) only after shipping.

Let me know if I missed anything big! And I'll update this post if I actually end up building a new project to completion with this stack (or if I try and then end up abandoning any of the pieces). I'll probably try to write another post like this in a year to see how things have changed (they say JS fatigue is a real thing, though I'd like to think I've managed to stick with the same major toolset for a few years).
