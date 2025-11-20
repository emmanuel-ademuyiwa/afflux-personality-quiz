import {
  ArrowUpRight,
  Camera,
  Copy,
  Crown,
  Download,
  Share2,
  Sparkles,
  TrendingUp,
  Trophy,
  Users,
  Zap,
  Target,
  Lightbulb,
} from "lucide-react";
import * as React from "react";
import { useFetcher, useLoaderData } from "react-router";

import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Progress } from "~/components/ui/progress";
import { cn } from "~/lib/utils";
import type { Route } from "./+types/home";
import { toPng } from "html-to-image";

type PersonaId = "saver" | "spender" | "investor";

type QuestionOption = {
  letter: "A" | "B" | "C";
  label: string;
  value: PersonaId;
};

type Question = {
  id: string;
  title: string;
  helper: string;
  options: QuestionOption[];
};

type Leaderboard = Record<PersonaId, number>;
type Highlight = {
  name: string;
  city: string;
  persona: PersonaId;
  quote: string;
};
type LoaderData = {
  leaderboard: Leaderboard;
  featured: Highlight[];
};

const questionBank: Question[] = [
  {
    id: "q1",
    title: "When you receive money, what’s the first thing you do?",
    helper: "Salary, gifts or allowance — your reflex matters.",
    options: [
      {
        letter: "A",
        label: "Transfer a portion to savings or set it aside.",
        value: "saver",
      },
      { letter: "B", label: "Buy something I’ve wanted.", value: "spender" },
      {
        letter: "C",
        label: "Check how I can make that money grow.",
        value: "investor",
      },
    ],
  },
  {
    id: "q2",
    title: "How do you feel about budgeting?",
    helper: "Your money mindset in one word.",
    options: [
      {
        letter: "A",
        label: "It gives me peace of mind and control.",
        value: "saver",
      },
      {
        letter: "B",
        label: "It feels restrictive — life is short.",
        value: "spender",
      },
      {
        letter: "C",
        label: "I budget to see what I can reinvest.",
        value: "investor",
      },
    ],
  },
  {
    id: "q3",
    title: "You see a “Buy Now, Pay Later” gadget offer. What happens?",
    helper: "Delayed gratification vs instant joy.",
    options: [
      {
        letter: "A",
        label: "Ignore it; I’d rather save up properly.",
        value: "saver",
      },
      {
        letter: "B",
        label: "Buy immediately — future me will sort it.",
        value: "spender",
      },
      {
        letter: "C",
        label: "Ask about interest and calculate the upside.",
        value: "investor",
      },
    ],
  },
  {
    id: "q4",
    title: "How often do you review your accounts?",
    helper: "Bank statements, apps, alerts — how close are you?",
    options: [
      {
        letter: "A",
        label: "Weekly. I like keeping tabs.",
        value: "saver",
      },
      {
        letter: "B",
        label: "Rarely. It gives me anxiety.",
        value: "spender",
      },
      {
        letter: "C",
        label: "Monthly. I check growth and set new targets.",
        value: "investor",
      },
    ],
  },
  {
    id: "q5",
    title: "When you think about money, what comes first?",
    helper: "Security, comfort or freedom?",
    options: [
      {
        letter: "A",
        label: "Security — I want to be prepared.",
        value: "saver",
      },
      {
        letter: "B",
        label: "Comfort — I want to enjoy life.",
        value: "spender",
      },
      {
        letter: "C",
        label: "Freedom — I want my money to work.",
        value: "investor",
      },
    ],
  },
  {
    id: "q6",
    title: "How do you usually make financial decisions?",
    helper: "Research-driven, instinctive, or strategic?",
    options: [
      {
        letter: "A",
        label: "Carefully — research first, act later.",
        value: "saver",
      },
      {
        letter: "B",
        label: "Impulsively — I go with the vibe.",
        value: "spender",
      },
      {
        letter: "C",
        label: "Strategically — assess risk and return.",
        value: "investor",
      },
    ],
  },
  {
    id: "q7",
    title: "₦500,000 hits your account today. What’s the play?",
    helper: "Windfalls reveal true instincts.",
    options: [
      {
        letter: "A",
        label: "Save most, treat myself a little.",
        value: "saver",
      },
      {
        letter: "B",
        label: "Shop or travel. Instant happiness!",
        value: "spender",
      },
      {
        letter: "C",
        label: "Invest in something that multiplies it.",
        value: "investor",
      },
    ],
  },
  {
    id: "q8",
    title: "How often do you talk about money?",
    helper: "Silence, vibes, or strategy sessions?",
    options: [
      {
        letter: "A",
        label: "Only when necessary.",
        value: "saver",
      },
      {
        letter: "B",
        label: "Always — I love gist about what to buy.",
        value: "spender",
      },
      {
        letter: "C",
        label: "Frequently around business and opportunities.",
        value: "investor",
      },
    ],
  },
  {
    id: "q9",
    title: "How do you define money success?",
    helper: "Different versions of winning.",
    options: [
      {
        letter: "A",
        label: "Emergency-ready and steady.",
        value: "saver",
      },
      {
        letter: "B",
        label: "Living comfortably and looking good.",
        value: "spender",
      },
      {
        letter: "C",
        label: "Passive income and time freedom.",
        value: "investor",
      },
    ],
  },
  {
    id: "q10",
    title: "If you had to choose one, what would it be?",
    helper: "Your north star.",
    options: [
      { letter: "A", label: "Stability.", value: "saver" },
      { letter: "B", label: "Lifestyle.", value: "spender" },
      { letter: "C", label: "Growth.", value: "investor" },
    ],
  },
];

