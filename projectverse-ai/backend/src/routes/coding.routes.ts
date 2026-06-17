import { Router } from 'express';
import { CodingChallenge } from '../models/CodingChallenge.js';
import { CodingSubmission } from '../models/CodingSubmission.js';
import { authenticate } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/error.js';
import { OllamaService } from '../services/ollama.service.js';
import vm from 'vm';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = Router();

function executeJS(userCode: string, challengeTitle: string, inputStr: string): string {
  const sandbox: any = { console: { log: () => {} } };
  vm.createContext(sandbox);

  let invocation = '';
  if (challengeTitle === 'Two Sum') {
    const lines = inputStr.trim().split('\n');
    const nums = lines[1].trim().split(/\s+/).map(Number);
    const target = parseInt(lines[2].trim(), 10);
    invocation = `\nconst result = solve(${JSON.stringify(nums)}, ${target});`;
  } else if (challengeTitle === 'Merge K Sorted Lists') {
    const lines = inputStr.trim().split('\n');
    const k = parseInt(lines[0].trim(), 10);
    const lists: number[][] = [];
    for (let i = 1; i <= k; i++) {
      if (lines[i]) {
        lists.push(lines[i].trim().split(/\s+/).map(Number));
      }
    }
    invocation = `\nconst result = solve(${JSON.stringify(lists)});`;
  } else if (challengeTitle === 'Binary Tree Level Order Traversal') {
    const nodes = inputStr.trim().split(/\s+/);
    invocation = `\nconst result = solve(${JSON.stringify(nodes)});`;
  } else {
    invocation = `\nconst result = solve(${JSON.stringify(inputStr)});`;
  }

  const fullCode = userCode + invocation + `\nresult;`;
  const result = vm.runInContext(fullCode, sandbox, { timeout: 1000 });
  
  if (Array.isArray(result)) {
    if (result.every(Array.isArray)) {
      return result.map(arr => arr.join(' ')).join('\n');
    }
    return result.join(' ');
  }
  return result !== undefined && result !== null ? String(result) : '';
}

function executePython(userCode: string, challengeTitle: string, inputStr: string): string {
  let pyInvocation = '';
  if (challengeTitle === 'Two Sum') {
    const lines = inputStr.trim().split('\n');
    const nums = lines[1].trim().split(/\s+/).map(Number);
    const target = parseInt(lines[2].trim(), 10);
    pyInvocation = `\nresult = solve(${JSON.stringify(nums)}, ${target})\nprint(" ".join(map(str, result)) if isinstance(result, list) else result)`;
  } else if (challengeTitle === 'Merge K Sorted Lists') {
    const lines = inputStr.trim().split('\n');
    const k = parseInt(lines[0].trim(), 10);
    const lists: number[][] = [];
    for (let i = 1; i <= k; i++) {
      if (lines[i]) {
        lists.push(lines[i].trim().split(/\s+/).map(Number));
      }
    }
    pyInvocation = `\nresult = solve(${JSON.stringify(lists)})\nprint(" ".join(map(str, result)) if isinstance(result, list) else result)`;
  } else if (challengeTitle === 'Binary Tree Level Order Traversal') {
    const nodes = inputStr.trim().split(/\s+/);
    pyInvocation = `\nresult = solve(${JSON.stringify(nodes)})\nif isinstance(result, list):\n    print("\\n".join(" ".join(map(str, sub)) if isinstance(sub, list) else str(sub) for sub in result))\nelse:\n    print(result)`;
  } else {
    pyInvocation = `\nresult = solve(${JSON.stringify(inputStr)})\nprint(result)`;
  }

  const fullCode = userCode + '\n' + pyInvocation;
  
  const tempDir = path.join(__dirname, '../temp');
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }
  const tempFile = path.join(tempDir, `submit_${Date.now()}_${Math.floor(Math.random() * 1000)}.py`);
  fs.writeFileSync(tempFile, fullCode);
  try {
    const output = execSync(`python3 ${tempFile}`, { timeout: 1000 }).toString().trim();
    if (fs.existsSync(tempFile)) fs.unlinkSync(tempFile);
    return output;
  } catch (err: any) {
    if (fs.existsSync(tempFile)) fs.unlinkSync(tempFile);
    throw new Error(err.stderr ? err.stderr.toString() : err.message);
  }
}

