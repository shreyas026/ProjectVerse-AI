import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { mockChallenges } from '@/services/mockData';
import { Play, CheckCircle, Clock, MemoryStick, Lightbulb, BookOpen, Code2, Sparkles, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';
import { apiClient } from '@/services/api/client';

const CODE_TEMPLATES: Record<string, string> = {
  javascript: `function solve(nums, target) {\n  // Write your solution here\n  \n}`,
  python: `def solve(nums, target):\n    # Write your solution here\n    pass`,
  cpp: `#include <vector>\nusing namespace std;\n\nvector<int> solve(vector<int>& nums, int target) {\n    // Write your solution here\n    \n}`,
  java: `class Solution {\n    public int[] solve(int[] nums, int target) {\n        // Write your solution here\n        \n    }\n}`,
};

export function ChallengePage() {
  const { id } = useParams();
  const [challenge, setChallenge] = useState<any>(
    mockChallenges.find((c) => c._id === id) || mockChallenges[0]
  );
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState(CODE_TEMPLATES.javascript);
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [activeConsoleTab, setActiveConsoleTab] = useState<'output' | 'tutor'>('output');
  const [traceSteps, setTraceSteps] = useState<any[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isTracing, setIsTracing] = useState(false);
  const [tutorError, setTutorError] = useState('');

  const handleTrace = async () => {
    setIsTracing(true);
    setTutorError('');
    setTraceSteps([]);
    setActiveConsoleTab('tutor');
    try {
      const response = await apiClient.post<any>(`/coding/challenges/${id}/trace`, {
        code,
        language
      });
      if (response.success && Array.isArray(response.data) && response.data.length > 0) {
        setTraceSteps(response.data);
        setCurrentStepIndex(0);
      } else {
        setTutorError(response.error?.message || 'Failed to generate code execution trace.');
      }
    } catch (err: any) {
      setTutorError(`Trace error: ${err.message}`);
    } finally {
      setIsTracing(false);
    }
  };

  useEffect(() => {
    const fetchChallenge = async () => {
      try {
        const response = await apiClient.get<any>(`/coding/challenges/${id}`);
        if (response.success && response.data) {
          setChallenge(response.data);
        }
      } catch (err) {
        console.error('Failed to fetch challenge details:', err);
      }
    };
    if (id) {
      fetchChallenge();
    }
  }, [id]);

  const handleRun = async () => {
    setIsRunning(true);
    setOutput('');
    try {
      const response = await apiClient.post<any>(`/coding/challenges/${id}/submit`, {
        code,
        language
      });
      if (response.success) {
        const { status, testCases, executionTime, memoryUsed, score } = response.data;
        setOutput(`Submission Status: ${status.toUpperCase()}\n` +
                  `Passed Test Cases: ${testCases.passed} / ${testCases.total}\n` +
                  `Execution Time: ${executionTime}ms\n` +
                  `Memory Used: ${memoryUsed}MB\n` +
                  `Score: ${score} points\n\n` +
                  `Result: ${status === 'accepted' ? '✅ All test cases passed!' : '❌ Incorrect output or timeout.'}`);
      } else {
        setOutput(`Error: ${response.error?.message || 'Submission failed'}`);
      }
    } catch (err: any) {
      setOutput(`Submission Error: ${err.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
    setCode(CODE_TEMPLATES[lang] || CODE_TEMPLATES.javascript);
  };

  const difficultyColors = {
    easy: 'bg-emerald-500/10 text-emerald-500',
    medium: 'bg-amber-500/10 text-amber-500',
    hard: 'bg-red-500/10 text-red-500',
    expert: 'bg-purple-500/10 text-purple-500',
  };

  return (
    <div className="h-[calc(100vh-8rem)] -mx-4 lg:-mx-8 -mt-4">
      <div className="h-full flex flex-col lg:flex-row">
        {/* Problem Statement */}
        <div className="w-full lg:w-[45%] border-r overflow-auto">
          <div className="p-6 space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-2xl font-bold">{challenge.title}</h1>
                <Badge className={`${difficultyColors[challenge.difficulty]} capitalize`}>{challenge.difficulty}</Badge>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><CheckCircle className="w-4 h-4" /> {challenge.acceptanceRate}% acceptance</span>
                <span className="flex items-center gap-1"><Code2 className="w-4 h-4" /> {challenge.points} points</span>
                <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {challenge.timeLimit}ms</span>
                <span className="flex items-center gap-1"><MemoryStick className="w-4 h-4" /> {challenge.memoryLimit}MB</span>
              </div>
            </div>

            <Tabs defaultValue="description">
              <TabsList>
                <TabsTrigger value="description" className="gap-1"><BookOpen className="w-4 h-4" /> Description</TabsTrigger>
                <TabsTrigger value="hints" className="gap-1"><Lightbulb className="w-4 h-4" /> Hints ({challenge.hints.length})</TabsTrigger>
                <TabsTrigger value="solution" className="gap-1"><Sparkles className="w-4 h-4" /> Solution</TabsTrigger>
              </TabsList>

              <TabsContent value="description" className="space-y-4 mt-4">
                <p className="text-muted-foreground leading-relaxed">{challenge.problemStatement}</p>
                <Separator />
                <div>
                  <h3 className="font-semibold mb-2">Input Format</h3>
                  <p className="text-sm text-muted-foreground whitespace-pre-line">{challenge.inputFormat}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Output Format</h3>
                  <p className="text-sm text-muted-foreground">{challenge.outputFormat}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Constraints</h3>
                  <p className="text-sm text-muted-foreground whitespace-pre-line">{challenge.constraints}</p>
                </div>
                {challenge.examples.map((ex, i) => (
                  <Card key={i} className="bg-muted/50">
                    <CardContent className="p-4 space-y-2">
                      <p className="font-medium text-sm">Example {i + 1}:</p>
                      <div className="space-y-1">
                        <p className="text-sm"><span className="text-muted-foreground">Input:</span> {ex.input}</p>
                        <p className="text-sm"><span className="text-muted-foreground">Output:</span> {ex.output}</p>
                        {ex.explanation && <p className="text-sm text-muted-foreground"><span className="font-medium">Explanation:</span> {ex.explanation}</p>}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="hints" className="mt-4">
                {challenge.hints.map((hint, i) => (
                  <Card key={i} className="mb-2">
                    <CardContent className="p-4 flex items-start gap-3">
                      <Lightbulb className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                      <p className="text-sm">{hint}</p>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="solution" className="mt-4">
                <Card className="bg-muted/50">
                  <CardContent className="p-4">
                    <p className="text-sm font-medium mb-2">Optimal Solution (Hash Map Approach):</p>
                    <pre className="text-sm bg-background p-4 rounded-lg overflow-x-auto">
{`function solve(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
}`}
                    </pre>
                    <div className="mt-3 space-y-1 text-sm">
                      <p><span className="text-muted-foreground">Time Complexity:</span> O(n)</p>
                      <p><span className="text-muted-foreground">Space Complexity:</span> O(n)</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Code Editor */}
        <div className="flex-1 flex flex-col">
          <div className="flex items-center justify-between p-3 border-b">
            <Select value={language} onValueChange={handleLanguageChange}>
              <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="javascript">JavaScript</SelectItem>
                <SelectItem value="python">Python</SelectItem>
                <SelectItem value="cpp">C++</SelectItem>
                <SelectItem value="java">Java</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="gap-2" onClick={() => setCode(CODE_TEMPLATES[language])}><RotateCcw className="w-4 h-4" /> Reset</Button>
              <Button variant="outline" size="sm" className="gap-2 text-violet-500 hover:text-violet-600 hover:bg-violet-500/10 border-violet-500/30" onClick={handleTrace} disabled={isTracing}><Sparkles className="w-4 h-4" /> {isTracing ? 'Tracing...' : 'Code Tutor'}</Button>
              <Button variant="outline" size="sm" className="gap-2" onClick={handleRun} disabled={isRunning}><Play className="w-4 h-4" /> {isRunning ? 'Running...' : 'Run'}</Button>
              <Button size="sm" className="gap-2" onClick={handleRun} disabled={isRunning}><CheckCircle className="w-4 h-4" /> Submit</Button>
            </div>
          </div>
          <div className="flex-1 flex flex-col">
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="flex-1 p-4 font-mono text-sm bg-background resize-none focus:outline-none"
              spellCheck={false}
            />
            {(output || traceSteps.length > 0 || isTracing || tutorError) && (
              <div className="h-72 border-t bg-muted/30 flex flex-col">
                <div className="flex items-center justify-between border-b px-4 bg-muted/50 shrink-0">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setActiveConsoleTab('output')}
                      className={`px-3 py-2 text-xs font-semibold border-b-2 transition-all ${
                        activeConsoleTab === 'output'
                          ? 'border-primary text-primary'
                          : 'border-transparent text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      CONSOLE OUTPUT
                    </button>
                    <button
                      onClick={() => setActiveConsoleTab('tutor')}
                      className={`px-3 py-2 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
                        activeConsoleTab === 'tutor'
                          ? 'border-primary text-primary'
                          : 'border-transparent text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5 text-violet-500" />
                      CODE TRACE & TUTOR
                    </button>
                  </div>
                </div>

                <div className="flex-1 overflow-auto p-4">
                  {activeConsoleTab === 'output' ? (
                    output ? (
                      <pre className="text-sm font-mono whitespace-pre-wrap">{output}</pre>
                    ) : (
                      <p className="text-xs text-muted-foreground italic">No output. Run or Submit code to see output.</p>
                    )
                  ) : (
                    <div className="h-full flex flex-col">
                      {isTracing ? (
                        <div className="flex-1 flex flex-col items-center justify-center gap-2">
                          <Sparkles className="w-8 h-8 text-violet-500 animate-pulse" />
                          <p className="text-sm text-muted-foreground">AI is simulating your code execution line by line...</p>
                        </div>
                      ) : tutorError ? (
                        <p className="text-sm text-red-500">{tutorError}</p>
                      ) : traceSteps.length > 0 ? (
                        (() => {
                          const step = traceSteps[currentStepIndex];
                          if (!step) return null;
                          return (
                            <div className="flex-1 flex flex-col lg:flex-row gap-4 h-full">
                              {/* Step & Description */}
                              <div className="flex-1 flex flex-col justify-between">
                                <div className="space-y-3">
                                  <div className="flex items-center gap-2">
                                    <Badge variant="outline" className="border-violet-500/30 text-violet-500 bg-violet-500/5 font-semibold">
                                      Line {step.line}
                                    </Badge>
                                    <span className="text-xs font-mono bg-muted px-2 py-1 rounded border overflow-x-auto max-w-full block">
                                      {step.instruction}
                                    </span>
                                  </div>
                                  <p className="text-sm text-foreground bg-violet-500/5 border border-violet-500/10 p-3 rounded-lg leading-relaxed">
                                    {step.explanation}
                                  </p>
                                </div>
                                
                                {/* Step Controls */}
                                <div className="flex items-center gap-3 mt-4">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCurrentStepIndex(0)}
                                    disabled={currentStepIndex === 0}
                                  >
                                    First
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCurrentStepIndex(prev => Math.max(0, prev - 1))}
                                    disabled={currentStepIndex === 0}
                                    className="gap-1"
                                  >
                                    <ChevronLeft className="w-4 h-4" /> Prev
                                  </Button>
                                  <span className="text-xs text-muted-foreground font-medium">
                                    Step {currentStepIndex + 1} of {traceSteps.length}
                                  </span>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCurrentStepIndex(prev => Math.min(traceSteps.length - 1, prev + 1))}
                                    disabled={currentStepIndex === traceSteps.length - 1}
                                    className="gap-1"
                                  >
                                    Next <ChevronRight className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCurrentStepIndex(traceSteps.length - 1)}
                                    disabled={currentStepIndex === traceSteps.length - 1}
                                  >
                                    Last
                                  </Button>
                                </div>
                              </div>

                              {/* Variables Table */}
                              <div className="w-full lg:w-80 flex flex-col">
                                <h4 className="text-xs font-semibold text-muted-foreground mb-2 flex items-center gap-1">
                                  <span>VARIABLES STATE</span>
                                </h4>
                                <div className="flex-1 bg-muted/20 border rounded-lg p-3 overflow-auto space-y-2">
                                  {Object.keys(step.variables || {}).length === 0 ? (
                                    <p className="text-xs text-muted-foreground italic">No local variables initialized yet.</p>
                                  ) : (
                                    Object.entries(step.variables || {}).map(([name, val]) => (
                                      <div key={name} className="flex justify-between items-center bg-background/50 p-2 rounded border border-border/50 text-xs">
                                        <span className="font-mono text-violet-500 font-semibold">{name}</span>
                                        <span className="font-mono text-foreground font-medium overflow-x-auto max-w-[150px] whitespace-nowrap block font-semibold">
                                          {typeof val === 'object' ? JSON.stringify(val) : String(val)}
                                        </span>
                                      </div>
                                    ))
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })()
                      ) : (
                        <div className="flex-1 flex flex-col items-center justify-center gap-2">
                          <Sparkles className="w-8 h-8 text-violet-500/40" />
                          <p className="text-sm text-muted-foreground">Click "Code Tutor" above to generate a step-by-step trace.</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
