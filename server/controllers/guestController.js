import Guest from "../models/Guest.js";

// @desc    Get all guests for a wedding
// @route   GET /api/guests
// @access  Private
export const getGuests = async (req, res) => {
  try {
    const { weddingId } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build query
    const query = {
      weddingId: weddingId, // Make sure this matches your DB field
      createdBy: req.user._id,
    };

    // Add filters if they exist and are not 'all'
    if (req.query.rsvpStatus && req.query.rsvpStatus !== "all") {
      query.rsvpStatus = req.query.rsvpStatus;
    }

    if (req.query.category && req.query.category !== "all") {
      query.category = req.query.category;
    }

    if (req.query.search) {
      query.name = { $regex: req.query.search, $options: "i" };
    }

    console.log("🔍 Guest Query:", JSON.stringify(query, null, 2));

    // Execute queries
    const guests = await Guest.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Guest.countDocuments(query);

    console.log(`📊 Found ${guests.length} guests out of ${total} total`);

    // Calculate RSVP stats
    const stats = await Guest.aggregate([
      { $match: { weddingId: weddingId, createdBy: req.user._id } },
      {
        $group: {
          _id: null,
          totalGuests: { $sum: 1 },
          totalWithPlusOne: {
            $sum: { $add: [1, { $cond: [{ $eq: ["$plusOne", true] }, 1, 0] }] },
          },
          confirmed: {
            $sum: { $cond: [{ $eq: ["$rsvpStatus", "confirmed"] }, 1, 0] },
          },
          declined: {
            $sum: { $cond: [{ $eq: ["$rsvpStatus", "declined"] }, 1, 0] },
          },
          pending: {
            $sum: { $cond: [{ $eq: ["$rsvpStatus", "pending"] }, 1, 0] },
          },
          maybe: {
            $sum: { $cond: [{ $eq: ["$rsvpStatus", "maybe"] }, 1, 0] },
          },
          outstation: {
            $sum: { $cond: ["$isOutstation", 1, 0] },
          },
          veg: {
            $sum: { $cond: [{ $eq: ["$dietaryPreference", "veg"] }, 1, 0] },
          },
          nonVeg: {
            $sum: { $cond: [{ $eq: ["$dietaryPreference", "non-veg"] }, 1, 0] },
          },
          jain: {
            $sum: { $cond: [{ $eq: ["$dietaryPreference", "jain"] }, 1, 0] },
          },
          special: {
            $sum: { $cond: [{ $eq: ["$dietaryPreference", "special"] }, 1, 0] },
          },
        },
      },
    ]);

    const statsData = stats[0] || {
      totalGuests: 0,
      totalWithPlusOne: 0,
      confirmed: 0,
      declined: 0,
      pending: 0,
      maybe: 0,
      outstation: 0,
      veg: 0,
      nonVeg: 0,
      jain: 0,
      special: 0,
    };

    // Always return 200 with data
    res.status(200).json({
      guests: guests,
      page: page,
      pages: Math.ceil(total / limit) || 1,
      total: total,
      stats: statsData,
    });
  } catch (error) {
    console.error("❌ Error in getGuests:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
};

// @desc    Get single guest
// @route   GET /api/guests/:id
// @access  Private
export const getGuestById = async (req, res) => {
  try {
    const guest = await Guest.findOne({
      _id: req.params.id,
      createdBy: req.user._id,
    });

    if (guest) {
      res.json(guest);
    } else {
      res.status(404).json({ message: "Guest not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Create a guest
// @route   POST /api/guests
// @access  Private
export const createGuest = async (req, res) => {
  try {
    const { weddingId, ...guestData } = req.body;

    const guest = await Guest.create({
      ...guestData,
      weddingId,
      createdBy: req.user._id,
    });

    res.status(201).json(guest);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Update a guest
// @route   PUT /api/guests/:id
// @access  Private
export const updateGuest = async (req, res) => {
  try {
    const guest = await Guest.findOne({
      _id: req.params.id,
      createdBy: req.user._id,
    });

    if (guest) {
      Object.assign(guest, req.body);
      const updatedGuest = await guest.save();
      res.json(updatedGuest);
    } else {
      res.status(404).json({ message: "Guest not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Delete a guest
// @route   DELETE /api/guests/:id
// @access  Private
export const deleteGuest = async (req, res) => {
  try {
    const guest = await Guest.findOne({
      _id: req.params.id,
      createdBy: req.user._id,
    });

    if (guest) {
      await guest.deleteOne();
      res.json({ message: "Guest removed" });
    } else {
      res.status(404).json({ message: "Guest not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Bulk import guests
// @route   POST /api/guests/bulk
// @access  Private
export const bulkImportGuests = async (req, res) => {
  try {
    const { weddingId, guests } = req.body;

    const guestsWithMeta = guests.map((guest) => ({
      ...guest,
      weddingId,
      createdBy: req.user._id,
    }));

    const imported = await Guest.insertMany(guestsWithMeta);

    res.status(201).json({
      message: `Successfully imported ${imported.length} guests`,
      count: imported.length,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Update RSVP status in bulk
// @route   PATCH /api/guests/bulk/rsvp
// @access  Private
export const bulkUpdateRSVP = async (req, res) => {
  try {
    const { guestIds, rsvpStatus } = req.body;

    await Guest.updateMany(
      { _id: { $in: guestIds }, createdBy: req.user._id },
      { rsvpStatus },
    );

    res.json({ message: "RSVP status updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get guest statistics
// @route   GET /api/guests/stats/:weddingId
// @access  Private
export const getGuestStats = async (req, res) => {
  try {
    const stats = await Guest.aggregate([
      {
        $match: {
          weddingId: req.params.weddingId,
          createdBy: req.user._id,
        },
      },
      {
        $group: {
          _id: null,
          totalGuests: { $sum: 1 },
          totalWithPlusOne: {
            $sum: { $add: [1, { $cond: ["$plusOne", 1, 0] }] },
          },
          confirmed: {
            $sum: { $cond: [{ $eq: ["$rsvpStatus", "confirmed"] }, 1, 0] },
          },
          declined: {
            $sum: { $cond: [{ $eq: ["$rsvpStatus", "declined"] }, 1, 0] },
          },
          pending: {
            $sum: { $cond: [{ $eq: ["$rsvpStatus", "pending"] }, 1, 0] },
          },
          maybe: {
            $sum: { $cond: [{ $eq: ["$rsvpStatus", "maybe"] }, 1, 0] },
          },
          outstation: {
            $sum: { $cond: ["$isOutstation", 1, 0] },
          },
          veg: {
            $sum: { $cond: [{ $eq: ["$dietaryPreference", "veg"] }, 1, 0] },
          },
          nonVeg: {
            $sum: { $cond: [{ $eq: ["$dietaryPreference", "non-veg"] }, 1, 0] },
          },
          jain: {
            $sum: { $cond: [{ $eq: ["$dietaryPreference", "jain"] }, 1, 0] },
          },
        },
      },
    ]);

    res.json(
      stats[0] || {
        totalGuests: 0,
        totalWithPlusOne: 0,
        confirmed: 0,
        declined: 0,
        pending: 0,
        maybe: 0,
        outstation: 0,
        veg: 0,
        nonVeg: 0,
        jain: 0,
      },
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
