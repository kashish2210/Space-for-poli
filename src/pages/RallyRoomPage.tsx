import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Mic, MicOff, Hand, Users, Volume2, MessageCircle, Share2, MapPin, Landmark, Send, Newspaper, ChevronUp, ChevronDown, Shield, CalendarPlus } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { sendChatMessage, listChatMessages, subscribeToChatMessages } from "@/services/chatService";
import { getAIReply } from "@/services/geminiService";
import { getRallyCalendarUrl } from "@/services/rallyService";
import type { ChatMessageDoc } from "@/integrations/appwrite/collections";

type ParticipantRole = "host" | "speaker" | "journalist" | "listener";

interface Participant {
  id: string;
  name: string;
  role: ParticipantRole;
  isMuted: boolean;
  avatar: string;
  isSpeaking?: boolean;
  handRaised?: boolean;
}

interface ChatMessage {
  id: string;
  author: string;
  role: ParticipantRole;
  text: string;
  timestamp: Date;
}

interface JournalistQuestion {
  id: string;
  author: string;
  text: string;
  timestamp: Date;
  isAnswered: boolean;
}

const rallyData: Record<string, { title: string; host: string; scope: string; scopeType: "city" | "state"; participants: Participant[]; listenerCount: number; topic: string }> = {
  "union-budget-2025": {
    title: "Union Budget Discussion 2025",
    host: "Finance Ministry",
    scope: "National",
    scopeType: "state",
    topic: "Discussing key allocations in Union Budget 2025 — infrastructure, education, and healthcare spending.",
    listenerCount: 12400,
    participants: [
      { id: "1", name: "Dr. Arvind S.", role: "host", isMuted: false, avatar: "AS", isSpeaking: true },
      { id: "2", name: "Priya Mehta", role: "speaker", isMuted: false, avatar: "PM", isSpeaking: false },
      { id: "3", name: "Rajesh Kumar", role: "speaker", isMuted: true, avatar: "RK" },
      { id: "4", name: "Sunita Devi", role: "speaker", isMuted: false, avatar: "SD", isSpeaking: true },
      { id: "5", name: "Ravi Sharma", role: "journalist", isMuted: true, avatar: "RS" },
      { id: "6", name: "Anita Roy", role: "journalist", isMuted: true, avatar: "AR" },
    ],
  },
  "mumbai-clean-city": {
    title: "Clean City Initiative - Mumbai",
    host: "Mumbai Municipal Corp.",
    scope: "Mumbai",
    scopeType: "city",
    topic: "Progress on Mumbai's clean city mission — waste management, beach cleanups, and citizen participation.",
    listenerCount: 890,
    participants: [
      { id: "1", name: "Commissioner Rao", role: "host", isMuted: false, avatar: "CR", isSpeaking: true },
      { id: "2", name: "Anita Shah", role: "speaker", isMuted: false, avatar: "AS" },
      { id: "3", name: "Vikram Patel", role: "speaker", isMuted: true, avatar: "VP" },
      { id: "4", name: "Meera Joshi", role: "journalist", isMuted: true, avatar: "MJ" },
    ],
  },
  "karnataka-infra": {
    title: "Karnataka Infrastructure Summit",
    host: "Karnataka Govt.",
    scope: "Karnataka",
    scopeType: "state",
    topic: "Metro expansion, highway projects, and smart city initiatives across Karnataka.",
    listenerCount: 2100,
    participants: [
      { id: "1", name: "Minister Reddy", role: "host", isMuted: false, avatar: "MR", isSpeaking: true },
      { id: "2", name: "Dr. Lakshmi N.", role: "speaker", isMuted: false, avatar: "LN", isSpeaking: false },
      { id: "3", name: "Sunil Rao", role: "journalist", isMuted: true, avatar: "SR" },
    ],
  },
};

const fallbackRally = {
  title: "Rally Room",
  host: "JanVaani",
  scope: "National",
  scopeType: "state" as const,
  topic: "Open discussion on governance and civic issues.",
  listenerCount: 0,
  participants: [{ id: "0", name: "Host", role: "host" as const, isMuted: false, avatar: "H", isSpeaking: true }],
};

const listenerNames = [
  "Amit K.", "Neha R.", "Pooja D.", "Kiran M.", "Suresh P.", "Deepa L.", "Rohit S.", "Meena T.",
  "Arun V.", "Geeta B.", "Vijay N.", "Sana Q.", "Manoj W.", "Ritu C.", "Harsh G.", "Divya F.",
];

