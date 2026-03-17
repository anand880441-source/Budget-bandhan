import Timeline from '../models/Timeline.js';

// @desc    Get timeline for a wedding
// @route   GET /api/timeline/:weddingId
// @access  Private
export const getTimeline = async (req, res) => {
  try {
    let timeline = await Timeline.findOne({
      weddingId: req.params.weddingId,
      createdBy: req.user._id
    });

    if (!timeline) {
      // Create empty timeline if not exists
      timeline = await Timeline.create({
        weddingId: req.params.weddingId,
        createdBy: req.user._id,
        items: []
      });
    }

    res.json(timeline);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update timeline
// @route   PUT /api/timeline/:weddingId
// @access  Private
export const updateTimeline = async (req, res) => {
  try {
    let timeline = await Timeline.findOne({
      weddingId: req.params.weddingId,
      createdBy: req.user._id
    });

    if (timeline) {
      timeline.items = req.body.items || timeline.items;
      timeline.notes = req.body.notes || timeline.notes;
      await timeline.save();
    } else {
      timeline = await Timeline.create({
        weddingId: req.params.weddingId,
        createdBy: req.user._id,
        items: req.body.items || [],
        notes: req.body.notes
      });
    }

    res.json(timeline);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Add timeline item
// @route   POST /api/timeline/:weddingId/items
// @access  Private
export const addTimelineItem = async (req, res) => {
  try {
    const timeline = await Timeline.findOne({
      weddingId: req.params.weddingId,
      createdBy: req.user._id
    });

    if (!timeline) {
      return res.status(404).json({ message: 'Timeline not found' });
    }

    timeline.items.push(req.body);
    await timeline.save();

    res.json(timeline);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update timeline item
// @route   PUT /api/timeline/:weddingId/items/:itemId
// @access  Private
export const updateTimelineItem = async (req, res) => {
  try {
    const timeline = await Timeline.findOne({
      weddingId: req.params.weddingId,
      createdBy: req.user._id
    });

    if (!timeline) {
      return res.status(404).json({ message: 'Timeline not found' });
    }

    const item = timeline.items.id(req.params.itemId);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    Object.assign(item, req.body);
    await timeline.save();

    res.json(timeline);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete timeline item
// @route   DELETE /api/timeline/:weddingId/items/:itemId
// @access  Private
export const deleteTimelineItem = async (req, res) => {
  try {
    const timeline = await Timeline.findOne({
      weddingId: req.params.weddingId,
      createdBy: req.user._id
    });

    if (!timeline) {
      return res.status(404).json({ message: 'Timeline not found' });
    }

    timeline.items.id(req.params.itemId).deleteOne();
    await timeline.save();

    res.json({ message: 'Item deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};