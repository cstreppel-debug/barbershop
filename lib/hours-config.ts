import type { OpeningHours } from "@/lib/types";

// day_of_week: 0 = zondag, 1 = ma … 6 = za (JS-conventie)

export const DEFAULTS: Omit<OpeningHours, "id">[] = [
  { day_of_week: 1, open_time: "09:00", close_time: "18:00", is_closed: false },
  { day_of_week: 2, open_time: "09:00", close_time: "18:00", is_closed: false },
  { day_of_week: 3, open_time: "09:00", close_time: "18:00", is_closed: false },
  { day_of_week: 4, open_time: "09:00", close_time: "18:00", is_closed: false },
  { day_of_week: 5, open_time: "09:00", close_time: "18:00", is_closed: false },
  { day_of_week: 6, open_time: "09:00", close_time: "17:00", is_closed: false },
  { day_of_week: 0, open_time: "09:00", close_time: "17:00", is_closed: true  },
];

export const DAY_NAMES: Record<number, string> = {
  1: "Maandag",
  2: "Dinsdag",
  3: "Woensdag",
  4: "Donderdag",
  5: "Vrijdag",
  6: "Zaterdag",
  0: "Zondag",
};

export const DAY_ORDER = [1, 2, 3, 4, 5, 6, 0] as const;
