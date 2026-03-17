import mongoose from "mongoose";

const weddingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    coupleNames: {
      type: String,
      required: [true, "Please add couple names"],
    },
    weddingDate: {
      type: Date,
      required: [true, "Please add wedding date"],
    },
    city: {
      type: String,
      required: [true, "Please select city"],
      enum: [
        "Mumbai",
        "Delhi",
        "Jaipur",
        "Bangalore",
        "Udaipur",
        "Chennai",
        "Kolkata",
        "Hyderabad",
        "Lucknow",
        "Ahmedabad",
      ],
    },
    venueTier: {
      type: String,
      required: [true, "Please select venue tier"],
      enum: [
        "5-star-palace",
        "5-star-city",
        "4-star",
        "resort",
        "farmhouse",
        "banquet",
        "destination",
      ],
    },
    guestCount: {
      type: Number,
      required: [true, "Please enter guest count"],
      min: 10,
      max: 5000,
    },
    outstationPercentage: {
      type: Number,
      default: 20,
      min: 0,
      max: 100,
    },
    roomBlocks: {
      type: Number,
      default: 0,
    },
    functions: [
      {
        type: {
          type: String,
          enum: [
            "mehendi",
            "sangeet",
            "wedding",
            "reception",
            "haldi",
            "cocktail",
          ],
        },
        name: String,
        date: Date,
        startTime: String,
        endTime: String,
        venue: String,
        guestCount: Number,
        estimatedCost: Number,
      },
    ],
    budgetRanges: {
      low: Number,
      medium: Number,
      high: Number,
    },
    selectedDecor: [
      {
        decorId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Decor",
        },
        name: String,
        category: String,
        image: String,
        estimatedCost: Number,
      },
    ],
    selectedArtists: [
      {
        artistId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Artist",
        },
        name: String,
        category: String,
        image: String,
        estimatedCost: Number,
      },
    ],
    // F&B Selection Fields - ADD THESE
    fnbSelection: {
      mealPackages: [
        {
          packageId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "FnBPackage",
          },
          name: String,
          pricePerPerson: Number,
        },
      ],
      barPackage: {
        packageId: { type: mongoose.Schema.Types.ObjectId, ref: "FnBPackage" },
        name: String,
        pricePerPerson: Number,
      },
      specialtyCounters: [
        {
          packageId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "FnBPackage",
          },
          name: String,
          pricePerPerson: Number,
        },
      ],
    },
    totalFnBCost: {
      type: Number,
      default: 0,
    },
    totalBudget: {
      base: { type: Number, default: 0 },
      decor: { type: Number, default: 0 },
      artists: { type: Number, default: 0 },
      food: { type: Number, default: 0 },
      total: { type: Number, default: 0 },
      breakdown: {
        venue: { type: Number, default: 0 },
        food: { type: Number, default: 0 },
        accommodation: { type: Number, default: 0 },
        decor: { type: Number, default: 0 },
        artists: { type: Number, default: 0 },
      },
    },
    status: {
      type: String,
      enum: ["draft", "planning", "active", "completed"],
      default: "draft",
    },
  },
  {
    timestamps: true,
  },
);

// Index for faster queries
weddingSchema.index({ user: 1, status: 1 });
weddingSchema.index({ city: 1, venueTier: 1 });

const Wedding = mongoose.model("Wedding", weddingSchema);
export default Wedding;
