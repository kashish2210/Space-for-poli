import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { sendQAMessage, listQAMessages, subscribeToQAMessages } from "@/services/qaMessageService";
import { getAIReply } from "@/services/geminiService";
import type { QAMessageDoc } from "@/integrations/appwrite/collections";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Send, Loader2, Users, AlertCircle, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function QASessionPage() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [messages, setMessages] = useState<QAMessageDoc[]>([]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(true);
  const [isAiTyping, setIsAiTyping] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sessionId) return;
    
    listQAMessages(sessionId).then(docs => {
      setMessages(docs);
      setLoading(false);
      setTimeout(() => scrollToBottom(), 100);
    });

    const unsub = subscribeToQAMessages(sessionId, (newMsg) => {
      setMessages(prev => {
        if (prev.some(m => m.$id === newMsg.$id)) return prev;
        return [...prev, newMsg];
      });
      setTimeout(() => scrollToBottom(), 100);
    });

    return () => unsub();
  }, [sessionId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputText.trim() || !user || !sessionId) return;

    const text = inputText.trim();
    setInputText("");

    try {
      const userName = user.name || user.email?.split("@")[0] || "User";
      await sendQAMessage(sessionId, user.$id, userName, text);

      // AI auto-reply logic (for Q&A, maybe always reply to questions?)
      if (text.endsWith("?") || Math.random() > 0.3) {
        setIsAiTyping(true);
        setTimeout(() => scrollToBottom(), 100);
        
        try {
          const aiResponse = await getAIReply(
            `You are an official representative or civic expert in a Live Q&A session (Session ID: ${sessionId}). User ${userName} asks: "${text}". Provide a helpful and concise answer.`,
            text
          );
          
          if (aiResponse) {
            await sendQAMessage(sessionId, "gemini-ai-bot", "Q&A AI Assistant", aiResponse, true);
          }
        } catch (error) {
          console.error("AI Error:", error);
        } finally {
          setIsAiTyping(false);
          setTimeout(() => scrollToBottom(), 100);
        }
      }
    } catch (err) {
      console.error("Failed to send message", err);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-background">
      {/* Header */}
      <header className="flex items-center gap-4 p-4 border-b border-border/50 bg-card/50 backdrop-blur-md sticky top-0 z-10 glass-panel">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="hover:bg-accent/10">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-bold text-foreground truncate flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
            Live Q&A Session
          </h1>
          <div className="flex items-center gap-4 mt-0.5">
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Users className="h-3 w-3" /> Live
            </span>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <AlertCircle className="h-3 w-3" /> Official Panel
            </span>
          </div>
        </div>
      </header>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-gradient-to-b from-background to-background/50 relative">
        <div className="absolute inset-0 z-0 opacity-[0.02] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>
        
        <div className="text-center py-6 mb-4 mt-2 max-w-md mx-auto relative z-10">
          <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-3">
            <Users className="h-6 w-6 text-primary" />
          </div>
          <h2 className="text-lg font-medium text-foreground mb-2">Welcome to the Q&A!</h2>
          <p className="text-sm text-muted-foreground">Ask your questions and get real-time answers from officials and our AI assistant.</p>
        </div>

        {messages.map((msg, i) => {
          const isMe = user && msg.user_id === user.$id;
          const isAi = msg.is_ai || msg.user_id === "gemini-ai-bot";
          
          return (
            <motion.div
              key={msg.$id || i}
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className={`flex flex-col max-w-[85%] relative z-10 ${isMe ? "ml-auto" : "mr-auto"}`}
            >
              <div className="flex items-end gap-2 mb-1">
                <span className={`text-xs font-medium ${isAi ? "text-indigo-400" : isMe ? "text-primary ml-auto" : "text-card-foreground"}`}>
                  {isMe ? "You" : msg.user_name}
                </span>
                <span className="text-[10px] text-muted-foreground tabular-nums opacity-60">
                  {new Date(msg.$createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              
              <div
                className={`px-4 py-2.5 rounded-2xl shadow-sm ${
                  isAi 
                    ? "bg-indigo-500/10 text-indigo-100 border border-indigo-500/20 rounded-tl-sm relative overflow-hidden" 
                    : isMe 
                      ? "bg-primary text-primary-foreground rounded-tr-sm" 
                      : "bg-card text-card-foreground border border-border/50 rounded-tl-sm"
                }`}
              >
                {isAi && (
                  <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-indigo-500/20 to-transparent blur-xl pointer-events-none" />
                )}
                <p className="text-[15px] whitespace-pre-wrap leading-relaxed relative z-10">{msg.text}</p>
              </div>
            </motion.div>
          );
        })}
        
        {isAiTyping && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col max-w-[85%] mr-auto relative z-10">
             <div className="flex items-end gap-2 mb-1">
                <span className="text-xs font-medium text-indigo-400">Q&A AI Assistant</span>
              </div>
            <div className="px-4 py-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 rounded-tl-sm w-fit flex gap-1.5 items-center">
              <Sparkles className="h-3 w-3 text-indigo-400 mr-1" />
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-400/60 animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-400/60 animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-400/60 animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          </motion.div>
        )}
        
        <div ref={messagesEndRef} className="h-1" />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-card/80 backdrop-blur-md border-t border-border/50 sticky bottom-0 z-10 glass-panel">
        <form onSubmit={handleSend} className="max-w-4xl mx-auto flex gap-3 relative">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ask a question..."
            disabled={!user}
            className="flex-1 bg-background/50 border border-border/50 rounded-full pl-5 pr-12 py-3.5 text-[15px] focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium text-foreground placeholder:text-muted-foreground/70"
          />
          <Button 
            type="submit" 
            size="icon" 
            disabled={!inputText.trim() || !user}
            className="absolute right-2 top-1.5 h-10 w-10 rounded-full shadow-md bg-primary hover:bg-primary/90 transition-transform active:scale-95"
          >
            <Send className="h-4 w-4 ml-0.5" />
          </Button>
        </form>
      </div>
    </div>
  );
}
