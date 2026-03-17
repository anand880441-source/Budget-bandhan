import Logistics from "../models/Logistics.js";
import Wedding from "../models/Wedding.js";

// @desc    Get logistics for a wedding
// @route   GET /api/logistics/:weddingId
// @access  Private
// @desc    Get logistics for a wedding
// @route   GET /api/logistics/:weddingId
// @access  Private
export const getLogistics = async (req, res) => {
  try {
    console.log("========== GET LOGISTICS ==========");
    console.log("Wedding ID:", req.params.weddingId);
    console.log("User ID:", req.user._id);

    // Validate weddingId
    if (!req.params.weddingId) {
      console.log("No wedding ID provided");
      return res.status(400).json({ message: "Wedding ID is required" });
    }

    // Check if Logistics model is imported correctly
    console.log("Logistics model:", !!Logistics);

    const logistics = await Logistics.findOne({
      weddingId: req.params.weddingId,
      createdBy: req.user._id,
    });

    console.log("Found logistics:", logistics ? "Yes" : "No");

    if (logistics) {
      res.json(logistics);
    } else {
      // Return empty object if not found
      res.json({ message: "No logistics found", data: {} });
    }
  } catch (error) {
    console.error("❌ ERROR in getLogistics:");
    console.error("Name:", error.name);
    console.error("Message:", error.message);
    console.error("Stack:", error.stack);
    res.status(500).json({
      message: "Server error",
      error: error.message,
      name: error.name,
    });
  }
};

// @desc    Create or update logistics
// @route   POST /api/logistics/:weddingId
// @access  Private
export const updateLogistics = async (req, res) => {
  try {
    console.log("Updating logistics for wedding:", req.params.weddingId);

    let logistics = await Logistics.findOne({
      weddingId: req.params.weddingId,
      createdBy: req.user._id,
    });

    if (logistics) {
      // Update existing
      Object.assign(logistics, req.body);
      logistics = await logistics.save();
    } else {
      // Create new
      logistics = await Logistics.create({
        weddingId: req.params.weddingId,
        createdBy: req.user._id,
        ...req.body,
      });
    }

    res.json(logistics);
  } catch (error) {
    console.error("Error in updateLogistics:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Calculate transportation cost
// @route   POST /api/logistics/calculate/transport
// @access  Private
export const calculateTransportCost = async (req, res) => {
  try {
    const { guestCount, outstationPercentage, distance, vehicleType } =
      req.body;

    // Vehicle capacities and rates
    const vehicles = {
      innova: { capacity: 6, ratePerKm: 20, ratePerDay: 3500 },
      tempo: { capacity: 12, ratePerKm: 30, ratePerDay: 5000 },
      bus: { capacity: 35, ratePerKm: 50, ratePerDay: 8000 },
      luxury: { capacity: 4, ratePerKm: 35, ratePerDay: 6000 },
    };

    const outstationGuests = Math.ceil(
      guestCount * (outstationPercentage / 100),
    );
    const vehicle = vehicles[vehicleType] || vehicles.innova;

    const vehiclesNeeded = Math.ceil(outstationGuests / vehicle.capacity);
    const perKmCost = vehiclesNeeded * vehicle.ratePerKm * distance * 2;
    const perDayCost = vehiclesNeeded * vehicle.ratePerDay;

    res.json({
      outstationGuests,
      vehiclesNeeded,
      vehicleType,
      costs: {
        perKm: perKmCost,
        perDay: perDayCost,
        total: perKmCost + perDayCost,
      },
    });
  } catch (error) {
    console.error("Error in calculateTransportCost:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Calculate baraat cost
// @route   POST /api/logistics/calculate/baraat
// @access  Private
export const calculateBaraatCost = async (req, res) => {
  try {
    const { ghodiType, dholiCount, dholiHours, sfxType } = req.body;

    const ghodiRates = {
      basic: 20000,
      premium: 35000,
      luxury: 55000,
    };

    const dholiRatePerHour = 2000;
    const sfxRates = {
      coldPyro: 15000,
      confetti: 10000,
      both: 20000,
      none: 0,
    };

    const ghodiCost = ghodiRates[ghodiType] || 0;
    const dholiCost = (dholiCount || 0) * (dholiHours || 0) * dholiRatePerHour;
    const sfxCost = sfxRates[sfxType] || 0;

    res.json({
      ghodi: { cost: ghodiCost },
      dholi: { count: dholiCount, hours: dholiHours, cost: dholiCost },
      sfx: { type: sfxType, cost: sfxCost },
      total: ghodiCost + dholiCost + sfxCost,
    });
  } catch (error) {
    console.error("Error in calculateBaraatCost:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Calculate accommodation cost
// @route   POST /api/logistics/calculate/accommodation
// @access  Private
export const calculateAccommodationCost = async (req, res) => {
  try {
    const { guestCount, outstationPercentage, roomType, nights, sharing } =
      req.body;

    const roomRates = {
      standard: 4500,
      deluxe: 7500,
      suite: 12000,
      presidential: 25000,
    };

    const outstationGuests = Math.ceil(
      guestCount * (outstationPercentage / 100),
    );
    const roomsNeeded = Math.ceil(outstationGuests / (sharing || 2));
    const rate = roomRates[roomType] || 4500;
    const totalCost = roomsNeeded * rate * nights;

    res.json({
      outstationGuests,
      roomsNeeded,
      roomType,
      rate,
      nights,
      totalCost,
    });
  } catch (error) {
    console.error("Error in calculateAccommodationCost:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