const personaDeck: Record<
  PersonaId,
  {
    id: PersonaId;
    title: string;
    headline: string;
    personality: string;
    strength: string;
    weakness: string;
    affluxTip: string;
  }
> = {
  saver: {
    id: "saver",
    title: "The Saver",
    headline: "Disciplined. Protective. Future-focused.",
    personality:
      "Structure is your love language. You control your cash flow and feel safest when your money is sheltered.",
    strength: "Consistency — you build stability brick by brick.",
    weakness: "Risk aversion — growth moves feel intimidating.",
    affluxTip:
      "Explore flexible property savings or micro-investments that keep your safety net intact while compounding quietly.",
  },
  spender: {
    id: "spender",
    title: "The Spender",
    headline: "Vibrant. Experience-driven. Reward-oriented.",
    personality:
      "Money is meant to be enjoyed and you know exactly how to make life beautiful in the moment.",
    strength: "Joy — you celebrate milestones and reward yourself.",
    weakness:
      "Impulse decisions — shawarma today, sneakers tomorrow, mortgage later.",
    affluxTip:
      "Channel that consistency into wealth goals. Track wants vs goals, then plug into Afflux communities to learn smarter growth plays.",
  },
  investor: {
    id: "investor",
    title: "The Investor",
    headline: "Strategic. Ambitious. Growth-obsessed.",
    personality:
      "You see money as soldiers on a mission. Compounding, multiples and delayed gratification excite you.",
    strength: "Vision — you know how to delay now for scale later.",
    weakness:
      "Over-analysis — sometimes you miss the vibes or overload on risk.",
    affluxTip:
      "Keep showing up for your future self. Build the discipline you’ll need when it’s time to lock in real estate assets.",
  },
};

type PersonaDetails = (typeof personaDeck)[PersonaId];

type ActionData = {
  result: PersonaDetails;
  tallies: Leaderboard;
  leaderboard: Leaderboard;
  share: typeof defaultSharePayload;
};

const leaderboardSeed: Leaderboard = {
  saver: 382,
  spender: 247,
  investor: 461,
};

const featuredMoments: Highlight[] = [
  {
    name: "Imade",
    city: "Lekki",
    persona: "saver",
    quote: "Turned monthly rent money into a land deposit.",
  },
  {
    name: "Kunle",
    city: "Ibadan",
    persona: "spender",
    quote: "Swapped impulse buys for a lifestyle sinking fund.",
  },
  {
    name: "Ada",
    city: "Abuja",
    persona: "investor",
    quote: "Built a ₦2.5M down payment in 11 months.",
  },
];

