import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { mockChallenges, mockUser } from '@/services/mockData';
import { Code2, Trophy, Flame, Target, Zap, Clock, Brain, ChevronRight, TrendingUp, Star, Bot, User, Users, Timer, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '@/services/api/client';

const difficultyColors = {
  easy: 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20',
  medium: 'bg-amber-500/10 text-amber-500 hover:bg-amber-500/20',
  hard: 'bg-orange-500/10 text-orange-500 hover:bg-orange-500/20',
  expert: 'bg-red-500/10 text-red-500 hover:bg-red-500/20',
};

export function CodingArenaPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('problems');
  const [challenges, setChallenges] = useState<any[]>(mockChallenges);
  const [isLoading, setIsLoading] = useState(false);
  const [battleState, setBattleState] = useState<'idle' | 'searching' | 'ready' | 'active' | 'finished'>('idle');
  const [battleType, setBattleType] = useState<'ai' | 'peer'>('ai');
  const [opponent, setOpponent] = useState<any>(null);
  const [battleChallenge, setBattleChallenge] = useState<any>(null);
  const [battleCode, setBattleCode] = useState('');
  const [battleLanguage, setBattleLanguage] = useState('javascript');
  const [battleLogs, setBattleLogs] = useState<string[]>([]);
  const [timeRemaining, setTimeRemaining] = useState(300); // 5 mins
  const [userProgress, setUserProgress] = useState(0);
  const [opponentProgress, setOpponentProgress] = useState(0);
  const [battleFeedback, setBattleFeedback] = useState('');
  const [battleSubmitting, setBattleSubmitting] = useState(false);
  const [winner, setWinner] = useState<'user' | 'opponent' | 'draw' | null>(null);

  // Matchmaking effect
  useEffect(() => {
    let timer: any;
    if (battleState === 'searching') {
      timer = setTimeout(() => {
        if (battleType === 'ai') {
          setOpponent({
            name: 'Ollama Bot (AI)',
            avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=ollama',
            rating: 1950,
          });
        } else {
          setOpponent({
            name: 'Emma Wilson',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=emma',
            rating: 1820,
          });
        }
        setBattleChallenge(challenges[0] || mockChallenges[0]);
        setBattleCode(`function solve(nums, target) {\n  // Write your battle solution here\n  \n}`);
        setBattleState('ready');
      }, battleType === 'ai' ? 2000 : 3500);
    }
    return () => clearTimeout(timer);
  }, [battleState, battleType, challenges]);

  // Battle loop effect
  useEffect(() => {
    let timer: any;
    let opponentProgressTimer: any;

    if (battleState === 'active') {
      // Reset timer
      setTimeRemaining(300);
      setUserProgress(0);
      setOpponentProgress(0);

      // Countdown timer
      timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setWinner('draw');
            setBattleState('finished');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // Simulated opponent coding progression
      let currentOppProgress = 0;
      setBattleLogs(['[00:00] Duel started! Both programmers are reading the description.']);
      
      opponentProgressTimer = setInterval(() => {
        if (currentOppProgress >= 100 || battleState !== 'active') {
          clearInterval(opponentProgressTimer);
          return;
        }

        const step = Math.floor(Math.random() * 2) + 1; // 1 or 2
        if (step === 1 && currentOppProgress === 0) {
          currentOppProgress = 25;
          setOpponentProgress(25);
          setBattleLogs((prev) => [...prev, `[00:32] Opponent started writing code template.`]);
        } else if (step === 2 && currentOppProgress === 25) {
          currentOppProgress = 50;
          setOpponentProgress(50);
          setBattleLogs((prev) => [...prev, `[01:15] Opponent is compiling test cases.`]);
        } else if (currentOppProgress === 50) {
          currentOppProgress = 75;
          setOpponentProgress(75);
          setBattleLogs((prev) => [...prev, `[02:05] Opponent passed 1/2 sample tests.`]);
        } else if (currentOppProgress === 75) {
          currentOppProgress = 100;
          setOpponentProgress(100);
          setBattleLogs((prev) => [...prev, `[02:40] Opponent SUBMITTED a correct solution!`]);
          
          setWinner('opponent');
          setBattleState('finished');
          clearInterval(opponentProgressTimer);
        }
      }, 25000);
    }

    return () => {
      clearInterval(timer);
      clearInterval(opponentProgressTimer);
    };
  }, [battleState]);

  const handleBattleSubmit = async () => {
    setBattleSubmitting(true);
    setBattleFeedback('');
    try {
      const response = await apiClient.post<any>(`/coding/challenges/${battleChallenge?._id}/submit`, {
        code: battleCode,
        language: battleLanguage,
      });

      if (response.success) {
        const { status, testCases } = response.data;
        const total = testCases.total || 2;
        const passed = testCases.passed || 0;
        const percent = Math.round((passed / total) * 100);
        setUserProgress(percent);

        if (status === 'accepted') {
          setWinner('user');
          setBattleState('finished');
        } else {
          setBattleFeedback(`Wrong Answer: Passed ${passed}/${total} test cases. Try again!`);
        }
      } else {
        setBattleFeedback(response.error?.message || 'Submission failed.');
      }
    } catch (err: any) {
      setBattleFeedback(`Compilation Error: ${err.message}`);
    } finally {
      setBattleSubmitting(false);
    }
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins}:${remainingSecs < 10 ? '0' : ''}${remainingSecs}`;
  };

  useEffect(() => {
    const fetchChallenges = async () => {
      setIsLoading(true);
      try {
        const response = await apiClient.get<any>('/coding/challenges');
        if (response.success && response.data?.length > 0) {
          setChallenges(response.data);
        }
      } catch (err) {
        console.error('Failed to fetch coding challenges:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchChallenges();
  }, []);

  const userStats = {
    problemsSolved: 142,
    totalProblems: 500,
    currentStreak: 12,
    maxStreak: 45,
    ranking: 23,
    totalParticipants: 1250,
    rating: mockUser.scores?.codingRating || 1850,
  };

  if (battleState === 'active') {
    return (
      <div className="h-[calc(100vh-8rem)] -mx-4 lg:-mx-8 -mt-4 flex flex-col bg-background">
        {/* Duel Header */}
        <div className="bg-background border-b px-6 py-4 flex items-center justify-between shadow-sm shrink-0">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
              <span className="font-bold text-sm text-red-500 uppercase tracking-widest">LIVE DUEL</span>
            </div>
            <div className="h-4 w-[1px] bg-border" />
            <h2 className="font-semibold text-lg">{battleChallenge?.title}</h2>
          </div>
          
          <div className="flex items-center gap-6">
            {/* Timer */}
            <div className="flex items-center gap-2 bg-muted px-4 py-2 rounded-lg border">
              <Timer className="w-4 h-4 text-primary" />
              <span className="font-mono font-bold text-sm">{formatTime(timeRemaining)}</span>
            </div>
            
            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                setWinner('opponent');
                setBattleState('finished');
              }}
            >
              Forfeit Match
            </Button>
          </div>
        </div>

        {/* Duel Workspace */}
        <div className="flex-1 flex flex-col lg:flex-row min-h-0">
          {/* Left panel: Problem details */}
          <div className="w-full lg:w-[35%] border-r overflow-auto p-6 space-y-6">
            <div>
              <h3 className="text-xl font-bold mb-2">{battleChallenge?.title}</h3>
              <Badge className="capitalize bg-emerald-500/10 text-emerald-500 mb-4">{battleChallenge?.difficulty}</Badge>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {battleChallenge?.problemStatement}
              </p>
            </div>
            
            <Separator />
            
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-sm mb-1">Constraints:</h4>
                <p className="text-xs text-muted-foreground whitespace-pre-line">{battleChallenge?.constraints}</p>
              </div>
              <div>
                <h4 className="font-semibold text-sm mb-1">Input Format:</h4>
                <p className="text-xs text-muted-foreground whitespace-pre-line">{battleChallenge?.inputFormat}</p>
              </div>
              <div>
                <h4 className="font-semibold text-sm mb-1">Output Format:</h4>
                <p className="text-xs text-muted-foreground whitespace-pre-line">{battleChallenge?.outputFormat}</p>
              </div>
            </div>
          </div>

          {/* Middle: Code Editor */}
          <div className="flex-1 flex flex-col min-w-0 border-r">
            <div className="flex items-center justify-between p-3 border-b bg-muted/20">
              <Select value={battleLanguage} onValueChange={setBattleLanguage}>
                <SelectTrigger className="w-36 h-8 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="javascript">JavaScript</SelectItem>
                  <SelectItem value="python">Python</SelectItem>
                </SelectContent>
              </Select>
              
              <Button
                size="sm"
                className="h-8 bg-violet-600 hover:bg-violet-700 gap-1.5"
                onClick={handleBattleSubmit}
                disabled={battleSubmitting}
              >
                <CheckCircle className="w-4 h-4" />
                {battleSubmitting ? 'Compiling...' : 'Submit Battle Solution'}
              </Button>
            </div>
            
            <div className="flex-1 relative">
              <textarea
                value={battleCode}
                onChange={(e) => setBattleCode(e.target.value)}
                className="absolute inset-0 p-4 font-mono text-sm bg-background resize-none focus:outline-none overflow-auto"
                spellCheck={false}
              />
            </div>

            {battleFeedback && (
              <div className="h-32 border-t bg-muted/40 p-4 overflow-auto shrink-0">
                <p className="text-xs font-semibold text-red-500 mb-1">DUEL FEEDBACK</p>
                <pre className="text-xs font-mono text-foreground whitespace-pre-wrap">{battleFeedback}</pre>
              </div>
            )}
          </div>

          {/* Right panel: Competitors Progress & Logs */}
          <div className="w-full lg:w-[25%] overflow-auto p-6 flex flex-col bg-muted/10">
            {/* Live Progress comparison */}
            <div className="space-y-6 shrink-0">
              <h3 className="font-bold text-xs text-muted-foreground uppercase tracking-wider">BATTLE PROGRESS</h3>
              
              {/* User Progress */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold flex items-center gap-1"><User className="w-3.5 h-3.5 text-primary" /> You</span>
                  <span className="font-mono">{userProgress}%</span>
                </div>
                <Progress value={userProgress} className="h-2" />
              </div>

              {/* Opponent Progress */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold flex items-center gap-1">
                    {battleType === 'ai' ? <Bot className="w-3.5 h-3.5 text-violet-500" /> : <Users className="w-3.5 h-3.5 text-blue-500" />}
                    {opponent?.name}
                  </span>
                  <span className="font-mono">{opponentProgress}%</span>
                </div>
                <Progress value={opponentProgress} className="h-2" />
              </div>
            </div>

            <Separator className="my-6 shrink-0" />

            {/* Duel Logs */}
            <div className="flex-1 flex flex-col min-h-0">
              <h3 className="font-bold text-xs text-muted-foreground uppercase tracking-wider mb-3 shrink-0">LIVE ARENA FEED</h3>
              <div className="flex-1 bg-background border rounded-lg p-3 overflow-auto font-mono text-[10px] space-y-2 leading-relaxed">
                {battleLogs.map((log, index) => (
                  <div key={index} className="text-muted-foreground">
                    {log}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (battleState === 'finished') {
    return (
      <div className="h-[calc(100vh-8rem)] flex items-center justify-center">
        <Card className="w-full max-w-md border-2 border-primary/20 shadow-2xl relative overflow-hidden bg-background">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-600 to-indigo-600 opacity-5 blur animate-pulse" />
          <CardContent className="p-8 text-center space-y-6 relative">
            {winner === 'user' ? (
              <div className="space-y-3">
                <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto border border-emerald-500/30">
                  <Trophy className="w-10 h-10 text-emerald-500" />
                </div>
                <h2 className="text-3xl font-extrabold text-emerald-500 tracking-tight">VICTORY!</h2>
                <p className="text-muted-foreground text-sm">
                  You successfully solved the challenge before your opponent and passed 100% of all tests!
                </p>
              </div>
            ) : winner === 'opponent' ? (
              <div className="space-y-3">
                <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center mx-auto border border-red-500/30">
                  <Bot className="w-10 h-10 text-red-500" />
                </div>
                <h2 className="text-3xl font-extrabold text-red-500 tracking-tight">DEFEAT!</h2>
                <p className="text-muted-foreground text-sm">
                  {opponent?.name} submitted the correct solution faster. Keep practicing to improve!
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto border">
                  <Clock className="w-10 h-10 text-muted-foreground" />
                </div>
                <h2 className="text-3xl font-extrabold text-muted-foreground tracking-tight">TIME LIMIT EXCEEDED</h2>
                <p className="text-muted-foreground text-sm">
                  Neither programmer could submit a correct solution before the timer ran out.
                </p>
              </div>
            )}

            <Separator />

            <div className="bg-muted/40 p-4 rounded-xl space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Opponent:</span>
                <span className="font-semibold">{opponent?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Rating Gained:</span>
                <span className={`font-mono font-bold ${winner === 'user' ? 'text-emerald-500' : 'text-red-500'}`}>
                  {winner === 'user' ? '+25' : winner === 'opponent' ? '-15' : '0'}
                </span>
              </div>
            </div>

            <Button
              className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white"
              onClick={() => {
                setBattleState('idle');
                setActiveTab('battle');
              }}
            >
              Return to Battle Lobby
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2"><Code2 className="w-6 h-6 text-primary" /> Coding Arena</h1>
          <p className="text-muted-foreground">Practice, compete, and level up your coding skills</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2" onClick={() => navigate('/leaderboard')}><Trophy className="w-4 h-4" /> Leaderboard</Button>
          <Button className="gap-2"><Zap className="w-4 h-4" /> Daily Challenge</Button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <Target className="w-5 h-5 text-emerald-500" />
              <Badge variant="secondary">{Math.round((userStats.problemsSolved / userStats.totalProblems) * 100)}%</Badge>
            </div>
            <p className="text-2xl font-bold mt-2">{userStats.problemsSolved}</p>
            <p className="text-xs text-muted-foreground">Problems Solved</p>
            <Progress value={(userStats.problemsSolved / userStats.totalProblems) * 100} className="mt-2 h-1.5" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <Flame className="w-5 h-5 text-orange-500" />
              <Badge variant="secondary" className="text-orange-500">Hot!</Badge>
            </div>
            <p className="text-2xl font-bold mt-2">{userStats.currentStreak}</p>
            <p className="text-xs text-muted-foreground">Day Streak</p>
            <Progress value={(userStats.currentStreak / userStats.maxStreak) * 100} className="mt-2 h-1.5" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <Star className="w-5 h-5 text-amber-500" />
            </div>
            <p className="text-2xl font-bold mt-2">{userStats.rating}</p>
            <p className="text-xs text-muted-foreground">Rating</p>
            <Progress value={(userStats.rating / 3000) * 100} className="mt-2 h-1.5" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <TrendingUp className="w-5 h-5 text-blue-500" />
              <Badge variant="secondary">Top {Math.round((userStats.ranking / userStats.totalParticipants) * 100)}%</Badge>
            </div>
            <p className="text-2xl font-bold mt-2">#{userStats.ranking}</p>
            <p className="text-xs text-muted-foreground">Rank</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="problems" className="gap-2"><Code2 className="w-4 h-4" /> Problems</TabsTrigger>
          <TabsTrigger value="battle" className="gap-2"><Zap className="w-4 h-4 text-violet-500" /> Duel Arena</TabsTrigger>
          <TabsTrigger value="contests" className="gap-2"><Trophy className="w-4 h-4" /> Contests</TabsTrigger>
          <TabsTrigger value="daily" className="gap-2"><Brain className="w-4 h-4" /> Daily Challenge</TabsTrigger>
        </TabsList>

        <TabsContent value="problems" className="mt-6">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle>Problem Set</CardTitle>
                <div className="flex gap-2">
                  {(['all', 'easy', 'medium', 'hard'] as const).map((d) => (
                    <Badge key={d} variant="outline" className="capitalize cursor-pointer hover:bg-accent">{d}</Badge>
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {challenges.map((challenge) => (
                <div
                  key={challenge._id}
                  onClick={() => navigate(`/coding/challenge/${challenge._id}`)}
                  className="flex items-center gap-4 p-4 rounded-xl hover:bg-accent transition-all cursor-pointer group"
                >
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                    <Code2 className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium group-hover:text-primary transition-colors">{challenge.title}</p>
                      <Badge className={`${difficultyColors[challenge.difficulty as keyof typeof difficultyColors]} capitalize text-[10px]`}>{challenge.difficulty}</Badge>
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Target className="w-3 h-3" /> {challenge.points} pts</span>
                      <span className="flex items-center gap-1"><Code2 className="w-3 h-3" /> {challenge.acceptanceRate}% acceptance</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {challenge.timeLimit}ms</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1 shrink-0">
                    {challenge.tags.slice(0, 2).map((t: string) => (
                      <Badge key={t} variant="secondary" className="text-[10px]">{t}</Badge>
                    ))}
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="battle" className="mt-6">
          {battleState === 'idle' && (
            <Card className="relative overflow-hidden border-2 border-violet-500/20 bg-background">
              <div className="absolute top-0 right-0 w-80 h-80 bg-violet-500/10 rounded-full blur-3xl -z-10" />
              <CardContent className="p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-4 max-w-xl">
                  <div className="inline-flex items-center gap-1.5 bg-violet-500/10 text-violet-500 px-3 py-1 rounded-full text-xs font-semibold">
                    <Zap className="w-3.5 h-3.5" />
                    New Gamified Battle Mode
                  </div>
                  <h2 className="text-2xl font-bold tracking-tight">1v1 Code Duel Arena</h2>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Compete live in real time against online peers or hone your skills against our advanced AI coder. First to pass all test cases wins the rating boost!
                  </p>
                  
                  <div className="flex flex-wrap gap-4 pt-2">
                    <Button
                      onClick={() => {
                        setBattleType('ai');
                        setBattleState('searching');
                      }}
                      className="bg-violet-600 hover:bg-violet-700 text-white gap-2 font-bold"
                    >
                      <Bot className="w-4 h-4" />
                      Battle Computer (AI)
                    </Button>
                    <Button
                      onClick={() => {
                        setBattleType('peer');
                        setBattleState('searching');
                      }}
                      variant="outline"
                      className="border-violet-500/30 text-violet-500 hover:bg-violet-500/10 gap-2 font-bold"
                    >
                      <Users className="w-4 h-4" />
                      Find Peer Duel Match
                    </Button>
                  </div>
                </div>
                
                <div className="w-40 h-40 rounded-full bg-violet-500/5 flex items-center justify-center border border-violet-500/10 shrink-0">
                  <Zap className="w-16 h-16 text-violet-500 animate-pulse" />
                </div>
              </CardContent>
            </Card>
          )}

          {battleState === 'searching' && (
            <Card className="border border-violet-500/20 bg-background">
              <CardContent className="p-12 text-center space-y-6">
                <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border-4 border-violet-500/20 border-t-violet-500 animate-spin" />
                  <Search className="w-8 h-8 text-violet-500 animate-bounce" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-bold">ProjectVerse Duel Matchmaking</h3>
                  <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                    {battleType === 'ai'
                      ? 'Initializing AI agent nodes and loading problem sets...'
                      : 'Connecting to lobby pool. Looking for online peers near your rating...'}
                  </p>
                </div>
                <Button variant="ghost" onClick={() => setBattleState('idle')} className="text-muted-foreground hover:text-foreground">
                  Cancel Search
                </Button>
              </CardContent>
            </Card>
          )}

          {battleState === 'ready' && (
            <Card className="border-2 border-violet-500 bg-background shadow-xl">
              <CardContent className="p-8 space-y-8 text-center">
                <div className="flex items-center justify-center gap-8 md:gap-16">
                  {/* You */}
                  <div className="space-y-2">
                    <div className="w-16 h-16 rounded-full border-2 border-primary overflow-hidden mx-auto">
                      <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=john" alt="User avatar" className="w-full h-full" />
                    </div>
                    <p className="font-bold text-sm">You</p>
                    <Badge variant="secondary" className="font-mono">1850</Badge>
                  </div>

                  {/* VS */}
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-extrabold text-lg flex items-center justify-center shadow-lg animate-bounce">
                    VS
                  </div>

                  {/* Opponent */}
                  <div className="space-y-2">
                    <div className="w-16 h-16 rounded-full border-2 border-violet-500 overflow-hidden bg-violet-500/5 mx-auto flex items-center justify-center">
                      <img src={opponent?.avatar} alt="Opponent avatar" className="w-full h-full" />
                    </div>
                    <p className="font-bold text-sm">{opponent?.name}</p>
                    <Badge variant="secondary" className="font-mono">{opponent?.rating}</Badge>
                  </div>
                </div>

                <div className="max-w-md mx-auto bg-muted/50 p-4 rounded-xl space-y-2 border">
                  <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">CHALLENGE SELECTION</p>
                  <h4 className="font-bold text-lg">{battleChallenge?.title}</h4>
                  <div className="flex gap-2 justify-center">
                    <Badge className="bg-emerald-500/10 text-emerald-500 capitalize">{battleChallenge?.difficulty}</Badge>
                    <Badge variant="outline">{battleChallenge?.points} points</Badge>
                  </div>
                </div>

                <Button
                  onClick={() => setBattleState('active')}
                  className="px-8 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-bold gap-2 shadow-lg"
                >
                  <Play className="w-4 h-4" />
                  START DUEL BATTLE
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="contests" className="mt-6">
          <Card>
            <CardContent className="p-8 text-center">
              <Trophy className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-lg font-semibold">Weekly Coding Contest</h3>
              <p className="text-muted-foreground mt-2">Next contest starts in 2 days. Prepare yourself!</p>
              <div className="flex justify-center gap-4 mt-6">
                <div className="text-center">
                  <p className="text-3xl font-bold">02</p>
                  <p className="text-xs text-muted-foreground">Days</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold">14</p>
                  <p className="text-xs text-muted-foreground">Hours</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold">35</p>
                  <p className="text-xs text-muted-foreground">Minutes</p>
                </div>
              </div>
              <Button className="mt-6 gap-2"><Zap className="w-4 h-4" /> Register Now</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="daily" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Flame className="w-5 h-5 text-orange-500" /> Today&apos;s Challenge</CardTitle>
              <CardDescription>Solve today&apos;s problem to maintain your streak!</CardDescription>
            </CardHeader>
            <CardContent>
              <div onClick={() => navigate('/coding/challenge/1')} className="p-6 rounded-xl border hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-semibold">Two Sum</h3>
                    <p className="text-muted-foreground mt-1">Given an array of integers and a target, return indices of two numbers that add up to target.</p>
                    <div className="flex gap-2 mt-3">
                      <Badge className="bg-emerald-500/10 text-emerald-500">Easy</Badge>
                      <Badge variant="secondary">10 points</Badge>
                      <Badge variant="secondary">Array</Badge>
                    </div>
                  </div>
                  <Button>Solve Now</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
