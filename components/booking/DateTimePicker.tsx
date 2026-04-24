"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { DayPicker } from "react-day-picker";
import { nl } from "react-day-picker/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getAvailableSlots } from "@/actions/getAvailableSlots";
import { TimeSlotGrid } from "./TimeSlotGrid";
import { cn } from "@/lib/utils";

type Props = {
  serviceId: string;
  barberId: string;
  closedDayNumbers: number[]; // dag-nummers waarop zaak gesloten is (0=zo)
};

function toDateStr(d: Date): string {
  return [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, "0"),
    String(d.getDate()).padStart(2, "0"),
  ].join("-");
}

const TODAY = new Date();
TODAY.setHours(0, 0, 0, 0);

export function DateTimePicker({ serviceId, barberId, closedDayNumbers }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [slots, setSlots] = useState<string[]>([]);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  function handleDaySelect(date: Date | undefined) {
    setSelectedDate(date);
    setSelectedTime(null);
    setSlots([]);

    if (!date) return;

    startTransition(async () => {
      const available = await getAvailableSlots(
        serviceId,
        barberId,
        toDateStr(date)
      );
      setSlots(available);
    });
  }

  function handleNext() {
    if (!selectedDate || !selectedTime) return;
    router.push(
      `/${serviceId}/${barberId}/confirm?date=${toDateStr(selectedDate)}&time=${selectedTime}`
    );
  }

  const isDisabled = (date: Date) =>
    date < TODAY || closedDayNumbers.includes(date.getDay());

  return (
    <div className="space-y-8">
      {/* Kalender */}
      <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm sm:p-6">
        <DayPicker
          mode="single"
          locale={nl}
          selected={selectedDate}
          onSelect={handleDaySelect}
          disabled={isDisabled}
          classNames={{
            root: "w-full",
            months: "w-full",
            month: "w-full space-y-4",
            month_caption: "relative flex items-center justify-center py-1",
            caption_label: "text-sm font-semibold text-neutral-900",
            nav: "absolute inset-x-0 flex items-center justify-between px-1",
            button_previous: cn(
              "flex h-8 w-8 items-center justify-center rounded-lg text-neutral-500",
              "transition-colors hover:bg-neutral-100 hover:text-neutral-900"
            ),
            button_next: cn(
              "flex h-8 w-8 items-center justify-center rounded-lg text-neutral-500",
              "transition-colors hover:bg-neutral-100 hover:text-neutral-900"
            ),
            month_grid: "w-full border-collapse",
            weekdays: "flex",
            weekday:
              "flex-1 pb-2 text-center text-xs font-medium text-neutral-400",
            weeks: "space-y-1",
            week: "flex",
            day: "flex-1 p-0",
            day_button: cn(
              "mx-auto flex h-9 w-9 items-center justify-center rounded-lg",
              "text-sm transition-colors",
              "hover:bg-neutral-100"
            ),
            today: "font-semibold text-neutral-900",
            selected:
              "bg-neutral-900 text-white rounded-lg hover:bg-neutral-800",
            outside: "opacity-0 pointer-events-none",
            disabled: "opacity-30 cursor-not-allowed hover:bg-transparent",
          }}
          components={{
            Chevron: ({ orientation }) =>
              orientation === "left" ? (
                <ChevronLeft size={16} />
              ) : (
                <ChevronRight size={16} />
              ),
          }}
        />
      </div>

      {/* Tijdslots — alleen tonen als een datum is geselecteerd */}
      {selectedDate && (
        <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
          <p className="mb-4 text-sm font-medium text-neutral-500">
            Kies een tijd
          </p>
          <TimeSlotGrid
            slots={slots}
            selected={selectedTime}
            onSelect={setSelectedTime}
            loading={isPending}
          />
        </div>
      )}

      {/* Volgende stap knop */}
      <button
        onClick={handleNext}
        disabled={!selectedDate || !selectedTime}
        className={cn(
          "w-full rounded-2xl py-3.5 text-sm font-semibold transition-colors",
          selectedDate && selectedTime
            ? "bg-neutral-900 text-white hover:bg-neutral-700"
            : "cursor-not-allowed bg-neutral-100 text-neutral-400"
        )}
      >
        Volgende stap
      </button>
    </div>
  );
}
