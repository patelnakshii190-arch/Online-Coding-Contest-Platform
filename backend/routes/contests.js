import express from 'express';
import { Contest } from '../models/Contest.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// GET /api/contests - List all contests from MongoDB
router.get('/', async (req, res) => {
  try {
    const contests = await Contest.find().sort({ startTime: 1 });
    const formatted = contests.map((c) => {
      const obj = c.toObject();
      obj.id = obj.contestId || obj._id.toString();
      return obj;
    });
    res.json(formatted);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching contests: ' + err.message });
  }
});

// GET /api/contests/:slug - Fetch contest detail
router.get('/:slug', async (req, res) => {
  try {
    const contest = await Contest.findOne({
      $or: [{ slug: req.params.slug }, { contestId: req.params.slug }]
    });
    if (!contest) return res.status(404).json({ message: 'Contest not found' });

    const obj = contest.toObject();
    obj.id = obj.contestId || obj._id.toString();
    res.json(obj);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching contest: ' + err.message });
  }
});

// POST /api/contests/:id/register - Toggle contest registration (Requires Authentication)
router.post('/:id/register', authenticateToken, async (req, res) => {
  try {
    const contest = await Contest.findOne({
      $or: [{ contestId: req.params.id }, { slug: req.params.id }]
    });
    if (!contest) return res.status(404).json({ message: 'Contest not found' });

    const userIdStr = req.user.id.toString();
    if (!contest.registeredUsers) contest.registeredUsers = [];

    const isReg = contest.registeredUsers.includes(userIdStr);
    if (isReg) {
      contest.registeredUsers = contest.registeredUsers.filter((u) => u !== userIdStr);
      contest.registeredCount = Math.max(0, contest.registeredCount - 1);
    } else {
      contest.registeredUsers.push(userIdStr);
      contest.registeredCount = contest.registeredCount + 1;
    }

    await contest.save();

    const obj = contest.toObject();
    obj.id = obj.contestId || obj._id.toString();
    obj.isRegistered = !isReg;

    res.json(obj);
  } catch (err) {
    res.status(500).json({ message: 'Contest registration failed: ' + err.message });
  }
});

// POST /api/contests (Admin only)
router.post('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const contestData = req.body;
    const count = await Contest.countDocuments();
    const contestId = contestData.contestId || `contest-${count + 1}`;
    const slug = contestData.slug || contestData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const newContest = await Contest.create({
      ...contestData,
      contestId,
      slug
    });

    const obj = newContest.toObject();
    obj.id = obj.contestId;
    res.status(201).json(obj);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create contest: ' + err.message });
  }
});

// PUT /api/contests/:id (Admin only)
router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const contest = await Contest.findOneAndUpdate(
      { $or: [{ contestId: req.params.id }, { slug: req.params.id }] },
      req.body,
      { new: true }
    );
    if (!contest) return res.status(404).json({ message: 'Contest not found' });
    const obj = contest.toObject();
    obj.id = obj.contestId;
    res.json(obj);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update contest: ' + err.message });
  }
});

// DELETE /api/contests/:id (Admin only)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const contest = await Contest.findOneAndDelete({
      $or: [{ contestId: req.params.id }, { slug: req.params.id }]
    });
    if (!contest) return res.status(404).json({ message: 'Contest not found' });
    res.json({ message: 'Contest deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete contest: ' + err.message });
  }
});

export default router;
