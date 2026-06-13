import { useState } from 'react';
import { useParams } from 'react-router';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { mockChallenges } from '@/services/mockData';
import { Play, CheckCircle, Clock, MemoryStick, Lightbulb, BookOpen, Code2, Sparkles, RotateCcw } from 'lucide-react';

const CODE_TEMPLATES: Record<string, string> = {
  javascript: `function solve(nums, target) {\n  // Write your solution here\n  \n}`,
  python: `def solve(nums, target):\n    # Write your solution here\n    pass`,
  cpp: `#include <vector>\nusing namespace std;\n\nvector<int> solve(vector<int>& nums, int target) {\n    // Write your solution here\n    \n}`,
  java: `class Solution {\n    public int[] solve(int[] nums, int target) {\n        // Write your solution here\n        \n    }\n}`,
};

export function ChallengePage() {
  const { id } = useParams();
  const challenge = mockChallenges.find((c) => c._id === id) || mockChallenges[0];
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState(CODE_TEMPLATES.javascript);
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);

  const handleRun = () => {
    setIsRunning(true);
    setOutput('');
    setTimeout(() => {
      setOutput(`Test Case 1: ✅ PASSED\nInput: nums = [2,7,11,15], target = 9\nOutput: [0,1]\nExpected: [0,1]\nTime: 45ms\nMemory: 12.4MB\n\nTest Case 2: ✅ PASSED\nInput: nums = [3,2,4], target = 6\nOutput: [1,2]\nExpected: [1,2]\nTime: 52ms\nMemory: 12.6MB\n\nTest Case 3: ✅ PASSED\nInput: nums = [3,3], target = 6\nOutput: [0,1]\nExpected: [0,1]\nTime: 41ms\nMemory: 12.1MB\n\n✅ All 3 test cases passed!`);
      setIsRunning(false);
    }, 2000);
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
            {output && (
              <div className="h-48 border-t bg-muted/30 p-4 overflow-auto">
                <p className="text-xs font-semibold text-muted-foreground mb-2">OUTPUT</p>
                <pre className="text-sm font-mono whitespace-pre-wrap">{output}</pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
