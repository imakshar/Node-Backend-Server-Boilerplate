import { User } from "../models";
import { UserInputError } from "apollo-server-express";
import mongoose from "mongoose";
import { compare } from "bcryptjs";
import jwt from "jsonwebtoken";
import { pubsub } from "../utils";
export default {
    User: {
        message(parent) {
            return `Hello ${parent.name}!`;
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
        async signUp(parent, args, context) {
            let count = await User.countDocuments({ email: args.email });
            if (count > 0) {
                throw new UserInputError(
                    "Another account already exist with this email ID."
                );
            }
            let user = await User.create(args);
            let welcomeMessage = `Welcome ${user.name}!`;
            pubsub.publish("WELCOME", { welcomeMessage });
            return user;
        },
        async signIn(parent, { email, password }, context) {
            let user = await User.findOne({ email });
            if (user) {
                let isPasswordCorrect = await compare(password, user.password);
                if (!isPasswordCorrect) {
                    throw new UserInputError("Password is incorrect");
                }
                const { id, name, email } = user;
                const token = jwt.sign(
                    { id, name, email },
                    process.env.APP_SECRET
                );
                return { token };
            }
            throw new UserInputError("User with this email id not found.");
        },
    },
};
