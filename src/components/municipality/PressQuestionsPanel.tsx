import { useState } from "react";
import { Newspaper, Send, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";

interface Props {
  questions: any[];
  canAsk: boolean;
  canAnswer: boolean;
  onAsk: (question: string) => void;
  isSubmitting: boolean;
}

export function PressQuestionsPanel({ questions, canAsk, canAnswer, onAsk, isSubmitting }: Props) {
  const [question, setQuestion] = useState("");

  const handleSubmit = () => {
    if (!question.trim()) return;
    onAsk(question.trim());
    setQuestion("");
  };

  return (
    <div className="rounded-lg border bg-card p-4">
      <div className="flex items-center gap-2 mb-3">
        <Newspaper className="h-4 w-4 text-journalist" />
        <h3 className="text-sm font-semibold text-card-foreground">Press Questions</h3>
        {canAsk && <span className="text-[9px] bg-journalist/10 text-journalist px-1.5 py-0.5 rounded font-semibold ml-auto">PRESS</span>}
      </div>

      {canAsk && (
        <div className="flex gap-2 mb-3">
          <input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Submit a press question..."
            className="flex-1 rounded-md border bg-secondary/30 px-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-journalist"
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          />
          <button
            onClick={handleSubmit}
            disabled={!question.trim() || isSubmitting}
            className="inline-flex items-center gap-1 rounded-md bg-journalist px-3 py-1.5 text-xs font-medium text-journalist-foreground hover:bg-journalist/90 disabled:opacity-50 transition-colors"
          >
            <Send className="h-3 w-3" />
          </button>
        </div>
      )}

      {questions.length === 0 ? (
        <p className="text-xs text-muted-foreground text-center py-4">No press questions submitted yet.</p>
      ) : (
        <div className="space-y-2">
          {questions.map((q: any) => (
            <motion.div
              key={q.id}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className={`rounded-md border p-3 ${q.answer ? "bg-green-500/5 border-green-500/20" : "bg-secondary/30"}`}
            >
              <div className="flex items-start gap-2">
                <MessageCircle className="h-3.5 w-3.5 text-journalist mt-0.5 shrink-0" />
                <div className="flex-1">
                  <p className="text-xs text-card-foreground">{q.question}</p>
                  {q.answer ? (
                    <div className="mt-2 pl-3 border-l-2 border-green-500/30">
                      <p className="text-[11px] text-muted-foreground">{q.answer}</p>
                      <p className="text-[10px] text-muted-foreground/60 mt-1">
                        Answered {q.answered_at ? new Date(q.answered_at).toLocaleDateString() : ""}
                      </p>
                    </div>
                  ) : (
                    <p className="text-[10px] text-yellow-600 mt-1 font-medium">Awaiting response</p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
