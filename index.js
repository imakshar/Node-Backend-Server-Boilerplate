const { ApolloServer, gql } = require("apollo-server");

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

const typeDefs = gql`
    type Query {
        users: [User]
        user(id: String): User
    }
    type Mutation {
        addUser(name: String!, email: String!): User
    }
    type User {
        email: String
        id: String
        name: String!
        message: String
    }
`;

const resolvers = {
    User: {
        message: (parent) => `Hello, ${parent.name}`,
    },
    Query: {
        users: () => db.users,
        user: (parent, args, context) =>
            db.users.find((user) => user.id === args.id),
    },
    Mutation: {
        addUser: (parent, args) => {
            let user = {
                id: "1",
                ...args,
            };
            db.users.push(user);
            return user;
        },
    },
};
const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => console.log(url));
