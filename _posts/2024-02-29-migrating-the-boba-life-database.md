---
title: Migrating the Boba Life database
description: So... Boba Life is still running. I thought about shutting it down a long while ago, but it’s nice to have a side project to hack on and keep my programming skills somewhat intact, even if it’s just upgrading all of the libraries and re-releasing the app every now and then. It also forces me to work on the full stack (since most of my professional time is spent on the frontend), and it lets me see how quickly I can iterate.
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

### Products and libraries used in this post

Github Copilot, Prisma (SQLite datasource), DBeaver, SQLPro for Postgres

### Context

So... Boba Life is still running. I thought about shutting it down a long while ago, but it’s nice to have a side project to hack on and keep my programming skills somewhat intact, even if it’s just upgrading all of the libraries and re-releasing the app every now and then. It also forces me to work on the full stack (since most of my professional time is spent on the frontend), and it lets me see how quickly I can iterate.

But for a long time, I was only spending 20 minutes a day on it. It was better than nothing, but when you only spend 20 minutes a day on something (and you’re by yourself), you might atomize everything and err on the short term, hacking together solutions, under thinking architecture, and never quite justifying improving things like developer experience. All of the shortcuts at least let me ship _something_, but it has made things more brittle, less fun, and more costly to maintain over time.

### The database and how much it cost

I spun up a Postgres database on AWS RDS because it seemed pretty popular at the time (this was ~2019) and I originally intended to do geospatial queries. I’m pretty sure I correctly configured everything to the cheapest settings, but my AWS bill consistently came out to $18 a month (and that’s predominantly RDS)! On top of that, I have a server on DigitalOcean and fees to maintain developer accounts with Apple and Google (since I want to distribute the app on both the Apple App store and Google Play store).

So as a side project that was barely alive, it cost several hundred dollars a year just to keep it running!

To make matters worse, I never spent the time to properly adopt an ORM, which would have made queries a billion times easier to write. Instead, I had just found the `pg` npm module and was writing raw SQL everywhere! So even when I wanted to switch to a cheaper database option, it would have required a whole bunch of manual work.

### Server improvements and database migration

After literal years of hacking stuff together, my Node server had compounded into a mess. I had huge files with complicated logic because I wanted to use ES Modules but couldn’t figure out how to enable them for my project. I had raw SQL queries everywhere and was stuck in the middle of an ORM (`sequelize`) migration with no end in sight. And I had years-old versions of a GraphQL API lying around because I didn’t want to theoretically break really really old versions of the app for some users - users I didn’t even know I had because my instrumentation was so bad!

So I was really overdue for cleaning a bunch of stuff up, and I wanted to do that first before cleaning up my database (or else I’d have to maintain twice as much code).

The first thing I did was check some of my logs and finally just delete the years-old parts of the API that I could. I’m pretty sure no one was hitting it. Cleaning that up reduced the surface area I needed to maintain, which let me feel better about finally moving everything to use ES Modules (which was as embarrassingly simple as setting the `"type": "module"` config in my `package.json`). Believe it or not, I felt so gross doing `module.exports` and `require` everywhere that I preferred to just leave things in giant files.

And then I finally just committed to moving to a popular JS/TS ORM called Prisma, with a backend of SQLite. I thought about doing something clever like migrating to Prisma backed by Postgres, then changing the backend to SQLite under the hood - but in the end, I just switched from Postgres + raw SQL (using the `pg` npm module) + Sequelize to SQLite + Prisma. (Deleting those `pg` and `sequelize` npm modules was as glorious as you’d expect.)

At the end of the day, I had a finite number of APIs to migrate and a relatively small number of database tables. It was a lot of manual work, but it wasn’t “at scale” or anything, so I could just spend a few hours in a day, knock it out, and stop letting it occupy space in the back of my mind.

One thing I wanted to use as part of this work was Github Copilot. I had used it at Airbnb, so it wasn’t completely new to me, but using it for a migration was a new and great use case! Copilot was pretty accurate at generating migrated code for me, which was especially valuable since I wasn’t super familiar with the Prisma API.

I migrated all of the `pg` and `sequelize` callsites to use prisma, except some of the trickier queries. Fortunately, prisma has an escape hatch available in their `$queryRaw` API, so I was able to do that to make sure I wasn’t just indefinitely stuck in migration limbo again.

Another server improvement was that `next build` now failed with type errors. I’m not sure why this didn’t _seem_ to be happening before - maybe it was the result of switching to ESM? Even though it was initially very frustrating, the type errors were actually nearly all actual bugs in my code that I had made while manually migrating some of the code (I did some of the migration before remembering I wanted to use Copilot). So seeing all of those errors was actually a huge relief and made me remember why I will keep using TypeScript.

### Migrating my data from PG to SQLite

Prisma can introspect an existing database and turn that into a `schema.prisma` file (which then gets turned into a bunch of TS types and APIs you can use). So I used that introspection to generate my `schema.prisma` file, and then changed the underlying datasource to SQLite and ran `npx prisma migrate dev`, which actually created all of the tables I needed in the shape that Prisma expected it to be in (this was more reliable than creating tables based off of the Postgres export). Then I just focused on migrating all of the data.

I used a tool called `SQLPro for Postgres` (and even started a monthly subscription since it was that good) to help me see and export the data. On the SQLite side, I used `SQLPro for SQLite` until the free trial ran out, and then switched to something called `DBeaver` (which wasn’t quite as suited for my needs, but it also pretty powerful and supports a ton of databases, so I’ll probably keep using it for future database access).

There were 2 main ways I needed to massage my data:

PG exports my dates as ISO strings, but Prisma wants to save into SQLite with milliseconds after the epoch. So I had to switch all of my timestamps to milliseconds after the epoch. For that, I actually asked Github Copilot Chat to make a Node script for me that would read all the rows from a database table and then update them, and with some tweaks, the script worked really nicely
PG exports booleans as `“True”` and `“False”`, but SQLite wanted `true` and `false`

There were a few raw SQL queries that I needed to change to make the SQL compatible with SQLite, for example:

Learning `select count(1)` is not automatically given the name `count`
Replacing `!= ALL(ARRAY(...))` with `NOT IN (...)`
Replacing `current_date - interval ‘30’ day` by passing in a value calculated on the server

Finally, I scp-ed my local SQLite file onto the server and I flipped the switch and everything worked!

One thing I still need to look into is how to get automated backups (RDS did that for me nicely and automatically, but now that my database is just a file on my server, I need to find a solution).

I spun down my AWS RDS instance, which should save me $18 / month (~$216 / year), which was at least a nice tangible reward for getting the work done.

### What’s next

I’ll probably update my clients with the latest versions of Expo and re-release them (I actually haven’t released anything on Google for long enough that the app is now no longer accessible in the Play Store). I do have a web interface now (eg you can see what drinks I’ve had at [https://boba.life/david](https://boba.life/david)), so I could at least add a page to see individual posts (right now, you can only see collections).

I’ve also actually been wanting to write some E2E tests for my GraphQL APIs, which is something I never would have said a decade ago! Just to give me some more peace of mind whenever I change things.

Beyond that, I might just take another break from Boba Life and just move on to migrating my blog to a real blogging platform. After that, maybe I’d entertain working on a new app. But I actually don’t have much time devoted to code anyways.
