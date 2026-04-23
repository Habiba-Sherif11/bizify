"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Lightbulb,
  Briefcase,
  Wrench,
  Wallet,
  ClipboardCheck,
  Sparkles,
  Plus,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Data ───────────────────────────────────────────────
const INTERESTS = [
  { id: "saas", label: "SaaS", icon: "☁️" },
  { id: "ecommerce", label: "E-Commerce", icon: "🛒" },
  { id: "fintech", label: "FinTech", icon: "💰" },
  { id: "health", label: "HealthTech", icon: "🏥" },
  { id: "edtech", label: "EdTech", icon: "📚" },
  { id: "ai-ml", label: "AI / ML", icon: "🤖" },
  { id: "realestate", label: "Real Estate", icon: "🏠" },
  { id: "food", label: "Food & Bev", icon: "🍕" },
  { id: "logistics", label: "Logistics", icon: "🚛" },
  { id: "social", label: "Social", icon: "👥" },
  { id: "gaming", label: "Gaming", icon: "🎮" },
  { id: "other", label: "Other", icon: "✨" },
];

const EXPERIENCE_LEVELS = [
  {
    id: "beginner",
    title: "Beginner",
    desc: "Exploring entrepreneurship for the first time",
    icon: "🌱",
  },
  {
    id: "intermediate",
    title: "Intermediate",
    desc: "Built small projects or side businesses before",
    icon: "🌿",
  },
  {
    id: "experienced",
    title: "Experienced",
    desc: "Previously founded or co-founded a startup",
    icon: "🌳",
  },
];

const SUGGESTED_SKILLS = [
  "Product Management",
  "Software Development",
  "Marketing",
  "Sales",
  "Design",
  "Finance",
  "Data Analysis",
  "Operations",
  "Legal",
  "Fundraising",
];

const BUDGET_RANGES = [
  { id: "bootstrap", label: "Bootstrapping", range: "$0 – $1K", desc: "Self-funded, lean approach" },
  { id: "micro", label: "Micro Budget", range: "$1K – $10K", desc: "Small personal savings" },
  { id: "seed", label: "Seed Stage", range: "$10K – $100K", desc: "Angel investors or grants" },
  { id: "pre-seed", label: "Pre-Series A", range: "$100K – $500K", desc: "Institutional seed round" },
  { id: "series-a", label: "Series A+", range: "$500K+", desc: "Established startup funding" },
];

// ─── Steps config ───────────────────────────────────────
const STEPS = [
  { id: 0, title: "Interests", icon: Lightbulb },
  { id: 1, title: "Experience", icon: Briefcase },
  { id: 2, title: "Skills", icon: Wrench },
  { id: 3, title: "Budget", icon: Wallet },
  { id: 4, title: "Review", icon: ClipboardCheck },
];

