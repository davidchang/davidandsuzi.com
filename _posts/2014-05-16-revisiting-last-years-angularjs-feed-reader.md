---
title: Revisiting last year's AnguarJS feed reader
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
The first real project I did with Angular was documented a year ago in this [blog post](http://davidandsuzi.com/building-a-feed-reader-with-angularjs/). It was a really simple app that illustrated the power and potential of Angular, but since I've been working in Angular for the past year, I recently revisited this article and noticed a handful of anti-patterns.

If you don't go back and read that post, I don't blame you. It's long.

The [gist](https://gist.github.com/davidchang/4441416) of the original code was this:

- There's an input box for the feed URL
- every 30 seconds or on submit, call a Google API to retrieve the RSS feed
- functionality to toggle light/dark theme and mark items as read, no functionality to save items' state of being read/unread

In retrospect, it was a pretty good starting introduction. I didn't use a lot of Angular features - everything was in a single controller and I didn't utilize anything of the real single page architecture. No routing, no service for the Google API call. I just didn't need it. Here are some of the anti-patterns.

DOM Manipulation
----------------

The whole philosophy of Angular is that you shouldn't exactly need jQuery. That's why they implement their own fallback jqLite to handle basic querying/manipulation. (If there is DOM manipulation, it is convention to occur only in directive code.)

Originally, I had this at the bottom of my code:

    $(function() {
        var $body = $('body');
        $('#toggleTheme').click(function() {
            $body.toggleClass('dark');
        });

        //and an interval check every 30 seconds for the RSS feed
    });

And that controlled this toggleTheme element:

    <button class="btn" id='toggleTheme'><span>Toggle Dark/Light Theme</span></button>

What I should have done:

    <button class="btn" ng-click="darkTheme = true"><span>Toggle Dark/Light Theme</span></button>

Which would set $scope.darkTheme to true. I want to see this scope value on my body element, which is currently one step above my ng-controller, so I could have set $rootScope.darkTheme = true, or what I should really do is move my ng-controller onto body and remove it from the div element it had been on. So this:

    <body>
        <div ng-controller="RssFeedCtrl">

should become:

    <body ng-class="{dark : darkTheme}" ng-controller="RssFeedCtrl">
        <div>

using that darkTheme scope variable.

Regarding the interval check to manually click the #update button, that should exist in the controller as well, and should utilize the $interval service provided by Angular.


$http.get instead of $.ajax
---------------------------

To make the Google API call, I was using $.ajax. This is interesting, because it is an asynchronous action outside of Angular's "digest cycle" - basically, once it happens, Angular has no idea that anything has changed (this concept will hopefully be eliminated by 2.0 with Object.observe). Since Angular didn't know about it, $scope.updateModel had to manually call $scope.$apply to trigger the digest.

But if we use $http.get (these Angular services typically wrap everything in $scope.$apply themselves), we won't need to manually call $apply ourselves. And unit testing will be easier, if we were going to write unit tests (for the same testability reasons, we would want to use $interval above instead of the native setInterval).

By the way, we'd probably want to move that Google API call into its own service, but that's a bit of overkill right now. But the main idea is that controllers themselves should be pretty thin, and recurring logic/code can typically be abstracted out elsewhere, into a service or parent controller.


Angular expressions
-------------------

Some of the scope methods are one liners that do basic expressions - toggleShow that does article.show = !article.show, or markAsRead that does article.read = !article.read (which should be renamed to toggleRead).

Simple expressions like this can be done inline without having to introduce scope methods.

    <span ng-click="markAsRead(article)">...</span>

would become

    <span ng-click="article.read = !article.read">...</span>


Angular App Initialization
--------------------------

When I first looked at the code from a year ago, I was surprised it worked at all. Because Angular apps are conventionally started like this:

    <html ng-app="myApp">
        ...
        <body ng-controller="myAppController">

and then have JavaScript like this:

    angular.module('myApp', [])
        .controller('myAppController', [function() {}]);

This is a standard so that you can achieve some readable and organized modularity and not completely pollute your global scope. I'm surprised that the original source let me pass a global function in as the Angular controller... that is clearly an anti-pattern.

New Code
========

With all that in mind, here's the updated [gist]() for a feed reader with better practices in mind. Demo can be found [here]().