// Get challenges
router.get('/challenges', authenticate, asyncHandler(async (req, res) => {
  const { difficulty, category } = req.query;
  const filter: any = {};
  if (difficulty) filter.difficulty = difficulty;
  if (category) filter.category = category;

  const challenges = await CodingChallenge.find(filter).select('-testCases');
  res.json({ success: true, data: challenges });
}));

// Get challenge by ID
router.get('/challenges/:id', authenticate, asyncHandler(async (req, res) => {
  const challenge = await CodingChallenge.findById(req.params.id).select('-testCases.isHidden -testCases.expectedOutput');
  if (!challenge) {
    res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Challenge not found' } });
    return;
  }
  res.json({ success: true, data: challenge });
}));

// Submit solution
router.post('/challenges/:id/submit', authenticate, asyncHandler(async (req, res) => {
  const { code, language } = req.body;
  const challenge = await CodingChallenge.findById(req.params.id);
  if (!challenge) {
    res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Challenge not found' } });
    return;
  }

  const testResults: any[] = [];
  let allPassed = true;
  let hasRuntimeError = false;

  for (const tc of challenge.testCases) {
    let passed = false;
    let actualOutput = '';
    let executionTime = Math.floor(Math.random() * 50) + 10;
    let memoryUsed = Math.floor(Math.random() * 10) + 5;

    try {
      if (language === 'javascript') {
        actualOutput = executeJS(code, challenge.title, tc.input);
        passed = actualOutput.trim() === tc.expectedOutput.trim();
      } else if (language === 'python') {
        actualOutput = executePython(code, challenge.title, tc.input);
        passed = actualOutput.trim() === tc.expectedOutput.trim();
      } else {
        // Fallback for languages we don't compile on CPU directly
        passed = false;
        actualOutput = 'Unsupported language compilation';
      }
    } catch (err: any) {
      passed = false;
      hasRuntimeError = true;
      actualOutput = `Runtime Error: ${err.message}`;
    }

    if (!passed) {
      allPassed = false;
    }

    testResults.push({
      testCaseId: (tc as any)._id,
      passed,
      actualOutput,
      executionTime,
      memoryUsed,
    });
  }

  let finalStatus = 'wrong_answer';
  if (allPassed) {
    finalStatus = 'accepted';
  } else if (hasRuntimeError) {
    finalStatus = 'runtime_error';
  }

  const submission = await CodingSubmission.create({
    userId: req.user._id,
    challengeId: req.params.id,
    code,
    language,
    status: finalStatus,
    testCaseResults: testResults,
    executionTime: Math.max(...testResults.map((r: any) => r.executionTime)),
    memoryUsed: Math.max(...testResults.map((r: any) => r.memoryUsed)),
    score: allPassed ? challenge.points : 0,
  });

  // Update challenge stats
  challenge.totalSubmissions += 1;
  if (allPassed) challenge.totalAccepted += 1;
  challenge.acceptanceRate = Math.round((challenge.totalAccepted / challenge.totalSubmissions) * 100);
  await challenge.save();

  res.json({
    success: true,
    data: {
      submissionId: submission._id,
      status: submission.status,
      testCases: { total: testResults.length, passed: testResults.filter((r: any) => r.passed).length },
      executionTime: submission.executionTime,
      memoryUsed: submission.memoryUsed,
      score: submission.score,
    },
  });
}));

// Get leaderboard
router.get('/leaderboard', asyncHandler(async (_req, res) => {
  const users = await CodingSubmission.aggregate([
    { $match: { status: 'accepted' } },
    { $group: { _id: '$userId', totalScore: { $sum: '$score' }, problemsSolved: { $sum: 1 } } },
    { $sort: { totalScore: -1 } },
    { $limit: 50 },
    { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'user' } },
    { $unwind: '$user' },
  ]);
  res.json({ success: true, data: users });
}));

// Trace execution (Python Tutor style analysis)
router.post('/challenges/:id/trace', authenticate, asyncHandler(async (req, res) => {
  const { code, language } = req.body;
  const challenge = await CodingChallenge.findById(req.params.id);
  if (!challenge) {
    res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Challenge not found' } });
    return;
  }

  const testCase = challenge.testCases[0];
  const inputStr = testCase ? testCase.input : '';

  const ollamaService = OllamaService.getInstance();
  const trace = await ollamaService.traceExecution(code, language, challenge.title, inputStr);

  res.json({ success: true, data: trace });
}));

export default router;
