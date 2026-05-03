import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { Clock } from "lucide-react";

interface Props {
  seconds: number;
  onExpire: () => void;
  paused?: boolean;
}

const Timer = ({ seconds, onExpire, paused }: Props) => {
  const [left, setLeft] = useState(seconds);

  useEffect(() => {
    setLeft(seconds);
  }, [seconds]);

  useEffect(() => {
    if (paused) return;
    if (left <= 0) {
      onExpire();
      return;
    }
    const t = setTimeout(() => setLeft((l) => l - 1), 1000);
    return () => clearTimeout(t);
  }, [left, paused, onExpire]);

  const pct = (left / seconds) * 100;
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm font-medium">
        <span className="flex items-center gap-1.5 text-muted-foreground">
          <Clock className="h-4 w-4" /> Time left
        </span>
        <span className={left < 15 ? "text-destructive" : ""}>
          {Math.floor(left / 60)}:{String(left % 60).padStart(2, "0")}
        </span>
      </div>
      <Progress value={pct} className="h-1.5" />
    </div>
  );
};

export default Timer;
