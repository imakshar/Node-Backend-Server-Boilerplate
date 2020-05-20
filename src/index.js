/* -------------------------------------------------------------------------- */
/*                               Package imports                              */
/* -------------------------------------------------------------------------- */

import { ApolloServer, gql } from "apollo-server-express";
import express from "express";
import cors from "cors";
import fs from "fs";
import http from "http";
import dotenv from "dotenv";

/* -------------------------------------------------------------------------- */
/*                                File imports                                */
/* -------------------------------------------------------------------------- */

import resolvers from "./resolvers/index";

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
/*                          Express with ApolloServer                         */
/* -------------------------------------------------------------------------- */

dotenv.config();
const app = express();
app.use(cors());
app.use(express.static("public"));

const typeDefs = gql(
    fs.readFileSync(__dirname.concat("/schema/schema.gql"), "utf8")
);

const server = new ApolloServer({
    typeDefs,
    resolvers,
    playground: process.env.NODE_ENV !== "production",
});

server.applyMiddleware({ app });
const httpServer = http.createServer(app);

const port = process.env.APP_PORT || 3000;
httpServer.listen(port, () =>
    console.log(
        `🚀 Server ready at http://localhost:${port}${server.graphqlPath}`
    )
);
