import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Trophy, Medal } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Row {
  id: string;
  name: string | null;
  email: string;
  total_score: number;
  stream: string | null;
}

interface Props {
  highlightId?: string;
}

const maskEmail = (e: string) => {
  const [u, d] = e.split("@");
  if (!u || !d) return e;
  return `${u.slice(0, 2)}${"•".repeat(Math.max(1, u.length - 2))}@${d}`;
};

const Leaderboard = ({ highlightId }: Props) => {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("intervu_attempts")
        .select("id, name, email, total_score, stream")
        .order("total_score", { ascending: false })
        .order("created_at", { ascending: false })
        .limit(10);
      setRows((data as Row[]) ?? []);
      setLoading(false);
    })();
  }, [highlightId]);

  return (
    <section id="leaderboard" className="container mx-auto max-w-4xl px-4 py-16">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card text-sm mb-3">
          <Trophy className="h-4 w-4 text-primary" /> Live Leaderboard
        </div>
        <h2 className="font-display text-3xl md:text-4xl font-bold">Top Challengers</h2>
      </div>
      <Card className="overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-muted-foreground">Loading…</div>
        ) : rows.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            Be the first to take the challenge!
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {rows.map((r, i) => {
              const me = r.id === highlightId;
              return (
                <li
                  key={r.id}
                  className={`flex items-center gap-4 p-4 ${
                    me ? "bg-primary/10 border-l-4 border-primary" : ""
                  }`}
                >
                  <div className="w-8 text-center font-bold text-lg">
                    {i === 0 ? <Medal className="text-yellow-500 mx-auto" /> :
                     i === 1 ? <Medal className="text-gray-400 mx-auto" /> :
                     i === 2 ? <Medal className="text-amber-700 mx-auto" /> : `#${i + 1}`}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">
                      {r.name || maskEmail(r.email)} {me && <span className="text-xs text-primary ml-2">(you)</span>}
                    </div>
                    {r.stream && <div className="text-xs text-muted-foreground">{r.stream}</div>}
                  </div>
                  <div className="font-display font-bold text-xl">{r.total_score}</div>
                </li>
              );
            })}
          </ul>
        )}
      </Card>
    </section>
  );
};

export default Leaderboard;
