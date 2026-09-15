import express from 'express';
import { Problem } from '../models/Problem.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// GET /api/problems - Fetch problems for regular users (hidden test cases excluded)
router.get('/', async (req, res) => {
  try {
    const { difficulty, tag, search } = req.query;
    let query = {};

    if (difficulty && difficulty !== 'All') {
      query.difficulty = difficulty;
    }
    if (tag && tag !== 'All') {
      query.tags = tag;
    }
    if (search) {
      const q = String(search);
      query.$or = [
        { title: { $regex: q, $options: 'i' } },
        { slug: { $regex: q, $options: 'i' } },
        { category: { $regex: q, $options: 'i' } }
      ];
    }

    const problems = await Problem.find(query).sort({ createdAt: -1 });

    const formatted = problems.map((p) => {
      const obj = p.toObject();
      obj.id = obj.problemId || obj._id.toString();
      if (obj.sampleTestCases) {
        obj.sampleTestCases = obj.sampleTestCases.filter((tc) => !tc.isHidden);
      }
      delete obj.hiddenTestCases;
      return obj;
    });

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching problems: ' + err.message });
  }
});

// GET /api/problems/admin/all - Fetch all problems with FULL details including hidden test cases (Admin only)
router.get('/admin/all', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const problems = await Problem.find().sort({ createdAt: -1 });
    const formatted = problems.map((p) => {
      const obj = p.toObject();
      obj.id = obj.problemId || obj._id.toString();
      return obj;
    });
    res.json(formatted);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching admin problems: ' + err.message });
  }
});

// GET /api/problems/:slug - Fetch problem detail for problem page (hidden test cases masked)
router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const problem = await Problem.findOne({
      $or: [{ slug: slug }, { problemId: slug }]
    });

    if (!problem) return res.status(404).json({ message: 'Problem not found' });

    const obj = problem.toObject();
    obj.id = obj.problemId || obj._id.toString();

    if (obj.sampleTestCases) {
      obj.sampleTestCases = obj.sampleTestCases.filter((tc) => !tc.isHidden);
    }
    delete obj.hiddenTestCases;

    res.json(obj);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching problem: ' + err.message });
  }
});

// POST /api/problems (Admin only)
router.post('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const problemData = req.body;
    const count = await Problem.countDocuments();
    const problemId = problemData.problemId || `prob-${count + 1}`;
    const slug = problemData.slug || problemData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const newProblem = await Problem.create({
      ...problemData,
      problemId,
      slug,
      likes: problemData.likes || 0,
      dislikes: problemData.dislikes || 0,
      acceptanceRate: problemData.acceptanceRate || 50.0,
      solvedStatus: 'unsolved'
    });

    const obj = newProblem.toObject();
    obj.id = obj.problemId;
    res.status(201).json(obj);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create problem: ' + err.message });
  }
});

// PUT /api/problems/:id (Admin only)
router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const problem = await Problem.findOneAndUpdate(
      { $or: [{ problemId: req.params.id }, { slug: req.params.id }] },
      req.body,
      { new: true }
    );
    if (!problem) return res.status(404).json({ message: 'Problem not found' });
    const obj = problem.toObject();
    obj.id = obj.problemId;
    res.json(obj);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update problem: ' + err.message });
  }
});

// DELETE /api/problems/:id (Admin only)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const problem = await Problem.findOneAndDelete({
      $or: [{ problemId: req.params.id }, { slug: req.params.id }]
    });
    if (!problem) return res.status(404).json({ message: 'Problem not found' });
    res.json({ message: 'Problem deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete problem: ' + err.message });
  }
});

export default router;