// ─── Component ──────────────────────────────────────────
export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [experience, setExperience] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [customSkill, setCustomSkill] = useState("");
  const [budget, setBudget] = useState("");
  const [isCompleting, setIsCompleting] = useState(false);

  const progressValue = ((currentStep + 1) / STEPS.length) * 100;
  const canGoNext = (() => {
    switch (currentStep) {
      case 0: return selectedInterests.length >= 1;
      case 1: return !!experience;
      case 2: return skills.length >= 1;
      case 3: return !!budget;
      case 4: return true;
      default: return false;
    }
  })();

  const toggleInterest = (id: string) => {
    setSelectedInterests((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleSkill = (skill: string) => {
    setSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const addCustomSkill = () => {
    const trimmed = customSkill.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills((prev) => [...prev, trimmed]);
      setCustomSkill("");
    }
  };

  const removeSkill = (skill: string) => {
    setSkills((prev) => prev.filter((s) => s !== skill));
  };

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep((s) => s + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((s) => s - 1);
    }
  };

  const handleComplete = () => {
    setIsCompleting(true);
    setTimeout(() => {
      // Navigate to dashboard in real app
      setIsCompleting(false);
    }, 2000);
  };

  // ─── Review data ───────────────────────────────────────
  const getInterestLabels = () =>
    INTERESTS.filter((i) => selectedInterests.includes(i.id)).map((i) => i.label);

  const getExperienceLabel = () =>
    EXPERIENCE_LEVELS.find((e) => e.id === experience)?.title || "";

  const getBudgetLabel = () =>
    BUDGET_RANGES.find((b) => b.id === budget)?.label || "";

  return (
    <div className="min-h-screen bg-gray-50/50 flex flex-col">
      {/* Top bar */}
      <header className="border-b border-gray-100 bg-white">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">Bizify</h2>
          <span className="text-sm text-gray-400">
            Step {currentStep + 1} of {STEPS.length}
          </span>
        </div>
      </header>

      {/* Progress */}
      <div className="max-w-3xl mx-auto w-full px-6 pt-6">
        <Progress value={progressValue} />
        <div className="flex justify-between mt-2">
          {STEPS.map((step) => {
            const Icon = step.icon;
            const isActive = step.id === currentStep;
            const isDone = step.id < currentStep;
            return (
              <button
                key={step.id}
                onClick={() => step.id < currentStep && setCurrentStep(step.id)}
                className={cn(
                  "flex items-center gap-1.5 text-xs font-medium transition-colors",
                  isActive && "text-blue-600",
                  isDone && "text-green-600 cursor-pointer hover:text-green-700",
                  !isActive && !isDone && "text-gray-300"
                )}
              >
                {isDone ? (
                  <Check className="w-3.5 h-3.5" />
                ) : (
                  <Icon className="w-3.5 h-3.5" />
                )}
                <span className="hidden sm:inline">{step.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 flex items-start justify-center px-6 py-10">
        <div className="w-full max-w-2xl">
          {/* Step 0 — Interests */}
          {currentStep === 0 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">What interests you?</h1>
                <p className="text-gray-500 mt-1">
                  Select the industries you&apos;re passionate about. You can always change this later.
                </p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {INTERESTS.map((item) => {
                  const isSelected = selectedInterests.includes(item.id);
                  return (
                    <button
                      key={item.id}
                      onClick={() => toggleInterest(item.id)}
                      className={cn(
                        "flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all duration-200",
                        "hover:shadow-sm",
                        isSelected
                          ? "border-blue-500 bg-blue-50/60 shadow-sm shadow-blue-500/10"
                          : "border-gray-100 bg-white hover:border-gray-200"
                      )}
                    >
                      <span className="text-xl">{item.icon}</span>
                      <span
                        className={cn(
                          "text-sm font-medium",
                          isSelected ? "text-blue-700" : "text-gray-700"
                        )}
                      >
                        {item.label}
                      </span>
                    </button>
                  );
                })}
              </div>
              {selectedInterests.length > 0 && (
                <p className="text-xs text-gray-400">
                  {selectedInterests.length} selected
                </p>
              )}
            </div>
          )}

          {/* Step 1 — Experience */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Your experience level</h1>
                <p className="text-gray-500 mt-1">
                  This helps us tailor guidance to your background.
                </p>
              </div>
              <div className="space-y-3">
                {EXPERIENCE_LEVELS.map((level) => {
                  const isSelected = experience === level.id;
                  return (
                    <button
                      key={level.id}
                      onClick={() => setExperience(level.id)}
                      className={cn(
                        "flex items-start gap-4 w-full p-5 rounded-xl border-2 text-left transition-all duration-200",
                        "hover:shadow-sm",
                        isSelected
                          ? "border-blue-500 bg-blue-50/60 shadow-sm shadow-blue-500/10"
                          : "border-gray-100 bg-white hover:border-gray-200"
                      )}
                    >
                      <span className="text-2xl mt-0.5">{level.icon}</span>
                      <div>
                        <p
                          className={cn(
                            "font-semibold",
                            isSelected ? "text-blue-700" : "text-gray-900"
                          )}
                        >
                          {level.title}
                        </p>
                        <p className="text-sm text-gray-500 mt-0.5">{level.desc}</p>
                      </div>
                      {isSelected && (
                        <Check className="w-5 h-5 text-blue-600 ml-auto flex-shrink-0 mt-1" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 2 — Skills */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Your skills</h1>
                <p className="text-gray-500 mt-1">
                  Select skills you have or add your own. This helps identify your skills gap later.
                </p>
              </div>

              {/* Selected skills */}
              {skills.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 text-sm font-medium"
                    >
                      {skill}
                      <button
                        onClick={() => removeSkill(skill)}
                        className="hover:bg-blue-100 rounded-full p-0.5 transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {/* Custom skill input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add a custom skill..."
                  value={customSkill}
                  onChange={(e) => setCustomSkill(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCustomSkill())}
                  className="flex-1 h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/15 focus:border-blue-400 transition-all"
                />
                <Button
                  type="button"
                  variant="secondary"
                  size="icon"
                  onClick={addCustomSkill}
                  disabled={!customSkill.trim()}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              {/* Suggested skills */}
              <div>
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">
                  Suggested skills
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {SUGGESTED_SKILLS.filter((s) => !skills.includes(s)).map((skill) => (
                    <button
                      key={skill}
                      onClick={() => toggleSkill(skill)}
                      className="flex items-center gap-2 p-3 rounded-lg border border-gray-100 bg-white text-sm text-gray-600 hover:border-gray-200 hover:bg-gray-50 transition-all text-left"
                    >
                      <Plus className="w-3.5 h-3.5 text-gray-300" />
                      {skill}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3 — Budget */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Startup budget</h1>
                <p className="text-gray-500 mt-1">
                  What&apos;s your expected budget range? We&apos;ll tailor recommendations accordingly.
                </p>
              </div>
              <div className="space-y-3">
                {BUDGET_RANGES.map((item) => {
                  const isSelected = budget === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setBudget(item.id)}
                      className={cn(
                        "flex items-center justify-between w-full p-5 rounded-xl border-2 text-left transition-all duration-200",
                        "hover:shadow-sm",
                        isSelected
                          ? "border-blue-500 bg-blue-50/60 shadow-sm shadow-blue-500/10"
                          : "border-gray-100 bg-white hover:border-gray-200"
                      )}
                    >
                      <div>
                        <p
                          className={cn(
                            "font-semibold",
                            isSelected ? "text-blue-700" : "text-gray-900"
                          )}
                        >
                          {item.label}
                        </p>
                        <p className="text-sm text-gray-500 mt-0.5">{item.desc}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span
                          className={cn(
                            "text-sm font-mono font-medium",
                            isSelected ? "text-blue-600" : "text-gray-400"
                          )}
                        >
                          {item.range}
                        </span>
                        {isSelected && (
                          <Check className="w-5 h-5 text-blue-600 flex-shrink-0" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 4 — Review */}
          {currentStep === 4 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="text-center space-y-2">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-green-50">
                  <Sparkles className="w-7 h-7 text-green-600" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">You&apos;re all set!</h1>
                <p className="text-gray-500">
                  Here&apos;s a summary of your profile. You can update these anytime in settings.
                </p>
              </div>

              <div className="space-y-4">
                {/* Interests */}
                <div className="rounded-xl border border-gray-100 bg-white p-5">
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">
                    Interests
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {getInterestLabels().map((label) => (
                      <span
                        key={label}
                        className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-medium"
                      >
                        {label}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Experience */}
                <div className="rounded-xl border border-gray-100 bg-white p-5">
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">
                    Experience Level
                  </p>
                  <p className="text-gray-900 font-medium">{getExperienceLabel()}</p>
                </div>

                {/* Skills */}
                <div className="rounded-xl border border-gray-100 bg-white p-5">
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">
                    Skills
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-sm font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Budget */}
                <div className="rounded-xl border border-gray-100 bg-white p-5">
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">
                    Budget Range
                  </p>
                  <p className="text-gray-900 font-medium">{getBudgetLabel()}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer nav */}
      <footer className="border-t border-gray-100 bg-white">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={handleBack}
            disabled={currentStep === 0}
            className="gap-1"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>

          {currentStep < STEPS.length - 1 ? (
            <Button onClick={handleNext} disabled={!canGoNext} className="gap-1">
              Next
              <ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              onClick={handleComplete}
              disabled={isCompleting}
              className="gap-1 min-w-[140px]"
            >
              {isCompleting ? (
                <>
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Setting up...
                </>
              ) : (
                <>
                  Complete
                  <Check className="w-4 h-4" />
                </>
              )}
            </Button>
          )}
        </div>
      </footer>
    </div>
  );
}