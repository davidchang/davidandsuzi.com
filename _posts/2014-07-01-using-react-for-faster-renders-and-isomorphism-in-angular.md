---
title: Using React for Faster Renders and Isomosphism in Angular
description: Angular’s modular approach in 2.0 confirms the idea that we will be mixing and matching framework pieces in the near future. That said, I think it feasible and even beneficial today to use React inside of your Angular app to achieve faster initial renders, as well as faster renders in general.
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

At [HasOffers](hasoffers.com), we’ve been talking about using different view renderers inside of our Angular app, like React or Polymer. So we can delegate to React for the rendering, but we can do we better - we could leverage React to write isomorphic JavaScript. We can use our same React components on the server to send prepopulated templates. And then, instead of fetching the prepopulated templates from the server, we could just manually prepopulate the templates ourselves on the client. We wouldn't even need to touch the server! (So my thought process moved from client to server and then back to the client.)

So here’s my proof of concept work, laid out in 5 different iterations for comparisons and conclusions:

1. Angular app with data preloaded, rendering with ng-grid
2. Angular app with data preloaded, rendering with ng-react-grid
3. Angular app with data preloaded, rendering with ng-react-grid, and calling React directly instead of through directive
4. Angular app with data and view preloaded, using ng-react-grid on the server (isomorphism!)
5. Angular app with data and view preloaded, using ng-react-grid dynamic populating Angular’s template cache in the run step

Some points real quick:

