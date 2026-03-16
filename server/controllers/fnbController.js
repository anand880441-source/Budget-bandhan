import FnBPackage from '../models/FnBPackage.js';

// @desc    Get all F&B packages
// @route   GET /api/fnb
// @access  Private
export const getFnBPackages = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    // Build query based on filters
    const query = { isActive: true };

    if (req.query.category && req.query.category !== 'all') {
      query.category = req.query.category;
    }

    if (req.query.mealType && req.query.mealType !== 'all') {
      query.mealType = req.query.mealType;
    }

    if (req.query.cuisine && req.query.cuisine !== 'all') {
      query.cuisineType = req.query.cuisine;
    }

    if (req.query.minPrice || req.query.maxPrice) {
      query['pricePerPerson.medium'] = {};
      if (req.query.minPrice) {
        query['pricePerPerson.medium'].$gte = parseInt(req.query.minPrice);
      }
      if (req.query.maxPrice) {
        query['pricePerPerson.medium'].$lte = parseInt(req.query.maxPrice);
      }
    }

    if (req.query.isVeg === 'true') {
      query['menuItems.isVeg'] = true;
    }

    if (req.query.search) {
      query.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } },
        { cuisineType: { $in: [new RegExp(req.query.search, 'i')] } }
      ];
    }

    const packages = await FnBPackage.find(query)
      .skip(skip)
      .limit(limit)
      .sort(req.query.featured ? { isFeatured: -1, createdAt: -1 } : { createdAt: -1 });

    const total = await FnBPackage.countDocuments(query);

    // Get filter options
    const categories = await FnBPackage.distinct('category');
    const mealTypes = await FnBPackage.distinct('mealType');
    const cuisines = await FnBPackage.distinct('cuisineType');

    res.json({
      packages,
      page,
      pages: Math.ceil(total / limit),
      total,
      filters: {
        categories,
        mealTypes,
        cuisines
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get single F&B package
// @route   GET /api/fnb/:id
// @access  Private
export const getFnBPackageById = async (req, res) => {
  try {
    const fnbPackage = await FnBPackage.findById(req.params.id);

    if (fnbPackage) {
      res.json(fnbPackage);
    } else {
      res.status(404).json({ message: 'Package not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Calculate F&B cost for wedding
// @route   POST /api/fnb/calculate
// @access  Private
export const calculateFnBCost = async (req, res) => {
  try {
    const { 
      guestCount, 
      mealPackages, 
      barPackage, 
      specialtyCounters,
      eventDuration 
    } = req.body;

    let totalCost = 0;
    const breakdown = [];

    // Calculate meal costs
    if (mealPackages && mealPackages.length > 0) {
      for (const meal of mealPackages) {
        const package_ = await FnBPackage.findById(meal.packageId);
        if (package_) {
          const cost = package_.pricePerPerson.medium * guestCount;
          totalCost += cost;
          breakdown.push({
            name: package_.name,
            category: 'meal',
            perPerson: package_.pricePerPerson.medium,
            guests: guestCount,
            total: cost
          });
        }
      }
    }

    // Calculate bar costs
    if (barPackage) {
      const barPkg = await FnBPackage.findById(barPackage.packageId);
      if (barPkg) {
        const cost = barPkg.pricePerPerson.medium * guestCount * (barPackage.hours || 4);
        totalCost += cost;
        breakdown.push({
          name: barPkg.name,
          category: 'bar',
          perPerson: barPkg.pricePerPerson.medium,
          guests: guestCount,
          hours: barPackage.hours,
          total: cost
        });
      }
    }

    // Calculate specialty counters
    if (specialtyCounters && specialtyCounters.length > 0) {
      for (const counter of specialtyCounters) {
        const counterPkg = await FnBPackage.findById(counter.packageId);
        if (counterPkg) {
          const cost = counterPkg.pricePerPerson.medium * guestCount;
          totalCost += cost;
          breakdown.push({
            name: counterPkg.name,
            category: 'counter',
            perPerson: counterPkg.pricePerPerson.medium,
            guests: guestCount,
            total: cost
          });
        }
      }
    }

    // Calculate staffing cost (1 staff per 50 guests)
    const staffCount = Math.ceil(guestCount / 50);
    const staffCost = staffCount * 2000 * (eventDuration || 1); // ₹2000 per staff per event
    totalCost += staffCost;
    breakdown.push({
      name: 'Catering Staff',
      category: 'staff',
      staffCount,
      perStaff: 2000,
      total: staffCost
    });

    // Calculate crockery & linen
    const crockeryCost = guestCount * 300; // ₹300 per guest
    totalCost += crockeryCost;
    breakdown.push({
      name: 'Crockery & Linen',
      category: 'equipment',
      perPerson: 300,
      guests: guestCount,
      total: crockeryCost
    });

    res.json({
      totalCost,
      breakdown,
      summary: {
        guestCount,
        meals: mealPackages?.length || 0,
        hasBar: !!barPackage,
        counters: specialtyCounters?.length || 0,
        staffCount,
        costPerPerson: totalCost / guestCount
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};