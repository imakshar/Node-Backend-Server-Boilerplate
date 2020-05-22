import mongoose from "mongoose";
import { hash } from "bcryptjs";
const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            minlength: [6, "Min length Should be 6 char"],
        },
        name: String,
        password: String,
    },
    {
        timestamps: true, // createdAt, updatedAt automatically added!
    }
);

// to execute some task before save
userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        try {
            this.password = await hash(this.password, 10);
        } catch (error) {
            next(error);
        }
    }
    next();
});

export default mongoose.model("User", userSchema);
