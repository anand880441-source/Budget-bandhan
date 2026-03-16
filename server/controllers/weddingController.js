import Wedding from "../models/Wedding.js";
import VenueBaseCost from "../models/VenueBaseCost.js";

// @desc    Create a new wedding
// @route   POST /api/weddings
// @access  Private
export const createWedding = async (req, res) => {
  try {
    const wedding = await Wedding.create({
      ...req.body,
      user: req.user._id,
    });

    // Calculate budget ranges
    const budgetRanges = await calculateBudgetRanges(wedding);
    wedding.budgetRanges = budgetRanges;
    await wedding.save();

    res.status(201).json(wedding);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get user's weddings
// @route   GET /api/weddings
// @access  Private
export const getWeddings = async (req, res) => {
  try {
    const weddings = await Wedding.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    
    // Calculate total budget for each wedding
    const weddingsWithBudget = await Promise.all(
      weddings.map(async (wedding) => {
        const weddingObj = wedding.toObject();
        weddingObj.totalBudget = await calculateTotalBudget(wedding);
        return weddingObj;
      })
    );
    
    res.json(weddingsWithBudget);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get single wedding
// @route   GET /api/weddings/:id
// @access  Private
export const getWeddingById = async (req, res) => {
  try {
    const wedding = await Wedding.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (wedding) {
      // Calculate total budget before sending
      const weddingObj = wedding.toObject();
      weddingObj.totalBudget = await calculateTotalBudget(wedding);
      
      res.json(weddingObj);
    } else {
      res.status(404).json({ message: "Wedding not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Update wedding
// @route   PUT /api/weddings/:id
// @access  Private
export const updateWedding = async (req, res) => {
  try {
    const wedding = await Wedding.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (wedding) {
      Object.assign(wedding, req.body);

      // Recalculate budget if key fields changed
      if (req.body.city || req.body.venueTier || req.body.guestCount) {
        wedding.budgetRanges = await calculateBudgetRanges(wedding);
      }

      const updatedWedding = await wedding.save();
      
      // Calculate total budget for response
      const weddingObj = updatedWedding.toObject();
      weddingObj.totalBudget = await calculateTotalBudget(updatedWedding);
      
      res.json(weddingObj);
    } else {
      res.status(404).json({ message: "Wedding not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Delete wedding
// @route   DELETE /api/weddings/:id
// @access  Private
export const deleteWedding = async (req, res) => {
  try {
    const wedding = await Wedding.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (wedding) {
      await wedding.deleteOne();
      res.json({ message: "Wedding removed" });
    } else {
      res.status(404).json({ message: "Wedding not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Calculate budget based on city and venue
// @route   POST /api/weddings/calculate
// @access  Private
export const calculateBudget = async (req, res) => {
  try {
    const { city, venueTier, guestCount, outstationPercentage, roomBlocks } =
      req.body;

    console.log("Calculating budget for:", { city, venueTier, guestCount });

    // Get base costs for city and venue
    const baseCost = await VenueBaseCost.findOne({ city, venueTier });

    if (!baseCost) {
      return res
        .status(404)
        .json({ message: "Base costs not found for this city and venue" });
    }

    // Calculate food cost (per plate × guests)
    const foodCost = {
      low: baseCost.costPerPlate.low * guestCount,
      medium: baseCost.costPerPlate.medium * guestCount,
      high: baseCost.costPerPlate.high * guestCount,
    };

    // Calculate venue rent
    const venueRent = baseCost.venueRent;

    // Calculate decor based on multiplier
    const decorCost = {
      low: foodCost.low * baseCost.decorMultiplier.low,
      medium: foodCost.medium * baseCost.decorMultiplier.medium,
      high: foodCost.high * baseCost.decorMultiplier.high,
    };

    // Calculate accommodation for outstation guests
    const outstationGuests = Math.ceil(
      guestCount * (outstationPercentage / 100),
    );
    const roomsNeeded = Math.ceil(outstationGuests / 2);
    const accommodationCost = {
      low: roomsNeeded * baseCost.accommodationPerRoom.low * (roomBlocks || 1),
      medium:
        roomsNeeded * baseCost.accommodationPerRoom.medium * (roomBlocks || 1),
      high:
        roomsNeeded * baseCost.accommodationPerRoom.high * (roomBlocks || 1),
    };

    // Calculate totals
    const total = {
      low: foodCost.low + venueRent.low + decorCost.low + accommodationCost.low,
      medium:
        foodCost.medium +
        venueRent.medium +
        decorCost.medium +
        accommodationCost.medium,
      high:
        foodCost.high +
        venueRent.high +
        decorCost.high +
        accommodationCost.high,
    };

    res.json({
      foodCost,
      venueRent,
      decorCost,
      accommodationCost,
      total,
      breakdown: {
        perPerson: {
          low: total.low / guestCount,
          medium: total.medium / guestCount,
          high: total.high / guestCount,
        },
      },
    });
  } catch (error) {
    console.error("Error calculating budget:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
// Helper function to calculate base budget ranges
async function calculateBudgetRanges(wedding) {
  const baseCost = await VenueBaseCost.findOne({
    city: wedding.city,
    venueTier: wedding.venueTier,
  });

  if (!baseCost) {
    return { low: 0, medium: 0, high: 0 };
  }

  const foodCost = baseCost.costPerPlate.medium * wedding.guestCount;
  const venueRent = baseCost.venueRent.medium;
  const decorCost = foodCost * baseCost.decorMultiplier.medium;

  const outstationGuests = Math.ceil(
    wedding.guestCount * (wedding.outstationPercentage / 100),
  );
  const roomsNeeded = Math.ceil(outstationGuests / 2);
  const accommodationCost =
    roomsNeeded *
    baseCost.accommodationPerRoom.medium *
    (wedding.roomBlocks || 1);

  return {
    low:
      foodCost * 0.8 +
      venueRent * 0.8 +
      decorCost * 0.8 +
      accommodationCost * 0.8,
    medium: foodCost + venueRent + decorCost + accommodationCost,
    high:
      foodCost * 1.2 +
      venueRent * 1.2 +
      decorCost * 1.2 +
      accommodationCost * 1.2,
  };
}

// New helper function to calculate total budget including decor and artists
// New helper function to calculate total budget including decor and artists
async function calculateTotalBudget(wedding) {
  // Get base budget from venue calculation
  const baseCost = await VenueBaseCost.findOne({
    city: wedding.city,
    venueTier: wedding.venueTier,
  });

  let venueRent = 0;
  let foodCost = 0;
  let accommodationCost = 0;

  if (baseCost) {
    venueRent = baseCost.venueRent?.medium || 0;
    foodCost = (baseCost.costPerPlate?.medium || 0) * (wedding.guestCount || 0);

    const outstationGuests = Math.ceil(
      (wedding.guestCount || 0) * ((wedding.outstationPercentage || 0) / 100),
    );
    const roomsNeeded = Math.ceil(outstationGuests / 2);
    accommodationCost =
      roomsNeeded *
      (baseCost.accommodationPerRoom?.medium || 0) *
      (wedding.roomBlocks || 1);
  }

  // Calculate decor total
  const decorTotal =
    wedding.selectedDecor?.reduce((sum, decor) => {
      return sum + (decor.estimatedCost || 0);
    }, 0) || 0;

  // Calculate artists total
  const artistTotal =
    wedding.selectedArtists?.reduce((sum, artist) => {
      return sum + (artist.estimatedCost || 0);
    }, 0) || 0;

  // Get base budget (venue estimate)
  const baseBudget =
    wedding.budgetRanges?.medium || venueRent + foodCost + accommodationCost;

  // Return total
  return {
    base: baseBudget,
    decor: decorTotal,
    artists: artistTotal,
    total: baseBudget + decorTotal + artistTotal,
    breakdown: {
      venue: venueRent,
      food: foodCost,
      accommodation: accommodationCost,
      decor: decorTotal,
      artists: artistTotal,
    },
  };
}
