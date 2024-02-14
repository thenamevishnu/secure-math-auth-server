import { Schema, model } from "mongoose";

const users = new Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})

export const authDB = model("users", users)