* All code is available on [Github](https://github.com/davidchang/isomorphic-views-in-angular-via-react-poc) (each of the iterations is separated into its own branch)
* Each iteration uses the same two datasets - Kevin Durant game by game stats from the 2014 season (a small dataset - 103 games) and for his entire career (a large dataset - 640 games). Data is always considered “preloaded” to remove unnecessary factors like server latencies
* I’m using Angular UI’s [ng-grid](angular-ui.github.io/ng-grid/) and Jose Garcia’s [ngReactGrid](https://github.com/josebalius/ngReactGrid); unfortunately, I believe that implementation differences between the two skewed the results pretty heavily. ng-grid utilizes virtualization to lazily load grid rows and ngReactGrid loads 100 upfront and then fills in the rest on the next process tick. This made it hard for me in my metrics to really determine when the render could be considered complete or sufficient
* I’ve got a forked version of ngReactGrid (as of ngReactGrid 0.6) on [Github](https://github.com/hasdavidc/ngReactGrid/tree/server-compatible), specifically the changes in this [commit](https://github.com/hasdavidc/ngReactGrid/commit/85c9a90e68d981197a391e01f732e829e23af984#diff-3), that supports iterations 4 and 5.

Iterations 1 and 2 are both very straightforward to implement by viewing ng-grid and ngReactGrid project pages. Both expose themselves as directives and accept data through attributes.

ngReactGrid is a very thin directive that internally does this:

    new ngReactGrid(scope, element, attrs);


which does a bunch of setup and eventually calls this:

    React.renderComponent(
        ngReactGridComponent(
            {grid: this.grid},
            this.element
        )
    );

From our controller/view, we already have the scope, and we can pass in an element, so we can actually just invoke ngReactGrid directly instead of indirectly through a directive, which will have some overhead. This was iteration 3 and saw a small performance boost. (Code is [here](https://github.com/davidchang/isomorphic-views-in-angular-via-react-poc/blob/iteration-3-ng-react-grid-without-directive/js/main.js#L33-L43).)

Since React components can run anywhere, I just need to be able to access ngReactGridComponent on the server and pass it the same initial data that will be on the client, like so:

    var viewTemplate = React.renderComponentToString(
        ngReactGridComponent(sameDataThatWillBeOnTheClient)
    );

When Angular asks for my view file, I can give it that generated HTML, making sure to put it inside of a mount node:

    app.get('/views/requestedTemplate.html', function(req, res) {
        res.send('<div id="gridContainer">' + viewTemplate + '</div>');
    });

and then… that’s it. If I don’t initiate the React component with the exact same data, React will throw a console warning saying that my checksum failed and that it basically threw away the prepopulated HTML. My client side doesn’t need to know or do anything special. It just needs to call ngReactGrid to React.renderComponent the same component with the same data on the same mount node (in this case, #gridContainer).

This explains my fork of ngReactGrid, which exposes the grid default properties and the React component itself. I also had to change my hardcoded data and column definitions into CommonJS modules so that I could read them from the server as well. You can view the finished server serving isomorphic React components [here](https://github.com/davidchang/isomorphic-views-in-angular-via-react-poc/blob/iteration-4-ng-react-grid-isomorphic/server.js).

So that was iteration 4. It relied on pointing the Angular router to a template that didn’t exist in $templateCache, so that it would fetch the view file from the server, where we could run React.renderComponentToString.

But if we already have all of the data, we could just populate the $templateCache at any point from the client side - something like:

    angular.module('app')
        .run(function($templateCache) {
            var viewTemplate = React.renderComponentToString(
                ngReactGridComponent(sameDataThatWillBeOnTheClient)
            );
            $templateCache.put(
                '/views/requestedTemplate.html',
                '<div id="gridContainer">' + viewTemplate + '</div>’
            );
        });

This was iteration 5 and can be found [here](https://github.com/davidchang/isomorphic-views-in-angular-via-react-poc/blob/iteration-5-ng-react-grid-template-cache/js/main.js).

Some metrics are listed below, collected from Chrome’s Javascript profiler.

<table class="table">
  <tr>
    <th>Iteration #</th>
    <th>Small</th>
    <th>Large</th>
    <th>Subsequent Smalls</th>
    <th>Subsequent Larges</th>
  </tr>
  <tr>
    <td>1</td>
    <td>950</td>
    <td>650</td>
    <td>650</td>
    <td>650</td>
  </tr>
  <tr>
    <td>2</td>
    <td>400</td>
    <td>400</td>
    <td>400</td>
    <td>400</td>
  </tr>
  <tr>
    <td>3</td>
    <td>400</td>
    <td>400</td>
    <td>400</td>
    <td>400</td>
  </tr>
  <tr>
    <td>4</td>
    <td>450</td>
    <td>450 or 1200</td>
    <td>300</td>
    <td>300</td>
  </tr>
  <tr>
    <td>5</td>
    <td>650</td>
    <td>1200</td>
    <td>240*</td>
    <td>240</td>
  </tr>
</table>

\*Somehow consistently saw the first subsequent small around 450, then all other subsequent hits around 240

These results are a little sensible and non-sensible at the same time. I gave ngReactGrid the benefit of the doubt and called the render done as soon as it appeared the initial results had been rendered (marked by a small pause in JavaScript execution). From iterations 2 through 5, it is clear to see that subsequent renders improve once we store the prepopulated template in templateCache somehow (either automatically via the server fetch in 4 or manually in the run step in 5). There should theoretically be a slight boost in first render between iterations 2 and 3, but I can’t quite to say that the use cases provided/numbers actually support this.

Initial renders for iterations 4 and 5 were unexpectedly much higher and, for some reason, inconsistent for the large dataset. Though I’m not sure if JavaScript execution really indicates anything in these cases since rendering should happen independently and the views should be available - but I could see the notable 1200 lag when it happened for both initial large dataset renders, so something was going on there.

\[ngReactGrid does show its strengths when considering scrolling performance, since ng-grid has plenty of bindings on the page and has to execute JavaScript to supports its virtualization and ngReactGrid doesn’t have those concerns. But this proof of concept was supposed to be more about initial renders.\]


When I first released [ngReact](https://github.com/davidchang/ngReact), I saw someone tweet about the project saying that it was cool, but he didn’t really know why you would mix Angular with React. I believe this proof of concept is a strong argument for mixing the two, especially if you’ve already put in a large investment into Angular or just need everything else Angular has to offer besides its views (like its services, or hierarchical controllers, or router). I think Angular’s modular approach in 2.0 confirms the idea that we will be mixing and matching framework pieces in the near future. That said, I think it feasible and even beneficial today to use React inside of your Angular app to achieve faster initial renders, as well as faster renders in general.

Thanks for reading! As always, feel free to reach out.