const defaultSharePayload = {
  title: "Afflux Money Personality Quiz",
  message:
    "I’m discovering whether I’m a Saver, Spender or Investor with Afflux. Jump in and get your own card.",
  url: "https://afflux.ng/quiz",
};

function evaluateResult(tallies: Leaderboard): PersonaId {
  const entries = Object.entries(tallies) as [PersonaId, number][];
  entries.sort((a, b) => b[1] - a[1]);
  return entries[0]?.[0] ?? "saver";
}

function isPersona(value: FormDataEntryValue | null): value is PersonaId {
  return value === "saver" || value === "spender" || value === "investor";
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Afflux Money Personality Quiz" },
    {
      name: "description",
      content:
        "Discover if you’re a Saver, Spender, or Investor and unlock tailored property wealth moves with Afflux.",
    },
  ];
}

export async function loader() {
  return Response.json({
    leaderboard: leaderboardSeed,
    featured: featuredMoments,
  });
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const answers: PersonaId[] = [];

  for (const question of questionBank) {
    const value = formData.get(question.id);
    if (!isPersona(value)) {
      throw new Response(`Missing answer for ${question.title}`, {
        status: 400,
      });
    }
    answers.push(value);
  }

  const tallies: Leaderboard = {
    saver: 0,
    spender: 0,
    investor: 0,
  };

  for (const answer of answers) {
    tallies[answer] += 1;
  }

  const personaId = evaluateResult(tallies);
  const persona = personaDeck[personaId];
  const leaderboard: Leaderboard = {
    ...leaderboardSeed,
    [personaId]: leaderboardSeed[personaId] + 1,
  };

  const shareMessage = `I just took the Afflux Money Personality Quiz and I’m ${persona.title}! ${persona.headline} Discover yours via Afflux.`;

  return Response.json({
    result: persona,
    tallies,
    leaderboard,
    share: {
      title: persona.title,
      message: shareMessage,
      url: "https://afflux.ng/quiz",
    },
  });
}

