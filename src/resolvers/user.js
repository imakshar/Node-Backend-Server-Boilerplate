import { User } from "../models";
import { UserInputError } from "apollo-server-express";
import mongoose from "mongoose";

export default {
    User: {
        message(parent) {
            // logic goes here
        },
    },
    Query: {
        users(parent, args, context) {
            return User.find({});
        },
        user(parent, args, context) {
            if (!mongoose.isValidObjectId(args.id)) {
                throw new UserInputError(`Invalid UserId provided!`);
            }
            return User.findById(args.id);
        },
    },
    Mutation: {
        signUp(parent, args, context) {
            return User.create(args);
        },
    },
};
