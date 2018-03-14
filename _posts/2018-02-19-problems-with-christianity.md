---
title: Problems with Christianity
description: I got an idea while reading my Bible at Zoka coffee in Kirkland. I went home later that day and bought problemswithchristianity.com and then got to work on the idea, which essentially became a niche question and answer site (you could think of it as a more constrained Stack Overflow).
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

\[Updated March 13, 2018\]

It had been nearly 2 years since I had picked up a side project, so there was a bunch of modern libraries, techniques, and tools I hadn’t touched or learned. Twitter had been full of praise for create-react-app, React 16’s server side capabilities, React Router v4, and code splitting/tree-shaking/other perf hacks for several months, but I hadn’t gotten a chance to use any of them on my own, much less build something from scratch. Simultaneously, the chapter of FB had just closed and it made sense to try to get re-acclimatized to modern web development. So a side project seemed appropriate.

I got an idea while reading my Bible at Zoka coffee in Kirkland. I went home later that day and bought problemswithchristianity.com [1] and then got to work on the idea, which essentially became a niche question and answer site (you could think of it as a more constrained Stack Overflow).

I used create-react-app, ejected, and then followed this article (https://www.fullstackreact.com/articles/using-create-react-app-with-a-server/) to add server support while maintaining a solid developer experience (this was before Twitter declared Next.js to be the future). By following the article, I could still kick everything off from an npm script (npm run start) and still get client-side hot reloading working with an authenticated web app. I didn’t really mean to eject my create-react-app, but I did in the process of adding server support, so I was stuck with it. It didn’t seem that bad, though, because it took away any excuse I had against integrating with some CSS in JS solution or React Native for Web, or customizing the Webpack scripts to support code splitting (some of that stuff may now be a part of CRA).

For an open source React UI component library, I used React Toolbox initially, but then switched to Material UI as Toolbox didn’t seem that responsive. I hosted the Node server on Heroku and put my data in Mongolab (because its Heroku integration and because both were free, I just had to point the URL to Heroku’s servers). I really wanted to be able to take advantage of server-side rendering, but because of the way Heroku works, most page loads are cold starts and so the server doesn’t respond very quickly anyways, negating any wins SSR would have had. I still think Heroku could be feasible for an API, something without low latency requirements (AWS Lambda would be good here too), but Heroku’s free tier is not really viable for web servers that need to always be available. I eventually moved this off to a DigitalOcean server, following this [tutorial](https://scotch.io/tutorials/deploying-a-node-app-to-digital-ocean), where latencies have been buttery smooth.

Heroku has a whole app marketplace which shows how many SaaS businesses are out there. In addition to Mongolab, I tried a few “add-ons” related to app monitoring - New Relic and Sentry, though neither did me much good without much real traffic.

I have the code in Bitbucket instead of Github since Bitbucket offers private repositories.

I also set up my own stack with Babel, Prettier, authentication (using Passport), a simple Express server, and SEO/social media tags, much of which I haven’t done myself in a long time. There was plenty more that I wanted to use, but didn’t - specifically GraphQL, React Native for Web, CSS in JS, and Reason. Since starting, Reason’s React support seems to have advanced very nicely.

Certain things were exhilarating - figuring out how to modify my client side only app with Redux and React-Router HOCs to support server side rendering. Using React-Helmet to set meta tags on client and server. Getting everything to run with MongoLab and Mongoose models. Getting Passport authentication with a Facebook strategy to finally work. The first time the app built properly and deployed to Heroku.

Doing things behind authentication was cumbersome, and one of the most unfun things was not realizing I could make Mongoose work with Promises (the docs were still pointing to the callback pattern, so I didn’t think there was Promise support until it was too late). When I finally did start using Promises with Mongoose, in the form of async/await, it also took me quite a bit of time to support it on the server (which required Babel to target the latest version of Node and to use the [async-to-generator](https://babeljs.io/docs/plugins/transform-async-to-generator/) plugin).

On the product side, I had trouble deciding what would be permitted while unauthenticated, and how to reconcile that data once the user authenticates (if at all). I still haven’t totally figured it out yet, but, as the posters on FB’s walls say, “done is better than perfect.” I came up with the idea of a “Problems Roulette” mode when I was back in Oklahoma for the holidays as a way of presenting users with a lot of problems and giving them the opportunity to respond or see the top-rated answer - this would both generate content/feedback on questions and be didactic for users. It would also be a more compelling way of introducing users to the site by giving them questions and asking them for their personal answers rather than showing a bunch of questions that they may not be asking or care to think through.

\[1\] I had been thinking about how one of my housemates had been asking me questions about Christianity, questions about how Christians could keep working hard, or how God’s sovereignty could exist alongside human free will, or why God would’ve allowed sin in the first place. These questions got asked a lot, and though I thought I had good answers for them, some answers stuck better than others, and often the questions would just get re-asked.

I also realized, one night, talking to a college freshman at our church, that the same reasons why I had believed in God when I was in high school no longer resonated with the college freshman. I realized it was a bit of disservice to the gospel to condense it down to just one thing, or one way to think about it, when there are a myriad of reasons why people across the globe, cultures, and times have believed in God, sometimes to great cost.

So the idea of the site came by wanting to provide multiple different answers/perspectives to questions I was receiving, as well as serving as somewhat of a record or log of questions I’ve received from people and how I would respond to them. In that sense, it becomes a sort of educational apologetic resource.

When asked about the goal of the site, I’ve typically answered regarding trying to get better SEO so that the site might show up when other users search these common questions, more than a real Q&A site with necessarily a lot of interaction.

## Update (3/13/18)

I took Problems to Christianity to Seattle's 2018 Code for the Kingdom [hackathon](https://codeforthekingdom.org/seattle-hackathon-2018.html), a Christian-based hackathon (this one was 24 hours) with different challenges and awards for both new code and preexisting code. I ended up tying for first place for preexisting code with this project - the big things I worked on were supporting unauthenticated actions, improving SEO/supporting better URL permalinks, and improving general UX, particularly around the Roulette mode. I also fixed some pretty critical bugs, like logging in on a problem page (which used to crash the server, but doesn't anymore)! I stayed up until 6am the first morning, then drove home and fell asleep for a few hours, before returning (and then proceeded to sleep 11 hours that night).

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">So grateful for the team that worked on Ceaseless at <a href="https://twitter.com/code4thekingdom?ref_src=twsrc%5Etfw">@code4thekingdom</a> Seattle! <a href="https://twitter.com/hashtag/goteam?src=hash&amp;ref_src=twsrc%5Etfw">#goteam</a> <a href="https://twitter.com/hashtag/hackathon?src=hash&amp;ref_src=twsrc%5Etfw">#hackathon</a> <a href="https://twitter.com/hashtag/prayerapp?src=hash&amp;ref_src=twsrc%5Etfw">#prayerapp</a> <a href="https://t.co/pvsKSCtAcr">pic.twitter.com/pvsKSCtAcr</a></p>&mdash; Ceaseless Prayer (@ceaselessprayer) <a href="https://twitter.com/ceaselessprayer/status/973283569220009984?ref_src=twsrc%5Etfw">March 12, 2018</a></blockquote>
<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

Much of the feedback I received centered around textual processing to do sentiment analysis and cluster questions and answers together - eg are two questions similar? What are the main points someone uses to answer these questions? Someone pointed me to [this](https://aws.amazon.com/comprehend/) offering from AWS that does NLP as a service.
