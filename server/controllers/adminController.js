import User from "../models/User.js";
import Wedding from "../models/Wedding.js";
import Guest from "../models/Guest.js";
import Decor from "../models/Decor.js";
import Artist from "../models/Artist.js";
import FnBPackage from "../models/FnBPackage.js";
import VenueBaseCost from "../models/VenueBaseCost.js";

// @desc    Get admin dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
// @desc    Get admin dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
export const getAdminStats = async (req, res) => {
  try {
    console.log("========== ADMIN STATS REQUEST ==========");
    console.log(
      "User from request:",
      req.user
        ? {
            id: req.user._id,
            email: req.user.email,
            role: req.user.role,
          }
        : "No user",
    );

    if (!req.user) {
      console.log("❌ No user in request");
      return res.status(401).json({ message: "User not found" });
    }

    console.log("User role check:", req.user.role);

    if (req.user.role !== "admin") {
      console.log("❌ User is not admin. Role:", req.user.role);
      return res.status(403).json({ message: "Not authorized as admin" });
    }

    console.log("✅ User is admin, fetching stats...");

    const totalUsers = await User.countDocuments();
    const totalWeddings = await Wedding.countDocuments();
    const totalGuests = await Guest.countDocuments();
    const totalDecor = await Decor.countDocuments();
    const totalArtists = await Artist.countDocuments();
    const totalFnB = await FnBPackage.countDocuments();

    // Recent users
    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("-password");

    // Recent weddings
    const recentWeddings = await Wedding.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .limit(5);

    console.log("✅ Stats fetched successfully");
    console.log("Counts:", {
      users: totalUsers,
      weddings: totalWeddings,
      guests: totalGuests,
      decor: totalDecor,
      artists: totalArtists,
      fnb: totalFnB,
    });

    res.json({
      counts: {
        users: totalUsers,
        weddings: totalWeddings,
        guests: totalGuests,
        decor: totalDecor,
        artists: totalArtists,
        fnb: totalFnB,
      },
      recentUsers,
      recentWeddings,
    });
  } catch (error) {
    console.error("❌ Error in getAdminStats:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
export const getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const users = await User.find()
      .select("-password")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments();

    res.json({
      users,
      page,
      pages: Math.ceil(total / limit),
      total,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Update user role
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
export const updateUserRole = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      user.role = req.body.role || user.role;
      await user.save();
      res.json({ message: "User role updated", user });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      await user.deleteOne();
      res.json({ message: "User deleted" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get venue base costs
// @route   GET /api/admin/venue-costs
// @access  Private/Admin
export const getVenueCosts = async (req, res) => {
  try {
    const costs = await VenueBaseCost.find().sort({ city: 1, venueTier: 1 });
    res.json(costs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Update venue base cost
// @route   PUT /api/admin/venue-costs/:id
// @access  Private/Admin
export const updateVenueCost = async (req, res) => {
  try {
    const cost = await VenueBaseCost.findById(req.params.id);

    if (cost) {
      Object.assign(cost, req.body);
      await cost.save();
      res.json(cost);
    } else {
      res.status(404).json({ message: "Venue cost not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
