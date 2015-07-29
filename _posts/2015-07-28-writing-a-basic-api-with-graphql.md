---
title: Writing a Basic API with GraphQL
description: GraphQL is still in its infancy in terms of documentation and ecosystem, but what we have seen so far from conference talks and in the released specification boast predictability, simplicity, and flexibility. My experience with it for this article confirms these claims and proves to be a delightful experience, but what excites me even more is the idea of using this sort of backend in conjunction with Relay. I am optimistic that these sort of libraries will free me from a usually monolithic and rigid backend and meticulous data wiring on the front end.
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

\[This article assumes a high level understanding of GraphQL, which has already been written about by [Rising Stack](https://blog.risingstack.com/graphql-overview-getting-started-with-graphql-and-nodejs/) and [@clayallsopp](https://medium.com/@clayallsopp/your-first-graphql-server-3c766ab4f0a2). This article will start with the backend that we want and then convert it into GraphQL, covering sync/async and query/mutation actions.\]

Code: [https://github.com/davidchang/graphql-pokedex-api](https://github.com/davidchang/graphql-pokedex-api)

Building off of the basic Pokedex app from my [Redux post](davidandsuzi.com/writing-a-basic-app-in-redux/) last week, let’s write a backend API in GraphQL that could support our Pokedex. We’ll need two query methods (to fetch the list of Pokemon and the user’s caught Pokemon) and two mutation methods (to create the user and catch a Pokemon).

The list of Pokemon will be stored in-memory and the list of users and their Pokemon will be stored in MongoDB.

### Starting

Following the aforementioned [article](https://medium.com/@clayallsopp/your-first-graphql-server-3c766ab4f0a2), I’ve set up an Express server in Node with Babel, which contains a single `/graphql` route. The entirety of my `server.js` file looks like this:

    import express from 'express';
    import schema from './schema';
    import { graphql } from 'graphql';
    import bodyParser from 'body-parser';

    let app  = express();

    // parse POST body as text
    app.use(bodyParser.text({ type: 'application/graphql' }));

    app.post('/graphql', (req, res) => {
      // execute GraphQL!
      graphql(schema, req.body)
        .then(result => res.send(result));
    });

    let server = app.listen(
      3000,
      () => console.log(`GraphQL running on port ${server.address().port}`)
    );

### Synchronous Query
#### { pokemon { name } }

Let's start with the Pokemon list endpoint. We’re still using the list from this [gist](https://gist.github.com/MathewReiss/20a58ad5c1bc9a6bc23b#file-phone-js). Each Pokemon object has a name, type, stage, and species. We need to define a new GraphQLObjectType to describe the shape of this object. The definition looks like this:

    import {
      GraphQLObjectType,
      GraphQLInt,
      GraphQLString,
    } from 'graphql/lib/type';

    let PokemonType = new GraphQLObjectType({
      name: 'Pokemon',
      description: 'A Pokemon',
      fields: () => ({
        name: {
          type: GraphQLString,
          description: 'The name of the Pokemon.',
        },
        type: {
          type: GraphQLString,
          description: 'The type of the Pokemon.',
        },
        stage: {
          type: GraphQLInt,
          description: 'The level of the Pokemon.',
        },
        species: {
          type: GraphQLString,
          description: 'The species of the Pokemon.',
        }
      })
    });

The name, type, and species are all Strings (though type and species could be enums) and the stage is an integer.

In order to be able to access Pokemon through our GraphQL API, we need to define a root query in our GraphQLSchema. A standard, empty schema looks like this:

    import { GraphQLSchema } from 'graphql/lib/type';

    let schema = new GraphQLSchema({
      query: new GraphQLObjectType({
        name: 'RootQueryType',
        fields: {
          // root queries go here!
        }
      })
    });

    export default schema;

To define our new root query, we need to add a key-value pair into the fields object, where the key is the name of the query and the value is an object specifying how the query will work.

Our root query looks like this:

    pokemon: {
      type: new GraphQLList(PokemonType),
      resolve: () => Pokemon // here, Pokemon is an in-memory array
    }

`type` specifies the GraphQL return type - a list of PokemonType objects. `resolve` tells GraphQL how to get the data to fulfill this query. The data here is just an in-memory array of JavaScript objects that match the shape of the PokemonType object defined earlier.

High five, our GraphQL API now has a working root query. For this particular code, we can see it in action by sending a POST request to our server and sending the query as the request body (which avoids particular encoding issues involved with sending this as a GET). (GraphQL doesn't actually care how it gets this query - that's up to the implementer.)

    curl -XPOST -H 'Content-Type:application/graphql'  -d '{ pokemon { name } }' http://localhost:3000/graphql

If we want type and species, but not name, we could instead do:

    curl -XPOST -H 'Content-Type:application/graphql'  -d '{ pokemon { type, species } }' http://localhost:3000/graphql

### Asynchronous Query with an Argument
#### { user(name: "david") { name, caught } }

Next, we need to provide a way to query the user by name to get their caught Pokemon. Let’s start with our type definition again for the user:

    let UserType = new GraphQLObjectType({
      name: 'User',
      description: 'A User',
      fields: () => ({
        name: {
          type: GraphQLString,
          description: 'The name of the User.',
        },
        caught: {
          type: new GraphQLList(GraphQLString),
          description: 'The Pokemon that have been caught by the User.',
        },
        created: {
          type: GraphQLInt,
          description: 'The creation timestamp of the User.'
        }
      })
    });

The user will have a String name, an array of strings representing the Pokemon that have been caught, and an integer timestamp.

Going back to our GraphQLSchema, we will add our root query of `user` and expect a type of UserType. We need to be able to specify the name of the user we are interested in - we do this by specifying an `args` object:

    user: {
      type: UserType,
      args: {
        name: {
          description: 'The name of the user',
          type: new GraphQLNonNull(GraphQLString)
        }
      },
      resolve: (root, {name}) => {

      }
    }

We receive that `name` parameter back in our resolve function, as is evident from the resolve method signature. For this example, I want to use MongoDB, so my resolve function would need to query a MongoDB database and return some sort of user object. But GraphQL (and you, the reader) can’t be bothered with the underlying implementation - the only thing that really matters is that this resolve function returns data or a promise that will eventually return data. (A promise is defined as an object with a `then` function.) So the resolve function can be considered this:

    resolve: (root, {name}) => {
      return someLogicReturningAPromise();
    }

\[The crazy thing is that with Babel, I could be using async/await (but I’m not there yet, and in fact, I’m still using q, not even native Promises).\]

To invoke this new root query, do the following:

    curl -XPOST -H 'Content-Type:application/graphql'  -d '{ user(name: “david”) { name, caught, created } }' http://localhost:3000/graphql

### Mutations

A mutation is a write that generally returns the newly modified data object (as opposed to a query, which is meant to be read-only). For our Pokedex API, we will need the ability to create users and add Pokemon into their caught list. To do this, we need to add mutation entries into our GraphQLSchema, analogous to how we added root queries before:

    let schema = new GraphQLSchema({
      query: new GraphQLObjectType({
        name: 'RootQueryType',
        fields: {
          // root queries went here
        }
      }),
      mutation: new GraphQLObjectType({
        name: 'Mutation',
        fields: {
          // mutations go here!
        }
      })
    });

Mutation configuration is analogous to the query configuration we already did - it takes `type`, `args`, and `resolve`.

The first mutation is to upsert a user:

    upsertUser: {
      type: UserType,
      args: {
        name: {
          description: 'The name of the user',
          type: new GraphQLNonNull(GraphQLString)
        }
      },
      resolve: (obj, {name}) => {
        return someLogicReturningAPromise();
      })
    }

Behind the scenes, that resolve function is really doing a find in the Mongo database and invoking an insert if nothing is found. But that’s just an implementation detail and could be anything.

Invoking this mutation looks like the following:

    curl -XPOST -H 'Content-Type:application/graphql'  -d ‘mutation M { upsertUser(name: “newUser”) { name, caught, created } }' http://localhost:3000/graphql

The preceding `mutation` statement is significant and needs to be followed with a name - here, the name is simply `M`. If you remove `mutation`, you will be telling GraphQL that you want to run the upsertUser root query (which doesn't exist). If you remove that `M`, GraphQL will tell you that there is a syntax error and that it expected a name.

The second mutation we need is to signify catching a Pokemon - the arguments here are the name of the user and the name of the Pokemon. Our mutation is very similar to the above upsertUser:

    caughtPokemon: {
      type: UserType,
      args: {
        name: {
          description: 'The name of the user',
          type: new GraphQLNonNull(GraphQLString)
        },
        pokemon: {
          description: 'The name of the Pokemon that was caught',
          type: new GraphQLNonNull(GraphQLString)
        }
      },
      resolve: (obj, {name, pokemon}) => {
        return someLogicReturningAPromise();
      })
    }

Invoking this mutation looks like the following:

    curl -XPOST -H 'Content-Type:application/graphql'  -d ‘mutation M { caughtPokemon(name: “newUser” pokemon: “Snorlax") { name, caught, created } }' http://localhost:3000/graphql

### Closing

GraphQL is still in its infancy in terms of documentation and ecosystem, but what we have seen so far from conference talks and in the released specification boast predictability, simplicity, and flexibility. My experience with it for this article confirms these claims and proves to be a delightful experience, but what excites me even more is the idea of using this sort of backend in conjunction with Relay. I am optimistic that these tools will enable quicker iteration and cleaner code, freeing me from a rigid backend and meticulous data wiring on the front end.