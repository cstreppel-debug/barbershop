import { cn } from "@/lib/utils";

type Props = {
  slots: string[];
  selected: string | null;
  onSelect: (time: string) => void;
  loading?: boolean;
};

export function TimeSlotGrid({ slots, selected, onSelect, loading }: Props) {
  if (loading) {
    return (
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="h-10 animate-pulse rounded-lg bg-neutral-100"
          />
        ))}
      </div>
    );
  }

  if (slots.length === 0) {
    return (
      <p className="text-sm text-neutral-500">
        Geen beschikbare tijden op deze dag.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
      {slots.map((time) => (
        <button
          key={time}
          type="button"
          onClick={() => onSelect(time)}
          className={cn(
            "rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors",
            selected === time
              ? "border-neutral-900 bg-neutral-900 text-white"
              : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-400"
          )}
        >
          {time}
        </button>
      ))}
    </div>
  );
}
