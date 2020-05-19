const express = require("express");
const graphqlHTTP = require("express-graphql");
const { buildSchema } = require("graphql");
const app = express();

/* --------------------------------- Fake DB -------------------------------- */

const db = {
    users: [
        {
            id: "1",
            email: "bob@somewhere.com",
            name: "Bob",
        },
    ],
};

/* --------------------------------- GraphQL -------------------------------- */

const schema = buildSchema(
    `type Query {
        users:[User]
    } 
    type Mutation{
        addUser(name:String! email:String!):User
    }
    type User {
        email:String
        id:String
        name:String!
    }
    `
);

const rootValue = {
    users: () => db.users,
    addUser: (args) => {
        const user = {
            id: "1",
            ...args,
        };
        db.users.push(user);
        return user;
    },
};

app.use(
    "/graphql",
    graphqlHTTP({
        schema,
        rootValue,
        graphiql: true,
    })
);

app.listen(3000, () => console.log("Listening on port 3000...."));
