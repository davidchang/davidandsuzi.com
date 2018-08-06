---
title: Rewriting that Redux App with the New Context API
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

Demo: [http://davidchang.github.io/redux-pokedex/](http://davidchang.github.io/redux-pokedex/)

React state: [Code diff](https://github.com/davidchang/redux-pokedex/commit/69da59a5b7a3d161a0cde92aeac30e4342f25553) and [Periscope livestream](https://www.periscope.tv/davidchizzle/1yNGakEpzrNxj)

React context: [Code diff](https://github.com/davidchang/redux-pokedex/commit/7ccb4087bd21805689028accf19bdf6cfcd53a02) and [Periscope livestream](https://www.periscope.tv/davidchizzle/1BRJjraZQrNJw)

This is an iteration of a recent [article](/writing-a-basic-react-redux-app-in-2018) in which I demonstrated how to create a Redux app by building a simple Pokedex. The app was simple enough that Redux wasn't really necessary - we could have gotten by just fine with React component state or even React context.

I also took the opportunity to do a few livestreams, as I've been thinking more and more about that idea and wanting to try to figure out how to stream in a way that is visually appealing, with lower cognitive overhead (watching not to learn how to code, but to appreciate code).

So here's some brief thoughts on the process:

## React State

For this, I created a single React component - let's call it Provider - whose sole responsibility would be to store and manipulate the data. I then passed all of that store data and the "action handlers" down to the App, which needed minimal changes - instead of relying on the Redux `connect` method to hook up the data and access props, we could just nest the App underneath our own Provider component and manually pass the data and action handlers down.

In the commit SHA above, I made Provider's render look like this:

```
render() {
  const { caughtPokemon, pokemon, searchTerm } = this.state;

  return (
    <App
      caughtPokemon={caughtPokemon}
      pokemon={this.filter(searchTerm)}
      searchTerm={searchTerm}
      markCaught={this.markCaught}
      searchTermChanged={this.searchTermChanged}
    />
  );
}
```

This works, but introduces a tight coupling between Provider and App. App becomes an implementation detail of Provider when Provider shouldn't really care what it renders - it should just be concerned with passing its data along. So the more generic way to handle this would be to use React.cloneElement, something like this:

```
render() {
  const { caughtPokemon, pokemon, searchTerm } = this.state;

  return React.Children.map(children, child =>
    React.cloneElement(child, {
      caughtPokemon,
      pokemon: this.filter(searchTerm),
      searchTerm,
      searchTermChanged: this.searchTermChanged,
      markCaught: this.markCaught,
    }),
  );
}
```

Then, in index.js, instead of just mounting `<Provider />` to our root DOM node, we would mount `<Provider><App /></Provider>`.

## React Context

React context was recently re-thought and will make its stable appearance in React 16.3. Since React 16.3 isn't out yet, this relies on a polyfill called [create-react-context](https://github.com/jamiebuilds/create-react-context) to get a feel for the API. All in all, it's a strangely delightful developer experience, making use of render props.

Converting to the Context API meant creating a context to store the data in - this replaces the Redux store. When you create a Context.Provider component, it acts just like a normal React component - so it has props and state and a component lifecycle. We can store our store values in the state and pass them down in the render, through the value prop:

```
render() {
  return (
    <ThemeContext.Provider
      value={this.state}
    >
      {this.props.children}
    </ThemeContext.Provider>
  );
}
```

In most cases, we'll want to render `{this.props.children}`, as we're likely just going to render this component class high up in our component tree, above any place where we might want to consume it. Now for the action handlers - we want that to be able to modify/manipulate our state, and then we need it to propagate its value down. So we can create component methods that will call `this.setState` to trigger re-renders! Furthermore, if we want to make those action handlers available later down the tree, we will need to also make them accessible in the value prop, like so:

{% raw %}
```
render() {
  return (
    <ThemeContext.Provider
      value={{
        ...this.state,
        searchTermChanged: this.searchTermChanged,
        markCaught: this.markCaught,
      }}
    >
      {this.props.children}
    </ThemeContext.Provider>
  );
}
```
{% endraw %}

Consuming the values later in the component tree means using the ThemeContext.Consumer component, which requires a render prop, which will receive the above value prop as an argument.

In use, this looks something like this:

```
<ThemeContext.Consumer>
  {({
    caughtPokemon,
    allPokemon,
    searchTerm,
    searchTermChanged,
    markCaught,
  }) => {
    return React.Children.map(children, child =>
      React.cloneElement(child, {
        caughtPokemon,
        pokemon: this.filter(searchTerm),
        searchTerm,
        searchTermChanged,
        markCaught,
      }),
    );
  }}
<ThemeContext.Consumer>
```
