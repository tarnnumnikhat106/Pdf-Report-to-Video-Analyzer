import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Bot,
  User,
  RotateCcw,
  Apple,
  AlertCircle,
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

const formatMessageTime = () =>
  new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

export default function DietChatSection({ reportContext = {}, className = '', defaultFullScreen = false }) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Hi. Ask me about food and daily habits that may support the results in this report.

For example:
- Whether spinach, coffee, eggs, or dairy fit your panel
- Foods or drinks worth limiting
- A simple meal or snack idea

I can explain the general nutrition context. For treatment or supplement decisions, talk with your clinician.`,
      timestamp: formatMessageTime()
    }
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(defaultFullScreen);
  const [isPinned, setIsPinned] = useState(false); // Fixed floating on screen while scrolling
  const messagesEndRef = useRef(null);
  const threadRef = useRef(null);

  const conditionName = reportContext.condition || reportContext.reportType || "Lab Diagnostics";
  const riskStatus = reportContext.risk_level || reportContext.status || "Normal";

  const quickPrompts = [
    { label: "1-Day Meal Plan", text: "Can you give me a practical 1-day meal plan based on my lab results?", icon: Calendar },
    { label: "Coffee / Tea Safety", text: "Can I drink coffee or tea with my meals, or does it interfere with my biomarkers?", icon: Coffee },
    { label: "Best Foods to Eat", text: "What are the absolute best foods I should add to my grocery list for these results?", icon: Apple },
    { label: "Foods to Avoid", text: "Are there specific foods, snacks, or ingredients I should strictly avoid right now?", icon: AlertCircle },
  ];

  const scrollToBottom = () => {
    const thread = threadRef.current;
    if (!thread) return;
    thread.scrollTo({ top: thread.scrollHeight, behavior: 'smooth' });
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
      timestamp: formatMessageTime()
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
        timestamp: formatMessageTime()
      };
      setMessages([...newHistory, aiMsg]);
    } catch (err) {
      console.error('Chat error:', err);
      const errorMsg = {
        role: 'assistant',
        content: "I apologize, but I encountered a momentary connection issue. Please feel free to ask again.",
        timestamp: formatMessageTime()
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
        content: "Chat cleared. Ask another question about food, habits, or how to read these results.",
        timestamp: formatMessageTime()
      }
    ]);
  };

  // Reusable Chat Content UI
  const chatContent = (
    <div className="flex flex-col h-full w-full bg-white">
      
      {/* Chat Header */}
      <div className="flex shrink-0 items-center justify-between border-b border-paper/10 bg-ink p-4 text-paper sm:p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-paper/15 bg-paper/10 text-paper">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-display text-lg tracking-tight text-paper">
                Dietary questions
              </h3>
              <span className="rounded border border-paper/15 bg-paper/5 px-2 py-0.5 text-[10px] font-medium text-paper/60">
                Llama 3.2
              </span>
              <span className="hidden rounded border border-paper/15 bg-paper/5 px-2 py-0.5 text-[10px] font-medium text-paper/60 md:inline-flex">
                {conditionName} Â· {riskStatus}
              </span>
            </div>
            <p className="mt-0.5 text-xs text-paper/55">
              Ask about foods to include, ingredients to limit, or a simple meal idea.
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
              className={`flex items-center gap-1 rounded p-2 text-xs transition-colors ${
                isPinned
                  ? 'bg-accent text-surface'
                  : 'bg-paper/5 text-paper/60 hover:bg-paper/10 hover:text-paper'
              }`}
              title={isPinned ? "Unpin from screen (return to document flow)" : "Fix to screen while scrolling"}
            >
              {isPinned ? <PinOff className="w-3.5 h-3.5" /> : <Pin className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{isPinned ? "Unpin" : "Pin"}</span>
            </button>
          )}

          {/* Full Screen Toggle */}
          <button
            type="button"
            onClick={() => {
              setIsFullScreen(!isFullScreen);
              if (!isFullScreen) setIsPinned(false);
            }}
            className="flex items-center gap-1 rounded bg-paper/5 p-2 text-xs text-paper/60 transition-colors hover:bg-paper/10 hover:text-paper"
            title={isFullScreen ? "Exit Full Screen (Esc)" : "Expand to Full Screen"}
          >
            {isFullScreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{isFullScreen ? "Exit" : "Full screen"}</span>
          </button>

          {/* Reset Conversation */}
          <button
            type="button"
            onClick={handleResetChat}
            className="flex items-center gap-1 rounded bg-paper/5 p-2 text-xs text-paper/60 transition-colors hover:bg-paper/10 hover:text-paper"
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
              className="ml-1 rounded bg-paper/5 p-2 text-paper/60 transition-colors hover:bg-danger/30 hover:text-paper"
              title="Close overlay"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Suggested Quick Prompts */}
      <div className="flex shrink-0 items-center gap-2 overflow-x-auto border-b border-line bg-paper/70 px-4 py-2.5">
        <span className="shrink-0 text-[11px] font-medium uppercase tracking-[0.14em] text-muted">
          Try
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
                className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-line bg-surface px-3 py-1.5 text-xs font-medium text-ink-soft transition-colors hover:border-accent/40 hover:text-accent-deep disabled:opacity-50"
              >
                <Icon className="h-3.5 w-3.5 text-accent" />
                <span>{p.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Messages Thread Container */}
      <div ref={threadRef} className={`flex-1 space-y-4 overflow-y-auto bg-paper/40 p-4 sm:p-6 ${
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
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-xs font-semibold ${
                  isUser ? 'bg-accent text-surface' : 'bg-ink text-paper'
                }`}
              >
                {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
              </div>

              {/* Message Bubble */}
              <div
                className={`max-w-[85%] rounded-lg p-4 text-xs leading-relaxed sm:max-w-[75%] sm:text-sm ${
                  isUser
                    ? 'bg-accent text-surface'
                    : 'border border-line bg-surface text-ink-soft'
                }`}
              >
                <div className="whitespace-pre-line space-y-1.5">
                  {msg.content}
                </div>

                <div
                  className={`mt-2 flex items-center justify-between border-t pt-1 text-[10px] ${
                    isUser ? 'border-paper/20 text-paper/60' : 'border-line-soft text-muted'
                  }`}
                >
                  <span>{isUser ? 'You' : (msg.model_used || 'Llama 3.2')}</span>
                  <span>{msg.timestamp}</span>
                </div>
              </div>
            </div>
          );
        })}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-ink text-paper">
              <Bot className="h-4 w-4 animate-spin" />
            </div>
            <div className="rounded-lg border border-line bg-surface p-4">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 animate-bounce rounded-full bg-accent" style={{ animationDelay: '0ms' }} />
                <span className="h-2 w-2 animate-bounce rounded-full bg-accent" style={{ animationDelay: '150ms' }} />
                <span className="h-2 w-2 animate-bounce rounded-full bg-accent" style={{ animationDelay: '300ms' }} />
                <span className="ml-2 text-xs text-muted">Reading your question...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div className="shrink-0 space-y-2 border-t border-line bg-surface p-3 sm:p-4">
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
            placeholder="Ask about foods to include, ingredients to limit, or meal ideas..."
            disabled={isLoading}
            className="flex-1 rounded-md border border-line bg-paper/60 px-4 py-2.5 text-xs transition-colors focus:border-accent focus:bg-surface focus:outline-none focus:ring-1 focus:ring-accent/25 sm:text-sm"
          />

          <Button
            type="submit"
            variant="primary"
            size="md"
            icon={Send}
            disabled={!inputMessage.trim() || isLoading}
            className="rounded-md px-4 py-2.5"
          >
            <span className="hidden sm:inline">Send</span>
          </Button>
        </form>

        <p className="flex items-center justify-between px-1 text-[11px] text-muted">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-accent" />
            General nutrition guidance, not a prescription.
          </span>
          <span className="hidden sm:inline">
            {isFullScreen ? "Esc to exit full screen" : "Enter to send"}
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
        <div className="flex items-center justify-between rounded-md border border-dashed border-line bg-paper/60 p-4 text-xs text-muted">
          <span className="flex items-center gap-2">
            <Pin className="h-4 w-4 text-accent" />
            Dietary chat is pinned on screen.
          </span>
          <button
            type="button"
            onClick={() => setIsPinned(false)}
            className="font-semibold text-accent-deep underline underline-offset-4"
          >
            Unpin
          </button>
        </div>

        {/* Fixed floating chat window */}
        <div className="fixed bottom-4 right-4 z-40 flex h-[580px] max-h-[85vh] w-[95vw] flex-col overflow-hidden rounded-lg border border-line bg-surface shadow-2xl animate-in slide-in-from-bottom-5 duration-200 sm:bottom-6 sm:right-6 sm:w-[480px]">
          {chatContent}
        </div>
      </>
    );
  }

  // 3. STANDARD INLINE MODE (With 1-click Full Screen and Pin buttons)
  return (
    <>
      <Card padding="p-0" className={`flex flex-col overflow-hidden ${className}`}>
        {chatContent}
      </Card>

      {/* Floating shortcut to the full screen chat */}
      <button
        type="button"
        onClick={() => setIsFullScreen(true)}
        className="fixed bottom-6 right-6 z-30 flex items-center gap-2 rounded-md border border-paper/15 bg-ink px-4 py-3 text-xs font-semibold text-paper shadow-xl transition-colors hover:bg-ink-soft sm:text-sm"
        title="Open the dietary chat full screen"
      >
        <Bot className="h-4 w-4 text-paper/70" />
        <span>Ask about food</span>
        <Maximize2 className="h-3.5 w-3.5 opacity-60" />
      </button>
    </>
  );
}
