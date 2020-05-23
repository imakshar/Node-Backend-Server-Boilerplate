import { withFilter } from "apollo-server-express";
import { pubsub } from "../utils";
export default {
    Subscription: {
        welcomeMessage: {
            subscribe: () => pubsub.asyncIterator("WELCOME"),
        },
        // welcomeMessage: {
        //     subscribe: withFilter(
        //         () => pubsub.asyncIterator("WELCOME"),
        //         (payload, args) => {
        //             /*When using withFilter, provide a filter function.
        //                 The filter is executed with the payload (a published value),
        //                 variables, context and operation info.
        //                 This function must return a boolean or Promise<boolean>
        //                 indicating if the payload should be passed to the subscriber.*/
        //             return true;
        //         }
        //     ),
        // },
    },
};