const initialMessages: ChatMessage[] = [
  { id: "m1", author: "Amit K.", role: "listener", text: "Great discussion! When will the budget allocations be finalized?", timestamp: new Date(Date.now() - 300000) },
  { id: "m2", author: "Neha R.", role: "listener", text: "What about rural healthcare funding?", timestamp: new Date(Date.now() - 240000) },
  { id: "m3", author: "Dr. Arvind S.", role: "host", text: "We'll address healthcare next. Stay tuned.", timestamp: new Date(Date.now() - 180000) },
  { id: "m4", author: "Kiran M.", role: "listener", text: "Education budget seems lower than expected.", timestamp: new Date(Date.now() - 60000) },
];

const initialQuestions: JournalistQuestion[] = [
  { id: "q1", author: "Ravi Sharma", text: "Can you elaborate on the infrastructure allocation for tier-2 cities?", timestamp: new Date(Date.now() - 200000), isAnswered: false },
  { id: "q2", author: "Anita Roy", text: "What steps are being taken to ensure transparency in fund disbursement?", timestamp: new Date(Date.now() - 120000), isAnswered: true },
];

// Current user is a listener by default
const CURRENT_USER_ROLE: ParticipantRole = "listener";
const IS_HOST = false;

function getRallyIdSlug(id: string | undefined): string {
  return id || "unknown";
}

function roleBorderColor(role: ParticipantRole) {
  switch (role) {
    case "host": return "border-rally";
    case "speaker": return "border-primary";
    case "journalist": return "border-journalist";
    default: return "border-border";
  }
}

function roleBadge(role: ParticipantRole) {
  switch (role) {
    case "host": return <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-full bg-rally/20 text-rally">Host</span>;
    case "speaker": return <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-full bg-primary/20 text-primary">Speaker</span>;
    case "journalist": return <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-full bg-journalist/20 text-journalist flex items-center gap-0.5"><Newspaper className="h-2.5 w-2.5" />Press</span>;
    default: return null;
  }
}

