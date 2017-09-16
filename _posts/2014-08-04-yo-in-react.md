---
title: Yo in React
description:
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

I’m honestly a big fan of Yo. I think it’s really novel.

There are a lot of things we’ve assumed should always be in apps that Yo just disregards.

- You send and receive notifications, but you can't retrieve records of what you've sent or received.
- You can’t remove people from your Yo List.
- You can add yourself to your Yo List and Yo yourself.

Maybe that’s why Yo feels revolutionary...

So let’s build a clone... let’s build a web version of Yo, and let’s use ReactFire. We can use Firebase Simple Login to authenticate users via Twitter.

All we really need is the following for each user:

- name
- number of Yo’s they have received
- list of people they can Yo
- a way to indicate when you've received a Yo

The final project is hosted on Firebase and weighs in at about 200 lines of JSX prior to styling.

Demo: [https://yo-in-react.firebaseapp.com](https://yo-in-react.firebaseapp.com)

Github: [https://github.com/davidchang/yo-in-react](https://github.com/davidchang/yo-in-react)

![Yo in React screenshot]({{ site.url }}/imgs/yo-in-react.png)

First, React is component based. So we can have a single App component, composed of smaller components for each Yo feature:

<pre>
&lt;App&gt;
    &lt;UserDisplay /&gt;
    &lt;PeopleToYo /&gt;
    &lt;YoDisplay /&gt;
&lt;/App&gt;
</pre>

I started by just hard-coding a user object on the App state, something like the following, and then using that user object to fill the App’s child components. After getting this to work with static data, I could then introduce the Firebase bindings so that everything would automatically update. And after that, I could introduce Simple Login so that real user can be created and authenticated dynamically.

<pre>
var App = React.createClass({
  getInitialState : function() {
    return {
      user : {
        name : ‘david’,
        yoCount : 25,
        yoList : [],
        notifications : []
      }
    };
  },
  render : function() {

    return (
      &lt;div&gt;
        &lt;UserDisplay user={this.state.user} /&gt;
        &lt;PeopleToYo user={this.state.user} /&gt;
        &lt;YoDisplay user={this.state.user} /&gt;
      &lt;/div&gt;
    );
  }
});
</pre>

In this static mode, writing UserDisplay, PeopleToYo, and YoDisplay should be more or less trivial. It’s mostly writing the HTML and getting used to JSX, but I had some hiccups with hooking up the Yo button in &lt;PeopleToYo&gt;, as well as supporting the form to add a new person to Yo. Also - components must always consist of one DOM element container - you can’t give it sibling elements and expect it to render. That got me a few times.

Here’s the unstyled UserDisplay component:

<pre>
var UserDisplay = React.createClass({
  render : function() {
    return &lt;section&gt;&lt;strong&gt;{this.props.user.name}&lt;/strong&gt;&lt;/section&gt;;
  }
});
</pre>

YoDisplay is about the same, but just needs to iterate over the list of notifications:

<pre>
var YoDisplay = React.createClass({
  render : function() {
    var notificationsHtml = '';
    if (this.props.user.notifications.length) {
      notificationsHtml = (
        &lt;ul&gt;{this.props.user.notifications.slice().reverse().map(function(notification) {
          var timestamp = new Date(notification.timestamp).toString();
          return &lt;li&gt;{notification.from} on {timestamp}&lt;/li&gt;;
        })}&lt;/ul&gt;
      );
    }
    return (
      &lt;section&gt;
        &lt;div&gt;
          Yo Count: &lt;strong&gt;{this.props.user.yoCount || 0}&lt;/strong&gt;
        &lt;/div&gt;

        {notificationsHtml}
      &lt;/section&gt;
    );
  }
});
</pre>

PeopleToYo is basically the same, but in the iteration over our yoList, we want to add in a button to Yo each particular person. But really, you just need to make sure your Javascript “this” scope isn’t lost from the inner closure of the map - so you just explicitly pass in the “this” and bind it to your click handler.

<pre>
&lt;ul&gt;{this.props.user.yoList.map(function(person) {
  return &lt;li&gt;{person.name} &lt;button onClick={this._sendYo.bind(this, person.name)}&gt;Yo&lt;/button&gt;&lt;/li&gt;;
}, this)}&lt;/ul&gt;
</pre>

Hooking up the Firebase binding in YoDisplay to read notifications in real time would look something like this, but we have to pass in the username through props.name:

<pre>
var YoDisplay = React.createClass({
  mixins : [ReactFireMixin],
  componentWillMount : function() {
    this.bindAsArray(new Firebase(baseUrl + '/users/' + this.props.name + '/notifications'), 'notifications');
  },
  getInitialState : function() {
    return {
      notifications : []
    };
  },
  render : function() {
    // removing the above yoCount code
    return (
      &lt;ul&gt;{this.state.notifications.slice().reverse().map(function(notification) {
        var timestamp = new Date(notification.timestamp).toString();
        return &lt;li&gt;{notification.from} on {timestamp}&lt;/li&gt;;
      })}&lt;/ul&gt;
    );
  }
});
</pre>

Pretty simple. PeopleToYo is about the same concept, utilizing the ReactFireMixin, initializing the initial state with an empty array for the bound state variable, and calling bindAsArray in the componentWillMount. Originally, I thought that I could just have a single Firebase binding on my base App component and that all of the children could just read off of that, like how scopes inherit in Angular. That, however, is not the case, and so each component will need its own specific firebase binding (which I don’t think will not scale well, as you could end up with many many Firebase connections on the page).

After wiring up YoDisplay and PeopleToYo as Firebase bindings - everything was complete besides authentication, which we could do with Simple Login using Twitter.

In my componentWillMount step, I created a FirebaseSimpleLogin connection and saved it on the component, something like this:

<pre>
componentWillMount : function() {
  this.authRef = new FirebaseSimpleLogin(new Firebase(baseUrl), function(error, user) {
    // ...
  });
}
</pre>

and then I could set up my login and logout buttons to click handlers that called this.authRef.login(‘twitter’) and this.authRef.logout respectively. The callback in the above code is triggered every time a user’s authentication status changes, so I could handle error messages or bind to the user object:

<pre>
if (error) {
  // an error occurred while attempting login
  $this.setState({
    errorMsg : error.message,
    authenticated : false
  });
} else if (user) {
  // user authenticated with Firebase

  $this.setState({
    name : user.username,
    authenticated : true
  });

  var newRef = new Firebase(baseUrl + '/users/' + user.username);

  $this.bindAsObject(newRef, 'user');
  newRef.child('name').set(user.username);

} else {
  // user is logged out
  $this.setState({
    authenticated : false
  });
}
</pre>

And that’s all of it.

It was a good developer experience and is kinda crazy to think that I can write real time apps with so little code and overall work. Some good experiences include:

- Firebase Simple Login is beautifully simple. Stuff like that used to take me so longer, but Simple Login was a joy; that was also the first Twitter authenticated app I’ve made in years
- Not a lot of files. When developing, I basically worked out of a single HTML file… that was it. Switching between my view and my controller meant scrolling up and down instead of switching between files in my text editor
- Not a lot of magic - in Angular, you need to set up your ng-app and do very specific things to wire everything up the right way (though of course you can abstract that away with things like Yeoman generators). But React doesn’t require a lot of that framework-specific manipulation. Between calling renderComponent, setState, componentWillMount, and the 10 or 15 minutes it takes to get used to JSX, you can get really pretty far
- I actually used Firebase hosting for the first time. It was literally two commands: firebase init && firebase deploy

Thanks for reading! If you have any questions, please let me know.
