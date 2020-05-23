/* -------------------------------------------------------------------------- */
/*                               Package imports                              */
/* -------------------------------------------------------------------------- */

import { ApolloServer, gql } from "apollo-server-express";
import express from "express";
import cors from "cors";
import fs from "fs";
import http from "http";
import dotenv from "dotenv";
dotenv.config();
import { JSONObjectDefinition, DateTimeTypeDefinition } from "graphql-scalars";
import { AuthenticationError } from "apollo-server-express";

/* -------------------------------------------------------------------------- */
/*                                File imports                                */
/* -------------------------------------------------------------------------- */

import resolvers from "./resolvers/index";
import mongoose from "mongoose";
import { decodeToken, authenticateCustomFunc } from "./jwt";

/* -------------------------------------------------------------------------- */
/*              DEVONLY console formatting with file line number              */
/* -------------------------------------------------------------------------- */

["log", "warn", "error"].forEach((a) => {
    let b = console[a];
    console[a] = (...c) => {
        try {
            throw new Error();
        } catch (d) {
            b.apply(console, [
                d.stack
                    .split("\n")[2]
                    .trim()
                    .substring(3)
                    .replace(__dirname, "")
                    .replace(/\s\(./, " [\x1b[36m")
                    .replace(/\)/, "\x1b[0m]"),
                "\n",
                ...c,
            ]);
        }
    };
});

/* -------------------------------------------------------------------------- */
/*               Express - ApolloServer with MongoDB Connection               */
/* -------------------------------------------------------------------------- */

(async () => {
    try {
        // DB CONNECTION
        await mongoose.connect(process.env.MONGO_DB, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        // SERVER SETUP
        const app = express();
        app.use(cors());
        app.use(express.static("public"));

        // Auth Directive Setup
        const AuthDirectives = require("graphql-directive-auth").AuthDirective;
        const customAuth = AuthDirectives({
            authenticateFunc: authenticateCustomFunc,
        });

        // Apollo-Graphql Config
        const typeDefs = gql(
            fs.readFileSync(__dirname.concat("/schema/schema.gql"), "utf8")
        );

        const server = new ApolloServer({
            typeDefs: [
                // graphql-scalars
                JSONObjectDefinition,
                DateTimeTypeDefinition,

                // Data schema
                typeDefs,
            ],
            resolvers,

            // custom context, Decodes JWT to Auth Object and injects to args
            context: async ({ req, connection }) => {
                if (connection) {
                    return connection.context;
                }
                const auth = await decodeToken(req.headers);
                return { auth };
            },
            subscriptions: {
                onConnect: async (connectionParams, webSocket) => {
                    if (connectionParams) {
                        const auth = await decodeToken({
                            connectionParams,
                        });
                        return { auth };
                    }
                    return {};
                },
            },
            // Auth driectives
            schemaDirectives: {
                ...customAuth,
            },
            playground: process.env.NODE_ENV !== "production",
        });

        const httpServer = http.createServer(app);
        server.applyMiddleware({ app });
        server.installSubscriptionHandlers(httpServer);

        const PORT = process.env.APP_PORT || 3000;

        httpServer.listen(PORT, () => {
            console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`),
            console.log(`🚀 Subscriptions ready at ws://localhost:${PORT}${server.subscriptionsPath}`);
        });
        
    } catch (error) {
        console.error(error);
    }
})();
