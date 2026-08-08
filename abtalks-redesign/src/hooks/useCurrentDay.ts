import { useState } from "react";

const STORAGE_KEY = "abtalks_currentDay";

export const useCurrentDay = () => {
  const [currentDay, setCurrentDay] = useState<number>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? parseInt(saved, 10) : 13;
  });

  const updateCurrentDay = (newDay: number) => {
    const validatedDay = Math.min(60, Math.max(1, newDay));
    setCurrentDay(validatedDay);
    localStorage.setItem(STORAGE_KEY, validatedDay.toString());
  };

  return { currentDay, setCurrentDay: updateCurrentDay };
};
