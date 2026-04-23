"use client";

import { useState, useEffect, useRef } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { questionnaireQuestions } from "@/features/auth/data/questionnaireData";
import { useSubmitQuestionnaire } from "@/features/auth/hooks/useSubmitQuestionnaire";
import { useSkipOnboarding } from "@/features/auth/hooks/useSkipOnboarding";


import { tokenManager } from "@/features/auth/utils/tokenManager";


type MessageSender = "ai" | "user";
interface ChatMessage {
  id: string;
  sender: MessageSender;
  text: string | string[];
}

interface QuestionnaireFormProps {
  userName?: string;
  userAvatar?: string;
  aiAvatar?: string;
  onFinish?: (skipped: boolean) => void;
}

export function QuestionnaireForm({ 
  userName = "You", 
  userAvatar = "", 
  aiAvatar = "",
  onFinish 
}: QuestionnaireFormProps) {
  
  const { mutateAsync: submitQuestionnaire } = useSubmitQuestionnaire();
  const { mutateAsync: skipOnboarding } = useSkipOnboarding();
  
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(-1);
  const [answers, setAnswers] = useState<Array<{field: string, choices: string[], multi: boolean}>>([]);
  const [selectedMultiChoices, setSelectedMultiChoices] = useState<string[]>([]);
  const [showTextInput, setShowTextInput] = useState(false);
  const [textInputValue, setTextInputValue] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  
  const chatEndRef = useRef<HTMLDivElement>(null);
  const idCounter = useRef(0);

  useEffect(() => {
    addAIMessage("Hi there! I'm your AI co-founder. Before we dive in, I'd love to get to know you a little. It'll help me tailor everything to your needs. Ready?");
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, showTextInput, isProcessing]);

  const addAIMessage = (text: string) => {
    idCounter.current += 1;
    setChatHistory(prev => [...prev, { id: `ai-${idCounter.current}`, sender: "ai", text }]);
  };

  const addUserMessage = (text: string | string[]) => {
    idCounter.current += 1;
    setChatHistory(prev => [...prev, { id: `user-${idCounter.current}`, sender: "user", text }]);
  };

    const getAuthToken = async (): Promise<string> => {
    const token = tokenManager.get();
    if (!token) throw new Error("Authentication token missing.");
    return token as string;
  };

  const handleReadyClick = () => {
    addUserMessage("Sure!");
    setTimeout(() => {
      loadNextQuestion();
    }, 600);
  };

  const loadNextQuestion = async () => {
    const nextIndex = currentQuestionIndex + 1;
    
    if (nextIndex >= questionnaireQuestions.length) {
      setIsProcessing(true);
      try {
        const token = await getAuthToken();
        await submitQuestionnaire({ token, answers });
        if (onFinish) onFinish(false);
      } catch (error: any) {
        console.error("Submission failed:", error);
        alert(error.message || "Could not save answers. You can complete this later after logging in.");
        if (onFinish) onFinish(true);
      } finally {
        setIsProcessing(false);
      }
      return;
    }
    
    setCurrentQuestionIndex(nextIndex);
    setSelectedMultiChoices([]);
    setShowTextInput(false);
    setTextInputValue("");
    
    const question = questionnaireQuestions[nextIndex];
    addAIMessage(question.question);
  };

  const handleChoiceClick = (choice: string) => {
    const question = questionnaireQuestions[currentQuestionIndex];

    if (choice.includes("Other (please specify)")) {
      setShowTextInput(true);
      return;
    }

    if (question.multi) {
      setSelectedMultiChoices(prev => {
        const newSelection = prev.includes(choice) 
          ? prev.filter(c => c !== choice) 
          : [...prev, choice];
        return newSelection;
      });
    } else {
      addUserMessage(choice);
      setAnswers(prev => [...prev, { field: question.field, choices: [choice], multi: false }]);
      setTimeout(() => loadNextQuestion(), 600);
    }
  };

  const handleMultiNext = () => {
    const question = questionnaireQuestions[currentQuestionIndex];
    addUserMessage(selectedMultiChoices);
    setAnswers(prev => [...prev, { field: question.field, choices: selectedMultiChoices, multi: true }]);
    setTimeout(() => loadNextQuestion(), 600);
  };

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!textInputValue.trim()) return;
    
    const question = questionnaireQuestions[currentQuestionIndex];
    addUserMessage(textInputValue.trim());
    setAnswers(prev => [...prev, { field: question.field, choices: [textInputValue.trim()], multi: false }]);
    setTimeout(() => loadNextQuestion(), 600);
  };

  const handleSkip = async () => {
    setIsProcessing(true);
    try {
      const token = await getAuthToken();
      await skipOnboarding(token);
      if (onFinish) onFinish(true);
    } catch (error: any) {
      console.error("Skip failed:", error);
      if (onFinish) onFinish(true);
    } finally {
      setIsProcessing(false);
    }
  };

  const currentQuestion = currentQuestionIndex >= 0 ? questionnaireQuestions[currentQuestionIndex] : null;

  return (
    <div className="flex flex-col h-[500px] relative bg-white rounded-xl">
      {/* Skip Button */}
      <button 
          onClick={handleSkip} 
          disabled={isProcessing}
          className="text-xs text-gray-400 hover:text-gray-600 font-medium transition-colors disabled:opacity-50"
        >
          {isProcessing ? "Processing..." : "Skip"}
      </button>

      <div className="flex-1 overflow-y-auto px-4 pt-8 pb-4 space-y-6">
        {chatHistory.map((msg) => (
          <div key={msg.id} className={`flex items-end gap-2 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
            
            {msg.sender === 'ai' ? (
              <div className="w-8 h-8 rounded-full bg-gray-100 border border-gray-200 shrink-0 overflow-hidden flex items-center justify-center">
                {aiAvatar ? (
                  <img src={aiAvatar} alt="Bizify AI" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-[10px] font-bold text-gray-500">B</span>
                )}
              </div>
            ) : (
              <div className="w-8 h-8 rounded-full bg-cyan-50 border border-cyan-100 shrink-0 overflow-hidden flex items-center justify-center">
                {userAvatar ? (
                  <img src={userAvatar} alt={userName} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-[10px] font-bold text-cyan-600">{userName?.charAt(0)?.toUpperCase() || "U"}</span>
                )}
              </div>
            )}

            <div className={`flex flex-col gap-1 max-w-[75%] ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
              <span className="text-[10px] font-medium text-gray-400 px-1">
                {msg.sender === 'ai' ? 'Bizify AI' : userName}
              </span>
              
              <div className={`px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                msg.sender === 'ai' 
                  ? 'bg-gray-50 text-gray-700 rounded-2xl rounded-bl-sm border border-gray-100' 
                  : 'bg-cyan-500 text-white rounded-2xl rounded-br-sm shadow-sm'
              }`}>
                {Array.isArray(msg.text) ? (
                  <ul className="list-disc pl-4 space-y-0.5">
                    {msg.text.map((t, i) => <li key={i}>{t}</li>)}
                  </ul>
                ) : (
                  msg.text
                )}
              </div>
            </div>
          </div>
        ))}

        {currentQuestionIndex === -1 && (
          <div className="flex items-end gap-2 pl-10">
            <button
              onClick={handleReadyClick}
              className="px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
            >
              Sure!
            </button>
          </div>
        )}

        {currentQuestion && !showTextInput && (
          <div className="flex items-end gap-2 pl-10">
            <div className="flex flex-wrap gap-2">
              {currentQuestion.choices.map((choice) => (
                <button
                  key={choice}
                  onClick={() => handleChoiceClick(choice)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all border ${
                    currentQuestion.multi && selectedMultiChoices.includes(choice)
                      ? "bg-cyan-50 border-cyan-300 text-cyan-700 shadow-sm"
                      : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300 shadow-sm"
                  }`}
                >
                  {choice}
                </button>
              ))}
              
              {currentQuestion.multi && selectedMultiChoices.length > 0 && (
                <button
                  onClick={handleMultiNext}
                  className="px-4 py-2 text-xs font-semibold text-cyan-600 hover:text-cyan-800 transition-colors ml-1 mt-1"
                >
                  Next →
                </button>
              )}
            </div>
          </div>
        )}

        {showTextInput && (
          <form onSubmit={handleTextSubmit} className="flex items-end gap-2 pl-10 w-full max-w-sm">
            <Input
              autoFocus
              value={textInputValue}
              onChange={(e) => setTextInputValue(e.target.value)}
              placeholder="Type your answer..."
              className="flex-1 h-9 text-sm border-gray-200 focus-visible:ring-cyan-500"
            />
            <Button type="submit" size="sm" className="h-9 w-9 p-0 bg-gray-800 hover:bg-gray-900 text-white rounded-lg">
              <Send className="w-3.5 h-3.5" />
            </Button>
          </form>
        )}

        {isProcessing && (
           <div className="flex items-end gap-2">
             <div className="w-8 h-8 rounded-full bg-gray-100 border border-gray-200 shrink-0"></div>
             <div className="px-4 py-3 bg-gray-50 text-gray-400 rounded-2xl rounded-bl-sm border border-gray-100 text-sm animate-pulse">
                Logging in & Saving your answers...
             </div>
           </div>
        )}

        <div ref={chatEndRef} />
      </div>
    </div>
  );
}