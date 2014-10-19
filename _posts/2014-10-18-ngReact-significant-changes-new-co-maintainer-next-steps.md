---
title: ngReact - Significant Changes, New Co-Maintainer, Next Steps
description: About a month ago, I was actually already planning to write a blog post titled "Why you shouldn’t use ngReact," but now there are legitimate reasons to use it.
tags:
- Code
- david
meta:
  _edit_last: "1"
status: publish
layout: post
type: post
published: true
category: David
---

About a month ago, I was actually already planning to write a blog post titled "Why you shouldn’t use ngReact," but now there are legitimate reasons to use it.

# Why You Shouldn't

If you want to use React components in your Angular views, you really don’t need to wrap your React component in directives like I suggested. It was good in that it kept your Angular view sensible - using a directive hid the fact that it was really delegating to React in the background, but it wasn’t necessary and incurred unnecessary overhead. Really, you could just render the component straight from your controller:

    angular.module(‘app’, [’ngRoute’])
        .config(function($routeProvider) {
            $routeProvider.when(‘/‘, { template: ‘<div id="mountNode"></div>’, controller: ‘AppCtrl’ });
        })
        .controller(‘AppCtrl’, function() {
            React.renderComponent(YourReactComponent(), document.getElementById(‘mountNode’));
        });

This works - you don’t need to think about adding ngReact or going through directives, which would be an extra layer of complexity.

On top of this, half of ngReact was proof of concept. Originally, I had wanted to see if I could get comparable performance converting a transcluded Angular view into a React component at run time. For a while, performance was something like 400% worse, so it obviously wasn't in any place to be consumed - the bulk of the module couldn’t be used.

# Why You Should

Before I got around to deprecating the repository, I saw an issue from Kasper Bøgebjerg Pedersen ([@kasperp](https://github.com/kasperp)) saying that he had made some improvements and asking if I wanted it in a pull request. Kasper’s work actually introduced value and singlehandedly convinced me that it was worth keeping around. The added value was that:

1. It provided a real, opinionated way of using React components inside of Angular, by preferring that they be injectable Angular values (as opposed to globally accessible variables, which they technically can still be)

2. If React components are injectable Angular values, they can also consume other injectable Angular values, which cleanly solves a question of how React can interact with other Angular services like $filters, data models, etc.

3. It threw out some junk ("ngReactRepeat") and added a reactDirective factory helper to create directives specifically bound to React components (instead of a single generic Angular directive that could bind to any React component)

# New Co-Maintainer

So all of the code that is now in ngReact belongs to Kasper, and he's now a co-maintainer of the repository.

You can check it out on [Github](https://github.com/davidchang/ngReact). I’ve pushed version 0.1.0 to npm and bower (up from 0.0.2), so you can also pull it down quickly with ```npm install ngreact``` or ```bower install ngReact```.

The only things now in ngReact are the aforementioned reactComponent directive and reactDirective factory.

# Next Steps

Big ideas and potential roadmap would be to:

1. Add unit test coverage and more documentation

2. Facilitate not just the use of React inside of Angular as a view layer, but facilitate the use of Flux as an architecture inside of Angular as a means of interacting with React

3. As was the spirit of my proof of concept with ngReactRepeat, I am still thinking that it may be possible to get a quick win for everyone if we could dynamically convert Angular views into React components, if you already had Angular views in place. ngReactRepeat thought that this could be done just by adding a directive that could parse transcluded code at runtime. It was ugly and had a lot of constraints. But today, as transpilers/bundlers like Browserify, Webpack, and Traceur have proliferated, it’s becoming more acceptable to require a transpilation step in your build process, and it’s a lofty goal, but perhaps it would be entirely possible to transpile Angular views into React components.