export default function Home() {
  const { leaderboard: initialLeaderboard, featured } =
    useLoaderData<LoaderData>();
  const fetcher = useFetcher<ActionData>();

  const [answers, setAnswers] = React.useState<Record<string, PersonaId>>({});
  const resultCardRef = React.useRef<HTMLDivElement>(null);

  const answeredCount = React.useMemo(
    () => Object.keys(answers).length,
    [answers]
  );
  const progressValue = (answeredCount / questionBank.length) * 100;

  const isSubmitting = fetcher.state !== "idle";
  const result = fetcher.data?.result;
  const tallies = fetcher.data?.tallies;
  const leaderboard = fetcher.data?.leaderboard ?? initialLeaderboard;
  const sharePayload = fetcher.data?.share ?? defaultSharePayload;
  const totalLeaderboardVotes =
    leaderboard.saver + leaderboard.spender + leaderboard.investor || 1;

  const formRef = React.useRef<HTMLFormElement>(null);

  // React.useEffect(() => {
  //   if (fetcher.state === "idle" && fetcher.data?.result) {
  //     formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  //   }
  // }, [fetcher.state, fetcher.data]);

  async function downloadResultCard() {
    if (!resultCardRef.current) return;
    const dataUrl = await toPng(resultCardRef.current, {
      backgroundColor: "#050505",
      cacheBust: true,
      pixelRatio: 2,
    });
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = `afflux-${result?.id ?? "quiz"}.png`;
    link.click();
  }

  async function copyShareMessage() {
    if (typeof navigator === "undefined" || !navigator.clipboard) {
      return;
    }
    await navigator.clipboard.writeText(
      `${sharePayload.message} ${sharePayload.url}`
    );
  }

  async function shareNative() {
    if (typeof navigator === "undefined") {
      return;
    }
    if ("share" in navigator && typeof navigator.share === "function") {
      await navigator.share({
        title: sharePayload.title,
        text: sharePayload.message,
        url: sharePayload.url,
      });
    } else {
      await copyShareMessage();
    }
  }

  return (
    <>
      <div className="min-h-screen text-[#0f0f0f]">
        <main className="mx-auto flex max-w-6xl flex-col gap-10 px-4 pb-24 pt-12">
          <header className="rounded-[40px] md:border border-[#E5E5E5] bg-linear-to-r from-white via-[#FAFAFA] to-white md:p-8 grid-gold md:shadow-sm">
            <div className="relative z-10 flex flex-col gap-8 md:grid md:grid-cols-[1.2fr_0.8fr] md:items-center">
              <div className="space-y-6">
                <div className="space-y-4">
                  <Badge className="border-[#cc9933]/50 bg-[#cc9933]/10 text-[#cc9933] text-xs font-medium px-3 py-1.5">
                    Afflux Money Personality Quiz
                  </Badge>
                  <h1 className="text-4xl md:text-6xl font-bold leading-[1.1] tracking-tight text-[#0f0f0f]">
                    Discover Your
                    <br />
                    <span className="text-[#cc9933]">Money Personality</span>
                  </h1>
                  <p className="text-sm md:text-base text-[#666] max-w-2xl leading-relaxed">
                    Are you a{" "}
                    <span className="font-semibold text-[#1a1a1a]">Saver</span>,{" "}
                    <span className="font-semibold text-[#1a1a1a]">
                      Spender
                    </span>
                    , or{" "}
                    <span className="font-semibold text-[#1a1a1a]">
                      Investor
                    </span>
                    ? Take our 3-minute quiz to unlock personalized property
                    wealth strategies tailored to your financial instincts.
                  </p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto"
                    onClick={() =>
                      formRef.current?.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                      })
                    }
                  >
                    Take the quiz
                    <ArrowUpRight className="ml-2 h-5 w-5" />
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto"
                    onClick={shareNative}
                  >
                    Share leaderboard
                    <Share2 className="ml-2 h-5 w-5" />
                  </Button>
                </div>
                <div className="flex flex-col gap-4 text-sm text-[#888] sm:flex-row sm:flex-wrap sm:gap-6">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-[#cc9933]" /> 1,090 community
                    responses
                  </div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-[#cc9933]" /> Tailored
                    Afflux property guidance
                  </div>
                  <div className="flex items-center gap-2">
                    <Trophy className="h-4 w-4 text-[#cc9933]" /> Unlock
                    shareable result card
                  </div>
                </div>
              </div>
              <Card className="relative isolate overflow-hidden border-[#E5E5E5] bg-white shadow-sm">
                <CardContent className="relative z-10 space-y-4 p-6 sm:p-8">
                  <div className="flex items-center gap-3 text-[#1a1a1a]">
                    <div className="rounded-2xl bg-[#F5F5F5] p-3">
                      <TrendingUp className="h-6 w-6 text-[#cc9933]" />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.3em] text-[#888]">
                        Live leaderboard
                      </p>
                      <p className="text-sm text-[#333]">
                        Track how the community votes
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {(Object.entries(leaderboard) as [PersonaId, number][]).map(
                      ([personaId, score]) => {
                        const persona = personaDeck[personaId];
                        const percent = Math.round(
                          (score / totalLeaderboardVotes) * 100
                        );
                        return (
                          <div key={personaId} className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="font-medium text-[#1a1a1a]">
                                {persona.title}
                              </span>
                              <span className="text-[#666]">{percent}%</span>
                            </div>
                            <Progress value={percent} />
                          </div>
                        );
                      }
                    )}
                  </div>
                  <p className="text-xs text-[#999]">
                    Refreshes whenever someone submits their archetype.
                  </p>
                </CardContent>
              </Card>
            </div>
          </header>

          <section className="grid gap-10 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,0.7fr)]">
            <Card className="border-[#E5E5E5] bg-white border-none shadow-none p-0 md:p-6 md:border md:shadow-sm">
              <CardHeader className="p-0 pb-0 sm:p-8 sm:pb-0">
                <CardTitle className="flex items-center justify-between text-[#1a1a1a]">
                  Quiz Progress
                  <span className="text-base font-normal text-[#666]">
                    {answeredCount}/{questionBank.length} answered
                  </span>
                </CardTitle>
                <CardDescription className="text-[#666]">
                  Tap into your instinct per question. No overthinking — just
                  your honest reactions.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0 pt-4 sm:p-8 sm:pt-6">
                <Progress value={progressValue} className="mb-8" />
                <fetcher.Form method="post" ref={formRef} className="space-y-8">
                  {questionBank.map((question, idx) => (
                    <div
                      key={question.id}
                      className="rounded-3xl border border-[#E5E5E5] bg-white p-6 shadow-sm space-y-6 hover:shadow-md transition-shadow"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                          <p className="text-sm uppercase mb-3 tracking-[0.4em] text-[#999]">
                            Question {idx + 1}
                          </p>
                          <h3 className="md:text-xl font-semibold text-[#1a1a1a]">
                            {question.title}
                          </h3>
                          <p className="text-sm text-[#666]">
                            {question.helper}
                          </p>
                        </div>
                      </div>
                      <div className="grid gap-3">
                        {question.options.map((option) => {
                          const optionId = `${question.id}-${option.value}`;
                          const selected =
                            answers[question.id] === option.value;
                          return (
                            <div key={option.letter} className="group">
                              <input
                                id={optionId}
                                type="radio"
                                name={question.id}
                                value={option.value}
                                checked={selected}
                                onChange={(event) => {
                                  setAnswers((prev) => ({
                                    ...prev,
                                    [question.id]: event.target
                                      .value as PersonaId,
                                  }));
                                }}
                                className="peer sr-only"
                              />
                              <label
                                htmlFor={optionId}
                                className={cn(
                                  "flex cursor-pointer flex-col gap-4 rounded-2xl border p-4 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#cc9933]/60 sm:flex-row sm:items-center sm:justify-between",
                                  selected
                                    ? "border-[#cc9933] bg-[#cc9933]/10"
                                    : "border-[#E5E5E5] bg-[#FAFAFA] hover:border-[#cc9933]/30"
                                )}
                              >
                                <div className="flex w-full items-start gap-4 text-left sm:items-center">
                                  <span
                                    className={cn(
                                      "flex h-10 min-w-10 items-center justify-center rounded-2xl border text-sm font-semibold",
                                      selected
                                        ? "border-[#cc9933] bg-[#cc9933] text-black"
                                        : "border-[#E5E5E5] bg-white text-[#666]"
                                    )}
                                  >
                                    {option.letter}
                                  </span>
                                  <span
                                    className={cn(
                                      "text-sm sm:text-base",
                                      selected
                                        ? "text-[#1a1a1a]"
                                        : "text-[#333]"
                                    )}
                                  >
                                    {option.label}
                                  </span>
                                </div>
                                <span
                                  className={cn(
                                    "h-4 w-4 rounded-full border self-end sm:self-center",
                                    selected
                                      ? "border-[#cc9933] bg-[#cc9933]"
                                      : "border-[#CCC]"
                                  )}
                                  aria-hidden
                                />
                              </label>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                  <div className="flex flex-col gap-3 pt-4 sm:flex-row">
                    <Button
                      type="submit"
                      size="lg"
                      className="w-full sm:w-auto"
                      disabled={
                        answeredCount !== questionBank.length || isSubmitting
                      }
                    >
                      {isSubmitting ? "Scoring..." : "See my money persona"}
                      <Crown className="ml-2 h-5 w-5" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      className="w-full sm:w-auto"
                      onClick={() => {
                        setAnswers({});
                        formRef.current?.reset();
                      }}
                      disabled={isSubmitting}
                    >
                      Reset answers
                    </Button>
                  </div>
                </fetcher.Form>
              </CardContent>
            </Card>

            <div className="space-y-8">
              {result && (
                <Card
                  ref={resultCardRef}
                  className="relative overflow-hidden border-[#cc9933]/20 bg-linear-to-br from-white via-[#FFFBF5] to-white shadow-lg"
                >
                  {/* Decorative gradient overlay */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-linear-to-br from-[#cc9933]/5 to-transparent rounded-full blur-3xl pointer-events-none" />

                  <CardHeader className="relative p-8 pb-6">
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="space-y-2">
                        <Badge className="border-[#cc9933]/60 bg-[#cc9933]/10 text-[#cc9933] text-[10px] font-semibold px-3 py-1">
                          Your Money Personality
                        </Badge>
                        <CardTitle className="text-3xl font-bold text-[#1a1a1a] leading-tight">
                          {result.title}
                        </CardTitle>
                      </div>
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-[#cc9933]/10 to-[#cc9933]/5 border border-[#cc9933]/20 shrink-0">
                        <Crown className="h-6 w-6 text-[#cc9933]" />
                      </div>
                    </div>
                    <CardDescription className="text-base text-[#666] font-medium">
                      {result.headline}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="relative space-y-6 p-8 pt-0">
                    {/* Personality Insight */}
                    <div className="relative rounded-3xl border border-[#cc9933]/20 bg-linear-to-br from-[#cc9933]/5 via-white to-white p-6 shadow-sm">
                      <div className="flex items-start gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#cc9933]/10 border border-[#cc9933]/20 shrink-0">
                          <Lightbulb className="h-5 w-5 text-[#cc9933]" />
                        </div>
                        <div className="space-y-2 flex-1">
                          <p className="text-xs font-semibold uppercase tracking-wider text-[#cc9933]">
                            Personality Insight
                          </p>
                          <p className="text-sm text-[#1a1a1a] leading-relaxed">
                            {result.personality}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Strengths & Blind Spots Grid */}
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="group relative rounded-2xl border border-[#E5E5E5] bg-white p-5 hover:border-[#cc9933]/30 transition-all hover:shadow-md">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#cc9933]/10">
                            <Zap className="h-4 w-4 text-[#cc9933]" />
                          </div>
                          <p className="text-xs font-semibold uppercase tracking-wider text-[#666]">
                            Strength
                          </p>
                        </div>
                        <p className="text-xs font-medium text-[#1a1a1a] leading-relaxed">
                          {result.strength}
                        </p>
                      </div>
                      <div className="group relative rounded-2xl border border-[#E5E5E5] bg-white p-5 hover:border-[#cc9933]/30 transition-all hover:shadow-md">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F5F5F5]">
                            <Target className="h-4 w-4 text-[#666]" />
                          </div>
                          <p className="text-xs font-semibold uppercase tracking-wider text-[#666]">
                            Blind Spot
                          </p>
                        </div>
                        <p className="text-xs font-medium text-[#1a1a1a] leading-relaxed">
                          {result.weakness}
                        </p>
                      </div>
                    </div>

                    {/* Afflux Tip - Premium Highlight */}
                    <div className="relative rounded-3xl border-2 border-[#cc9933]/30 bg-linear-to-br from-[#cc9933]/8 via-[#cc9933]/5 to-white p-6 shadow-sm">
                      <div className="flex items-start gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#cc9933] border-2 border-[#cc9933]/20 shrink-0 shadow-sm">
                          <Sparkles className="h-5 w-5 text-white" />
                        </div>
                        <div className="space-y-2 flex-1">
                          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#cc9933]">
                            Afflux Recommendation
                          </p>
                          <p className="text-sm text-[#1a1a1a] leading-relaxed font-medium">
                            {result.affluxTip}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Score Breakdown */}
                    {tallies && (
                      <div className="space-y-3">
                        <p className="text-xs font-semibold uppercase tracking-wider text-[#666] px-1">
                          Your Score Breakdown
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          {(Object.keys(personaDeck) as PersonaId[]).map(
                            (key) => {
                              const percent = Math.round(
                                (tallies[key] / questionBank.length) * 100
                              );
                              const isActive = key === result.id;
                              return (
                                <div
                                  key={key}
                                  className={cn(
                                    "relative rounded-2xl border-2 p-4 text-center transition-all",
                                    isActive
                                      ? "border-[#cc9933] bg-[#cc9933]/8 shadow-md scale-105"
                                      : "border-[#E5E5E5] bg-white hover:border-[#cc9933]/30"
                                  )}
                                >
                                  {isActive && (
                                    <div className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#cc9933] border-2 border-white shadow-sm">
                                      <Crown className="h-3 w-3 text-white" />
                                    </div>
                                  )}
                                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#666] mb-1">
                                    {personaDeck[key].title.replace("The ", "")}
                                  </p>
                                  <p
                                    className={cn(
                                      "text-2xl font-bold mb-1",
                                      isActive
                                        ? "text-[#cc9933]"
                                        : "text-[#1a1a1a]"
                                    )}
                                  >
                                    {percent}%
                                  </p>
                                  <p className="text-[10px] text-[#666] font-medium">
                                    {tallies[key]} / {questionBank.length}
                                  </p>
                                </div>
                              );
                            }
                          )}
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-3 pt-4 border-t border-[#E5E5E5]">
                      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                        <Button
                          type="button"
                          variant="default"
                          size="lg"
                          className="w-full sm:flex-1"
                          onClick={downloadResultCard}
                        >
                          <Download className="mr-2 h-4 w-4" />
                          Download Card
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="lg"
                          className="w-full sm:flex-1"
                          onClick={shareNative}
                        >
                          <Share2 className="mr-2 h-4 w-4" />
                          Share Result
                        </Button>
                      </div>
                      {/* <Button
                        type="button"
                        variant="ghost"
                        className="w-full justify-center text-sm"
                        onClick={copyShareMessage}
                      >
                        <Copy className="mr-2 h-4 w-4" />
                        Copy Share Text
                      </Button> */}
                    </div>
                  </CardContent>
                </Card>
              )}

              <Card className="border-[#E5E5E5] bg-white shadow-sm">
                <CardHeader className="p-6 pb-0 sm:p-8 sm:pb-0">
                  <CardTitle className="text-[#1a1a1a]">
                    Community Highlights
                  </CardTitle>
                  <CardDescription className="text-[#666]">
                    Real Afflux users pairing money personas with property
                    plays.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-5 p-6 pt-4 sm:p-8 sm:pt-6">
                  {featured.map((story) => (
                    <div
                      key={story.name}
                      className="flex flex-col gap-4 rounded-2xl border border-[#E5E5E5] bg-[#FAFAFA] p-4 sm:flex-row sm:items-start"
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F5F5F5] text-lg font-semibold text-[#cc9933]">
                        {story.name.slice(0, 1)}
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm uppercase tracking-[0.3em] text-[#666]">
                          {story.city}
                        </p>
                        <p className="text-base font-semibold text-[#1a1a1a]">
                          {story.name} • {personaDeck[story.persona].title}
                        </p>
                        <p className="text-sm text-[#333]">"{story.quote}"</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="border-[#E5E5E5] bg-white shadow-sm">
                <CardContent className="space-y-4 p-6 sm:p-8">
                  <div className="flex items-center gap-3">
                    <Camera className="h-5 w-5 text-[#cc9933]" />
                    <div>
                      <p className="text-sm text-[#1a1a1a]">
                        Share-ready visuals
                      </p>
                      <p className="text-xs text-[#666]">
                        Download your card as PNG and post on Instagram, X or
                        WhatsApp status in one tap.
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="subtle"
                    className="w-full justify-center border border-[#E5E5E5] text-[#1a1a1a]"
                    onClick={downloadResultCard}
                    disabled={!result}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Save high-res card
                  </Button>
                </CardContent>
              </Card>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
