# Boilerplate-Backend-Server

Node-Express-GraphQL-ApolloServer with MONGO DB

-   with JWT authorization
-   web socket connection for graphql subscriptions.
-   with graphql directive auth

### Tree Structure

    src
    ┣ models
    ┃ ┣ User.js
    ┃ ┣ <other models...>
    ┃ ┗ index.js <entry point>
    ┣ resolvers
    ┃ ┣ <other resolvers...>
    ┃ ┣ subscription.js <subscriptions...>
    ┃ ┣ user.js
    ┃ ┗ index.js <entry point>
    ┣ schema
    ┃ ┗ schema.gql <graphql type schema>
    ┣ index.js <server setup>
    ┣ jwt.js <jwt authorization configs>
    ┗ utils.js <general utils>

`start.js` root entry point for backend server!

## create .env file

APP_PORT=port

NODE_ENV=development or production

MONGO_DB=connection url

APP_SECRET=serious key for jwt auth

### run npm i to install dependencies

### after installing dependencies, run npm start

`🚀 Server ready at http://localhost:<port>/<graphqlServerPath>`

`🚀 Subscriptions ready at ws://localhost:<port>/<graphqlServerPath>`
