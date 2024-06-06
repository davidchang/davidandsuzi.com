---
title: Implementing a boba map
description: There are a few types of UIs/projects I've wanted to build over the years that I just haven't gotten around to implementing, and a map visualization that keeps a map and a list of places in sync is one of them. This was one of the ideas I had in mind when working on the foundation of the Boba Life website, since the whole idea of the app is to be able to track and see where you've had boba.
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

There are a few types of UIs/projects I've wanted to build over the years that I just haven't gotten around to implementing or wasn't sure how to do them:

- adding annotations/footnotes to text (like comments in a Google doc)
- real-time, massively multiplayer Tetris (I was always stumped on how to keep things in sync across the network - this [blog post](https://words.infil.net/w02-netcode.html) explaining Rollback Netcode in online fighting games was very insightful)
- a blog or portfolio where the page transitions slide in and out (probably much more feasible now than when I thought about it ten years ago)
- a map visualization similar to [https://seattle.eater.com/maps/best-ice-cream-seattle](https://seattle.eater.com/maps/best-ice-cream-seattle) that keeps a map and a list of places in sync

The last idea - a map visualization - was one of the ideas for Boba Life that I had in mind when I recently invested in the foundation of the website (outlined in my last [blog post](https://davidandsuzi.com/dev-niceties-for-boba-life/)).

I wanted a map in the main space and a list of boba shops on the side. Interacting with the map should scroll to the appropriate shop in the list, and interacting with the list (via scrolling or clicking) should pan to the appropriate place in the map.

This seemed like a reasonable visualization for Boba Life, since the whole idea of the app is to be able to track where you've had boba. For example, here's the end result for me, accessible at [https://boba.life/david/map](https://boba.life/david/map):

![map page on Boba Life]({{ site.url }}/imgs/bobaLife/mapScreenshot.png)

And on a smaller viewport:

![map page for a small viewport on Boba Life]({{ site.url }}/imgs/bobaLife/mapSmallViewportScreenshot.png)

### Process and layout

Here's the process I took for implementing this feature:

- My first goal was to simply get a map on the page. I googled "Google Maps React" and saw [https://visgl.github.io/react-google-maps/](https://visgl.github.io/react-google-maps/) , which I had previously seen highlighted in some JS newsletters. The docs were sufficient and I couldn't find any real alternatives, so I started following the Getting Started guide
- To get the map to render, I had to register for an API key for the Google Maps Javascript API. I narrowed the domain to https://boba.life, which caused some confusion when I subsequently went to localhost and didn't see anything showing up (I just had to add localhost to the approved list as well)
- I had to undo some of my layout choices in Next because I wanted to make full use of the screen (rather than having a max width of ~1000px and centering it). Positioning took a long time for me to figure out, I ended up just creating an absolutely positioned container that filled the page
- Next, I fetched the list of boba shops for a user and displayed Map Markers for each one. I fetched the list of shops by doing something like `prisma.users.findUnique({ where: { ... }, include: { posts: { include: { shop: true } } } });` and then doing some manual sorting and data manipulation. I'm sure I could've definitely come up with a better data structure and would've benefited from some code review, but I was really just trying to get something working
- I created the sidepane with a max height of the window and `overflow-y-scroll`, and created a `ShopRow` component that would render the name/location of the shop and a horizontally scrolling grid of post photos. In the process of creating the sidepane (and thinking about what should happen on smaller viewports), I ended up putting a bunch of Flexbox theory into practice - time consuming, but gratifying to get everything working without much duplicate code

ShopRow looks like this:

![the Shop Row component]({{ site.url }}/imgs/bobaLife/mapShopRow.png)

### UX / syncing behavior

I first focused on map interactions and syncing the list to that - clicking a map marker should scroll you to the right spot in the list. In ShopRow, I gave the root node a distinct ID. Then, the Map Marker could just have an onClick that does something like this: `document.getElementById(shop_${shop.id} )?.scrollIntoView();`

I then focused on list interactions and syncing the map to that. I wanted the map to show whatever was the top shop in the list - so if you're scrolling the list, the map should jump around to whatever shop is the top in the list. I wasn't sure how to do this, so I just asked Github Copilot. This was the prompt I used:

```
I've got a page with a map on the left and a list of stores on the right. I want to focus the map on the top store in the viewport. How can I do that?
```

Here was the response:

```
To focus the map on the top store in the viewport, you can use the Intersection Observer API. This API allows you to observe changes in the intersection of a target element with an ancestor element or with a top-level document's viewport.

Here's a step-by-step plan:

1. Import useRef and useEffect from React.
2. Create a ref for each store in the list.
3. Use the Intersection Observer API to observe each store.
4. When a store enters the viewport, update the map center to the store's location.

Here's how you might modify your code:
...
```

The code provided was actually solid, incorporating the above steps into the MapView component I had in my project! I copy/pasted many sections of it (I made sure to read/check it, but that also required some bit of understanding, some of which I didn't really have - specifically when it came to Intersection Observer).

I used most of that code. In using the app, I realized it'd be nice to click on shops in the list to jump to them (rather than having to scroll). That reused code from the previous two interactions, so it was mostly just playing around with the interactions and seeing if they felt right.

### Where do you start?

One incomplete question I wanted to answer was: "what should the initial view of the map be?" I wanted to be able to showcase all of the shops a user had visisted in a single glance (for example, I mostly drink boba in my hometown in the Pacific Northwest, but I have had boba all throughout the country). Google Maps can take latitude/longitude bounds, so instead of just centering on the very first shop, I asked Copilot for some code to generate the coordinate bounds, and that worked nicely. But subsequently, when you scrolled through the list, I ran into some problems where the map wouldn't center on new locations or zoom in as I expected, because the marker was technically already being shown in the map view, and I didn't want to drastically increase the zoom level. In the end, I just reverted back to centering on the most popular shop, and if a user wants to get a full view, they'd have to manually zoom out themselves. Not quite what I wanted, but that was about the amount of effort I was willing to spend.

### Closing

It was fun to finally implement a map like this, though I didn't get the UX quite as polished as I would have liked. I was pretty impressed with Copilot and I do think it saved me a bunch of time (using Intersection Observer, and even just figuring out how to create the list of refs for each shop). I am planning on taking a break from working on Boba Life to try my hand at a new app, but if I ever come back to this, it'll likely be some more graph visualizations for capturing drinks. Or something less exciting, like being able to manually set the post date (as opposed to defaulting to the creation date... sometimes you're posting in the past).
