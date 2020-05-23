let jwt = require("jsonwebtoken");
const { AuthenticationError } = require("apollo-server-express");

const AUTH_ERROR = new AuthenticationError("Unauthenticated request");

let auth = {
    user: {},
    valid: false,
};

let decodeToken = async (headers) => {
    // Express headers are auto converted to lowercase
    let token = headers["x-access-token"] || headers["authorization"];
    if (token && token.startsWith("Bearer ")) {
        token = token.slice(7, token.length);
        try {
            auth.user = await jwt.verify(token, process.env.APP_SECRET);
            auth.valid = true;
        } catch (e) {
            throw AUTH_ERROR;
        }
    }
    return auth;
};

const authenticateCustomFunc = (context) => {
    if (context.auth && context.auth.valid) {
        return { user: context.auth.user };
    } else {
        throw AUTH_ERROR;
    }
};

module.exports = {
    decodeToken,
    authenticateCustomFunc,
};
