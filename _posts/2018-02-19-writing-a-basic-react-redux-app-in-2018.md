---
title: Writing a Basic React-Redux App in 2018
description: This is a revision of an article I first wrote in 2015 about writing a basic Redux application, back when React was at version 0.13.3 and Redux at 1.0.0. Now, React is at 16.2 and Redux at 3.7.2. React now abstracted out the renderer into React-DOM, has functional components, and support for Fragments.
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

Demo: http://davidchang.github.io/redux-pokedex/](http://davidchang.github.io/redux-pokedex/)

Code: [https://github.com/davidchang/redux-pokedex](https://github.com/davidchang/redux-pokedex)

Screenshot:

![Pokedex app](/imgs/writing-a-basic-app-in-redux/2018pokedex.png "Pokedex App")

This is a revision of an [article](/writing-a-basic-app-in-redux) I first wrote in 2015 about writing a basic Redux application, back when React was at version 0.13.3 and Redux at 1.0.0. Now, React is at 16.2 and Redux at 3.7.2. React now abstracted out the renderer into React-DOM, has functional components, and support for Fragments.

I’ve used both React and Redux in production at Facebook and Airbnb since then, and Redux itself has matured a fair bit and established itself as the standard state management library for React, so it warrants an update. It’s worth noting, though, that while Redux is the most popular, contenders have arisen, such as MobX, the upcoming and now stable context API, normal React component state or POJOs. Redux's creator Dan Abramov famously wrote "you might not need Redux," indicating that plenty of other solutions are available and Redux itself is not a panacea.

\[Disclaimer: this Pokedex app is a rather contrived example, one where using React component state would be perfectly fine, but the idea was to make a simple Redux app. In the 2015 article, I tried to establish some good patterns - creating actions, reducers, constants, containers, and components directories. I think that was a bit over the top, so this will be a much more minimalistic Redux app, intended to show the flow and basic consumption of Redux.\]

Create-react-app came out in 2016 from a Facebook hackathon and was instantly well received by the community, becoming a simple zero-configuration default to getting started with React apps, filling a huge need in the community for a simple way to get started. This sets up and hides a bunch of things like Webpack and Babel configurations so that you can write ES20xx and get hot reloading for free (in 2015, the best thing I could do was clone a Redux example repo and change everything).

Tangentially, Yarn (with big support from Facebook, among others) and Prettier (from James Long originally, then Christopher Chedeau, among others) have also become pretty big standards in JS development right now.

Getting started looks like this:

```
create-react-app pokedex
cd pokedex
yarn add redux
yarn add react-redux
```

Let’s work on our Redux store first, this is where the data is stored and how it is updated as someone uses the app.

This won’t actually change much from the 2015 version. The data we want to store in our store will be a list of pokemon to show, a search value, and an array of pokemon that have been caught.

```
const initialState = {
  pokemon: Pokemon,
  searchTerm: '',
  caughtPokemon: [],
};
```

[Flux Standard Actions](https://github.com/acdlite/flux-standard-action) came out in 2015, so let’s use those. It basically says that an action should have a string type, an optional error boolean, and a payload, which would typically be a metadata object, though it could be an error object as well. Flux standard actions create a general convention for actions that can be instrumented by tooling and can unify expectation across both codebases and other Flux libraries.

The reducer looks like this:

```
export default function pokemon(state = initialState, action) {
  switch (action.type) {
    case 'SEARCH_INPUT_CHANGED':
      const { searchTerm } = action.payload;
      return {
        ...state,
        searchTerm: searchTerm,
        pokemon: searchTerm
          ? Pokemon.filter(
              pokemon =>
                pokemon.name.toLowerCase().indexOf(searchTerm.toLowerCase()) >
                -1,
            )
          : Pokemon,
      };

    case 'MARK_CAUGHT':
      return {
        ...state,
        caughtPokemon: [...state.caughtPokemon, action.payload.name],
      };

    default:
      return state;
  }
}
```

Next, let’s write our actions. In the case of our Pokedex app, our actions are synchronous functions that just return Flux standard actions. If they were asynchronous, we’d have to write the actions differently so that we could dispatch actions asynchronously (but for now, if we return an object, then Redux will take care of the “dispatch”ing for us - that is, communicating to the reducers we wrote above). We’d probably use another library to make this easier/keep us more organized in Redux, something like redux-thunk, redux-saga, or redux-pack.

Here’s what our actions look like:

```
function searchTermChanged(searchTerm) {
  return {
    type: 'SEARCH_INPUT_CHANGED',
    payload: { searchTerm },
  };
}

function markCaught(name) {
  return {
    type: 'MARK_CAUGHT',
    payload: { name },
  };
}

export default {
  searchTermChanged,
  markCaught,
};

```

Now to hook it up to our view. React-Redux uses a component called the `Provider` to make your store available to the rest of your components; conventionally, Provider is put at the root level so that all of the children components can have access to the store. Provider uses the context API underneath the hood, and an HOC (higher order component) called `connect` accesses properties off of context, making them available via props.

Let’s hook the Provider up as our top level component in index.js where we mount into the DOM:

```
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import reducers from './reducers';
import App from './App';

const store = createStore(reducers);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root'),
);
```

In a child component, we would then use the connect function to access the data as well as connect our Redux actions to be able to modify that data. Connect takes up to four parameters, but the first two are the most commonly used - the first is used for retrieving the data you want, and the second is used for hooking up your actions to be able to modify your store. In this contrived Pokedex example, we can just return all of the store, and connect all of the actions, so hooking up our component is relatively straightforward and looks like this:

```
export default connect(store => store, actions)(App);
```

The connect returns a new component, where store and actions are available to `App` as props. We can make App into a stateless functional component, since we don't need any internal component state or any lifecycle methods. So the App component will end up looking like this:

{% raw %}
```
function App({
  caughtPokemon,
  markCaught,
  pokemon,
  searchTerm,
  searchTermChanged,
}) {
  return (
    <section>
      <h1>Pokedex in Redux</h1>

      <form>
        <div>
          <input
            style={{ width: '100%' }}
            type="text"
            name="search"
            placeholder="Search Pokedex"
            value={searchTerm}
            onChange={e => searchTermChanged(e.target.value)}
          />
        </div>
      </form>

      <table style={{ width: '100%' }}>
        <thead>
          <tr style={{ textAlign: 'left' }}>
            <th>Name</th>
            <th>Type</th>
            <th>Stage</th>
            <th>Species</th>
            <th>Caught?</th>
          </tr>
        </thead>
        <tbody>
          {pokemon.map(curPokemon => (
            <tr key={curPokemon.name}>
              <td>{curPokemon.name}</td>
              <td>{curPokemon.type}</td>
              <td>{curPokemon.stage}</td>
              <td>{curPokemon.species}</td>
              <td>
                {caughtPokemon.includes(curPokemon.name) ? (
                  'Caught!'
                ) : (
                  <button
                    type="button"
                    onClick={() => markCaught(curPokemon.name)}
                  >
                    Catch
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
```
{% endraw %}

With create-react-app, we could have had `yarn start` running the whole time to have hot reloading on to see our progress. This is sufficient for a basic Redux app, but obviously things get more complicated as we scale our app. We haven't much talked about the benefits of Reselect or dev tooling or how to handle asynchronous actions. We also haven't touched on alternative ways to handle state management, but this is a sufficient introduction.
