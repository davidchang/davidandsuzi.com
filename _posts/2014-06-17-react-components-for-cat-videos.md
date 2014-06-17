---
title: React Components for Cat Videos
description:
tags:
- david
- Code
meta:
  _edit_last: "1"
status: publish
layout: post
type: post
published: true
category: David
---

A year ago, I was trying to get into Angular, so I wrote a pretty candid post on a simple AngularJS directive. It was basically just a wrapper for a Youtube video embedded through an iframe: [http://davidandsuzi.com/building-an-angularjs-directive-for-cat-videos/](http://davidandsuzi.com/building-an-angularjs-directive-for-cat-videos/)

So I thought it would be cool to do something similar with React and cut out a lot of the obligatory tutorial content, since React is already pretty widely known.

<hr>

If I go to the React Getting Started page, they just point me straight to a JSFiddle that creates a pretty simple Hello World component: [http://jsfiddle.net/vjeux/kb3gN/](http://jsfiddle.net/vjeux/kb3gN/)

Here’s the pertinent JSX code we really care about:

    /** @jsx React.DOM */

    var Hello = React.createClass({
        render: function() {
            return <div>Hello {this.props.name}</div>;
        }
    });

    React.renderComponent(<Hello name="World" />, document.body);

Changing this to a Youtube directive is automatically very intuitive. I want to declare my code like I had in my Angular directive:

    <youtube code=“IytNBm8WA1c”/>

The code that should replace that is this:

    <div>
      <iframe style="overflow:hidden;height:100%;width:100%"
              width="100%"
              height="100%"
              src="http://www.youtube.com/embed/{{code}}"
              frameborder="0"
              allowfullscreen>
      </iframe>
    </div>

So I’ll just take that new template code and throw it into that render function and get this:

    /** @jsx React.DOM */

    var Youtube = React.createClass({
        render: function() {
            return (
              <div>
                <iframe style="overflow:hidden;height:100%;width:100%"
                        width="100%"
                        height="100%"
                        src="http://www.youtube.com/embed/{this.props.code}"
                        frameborder="0"
                        allowfullscreen>
                </iframe>
              </div>
            );
        }
    });

    React.renderComponent(<Youtube code="IytNBm8WA1c" />, document.body);


Seems pretty straightforward. That code attribute passed in shows up in the iframe src, but the jsfiddle [http://jsfiddle.net/b4m4Z/](http://jsfiddle.net/b4m4Z/) fails for some reason.

"Uncaught Error: Invariant Violation: The 'style' prop expects a mapping from style properties to values, not a string.”


[http://facebook.github.io/react/tips/inline-styles.html](http://facebook.github.io/react/tips/inline-styles.html) more or less says to pass in a styles object and to then reference that object as the style attribute in the JSX. I originally thought this should then be stored in the React component’s “state,” but that’s not the case and doesn’t make sense there anyways. It can actually just live in the render function, like this:

    /** @jsx React.DOM */

    var Youtube = React.createClass({
        render: function() {
            var iframeStyles = {
                overflow : 'hidden',
                height : '100%',
                width: '100%'
            };

            return (
              <div>
                <iframe style={iframeStyles}
                        width="100%"
                        height="100%"
                        src="http://www.youtube.com/embed/{this.props.code}"
                        frameborder="0"
                        allowfullscreen>
                </iframe>
              </div>
            );
        }
    });

    React.renderComponent(<Youtube code="IytNBm8WA1c" />, document.body);

Note the style={iframeStyles} attribute, not something like style=“{iframeStyles}” or some kind of variant of that (many of which I tried). So now, I’m able to see... well, an empty Youtube embed: [http://jsfiddle.net/43jsU/](http://jsfiddle.net/43jsU/)

Turns out I declared the src attribute wrong. It needs to be something more like:

    src={"http://www.youtube.com/embed/" + this.props.code}

Now we actually see what we want to see! [http://jsfiddle.net/qw4Z3/](http://jsfiddle.net/qw4Z3/)

You’ll notice that all of those styles and markup are lame. They can be replaced with some clever CSS trickery to get the 16:9 ratio correct, taking styles from this [CSS Tricks article](http://css-tricks.com/NetMag/FluidWidthVideo/Article-FluidWidthVideo.php).

So the markup can be cleaned up to remove CSS and introduce some much-needed spacing, and we end up with this:


    /** @jsx React.DOM */

    var Youtube = React.createClass({
        render: function() {
            return (
                <div className="videoWrapper">
                    <iframe src={"http://www.youtube.com/embed/" + this.props.code}
                            frameBorder="0"
                            allowFullScreen>
                    </iframe>
                </div>
            );
        }
    });

    React.renderComponent(<Youtube code="IytNBm8WA1c" />, document.body);

Here's the JSFiddle [http://jsfiddle.net/3sF8w/](http://jsfiddle.net/3sF8w/) with the complementary CSS. You’ll notice that a bunch of those iframe attributes got cleaned up, and that’s actually one very cool thing about React - I realized I was getting a bunch of console warnings asking me if I meant to use frameBorder or allowFullScreen or className over frame border and allowfullscreen and class.

<hr>

Let’s consider how to display a list of cat videos, similar to what I did in the Angular article using ng-repeat. Let’s create a React component for a &lt;YoutubeList&gt;:

    /** @jsx React.DOM */

    var Youtube = React.createClass({
        render: function() {
            return (
                <div className="videoWrapper">
                    <iframe src={"http://www.youtube.com/embed/" + this.props.code}
                            frameBorder="0"
                            allowFullScreen>
                    </iframe>
                </div>
            );
        }
    });

    var YoutubeList = React.createClass({
        render: function() {
            var rows = this.props.codes.split(',').map(function(code) {
                return <Youtube code={code}/>
            });

            return (
                <div>
                    {rows}
                </div>
            );
        }
    });

    React.renderComponent(<YoutubeList codes="IytNBm8WA1c,wf_IIbT8HGk" />, document.body);

[http://jsfiddle.net/9Lv5q/](http://jsfiddle.net/9Lv5q/) Pretty straightforward. I originally thought I could somehow pass a String array as codes, but this isn’t Angular, and I think all attribute values are just passed as Strings. Hence, the props.codes.split(‘,’) in the render function.

<hr>

Done. High fives all around! Thanks for reading.