import mongoose from "mongoose";

const guestSchema = new mongoose.Schema(
  {
    weddingId: {
      type: String, // Change from ObjectId to String
      required: true,
    },
    name: {
      type: String,
      required: [true, "Please add guest name"],
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please add a valid email",
      ],
    },
    category: {
      type: String,
      enum: ["family", "friend", "colleague", "other"],
      default: "friend",
    },
    group: {
      type: String,
      trim: true,
    },
    rsvpStatus: {
      type: String,
      enum: ["pending", "confirmed", "declined", "maybe"],
      default: "pending",
    },
    dietaryPreference: {
      type: String,
      enum: ["veg", "non-veg", "jain", "special", "none"],
      default: "none",
    },
    dietaryNotes: {
      type: String,
      trim: true,
    },
    isOutstation: {
      type: Boolean,
      default: false,
    },
    outstationCity: {
      type: String,
      trim: true,
    },
    plusOne: {
      type: Boolean,
      default: false,
    },
    plusOneName: {
      type: String,
      trim: true,
    },
    plusOneDietary: {
      type: String,
      enum: ["veg", "non-veg", "jain", "special", "none"],
      default: "none",
    },
    invitedToFunctions: [
      {
        type: String,
        enum: ["mehendi", "sangeet", "wedding", "reception"],
      },
    ],
    notes: {
      type: String,
      trim: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

// Indexes for faster queries
guestSchema.index({ weddingId: 1, rsvpStatus: 1 });
guestSchema.index({ weddingId: 1, isOutstation: 1 });
guestSchema.index({ weddingId: 1, dietaryPreference: 1 });

const Guest = mongoose.model("Guest", guestSchema);
export default Guest;
