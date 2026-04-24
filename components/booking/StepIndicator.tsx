import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = [
  { label: "Behandeling" },
  { label: "Kapper" },
  { label: "Datum & tijd" },
  { label: "Bevestiging" },
];

export function StepIndicator({ current }: { current: 1 | 2 | 3 | 4 }) {
  return (
    <nav aria-label="Boekingsstappen" className="mb-10">
      <ol className="flex items-center gap-0">
        {STEPS.map((step, index) => {
          const number = index + 1;
          const done = number < current;
          const active = number === current;

          return (
            <li key={step.label} className="flex flex-1 items-center">
              {/* Step bubble + label */}
              <div className="flex flex-col items-center gap-1.5">
                <span
                  className={cn(
                    "flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold transition-colors",
                    done && "bg-neutral-900 text-white",
                    active && "bg-neutral-900 text-white ring-4 ring-neutral-100",
                    !done && !active && "bg-neutral-100 text-neutral-400"
                  )}
                >
                  {done ? <Check size={13} strokeWidth={2.5} /> : number}
                </span>
                <span
                  className={cn(
                    "hidden text-[11px] font-medium sm:block",
                    active ? "text-neutral-900" : "text-neutral-400"
                  )}
                >
                  {step.label}
                </span>
              </div>

              {/* Connector line — skip after last step */}
              {index < STEPS.length - 1 && (
                <div
                  className={cn(
                    "mx-1 mb-5 h-px flex-1 transition-colors sm:mx-2",
                    done ? "bg-neutral-900" : "bg-neutral-200"
                  )}
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
