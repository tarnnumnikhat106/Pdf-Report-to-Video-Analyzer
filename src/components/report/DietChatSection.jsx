import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageSquare, 
  Send, 
  Sparkles, 
  Bot, 
  User, 
  RotateCcw, 
  Apple, 
  HelpCircle, 
  AlertCircle,
  CheckCircle2,
  Coffee,
  Calendar,
  ShieldCheck,
  Maximize2,
  Minimize2,
  X,
  Pin,
  PinOff
} from 'lucide-react';
import Card from '../common/Card';
import Button from '../common/Button';
import { sendDietChatMessage } from '../../services/api';

export default function DietChatSection({ reportContext = {}, className = '', defaultFullScreen = false }) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Hello! I am your Clinical Dietary Advisor powered by **Meta Llama 3.2**. 

I have reviewed your medical findings and lab parameters. You can ask me anything about your diet, such as:
- Whether specific foods or drinks (like spinach, coffee, eggs, or milk) are good for your results
- Foods you should avoid or limit to prevent health risks
- Personalized 1-day meal or snack ideas tailored to your biomarkers

What questions or food preferences would you like to discuss today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(defaultFullScreen);
  const [isPinned, setIsPinned] = useState(false); // Fixed floating on screen while scrolling
  const messagesEndRef = useRef(null);

  const conditionName = reportContext.condition || reportContext.reportType || "Lab Diagnostics";
  const riskStatus = reportContext.risk_level || reportContext.status || "Normal";

  const quickPrompts = [
    { label: "1-Day Meal Plan", text: "Can you give me a practical 1-day meal plan based on my lab results?", icon: Calendar },
    { label: "Coffee / Tea Safety", text: "Can I drink coffee or tea with my meals, or does it interfere with my biomarkers?", icon: Coffee },
    { label: "Best Foods to Eat", text: "What are the absolute best foods I should add to my grocery list for these results?", icon: Apple },
    { label: "Foods to Avoid", text: "Are there specific foods, snacks, or ingredients I should strictly avoid right now?", icon: AlertCircle },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Lock body scroll in full screen mode and support Esc key to exit
  useEffect(() => {
    if (isFullScreen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isFullScreen) {
        setIsFullScreen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isFullScreen]);

  const handleSendMessage = async (textToSend = null) => {
    const text = textToSend || inputMessage;
    if (!text.trim() || isLoading) return;

    const userMsg = {
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInputMessage('');
    setIsLoading(true);

    try {
      const historyPayload = newHistory.map(m => ({ role: m.role, content: m.content }));
      const response = await sendDietChatMessage(text, historyPayload, reportContext);

      const aiMsg = {
        role: 'assistant',
        content: response.reply,
        model_used: response.model_used,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages([...newHistory, aiMsg]);
    } catch (err) {
      console.error('Chat error:', err);
      const errorMsg = {
        role: 'assistant',
        content: "I apologize, but I encountered a momentary connection issue. Please feel free to ask again.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages([...newHistory, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        role: 'assistant',
        content: "Chat cleared! What other foods, doubts, or nutrition questions can I help you with?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  // Reusable Chat Content UI
  const chatContent = (
    <div className="flex flex-col h-full w-full bg-white">
      
      {/* Chat Header */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white flex items-center justify-between border-b border-white/10 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-sm shadow-blue-500/20 shrink-0">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                Clinical Dietary & Nutrition Advisor
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Llama 3.2 Online
              </span>
              <span className="hidden md:inline-flex px-2 py-0.5 rounded-md bg-white/10 text-slate-300 text-[10px] font-medium border border-white/10">
                Context: {conditionName} ({riskStatus})
              </span>
            </div>
            <p className="text-xs text-slate-300">
              Ask about what to eat, foods to avoid, meal plans, or any doubts about specific ingredients.
            </p>
          </div>
        </div>

        {/* Action Controls in Header */}
        <div className="flex items-center gap-1.5">
          {/* Pin/Fixed Toggle (keeps it fixed on screen while scrolling) */}
          {!isFullScreen && (
            <button
              type="button"
              onClick={() => setIsPinned(!isPinned)}
              className={`p-2 rounded-lg transition-colors flex items-center gap-1 text-xs ${
                isPinned 
                  ? 'bg-blue-600 text-white font-bold' 
                  : 'text-slate-300 hover:text-white bg-white/5 hover:bg-white/10'
              }`}
              title={isPinned ? "Unpin from screen (return to document flow)" : "Fix to screen while scrolling"}
            >
              {isPinned ? <PinOff className="w-3.5 h-3.5" /> : <Pin className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{isPinned ? "Unpin" : "Pin Fixed"}</span>
            </button>
          )}

          {/* Full Screen Toggle */}
          <button
            type="button"
            onClick={() => {
              setIsFullScreen(!isFullScreen);
              if (!isFullScreen) setIsPinned(false);
            }}
            className="p-2 rounded-lg text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 transition-colors flex items-center gap-1 text-xs"
            title={isFullScreen ? "Exit Full Screen (Esc)" : "Expand to Full Screen"}
          >
            {isFullScreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{isFullScreen ? "Exit Fullscreen" : "Full Screen"}</span>
          </button>

          {/* Reset Conversation */}
          <button
            type="button"
            onClick={handleResetChat}
            className="text-xs text-slate-300 hover:text-white p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors flex items-center gap-1"
            title="Reset conversation"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Clear</span>
          </button>

          {/* Close button in full screen or pinned mode */}
          {(isFullScreen || isPinned) && (
            <button
              type="button"
              onClick={() => {
                setIsFullScreen(false);
                setIsPinned(false);
              }}
              className="p-2 rounded-lg text-slate-300 hover:text-white bg-white/5 hover:bg-rose-500/30 transition-colors ml-1"
              title="Close overlay"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Suggested Quick Prompts */}
      <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center gap-2 overflow-x-auto shrink-0">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 shrink-0">
          Suggested:
        </span>
        <div className="flex items-center gap-2 shrink-0">
          {quickPrompts.map((p, idx) => {
            const Icon = p.icon;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendMessage(p.text)}
                disabled={isLoading}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-slate-200 hover:border-blue-400 hover:bg-blue-50 text-slate-700 hover:text-blue-700 text-xs font-medium transition-all shadow-2xs shrink-0 disabled:opacity-50"
              >
                <Icon className="w-3.5 h-3.5 text-blue-600" />
                <span>{p.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Messages Thread Container */}
      <div className={`p-4 sm:p-6 space-y-4 overflow-y-auto bg-slate-50/40 flex-1 ${
        isFullScreen ? 'min-h-[400px]' : isPinned ? 'min-h-[280px]' : 'max-h-[460px] min-h-[320px]'
      }`}>
        {messages.map((msg, index) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={index}
              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold shadow-2xs ${
                  isUser
                    ? 'bg-blue-600 text-white'
                    : 'bg-gradient-to-tr from-slate-900 to-indigo-900 text-white'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4 text-blue-300" />}
              </div>

              {/* Message Bubble */}
              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed shadow-xs ${
                  isUser
                    ? 'bg-blue-600 text-white rounded-tr-none'
                    : 'bg-white text-slate-800 border border-slate-200/90 rounded-tl-none'
                }`}
              >
                <div className="whitespace-pre-line space-y-1.5">
                  {msg.content}
                </div>

                <div
                  className={`mt-2 pt-1 text-[10px] flex items-center justify-between border-t ${
                    isUser ? 'border-blue-500 text-blue-100' : 'border-slate-100 text-slate-400'
                  }`}
                >
                  <span>{isUser ? 'You' : (msg.model_used || 'Meta Llama 3.2 AI')}</span>
                  <span>{msg.timestamp}</span>
                </div>
              </div>
            </div>
          );
        })}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-slate-900 to-indigo-900 text-white flex items-center justify-center shrink-0 shadow-2xs">
              <Bot className="w-4 h-4 text-blue-300 animate-spin" />
            </div>
            <div className="bg-white rounded-2xl rounded-tl-none border border-slate-200 p-4 shadow-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '300ms' }} />
                <span className="text-xs text-slate-400 ml-2">Llama 3.2 is analyzing your food question...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div className="p-3 sm:p-4 bg-white border-t border-slate-200 space-y-2 shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about foods to eat, ingredients to avoid, or nutritional doubts..."
            disabled={isLoading}
            className="flex-1 px-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
          />

          <Button
            type="submit"
            variant="primary"
            size="md"
            icon={Send}
            disabled={!inputMessage.trim() || isLoading}
            className="rounded-xl px-4 py-2.5 shadow-sm"
          >
            <span className="hidden sm:inline">Ask Question</span>
          </Button>
        </form>

        <p className="text-[11px] text-slate-400 flex items-center justify-between px-1">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            Contextual nutrition support tailored to your laboratory findings.
          </span>
          <span className="hidden sm:inline">
            {isFullScreen ? "Press Esc or click Minimize to exit full screen" : "Press Enter to send"}
          </span>
        </p>
      </div>

    </div>
  );

  // 1. FULL SCREEN MODE (Occupies entire screen, completely fixed whether user scrolls or not)
  if (isFullScreen) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex flex-col justify-center items-center p-2 sm:p-5 md:p-6 animate-in fade-in duration-200">
        <div className="w-full h-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden border border-slate-700/60 flex flex-col">
          {chatContent}
        </div>
      </div>
    );
  }

  // 2. PINNED / FIXED FLOATING MODE (Anchored to screen corner, stays in place while scrolling page)
  if (isPinned) {
    return (
      <>
        {/* Placeholder in regular flow so layout doesn't shift */}
        <div className="p-4 rounded-xl border border-dashed border-slate-300 bg-slate-50/80 text-xs text-slate-500 flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Pin className="w-4 h-4 text-blue-600" />
            AI Dietary Chat is pinned & fixed on screen.
          </span>
          <button
            type="button"
            onClick={() => setIsPinned(false)}
            className="text-blue-600 hover:text-blue-800 font-bold underline"
          >
            Unpin to here
          </button>
        </div>

        {/* Fixed floating chat window */}
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 w-[95vw] sm:w-[480px] h-[580px] max-h-[85vh] shadow-2xl rounded-2xl overflow-hidden border border-slate-300 bg-white flex flex-col animate-in slide-in-from-bottom-5 duration-200">
          {chatContent}
        </div>
      </>
    );
  }

  // 3. STANDARD INLINE MODE (With 1-click Full Screen and Pin buttons)
  return (
    <>
      <Card padding="p-0" className={`border-slate-200 shadow-md overflow-hidden flex flex-col ${className}`}>
        {chatContent}
      </Card>

      {/* Floating launcher shortcut button (stays fixed at bottom-right so user can open Fullscreen AI Chat anytime while scrolling) */}
      <button
        type="button"
        onClick={() => setIsFullScreen(true)}
        className="fixed bottom-6 right-6 z-30 flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white shadow-xl shadow-blue-500/30 hover:shadow-2xl hover:scale-105 active:scale-95 transition-all text-xs sm:text-sm font-bold border border-white/20 group"
        title="Open Full Screen AI Food Chat"
      >
        <div className="relative">
          <Bot className="w-5 h-5 text-blue-200 group-hover:rotate-12 transition-transform" />
          <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400" />
        </div>
        <span>Dietary & Nutrition Consultation</span>
        <Maximize2 className="w-3.5 h-3.5 opacity-80" />
      </button>
    </>
  );
}
