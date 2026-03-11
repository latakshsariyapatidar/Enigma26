import mongoose, { Schema } from "mongoose";

const eventConfigSchema = new Schema({
    status: {
        type: String,
        enum: ["upcoming","active", "completed"],
        default: "upcoming",
    },
    
})

export const EventConfig = mongoose.model("EventConfig", eventConfigSchema);