import Decor from '../models/Decor.js';
import cloudinary from '../config/cloudinary.js';

// @desc    Get all decor items
// @route   GET /api/decor
// @access  Private
export const getDecorItems = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    // Build query based on filters
    const query = {};

    if (req.query.category && req.query.category !== 'all') {
      query.category = req.query.category;
    }

    if (req.query.function && req.query.function !== 'all') {
      query.function = { $in: [req.query.function, 'all'] };
    }

    if (req.query.style && req.query.style !== 'all') {
      query.style = req.query.style;
    }

    if (req.query.minPrice || req.query.maxPrice) {
      query['priceRange.medium'] = {};
      if (req.query.minPrice) {
        query['priceRange.medium'].$gte = parseInt(req.query.minPrice);
      }
      if (req.query.maxPrice) {
        query['priceRange.medium'].$lte = parseInt(req.query.maxPrice);
      }
    }

    if (req.query.search) {
      query.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } },
        { tags: { $in: [new RegExp(req.query.search, 'i')] } }
      ];
    }

    const decor = await Decor.find(query)
      .skip(skip)
      .limit(limit)
      .sort(req.query.featured ? { isFeatured: -1, createdAt: -1 } : { createdAt: -1 });

    const total = await Decor.countDocuments(query);

    // Get unique values for filters
    const categories = await Decor.distinct('category');
    const functions = await Decor.distinct('function');
    const styles = await Decor.distinct('style');

    res.json({
      decor,
      page,
      pages: Math.ceil(total / limit),
      total,
      filters: {
        categories,
        functions,
        styles
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get single decor item
// @route   GET /api/decor/:id
// @access  Private
export const getDecorById = async (req, res) => {
  try {
    const decor = await Decor.findById(req.params.id);

    if (decor) {
      res.json(decor);
    } else {
      res.status(404).json({ message: 'Decor not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create decor item (Admin only)
// @route   POST /api/decor
// @access  Private/Admin
export const createDecor = async (req, res) => {
  try {
    const decor = await Decor.create({
      ...req.body,
      createdBy: req.user._id
    });

    res.status(201).json(decor);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update decor item (Admin only)
// @route   PUT /api/decor/:id
// @access  Private/Admin
export const updateDecor = async (req, res) => {
  try {
    const decor = await Decor.findById(req.params.id);

    if (decor) {
      Object.assign(decor, req.body);
      const updatedDecor = await decor.save();
      res.json(updatedDecor);
    } else {
      res.status(404).json({ message: 'Decor not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete decor item (Admin only)
// @route   DELETE /api/decor/:id
// @access  Private/Admin
export const deleteDecor = async (req, res) => {
  try {
    const decor = await Decor.findById(req.params.id);

    if (decor) {
      // Delete images from cloudinary
      if (decor.images && decor.images.length > 0) {
        for (const image of decor.images) {
          if (image.publicId) {
            await cloudinary.uploader.destroy(image.publicId);
          }
        }
      }

      await decor.deleteOne();
      res.json({ message: 'Decor removed' });
    } else {
      res.status(404).json({ message: 'Decor not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Upload decor images (Admin only)
// @route   POST /api/decor/upload
// @access  Private/Admin
export const uploadDecorImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    const images = req.files.map(file => ({
      url: file.path,
      publicId: file.filename
    }));

    res.json({ images });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get featured decor items
// @route   GET /api/decor/featured
// @access  Private
export const getFeaturedDecor = async (req, res) => {
  try {
    const featured = await Decor.find({ isFeatured: true })
      .limit(6)
      .sort({ createdAt: -1 });

    res.json(featured);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};