function formatTime(date: Date) {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function RallyRoomPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const rally = rallyData[id || ""] || { ...fallbackRally, title: id?.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) || "Rally Room" };

  const [handRaised, setHandRaised] = useState(false);
  const [activeTab, setActiveTab] = useState<"chat" | "press">("chat");
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [questions] = useState<JournalistQuestion[]>(initialQuestions);
  const [chatInput, setChatInput] = useState("");
  const [panelOpen, setPanelOpen] = useState(true);
  const [isAiTyping, setIsAiTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const speakers = rally.participants.filter((p) => p.role === "host" || p.role === "speaker");
  const journalists = rally.participants.filter((p) => p.role === "journalist");
  const raisedHands = rally.participants.filter((p) => p.role === "listener" && (p as any).handRaised);

  const rallySlug = getRallyIdSlug(id);

  // Load persisted chat messages from DB
  useEffect(() => {
    listChatMessages(rallySlug).then((docs) => {
      if (docs.length > 0) {
        const dbMessages: ChatMessage[] = docs.map((d) => ({
          id: d.$id,
          author: d.user_name,
          role: d.role as ParticipantRole,
          text: d.text,
          timestamp: new Date(d.$createdAt),
        }));
        setMessages((prev) => {
          // Merge: keep initial demo messages + append DB messages
          const ids = new Set(dbMessages.map((m) => m.id));
          const filtered = prev.filter((m) => !ids.has(m.id));
          return [...filtered, ...dbMessages].sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
        });
      }
    });
  }, [rallySlug]);

  // Subscribe to new messages in realtime
  useEffect(() => {
    const unsub = subscribeToChatMessages(rallySlug, (doc: ChatMessageDoc) => {
      const newMsg: ChatMessage = {
        id: doc.$id,
        author: doc.user_name,
        role: doc.role as ParticipantRole,
        text: doc.text,
        timestamp: new Date(doc.$createdAt),
      };
      setMessages((prev) => {
        if (prev.some((m) => m.id === newMsg.id)) return prev;
        return [...prev, newMsg];
      });
    });
    return () => unsub();
  }, [rallySlug]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!chatInput.trim()) return;
    const text = chatInput.trim();
    setChatInput("");

    if (user) {
      const userName = user.name || user.email?.split('@')[0] || 'User';
      try {
        await sendChatMessage(rallySlug, user.$id, userName, CURRENT_USER_ROLE, text);

        // Optional AI Auto-Reply (e.g., if tagged or 50% chance for demo)
        if (text.toLowerCase().includes("ai") || text.endsWith("?") || Math.random() > 0.5) {
          setIsAiTyping(true);
          try {
            const aiResponse = await getAIReply(
              `You are an expert civic AI panelist in a Rally Room about "${rally.topic}". The user ${userName} asks/says: "${text}". Keep it very brief and directly address the point.`,
              text
            );
            if (aiResponse) {
              await sendChatMessage(rallySlug, "gemini-ai-bot", "Rally AI Moderator", "speaker", aiResponse);
            }
          } catch (e) {
            console.error("AI reply failed", e);
          } finally {
            setIsAiTyping(false);
          }
        }
      } catch {
        // Fallback to local-only if DB fails
        setMessages((prev) => [
          ...prev,
          { id: `m${Date.now()}`, author: "You", role: CURRENT_USER_ROLE, text, timestamp: new Date() },
        ]);
      }
    } else {
      setMessages((prev) => [
        ...prev,
        { id: `m${Date.now()}`, author: "You", role: CURRENT_USER_ROLE, text, timestamp: new Date() },
      ]);
    }
  };

  const calendarUrl = getRallyCalendarUrl(rally.title, rally.topic, rallySlug);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container flex items-center gap-3 py-3">
          <Link to="/rallies" className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="flex-1 min-w-0">
            <h1 className="text-sm font-semibold truncate">{rally.title}</h1>
            <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
              <span className="flex items-center gap-1">
                {rally.scopeType === "city" ? <MapPin className="h-3 w-3" /> : <Landmark className="h-3 w-3" />}
                {rally.scope}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Users className="h-3 w-3" /> {rally.listenerCount.toLocaleString()} listening
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <a
              href={calendarUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-primary bg-primary/10 hover:bg-primary/20 px-2.5 py-1 rounded-full transition-colors mr-2"
              title="Add to Google Calendar"
            >
              <CalendarPlus className="h-3 w-3" /> Remind Me
            </a>
            <span className="relative flex h-2 w-2">
              <span className="animate-pulse-ring absolute inline-flex h-full w-full rounded-full bg-rally opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rally" />
            </span>
            <span className="text-[10px] font-bold text-rally uppercase tracking-wider">Live</span>
          </div>
        </div>
      </div>

      <div className="container flex-1 py-6 space-y-6">
        {/* Topic */}
        <div className="rounded-lg bg-card border border-border p-4">
          <p className="text-sm text-card-foreground leading-relaxed">{rally.topic}</p>
          <p className="text-[11px] text-muted-foreground mt-2">Hosted by <span className="text-primary font-medium">{rally.host}</span></p>
        </div>

        {/* Listener notice */}
        <div className="rounded-lg bg-secondary/50 border border-border px-4 py-3 flex items-center gap-3">
          <MicOff className="h-4 w-4 text-muted-foreground shrink-0" />
          <p className="text-xs text-muted-foreground">
            You're listening. Raise your hand to request to speak — the host will grant access.
          </p>
        </div>

        {/* Speakers section */}
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
            Speakers · {speakers.length}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
            {speakers.map((s, i) => (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className="flex flex-col items-center gap-2"
              >
                <div className="relative">
                  <div className={`h-16 w-16 rounded-full border-2 ${roleBorderColor(s.role)} flex items-center justify-center text-sm font-bold ${s.isSpeaking ? "ring-2 ring-rally ring-offset-2 ring-offset-background" : ""} bg-secondary text-secondary-foreground transition-all`}>
                    {s.avatar}
                  </div>
                  {s.isMuted && (
                    <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-card border border-border flex items-center justify-center">
                      <MicOff className="h-3 w-3 text-muted-foreground" />
                    </div>
                  )}
                  {s.isSpeaking && !s.isMuted && (
                    <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-rally flex items-center justify-center">
                      <Volume2 className="h-3 w-3 text-rally-foreground" />
                    </div>
                  )}
                </div>
                <div className="text-center space-y-0.5">
                  <p className="text-xs font-medium truncate max-w-[80px]">{s.name}</p>
                  {roleBadge(s.role)}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Journalists section */}
        {journalists.length > 0 && (
          <section>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-journalist mb-3 flex items-center gap-1.5">
              <Newspaper className="h-3.5 w-3.5" /> Press · {journalists.length}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
              {journalists.map((j, i) => (
                <motion.div
                  key={j.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex flex-col items-center gap-2"
                >
                  <div className="relative">
                    <div className={`h-14 w-14 rounded-full border-2 border-journalist flex items-center justify-center text-sm font-bold bg-journalist/10 text-journalist transition-all`}>
                      {j.avatar}
                    </div>
                    <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-journalist flex items-center justify-center">
                      <Newspaper className="h-3 w-3 text-journalist-foreground" />
                    </div>
                  </div>
                  <div className="text-center space-y-0.5">
                    <p className="text-xs font-medium truncate max-w-[80px]">{j.name}</p>
                    {roleBadge("journalist")}
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* Raised hands — visible to host */}
        {IS_HOST && raisedHands.length > 0 && (
          <section>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-primary mb-3 flex items-center gap-1.5">
              <Hand className="h-3.5 w-3.5" /> Raised Hands · {raisedHands.length}
            </h2>
            <div className="space-y-2">
              {raisedHands.map((p) => (
                <div key={p.id} className="flex items-center gap-3 rounded-lg bg-card border border-border px-4 py-2.5">
                  <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center text-xs font-bold text-secondary-foreground">{p.avatar}</div>
                  <span className="text-sm flex-1">{p.name}</span>
                  <button className="text-[10px] font-semibold uppercase px-3 py-1 rounded-full bg-primary text-primary-foreground hover:opacity-90 transition-opacity flex items-center gap-1">
                    <Shield className="h-3 w-3" /> Allow to Speak
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Listeners */}
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
            Listeners · {rally.listenerCount.toLocaleString()}
          </h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-8 gap-3">
            {listenerNames.map((name, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 + i * 0.02 }}
                className="flex flex-col items-center gap-1.5"
              >
                <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-[10px] font-semibold text-muted-foreground">
                  {name.split(" ").map(n => n[0]).join("")}
                </div>
                <p className="text-[10px] text-muted-foreground truncate max-w-[60px]">{name}</p>
              </motion.div>
            ))}
            <div className="flex flex-col items-center gap-1.5">
              <div className="h-10 w-10 rounded-full bg-muted/50 flex items-center justify-center text-[10px] text-muted-foreground">
                +{(rally.listenerCount - listenerNames.length).toLocaleString()}
              </div>
              <p className="text-[10px] text-muted-foreground">more</p>
            </div>
          </div>
        </section>

        {/* Chat & Press Questions Panel */}
        <section className="rounded-lg border border-border bg-card overflow-hidden">
          <button
            onClick={() => setPanelOpen(!panelOpen)}
            className="w-full flex items-center justify-between px-4 py-3 hover:bg-secondary/30 transition-colors"
          >
            <div className="flex items-center gap-4">
              <button
                onClick={(e) => { e.stopPropagation(); setActiveTab("chat"); setPanelOpen(true); }}
                className={`text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-colors ${activeTab === "chat" ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}
              >
                <MessageCircle className="h-3.5 w-3.5" /> Chat
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); setActiveTab("press"); setPanelOpen(true); }}
                className={`text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-colors ${activeTab === "press" ? "text-journalist" : "text-muted-foreground hover:text-journalist"}`}
              >
                <Newspaper className="h-3.5 w-3.5" /> Press Questions
                {questions.filter(q => !q.isAnswered).length > 0 && (
                  <span className="inline-flex items-center justify-center rounded-full bg-journalist text-journalist-foreground text-[9px] font-bold min-w-[14px] h-[14px] px-1">
                    {questions.filter(q => !q.isAnswered).length}
                  </span>
                )}
              </button>
            </div>
            {panelOpen ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronUp className="h-4 w-4 text-muted-foreground" />}
          </button>

          <AnimatePresence>
            {panelOpen && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: "auto" }}
                exit={{ height: 0 }}
                className="overflow-hidden"
              >
                {activeTab === "chat" ? (
                  <div className="flex flex-col">
                    <div className="h-64 overflow-y-auto px-4 py-3 space-y-3">
                      {messages.map((msg) => (
                        <div key={msg.id} className="flex gap-2.5">
                          <div className={`h-7 w-7 rounded-full shrink-0 flex items-center justify-center text-[9px] font-bold ${msg.role === "host" ? "bg-rally/20 text-rally" : msg.role === "journalist" ? "bg-journalist/20 text-journalist" : "bg-secondary text-secondary-foreground"}`}>
                            {msg.author.split(" ").map(n => n[0]).join("").slice(0, 2)}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className={`text-xs font-semibold ${msg.role === "host" ? "text-rally" : msg.role === "journalist" ? "text-journalist" : "text-foreground"}`}>{msg.author}</span>
                              {msg.role !== "listener" && roleBadge(msg.role)}
                              <span className="text-[10px] text-muted-foreground">{formatTime(msg.timestamp)}</span>
                            </div>
                            <p className="text-sm text-card-foreground mt-0.5">{msg.text}</p>
                          </div>
                        </div>
                      ))}
                      {isAiTyping && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2.5 items-center">
                          <div className="h-7 w-7 rounded-full shrink-0 flex items-center justify-center text-[9px] font-bold bg-indigo-500/20 text-indigo-400">
                            AI
                          </div>
                          <div className="flex gap-1">
                            <span className="h-1.5 w-1.5 rounded-full bg-indigo-400/60 animate-bounce" style={{ animationDelay: "0ms" }} />
                            <span className="h-1.5 w-1.5 rounded-full bg-indigo-400/60 animate-bounce" style={{ animationDelay: "150ms" }} />
                            <span className="h-1.5 w-1.5 rounded-full bg-indigo-400/60 animate-bounce" style={{ animationDelay: "300ms" }} />
                          </div>
                        </motion.div>
                      )}
                      <div ref={chatEndRef} />
                    </div>
                    <div className="border-t border-border px-4 py-3 flex gap-2">
                      <input
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                        placeholder="Send a message…"
                        className="flex-1 bg-secondary rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                      />
                      <button
                        onClick={sendMessage}
                        disabled={!chatInput.trim()}
                        className="h-9 w-9 rounded-lg bg-primary text-primary-foreground flex items-center justify-center hover:opacity-90 transition-opacity disabled:opacity-40"
                      >
                        <Send className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="px-4 py-3 space-y-3 max-h-80 overflow-y-auto">
                    {questions.length === 0 ? (
                      <p className="text-xs text-muted-foreground text-center py-6">No press questions yet.</p>
                    ) : (
                      questions.map((q) => (
                        <div key={q.id} className={`rounded-lg border px-4 py-3 ${q.isAnswered ? "border-border bg-secondary/30 opacity-60" : "border-journalist/30 bg-journalist/5"}`}>
                          <div className="flex items-center gap-2 mb-1.5">
                            <Newspaper className="h-3 w-3 text-journalist" />
                            <span className="text-xs font-semibold text-journalist">{q.author}</span>
                            <span className="text-[10px] text-muted-foreground">{formatTime(q.timestamp)}</span>
                            {q.isAnswered && <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-full bg-online/20 text-online ml-auto">Answered</span>}
                          </div>
                          <p className="text-sm text-card-foreground">{q.text}</p>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </div>

      {/* Bottom control bar */}
      <div className="sticky bottom-0 border-t border-border bg-card/95 backdrop-blur-sm">
        <div className="container flex items-center justify-between py-3">
          <Link
            to="/rallies"
            className="flex items-center gap-1.5 rounded-full bg-secondary px-4 py-2 text-xs font-medium text-secondary-foreground hover:bg-secondary/80 transition-colors"
          >
            ✌️ Leave quietly
          </Link>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setHandRaised(!handRaised)}
              className={`h-10 w-10 rounded-full flex items-center justify-center transition-colors ${handRaised ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"}`}
              title={handRaised ? "Lower hand" : "Raise hand to speak"}
            >
              <Hand className="h-4 w-4" />
            </button>
            {/* Mic button — disabled for listeners */}
            <div className="relative group">
              <button
                disabled
                className="h-10 w-10 rounded-full flex items-center justify-center bg-destructive/30 text-destructive cursor-not-allowed"
                title="Only speakers can use the microphone"
              >
                <MicOff className="h-4 w-4" />
              </button>
              <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden group-hover:block bg-popover text-popover-foreground text-[10px] px-2 py-1 rounded shadow-lg whitespace-nowrap border border-border">
                Raise hand to request mic access
              </div>
            </div>
            <button
              onClick={() => { setPanelOpen(true); setActiveTab("chat"); }}
              className="h-10 w-10 rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/80 flex items-center justify-center transition-colors"
              title="Chat"
            >
              <MessageCircle className="h-4 w-4" />
            </button>
            <button className="h-10 w-10 rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/80 flex items-center justify-center transition-colors" title="Share">
              <Share2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
