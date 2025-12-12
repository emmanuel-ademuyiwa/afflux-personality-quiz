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
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

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
    id: "a1b2c3d4-e5f6-4789-a012-b3c4d5e6f789",
    title: "When you receive money, what's the first thing you do?",
    helper: "Salary, gifts or allowance — your reflex matters.",
    options: [
      {
        letter: "A",
        label: "Transfer a portion to savings or set it aside.",
        value: "saver",
      },
      { letter: "B", label: "Buy something I've wanted.", value: "spender" },
      {
        letter: "C",
        label: "Check how I can make that money grow.",
        value: "investor",
      },
    ],
  },
  {
    id: "b2c3d4e5-f6a7-4890-b123-c4d5e6f7a890",
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
    id: "c3d4e5f6-a7b8-4901-c234-d5e6f7a8b901",
    title: 'You see a "Buy Now, Pay Later" gadget offer. What happens?',
    helper: "Delayed gratification vs instant joy.",
    options: [
      {
        letter: "A",
        label: "Ignore it; I'd rather save up properly.",
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
    id: "d4e5f6a7-b8c9-4012-d345-e6f7a8b9c012",
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
    id: "e5f6a7b8-c9d0-4123-e456-f7a8b9c0d123",
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
    id: "f6a7b8c9-d0e1-4234-f567-a8b9c0d1e234",
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
    id: "a7b8c9d0-e1f2-4345-a678-b9c0d1e2f345",
    title: "₦500,000 hits your account today. What's the play?",
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
    id: "b8c9d0e1-f2a3-4456-b789-c0d1e2f3a456",
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
    id: "c9d0e1f2-a3b4-4567-c890-d1e2f3a4b567",
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
    id: "d0e1f2a3-b4c5-4678-d901-e2f3a4b5c678",
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
  title: "Afflux Wealth Personality Test",
  message:
    "I'm discovering whether I'm a Saver, Spender or Investor with Afflux. Jump in and get your own card.",
  url: "https://www.afflux.app",
};

function evaluateResult(tallies: Leaderboard): PersonaId {
  const entries = Object.entries(tallies) as [PersonaId, number][];
  entries.sort((a, b) => b[1] - a[1]);
  return entries[0]?.[0] ?? "saver";
}

function isPersona(value: FormDataEntryValue | null): value is PersonaId {
  return value === "saver" || value === "spender" || value === "investor";
}

// Validation schema for user data form
const userDataSchema = Yup.object().shape({
  firstName: Yup.string()
    .required("First name is required")
    .min(2, "First name must be at least 2 characters"),
  lastName: Yup.string()
    .required("Last name is required")
    .min(2, "Last name must be at least 2 characters"),
  email: Yup.string()
    .required("Email is required")
    .email("Please enter a valid email address"),
  phone: Yup.string()
    .required("Phone number is required")
    .min(10, "Phone number must be at least 10 characters"),
});

export function meta({ location }: Route.MetaArgs) {
  // Use hardcoded base URL for OG images (required to be absolute)
  // Using www.afflux.app to avoid redirects that iOS share sheets don't follow
  const baseUrl = "https://www.afflux.app";
  const ogImageUrl = `${baseUrl}/afflux-og-image.png`;
  const ogUrl = `${baseUrl}${location.pathname}${location.search}`;

  return [
    {
      title:
        "Afflux Wealth Personality Test | Discover Your Financial Archetype",
    },
    {
      name: "description",
      content:
        "Discover if you're a Saver, Spender, or Investor and unlock tailored property wealth moves with Afflux. Take our 2-minute test to understand your money personality.",
    },
    {
      property: "og:title",
      content:
        "Afflux Wealth Personality Test | Discover Your Financial Archetype",
    },
    {
      property: "og:description",
      content:
        "Discover if you're a Saver, Spender, or Investor and unlock tailored property wealth moves with Afflux.",
    },
    {
      property: "og:type",
      content: "website",
    },
    {
      property: "og:site_name",
      content: "Afflux",
    },
    {
      property: "og:url",
      content: ogUrl,
    },
    {
      property: "og:image",
      content: ogImageUrl,
    },
    {
      property: "og:image:type",
      content: "image/png",
    },
    {
      property: "og:image:width",
      content: "1536",
    },
    {
      property: "og:image:height",
      content: "1024",
    },
    {
      property: "og:image:alt",
      content:
        "Afflux Wealth Personality Test - Discover if you're a Saver, Spender, or Investor",
    },
    {
      property: "og:image:secure_url",
      content: ogImageUrl,
    },
    // Legacy meta tag for some platforms
    {
      name: "image",
      content: ogImageUrl,
    },
    {
      name: "twitter:card",
      content: "summary_large_image",
    },
    {
      name: "twitter:title",
      content: "Afflux Wealth Personality Test",
    },
    {
      name: "twitter:description",
      content:
        "Discover if you're a Saver, Spender, or Investor and unlock tailored property wealth moves with Afflux.",
    },
    {
      name: "twitter:image",
      content: ogImageUrl,
    },
    {
      name: "twitter:image:alt",
      content:
        "Afflux Wealth Personality Test - Discover if you're a Saver, Spender, or Investor",
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

  const shareMessage = `I just took the Afflux Wealth Personality Test and I'm ${persona.title}! ${persona.headline} Discover yours via Afflux.`;

  return Response.json({
    result: persona,
    tallies,
    leaderboard,
    share: {
      title: persona.title,
      message: shareMessage,
      url: "https://www.afflux.app",
    },
  });
}

const QUIZ_STORAGE_KEY = "afflux-quiz-progress";

export default function Home() {
  const { leaderboard: initialLeaderboard, featured } =
    useLoaderData<LoaderData>();
  const fetcher = useFetcher<ActionData>();

  const [answers, setAnswers] = React.useState<Record<string, PersonaId>>({});
  const [userData, setUserData] = React.useState<{
    email: string;
    phone: string;
    firstName: string;
    lastName: string;
  }>({
    email: "",
    phone: "",
    firstName: "",
    lastName: "",
  });
  const [isDataCollected, setIsDataCollected] = React.useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = React.useState(0);
  const [localResult, setLocalResult] = React.useState<PersonaDetails | null>(
    null
  );
  const [localTallies, setLocalTallies] = React.useState<Leaderboard | null>(
    null
  );
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submissionError, setSubmissionError] = React.useState<string | null>(
    null
  );
  const resultCardRef = React.useRef<HTMLDivElement>(null);
  const dataFormRef = React.useRef<HTMLDivElement>(null);

  // Load saved progress from localStorage on mount
  React.useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const savedProgress = localStorage.getItem(QUIZ_STORAGE_KEY);
      if (savedProgress) {
        const parsed = JSON.parse(savedProgress);
        const savedTime = parsed.timestamp || 0;
        const currentTime = Date.now();
        const hoursSinceLastSave = (currentTime - savedTime) / (1000 * 60 * 60);

        // Only restore if saved within last 24 hours
        if (hoursSinceLastSave < 24) {
          if (parsed.userData) setUserData(parsed.userData);
          if (parsed.answers) setAnswers(parsed.answers);
          if (parsed.currentQuestionIndex !== undefined)
            setCurrentQuestionIndex(parsed.currentQuestionIndex);
          if (parsed.isDataCollected)
            setIsDataCollected(parsed.isDataCollected);
        } else {
          // Clear expired data
          localStorage.removeItem(QUIZ_STORAGE_KEY);
        }
      }
    } catch (error) {
      console.error("Failed to load quiz progress:", error);
    }
  }, []);

  // Save progress to localStorage whenever state changes
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    if (!isDataCollected) return; // Only save after test has started

    try {
      const progressData = {
        userData,
        answers,
        currentQuestionIndex,
        isDataCollected,
        timestamp: Date.now(),
      };
      localStorage.setItem(QUIZ_STORAGE_KEY, JSON.stringify(progressData));
    } catch (error) {
      console.error("Failed to save quiz progress:", error);
    }
  }, [userData, answers, currentQuestionIndex, isDataCollected]);

  const answeredCount = React.useMemo(
    () => Object.keys(answers).length,
    [answers]
  );
  const progressValue = (answeredCount / questionBank.length) * 100;
  const currentQuestion = questionBank[currentQuestionIndex];
  const hasAnsweredCurrent = answers[currentQuestion?.id] !== undefined;

  // Submit quiz data to API
  const submitQuizData = React.useCallback(
    async (resultPersona: PersonaDetails): Promise<boolean> => {
      if (isSubmitted) return true;

      setIsSubmitting(true);
      setSubmissionError(null);

      const answersPayload = questionBank.map((question) => {
        const value = answers[question.id];
        const option = question.options.find((opt) => opt.value === value);

        return {
          question_id: question.id,
          answer: option?.letter ?? "",
        };
      });

      const payload = {
        first_name: userData.firstName.trim(),
        last_name: userData.lastName.trim(),
        email: userData.email,
        phone_number: userData.phone,
        answers: answersPayload,
        result: resultPersona.id,
      };

      try {
        const response = await fetch(
          "https://api.afflux.app/personality-test",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          }
        );

        if (!response.ok) {
          const errorText = await response.text().catch(() => "Unknown error");
          throw new Error(
            `Failed to submit quiz data: ${response.status} ${response.statusText}. ${errorText}`
          );
        }

        setIsSubmitted(true);
        setIsSubmitting(false);
        return true;
      } catch (error) {
        console.error("Failed to submit quiz data:", error);
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Failed to submit quiz data. Please try again.";
        setSubmissionError(errorMessage);
        setIsSubmitting(false);
        return false;
      }
    },
    [answers, userData, isSubmitted]
  );

  // Calculate result locally
  const calculateResult = React.useCallback(async () => {
    if (answeredCount !== questionBank.length) return;

    const tallies: Leaderboard = {
      saver: 0,
      spender: 0,
      investor: 0,
    };

    for (const question of questionBank) {
      const answer = answers[question.id];
      if (answer) {
        tallies[answer] += 1;
      }
    }

    const personaId = evaluateResult(tallies);
    const persona = personaDeck[personaId];

    setLocalTallies(tallies);

    // Submit quiz data before showing result
    const submissionSuccess = await submitQuizData(persona);

    // Only show result if submission was successful
    if (submissionSuccess) {
      setLocalResult(persona);

      // Clear localStorage when quiz is completed
      if (typeof window !== "undefined") {
        localStorage.removeItem(QUIZ_STORAGE_KEY);
      }
    }
    // If submission failed, error is already set and will be displayed
  }, [answers, answeredCount, submitQuizData]);

  React.useEffect(() => {
    if (answeredCount === questionBank.length && !localResult) {
      calculateResult();
    }
  }, [answeredCount, calculateResult, localResult]);

  // Scroll to result when it's calculated
  React.useEffect(() => {
    if (localResult && resultCardRef.current) {
      setTimeout(() => {
        resultCardRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 300);
    }
  }, [localResult]);

  const result = localResult || fetcher.data?.result;
  const tallies = localTallies || fetcher.data?.tallies;
  const leaderboard = fetcher.data?.leaderboard ?? initialLeaderboard;
  const sharePayload = localResult
    ? {
        title: localResult.title,
        message: `I just took the Afflux Wealth Personality Test and I'm ${localResult.title}! ${localResult.headline} Discover yours via Afflux.`,
        url: "https://www.afflux.app",
      }
    : (fetcher.data?.share ?? defaultSharePayload);
  const totalLeaderboardVotes =
    leaderboard.saver + leaderboard.spender + leaderboard.investor || 1;

  const formRef = React.useRef<HTMLDivElement>(null);

  // React.useEffect(() => {
  //   if (fetcher.state === "idle" && fetcher.data?.result) {
  //     formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  //   }
  // }, [fetcher.state, fetcher.data]);

  async function downloadResultCard() {
    if (!resultCardRef.current) return;
    const dataUrl = await toPng(resultCardRef.current, {
      backgroundColor: "#ffffff",
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

  function handleDataSubmit(values: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  }) {
    setUserData({
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      phone: values.phone,
    });
    setIsDataCollected(true);
    // Scroll to top on mobile when test starts
    if (window.innerWidth < 1024) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function handleNextQuestion() {
    if (currentQuestionIndex < questionBank.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  }

  function handlePreviousQuestion() {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  }

  function handleAnswerSelect(questionId: string, value: PersonaId) {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  }

  const isTestActive = isDataCollected && !result;

  return (
    <>
      <div className="min-h-screen text-[#0f0f0f]">
        {/* Main Header */}
        <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:py-4">
            <img
              src="/Afflux-Black.png"
              alt="Afflux"
              className="h-5 md:h-7 w-auto"
            />
            {isTestActive ? (
              <div className="lg:hidden flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-[#cc9933]/10 flex items-center justify-center">
                    <Target className="h-4 w-4 text-[#cc9933]" />
                  </div>
                  <span className="text-xs font-semibold text-[#1a1a1a]">
                    Question {currentQuestionIndex + 1} of {questionBank.length}
                  </span>
                </div>
                <span className="text-xs font-medium text-[#666] hidden sm:inline">
                  {Math.round(progressValue)}%
                </span>
              </div>
            ) : (
              <Badge className="border-[#cc9933]/50 bg-[#cc9933]/10 text-[#cc9933] text-[10px] md:text-xs font-medium px-3 py-1.5">
                Wealth Personality Test
              </Badge>
            )}
          </div>
          {isTestActive && (
            <div className="lg:hidden px-4 pb-3">
              <div className="h-1.5 w-full bg-[#F5F5F5] rounded-full overflow-hidden">
                <div
                  className="h-full bg-linear-to-r from-[#cc9933] to-[#cc9933]/80 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progressValue}%` }}
                />
              </div>
            </div>
          )}
        </header>

        <main
          className={cn(
            "mx-auto flex max-w-6xl flex-col gap-10 px-4 pb-24 transition-all duration-300",
            isTestActive ? "lg:pt-12 pt-0 min-h-screen lg:pb-24 pb-32" : "pt-12"
          )}
        >
          {/* Hero Section - Hidden on mobile when test is active */}
          <header
            className={cn(
              "rounded-[40px] md:border border-[#E5E5E5] md:bg-linear-to-r from-[#FFF7EA] via-[#FFFDF7] to-white md:p-8 grid-gold md:shadow-sm transition-all duration-300",
              isTestActive ? "lg:block hidden" : "block"
            )}
          >
            <div className="relative z-10 flex flex-col gap-8 md:grid md:grid-cols-[1.2fr_0.8fr] md:items-center">
              <div className="space-y-6">
                <div className="space-y-4">
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
                    ? Your money habits tell a story. Take this 2 minutes test
                    to understand yours and discover the path to the future you
                    want.
                  </p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto"
                    onClick={() =>
                      dataFormRef.current?.scrollIntoView({
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
                    <Users className="h-4 w-4 text-[#cc9933]" /> Join 1,090
                    people discovering their money habits
                  </div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-[#cc9933]" /> Understand
                    the mindset driving your money decisions
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

          <section
            className={cn(
              "grid gap-10 transition-all duration-300",
              isTestActive
                ? "lg:grid-cols-[minmax(0,1.3fr)_minmax(0,0.7fr)] w-full"
                : "lg:grid-cols-[minmax(0,1.3fr)_minmax(0,0.7fr)]"
            )}
          >
            <Card
              ref={dataFormRef}
              className={cn(
                "border-[#E5E5E5] bg-white w-full transition-all duration-300",
                isTestActive
                  ? "border-none shadow-none p-0 lg:p-6 lg:border lg:shadow-sm fixed lg:relative inset-0 lg:inset-auto z-40 lg:z-auto bg-white overflow-y-auto lg:overflow-visible"
                  : "border-none shadow-none p-0 md:p-6 md:border md:shadow-sm"
              )}
            >
              {isSubmitting ? (
                // Loading state while submitting
                <CardContent className="flex min-h-[60vh] lg:min-h-0 items-center justify-center p-6 sm:p-8 lg:p-12">
                  <div className="flex flex-col items-center justify-center gap-4 text-center w-full max-w-md">
                    <div className="flex h-12 w-12 md:h-14 md:w-14 items-center justify-center rounded-full bg-[#cc9933]/10 border-2 border-[#cc9933]/20">
                      <div className="h-6 w-6 md:h-7 md:w-7 animate-spin rounded-full border-2 border-[#cc9933] border-t-transparent" />
                    </div>
                    <div className="space-y-2">
                      <CardTitle className="text-lg md:text-xl text-[#1a1a1a]">
                        Submitting your results...
                      </CardTitle>
                      <CardDescription className="text-sm md:text-base text-[#666]">
                        Please wait while we process your personality test.
                      </CardDescription>
                    </div>
                  </div>
                </CardContent>
              ) : submissionError ? (
                // Error state
                <CardContent className="flex min-h-[60vh] lg:min-h-0 items-center justify-center p-6 sm:p-8 lg:p-12">
                  <div className="flex flex-col items-center justify-center gap-4 text-center w-full max-w-md">
                    <div className="flex h-12 w-12 md:h-14 md:w-14 items-center justify-center rounded-full bg-red-100 border-2 border-red-200">
                      <svg
                        className="h-6 w-6 md:h-7 md:w-7 text-red-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div className="space-y-2">
                      <CardTitle className="text-lg md:text-xl text-red-600">
                        Submission Failed
                      </CardTitle>
                      <CardDescription className="text-sm md:text-base text-[#666]">
                        {submissionError}
                      </CardDescription>
                    </div>
                    <div className="flex flex-col gap-3 pt-4 w-full">
                      <Button
                        onClick={async () => {
                          if (localTallies) {
                            const personaId = evaluateResult(localTallies);
                            const persona = personaDeck[personaId];
                            const success = await submitQuizData(persona);
                            if (success) {
                              setLocalResult(persona);
                            }
                          }
                        }}
                        size="lg"
                        className="w-full sm:w-auto"
                      >
                        Try Again
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          if (localTallies) {
                            const personaId = evaluateResult(localTallies);
                            const persona = personaDeck[personaId];
                            setLocalResult(persona);
                            setSubmissionError(null);
                          }
                        }}
                        size="lg"
                        className="w-full sm:w-auto"
                      >
                        Show Result Anyway
                      </Button>
                    </div>
                  </div>
                </CardContent>
              ) : result ? (
                // Result Card - replaces test when result is available
                <>
                  <div
                    ref={resultCardRef}
                    className="relative rounded-2xl md:rounded-3xl overflow-hidden bg-gradient-to-br from-[#cc9933]/10 via-white to-[#cc9933]/5 p-4 md:p-8 w-full"
                  >
                    <CardHeader className="relative p-0 pb-4 md:pb-6">
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="space-y-1.5">
                          <Badge className="border-[#cc9933]/60 bg-[#cc9933]/10 text-[#cc9933] text-[9px] md:text-[10px] font-semibold px-2.5 py-1">
                            Your Money Personality
                          </Badge>
                          <CardTitle className="-mb-3 mt-2 text-2xl md:text-3xl font-bold text-[#1a1a1a] leading-tight">
                            {result.title}
                          </CardTitle>
                        </div>
                        <div className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-xl md:rounded-2xl bg-linear-to-br from-[#cc9933]/10 to-[#cc9933]/5 border border-[#cc9933]/20 shrink-0">
                          <Crown className="h-5 w-5 md:h-6 md:w-6 text-[#cc9933]" />
                        </div>
                      </div>
                      <CardDescription className="text-sm md:text-base text-[#666] font-medium leading-snug">
                        {result.headline}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="relative space-y-3 md:space-y-6 p-0 pt-0">
                      {/* Personality Insight */}
                      <div className="relative rounded-2xl md:rounded-3xl border border-[#cc9933]/20 bg-linear-to-br from-[#cc9933]/5 via-white to-white p-4 md:p-6">
                        <div className="flex items-start gap-3">
                          <div className="flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-lg md:rounded-xl bg-[#cc9933]/10 border border-[#cc9933]/20 shrink-0">
                            <Lightbulb className="h-4 w-4 md:h-5 md:w-5 text-[#cc9933]" />
                          </div>
                          <div className="space-y-1 flex-1">
                            <p className="text-[10px] md:text-xs font-semibold uppercase tracking-wider text-[#cc9933]">
                              Personality Insight
                            </p>
                            <p className="text-xs md:text-sm text-[#1a1a1a] leading-relaxed">
                              {result.personality}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Strengths & Blind Spots Grid */}
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="group relative rounded-xl md:rounded-2xl border border-[#E5E5E5] bg-white p-3.5 md:p-5 hover:border-[#cc9933]/30 transition-all hover:shadow-md">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="flex h-7 w-7 md:h-8 md:w-8 items-center justify-center rounded-lg bg-[#cc9933]/10">
                              <Zap className="h-3.5 w-3.5 md:h-4 md:w-4 text-[#cc9933]" />
                            </div>
                            <p className="text-[10px] md:text-xs font-semibold uppercase tracking-wider text-[#666]">
                              Strength
                            </p>
                          </div>
                          <p className="text-[11px] md:text-xs font-medium text-[#1a1a1a] leading-relaxed">
                            {result.strength}
                          </p>
                        </div>
                        <div className="group relative rounded-xl md:rounded-2xl border border-[#E5E5E5] bg-white p-3.5 md:p-5 hover:border-[#cc9933]/30 transition-all hover:shadow-md">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="flex h-7 w-7 md:h-8 md:w-8 items-center justify-center rounded-lg bg-[#F5F5F5]">
                              <Target className="h-3.5 w-3.5 md:h-4 md:w-4 text-[#666]" />
                            </div>
                            <p className="text-[10px] md:text-xs font-semibold uppercase tracking-wider text-[#666]">
                              Blind Spot
                            </p>
                          </div>
                          <p className="text-[11px] md:text-xs font-medium text-[#1a1a1a] leading-relaxed">
                            {result.weakness}
                          </p>
                        </div>
                      </div>

                      {/* Afflux Tip - Premium Highlight */}
                      <div className="relative rounded-2xl md:rounded-3xl border-2 border-[#cc9933]/30 bg-linear-to-br from-[#cc9933]/8 via-[#cc9933]/5 to-white p-4 md:p-6">
                        <div className="flex items-start gap-3">
                          <div className="flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-lg md:rounded-xl bg-[#cc9933] border-2 border-[#cc9933]/20 shrink-0">
                            <Sparkles className="h-4 w-4 md:h-5 md:w-5 text-white" />
                          </div>
                          <div className="space-y-1 flex-1">
                            <p className="text-[10px] md:text-xs font-bold uppercase tracking-[0.15em] md:tracking-[0.2em] text-[#cc9933]">
                              Afflux Recommendation
                            </p>
                            <p className="text-xs md:text-sm text-[#1a1a1a] leading-relaxed font-medium">
                              {result.affluxTip}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </div>

                  {/* Score Breakdown - Outside download area */}
                  {tallies && (
                    <div className="space-y-3 mt-6">
                      <p className="text-xs font-semibold uppercase tracking-wider text-[#666] px-1">
                        Your Score Breakdown
                      </p>
                      <div className="grid grid-cols-3 gap-3">
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
                                    ? "border-[#cc9933] bg-[#cc9933]/8"
                                    : "border-[#E5E5E5] bg-white hover:border-[#cc9933]/30"
                                )}
                              >
                                {isActive && (
                                  <div className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#cc9933] border-2 border-white">
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

                  {/* Action Buttons - Outside download area */}
                  <div className="flex flex-col gap-3 pt-6 mt-6 border-t border-[#E5E5E5]">
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
                  </div>
                </>
              ) : !isDataCollected ? (
                <CardContent className="p-0 sm:p-8">
                  <CardHeader className="p-0 pb-6">
                    <CardTitle className="text-[#1a1a1a]">
                      Get Started
                    </CardTitle>
                    <CardDescription className="text-[#666]">
                      Please provide your details to begin the test.
                    </CardDescription>
                  </CardHeader>
                  <Formik
                    initialValues={{
                      firstName: userData.firstName,
                      lastName: userData.lastName,
                      email: userData.email,
                      phone: userData.phone,
                    }}
                    enableReinitialize
                    validationSchema={userDataSchema}
                    onSubmit={handleDataSubmit}
                  >
                    {({ isSubmitting, isValid, touched, errors }) => (
                      <Form className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label
                              htmlFor="firstName"
                              className="text-sm font-medium text-[#1a1a1a]"
                            >
                              First Name
                            </label>
                            <Field
                              id="firstName"
                              name="firstName"
                              type="text"
                              className={cn(
                                "w-full rounded-2xl border bg-white px-4 py-3 text-base text-[#1a1a1a] transition-all focus:outline-none focus:ring-2",
                                touched.firstName && errors.firstName
                                  ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                                  : "border-[#E5E5E5] focus:border-[#cc9933] focus:ring-[#cc9933]/20"
                              )}
                              placeholder="Enter your first name"
                            />
                            <ErrorMessage
                              name="firstName"
                              component="p"
                              className="text-sm text-red-500"
                            />
                          </div>
                          <div className="space-y-2">
                            <label
                              htmlFor="lastName"
                              className="text-sm font-medium text-[#1a1a1a]"
                            >
                              Last Name
                            </label>
                            <Field
                              id="lastName"
                              name="lastName"
                              type="text"
                              className={cn(
                                "w-full rounded-2xl border bg-white px-4 py-3 text-base text-[#1a1a1a] transition-all focus:outline-none focus:ring-2",
                                touched.lastName && errors.lastName
                                  ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                                  : "border-[#E5E5E5] focus:border-[#cc9933] focus:ring-[#cc9933]/20"
                              )}
                              placeholder="Enter your last name"
                            />
                            <ErrorMessage
                              name="lastName"
                              component="p"
                              className="text-sm text-red-500"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label
                            htmlFor="email"
                            className="text-sm font-medium text-[#1a1a1a]"
                          >
                            Email
                          </label>
                          <Field
                            id="email"
                            name="email"
                            type="email"
                            className={cn(
                              "w-full rounded-2xl border bg-white px-4 py-3 text-base text-[#1a1a1a] transition-all focus:outline-none focus:ring-2",
                              touched.email && errors.email
                                ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                                : "border-[#E5E5E5] focus:border-[#cc9933] focus:ring-[#cc9933]/20"
                            )}
                            placeholder="Enter your email"
                          />
                          <ErrorMessage
                            name="email"
                            component="p"
                            className="text-sm text-red-500"
                          />
                        </div>
                        <div className="space-y-2">
                          <label
                            htmlFor="phone"
                            className="text-sm font-medium text-[#1a1a1a]"
                          >
                            Phone Number
                          </label>
                          <Field
                            id="phone"
                            name="phone"
                            type="tel"
                            className={cn(
                              "w-full rounded-2xl border bg-white px-4 py-3 text-base text-[#1a1a1a] transition-all focus:outline-none focus:ring-2",
                              touched.phone && errors.phone
                                ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                                : "border-[#E5E5E5] focus:border-[#cc9933] focus:ring-[#cc9933]/20"
                            )}
                            placeholder="Enter your phone number"
                          />
                          <ErrorMessage
                            name="phone"
                            component="p"
                            className="text-sm text-red-500"
                          />
                        </div>
                        <Button
                          type="submit"
                          size="lg"
                          className="w-full"
                          disabled={isSubmitting || !isValid}
                        >
                          Start Test
                          <ArrowUpRight className="ml-2 h-5 w-5" />
                        </Button>
                      </Form>
                    )}
                  </Formik>
                </CardContent>
              ) : (
                <>
                  {/* Desktop Progress Header */}
                  <CardHeader className="hidden lg:block p-0 pb-0 sm:p-8 sm:pb-0">
                    <CardTitle className="flex items-center justify-between text-[#1a1a1a]">
                      Quiz Progress
                      <span className="text-base font-normal text-[#666]">
                        {answeredCount}/{questionBank.length} answered
                      </span>
                    </CardTitle>
                    <CardDescription className="text-[#666]">
                      Tap into your instinct per question. No overthinking —
                      just your honest reactions.
                    </CardDescription>
                  </CardHeader>
                  <CardContent
                    className={cn(
                      "transition-all duration-300",
                      isTestActive
                        ? "p-6 lg:p-0 lg:pt-4 lg:sm:p-8 lg:sm:pt-6"
                        : "p-0 pt-4 sm:p-8 sm:pt-6"
                    )}
                  >
                    <Progress
                      value={progressValue}
                      className="mb-8 hidden lg:block"
                    />
                    <div ref={formRef} className="space-y-6 lg:space-y-8">
                      {currentQuestion && (
                        <div className="space-y-6 lg:space-y-8 mt-10 md:mt-0">
                          {/* Mobile Question Header */}
                          <div className="lg:hidden space-y-4 pt-4">
                            <div className="flex items-center gap-2 text-xs text-[#999] uppercase tracking-wider">
                              <div className="h-px w-8 bg-[#cc9933]/30" />
                              <span>Question {currentQuestionIndex + 1}</span>
                              <div className="h-px flex-1 bg-[#cc9933]/30" />
                            </div>
                            <h2 className="text-2xl font-bold text-[#1a1a1a] leading-tight">
                              {currentQuestion.title}
                            </h2>
                            <p className="text-sm text-[#666] leading-relaxed">
                              {currentQuestion.helper}
                            </p>
                          </div>

                          {/* Desktop Question Header */}
                          <div className="hidden lg:block rounded-3xl border border-[#E5E5E5] bg-white p-6 shadow-sm space-y-6 hover:shadow-md transition-shadow">
                            <div className="flex flex-wrap items-start justify-between gap-4">
                              <div>
                                <p className="text-sm uppercase mb-3 tracking-[0.4em] text-[#999]">
                                  Question {currentQuestionIndex + 1} of{" "}
                                  {questionBank.length}
                                </p>
                                <h3 className="md:text-xl font-semibold text-[#1a1a1a]">
                                  {currentQuestion.title}
                                </h3>
                                <p className="text-sm text-[#666]">
                                  {currentQuestion.helper}
                                </p>
                              </div>
                            </div>
                          </div>
                          {/* Options */}
                          <div className="grid gap-3 lg:gap-3">
                            {currentQuestion.options.map((option) => {
                              const optionId = `${currentQuestion.id}-${option.value}`;
                              const selected =
                                answers[currentQuestion.id] === option.value;
                              return (
                                <div key={option.letter} className="group">
                                  <input
                                    id={optionId}
                                    type="radio"
                                    name={currentQuestion.id}
                                    value={option.value}
                                    checked={selected}
                                    onChange={(event) => {
                                      handleAnswerSelect(
                                        currentQuestion.id,
                                        event.target.value as PersonaId
                                      );
                                    }}
                                    className="peer sr-only"
                                  />
                                  <label
                                    htmlFor={optionId}
                                    className={cn(
                                      "flex cursor-pointer items-center gap-4 rounded-2xl border-2 p-4 lg:p-4 transition-all duration-200 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#cc9933]/60",
                                      selected
                                        ? "border-[#cc9933] bg-linear-to-br from-[#cc9933]/10 via-[#cc9933]/5 to-white shadow-md shadow-[#cc9933]/10"
                                        : "border-[#E5E5E5] bg-white hover:border-[#cc9933]/40 hover:bg-[#FAFAFA]"
                                    )}
                                  >
                                    <span
                                      className={cn(
                                        "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border-2 text-base font-bold transition-all duration-200",
                                        selected
                                          ? "border-[#cc9933] bg-[#cc9933] text-white shadow-sm"
                                          : "border-[#E5E5E5] bg-[#FAFAFA] text-[#666]"
                                      )}
                                    >
                                      {option.letter}
                                    </span>
                                    <span
                                      className={cn(
                                        "flex-1 text-base leading-relaxed transition-colors",
                                        selected
                                          ? "font-semibold text-[#1a1a1a]"
                                          : "text-[#333]"
                                      )}
                                    >
                                      {option.label}
                                    </span>
                                    <div
                                      className={cn(
                                        "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-200",
                                        selected
                                          ? "border-[#cc9933] bg-[#cc9933]"
                                          : "border-[#CCC] bg-white"
                                      )}
                                    >
                                      {selected && (
                                        <div className="h-2 w-2 rounded-full bg-white" />
                                      )}
                                    </div>
                                  </label>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                      {/* Navigation Buttons */}
                      <div className="flex flex-col gap-3 pt-6 lg:pt-4 border-t border-[#E5E5E5] lg:border-0">
                        <div className="flex gap-3">
                          <Button
                            type="button"
                            variant="outline"
                            size="lg"
                            onClick={handlePreviousQuestion}
                            disabled={currentQuestionIndex === 0}
                            className="flex-1 lg:flex-none"
                          >
                            Previous
                          </Button>
                          {currentQuestionIndex < questionBank.length - 1 ? (
                            <Button
                              type="button"
                              size="lg"
                              onClick={handleNextQuestion}
                              disabled={!hasAnsweredCurrent}
                              className="flex-1 lg:flex-none font-semibold shadow-lg shadow-[#cc9933]/20 hover:shadow-xl hover:shadow-[#cc9933]/30"
                            >
                              Continue
                              <ArrowUpRight className="ml-2 h-5 w-5" />
                            </Button>
                          ) : (
                            <Button
                              type="button"
                              size="lg"
                              onClick={() => {
                                if (!localResult) {
                                  calculateResult();
                                }
                                // Scroll to result after a brief delay
                                setTimeout(() => {
                                  resultCardRef.current?.scrollIntoView({
                                    behavior: "smooth",
                                    block: "start",
                                  });
                                }, 100);
                              }}
                              disabled={answeredCount !== questionBank.length}
                              className="flex-1 lg:flex-none font-semibold shadow-lg shadow-[#cc9933]/20 hover:shadow-xl hover:shadow-[#cc9933]/30"
                            >
                              {localResult ? "View Result" : "See My Result"}
                              <Crown className="ml-2 h-5 w-5" />
                            </Button>
                          )}
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          className="w-full text-sm lg:hidden"
                          onClick={() => {
                            setAnswers({});
                            setCurrentQuestionIndex(0);
                            setLocalResult(null);
                            setLocalTallies(null);
                            setIsSubmitted(false);
                            // Clear localStorage when starting over
                            if (typeof window !== "undefined") {
                              localStorage.removeItem(QUIZ_STORAGE_KEY);
                            }
                          }}
                          disabled={isSubmitting}
                        >
                          Start Over
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </>
              )}
            </Card>

            <div
              className={cn("hidden lg:block space-y-8", result && "hidden")}
            >
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
