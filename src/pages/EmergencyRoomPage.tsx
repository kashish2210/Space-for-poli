import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { getAIReply } from "@/services/geminiService";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Send, Loader2, AlertTriangle, ShieldAlert, Activity, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

interface EmergencyMsg {
  $id: string;
  text: string;
  isMe: boolean;
  isAi: boolean;
  userName: string;
  time: string;
}

export default function EmergencyRoomPage() {
  const { cityId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // We use purely local state + localStorage for the demo to ensure it always works reliably
  // Real app would write to Appwrite `emergency_messages` collection
  const [messages, setMessages] = useState<EmergencyMsg[]>([]);
  const [inputText, setInputText] = useState("");
  const [isAiTyping, setIsAiTyping] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const cityName = cityId ? cityId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'Your Area';

  useEffect(() => {
    // Initial welcome message from AI Dispatcher
    setMessages([
      {
        $id: "welcome-1",
        text: `⚠️ **EMERGENCY DISPATCH PROTOCOL INITIATED FOR ${cityName.toUpperCase()}** ⚠️\n\nPlease state the nature of your emergency. Are you safe? Do you need Police, Fire, or Medical assistance?`,
        isMe: false,
        isAi: true,
        userName: "Emergency AI Dispatcher",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  }, [cityName]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputText.trim()) return;

    const text = inputText.trim();
    setInputText("");

    const userName = user?.name || user?.email?.split("@")[0] || "Anonymous Citizen";

    const userMsg: EmergencyMsg = {
      $id: Date.now().toString(),
      text,
      isMe: true,
      isAi: false,
      userName,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setTimeout(() => scrollToBottom(), 100);

    setIsAiTyping(true);
    setTimeout(() => scrollToBottom(), 100);
    
    try {
      const systemPrompt = `You are a strict, calm, and highly professional Emergency AI Dispatcher for the city of ${cityName}. 
      A citizen is reporting an emergency. Your job is to:
      1. Rapidly assess the situation.
      2. Provide immediate, brief survival/triage advice if applicable.
      3. State clearly which theoretical authorities (e.g., ${cityName} Police, nearest Fire Station, or EMS) are being dispatched.
      Keep it brief, authoritative, and helpful. Format with bullet points if providing instructions.`;
      
      const aiResponse = await getAIReply(systemPrompt, text);
      
      if (aiResponse) {
        setMessages(prev => [...prev, {
          $id: `ai-${Date.now()}`,
          text: aiResponse,
          isMe: false,
          isAi: true,
          userName: "Emergency AI Dispatcher",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
      }
    } catch (error) {
      console.error("AI Error:", error);
      setMessages(prev => [...prev, {
          $id: `ai-${Date.now()}`,
          text: "System overload. If this is a life-threatening emergency, please dial your local national emergency number (e.g., 911 or 112) immediately.",
          isMe: false,
          isAi: true,
          userName: "System Error",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
    } finally {
      setIsAiTyping(false);
      setTimeout(() => scrollToBottom(), 100);
    }
  };

  return (
    <div className="flex flex-col h-screen max-h-[calc(100vh-48px)] md:max-h-screen bg-zinc-950 text-slate-100">
      {/* Alert Header */}
      <header className="flex items-center gap-4 p-4 border-b border-red-900/50 bg-red-950/40 backdrop-blur-md sticky top-0 z-10 shrink-0">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="hover:bg-red-900/30 text-slate-300">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-bold text-red-400 flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
            {cityName} Emergency Hub
          </h1>
          <div className="flex items-center gap-4 mt-1 text-xs text-red-300/70 font-mono">
            <span className="flex items-center gap-1">
              <Activity className="h-3 w-3" /> Live Dispatch
            </span>
            <span className="flex items-center gap-1">
              <ShieldAlert className="h-3 w-3" /> Secure Channel
            </span>
          </div>
        </div>
      </header>

      {/* Messages Area - Dark red gradient */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-gradient-to-b from-zinc-950 to-red-950/20 relative">
        <div className="absolute inset-0 z-0 opacity-10 bg-[radial-gradient(#ef4444_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none mix-blend-overlay"></div>
        
        <div className="text-center py-6 mb-4 mt-2 max-w-sm mx-auto relative z-10">
          <div className="h-16 w-16 rounded-full bg-red-900/30 border border-red-500/20 flex items-center justify-center mx-auto mb-4 relative shadow-[0_0_30px_rgba(239,68,68,0.2)]">
            <AlertTriangle className="h-8 w-8 text-red-500" />
            <div className="absolute inset-0 rounded-full border border-red-500/50 animate-ping" style={{ animationDuration: '2s' }} />
          </div>
          <h2 className="text-xl font-bold text-red-50 mb-2 tracking-tight">Emergency Connection</h2>
          <p className="text-sm text-red-200/70">
            You are securely connected to the {cityName} AI Emergency Dispatch system. Describe your emergency below.
          </p>
        </div>

        {messages.map((msg, i) => (
          <motion.div
            key={msg.$id || i}
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className={`flex flex-col max-w-[85%] relative z-10 ${msg.isMe ? "ml-auto" : "mr-auto"}`}
          >
            <div className="flex items-end gap-2 mb-1.5 px-1">
              <span className={`text-xs font-bold uppercase tracking-wider ${msg.isAi ? "text-red-400" : msg.isMe ? "text-slate-300 ml-auto" : "text-slate-400"}`}>
                {msg.isMe ? "You" : msg.userName}
              </span>
              <span className="text-[10px] text-zinc-500 font-mono">
                {msg.time}
              </span>
            </div>
            
            <div
              className={`px-4 py-3 rounded-2xl shadow-sm border ${
                msg.isAi 
                  ? "bg-red-950/40 text-red-50 border-red-900/50 rounded-tl-sm relative overflow-hidden backdrop-blur-sm shadow-[0_4px_20px_-4px_rgba(239,68,68,0.1)]" 
                  : msg.isMe 
                    ? "bg-zinc-800 text-slate-100 border-zinc-700/50 rounded-tr-sm" 
                    : "bg-zinc-900 text-slate-300 border-zinc-800 rounded-tl-sm"
              }`}
            >
              <p className="text-[15px] whitespace-pre-wrap leading-relaxed relative z-10 font-medium">
                {msg.text}
              </p>
            </div>
          </motion.div>
        ))}
        
        {isAiTyping && (
           <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col max-w-[85%] mr-auto relative z-10">
             <div className="flex items-end gap-2 mb-1.5 px-1">
               <span className="text-xs font-bold uppercase tracking-wider text-red-400">Emergency AI Dispatcher</span>
             </div>
             <div className="px-4 py-3.5 rounded-2xl bg-red-950/40 border border-red-900/50 rounded-tl-sm w-fit flex gap-1.5 items-center backdrop-blur-sm">
               <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" style={{ animationDelay: "0ms" }} />
               <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" style={{ animationDelay: "200ms" }} />
               <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" style={{ animationDelay: "400ms" }} />
               <span className="ml-2 text-xs text-red-400/70 font-mono tracking-widest uppercase">Connecting to Local Authorities...</span>
             </div>
           </motion.div>
        )}
        
        <div ref={messagesEndRef} className="h-2" />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-zinc-950 border-t border-red-900/30 sticky bottom-0 z-10 shrink-0">
        <form onSubmit={handleSend} className="max-w-4xl mx-auto flex gap-3 relative">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type your emergency message..."
            className="flex-1 bg-zinc-900 border border-red-900/40 rounded-full pl-5 pr-14 py-4 text-[15px] focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 transition-all font-medium text-slate-100 placeholder:text-zinc-500 shadow-inner"
          />
          <Button 
            type="submit" 
            size="icon" 
            disabled={!inputText.trim() || isAiTyping}
            className="absolute right-2 top-2 h-10 w-10 rounded-full shadow-md bg-red-600 hover:bg-red-500 text-white transition-transform active:scale-95 disabled:opacity-50 disabled:bg-zinc-800"
          >
            <Send className="h-4 w-4 ml-0.5" />
          </Button>
        </form>
        <p className="text-center text-[10px] text-red-400/50 mt-3 font-mono">
          WARNING: FALSE REPORTS MAY BE SUBJECT TO PROSECUTION.
        </p>
      </div>
    </div>
  );
}
