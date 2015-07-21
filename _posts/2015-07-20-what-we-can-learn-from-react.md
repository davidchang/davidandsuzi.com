---
title: What We Can Learn From React
description: React embraces the functional programming paradigm, the JavaScript standard library, a minimal surface area API, proper abstraction, and componentization. The JavaScript community should embrace these principles too.
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

React embraces the functional programming paradigm, the JavaScript standard library, a minimal surface area API, proper abstraction, and componentization. The JavaScript community should embrace these principles too.

## Some Elaboration

React’s recent explosion in popularity among the JavaScript community is not an accident - due to its core design decisions, React is conducive to developer efficiency, code reusability and composability, and a far more welcoming learning curve.

A discussion of these principles follows:

### Functional Programming Paradigm

One of the core tenets of React is that components are a function of state and props. For a specific state and props, React will always return the same component - time and environment are non-factors. Behavior is the same on the server as the client and the same upon first render as 500th render. This is the result of React components being pure functions.

This is what we really want, as opposed to bi-directional data binding that promises to stay in sync over time. And we are free to use anything we want, like plain JavaScript objects, instead of special model objects with change detection baked into the getters and setters. React sets the developer up for predictable code and reproducible scenarios by shortening the conceptual gap between our data and the rendered view (because the view is a direct result of the data).

### JavaScript Standard Library and Minimal Surface Area APIs

React introduces a minimal API and set of concepts. All you need to do to create a component is implement its render method and describe an initial state. You can plug in to the lifecycle of the component through event hooks (like componentWillMount and componentWillUnmount - there are 7, but I typically only use 2 or 3 on a regular basis). That’s the bulk of the API; everything else like plugging into function hooks and writing the render method are done in JavaScript (and, admittedly, JSX, but I’d suggest JSX is not a new API to learn).

There’s no dependency on jQuery (or inclusion of a subset of such functionality as in Angular) or Underscore (as in Backbone), and you don’t have to learn any kind of DSL as in Angular or Ember. I remember seeing a project that introduced directives into React, reminiscent of Angular, to do repeats, conditional displays, etc., but this is actually contradictory to what React is trying to accomplish in minimizing their API. Directives are the very reason I have difficulty returning to Angular. If you can use native JavaScript constructs to control your view, the cost of introducing your own directives for the same logic is unjustified. \[The result is also that the number of ways to manipulate view logic in React is the same as the number of ways to do it in JavaScript - React doesn’t get in the way.\]

One amazing side effect of the popularity of React has been the adoption of ES6 and code transpilation, facilitated in large part by Webpack and Babel. The overhead of using JSX, ES6, and even experimental ES7 features is significantly mitigated by such tools, and the Babel plugin ecosystem even opens up the developer for easy optimization wins like closure and deadcode eliminations and function inlining [http://codemix.com/blog/why-babel-matters](http://codemix.com/blog/why-babel-matters). The benefit of everyone writing native JavaScript and working with libraries with minimal surface area APIs is that it minimizes what a JavaScript developer needs to know and keep in memory.

### Proper Abstraction

This includes the genius of the Virtual DOM. But the real genius of it is not the Virtual DOM itself, but that the rendering is view agnostic - the DOM is just a target that can be replaced with native mobile app or TV or canvas entities. And you can tell React to plop these view entities into a mount container somewhere, or you could just get it as a string - that’s the Holy Grail of universal \[isomorphic\] rendering right there! We should be abstracting code that is fragile, elusive, or problematic.

This is what gives developers a greater level of confidence in what their view is doing at any given point, and allows React to say "learn once, write everywhere."

### Componentization

Perhaps this is how the hype of the philosophy behind web components is actualized. We want to build our applications out of composable components and to be able to develop component libraries and use them easily across applications and organizations. We want smart components that are specifically coupled to our application logic, and we want dumb components that can be used for layout and organization.

Componentization is not restrained to rendering views or determining layout. It also enables the use of patterns that may be better suited as declarative than imperative. React-router is the best example of this (routes are defined declaratively, not imperatively) and the trend among Flux frameworks recently has also been in this direction.

## Takeaways

These are all principles that we as a community should strive towards. These are means by which we can produce maintainable, scalable, and more predictable code, and produce libraries that improve developer experience by easing the cost of adoption and leveraging the standard library as much as possible.

Here are some examples of how these principles can be actualized:

- The functional programming paradigm - write pure functions and eliminate side effects and unnecessary variables affecting how your code runs
- The JavaScript standard library - familiarize yourself with and consume ES6 through a transpilation step
- A minimal surface area API - minimize the concepts and APIs someone will need to know and understand to consume your code. Ensure names are self-explanatory
- Proper abstraction - DOM manipulation is quirky and meticulous and the Virtual DOM protects the developer from those intricacies and idiosyncrasies. Data propagation is manual and repetitive and Relay reportedly addresses that complexity. Proactively identify the real problems in your apps and be ambitious in your consideration of solutions
- Componentization - bet on UI components as the future of building views, it will facilitate rapid composition and iteration of interfaces for everyone

Many thanks to Josh Schumacher and Patrick Costanzo for proofreading.
