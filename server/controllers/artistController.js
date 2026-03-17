import Artist from '../models/Artist.js';

// @desc    Get all artists
// @route   GET /api/artists
// @access  Private
export const getArtists = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    // Build query based on filters
    const query = {};

    if (req.query.category && req.query.category !== 'all') {
      query.category = req.query.category;
    }

    if (req.query.city && req.query.city !== 'all') {
      query['basedIn.city'] = req.query.city;
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

    if (req.query.language && req.query.language !== 'all') {
      query.languages = req.query.language;
    }

    if (req.query.search) {
      query.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } },
        { genres: { $in: [new RegExp(req.query.search, 'i')] } }
      ];
    }

    // Sort options
    let sortOption = {};
    if (req.query.sort === 'price_low') {
      sortOption = { 'priceRange.medium': 1 };
    } else if (req.query.sort === 'price_high') {
      sortOption = { 'priceRange.medium': -1 };
    } else if (req.query.sort === 'rating') {
      sortOption = { rating: -1, reviewCount: -1 };
    } else {
      sortOption = { isFeatured: -1, createdAt: -1 };
    }

    const artists = await Artist.find(query)
      .skip(skip)
      .limit(limit)
      .sort(sortOption);

    const total = await Artist.countDocuments(query);

    // Get filter options
    const categories = await Artist.distinct('category');
    const cities = await Artist.distinct('basedIn.city');
    const languages = await Artist.distinct('languages');

    res.json({
      artists,
      page,
      pages: Math.ceil(total / limit),
      total,
      filters: {
        categories,
        cities,
        languages
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get single artist
// @route   GET /api/artists/:id
// @access  Private
export const getArtistById = async (req, res) => {
  try {
    const artist = await Artist.findById(req.params.id);

    if (artist) {
      res.json(artist);
    } else {
      res.status(404).json({ message: 'Artist not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create artist (Admin only)
// @route   POST /api/artists
// @access  Private/Admin
export const createArtist = async (req, res) => {
  try {
    const artist = await Artist.create({
      ...req.body,
      createdBy: req.user._id
    });

    res.status(201).json(artist);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update artist (Admin only)
// @route   PUT /api/artists/:id
// @access  Private/Admin
export const updateArtist = async (req, res) => {
  try {
    const artist = await Artist.findById(req.params.id);

    if (artist) {
      Object.assign(artist, req.body);
      const updatedArtist = await artist.save();
      res.json(updatedArtist);
    } else {
      res.status(404).json({ message: 'Artist not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete artist (Admin only)
// @route   DELETE /api/artists/:id
// @access  Private/Admin
export const deleteArtist = async (req, res) => {
  try {
    const artist = await Artist.findById(req.params.id);

    if (artist) {
      await artist.deleteOne();
      res.json({ message: 'Artist removed' });
    } else {
      res.status(404).json({ message: 'Artist not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get featured artists
// @route   GET /api/artists/featured
// @access  Private
export const getFeaturedArtists = async (req, res) => {
  try {
    const artists = await Artist.find({ isFeatured: true })
      .limit(6)
      .sort({ rating: -1 });

    res.json(artists);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Search artists by name/category
// @route   GET /api/artists/search
// @access  Private
export const searchArtists = async (req, res) => {
  try {
    const { q } = req.query;
    
    const artists = await Artist.find({
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { category: { $regex: q, $options: 'i' } },
        { genres: { $in: [new RegExp(q, 'i')] } }
      ]
    }).limit(10);

    res.json(artists);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};